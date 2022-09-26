<template>
  <div class="common-page-container">
    <h1 class="f-s-20 f-w-700">svg</h1>
    <ul class="svg-icon-list">
      <li v-for="(item, index) in svgList" :key="index" class="flex-center icon-item" @click="copyText(item)">
        <svg-icon :icon-class="item" class="f-s-40 m-b-8" />
        <span>{{ item }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { copyText } from "@/utils"
const modules = import.meta.glob("../../../icons/common/*.svg")

const svgList = Object.keys(modules).map((key) => {
  let str = key.substring(key.lastIndexOf("/") + 1, key.length)
  return str.replace(".svg", "")
})
</script>

<style lang="scss" scoped>
.svg-icon-list {
  overflow: hidden;
  list-style: none;
  margin: 10px 0;
  border-top: 1px solid var(--el-border-color);

  border-left: 1px solid var(--el-border-color);
  border-radius: 4px;
  display: grid;
  grid-template-columns: repeat(7, 1fr);

  .icon-item {
    flex-direction: column;
    text-align: center;
    cursor: pointer;
    margin: 2px;
    background-color: #e1e9eb;
    color: var(--el-text-color-regular);
    height: 90px;
    font-size: 13px;
    border: 1px solid #a6a8ac;
    transition: background-color var(--el-transition-duration);
  }
}
</style>
