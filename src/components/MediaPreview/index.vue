<template>
  <!-- v-bind="$attrs" 首个根节点需要包裹一层，不然会报警告属性不能自动集成 -->
  <div>
    <el-dialog
      v-model="visible"
      class="media_preview_container"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :append-to-body="true"
      :fullscreen="true"
      :show-close="false"
      :center="true"
      @open="changeData"
      @close="closeView"
    >
      <div class="pointer close-btn" @click="closeView">
        <svg-icon icon-class="close-white" />
      </div>
      <div class="preview-content">
        <div :style="{ visibility: isEdit ? 'visible' : 'hidden' }" class="left-oprations">
          <div class="icon-bg delete-icon pointer" @click.stop="deleteRecord">
            <svg-icon icon-class="delete-white" />
          </div>
          <div>删除</div>
        </div>
        <div @click.stop="">
          <media-ui ref="mediaPreviewRef" v-bind="$attrs" :media-detail="currentDetail" />
        </div>
        <div class="right-oprations" @click.stop="">
          <div v-if="currentDetail.type === 'image'" @click="handleCopyUrl(getUrl())" class="copy-btn">
            <div class="icon-bg pointer"><svg-icon icon-class="copy" /></div>
            <div>复制链接</div>
          </div>
          <div
            v-if="['image', 'video', 'voice'].indexOf(currentDetail.type) !== -1"
            class="download-btn"
            @click="download"
          >
            <div class="icon-bg pointer"><svg-icon icon-class="download" /></div>
            <div>下载</div>
          </div>
        </div>
      </div>
      <div class="media-footer">
        <div class="media-name">{{ formatName }}</div>
        <div class="media-desc">
          <span v-if="currentDetail.imageSize || currentDetail.duration">{{ formatText }}</span>
          <span v-if="currentDetail.fileSize">{{ getFileSize(currentDetail.fileSize, 2) }}</span>
        </div>
        <div class="page-tools">
          <div
            :style="{ visibility: positionIndex !== 0 ? 'visible' : 'hidden' }"
            class="btn pre-btn pointer"
            @click.stop="pre"
          >
            <svg-icon icon-class="pre" />
          </div>
          <div class="page-index">{{ positionIndex + 1 }}/{{ mediaList.length }}</div>
          <div
            :style="{ visibility: positionIndex !== mediaList.length - 1 ? 'visible' : 'hidden' }"
            class="btn pre-btn pointer"
            @click.stop="next"
          >
            <svg-icon icon-class="next" />
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import MediaUi from "./module/mediaUI.vue"
import useClipboard from "vue-clipboard3"
import { formatBytes, formatDate, timeResolution } from "@/utils"
import { ObjTy } from "~/common";
const type = { image: "picUrl", voice: "voiceUrl", video: "videoUrl" }

const { proxy }: any = getCurrentInstance()

const emit = defineEmits(["update:mediaDialogVisible", "close","delete"])

const props = defineProps({
  // 图片或者语音或者视频集合
  mediaList: {
    type: Array<any>,
    default: () => []
  },
  mediaDialogVisible: {
    type: Boolean,
    default: false
  },
  isMultiple: {
    type: Boolean,
    default: false
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

const currentDetail = ref<any>({})
const positionIndex = ref(0)

const visible = computed({
  get: () => props.mediaDialogVisible,
  set: (val) => emit("update:mediaDialogVisible", val)
})

const formatText = computed((val) => {
  val = val ? val :  currentDetail.value
  if (val?.type === "image") {
    return val.imageSize
  } else {
    return timeResolution(val.duration)
  }
})
const formatName = computed((item) => {
  item = item ? item :  currentDetail.value
  if (item?.name) {
    return item.name
  } else if (item?.title) {
    return item.title
  } else if (item?.type === "text") {
    const name = JSON.parse(item.content)
      .content.map((v) => v.value)
      .join("")
    return name.length > 20 ? name.substr(0, 20) + "..." : name
  } else if (item?.type === "image") {
    return item.picUrl.substr(item.picUrl.lastIndexOf("/") + 1)
  }
})

const getFileSize = (size, fixed) => {
  return formatBytes(size, fixed)
}
const getContent = () => {
  const content = props.mediaList[positionIndex.value]?.contentDetail || props.mediaList[positionIndex.value]?.content
  let contentDetail = props.isMultiple ? JSON.parse(content) : props.mediaList[positionIndex.value]

  // const contentDetail = props.isEdit
  //   ? JSON.parse(props.mediaList[positionIndex.value].contentDetail)
  //   : typeof props.mediaList[positionIndex.value] === "object"
  //   ? props.mediaList[positionIndex.value]
  //     : JSON.parse(props.mediaList[positionIndex.value])
  return contentDetail
}

const changeData = () => {
  if (props.mediaList.length <= 0) {
    closeView()
    // proxy.$showNotify({ type: "warning", content: "数据不能为空！" })
  } else {
    currentDetail.value = getContent()
  }
}

const getUrl = () => {
  return currentDetail.value[type[currentDetail.value.type]].indexOf("http") !== -1
    ? currentDetail.value[type[currentDetail.value.type]]
    : (process.env.NODE_ENV === "development" ? process.env.VUE_APP_MEDIA_BASE_URL : (window as ObjTy).config.MEDIA_URL) +
        currentDetail.value[type[currentDetail.value.type]]
}

const pre = () => {
  positionIndex.value--
  changeData()
}

const next = () => {
  positionIndex.value++
  changeData()
}
// 点击复制链接
const handleCopyUrl = (val) => {
   try {
    const { toClipboard } = useClipboard()
    toClipboard(val)
    proxy.$showNotify({ type: "success", content: "复制成功！" })
  } catch (e) {
    proxy.$showNotify({ type: "warning", content: "复制失败！" })
  }
}

const download = () => {
  const liveCodePath = currentDetail.value[type[currentDetail.value.type]]
  const linkUrl = getUrl()
  const time = formatDate(new Date())
  const lastIndexOfDot = liveCodePath.lastIndexOf(".")
  const fileType = liveCodePath.slice(lastIndexOfDot)
  const request = new XMLHttpRequest()
  request.open("GET", linkUrl, true)
  request.responseType = "blob"
  request.onload = (e) => {
    const url = window.URL.createObjectURL(request.response)
    const a = document.createElement("a")
    a.href = url
    a.download = `${currentDetail.value.name}-${time}${fileType}`
    a.click()
  }
  request.send()
}

const deleteRecord = () => {
  emit("delete", positionIndex.value)
  positionIndex.value = positionIndex.value > 0 ? positionIndex.value-- : 0
  changeData()
}

const closeView = () => {
  emit("close")
}
</script>
<style lang="scss">
.el-dialog.media_preview_container {
  background: transparent;
  box-shadow: none;
  .el-dialog__body {
    max-height: 100vh;
    max-width: 100%;
    background: transparent;
  }
}
</style>
<style lang="scss" scoped>
.media_preview_container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .close-btn {
    position: absolute;
    right: 56px;
    top: 56px;
    > svg {
      font-size: 40px;
      color: #5f6265;
    }
  }
  .preview-content {
    display: flex;
    justify-content: center;
    .left-oprations {
      margin-right: 24px;
      text-align: center;
      color: #dbdee4;
      font-size: 14px;
      line-height: 26px;
      display: flex;
      align-items: center;
      flex-direction: column;
    }
    .right-oprations {
      margin-left: 24px;
      text-align: center;
      color: #dbdee4;
      font-size: 14px;
      line-height: 26px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      .copy-btn {
        margin-bottom: 15px;
      }
    }

    .icon-bg {
      width: 48px;
      height: 48px;
      background: #f0f3f5;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      > svg {
        font-size: 24px;
      }
      &.delete-icon {
        background: #f06464;
      }
    }
  }
  .media-footer {
    width: 1000px;
    margin: 12px auto;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-size: 16px;
    .media-name {
      color: #ffffff;
      margin-bottom: 8px;
    }
    .media-desc {
      width: 160px;
      color: #b3b9c5;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
    }
    .page-tools {
      width: 230px;
      display: flex;
      font-size: 16px;
      color: #ffffff;
      justify-content: space-between;
      align-items: center;
      .btn {
        width: 48px;
        height: 48px;
        background: #888d97;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        > svg {
          font-size: 24px;
        }
        &:hover {
          background: #b3b9c5;
        }
      }
    }
  }
}
</style>
