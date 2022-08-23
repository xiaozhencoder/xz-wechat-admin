<template>
  <div class="common-page-container">
    <div class="common-page-head">
      <span class="com-title">Edit 自定义文本编辑器</span>
    </div>
    <div class="common-page-body">
      <div class="m-b-50">
        <div class="m-b-8">示例:</div>
        <xz-editor
          v-model="editData"
          :disabled="false"
          unique-key="a"
          :optionsConfig="{
            label: 'showName',
            value: 'attributeName',
            children: 'options'
          }"
          :selectOption="customSimpleData"
          :toolsSetting="['emoji', 'attr', 'insertNickname', 'hyperlink', 'minProgram', 'color']"
          @getEditDataHtml="getEditDataHtml"
        />
        <br />
        <br />
        <div v-html="editHtml"></div>

        <br />
        <br />

        <xz-editor
          v-model="editData1"
          placeholder="23423423sdfsdf"
          :disabled="false"
          :unique-key="'b'"
          :optionsConfig="{
            label: 'showName',
            value: 'attributeName',
            children: 'options'
          }"
          :selectOption="customSimpleData"
          :toolsSetting="['emoji', 'attr', 'insertNickname', 'hyperlink', 'minProgram', 'color']"
          @getEditDataHtml="getEditDataHtml1"
        />
        <br />
        <br />
        <div v-html="editHtml1"></div>
      </div>

      <el-descriptions border>
        <el-descriptions-item label="参数">Json格式数组</el-descriptions-item>
        <el-descriptions-item label="是否禁用">disabled</el-descriptions-item>
        <el-descriptions-item label="工具行">toolsSetting</el-descriptions-item>
        <el-descriptions-item label="Placeholder">placeholder</el-descriptions-item>
        <el-descriptions-item label="最大字数">maxlength</el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script lang="ts" setup>
import XzEditor from "@/components/XzComm/XzEditor/index.vue"
import { customSimpleData } from "./config"
const editData = ref(
  '{"content":[{"type":"text","value":"sdfa","line_num":1},{"type":"attr","value":"user.gender","defaultValue":"111","line_num":1},{"type":"text","value":"#客户昵称#","line_num":2},{"type":"emoji","value":"[色]","line_num":4},{"type":"text","value":"sdf","line_num":4},{"type":"hyperlink","name":"link.1234","value":"http://www.baidu.com","line_num":4}],"color":"#000"}'
)

const editData1 = ref("")

const editHtml = ref("")
const editHtml1 = ref("")

// 获取文本编辑框需要展示的html
function getEditDataHtml(val) {
  editHtml.value = val
  console.log(val)
}

function getEditDataHtml1(val) {
  editHtml1.value = val
  console.log(val)
}
</script>

<style lang="scss" scoped>
.com-title {
  font-size: 24px;
  font-weight: bold;
}
</style>
