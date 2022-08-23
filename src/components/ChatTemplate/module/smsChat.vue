<template>
  <div v-if="parseHtml" class="chat-bubble">
    <div class="face"><svg-icon icon-class="logo" /></div>
    <div class="chat-content">
      <span class="arrow" />
      <span @click="preview" v-html="parseHtml" />
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
  }
})

const emojiArr = ref(EmojiArr)
const parseHtml = ref<string>("")
const index = ref(0)

watch(
  () => props.info,
  (val) => {
    parseHtml.value = val.content ? fillContent(val) : ""
  }
)

onMounted(() => {
  if (props.info.content) {
    parseHtml.value = fillContent(props.info)
  }
})

function preview() {
  emit("preview")
}

function fillContent(info) {
  const arr = typeof info.content === "string" ? JSON.parse(info.content).content : info.content.content
  // 获取最大行数
  const maxNum = Math.max(...arr.map((a) => a.line_num))
  const tmpArr = groupBy(arr, (item) => [item.line_num])
  const mapObj = getReturnHtml(tmpArr)

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

function getReturnHtml(arr) {
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
            htmlStr += v.value
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
    > svg {
      font-size: 24px;
      margin: 5px auto;
      display: block;
    }
  }
  .chat-content {
    margin-left: 10px;
    padding: 8px 10px;
    max-width: 235px;
    word-break: break-word;
    background: #ffffff;
    position: relative;
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
  }
}
</style>
