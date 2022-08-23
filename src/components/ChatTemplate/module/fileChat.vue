<template>
  <div v-if="info.name || info.fileUrl" class="chat-bubble" :class="{ 'no-spacing': !showFace }">
    <div v-show="showFace" class="face"><svg-icon icon-class="logo" /></div>
    <div class="chat-content" @click="preview">
      <div class="link-info">
        <div class="link-cover"><svg-icon class="file-icon" icon-class="file-icon" /></div>
        <div class="link-desc">
          <div class="name">{{ info.name || info.fileName || "" }}</div>
          <div class="size">{{ getFileSize(info.fileSize, null) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { formatBytes } from "@/utils"
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

const url = computed(() => {
  return props.info?.picUrl?.indexOf("http") !== -1 || props.info?.picUrl?.indexOf("base64") !== -1
    ? props.info?.picUrl
    : (process.env.NODE_ENV === "development"
        ? process.env.VUE_APP_MEDIA_BASE_URL
        : (window as ObjTy).config.MEDIA_URL) + props.info?.picUrl
})

const getFileSize = (size, fixed) => {
  return !size ? "0KB" : formatBytes(size, fixed)
}

const preview = () => {
  if (props.info.linkUrl) {
    window.open(props.info.linkUrl.indexOf("http") !== -1 ? props.info.linkUrl : "http://" + props.info.linkUrl)
  }
}
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
    width: 220px;
    background: #ffffff;
    position: relative;
    padding: 8px 10px;
    line-height: 20px;
    .link-info {
      color: #545860;
      font-size: 14px;
      display: flex;
      word-break: break-word;
      margin-top: 3px;
      line-height: 20px;
      .link-desc {
        flex: 1;
        word-break: break-all;
        display: flex;
        overflow: hidden;
        justify-content: center;
        align-items: flex-start;
        flex-direction: column;
        .name {
          text-overflow: ellipsis;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .size {
          font-size: 12px;
          color: #888d97;
        }
      }
      .link-cover {
        width: 60px;
        max-height: 60px;
        svg {
          height: 100%;
          width: 100%;
          object-fit: cover;
        }
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
