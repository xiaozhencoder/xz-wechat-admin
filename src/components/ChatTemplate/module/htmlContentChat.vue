<template>
  <div class="chat-bubble">
    <div class="chat-content">
      <pre>{{ info.content }}</pre>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  info: {
    type: Object,
    default: () => {}
  }
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
    word-break: break-word;
    background: #ffffff;
    position: relative;
    line-height: 20px;
    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
      font-family: PingFang SC, Helvetica Neue, Helvetica, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
      font-size: 14px;
      color: #26292e;
      line-height: 22px;
    }
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
    :deep(.xz-editor) {
      min-width: auto;
      min-height: auto;
      border: 0;
      .xz-editor__tools {
        display: none;
      }
      .xz-editor__content {
        padding: 0;
      }
    }
  }
  &.chat-menu {
    margin: 0;
    .chat-content {
      margin: 0;
      padding: 0;
    }
  }
}
</style>
