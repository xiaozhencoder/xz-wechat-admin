<template>
  <div class="chat-bubble">
    <div class="face"><svg-icon icon-class="logo" /></div>
    <div class="chat-content" v-html="formartHtml"></div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  info: {
    type: Object,
    default: () => {}
  }
})

const formartHtml = computed(() => {
  var text = `<div class="head-text">${props.info.headContentTxt}</div>`
  text += props.info.nextLevelMenu
    .map((element) => {
      return '<span class="link-text">' + element.menuName + "</span>"
    })
    .join("")
  text += `<div class="foot-text">${props.info.tailContentTxt}</div>`
  return text
})
</script>

<style lang="scss" type="text/scss" scoped>
.chat-bubble {
  margin: 17px 10px;
  display: flex;
  .face {
    width: 34px;
    height: 34px;
    background: #ffffff;
    border-radius: 4px;
    > svg {
      font-size: 24px;
      margin: 5px auto;
      display: block;
    }
  }
  .chat-content {
    margin-left: 10px;
    padding: 8px 10px;
    max-width: 235px;
    word-break: break-word;
    background: #ffffff;
    position: relative;
    line-height: 20px;
    font-size: 14px;
    .arrow {
      position: absolute;
      left: -7px;
      top: 12px;
      width: 0;
      height: 0;
      border-top: 5px solid transparent;
      border-right: 10px solid #ffffff;
      border-bottom: 5px solid transparent;
    }
    :deep(.link-text) {
      word-break: break-word;
      color: #576b95;
    }
  }
}
</style>
