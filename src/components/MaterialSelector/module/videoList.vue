<template>
  <div
    class="type-video"
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
    <img w-full :src="getUrl(JSON.parse(item.contentDetail).picUrl)" />
    <div class="video-play">
      <svg-icon icon-class="play" />
    </div>
    <div class="preview" @click.stop="onPreview(item)">
      <svg-icon icon-class="icon-content-preview" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ObjTy } from '~/common';
import { getUrl } from "@/utils"
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
.type-video {
  position: relative;
  margin: 5px;
  width: 119px;
  height: 119px;
  box-sizing: border-box;
  cursor: pointer;
  border: 2px dashed transparent;

  .selected {
    position: absolute;
    left: 85px;
    font-size: 24px;
  }

  .video-play {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 45px;
    position: relative;
    top: -80px;
    opacity: 0.7;
  }
  .preview {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    height: 30%;
    top: -85px;
    opacity: 0;
    font-size: 28px;
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;

    &:hover {
      opacity: 1;
    }
  }
  > img {
    border-radius: 8px;
    width: 100%;
    height: 100%;
  }
}

.active {
  border-color: #00a39b;
  box-shadow: 0px 15px 30px rgb(0 0 0 / 12%);
  border-radius: 8px;
}
</style>
