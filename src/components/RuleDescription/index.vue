<template>
  <div class="rule-nav-container">
    <div class="tip p-8">
      <h1 class="lg p-b-8">客户欢迎语规范说明</h1>
      <p class="desc">
        <svg-icon class="f-s-24" icon-class="icon-tips" />
        {{ tipData[name] }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { tipData } from "@/constent/descriptionConstant"
const props = defineProps({
  name: {
    type: String,
    default: ""
  }
})
</script>

<style lang="scss" scoped>
.tip {
  background-color: $background-color-base;
  border-radius: 5px;
  margin-bottom: 12px;
  .desc {
    display: flex;
    align-items: center;
  }
}
</style>
