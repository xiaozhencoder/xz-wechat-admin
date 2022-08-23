<template>
  <div class="xz-editor" :class="[disabled ? 'no-click' : '']">
    <div class="xz-editor__tools" tabindex="0">
      <div v-for="(tool, i) in toolsConfig" :key="i" tabindex="0">
        <div v-if="tool.type === 'emoji'">
          <el-popover
            ref="emojiPopoverRef"
            placement="top-start"
            width="400px"
            popper-class="emoji-content"
            trigger="click"
            :disabled="disabled"
          >
            <template #reference>
              <div class="tool-item" :class="[disabled ? 'no-click' : '']">
                <svg-icon icon-class="emoji" />
                {{ tool.val }}
              </div>
            </template>
            <emoji @pushEmoji="pushEmoji" />
          </el-popover>
        </div>
        <div
          v-else-if="tool.type === 'attr'"
          tabindex="0"
          class="tool-item"
          :class="[disabled ? 'no-click disabled' : '']"
          @click="pushAttr"
        >
          <svg-icon icon-class="add-circle-black" />
          {{ tool.val }}
        </div>
        <div
          v-else-if="tool.type === 'insertNickname'"
          class="tool-item"
          :class="[disabled ? 'no-click disabled' : '']"
          @click="pushNickName"
        >
          <svg-icon icon-class="add-circle-black" />
          {{ tool.val }}
        </div>
        <div
          v-else-if="tool.type === 'hyperlink'"
          class="tool-item"
          :class="[disabled ? 'no-click disabled' : '']"
          @click="pushLink"
        >
          <svg-icon icon-class="link-circle" />
          {{ tool.val }}
        </div>
        <div
          v-else-if="tool.type === 'minProgram'"
          class="tool-item"
          :class="[disabled ? 'no-click disabled' : '']"
          @click="pushMinProgram"
        >
          <svg-icon icon-class="add-circle-black" />
          {{ tool.val }}
        </div>
        <div v-else-if="tool.type === 'color'" class="tool-item" :class="[disabled ? 'no-click disabled' : '']">
          <el-color-picker ref="colorRef" v-model="color" />
          {{ tool.val }}
        </div>
      </div>
    </div>
    <xz-custom-select
      ref="attrSelect"
      type="Simple"
      :custom-class="'custom_' + uniqueKey"
      v-model:value="reactiveData.selectValue"
      :options="selectOption"
      :config="optionsConfig"
      @visible="visibleChange"
      @change="setUserAttr"
    />
    <default-popover
      :ref="defaultRef"
      v-model:value="reactiveData.defaultValue"
      v-model:visible="reactiveData.defaultVisible"
      :disabled="disabled"
      :unique-key="uniqueKey"
      @handleClose="handleClose"
      @handleConfirm="setUserAttrDefaultValue"
    />

    <link-popover
      :ref="linkRef"
      v-model:value="reactiveData.linkObj"
      v-model:visible="reactiveData.linkVisible"
      :disabled="disabled"
      :unique-key="uniqueKey"
      @handleClose="handleClose"
      @handleConfirm="setLinkValue"
    />
    <min-program-popover
      :ref="minProgramRef"
      v-model:value="reactiveData.minProgramObj"
      v-model:visible="reactiveData.minProgramVisible"
      :disabled="disabled"
      :unique-key="uniqueKey"
      @handleClose="handleClose"
      @handleConfirm="setMinProgramValue"
    />

    <div
      id="editorContent"
      class="editor-body"
      tabindex="-1"
      :class="uniqueKey"
      :contentEditable="!disabled"
      @paste="paste($event), handleOther($event), getCursorPosition($event), getEditData()"
      @input="handleOther($event), getCursorPosition($event), getEditData()"
      @click="getCursorPosition($event)"
    >
      <div :class="'xz-editor__content ' + editRef" contentEditable="true" />
    </div>
    <div v-show="disabled" class="mask" />
  </div>
</template>

<script lang="ts" setup name="XzEditor">
import Emoji from "./module/emoji.vue"
import XzCustomSelect from "@/components/XzComm/XzCustomSelect/index.vue"
import DefaultPopover from "./module/default.vue"
import LinkPopover from "./module/link.vue"
import MinProgramPopover from "./module/minProgram.vue"

import {
  EmojiArr,
  getNickNameTemplate,
  getMinProgramTemplate,
  getLinkTemplate,
  getAttrTemplate,
  getEmojiTemplate
} from "./module/common"
import { getAbsLeft, getAbsTop } from "@/utils"
import { ObjTy } from "~/common"
const { proxy }: any = getCurrentInstance()

const props = defineProps({
  toolsSetting: {
    type: Array,
    default: () => ["emoji"]
  },
  value: {
    type: String,
    default: ""
  },
  placeholder: {
    type: String,
    default: "请输入内容"
  },
  maxlength: {
    type: Number,
    default: 600
  },
  disabled: {
    type: Boolean,
    default: false
  },
  isLimitMaxLength: {
    type: Boolean,
    default: false
  },
  showWordLimit: {
    type: Boolean,
    default: false
  },
  uniqueKey: {
    type: String,
    default: "editor-body"
  },
  // 选项配置
  optionsConfig: {
    type: Object,
    require: false,
    default: () => ({
      label: "label",
      value: "value",
      children: "children"
    })
  },
  selectOption: {
    type: Array<ObjTy>,
    default: () => []
  }
})

const emit = defineEmits(["update:value", "change", "input", "getEditDataHtml"])

const defaultRef = ref<any>("defaultRef" + props.uniqueKey)
const linkRef = ref<any>("linkRef" + props.uniqueKey)
const minProgramRef = ref<any>("minProgramRef" + props.uniqueKey)

const reactiveData = reactive<ObjTy>({
  editRef: "edit_" + Date.now(),
  index: 1,
  flag: true,
  emojiArr: EmojiArr,
  sectionObj: {},
  toolsConfigAll: [
    { type: "emoji", val: "表情" },
    { type: "attr", val: "属性" },
    { type: "hyperlink", val: "链接" },
    { type: "minProgram", val: "小程序" },
    { type: "insertNickname", val: "客户昵称" },
    { type: "color", val: "颜色" }
  ],
  selectEl: null,
  selectValue: "",

  defaultEl: null,
  defaultVisible: false,
  defaultValue: "",

  linkEl: null,
  linkVisible: false,
  linkObj: {
    name: "",
    url: "http://"
  },

  minProgramEl: null,
  minProgramVisible: false,
  minProgramObj: {
    name: "",
    appId: "",
    url: ""
  },
  editorData: [],
  color: "#000",
  isRead: false
})

const { editRef, color } = toRefs(reactiveData)

const toolsConfig = computed(() => {
  return reactiveData.toolsConfigAll.filter((item) => {
    return props.toolsSetting.includes(item.type)
  })
})

watch(
  () => props.value,
  (val, oldVal) => {
    if (val === oldVal) return
    try {
      reactiveData.color = JSON.parse(val).color || "#000"
      const contentArr = JSON.parse(val).content
      reactiveData.editorData = contentArr.map((c) => {
        if (!c.line_num) {
          c.line_num = 1
        }
        return c
      })
      // this.editorData = JSON.parse(val).content
    } catch (e) {
      reactiveData.color = "#000"
      reactiveData.editorData = []
    }
    proxy.$nextTick(() => {
      if (reactiveData.disabled) initHtml(reactiveData.editorData, null)
    })
  }
)

watch(() => props.selectOption, (newVal, oldVal) => {
  if (newVal.length > 0 && reactiveData.editorData.length > 0) {
    initHtml(reactiveData.editorData, null)
    emit("getEditDataHtml", getEditDataHtml(reactiveData.editorData))
  }
})

watch(() => reactiveData.color, (newVal, oldVal) => {
  const val = reactiveData.editorData
  let result = ""
  if (val.length) {
    result = JSON.stringify({
      content: val,
      color: reactiveData.color
    })
  }
  emit("change", result)
  emit("input", result)
  emit("getEditDataHtml", getEditDataHtml(val))
})

watch(() => reactiveData.editorData, (newVal, oldVal) => {
  let result = ""
  if (newVal.length) {
    result = JSON.stringify({
      content: newVal,
      color: reactiveData.color
    })
  }
  emit("change", result)
  emit("input", result)
  emit("getEditDataHtml", getEditDataHtml(newVal))
}, {deep: true})


onMounted(() => {
  if (document.querySelector("body")) document.querySelector("body")?.addEventListener("click", handleBodyClick)
  if (document.querySelector("." + props.uniqueKey)) document.querySelector("." + props.uniqueKey)?.addEventListener("click", listenerEdit)
  reactiveData.isRead = !reactiveData.isRead
  proxy.$nextTick(() => {
    initHtml(reactiveData.editorData, null)
    setPlaceholder()
  })

  if (!props.disabled) {
    getCursorPosition(null)
  }
})

onBeforeUnmount(() => {
  if (document.querySelector("body"))
    document.querySelector("body")?.removeEventListener("click", handleBodyClick)
  if (document.querySelector("." + props.uniqueKey))
    document.querySelector("." + props.uniqueKey)?.removeEventListener("click", listenerEdit)
})


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

function initHtml(arr, type) {
  // 获取最大行数
  const maxNum = Math.max(...arr.map((a) => a.line_num))

  // 每行数据
  const tmpArr = groupBy(arr, (item) => [item.line_num])
  const mapObj = type && type === "show" ? getReturnHtml(tmpArr) : getHtmlData(tmpArr)

  let html = ""
  for (let i = 0; i < maxNum; i++) {
    const obj = mapObj[i + 1]
    if (obj) {
      html += obj
    } else {
      html +=
        type && type === "show"
          ? `<br>`
          : `<div class="xz-editor__content ${reactiveData.editRef}" contenteditable="true" index="${i + 1}"></div>`
    }
  }

  if (type && type === "show") {
    return html.replace(/undefined/g, "")
  }
  const el = proxy.$el?.querySelector("." + props.uniqueKey)
  if (html && el) {
    el.innerHTML = html.replace(/undefined/g, "")
  }
}

function getReturnHtml(arr) {
  const mapObj = {}
  for (let i = 0; i < arr.length; i++) {
    const tArr = arr[i]
    let htmlStr = ""
    tArr.forEach((v) => {
      reactiveData.index = v.line_num
      switch (v.type) {
        case "text":
          if (v.value.indexOf("#客户昵称#") !== -1) {
            htmlStr += `<span style="color: #2749F1">客户昵称</span>`
          } else {
            htmlStr += v.value
          }
          break
        case "emoji":
          reactiveData.emojiArr.forEach((e) => {
            if (e[0] === v.value) {
              htmlStr += `<img class="emoji-icon" src="https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/${e[1]}.gif" alt="${e[0]}"/>`
            }
          })
          break
        case "attr":
          if (v.value) {
            let item = props.selectOption.find((u) => u[props.optionsConfig.value] === v.value.split(".")[1])
            if (item)
              htmlStr += `<span style="color: #2749F1">${item[props.optionsConfig.label]}</span>`
          }
          break
        case "hyperlink":
        case "minProgram":
          htmlStr += `<span style="color: #2749F1">${v.name ? v.name.split(".")[1] : ""}</span>`
          break
      }
    })
    mapObj[reactiveData.index] = `<div style="word-break:break-all; color:${reactiveData.color}" index="${reactiveData.index}">${htmlStr}</div>`
  }
  return mapObj
}

function  getHtmlData(arr) {
  const icon = "black"
  const mapObj = {}
  for (let i = 0; i < arr.length; i++) {
    const tArr = arr[i]
    let htmlStr = ""
    tArr.forEach((v) => {
      reactiveData.index = v.line_num
      switch (v.type) {
        case "text":
          if (v.value.indexOf("#客户昵称#") !== -1) {
            htmlStr += getNickNameTemplate(v)
          } else {
            htmlStr += v.value
          }
          break
        case "emoji":
          reactiveData.emojiArr.forEach((e) => {
            if (e[0] === v.value) {
              htmlStr += getEmojiTemplate(e)
            }
          })
          break
        case "attr":
          if (v.value) {
            let item = props.selectOption.find((u) => u[props.optionsConfig.value] === v.value.split(".")[1])
            let name = ""
            if (item) name = item[props.optionsConfig.label]
            htmlStr += getAttrTemplate(
              props.uniqueKey,
              v,
              name,
              v.defaultValue ? icon : "gray"
            )
          }
          break
        case "hyperlink":
          htmlStr += getLinkTemplate(props.uniqueKey, v, icon)
          break
        case "minProgram":
          htmlStr += getMinProgramTemplate(props.uniqueKey, v, icon)
          break
      }
    })
    mapObj[
      reactiveData.index
    ] = `<div class="xz-editor__content ${reactiveData.editRef}" contenteditable="true" index="${reactiveData.index}">${htmlStr}</div>`
  }
  return mapObj
}

function  getEditDataHtml(val) {
  return initHtml(val, "show")
}

function  visibleChange(val) {
  if (val) {
    close()
  }
  handleBorder(val, reactiveData.selectEl)
}

function handleClose() {
  close()
  proxy.$refs.attrSelect.$refs.popoverRef.hide()
}

function close() {
  reactiveData.defaultVisible = false
  reactiveData.linkVisible = false
  reactiveData.minProgramVisible = false
  handleBorder(reactiveData.defaultVisible, reactiveData.defaultEl)
  handleBorder(reactiveData.linkVisible, reactiveData.linkEl)
  handleBorder(reactiveData.minProgramVisible, reactiveData.minProgramEl)
}

// 添加表情
function pushEmoji(event, emoji) {
  if (!checkSelectNode()) return
  handleClose()
  const template = getEmojiTemplate(emoji)
  insertHtmlAtCaret(template)
  setPlaceholder()
  getCursorPosition(null)
  proxy.$refs.emojiPopoverRef[0].hide()
  getEditData()
}

    // 添加属性
function  pushAttr(obj) {
  if (!checkSelectNode()) return
  handleClose()
  let name = ""
  if (obj.value) {
    const item = reactiveData.selectOption.find((u) => u[props.optionsConfig.value] === obj.value.split(".")[1])
    if (item) name = item[props.optionsConfig.label]
  }
  const template = getAttrTemplate(props.uniqueKey, obj, name, "gray")
  insertHtmlAtCaret(template)
  setPlaceholder()
  getCursorPosition(null)
}

function pushNickName(obj) {
  if (!checkSelectNode()) return
  handleClose()
  const template = getNickNameTemplate(obj)
  insertHtmlAtCaret(template)
  setPlaceholder()
  getCursorPosition(null)
  getEditData()
}

function pushLink(obj) {
  if (!checkSelectNode()) return
  handleClose()
  const template = getLinkTemplate(props.uniqueKey, obj, "gray")
  insertHtmlAtCaret(template)
  setPlaceholder()
  getCursorPosition(null)
}

function pushMinProgram(obj) {
  if (!checkSelectNode()) return
  handleClose()
  const template = getMinProgramTemplate(props.uniqueKey, obj, "gray")
  insertHtmlAtCaret(template)
  setPlaceholder()
  getCursorPosition(null)
}

function getIconPng(name) {
  // return new URL(`/images/${name}.png`, import.meta.url).href
  return `/images/${name}.png`
}

function handleOther(ev) {
  // 隐藏userAttr 选择框
  const attrSelect = proxy.$el?.querySelector(".select-container")
  attrSelect && (attrSelect.style.display = "none")

  // 文本框为最后一行时，解决回退删除问题
  const editorBody = proxy.$el?.querySelector("." + proxy.uniqueKey)
  const childNodes = editorBody.childNodes
  if (
    ev.inputType === "deleteContentBackward" &&
    (childNodes.length === 0 || (childNodes.length === 1 && childNodes[0].nodeName === "BR"))
  ) {
    editorBody.innerHTML = `<div class="xz-editor__content ${reactiveData.editRef}" contenteditable="true" index="1"></div>`
    getDefaultPosition(null)
  }

  if (ev.inputType === "insertParagraph") {
    ++reactiveData.index
    const editorContents = proxy.$el?.querySelectorAll(".xz-editor__content")
    for (let i = 0; i < editorContents.length; i++) {
      const edit = editorContents[i]
      edit.setAttribute("index", i + 1)
    }
  }

  deleteBr()

  setPlaceholder()

  handleClose()
}

    // 设置placeholder
function setPlaceholder() {
  const editorBody = proxy.$el?.querySelector("." + props.uniqueKey)
  const rules = document.styleSheets[0].rules
  if (editorBody.childNodes.length === 1 && !editorBody.childNodes[0].textContent) {
    if (rules[0].cssText.indexOf(`.${reactiveData.editRef}::before`) === -1) {
      document.styleSheets[0].insertRule(
        `.${reactiveData.editRef}::before{content:
        '${props.placeholder}';color: #A9A9A9;}`,
        0
      )
    }
    // 处理回退删除时数据为空浏览器自带的<br>
    deleteBr()
  } else {
    for (let i = 0; i < rules.length; i++) {
      if (rules[i].cssText.indexOf(`.${reactiveData.editRef}::before`) !== -1) {
        document.styleSheets[0]?.removeRule(i)
      }
    }
  }
}

    // 回退时，删除自动生成的<br>标签
function  deleteBr() {
  const editorContents = proxy.$el?.querySelectorAll(".xz-editor__content")
  for (let i = 0; i < editorContents.length; i++) {
    const edit = editorContents[i]
    if (edit && edit.childNodes.length > 0) {
      edit.childNodes.forEach((e) => {
        if (e.nodeName === "BR") {
          edit.removeChild(e)
        }
      })
    }
  }
}

function getDefaultPosition(sel) {
  const xzContent = document.getElementsByClassName(reactiveData.editRef)
  const editN = xzContent[xzContent.length - 1]
  // const doc = editN?.ownerDocument || editN?.document
  // const win = doc?.defaultView || doc?.parentWindow
    const doc = editN?.ownerDocument
  const win = doc?.defaultView

  if (typeof win?.getSelection !== "undefined") {
    // 谷歌、火狐
    sel = win.getSelection()
    if (sel.rangeCount > 0) {
      // 选中的区域
      reactiveData.sectionObj.lineNum = reactiveData.sectionObj.lineNum ? reactiveData.sectionObj.lineNum : xzContent.length
      reactiveData.sectionObj.anchorNode =
        (sel.anchorNode && sel.anchorNode.classList?.contains(reactiveData.editRef)) ||
        (sel.anchorNode.nodeType === 3 && sel.anchorNode.length >= 0)
          ? sel.anchorNode
          : editN
      reactiveData.sectionObj.anchorOffset = sel.anchorOffset
    }
  }
}

    // 获取当前光标位置
function getCursorPosition(ev) {
  let sel
  if (ev) {
    const doc = ev.target?.ownerDocument || ev.target?.document
    const win = doc?.defaultView || doc?.parentWindow
    if (typeof win.getSelection !== "undefined") {
      // 谷歌、火狐
      sel = win.getSelection()
      if (sel.rangeCount > 0) {
        // 选中的区域
        let node = sel.anchorNode
        if (sel.anchorNode.nodeType === 3) {
          node = sel.anchorNode.parentNode
        }
        const xzContent = document.getElementsByClassName(reactiveData.editRef)
        const editN = xzContent[xzContent.length - 1]
        reactiveData.sectionObj.lineNum = parseInt(node.getAttribute("index"))
        reactiveData.sectionObj.anchorNode =
          (sel.anchorNode && sel.anchorNode.classList?.contains(reactiveData.editRef)) ||
          (sel.anchorNode.nodeType === 3 && sel.anchorNode.length >= 0)
            ? sel.anchorNode
            : editN
        reactiveData.sectionObj.anchorOffset = sel.anchorOffset
      } else {
        getDefaultPosition(sel)
      }
    }
  } else {
    getDefaultPosition(sel)
  }
  deleteEmptyText()
}

    // 获取位置时，鼠标最后会有空文本，不清除会导致，回退清除数据时浏览器自动生成<br>
function deleteEmptyText() {
  const editorContents = proxy.$el?.querySelectorAll(".xz-editor__content")
  for (let i = 0; i < editorContents.length; i++) {
    const edit = editorContents[i]
    if (edit && edit.childNodes.length > 0) {
      edit.childNodes.forEach((e, index) => {
        if (e.nodeType === 3 && e.textContent === "") {
          edit.removeChild(e)
        }
        // 当前文本行，光标定位到头部按回退键，回退到上一行时，文本会自动生成span标签及样式
        if (e.nodeType === 1 && e.nodeName === "SPAN") {
          edit.childNodes[index].before(document.createTextNode(e.textContent))
          edit.removeChild(e)
          setCursorPosition()
        }
      })
    }
  }
}

function getNodesData(nodes, index) {
  const tmpArr: any = []
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i]
    if (n.nodeType === 3) {
      if (n.data) {
        tmpArr.push({ type: "text", value: n.data, line_num: index + 1 })
      } else {
        const data = setEditData(n, index + 1)
        if (data) {
          tmpArr.push(data)
        }
      }
    } else if (n.nodeType === 1) {
      const data = setEditData(n, index + 1)
      if (data) {
        tmpArr.push(data)
      }
    }
  }
  return tmpArr
}

function  getEditData() {
  const editContents = proxy.$el?.querySelectorAll(".xz-editor__content")
  const arr = []
  for (let i = 0; i < editContents.length; i++) {
    if (editContents[i].childNodes) {
      const data = getNodesData(editContents[i].childNodes, i)
      if (data && data.length > 0) {
        arr.push.apply(arr, data)
      }
    }
  }
  reactiveData.editorData = arr
}

function  setEditData(n, i) {
  switch (n.className.split(" ")[0]) {
    case "edit-attr":
      return setUserAttrEditData(n, i)
    case "edit-emoji-img":
      return setEmojiEditData(n, i)
    case "edit-nick-name":
      return setNickNameEditData(n, i)
    case "edit-link":
    case "edit-link edit-border":
      return setLinkEditData(n, i)
    case "edit-applet":
    case "edit-applet edit-border":
      return setMinProgramEditData(n, i)
  }
}

function  setMinProgramEditData(n, i) {
  const attrHtmlStr = n.outerHTML || n.previousSibling?.outerHTML
  const tempNode = document.createElement("div")
  tempNode.innerHTML = attrHtmlStr
  const appletN = tempNode.querySelector(".applet-name")
  if (appletN) {
    const appletName = appletN.getAttribute("applet-name")
    const appletId = appletN.getAttribute("applet-id")
    const appletUrl = appletN.getAttribute("applet-url")
    if (appletName && appletId && appletUrl) {
      return { type: "minProgram", name: "minP." + appletName, value: appletUrl, appId: appletId, line_num: i }
    }
  }
}

function  setLinkEditData(n, i) {
  const attrHtmlStr = n.outerHTML || n.previousSibling?.outerHTML
  const tempNode = document.createElement("div")
  tempNode.innerHTML = attrHtmlStr
  const linkN = tempNode.querySelector(".link-name")
  if (linkN) {
    const linkName = linkN.getAttribute("link-name")
    const linkUrl = linkN.getAttribute("link-url")
    if (linkName && linkUrl) {
      return { type: "hyperlink", name: "link." + linkName, value: linkUrl, line_num: i }
    }
  }
}

function setNickNameEditData(n, i) {
  return { type: "text", value: "#客户昵称#", line_num: i }
}

function setEmojiEditData(n, i) {
  const attrHtmlStr = n.outerHTML || n.previousSibling?.outerHTML
  const tempNode = document.createElement("div")
  tempNode.innerHTML = attrHtmlStr
  const emoji = tempNode.querySelector("img")?.getAttribute("alt")
  if (emoji) {
    return { type: "emoji", value: emoji, line_num: i }
  }
}

function setUserAttrEditData(n, i) {
  const attrHtmlStr = n.outerHTML || n.previousSibling?.outerHTML
  const tempNode = document.createElement("div")
  tempNode.innerHTML = attrHtmlStr
  const attrName = tempNode.querySelector("span[attr-name]")?.getAttribute("attr-name")
  const defaultValue = tempNode.querySelector("span[default-value]")?.getAttribute("default-value")
  if (attrName) {
    return { type: "attr", value: "user." + attrName, defaultValue: defaultValue || "", line_num: i }
  }
}

    // 设置光标位置
function setCursorPosition() {
  const range = document.createRange()
  if (!reactiveData.sectionObj.anchorNode) {
    getCursorPosition(null)
  }
  const node = reactiveData.sectionObj.anchorNode
  // let lineNum = this.sectionObj.lineNum
  // if (!node) {
  //   lineNum = 1
  // }
  // node = document.getElementsByClassName('xz-editor__content')[lineNum - 1]
  if (node?.nodeType === 1) {
    // 焦点在图片
    range.setStart(node, Math.min(reactiveData.sectionObj.anchorOffset, node?.childNodes?.length))
  } else {
    // 焦点在文本
    range.setStart(node, Math.min(reactiveData.sectionObj.anchorOffset, node?.length))
  }
  range.collapse(true) // 设置选中区域为一个点
  const selection = window.getSelection() // 获取当前选中区域
  selection?.removeAllRanges() // 移出所有的选中范围
  selection?.addRange(range) // 添加新建的范围
}

// 插入数据到文本框
function  insertHtmlAtCaret(html) {
  setCursorPosition()
  let sel, range
  if (window.getSelection) {
    sel = window.getSelection()
    if (sel.getRangeAt && sel.rangeCount) {
      range = sel.getRangeAt(0)
      range.deleteContents()
      const el = document.createElement("div")
      el.innerHTML = html
      const frag = document.createDocumentFragment()
      let node
      let lastNode
      while ((node = el.firstChild)) {
        lastNode = frag.appendChild(node)
      }
      range.insertNode(frag)
      if (lastNode) {
        range = range.cloneRange()
        range.setStartAfter(lastNode)
        range.collapse(true)
        sel.removeAllRanges()
        sel.addRange(range)
      }
    }
  }
  // else if (document.selection && document.selection.type !== "Control") {
  //   // IE < 9
  //   document.selection.createRange().pasteHTML(html)
  // }
}

// 设置弹框的位置
function setPointer(ref, cla, sourceEl, el, offset) {
  const { offsetTop, offsetLeft } = el || {}
  let element = document.querySelector(cla)
  console.log(cla, element)
  element.style.display = "block"
  if (ref === "attrSelect") {
    element.style.top = offsetTop + offset + "px"
    element.style.left = offsetLeft + "px"
    proxy.$nextTick(() => {
      document.querySelector(cla)?.click()
    })
  } else {
    element.style.top = (offsetTop + offset) + 'px'
    element.style.left = offsetLeft + 'px'
    // element.style.top = getAbsTop(el) + offset + "px"
    // element.style.left = getAbsLeft(el) + "px"
    const target = sourceEl.target
    const point = target.getBoundingClientRect()
    const viewWidth = document.documentElement.clientWidth
    const viewHeight = document.documentElement.clientHeight
    if (point.left + 512 > viewWidth) {
      element.style.left = offsetLeft - (point.left + 512 - viewWidth + 10) + "px"
    }
    // if ((point.top + clientHeight + 30) > viewHeight) {
    //   element.style.top = (offsetTop + offset - clientHeight - 10) + 'px'
    // }
  }
}

// 执行点击触发当前边框
function  handleBorder(val, el) {
  if (val) {
    el && el.classList.add("edit-border")
  } else {
    el && el.classList.remove("edit-border")
  }
}

// 设置用户属性值
function setUserAttr(val) {
  const attr = props.selectOption.find((u) => u[props.optionsConfig.value] === val)
  reactiveData.selectValue = val
  const el = reactiveData.selectEl?.querySelector(".attr-name")
  el.style.color = "#2749F1"
  if (attr) {
    el.innerHTML = attr[props.optionsConfig.label]
    el.setAttribute("attr-name", attr[props.optionsConfig.value])
  }


  reactiveData.selectEl?.querySelector(".attr-icon").setAttribute("src", getIconPng("add-quadrate-black"))
  getCursorPosition(null)
  getEditData()
}

// 设置用户属性默认值
function  setUserAttrDefaultValue(value) {
  const el = reactiveData.defaultEl?.querySelector(".default-value")
  el.style.color = "#2749F1"
  el.innerHTML = value
  el.setAttribute("default-value", value)

  reactiveData.defaultEl?.querySelector(".default-icon")
    .setAttribute("src", getIconPng("default-value-" + (value ? "black" : "gray")))

  getCursorPosition(null)
  getEditData()
}

// 设置链接的值
function setLinkValue(value) {
  const el = reactiveData.linkEl?.querySelector(".link-name")
  el.style.color = "#2749F1"
  el.innerHTML = value.name
  el.setAttribute("link-name", value.name)
  el.setAttribute("link-url", value.url)

  reactiveData.linkEl?.querySelector(".link-icon").setAttribute("src", getIconPng("link-black"))
  getCursorPosition(null)
  getEditData()
}

function setMinProgramValue(value) {
  const el = reactiveData.minProgramEl?.querySelector(".applet-name")
  el.style.color = "#2749F1"
  el.innerHTML = value.name
  el.setAttribute("applet-name", value.name)
  el.setAttribute("applet-id", value.appId)
  el.setAttribute("applet-url", value.url)

  reactiveData.minProgramEl?.querySelector(".applet-icon").setAttribute("src", getIconPng("link-black"))
  getCursorPosition(null)
  getEditData()
}

// 当前页面监听弹出框的点击开启关闭
function handleBodyClick(e) {
  const arr = e.target.offsetParent?.className.split(" ")

  if (arr && arr.length > 1 && arr[1] === props.uniqueKey) {
    handleClose()

    const defaultDom = document.getElementsByClassName(`default_${props.uniqueKey}`)[0]
    if (defaultDom && e) {
      if (!defaultDom.contains(e.target)) {
        reactiveData.defaultVisible = false
        handleBorder(reactiveData.defaultVisible, reactiveData.defaultEl)
      }
      if (arr[0] === "edit-attr__default") {
        reactiveData.defaultVisible = !reactiveData.defaultVisible
        handleBorder(reactiveData.defaultVisible, reactiveData.defaultEl)
      }
    }

    const linkDom = document.getElementsByClassName(`link_${props.uniqueKey}`)[0]
    if (linkDom && e) {
      if (!linkDom.contains(e.target)) {
        if (arr[0] !== "edit-link") {
          reactiveData.linkVisible = false
          handleBorder(reactiveData.linkVisible, reactiveData.linkEl)
        }
      }
      if (arr[0] === "edit-link") {
        reactiveData.linkVisible = !reactiveData.linkVisible
        handleBorder(reactiveData.linkVisible, reactiveData.linkEl)
      }
    }

    const appletDom = document.getElementsByClassName(`applet_${props.uniqueKey}`)[0]
    if (appletDom && e) {
      if (!appletDom.contains(e.target)) {
        if (arr[0] !== "edit-applet") {
          reactiveData.minProgramVisible = false
          handleBorder(reactiveData.minProgramVisible, reactiveData.minProgramEl)
        }
      }
      if (arr[0] === "edit-applet") {
        reactiveData.minProgramVisible = !reactiveData.minProgramVisible
        handleBorder(reactiveData.minProgramVisible, reactiveData.minProgramEl)
      }
    }
  }
}

// 监听文本输入框点击事件
function listenerEdit(e) {
  close()
  const className = e.target.offsetParent.className.split(" ")[0]
  switch (className) {
    case "edit-attr__content":
      doUserAttr(e)
      break
    case "edit-attr__default":
      doUserAttrDefault(e)
      break
    case "edit-link":
      doLink(e)
      break
    case "edit-applet":
      doMinProgram(e)
      break
    default:
      handleClose()
  }
}

// 监听到edit 操作用户属性时
function  doUserAttr(e) {
  const attrSelect = proxy.$el?.querySelector(`.select-container`)
  attrSelect && (attrSelect.style.display = "block")
  proxy.$nextTick(() => {
    proxy.$refs[`attrSelect`][0] && proxy.$refs[`attrSelect`][0].doShow()
  })

  reactiveData.selectEl = e.target.offsetParent
  const attrN = reactiveData.selectEl?.querySelector(".attr-name")
  const attrName = attrN.getAttribute("attr-name")
  reactiveData.selectValue = attrName

  setPointer("attrSelect",  `.custom_${props.uniqueKey}`, e, reactiveData.selectEl, -8)
}

// 监听到edit 操作用户属性默认值时
function  doUserAttrDefault(e) {
  reactiveData.defaultEl = e.target.offsetParent
  const defN = reactiveData.defaultEl?.querySelector(".default-value")
  const defVal = defN.getAttribute("default-value")
  reactiveData.defaultValue = defVal || ""

  setPointer(`defaultRef${props.uniqueKey}`, `.default_${props.uniqueKey}`, e, reactiveData.defaultEl, 27)
}

// 监听到edit 操作链接时
function doLink(e) {
  reactiveData.linkEl = e.target.offsetParent
  const nameN = reactiveData.linkEl?.querySelector(".link-name")
  const name = nameN.getAttribute("link-name")
  const url = nameN.getAttribute("link-url")
  reactiveData.linkObj.name = name || ""
  reactiveData.linkObj.url = url || "http://"

  setPointer(`linkRef${props.uniqueKey}`, `.link_${props.uniqueKey}`, e, reactiveData.linkEl, 27)
}

function doMinProgram(e) {
  reactiveData.minProgramEl = e.target.offsetParent
  const nameN = reactiveData.minProgramEl?.querySelector(".applet-name")
  const name = nameN.getAttribute("applet-name")
  const url = nameN.getAttribute("applet-url")
  const appId = nameN.getAttribute("applet-id")
  reactiveData.minProgramObj.name = name || ""
  reactiveData.minProgramObj.url = url || ""
  reactiveData.minProgramObj.appId = appId || ""

  setPointer(`minProgramRef${props.uniqueKey}`, `.applet_${props.uniqueKey}`, e, reactiveData.minProgramEl, 27)
}

function checkSelectNode() {
  // 当前光标所在节点
  // const focusNode = window.getSelection().focusNode
  const focusNode = reactiveData.sectionObj.anchorNode
  let isFocus =
    focusNode && !!focusNode.classList && focusNode.classList.length > 0 && focusNode.classList.contains(reactiveData.editRef)
  if (focusNode && focusNode.nodeType === 3) {
    isFocus = focusNode.parentNode.classList.contains(reactiveData.editRef)
  }
  return isFocus
}

// 处理粘贴数据（只能粘贴文体）
const paste = (e) => {
  e.preventDefault()
  if (!checkSelectNode() && !e.target.getAttribute("contenteditable")) return

  const cpText = e.clipboardData.getData("text")
  insertHtmlAtCaret(cpText)
}
</script>
<style lang="scss" type="text/scss" scoped>
#editorContent:empty:before {
  content: attr(placeholder);
  color: #a9a9a9;
  user-select: none;
}

.xz-editor {
  background-color: transparent;
  min-width: 752px;
  min-height: 192px;
  border-radius: 3px;
  border: 1px solid #dbdee4;
  display: flex;
  position: relative;
  flex-direction: column;
  .mask {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 9;
    cursor: not-allowed;
  }
  .xz-editor__tools {
    user-select: none;
    div {
      user-select: none;
    }
  }
  .editor-body {
    flex: 1;
    max-height: 160px;
    overflow: auto;
    color: v-bind(color);

    &:focus-visible {
      outline: none !important;
    }

    &:hover {
      &::-webkit-scrollbar-thumb {
        background-color: rgba(157, 165, 183, 0.4);
      }
    }
  }
  .disabled {
    pointer-events: none;
  }

  :deep(.common-select-container .select-container) {
    position: absolute;
    opacity: 0;
    z-index: 999;
    display: none;
  }
  &__tools {
    height: 32px;
    background: #f8f9fe;
    display: flex;

    > div {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .tool-item {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 8px;
      cursor: pointer;

      > svg {
        margin: 0 8px;
        font-size: 16px;
      }
    }
  }
}
.no-click {
  cursor: not-allowed !important;
  opacity: 0.7;
}

:deep(.el-color-picker--mini) {
  height: auto;
  margin-right: 5px;

  .el-color-picker__trigger {
    height: 18px;
    width: 18px;
    padding: 0;
  }
}
:deep(.el-form-item__label) {
  font-weight: bold;
}
</style>

<style lang="scss">
.edit-empty:empty:before {
  content: attr(placeholder);
  color: #a9a9a9;
}

.xz-editor__content {
  padding: 2px 16px;
  letter-spacing: 1px;
  min-height: 26px;
  line-height: 26px;
  word-wrap: break-word; /*遇到空格整个单词显示不完就自动换行到下一行*/

  &::before {
    height: 26px;
    line-height: 28px;
  }
}
.emoji-content {
  width: 394px;
  padding: 12px 16px 0;
  .el-carousel__container {
    width: 360px;
  }
  // 解决第二次轮播图切换的效果
  .el-carousel__item.is-animating {
    transition: opacity 0.2s ease-in-out !important;
  }
}

.edit-emoji-img {
  display: inline-block;
  margin: 0 2px;
  height: 24px;
  position: relative;
  top: 5px;

  i {
    position: relative;
    top: -5px;
  }

  img {
    position: relative;
    top: 2px;
  }
}

.edit-attr,
.edit-nick-name,
.edit-applet,
.edit-link {
  display: inline-block;
  margin: 0 3px 0 1px;
  cursor: pointer;
  height: 24px;

  span {
    display: inline-block;
    padding: 0 5px;
    color: #2749f1;
    font-size: 12px;
    height: 26px;
    max-width: 166px;
    max-height: 26px;
    line-height: 24px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .link-name {
    color: #888d97;
  }

  img {
    margin-left: 1px;
    height: 20px;
    position: relative;
    top: -5px;
    left: -5px;
  }

  &__content {
    display: inline-block;
    height: 24px;
    background: #f6f7f9;
    border-radius: 3px;
    border: 1px solid transparent;
    position: relative;
    top: 8px;
    > img {
      position: relative;
      left: 0;
    }
  }

  &__default {
    display: inline-block;
    margin-right: 3px;
    height: 24px;
    background: #f6f7f9;
    border: 1px solid transparent;
    border-radius: 3px;
    position: relative;
    top: 8px;

    > img {
      position: relative;
      left: 0;
    }
  }

  i {
    position: relative;
    top: -10px;
  }
}
.edit-attr,
.edit-link,
.edit-applet {
  span {
    color: #888d97;
  }
}
.edit-border {
  border-color: #2749f1 !important;
}
.edit-nick-name,
.edit-applet,
.edit-link {
  border: 1px solid transparent;
  background: #f6f7f9;
  border-radius: 3px;
  position: relative;
  top: 9px;
}
.edit-nick-name {
  cursor: default;
}
.edit-attr,
.edit-nick-name,
.edit-link,
.edit-applet,
.edit-emoji-img {
  user-select: none;
}
</style>
