<template>
  <div
    class="type-voice"
    v-infinite-scroll="loadData"
    infinite-scroll-distance="50"
    infinite-scroll-delay="300"
    infinite-scroll-immediate="false"
    v-for="(item, index) in dataList"
    :key="item.id"
    :class="{ active: selects(item) }"
    @click="onSelect(item)"
  >
    <div v-if="selects(item)" class="selected">
      <svg-icon icon-class="icon-target" />
    </div>

    <div class="voice-content">
      <div class="voice-top">
        <svg-icon class="voice-default" icon-class="icon-content-voice" />
        <span>{{ item.contentName }}</span>
      </div>
      <div class="voice-bottom">
        <span>
          {{ timeResolution(JSON.parse(item.contentDetail).duration) }} |
          {{ formatBytes(JSON.parse(item.contentDetail).fileSize, 2) }}
        </span>
        <span>{{ item.userName }}</span>
      </div>
    </div>
    <div class="preview" @click.stop="onPreview(item)">
      <svg-icon icon-class="icon-content-preview" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ObjTy } from '~/common';
import { timeResolution, formatBytes } from "@/utils"
const emit = defineEmits(["select", "preview", "loadData"])

const props = defineProps({
  dataList: {
    type: Array<ObjTy>,
    default: () => []
  },
  selectList: {
    type: Array<ObjTy>,
    default: () => []
  }
})

const selects = computed(() => {
  return (item) => {
    return props.selectList.findIndex((v) =>  v.contentType === item.contentType && (v.id === item.id  || v.contentName === item.contentName))  !== -1
  }
})

const loadData = () => {
  emit("loadData")
}

const onSelect = (val) => {
  emit("select", val)
}

const onPreview = (val) => {
  emit("preview", val)
}
</script>

<style lang="scss" scoped>
.active {
  border-color: #00a39b !important;
  box-shadow: 0px 15px 30px rgb(0 0 0 / 12%);
  border-radius: 8px;
}
.type-voice {
  position: relative;
  width: 200px;
  height: 80px;
  margin: 5px 8px;
  background-color: rgb(111 179 111 / 28%);
  border: 2px dashed transparent;
  border-radius: 8px;
  cursor: pointer;

  .selected {
    position: absolute;
    left: 170px;
    font-size: 24px;
  }

  .voice-content {
    padding: 7px;
    .voice-top {
      display: flex;
      align-items: center;

      .voice-default {
        font-size: 28px;
        flex-shrink: 0;
      }

      > span {
        padding-left: 8px;
        word-break: break-all;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    .voice-bottom {
      margin: 12px 5px 0 5px;
      display: flex;
      justify-content: space-between;

      > span:first-child {
        border-radius: 5px;
        padding: 2px;
        display: block;
        // color: #fff;
        background-color: #f6f7f9;
      }
    }
  }
  .preview {
    position: absolute;
    top: 47px;
    height: 32px;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 28px;
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;

    &:hover {
      opacity: 1;
    }
  }
}
</style>
