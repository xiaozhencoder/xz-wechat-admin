<template>
  <div class="common-page-container">
    <div class="common-page-head">
      <span class="com-title">tabs</span>
    </div>
    <div class="common-page-body">
      <div class="m-b-50">
        <div class="m-b-8">示例:</div>
        <xz-tabs :tabs="TabList" curr-tab="data" @change="change" />
      </div>

      <el-descriptions border>
        <el-descriptions-item label="当前选中的值">curr-tab</el-descriptions-item>
        <el-descriptions-item label="备选项">tabs 默认为数组name label num 形式</el-descriptions-item>
        <el-descriptions-item label="监听改变">@change</el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script lang="ts" setup>
import XzTabs from "@/components/XzComm/XzTabs/index.vue"
const TabList = [
  {
    label: "data",
    name: "数据统计",
    num: 1
  },
  {
    label: "baseData",
    name: "基本信息",
    num: 3
  },
  {
    label: "customerData",
    name: "客户明细",
    num: 10
  }
]

const change = (val: string) => {
  console.log("change", val)
}
</script>

<style lang="scss" scoped>
.com-title {
  font-size: 24px;
  font-weight: bold;
}
</style>
