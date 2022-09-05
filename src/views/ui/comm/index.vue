<template>
  <div class="common-page-container">
    <div class="common-page-head">
      <span class="com-title">公共样式组件</span>
    </div>
    <div class="common-page-body">
      <h1>通用样式</h1>
      <el-collapse v-model="activeNames">
        <el-collapse-item title="1.整体页面样式" name="1">
          <el-descriptions border>
            <el-descriptions-item label=" 页面整体">common-page-container</el-descriptions-item>
            <el-descriptions-item label="页头">common-page-head</el-descriptions-item>
            <el-descriptions-item label="页面标题">common-page-title</el-descriptions-item>
            <el-descriptions-item label="页面身体">common-page-body</el-descriptions-item>
            <el-descriptions-item label="主题色">$color-primary: #2749F1</el-descriptions-item>
            <el-descriptions-item label="默认字号">13px</el-descriptions-item>
          </el-descriptions>
        </el-collapse-item>
        <el-collapse-item title="2.抽屉样式" name="2">
          <el-descriptions border>
            <el-descriptions-item label="抽屉整体">common-drawer-container</el-descriptions-item>
            <el-descriptions-item label="抽屉内容">common-drawer-body</el-descriptions-item>
            <el-descriptions-item label="抽屉按钮">common-drawer-footer</el-descriptions-item>
            <el-descriptions-item label="注意点">给确定/保存按钮加loading状态</el-descriptions-item>
          </el-descriptions>
        </el-collapse-item>
      </el-collapse>

      <h5>备注：</h5>
      <p>1.尽量少写全局样式，避免覆盖他人代码，如有修改通用样式，请确定不影响其他模块</p>
      <p>2.模块/组件通用样式请在各自模块里使用deep属性进行样式穿透，避免style/index.scss里代码过于复杂</p>

      <div class="m-b-50">
        <div class="m-b-8">示例:</div>
        <el-button plain @click="previewDialog = true">打开预览</el-button>
        <el-button type="success" @click="uploadDialog = true">上传图片</el-button>

        <el-button type="primary" @click="materialDialog = true">选择素材</el-button>
        <el-button plain @click="copyText('asdf')">
          <svg-icon icon-class="line" style="font-size: 24px; margin-right: 4px" />
          复制
        </el-button>

        <el-button @click="drawerShow = true">打开抽屉</el-button>
        <el-button plain @click="dialogShow = true">打开弹框</el-button>
      </div>

      <selected-material
        :optionsConfig="{
          label: 'showName',
          value: 'attributeName',
          children: 'options'
        }"
        :is-preview="true"
        :selectOption="customSimpleData"
        :selectList="selectList"
        @cancel="onCancel"
      />
    </div>

    <media-preview
      :media-list="mediaDataList"
      :is-edit="true"
      v-model:media-dialog-visible="previewDialog"
      :optionsConfig="{
        label: 'showName',
        value: 'attributeName',
        children: 'options'
      }"
      :selectOption="customSimpleData"
      @close="closeMedia"
      @delete="deleteMedia"
    />

    <xz-upload-image v-model:visible="uploadDialog" :groups="groups" @close="close" @submit="submitImage" />

    <br />
    <br />
    <material-selector
      v-model:visible="materialDialog"
      :optionsConfig="{
        label: 'showName',
        value: 'attributeName',
        children: 'options'
      }"
      :selectOption="customSimpleData"
      :page-size="paging.pageSize"
      :total-page="paging.totalPage"
      :groups="groups"
      :type="materialType"
      :data-list="materialDataList"
      :select-data-list="selectList"
      @get-data="getMaterialData"
      @close="close"
      @submit="changeMaterialData"
    />

    <br />
    <br />

    <!-- 弹窗 -->
    <!--
        需要注意的几点
        宽度严格参照UI稿 不使用百分比
        close-on-click-modal="false"表示点击旁边区域不关闭模态框
     -->
    <!-- class="dialog-cantainer" -->

    <el-dialog v-model="dialogShow" title="弹窗示例" :close-on-click-modal="false" @close="close">
      <div>内容内容内容内容内容内容内容内容内容内容内容内容</div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" :loading="btnloading" @click="dialogShow = false">确 定</el-button>
          <el-button plain @click="dialogShow = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 抽屉 -->
    <!--
        需要注意的几点
        宽度严格参照UI稿 不使用百分比
        确定/保存按钮加loading状态
     -->

    <el-drawer
      v-model="drawerShow"
      size="764px"
      :show-close="false"
      custom-class="common-drawer-container"
      title="抽屉示例"
      @close="close"
    >
      <div class="common-drawer-body">抽屉内容抽屉内容</div>
      <div class="common-drawer-footer">
        <el-button type="primary" :loading="btnloading" @click="handleSave(true)">保 存</el-button>
        <el-button plain @click="handleSave(false)">取 消</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import SelectedMaterial from "@/components/MaterialSelector/selected.vue"
import MaterialSelector, { MaterialObj } from "@/components/MaterialSelector/index.vue"
import MediaPreview from "@/components/MediaPreview/index.vue"
import XzUploadImage from "@/components/XzComm/XzUploadImage/index.vue"
import { ObjTy } from "~/common"
import { copyText } from "@/utils"
import { customSimpleData, mediaList, groups } from "./config"

import {
  imageList,
  voiceList,
  videoList,
  textList,
  fileList,
  linkList,
  smsList,
  appletList,
  msgMenuList,
  mpnewsList,
  templateList
} from "./config"

const { proxy }: any = getCurrentInstance()

const activeNames = ref(["1"])
const drawerShow = ref(false)
const dialogShow = ref(false)
const btnloading = ref(false)
const previewDialog = ref(false)
const mediaDataList = ref(mediaList)
const materialDialog = ref(false)

const uploadDialog = ref(false)

const materialType = ref("image")
const materialDataList = ref(imageList)

const selectList = ref<any>([])
const paging = reactive({
  pageSize: 20,
  totalPage: 0
})

const typeData = {
  text: textList,
  image: imageList,
  voice: voiceList,
  mpnews: mpnewsList,
  video: videoList,
  msgmenu: msgMenuList,
  miniprogrampage: appletList,
  news: linkList,
  sms: smsList,
  template: templateList,
  // content: HtmlContentChat),
  // multiple: MultipleChat),
  file: fileList
}

function closeMedia() {
  console.log("closeMediaPreview")
  previewDialog.value = false
}

function deleteMedia(index) {
  console.log(index)
  mediaDataList.value.splice(index, 1)
}

function close() {
  uploadDialog.value = false
  materialDialog.value = false
  dialogShow.value = false
  drawerShow.value = false
}

function submitImage(val) {
  console.log("submitImage", val)
  val.onSuccess((val) => {
    console.log("onSuccess", val)
  })
}

function getMaterialData(val: MaterialObj) {
  console.log(val)
  materialType.value = val.type
  paging.totalPage = 140
  materialDataList.value = typeData[val.type]
}

function changeMaterialData(val: Array<ObjTy>) {
  selectList.value = val
  console.log("changeMaterialData", val)
}

const onCancel = (val: ObjTy) => {
  var index = selectList.value.findIndex((i) => i.contentType == val.contentType && i.id === val.id)
  if (index != -1) {
    selectList.value.splice(index, 1)
  }
}

const handleSave = (val) => {
  proxy.$showNotify({
    type: val ? "success" : "warning",
    content: val ? "已保存" : "已取消"
  })
  drawerShow.value = val
}
</script>

<style lang="scss" scoped>
.com-title {
  font-size: 24px;
  font-weight: bold;
}
</style>
