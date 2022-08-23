<template>
  <div class="common-page-container">
    <div class="common-page-head">
      <span class="com-title">input 输入框（已全局注册）</span>
    </div>
    <div class="common-page-body">
      <div class="m-b-50">
        <div class="m-b-8">示例:</div>
        <xz-input
          ref="xzInputRef"
          v-model:value="inputVala"
          show-limit
          :maxlength="20"
          placeholder="测试数据"
          @change="inputChange"
        />
      </div>

      <el-descriptions :column="3" border>
        <el-descriptions-item label="绑定值">v-modle/:value形式</el-descriptions-item>
        <el-descriptions-item label="最大限制数">maxlength Number</el-descriptions-item>
        <el-descriptions-item label="是否显示限制数">showLimit 默认为数组value label形式</el-descriptions-item>
        <el-descriptions-item label="备选项配置">optionsConfig 对象 默认为value label children</el-descriptions-item>
        <el-descriptions-item label="默认文字">placeholder String</el-descriptions-item>
        <el-descriptions-item label="是否禁用">disabled Boolean</el-descriptions-item>
        <el-descriptions-item label="监听改变">@input @change</el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script lang="ts" setup>
const activeNames = ref<Array<string>>(["1"])

const inputVala = ref<string>("dddd")

const inputChange = (val: string) => {
  console.log("inputChange", val)
}
</script>

<style lang="scss" scoped>
.com-title {
  font-size: 24px;
  font-weight: bold;
}
</style>
