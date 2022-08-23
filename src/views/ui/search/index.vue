<template>
  <div class="common-page-container">
    <div class="common-page-head">
      <span class="com-title">input 输入框（已全局注册）</span>
    </div>
    <div class="common-page-body">
      <div class="m-b-50">
        <div class="m-b-8">示例:</div>
        <XzSearch v-model:value="searchVal" @change="getSearchVal" @add="getAddVal" />
      </div>

      <el-descriptions :column="3" border>
        <el-descriptions-item label="绑定值">v-modle/:value形式</el-descriptions-item>
        <el-descriptions-item label="宽">width</el-descriptions-item>
        <el-descriptions-item label="是否实时更新">realTime Boolean</el-descriptions-item>
        <el-descriptions-item label="是否修改">is-add，可以添加操作，主要用于多选框中</el-descriptions-item>
        <el-descriptions-item label="默认文字">placeholder String</el-descriptions-item>
        <el-descriptions-item label="是否禁用">disabled Boolean</el-descriptions-item>
        <el-descriptions-item label="监听改变">@change @add @input</el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script lang="ts" setup>
const searchVal = ref<string>("dddd")

const getSearchVal = (val: string) => {
  console.log("getSearchVal", val)
}

const getAddVal = (val: string) => {
  console.log("getAddVal", val)
}
</script>

<style lang="scss" scoped>
.com-title {
  font-size: 24px;
  font-weight: bold;
}
</style>
