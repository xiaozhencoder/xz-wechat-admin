<template>
  <div v-if="url" class="chat-bubble">
    <div v-if="showFace" class="face">
      <svg-icon icon-class="logo" />
    </div>
    <div class="chat-content">
      <img class="image-cover" :src="url" @click="preview" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ObjTy } from "~/common"

const emit = defineEmits(["preview"])
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
  const u = props.info.picUrl || props.info.url
  if (u) {
    return u.indexOf("http") !== -1 || u.indexOf("base64") !== -1
      ? u
      : (process.env.NODE_ENV === "development"
          ? process.env.VUE_APP_MEDIA_BASE_URL
          : (window as ObjTy).config.MEDIA_URL) + u
  }
  return ""
})

const preview = () => {
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
    > svg {
      font-size: 24px;
      margin: 5px auto;
      display: block;
    }
  }
  .chat-content {
    margin-left: 10px;
    max-width: 235px;
    word-break: break-word;
    background: #ffffff;
    position: relative;
    .image-cover {
      max-width: 100%;
      display: block;
    }
  }
}
</style>
