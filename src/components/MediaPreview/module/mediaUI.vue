<template>
  <div v-if="mediaDetail.type == 'image'" class="image-box">
    <img class="preview-img" :src="getUrl()" />
  </div>
  <div v-else-if="mediaDetail.type == 'video'" class="video-box">
    <video ref="videoPlayer" width="320" height="240" controls>
      <source :src="videoUrl" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>
  <div v-else-if="mediaDetail.type == 'voice'" class="voice-box">
    <div class="voice-bg">
      <svg-icon icon-class="voice-bg" />
    </div>
    <audio ref="audioPlayer" controls :src="voiceUrl">Your browser does not support the audio element.</audio>
  </div>
  <div v-else class="other-preview">
    <chat-template :info="mediaDetail" v-bind="$attrs" :show-edit="true" :has-test-send-btn="false" />
  </div>
</template>

<script lang="ts" setup>
import ChatTemplate from "@/components/ChatTemplate/index.vue"

import { ObjTy } from "~/common"

const { proxy }: any = getCurrentInstance()

const emit = defineEmits(["close"])

const props = defineProps({
  // 图片或者语音或者视频集合
  mediaDetail: {
    type: Object,
    default: () => {}
  }
})

const voiceUrl = ref(
  props.mediaDetail.voiceUrl?.indexOf("http") === -1
    ? (process.env.NODE_ENV === "development"
        ? process.env.VUE_APP_MEDIA_BASE_URL
        : (window as ObjTy).config.MEDIA_URL) + props.mediaDetail.voiceUrl
    : props.mediaDetail.voiceUrl
)

const videoUrl = ref(
  props.mediaDetail.videoUrl?.indexOf("http") === -1
    ? (process.env.NODE_ENV === "development"
        ? process.env.VUE_APP_MEDIA_BASE_URL
        : (window as ObjTy).config.MEDIA_URL) + props.mediaDetail.videoUrl
    : props.mediaDetail.videoUrl
)

watch(
  () => props.mediaDetail,
  (val) => {
    console.log(props.mediaDetail)
    proxy.$nextTick(() => {
      if (val.type === "voice") {
        proxy.$refs.audioPlayer.src =
          val.voiceUrl?.indexOf("http") === -1
            ? (process.env.NODE_ENV === "development"
                ? process.env.VUE_APP_MEDIA_BASE_URL
                : (window as ObjTy).config.MEDIA_URL) + val.voiceUrl
            : val.voiceUrl
      } else if (val.type === "video") {
        proxy.$refs.videoPlayer.src =
          val.videoUrl?.indexOf("http") === -1
            ? (process.env.NODE_ENV === "development"
                ? process.env.VUE_APP_MEDIA_BASE_URL
                : (window as ObjTy).config.MEDIA_URL) + val.videoUrl
            : val.videoUrl
      }
    })
  },
  { deep: true }
)

const getUrl = () => {
  if (props.mediaDetail.picUrl?.indexOf("http") !== -1) {
    return props.mediaDetail.picUrl
  }
  return props.mediaDetail.picUrl?.indexOf("base64") === -1
    ? (process.env.NODE_ENV === "development"
        ? process.env.VUE_APP_MEDIA_BASE_URL
        : (window as ObjTy).config.MEDIA_URL) + props.mediaDetail.picUrl
    : props.mediaDetail.picUrl
}
const destroy = () => {
  if (props.mediaDetail.type === "video") {
    proxy.$refs.videoPlayer.pause()
  } else if (props.mediaDetail.type === "voice") {
    proxy.$refs.audioPlayer.pause()
  }
}
</script>
<style lang="scss" scoped>
.image-box {
  width: 1000px;
  height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(45, 64, 79, 0.7);
  .preview-img {
    height: inherit;
    max-width: 1000px;
    max-height: 500px;
  }
}
.video-box {
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(45, 64, 79, 0.7);
  video {
    width: 100%;
    height: 100%;
    max-height: 500px;
  }
}
.voice-box {
  width: 400px;
  height: 466px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .voice-bg {
    width: 100%;
    height: 400px;
    margin-bottom: 44px;
    > svg {
      width: 100%;
      height: 100%;
    }
  }
  audio {
    width: 100%;
    height: 24px;
  }
}
</style>
