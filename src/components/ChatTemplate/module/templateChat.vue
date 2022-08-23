<template>
  <div class="chat-bubble">
    <div v-if="templateParameters && templateParameters.length > 0" class="chat-content">
      <div class="rich-desc">
        <div v-for="(item, index) in templateParameters" :key="index" class="cell">
          <span class="menu">{{ item.title ? item.title + ":" : hasVirtualTitle ? item.name : "" }}</span>
          <span v-html="generatHtml(item)" />
        </div>
      </div>
      <div v-if="info.openTypeParameters && info.openTypeParameters.type === 'H5'" class="rich-arrow">
        详情
        <svg-icon class="common-arrow-right" icon-class="arrow-right" />
      </div>
      <div v-if="info.openTypeParameters && info.openTypeParameters.type === 'MINI_PROGRAM'" class="rich-arrow">
        <span class="left-icon">
          <span class="radius" />
          小程序
        </span>
        <div class="right-icon">
          <svg-icon class="common-applet-right" icon-class="applet-icon" />
          微信小程序
          <svg-icon class="common-arrow-right" icon-class="arrow-right" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { EmojiArr } from "@/components/XzComm/XzEditor/module/common"
const attrs: any = useAttrs()
console.log(attrs)

const emit = defineEmits(["preview"])
const props = defineProps({
  info: {
    type: Object,
    default: () => {}
  },
  hasVirtualTitle: {
    type: Boolean,
    default: false
  }
})

const emojiArr = ref(EmojiArr)
const index = ref(0)

const templateParameters = computed(() => {
  return typeof props.info.templateParameters === "string"
    ? JSON.parse(props.info.templateParameters)
    : props.info.templateParameters
})

function generatHtml(item) {
  const content = item.value || item.oldShowValue
  if (content.indexOf("color") !== -1) {
    return fillContent(content)
  } else {
    return content
  }
}
function fillContent(info) {
  const arr = typeof info === "string" ? JSON.parse(info).content : info.content
  // 获取最大行数
  const maxNum = Math.max(...arr.map((a) => a.line_num))
  const attrArray = arr.filter((item) => item.type === "attr")
  if (attrArray.length > 0 && attrs.selectOption.length === 0) {
    return ""
  }
  const tmpArr = groupBy(arr, (item) => [item.line_num])
  const mapObj = getReturnHtml(tmpArr, JSON.parse(info).color)

  let html = ""
  for (let i = 0; i < maxNum; i++) {
    const obj = mapObj[i + 1]
    if (obj) {
      html += obj
    } else {
      html += `<br>`
    }
  }
  return html.replace(/undefined/g, "")
}

function groupBy(array, f) {
  const groups = {}
  array.forEach(function (o) {
    const group = JSON.stringify(f(o))
    groups[group] = groups[group] || []
    groups[group].push(o)
  })
  return Object.keys(groups).map(function (group) {
    return groups[group]
  })
}
function getReturnHtml(arr, fontColor) {
  const mapObj = {}
  for (let i = 0; i < arr.length; i++) {
    const tArr = arr[i]
    let htmlStr = ""
    tArr.forEach((v) => {
      index.value = v.line_num
      switch (v.type) {
        case "text":
          if (v.value.indexOf("#客户昵称#") !== -1) {
            htmlStr += `<span style="color: #2749F1">客户昵称</span>`
          } else {
            htmlStr += `<span style="color:${fontColor}">${v.value}</span>`
          }
          break
        case "emoji":
          emojiArr.value.forEach((e) => {
            if (e[0] === v.value) {
              htmlStr += `<img class="emoji-icon" src="https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/${e[1]}.gif" alt="${e[0]}"/>`
            }
          })
          break
        case "attr":
          if (v.value) {
            let item = attrs.selectOption.find((u) => u[attrs.optionsConfig.value] === v.value.split(".")[1])
            if (item) htmlStr += `<span style="color: #2749F1">${item[attrs.optionsConfig.label]}</span>`
          }
          break
        case "hyperlink":
        case "minProgram":
          htmlStr += `<span style="color: #2749F1">${v.name ? v.name.split(".")[1] : ""}</span>`
          break
      }
    })
    mapObj[index.value] = `<div style="word-break:break-all;" index="${index.value}">${htmlStr}</div>`
  }
  return mapObj
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
    img {
      width: 100%;
    }
  }
  .chat-content {
    width: 100%;
    word-break: break-word;
    background: #ffffff;
    position: relative;
    line-height: 20px;
    border-radius: 4px;
    .rich-desc {
      color: #737373;
      font-size: 12px;
      padding: 0px 17px;
      word-break: break-word;
      margin: 16px auto;
      line-height: 25px;
      .cell {
        display: flex;
        .menu {
          min-width: 60px;
        }
      }
    }
    .rich-arrow {
      height: 32px;
      border-top: 1px solid #eeeeee;
      line-height: 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0px 10px;
      .left-icon {
        display: flex;
        width: 70px;
        justify-content: space-between;
        margin-right: auto;
        align-items: center;
        .radius {
          display: inline-block;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #eeeeee;
        }
      }

      .right-icon {
        width: 115px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-left: auto;
        .common-applet-right {
          font-size: 15px;
        }
      }
      .common-arrow-right {
        font-size: 20px;
      }
    }
  }
}
</style>
