<template>
  <div class="common-page-container">
    <div class="common-page-head">
      <span class="com-title">select 单选（已全局注册）</span>
    </div>
    <div class="common-page-body">
      <div class="m-b-50">
        <div class="m-b-8">示例:</div>
        <xz-select
          v-model:value="selectVal"
          placeholder="单选"
          :line="true"
          :items="presetOptions"
          @change="getSelectedValue"
        />
        <br />
        <br />
        <xz-select v-model:value="selectVal" placeholder="单选" :items="presetOptions" @change="getSelectedValue" />
      </div>

      <el-descriptions :column="3" border>
        <el-descriptions-item label="绑定值">v-modle/:value形式</el-descriptions-item>
        <el-descriptions-item label="最大限制数">maxlength Number</el-descriptions-item>
        <el-descriptions-item label="下划线">line / true false</el-descriptions-item>
        <el-descriptions-item label="是否显示限制数">showLimit 默认为数组value label形式</el-descriptions-item>
        <el-descriptions-item label="options">数据</el-descriptions-item>
        <el-descriptions-item label="备选项配置">config 对象 默认为value label</el-descriptions-item>
        <el-descriptions-item label="默认文字">placeholder String</el-descriptions-item>
        <el-descriptions-item label="自定义样式">styles</el-descriptions-item>
        <el-descriptions-item label="自定义类">className</el-descriptions-item>
        <el-descriptions-item label="监听改变">@change</el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script lang="ts" setup>
const selectVal = ref("")

const presetOptions = [
  {
    value: "-1",
    label: "全部预置"
  },
  {
    value: "true",
    label: "是"
  },
  {
    value: "false",
    label: "否"
  }
]

const getSelectedValue = (val) => {
  console.log("getSelectedValue", val)
}
</script>

<style lang="scss" scoped>
.com-title {
  font-size: 24px;
  font-weight: bold;
}
</style>
