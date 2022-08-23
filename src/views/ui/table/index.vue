<template>
  <div class="common-page-container">
    <div class="common-page-head">
      <span class="com-title">table 表格（已全局注册）</span>
    </div>
    <div class="common-page-body">
      <div class="m-b-50">
        <div class="m-b-8">示例:</div>
        <xz-table
          ref="staticisTable"
          v-model:page="paging.params.currentPage"
          v-model:limit="paging.params.pageSize"
          v-loading="tableLoading"
          :data="tableList"
          :table-config="TableConfig"
          :total="paging.total"
          :is-multiple="true"
          @pageChange="pageChange"
          @selectionChange="selectionChange"
          @sortChange="sortChange"
        >
          <template v-slot:multiple-head>
            <div class="select-edit">
              <div class="select-num">
                <span>{{ selectedData.length }}</span>
                选择
              </div>
              <div class="state" @click="batchUpsert(true)">
                <svg-icon icon-class="visible" />
                <span>显示属性</span>
              </div>
              <div class="state" @click="batchUpsert(false)">
                <svg-icon icon-class="hidden" />
                <span>隐藏属性</span>
              </div>
            </div>
          </template>

          <template #preset="scope">
            <span>{{ scope.row.preset ? "是" : "否" }}</span>
          </template>

          <template #visible="scope">
            <el-switch :value="scope.row.visible" @change="switchChange(scope.row, !scope.row.visible)" />
          </template>
        </xz-table>
      </div>

      <el-descriptions border>
        <el-descriptions-item label="数据">data</el-descriptions-item>
        <el-descriptions-item label="数据配置">tableConfig</el-descriptions-item>
        <el-descriptions-item label="是否多选">isMultiple</el-descriptions-item>
        <el-descriptions-item label="是否显示分页">showPagination</el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ObjTy } from "~/common"
import { TableList, TableConfig } from "./config.ts"
const tableLoading = ref<boolean>(false)
const paging = reactive({
  total: 0,
  params: {
    currentPage: 1,
    pageSize: 10
  }
})

const tableList = ref(TableList)

let selectedData = ref([])

const pageChange = (val: string) => {
  console.log("pageChange", val)
}

const selectionChange = (val: any) => {
  console.log("selectionChange", val)
  selectedData.value = val
}

const sortChange = (val: string) => {
  console.log("sortChange", val)
}

const batchUpsert = (val: boolean) => {
  console.log("batchUpsert", val)
}

const switchChange = (val: ObjTy, visible: boolean) => {
  tableList.value = TableList.map((t) => {
    if (val.id === t.id) {
      t.visible = visible
    }
    return t
  })
}
</script>

<style lang="scss" scoped>
.com-title {
  font-size: 24px;
  font-weight: bold;
}
</style>
