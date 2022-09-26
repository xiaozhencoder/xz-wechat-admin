<template>
  <div class="common-page-container">
    <div class="common-page-head">
      <rule-description :name="name" />
    </div>
    <div class="common-page-body">
      <div class="p-b-10 flex row-between">
        <xz-search v-model:value="state.serchVal" @change="getSearchVal" />
        <el-button type="success" @click="add">
          <el-svg-icon elSvgName="Plus" :size="17" />
          新建客户欢迎语
        </el-button>
      </div>
      <xz-table
        :v-loading="loading"
        :total="paging.total"
        :page.sync="paging.params.currentPage"
        :limit.sync="paging.params.pageSize"
        :data="tableData"
        :table-config="tableConfig"
      >
        <template #content="scope">
          <div class="content line-1">
            <span class="text-content">{{ scope.row.txt }}</span>
            <div class="attachment-num">
              <span v-if="scope.row.attachmentsNum">
                {{ scope.row.attachmentsNum + "个附件" }}
              </span>
            </div>
          </div>
        </template>
        <template #status="scope">
          <span title="修改状态" @click.stop="changeStatus(scope.row)">
            <el-switch :model-value="scope.row.status === 1" />
          </span>
        </template>
        <template #operation="scope">
          <div class="f-s-24">
            <span title="预览" class="table-operation pointer m-r-8" @click="preview(scope.row)">
              <svg-icon icon-class="preview" />
            </span>
            <el-popover :show-arrow="false" placement="bottom-end" trigger="click">
              <template #reference>
                <span title="更多" class="table-operation pointer m-r-8">
                  <svg-icon icon-class="more" />
                </span>
              </template>
              <div class="pointer">
                <div class="poeration" @click="edit(scope.row)">
                  <svg-icon class="f-s-24 m-r-8" icon-class="edit" />
                  <span>编辑</span>
                </div>
                <div class="poeration" @click="del(scope.row)">
                  <svg-icon class="f-s-24 m-r-8" icon-class="delete" />
                  <span>删除</span>
                </div>
              </div>
            </el-popover>
          </div>
        </template>
      </xz-table>
    </div>

    <template>
      <media-preview
        :media-list="state.mediaDataList"
        :is-multiple="true"
        v-model:media-dialog-visible="state.previewDialog"
        @close="close"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { useElement } from "@/hooks/global/useElement"
import { useVueRouter } from "@/hooks/global/useVueRouter"
import ElSvgIcon from "@/components/SvgIcon/ElSvgIcon.vue"
import RuleDescription from "@/components/RuleDescription/index.vue"
import { tableConfig } from "./config"
import WelcomeSpeechApi from "@/api/pullDrainage/welcomeSpeech"
import { param, setPageParam } from "@/utils"
import { STATUS_SUCCESS, CREATE_CUSTOMER_SPEECH } from "@/constent/globalConstant"
import { ElMessageBox } from "element-plus"
import { ObjTy } from "~/common"
import MediaPreview from "@/components/MediaPreview/index.vue"

const api = new WelcomeSpeechApi()
const { elNotify } = useElement()
const { routerPush } = useVueRouter()
const route = useRoute()
const name = ref<string>(route.name as string)

const state: ObjTy = reactive({
  tableData: [], // 表格数据
  loading: false,
  sort: "",
  serchVal: "",
  paging: {
    params: {
      currentPage: 1,
      pageSize: 20
    },
    total: 0
  },
  previewDialog: false,
  mediaDataList: []
})

const { tableData, loading, paging, sort, serchVal } = toRefs(state)

const getSearchVal = (data) => {
  serchVal.value = data
  list()
}

const list = async () => {
  loading.value = true
  const params = {
    ...paging.value.params,
    keyWord: serchVal.value,
    sort: sort.value
  }
  const resp = await api.getCustomerList(param(params))
  const { status, data } = resp
  if (status === STATUS_SUCCESS) {
    const arr = data.data
    arr.forEach((d) => {
      d.txt = d.content ? getTextContent(JSON.parse(d.content)) : d.content
      const arrs = Array.isArray(JSON.parse(d.content)) ? JSON.parse(d.content) : []
      d.attachmentsNum = (arrs || []).filter((item) => item?.type !== "text")?.length
    })

    tableData.value = arr
    setPageParam(paging.value, data)
  }
  loading.value = false
}

const getTextContent = (arr) => {
  let res = ``
  if (Array.isArray(arr)) {
    ;(arr || []).map((item) => {
      if (item.type === "text") {
        const { content = "" } = item
        if (content) {
          const c = JSON.parse(content)
          const v = (c.content || []).map((v) => v.value).join("")
          res += v
        }
      }
    })
    return res || "-"
  } else {
    return res + arr
  }
}

const changeStatus = (data) => {
  ElMessageBox.confirm(
    `${
      data.status
        ? "关闭后，员工将不会自动发送欢迎语给客户， 确认关闭么？"
        : "开启后，此欢迎语将对所有员工生效，确认开启么？"
    }`,
    `${data.status ? "关闭" : "开启"}欢迎语`
  )
    .then(() => {
      api.changeCustomerStatus(data.id).then((res) => {
        elNotify(`${data.status ? "关闭" : "开启"}成功`, "success")
        list()
      })
    })
    .catch(() => {})
}

const add = () => {
  routerPush(CREATE_CUSTOMER_SPEECH)
}

const del = (data) => {
  ElMessageBox.confirm(`删除后，客户将无法收到该欢迎提示`, "删除客户欢迎语")
    .then(() => {
      api
        .deleteCustomerById(data.id)
        .then((res) => {
          if (res && res.status === 0) {
            elNotify(res && "删除成功!", "success")
            list()
          } else {
            elNotify(res && res.message, "warning")
          }
        })
        .catch((e) => {
          elNotify(e, "warning")
        })
    })
    .catch(() => {})
}

const edit = (data) => {
  routerPush(CREATE_CUSTOMER_SPEECH, { id: data.id })
}

const preview = (data) => {
  state.previewDialog = true
  state.mediaDataList = [data]
}

function close() {
  state.previewDialog = false
}

list()
</script>

<style lang="scss" scoped>
.table-poeration {
  svg:hover {
    background-color: $background-color-hover;
  }
}

.poeration {
  padding: 3px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  &:hover {
    width: 100%;
    background-color: $background-color-base;
  }
}

.attachment-num {
  > span {
    padding: 3px;
    background-color: $color-secondary-light-6;
    color: #fff;
    border-radius: 3px;
  }
}
</style>
