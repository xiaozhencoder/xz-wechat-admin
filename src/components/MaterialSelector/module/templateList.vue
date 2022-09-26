<template>
  <div
    class="type-text"
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

    <div class="text-content">
      <div class="text-top">
        <svg-icon class="default" :icon-class="'icon-content-' + JSON.parse(item.contentDetail).type" />
        <span>{{ item.contentName }}</span>
      </div>
      <div class="text-body">
        <span>{{ JSON.parse(JSON.parse(item.contentDetail).templateParameters[0].value).content[0].value }}</span>
      </div>
    </div>
    <div class="preview" @click.stop="onPreview(item)">
      <svg-icon icon-class="icon-content-preview" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ObjTy } from '~/common';
import { fillContent } from "@/utils/material"
const attrs: any = useAttrs()
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
.type-text {
  position: relative;
  width: 200px;
  height: 80px;
  margin: 5px 8px;
  background-color: rgb(219 222 227 / 28%);
  border: 2px dashed transparent;
  border-radius: 8px;
  cursor: pointer;

  .selected {
    position: absolute;
    left: 170px;
    font-size: 24px;
  }

  .text-content {
    padding: 7px;
    .text-top {
      display: flex;
      align-items: center;

      .default {
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

    .text-body {
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      line-height: 32px;
      height: 32px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-break: break-all;

      > span {
        margin-top: 8px;
        width: -webkit-fill-available;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-break: break-all;
        > :deep(div:first-child) {
          word-break: break-all;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
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
