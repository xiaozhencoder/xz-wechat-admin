<template>
  <div class="common-page-container">
    <div class="common-page-head">
      <span class="com-title">input 输入框（已全局注册）</span>
    </div>
    <div class="common-page-body">
      <div class="m-b-50">
        <div class="m-b-8">示例:</div>
        <XzMultiSelect
          v-model:value="multiSelectValue"
          placeholder="请选择"
          :is-add="true"
          :target-options="multiSelectOptions"
          @changeCheckbox="changeCheckbox"
          @updateById="updateMultiOpt"
          @deleteById="deleteMultiOpt"
          @add="addMultiVal"
        />
        <br />
        <br />
        <XzMultiSelect
          v-model:value="multiSelectValue1"
          placeholder="请选择"
          is-line
          :target-options="multiSelectOptions"
          @changeCheckbox="changeCheckbox"
        />
        <br />
        <br />

        <XzMultiSelect
          v-model:value="multiSelectValue1"
          placeholder="单选"
          :is-multiple="false"
          :target-options="multiSelectOptions"
          @changeCheckbox="changeCheckbox"
        />
      </div>

      <el-descriptions border>
        <el-descriptions-item label="参数">value</el-descriptions-item>
        <el-descriptions-item label="是否有搜索">is-search （默认 true）</el-descriptions-item>
        <el-descriptions-item label="是否有选中所有（is-multiple = true）">
          is-check-all（默认 true）
        </el-descriptions-item>
        <el-descriptions-item label="是否多选">is-multiple （默认 true）</el-descriptions-item>
        <el-descriptions-item label="是否编辑添加">is-add</el-descriptions-item>
        <el-descriptions-item label="是框还是横线">is-line</el-descriptions-item>
        <el-descriptions-item label="Placeholder">placeholder</el-descriptions-item>
        <el-descriptions-item label="初始化下拉框数据">target-options</el-descriptions-item>
        <el-descriptions-item label="选择确定后触发事件">@changeCheckbox</el-descriptions-item>
        <el-descriptions-item label="根据Id修改targetOptions数据">@updateById</el-descriptions-item>
        <el-descriptions-item label="根据Id删除targetOptions数据">@deleteById</el-descriptions-item>
        <el-descriptions-item label="添加targetOptions数据">@add</el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script lang="ts" setup>
import XzMultiSelect from "@/components/XzComm/XzMultiSelect/index.vue"
const multiSelectValue = ref("1")
const multiSelectValue1 = ref("1")

const multiSelectOptions = ref([
  { name: "张三", label: "1" },
  { name: "李四", label: "2" },
  { name: "王五", label: "3" },
  { name: "赵六", label: "4" }
])

const changeCheckbox = (val) => {
  console.log("changeCheckbox", val)
}

const addMultiVal = (val) => {
  multiSelectOptions.value.push({ name: val, label: multiSelectOptions.value.length + 1 + "" })
  console.log("addMultiVal", val)
}

const updateMultiOpt = (val, index) => {
  multiSelectOptions.value[index].name = val.labelName
  console.log("updateMultiOpt", multiSelectOptions.value, val, index)
}

const deleteMultiOpt = (val, index) => {
  multiSelectOptions.value.splice(index, 1)
}
</script>

<style lang="scss" scoped>
.com-title {
  font-size: 24px;
  font-weight: bold;
}
</style>
