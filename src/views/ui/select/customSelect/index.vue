<template>
  <div class="common-page-container">
    <div class="common-page-head">
      <span class="com-title">custom-select 自定义选择器</span>

      <div>
        <el-button plain @click="visibleDrag = true">
          <svg-icon icon-class="line" class="f-s-24 m-r-4" />
          编辑列
        </el-button>
        <el-button plain @click="visibleTree = true">
          <svg-icon icon-class="line" style="font-size: 24px; margin-right: 4px" />
          员工选择器
        </el-button>
      </div>
    </div>
    <div class="common-page-body">
      <div class="m-b-50">
        <div class="m-b-8">示例:</div>
        <xz-custom-select
          ref="attrSelect"
          type="Simple"
          v-model:value="simpleValue"
          :options="CustomSimpleData"
          :config="{
            label: 'showName',
            value: 'attributeName',
            children: 'options'
          }"
          @visible="visibleChange"
          @change="customSimpleChange"
        />
        <br />
        <xz-drag-select
          :visible="visibleDrag"
          :all-columns="TabList"
          :config="{ prop: 'label', label: 'name' }"
          :columns="columns"
          @close="handleClose"
          @change="handleChangeColumn"
        />

        <xz-tree-select
          :visible="visibleTree"
          :source-data="TreeData"
          nodeKey="wxId"
          @close="handleClose"
          @change="handleChangeColumn"
        />
      </div>

      <el-descriptions :column="3" border>
        <el-descriptions-item label="数据">data</el-descriptions-item>
        <el-descriptions-item label="已经选中的事件名称">selectedEventName Array</el-descriptions-item>
        <el-descriptions-item label="是否禁用添加按钮">isDisabeldAdd</el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script lang="ts" setup>
import XzCustomSelect from "@/components/XzComm/XzCustomSelect/index.vue"
import XzDragSelect from "@/components/XzComm/XzCustomSelect/dragSelect.vue"
import XzTreeSelect from "@/components/XzComm/XzCustomSelect/treeSelect.vue"
import { TabList, TreeData, CustomSimpleData } from "./config"

const simpleValue = ref<string>("phone_number")

const visibleDrag = ref<boolean>(false)
const visibleTree = ref<boolean>(false)
const columns = ref([])

const visibleChange = (val) => {
  console.log("visibleChange", val)
}

const customSimpleChange = (val) => {
  simpleValue.value = val
  console.log("customSimpleChange", val)
}

const handleClose = (val) => {
  visibleTree.value = false
  visibleDrag.value = false
}

const handleChangeColumn = (val) => {
  console.log("handleChangeColumn:", val)
}
</script>

<style lang="scss" scoped>
.com-title {
  font-size: 24px;
  font-weight: bold;
}
</style>
