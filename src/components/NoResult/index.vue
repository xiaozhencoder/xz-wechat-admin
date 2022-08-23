<template>
  <div class="common-no-realuts">
    <svg-icon icon-class="common-no-result" />
    <div>{{ text }}</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  text: {
    type: String,
    default: '暂无结果'
  }
})
</script>

<style lang="scss" scoped>
.common-no-realuts {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  svg {
    width: 30%;
    min-height: 20vh;
    min-width: 200px;
    max-width: 290px;
  }
  > div {
    font-size: 16px;
    color: #888d97;
    margin-top: 28px;
  }
}
</style>
