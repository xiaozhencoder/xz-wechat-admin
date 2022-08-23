<template>
  <div class="chat-bubble">
    <div class="face"><svg-icon icon-class="logo" /></div>
    <div class="chat-content">
      <div v-for="(item, index) in words" :key="index" class="cell">
        <span v-if="index === 0" class="arrow" />
        <div v-if="item.type === 'text'" class="chat-text" v-html="formatText(item.content)" />
        <div v-if="item.type === 'image'">
          <img class="image-cover" :src="getUrl(item)" />
        </div>
        <div v-if="item.type === 'news'">
          <div class="chat-news">
            <div class="link-title">{{ item.title }}</div>
            <div class="link-info">
              <div class="link-desc">{{ item.description }}</div>
              <div class="link-cover"><img v-if="item.picUrl" :src="getUrl(item)" /></div>
            </div>
          </div>
        </div>
        <div v-if="item.type === 'voice'">
          <div class="chat-voice pointer" :style="{ width: voiceWidth(item) + 'px' }">
            <svg-icon class="voice-default" icon-class="voice-default" />
            <span>{{ getDuration(item) }}"</span>
          </div>
        </div>
        <div v-if="item.type === 'video'">
          <div class="chat-video">
            <img class="video-cover" :src="getUrl(item)" />
            <div class="play-btn">
              <div class="play-icon"><i class="el-icon-caret-right" /></div>
              <div class="duration">{{ getDuration(item) }}</div>
            </div>
            <div class="cover-title">{{ item.title }}</div>
          </div>
        </div>
        <div v-if="item.type === 'miniprogrampage'">
          <div class="chat-miniprogrampage">
            <div class="applet-head">
              <svg-icon class="applet-logo" icon-class="applet-logo" />
              <span>卓尔</span>
            </div>
            <div class="applet-title">{{ item.title }}</div>
            <div class="applet-cover"><img v-if="item.picUrl" :src="getUrl(item)" /></div>
            <div class="applet-footer">
              <svg-icon class="applet-icon" icon-class="applet-icon" />
              <span>小程序</span>
            </div>
          </div>
        </div>
        <div v-if="item.type === 'file'" class="file-info">
          <div class="file-cover"><svg-icon class="file-icon" icon-class="file-icon" /></div>
          <div class="file-desc">
            <div class="name">{{ item.name || item.fileName || "" }}</div>
            <div class="size">{{ getFileSize(item.fileSize, 2) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { EmojiArr } from "@/components/XzComm/XzEditor/module/common"
import { timeResolution, parseText, formatBytes } from "@/utils"
import { ObjTy } from "~/common"
const attrs = useAttrs()
console.log(attrs)

const props = defineProps({
  info: {
    type: Object,
    default: () => {}
  }
})

const words = computed(() => {
  return typeof props.info.content === "string" ? JSON.parse(props.info.content) : props.info.content
})

const formartHtml = computed(() => {
  let htmlStr = ""
  const arr = typeof props.info.content === "string" ? JSON.parse(props.info.content) : props.info.content
  arr.forEach((v) => {
    if (v.type === "text") {
      htmlStr += `<div class="cell">${v.name}</div>`
    } else if (v.type === "image") {
      const url =
        v.picUrl.indexOf("http") !== -1 || v.picUrl.indexOf("base64") !== -1
          ? v.picUrl
          : (process.env.NODE_ENV === "development"
              ? process.env.VUE_APP_MEDIA_BASE_URL
              : (window as ObjTy).config.MEDIA_URL) + v.picUrl
      htmlStr += `<div class="cell"><img class="image-cover" src="${url}"></div>`
    } else if (v.type === "news") {
      const url =
        v.picUrl.indexOf("http") !== -1 || v.picUrl.indexOf("base64") !== -1
          ? v.picUrl
          : (process.env.NODE_ENV === "development"
              ? process.env.VUE_APP_MEDIA_BASE_URL
              : (window as ObjTy).config.MEDIA_URL) + v.picUrl
      htmlStr += `<div class="cell">
                        <div class="chat-content">
                          <div class="link-title">${v.title}</div>
                          <div class="link-info">
                            <div class="link-desc">${v.description}</div>
                            <div class="link-cover"><img v-if="${url}" src="${url}"></div>
                          </div>
                        </div>
                      </div>`
    } else if (v.type === "voice") {
      const voiceWidth = v?.duration < 10 ? 75 : v?.duration * 10
      htmlStr += `<div class="cell">
                        <div class="chat-content pointer" :style="{width: ${voiceWidth} + 'px'}" >
                          <svg-icon class="voice-default" icon-class="voice-default" />
                          <span>${timeResolution(v.duration)}"</span>
                        </div>
                      </div>`
    } else if (v.type === "video") {
      const url =
        v.picUrl.indexOf("http") !== -1 || v.picUrl.indexOf("base64") !== -1
          ? v.picUrl
          : (process.env.NODE_ENV === "development"
              ? process.env.VUE_APP_MEDIA_BASE_URL
              : (window as ObjTy).config.MEDIA_URL) + v.picUrl
      htmlStr += `<div class="cell">
                      <div v-if="${v.picUrl}" class="chat-content">
                        <img class="video-cover" src="${url}">
                        <div class="play-btn">
                          <div class="play-icon"><i class="el-icon-caret-right" /></div>
                          <div class="duration">${timeResolution(v.duration)}</div>
                        </div>
                      <div class="cover-title">${v.title}</div>
                    </div>
                  </div>`
    } else if (v.type === "miniprogrampage") {
      const url =
        v.picUrl.indexOf("http") !== -1 || v.picUrl.indexOf("base64") !== -1
          ? v.picUrl
          : (process.env.NODE_ENV === "development"
              ? process.env.VUE_APP_MEDIA_BASE_URL
              : (window as ObjTy).config.MEDIA_URL) + v.picUrl
      htmlStr += `<div class="chat-miniprogrampage">
                      <div class="applet-head">
                        <svg-icon class="applet-logo" icon-class="applet-logo" />
                        <span>卓尔</span>
                      </div>
                      <div class="applet-title">${v.title}</div>
                      <div class="applet-cover"><img v-if="${v.picUrl}" src="${url}"></div>
                      <div class="applet-footer">
                        <svg-icon class="applet-icon" icon-class="applet-icon" />
                        <span>小程序</span>
                      </div>
                    </div>`
    } else if (v.type === "file") {
      htmlStr += `<div class="file-info">
                      <div class="file-cover"> <svg-icon class="file-icon" icon-class="file-icon" /></div>
                      <div class="file-desc">
                        <div class="name">${v.name || v.fileName || ""}</div>
                        <div class="size">${formatBytes(v.fileSize, 2)}</div>
                      </div>
                    </div>`
    }
  })
  return htmlStr
})

const getFileSize = (size, fiexed) => {
  return formatBytes(size, fiexed)
}
const formatText = (val) => {
  val = typeof val === "object" ? val : JSON.parse(val)
  return parseText(val.content, attrs, EmojiArr)
}
const getUrl = (item) => {
  return item.picUrl.indexOf("http") !== -1 || item.picUrl.indexOf("base64") !== -1
    ? item.picUrl
    : (process.env.NODE_ENV === "development"
        ? process.env.VUE_APP_MEDIA_BASE_URL
        : (window as ObjTy).config.MEDIA_URL) + item.picUrl
}
const getDuration = (item) => {
  return timeResolution(item.duration)
}
const voiceWidth = (item) => {
  return item?.duration < 10 ? 75 : item?.duration * 10
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
    position: relative;
    line-height: 20px;
    font-size: 14px;
    .file-info {
      min-width: 220px;
      color: #545860;
      font-size: 14px;
      display: flex;
      word-break: break-word;
      margin-top: 3px;
      line-height: 20px;
      background: #ffffff;
      padding: 5px 2px;
      .file-desc {
        flex: 1;
        word-break: break-all;
        display: flex;
        overflow: hidden;
        justify-content: center;
        align-items: flex-start;
        flex-direction: column;
        .name {
          text-overflow: ellipsis;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .size {
          font-size: 12px;
          color: #888d97;
        }
      }
      .file-cover {
        width: 60px;
        max-height: 60px;
        svg {
          height: 100%;
          width: 100%;
          object-fit: cover;
        }
      }
    }
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
    :deep(.cell) {
      max-width: 100%;
      overflow: hidden;
      margin-bottom: 25px;
      .image-cover {
        max-width: 100%;
        display: block;
      }
      .video-cover {
        width: 100%;
        object-fit: cover;
        max-height: 169px;
        display: block;
      }
      .play-btn {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        color: #ffffff;
        .play-icon {
          width: 34px;
          height: 34px;
          background: #e5e5e5;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 5px;
          i {
            color: #000000;
          }
        }
        .duration {
          color: #ffffff;
          font-size: 12px;
          text-align: center;
        }
      }
      .cover-title {
        position: absolute;
        bottom: 3px;
        color: #ffffff;
        line-height: 18px;
        font-size: 14px;
        padding: 0px 16px;
        word-break: break-word;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
      .chat-text {
        background: #ffffff;
        padding: 10px;
      }

      .chat-voice {
        max-width: 100%;
        padding: 5px;
        background: #ffffff;
        border-radius: 3px;
      }
      .chat-video {
        position: relative;
      }
      .chat-miniprogrampage,
      .chat-news {
        background: #ffffff;
        padding: 10px;
      }
      .voice-default {
        margin-right: 7px;
        font-size: 16px;
      }
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
      .applet-title {
        color: #26292e;
        font-size: 14px;
        word-break: break-word;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        line-height: 28px;
      }
      .applet-cover {
        width: 100%;
        img {
          width: 100%;
          max-height: 120px;
          object-fit: cover;
        }
      }
      :deep(.link-text) {
        word-break: break-word;
        color: #576b95;
      }
    }
  }
}
</style>
