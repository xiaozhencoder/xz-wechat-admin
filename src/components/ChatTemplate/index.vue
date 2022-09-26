<template>
  <div class="preview-container">
    <div class="view">
      <div class="head">
        <i class="el-icon-arrow-left" />
        效果预览
      </div>
      <div class="body">
        <template v-for="(item, index) in info" :key="index">
          <component
            v-if="componentName(item)"
            :is="componentName(item)"
            :info="item"
            v-bind="$attrs"
            it="showEdit"
            @preview="preview"
          />
        </template>
      </div>
      <div v-if="hasTestSendBtn" class="foot">
        <el-button slot="reference" plain class="test-btn" @click.native="testSend">发送效果测试</el-button>
      </div>
    </div>
    <!-- <send-test
      v-if="!customTestSend"
      :info="info"
      :reply-type="2"
      :send-dialog="sendDialog"
      @closeTestDialog="sendDialog = false"
    /> -->
    <!-- <media-preview
      :media-list="[info]"
      :media-dialog-visible="previewDialog"
      @close="previewDialog = false"
    /> -->
  </div>
</template>

<script lang="ts" setup>
import AppletChat from "./module/appletChat.vue"
import ChatmenuChat from "./module/chatmenuChat.vue"
import ImageChat from "./module/imageChat.vue"
import LinkChat from "./module/linkChat.vue"
import RichChat from "./module/richChat.vue"
import TextChat from "./module/textChat.vue"
import FileChat from "./module/fileChat.vue"
import VideoChat from "./module/videoChat.vue"
import VoiceChat from "./module/voiceChat.vue"
import TemplateChat from "./module/templateChat.vue"
import HtmlContentChat from "./module/htmlContentChat.vue"
import MultipleChat from "./module/multipleChat.vue"
import SmsChat from "./module/smsChat.vue"
// import SendTest from "@/components/SendTest"
import MediaPreview from "@/components/MediaPreview/index.vue"

import { formValidate } from "./config"

const typeText = {
  text: markRaw(TextChat),
  image: markRaw(ImageChat),
  mpnews: markRaw(RichChat),
  voice: markRaw(VoiceChat),
  video: markRaw(VideoChat),
  msgmenu: markRaw(ChatmenuChat),
  miniprogrampage: markRaw(AppletChat),
  news: markRaw(LinkChat),
  sms: markRaw(SmsChat),
  template: markRaw(TemplateChat),
  content: markRaw(HtmlContentChat),
  multiple: markRaw(MultipleChat),
  file: markRaw(FileChat)
}

const { proxy }: any = getCurrentInstance()

const emit = defineEmits(["close", "sendTest"])

const props = defineProps({
  info: {
    type: Object,
    default: () => {}
  },
  // 是否有测试发送按钮
  hasTestSendBtn: {
    type: Boolean,
    default: true
  },
  // 是否自己引入发送测试组件（为了某些特殊页面需要传递特殊参数，如短信）
  customTestSend: {
    type: Boolean,
    default: false
  },
  // 仅供文本参数使用，由于编辑器对象无法转换成文本，暂时用该属性控制(已删除)
  showEdit: {
    type: Boolean,
    default: false
  }
})

const sendDialog = ref<boolean>(false)
const previewDialog = ref<boolean>(false) // 预览框

const componentName = computed(() => {
  return (item) => {
    return Object.keys(item).length > 1 ? typeText[item.type] : ""
  }
})

function preview() {
  previewDialog.value = true
}

function testSend() {
  // 表单验证
  let errorText = ""
  const forms = formValidate[props.info.type]
  for (let i = 0; i < forms.length; i++) {
    if (!props.info[forms[i].key]) {
      errorText = forms[i].errorText
      break
    }
  }
  if (errorText) {
    proxy.$showNotify({
      type: "warning",
      content: errorText
    })
    return
  }
  if (!props.customTestSend) {
    sendDialog.value = true
  } else {
    emit("sendTest")
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
.preview-container {
  width: 100%;
  flex: 1;
  height: 100%;
  display: flex;
  background: #dbdee4;
  border-radius: 0px 3px 3px 0px;
  .view {
    position: relative;
    width: 326px;
    max-height: 656px;
    min-height: 588px;
    height: calc(100vh - 152px);
    background: #f0f1f5;
    box-shadow: 0px -20px 22px 0px rgba(23, 22, 23, 0.07);
    border-radius: 4px;
    left: 50%;
    transform: translate(-50%);
    .head {
      height: 50px;
      text-align: center;
      line-height: 50px;
      font-size: 14px;
      color: #888d97;
      background: #ffffff;
      i {
        float: left;
        width: 8px;
        height: 15px;
        margin-top: 17.5px;
        margin-left: 17px;
      }
    }
    .body {
      background: #f0f1f5;
      height: calc(100% - 50px);
      overflow: scroll;
      &:hover {
        &::-webkit-scrollbar-thumb {
          background-color: rgba(157, 165, 183, 0.4);
        }
      }
    }
    .foot {
      position: absolute;
      bottom: 0px;
      width: 100%;
      height: 50px;
      background: #ffffff;
      :deep(.test-btn) {
        margin: auto;
        color: #26292e;
        display: block;
        margin-top: 9px;
        padding: 0px 5px;
      }
    }
  }
}
.test-phone-body {
  display: flex;
  align-items: center;
  span {
    width: 110px;
  }
}
.common-dialog-body {
  .test-phone {
    display: flex;
    align-items: center;
    span {
      width: 150px;
    }
  }
  .scan-code-test {
    display: flex;
    flex-direction: column;
    & > div {
      display: flex;
      .qr-code {
        flex: 0 0 100px;
        height: 100px;
        border: 1px solid #f1f1f1;
      }
      .qr-code-tips {
        flex: 1;
        display: flex;
        align-items: flex-end;
        i {
          margin: 14px;
          flex: 0 0 16px;
          height: 16px;
          font-size: 16px;
          color: $color-primary;
        }
        div {
          display: flex;
          flex: 1;
          flex-direction: column;
          justify-content: center;
          line-height: 22px;
        }
      }
    }
  }
}
</style>
