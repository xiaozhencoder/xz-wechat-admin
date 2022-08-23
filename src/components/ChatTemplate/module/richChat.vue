<template>
  <div class="chat-bubble" :class="{ 'no-spacing': !showFace }">
    <div class="chat-content">
      <div class="rich-cover">
        <img v-if="url" :src="url" />
        <img v-else :src="defaultImg" />
      </div>
      <div class="rich-title">{{ info.name }}</div>
      <div class="rich-desc" v-html="info.content" />
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

const defaultImg = ref<string>("@/assets/images/default-img.png")

const url = computed(() => {
  const u = props.info?.picUrl
  if (u) {
    return u.indexOf("http") !== -1 || u.indexOf("base64") !== -1
      ? u
      : (process.env.NODE_ENV === "development"
          ? process.env.VUE_APP_MEDIA_BASE_URL
          : (window as ObjTy).config.MEDIA_URL) + u
  } else {
    return false
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
    border-radius: 4px;
    .rich-cover {
      width: 100%;
      background: #f6f7f9;
      img,
      svg {
        width: 100%;
        max-height: 158px;
        object-fit: cover;
        display: block;
      }
    }
    .rich-title {
      margin: 13px auto 6px;
      line-height: 20px;
      font-size: 14px;
      color: #26292e;
      padding: 0px 17px;
      word-break: break-word;
    }
    .rich-desc {
      color: #737373;
      font-size: 12px;
      padding: 0px 17px;
      word-break: break-word;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      margin-bottom: 16px;
    }
  }
  &.no-spacing {
    margin: 0;
  }
}
</style>
