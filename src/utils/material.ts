import { EmojiArr } from "@/components/XzComm/XzEditor/module/common"

export function fillContent(info, attrs) {
  const arr = typeof info.content === "string" ? JSON.parse(info.content).content : info.content.content
  // 获取最大行数
  const maxNum = Math.max(...arr.map((a) => a.line_num))
  const attrArray = arr.filter((item) => item.type === "attr")
  if (attrArray.length > 0 && attrs?.selectOption?.length === 0) {
    return ""
  }
  const tmpArr = groupBy(arr, (item) => [item.line_num])
  const mapObj = getReturnHtml(tmpArr, attrs)

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

function getReturnHtml(arr, attrs) {
  const mapObj = {}
  let index = 0
  for (let i = 0; i < arr.length; i++) {
    const tArr = arr[i]
    let htmlStr = ""
    tArr.forEach((v) => {
      index = v.line_num
      switch (v.type) {
        case "text":
          if (v.value.indexOf("#客户昵称#") !== -1) {
            htmlStr += `<span style="color: #2749F1">客户昵称</span>`
          } else {
            htmlStr += v.value
          }
          break
        case "emoji":
          EmojiArr.forEach((e) => {
            if (e[0] === v.value) {
              htmlStr += `<img class="emoji-icon" src="https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/${e[1]}.gif" alt="${e[0]}"/>`
            }
          })
          break
        case "attr":
          if (v.value) {
            let item = attrs?.selectOption.find((u) => u[attrs?.optionsConfig.value] === v.value.split(".")[1])
            if (item) htmlStr += `<span style="color: #2749F1">${item[attrs?.optionsConfig.label]}</span>`
          }
          break
        case "hyperlink":
        case "minProgram":
          htmlStr += `<span style="color: #2749F1">${v.name ? v.name.split(".")[1] : ""}</span>`
          break
      }
    })
    mapObj[index] = `<div style="word-break:break-all;" index="${index}">${htmlStr}</div>`
  }
  return mapObj
}
