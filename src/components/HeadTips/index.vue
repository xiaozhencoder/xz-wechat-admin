<template>
  <div class="header-tips-container">
    <svg-icon :icon-class='icon' />
    <span>{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  icon: {
    type: String,
    default: 'icon-tips'
  },
  text: {
    type: String,
    default: ''
  }
})

</script>

<style lang="scss" scoped>
.header-tips-container {
  background: #fff;
  padding: 8px 20px;
  color: #525563;
  font-size: 14px;
  display: flex;
  svg {
    font-size: 32px;
    min-width: 32px;
    margin-right: 10px;
  }
  span {
    line-height: 18px;
  }
}
</style>
