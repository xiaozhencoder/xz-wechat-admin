<template>
  <div
    class="type-mp-news"
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

    <div class="mp-news-content">
      <div class="mp-news-top">
        <svg-icon class="mp-news-default" :icon-class="'icon-content-' + JSON.parse(item.contentDetail).type" />
        <span>{{ item.contentName }}</span>
      </div>
      <div class="mp-news-bottom">
        <div class="mp-news-desc">
          <span>{{ JSON.parse(item.contentDetail).digest }}</span>
        </div>
        <div class="mp-news-img">
          <img :src="getUrl(JSON.parse(item.contentDetail).picUrl)" />
        </div>
      </div>
    </div>
    <div class="preview" @click.stop="onPreview(item)">
      <svg-icon icon-class="icon-content-preview" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ObjTy } from '~/common';
import { timeResolution, formatBytes, getUrl } from "@/utils"
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
    return props.selectList.findIndex((v) => v.contentType === item.contentType && v.id === item.id) !== -1
  }
})

const onSelect = (val) => {
  emit("select", val)
}

const loadData = () => {
  emit("loadData")
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
.type-mp-news {
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

  .mp-news-content {
    padding: 7px;
    .mp-news-top {
      display: flex;
      align-items: center;

      .mp-news-default {
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

    .mp-news-bottom {
      // margin: 12px 5px 0 5px;
      display: flex;
      justify-content: space-between;
      word-break: break-all;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;

      .mp-news-desc {
        display: flex;
        justify-content: center;
        align-items: center;

        > span {
          width: 140px;
          border-radius: 5px;
          padding: 2px;
          display: block;
          word-break: break-all;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }

      .mp-news-img {
        flex: 1;

        > img {
          width: 40px;
          height: 34px;
        }
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
