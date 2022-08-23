<template>
  <div class="chat-bubble">
    <div v-if="info.picUrl" class="chat-content">
      <img class="video-cover" :src="url" />
      <div class="play-btn">
        <div class="play-icon" @click="preview"><i class="el-icon-caret-right" /></div>
        <div class="duration">{{ duration }}</div>
      </div>
      <div class="cover-title">{{ info.title }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { timeResolution } from "@/utils"
import { ObjTy } from "~/common"
const emit = defineEmits(["preview"])
const props = defineProps({
  info: {
    type: Object,
    default: () => {}
  }
})

const url = computed(() => {
  return props.info?.picUrl?.indexOf("http") !== -1 || props.info?.picUrl?.indexOf("base64") !== -1
    ? props.info?.picUrl
    : (process.env.NODE_ENV === "development"
        ? process.env.VUE_APP_MEDIA_BASE_URL
        : (window as ObjTy).config.MEDIA_URL) + props.info?.picUrl
})

const duration = computed(() => {
  return timeResolution(props.info.duration)
})

function preview() {
  emit("preview")
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
    img {
      width: 100%;
    }
  }
  .chat-content {
    width: 100%;
    word-break: break-word;
    background: #ffffff;
    position: relative;
    line-height: 20px;
    .video-cover {
      width: 100%;
      object-fit: cover;
      max-height: 169px;
      display: block;
    }
    .play-btn {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      color: #ffffff;
      .play-icon {
        width: 34px;
        height: 34px;
        background: #e5e5e5;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 5px;
        i {
          color: #000000;
        }
      }
      .duration {
        color: #ffffff;
        font-size: 12px;
        text-align: center;
      }
    }
    .cover-title {
      position: absolute;
      bottom: 3px;
      color: #ffffff;
      line-height: 18px;
      font-size: 14px;
      padding: 0px 16px;
      word-break: break-word;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }
}
</style>
