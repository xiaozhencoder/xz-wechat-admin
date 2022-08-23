<template>
  <div class="chat-bubble">
    <div class="face"><svg-icon icon-class="logo" /></div>
    <div class="chat-content pointer" :style="{ width: voiceWidth + 'px' }" @click="preview">
      <span class="arrow" />
      <svg-icon class="voice-default" icon-class="voice-default" />
      <span>{{ duration }}"</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { timeResolution } from "@/utils"
const emit = defineEmits(["preview"])
const props = defineProps({
  info: {
    type: Object,
    default: () => {}
  }
})

const voiceWidth = computed(() => {
  return props.info?.duration < 10 ? 75 : props.info?.duration * 10
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
    > svg {
      font-size: 24px;
      margin: 5px auto;
      display: block;
    }
  }
  .chat-content {
    margin-left: 10px;
    padding: 8px 10px;
    max-width: 240px;
    word-break: break-word;
    background: #ffffff;
    position: relative;
    border-radius: 3px;
    color: #26292e;
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
    .voice-default {
      margin-right: 7px;
      font-size: 16px;
    }
  }
}
</style>
