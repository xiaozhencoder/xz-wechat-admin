<template>
  <div class="chat-bubble" :class="{ 'no-spacing': !showFace }">
    <div v-show="showFace" class="face"><svg-icon icon-class="logo" /></div>
    <div class="chat-content">
      <span class="arrow"></span>
      <div class="applet-head">
        <svg-icon class="applet-logo" icon-class="applet-logo" />
        <span>卓尔</span>
      </div>
      <div class="applet-title">{{ info.title }}</div>
      <div class="applet-cover"><img v-if="info.picUrl" :src="url" /></div>
      <div class="applet-footer">
        <svg-icon class="applet-icon" icon-class="applet-icon" />
        <span>小程序</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ObjTy } from "~/common"

const props = defineProps({
  info: {
    type: Object,
    default: () => {}
  },
  showFace: {
    type: Boolean,
    default: true
  }
})

let url = computed(() => {
  return props.info?.picUrl?.indexOf("http") !== -1 || props.info?.picUrl?.indexOf("base64") !== -1
    ? props.info?.picUrl
    : (process.env.NODE_ENV === "development"
        ? process.env.VUE_APP_MEDIA_BASE_URL
        : (window as ObjTy).config.MEDIA_URL) + props.info?.picUrl
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
    width: 235px;
    word-break: break-word;
    background: #ffffff;
    position: relative;
    line-height: 20px;
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
    .applet-title {
      color: #26292e;
      font-size: 14px;
      word-break: break-word;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      line-height: 28px;
    }
    .applet-cover {
      width: 100%;
      img {
        width: 100%;
        max-height: 120px;
        object-fit: cover;
      }
    }
  }
  &.no-spacing {
    margin: 0;
    .chat-content {
      margin-left: 0;
    }
  }
}
</style>
