<template>
  <div class="common-page-container">
    <div class="common-page-head">
      <div class="flex col-center">
        <svg-icon icon-class="back" class="f-s-24 m-r-8 pointer" @click="routerBack" />
        <div class="lg f-w-700">新建客户欢迎语</div>
      </div>
      <el-button type="success" :disabled="state.selectList.length < 1" @click="submit">保存</el-button>
    </div>

    <div class="common-page-body">
      <div class="content-body">
        <div class="left">
          <div class="m-b-12">
            <el-button text bg type="success" @click="state.materialDialog = true">
              <svg-icon icon-class="add-custom" class="f-s-24" />
              选择素材
            </el-button>
          </div>
          <xz-editor
            v-model:value="state.editData"
            class="m-b-12"
            :disabled="false"
            :toolsSetting="['emoji', 'insertNickname']"
            @change="changeEditData"
          />
          <selected-material :is-preview="true" :selectList="state.selectList" @cancel="onCancel" />
        </div>
        <div class="rigth">
          <div class="chat-tmeplate">
            <chat-template
              :info="state.selectList.map((s) => JSON.parse(s.contentDetail))"
              v-bind="$attrs"
              :show-edit="true"
              :has-test-send-btn="false"
            />
          </div>
        </div>
      </div>
    </div>

    <material-selector
      v-model:visible="state.materialDialog"
      :loading="useMaterial.loading"
      :materialTypes="materialTypes"
      :type="state.materialType"
      :restrict-config="restrictConfig"
      :page-size="useMaterial.paging.pageSize"
      :total-page="useMaterial.paging.totalPage"
      :groups="useMaterial.groups"
      :data-list="useMaterial.materialDataList"
      :select-data-list="state.selectList"
      @get-data="getMaterialData"
      @close="close"
      @submit="changeMaterialData"
    />
  </div>
</template>

<script lang="ts" setup>
import { useElement } from "@/hooks/global/useElement"
import { useVueRouter } from "@/hooks/global/useVueRouter"
import XzEditor from "@/components/XzComm/XzEditor/index.vue"
import SelectedMaterial from "@/components/MaterialSelector/selected.vue"
import MaterialSelector, { MaterialObj } from "@/components/MaterialSelector/index.vue"
import ChatTemplate from "@/components/ChatTemplate/index.vue"
import { CUSTOMER_SPEECH, STATUS_SUCCESS } from "@/constent/globalConstant"
import { ObjTy } from "~/common"
import { restrictConfig } from "../config"
import { useMaterialStore, GroupTy, ContentTy } from "@/store/material"
import { getDataByCache } from "@/utils/cache"
import WelcomeSpeechApi from "@/api/pullDrainage/welcomeSpeech"
import { param } from "@/utils"
const api = new WelcomeSpeechApi()
const { elNotify } = useElement()
const { routerPush, routerBack, getQueryParam } = useVueRouter()

const materialTypes = ["image", "text", "miniprogrampage", "news"]
const useMaterial = useMaterialStore()

type stateTy = {
  editData: string
  materialDialog: boolean
  materialType: string
  selectList: Array<ObjTy>
  materialDataList: Array<ObjTy>
  groups: Array<ObjTy>

  groupParams: GroupTy
  listParams: ContentTy
}

const state = reactive<stateTy>({
  editData: "",
  materialDialog: false,
  materialType: materialTypes[0],
  selectList: [],
  materialDataList: [],
  groups: [],

  groupParams: {
    type: "",
    isMe: false,
    picType: "",
    wechatId: 0
  },
  listParams: {
    keyword: "",
    groupId: -1,
    userId: "",
    type: materialTypes[0],
    picType: "",
    wechatId: ""
  }
})

function changeMaterialData(val: Array<ObjTy>) {
  state.selectList = val

  const textArr = val.filter((v) => v.contentType === "text")
  const content = textArr.length > 0 ? JSON.parse(textArr[0].contentDetail).content : ""

  state.editData = content && typeof content === "object" ? JSON.stringify(content) : content
  useMaterial.loading = false
}

function getMaterialData(val: MaterialObj) {
  const { currentPage, groupType, groupId, type, search } = val

  if (currentPage) {
    useMaterial.paging.currentPage = currentPage
  }

  state.materialType = type
  state.groupParams.isMe = groupType !== "pub" ? true : false
  state.groupParams.type = type

  state.listParams.userId = groupType !== "pub" ? getDataByCache("userId") : ""
  state.listParams.keyword = search
  state.listParams.groupId = groupId
  state.listParams.type = type
  init()
}

function close() {
  state.materialDialog = false
  useMaterial.loading = false
}

const onCancel = (val: ObjTy) => {
  var index = state.selectList.findIndex((i) => i.contentType == val.contentType && i.id === val.id)
  if (index != -1) {
    state.selectList.splice(index, 1)
  }

  if (isMultipleText()) return
  if (val.contentType === "text") state.editData = ""
}

// 是否有多个文本
function isMultipleText() {
  return state.selectList.filter((s) => s.contentType === "text").length > 1
}

// 当只有一个文本时，回显编辑框，编辑框修改后，选择的数据实时修改
function changeEditData(val) {
  if (!val || isMultipleText()) return

  state.selectList.map((s) => {
    if (s.contentType === "text") {
      let textStr = JSON.parse(s.contentDetail)
      textStr.content = JSON.parse(val)
      s.contentDetail = JSON.stringify(textStr)
    }
    return s
  })
}

function submit() {
  if (state.selectList.length <= 0) return

  const selectData = state.selectList.map((s) => {
    let content = JSON.parse(s.contentDetail)
    if (content.content) {
      content.content = JSON.stringify(content.content)
    }
    return content
  })

  const data: ObjTy = {
    leadingWords: JSON.stringify(selectData)
  }

  const param = getQueryParam()
  if (param?.id) {
    data.id = param.id
    update(data)
  } else {
    add(data)
  }
}

async function add(data) {
  const resp = await api.addCustomer(param(data))
  const { status } = resp
  if (status === STATUS_SUCCESS) {
    elNotify("添加成功！", "success")
    routerPush(CUSTOMER_SPEECH)
  } else {
    elNotify("添加失败！", "warning")
  }
}

async function update(data) {
  const resp = await api.updateCustomer(param(data))
  const { status } = resp
  if (status === STATUS_SUCCESS) {
    routerPush(CUSTOMER_SPEECH)
    elNotify("修改成功！", "success")
  } else {
    elNotify("修改失败！", "warning")
  }
}

function init() {
  useMaterial.getGroups(state.groupParams)
  useMaterial.getContentList(state.listParams)
}

async function editEcho() {
  const param = getQueryParam()
  if (param?.id) {
    const resp = await api.getCustomerById(param.id)
    const { status, data } = resp
    if (status === STATUS_SUCCESS) {
      const sourceData = JSON.parse(data.content)
      const contentData = sourceData.map((s) => {
        return {
          contentName: s.name,
          contentType: s.type,
          contentDetail: JSON.stringify(s)
        }
      })
      changeMaterialData(contentData)
    }
  }
}
init()
editEcho()
</script>

<style lang="scss" scoped>
.common-page-head {
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid $border-color-base;
  margin-bottom: 10px;
}
.content-body {
  display: flex;
  .left {
    width: 60%;
    padding: 0 20px 20px 0;
  }

  .rigth {
    flex: 1;
  }
}
</style>
