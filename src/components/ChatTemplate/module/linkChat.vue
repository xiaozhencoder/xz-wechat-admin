<template>
  <div v-if="info.title || info.description || info.picUrl" class="chat-bubble" :class="{ 'no-spacing': !showFace }">
    <div v-show="showFace" class="face"><svg-icon icon-class="logo" /></div>
    <div class="chat-content" @click="preview">
      <div class="link-title">{{ info.title }}</div>
      <div class="link-info">
        <div class="link-desc">{{ info.description }}</div>
        <div class="link-cover"><img v-if="info.picUrl" :src="url" /></div>
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

onMounted(() => {
  console.log(props.info)
})

const url = computed(() => {
  return props.info?.picUrl?.indexOf("http") !== -1 || props.info?.picUrl?.indexOf("base64") !== -1
    ? props.info?.picUrl
    : (process.env.NODE_ENV === "development"
        ? process.env.VUE_APP_MEDIA_BASE_URL
        : (window as ObjTy).config.MEDIA_URL) + props.info?.picUrl
})

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
    .link-title {
      color: #26292e;
      font-size: 14px;
      word-break: break-word;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    .link-info {
      color: #737373;
      font-size: 12px;
      display: flex;
      word-break: break-word;
      margin-top: 3px;
      line-height: 20px;
      .link-desc {
        flex: 1;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
      }
      .link-cover {
        width: 60px;
        max-height: 60px;
        img {
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
