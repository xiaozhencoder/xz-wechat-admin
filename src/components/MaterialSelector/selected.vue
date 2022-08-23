<template>
  <div class="select-content">
    <template v-for="(item, index) in selectList" :key="index">
      <div
        v-if="JSON.parse(item.contentDetail).type === 'image' || JSON.parse(item.contentDetail).type === 'video'"
        class="select-image m-r-8 m-b-8"
      >
        <div v-if="JSON.parse(item.contentDetail).type === 'video'" class="video-play">
          <svg-icon icon-class="play" />
        </div>
        <img w-full :src="getUrl(JSON.parse(item.contentDetail))" />
        <div class="select-del">
          <svg-icon icon-class="delete-white" @click="onCancel(item)" />
          <span v-if="isPreview" style="color: #fff; font-size: 14px">|</span>
          <svg-icon v-if="isPreview" icon-class="icon-content-preview" @click="onPreview(item)" />
        </div>
      </div>
      <div
        v-if="JSON.parse(item.contentDetail).type === 'voice' || JSON.parse(item.contentDetail).type === 'file'"
        class="type-voice m-r-8 m-b-8"
        :class="getClass(item)"
      >
        <div class="voice-content">
          <div class="voice-top">
            <svg-icon class="voice-default" :icon-class="'icon-content-' + JSON.parse(item.contentDetail).type" />
            <span>{{ item.contentName }}</span>
          </div>
          <div class="voice-bottom">
            <span>
              <span v-if="JSON.parse(item.contentDetail).type === 'voice'">
                {{ timeResolution(JSON.parse(item.contentDetail).duration) }}
              </span>
              <span v-else>{{ item.picType }}</span>
              |
              {{ formatBytes(JSON.parse(item.contentDetail).fileSize, 2) }}
            </span>
            <span>{{ item.userName }}</span>
          </div>
        </div>
        <div class="select-del">
          <svg-icon icon-class="delete-white" @click="onCancel(item)" />
          <span v-if="isPreview" style="color: #fff; font-size: 14px">|</span>
          <svg-icon v-if="isPreview" icon-class="icon-content-preview" @click="onPreview(item)" />
        </div>
      </div>

      <div
        v-if="
          JSON.parse(item.contentDetail).type === 'text' ||
          JSON.parse(item.contentDetail).type === 'sms' ||
          JSON.parse(item.contentDetail).type === 'msgmenu' ||
          JSON.parse(item.contentDetail).type === 'template'
        "
        class="type-text m-r-8 m-b-8"
      >
        <div class="text-content">
          <div class="text-top">
            <svg-icon class="default" :icon-class="'icon-content-' + JSON.parse(item.contentDetail).type" />
            <span>{{ item.contentName }}</span>
          </div>
          <div class="text-body">
            <span
              v-if="JSON.parse(item.contentDetail).type === 'msgmenu'"
              v-html="JSON.parse(item.contentDetail).headContentTxt"
            />
            <span v-else-if="JSON.parse(item.contentDetail).type === 'template'">
              {{ JSON.parse(JSON.parse(item.contentDetail).templateParameters[0].value).content[0].value }}
            </span>
            <span v-else v-html="fillContent(JSON.parse(item.contentDetail), attrs)" />
          </div>
        </div>
        <div class="select-del">
          <svg-icon icon-class="delete-white" @click="onCancel(item)" />
          <span v-if="isPreview" style="color: #fff; font-size: 14px">|</span>
          <svg-icon v-if="isPreview" icon-class="icon-content-preview" @click="onPreview(item)" />
        </div>
      </div>

      <div
        v-if="
          JSON.parse(item.contentDetail).type === 'news' ||
          JSON.parse(item.contentDetail).type === 'miniprogrampage' ||
          JSON.parse(item.contentDetail).type === 'mpnews'
        "
        class="type-link m-r-8 m-b-8"
        :class="getClass(item)"
      >
        <div class="link-content">
          <div class="link-top">
            <svg-icon class="link-default" :icon-class="'icon-content-' + JSON.parse(item.contentDetail).type" />
            <span>{{ item.contentName }}</span>
          </div>
          <div class="link-bottom">
            <div class="link-desc">
              <span>
                {{ getDesc(item) }}
              </span>
            </div>
            <div class="link-img">
              <img :src="getUrl(JSON.parse(item.contentDetail))" />
            </div>
          </div>
        </div>
        <div class="select-del">
          <svg-icon icon-class="delete-white" @click="onCancel(item)" />
          <span v-if="isPreview" style="color: #fff; font-size: 14px">|</span>
          <svg-icon v-if="isPreview" icon-class="icon-content-preview" @click="onPreview(item)" />
        </div>
      </div>
    </template>
  </div>
  <media-preview
    :media-list="previewMediaData"
    :is-edit="false"
    v-model:media-dialog-visible="previewDialog"
    @close="previewDialog = false"
  />
</template>

<script lang="ts" setup>
import { timeResolution, formatBytes } from "@/utils"
import { ObjTy } from "~/common.js";
import { fillContent } from "@/utils/material"
import MediaPreview from "@/components/MediaPreview/index.vue"
const attrs: any = useAttrs()

const props = defineProps({
  selectList: {
    type: Array<any>,
    default: () => []
  },
  isPreview: {
    type: Boolean,
    default: false
  },
  optionsConfig: {
    type: Object,
    default: {
      label: 'label',
      value: 'value',
      children: 'children'
    }
  },
  selectOption: {
    type: Array<any>,
    default: () => []
  }
})
const emit = defineEmits(["cancel", "change"])

const previewDialog = ref(false)
const previewMediaData = ref<any>([])

const getUrl = (value: ObjTy) => {
  let url = value?.picUrl || value?.voiceUrl
  return url?.indexOf("http") !== -1 || url?.indexOf("base64") !== -1
    ? url
    : (process.env.NODE_ENV === "development"
        ? process.env.VUE_APP_MEDIA_BASE_URL
        : (window as ObjTy).config.MEDIA_URL) + url
}

const getClass = (item: ObjTy) => {
  const type = JSON.parse(item.contentDetail).type
  let tmpClass = ''
  switch (type) {
    case 'miniprogrampage': tmpClass = 'type-applet-bg-color'; break
    case 'mpnews': tmpClass = 'type-mp-news-bg-color'; break
    case 'file': tmpClass = 'type-file-bg-color'; break
  }
  return tmpClass
}

const getDesc = (item: ObjTy) => {
  const type = JSON.parse(item.contentDetail).type
  let tmpDesc = ''
  switch (type) {
    case 'news': tmpDesc = JSON.parse(item.contentDetail).description; break
    case 'miniprogrampage': tmpDesc = JSON.parse(item.contentDetail).title; break
    case 'mpnews': tmpDesc =  JSON.parse(item.contentDetail).digest; break
  }
  return tmpDesc
}

const onCancel = (item: ObjTy) => {
  emit("cancel", item)
}

const onPreview = (val) => {
  previewMediaData.value = [JSON.parse(val.contentDetail)]
  previewDialog.value = true
}
</script>

<style lang="scss" scoped>
.select-content {
  display: flex;
  flex-wrap: wrap;

  .select-image {
    width: 80px;
    height: 80px;
    cursor: pointer;
    position: relative;
    flex-shrink: 0;

    > img {
      border-radius: 8px;
      width: 100%;
      height: inherit;
    }
  }
}
.select-del {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  top: -88px;
  opacity: 0;
  font-size: 28px;
  border-radius: 8px;

  &:hover {
    opacity: 1;
  }
}

.type-voice {
  position: relative;
  width: 200px;
  height: 80px;
  // margin: 5px;
  background-color: rgb(111 179 111 / 28%);
  border: 1px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  flex-shrink: 0;

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
      margin: 10px 5px 0 5px;
      padding-bottom: 8px;
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
}

.video-play {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 45px;
  position: absolute;
  top: 18px;
  left: 18px;
  opacity: 0.7;
  flex-shrink: 0;
}

.type-text {
  flex-shrink: 0;
  position: relative;
  width: 200px;
  height: 80px;
  background-color: rgb(219 222 227 / 28%);
  border: 1px solid transparent;
  border-radius: 8px;
  cursor: pointer;

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
      margin: 7px 0;

      > span {
        width: -webkit-fill-available;
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
}

.type-link {
  position: relative;
  width: 200px;
  height: 80px;
  // margin: 5px;
  background-color: rgb(216 198 161 / 28%);
  border: 1px solid transparent;
  border-radius: 8px;
  cursor: pointer;

  .link-content {
    padding: 7px;
    .link-top {
      display: flex;
      align-items: center;

      .link-default {
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

    .link-bottom {
      // margin: 12px 5px 0 5px;
      padding-bottom: 5px;
      display: flex;
      justify-content: space-between;
      word-break: break-all;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;

      .link-desc {
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

      .link-img {
        flex: 1;

        > img {
          width: 40px;
          height: 34px;
        }
      }
    }
  }
}

.type-file-bg-color {
  background-color: rgba(173, 201, 255, 0.28);
}

.type-applet-bg-color {
  background-color: rgb(156 211 194 / 28%);
}

.type-mp-news-bg-color {
  background-color: rgb(219 222 227 / 28%);
}
</style>
