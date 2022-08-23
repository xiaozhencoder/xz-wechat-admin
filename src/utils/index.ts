import { ElNotification } from "element-plus"
import moment from "moment-mini"
import { ObjTy } from "~/common"

// 获取字符串宽高
export function getCharSizeByCanvas(char, style = { fontSize: 14, fontFamily: "Arial" }) {
  const { fontSize = 14, fontFamily = "Arial" } = style
  const el = document.createElement("span")
  el.style.opacity = "0"
  el.style.fontSize = fontSize + "px"
  el.style.fontFamily = fontFamily
  el.innerText = char
  document.body.appendChild(el)
  const width = el.clientWidth !== 0 ? el.clientWidth : el.offsetWidth
  el.remove()
  return {
    height: fontSize,
    width: width
  }
  // const canvas = document.createElement("canvas")
  // canvas.style.position = "ablsolute"
  // const ctx: any = canvas.getContext("2d")
  // const { fontSize = 14, fontFamily = "Arial" } = style
  // document.body.appendChild(canvas)
  // ctx.font = `${fontSize}px ${fontFamily}`
  // document.body.removeChild(canvas)
  // const text = ctx.measureText(char) // TextMetrics object
  // ctx.fillText(char, 50, 50)
  // return {
  //   height: fontSize,
  //   width: text.width
  // }
}

class ShowNotifyMsgTy {
  type: string = "success" // 显示类型: success, warning
  content!: string // 提示信息类容
}

export async function showNotify(msg: ShowNotifyMsgTy) {
  const imageUrl = await import("../assets/images/notify-" + msg.type + ".png")
  return ElNotification({
    position: "bottom-left",
    duration: 5000,
    dangerouslyUseHTMLString: true,
    message: `<img src="${imageUrl.default}" alt="" width="40px" height="32px"/><span>${msg.content}</span>`,
    offset: 50 // 向下偏移100
  })
}

// 生成随机字符串32位
export function createUniqueString() {
  const timestamp = +new Date() + ""
  const randomNum = (1 + Math.random()) * 65536 + ""
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source: ObjTy | Array<ObjTy> | undefined): any {
  if (!source && typeof source !== "object") {
    throw new Error("deepClone: error arguments")
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === "object") {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

export const beforeDay = (time: Date, day: number = 0, format: string = "YYYY-MM-DD") => {
  return moment(time.getTime() - day * 24 * 60 * 60 * 1000).format(format)
}

export const formatDate = (time: number | Date, format: string = "YYYY-MM-DD") => {
  return moment(time).format(format)
}

//获取两个日期中间的日期
export const getDiffDate = (stime, etime) => {
  //初始化日期列表，数组
  var diffdate = new Array()
  var i = 0
  //开始日期小于等于结束日期,并循环
  while (stime <= etime) {
    diffdate[i] = stime

    //获取开始日期时间戳
    var stime_ts = new Date(stime).getTime()

    //增加一天时间戳后的日期
    var next_date = stime_ts + 24 * 60 * 60 * 1000

    //拼接年月日，这里的月份会返回（0-11），所以要+1
    var next_dates_y = new Date(next_date).getFullYear() + "-"
    var next_dates_m =
      new Date(next_date).getMonth() + 1 < 10
        ? "0" + (new Date(next_date).getMonth() + 1) + "-"
        : new Date(next_date).getMonth() + 1 + "-"
    var next_dates_d =
      new Date(next_date).getDate() < 10 ? "0" + new Date(next_date).getDate() : new Date(next_date).getDate()

    stime = next_dates_y + next_dates_m + next_dates_d

    //增加数组key
    i++
  }
  return diffdate
}

/*
 *传入时间戳计算时分秒
 *seconds  秒数
 */
export function timeResolution(seconds) {
  var day = Math.floor(seconds / (24 * 3600))
  var hour = Math.floor((seconds - day * 24 * 3600) / 3600)
  var minutes = Math.floor((seconds - day * 24 * 3600 - hour * 3600) / 60)
  var second = Math.floor(seconds % 60)
  let result = ""
  if (day > 0) {
    result += day + "天"
  }
  if (hour > 0) {
    result += hour + "小时"
  } else if (hour === 0) {
    result = result ? result + hour + "小时" : ""
  }
  if (minutes > 0) {
    result += minutes + "分"
  } else if (minutes === 0) {
    result = result ? result + minutes + "分" : ""
  }
  if (second >= 0) {
    result += second + "秒"
  }
  return result
}

//  获取盒子到屏幕左方的距离
export const getAbsLeft = (obj) => {
  var l = obj.offsetLeft
  while (obj.offsetParent != null) {
    obj = obj.offsetParent
    l += obj.offsetLeft
  }
  return l
}

// 获取盒子到屏幕上方的距离
export const getAbsTop = (obj) => {
  var top = obj.offsetTop
  while (obj.offsetParent != null) {
    obj = obj.offsetParent
    top += obj.offsetTop
  }
  return top
}

/**
 * kb转换MB,GB，TB
 * @param {Number} a 文件大小 kb
 * @param {Number} b 小数点后面的位数
 */
export const formatBytes = (a, b) => {
  if (a === 0 || a === "0") return "0 B"
  var c = 1024
  var d = b || 2
  var e = ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
  var f = Math.floor(Math.log(a) / Math.log(c))
  console.log(parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f])
  return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f]
}

export function parseText(arr, attrs, EmojiArr) {
  const fillContent = (arr) => {
    // 获取最大行数
    const maxNum = Math.max(...arr.map((a) => a.line_num))
    const attrArray = arr.filter((item) => item.type === "attr")
    if (attrArray.length > 0 && attrs.length === 0) {
      return ""
    }
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
  const groupBy = (array, f) => {
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
  const getReturnHtml = (arr) => {
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
              let item = attrs.selectOption.find((u) => u[attrs.optionsConfig.value] === v.value.split(".")[1])
              if (item) htmlStr += `<span style="color: #2749F1">${item[attrs.optionsConfig.label]}</span>`
              htmlStr += attrs.find((u) => u.attributeName === v.value.split(".")[1])?.showName
            }
            break
          case "hyperlink":
          case "minProgram":
            htmlStr += `<span style="color: #2749F1">${v.name ? v.name.split(".")[1] : ""}</span>`
            break
        }
      })
      mapObj[index] = `<div style="word-break:break-all" index="${index}">${htmlStr}</div>`
    }
    return mapObj
  }
  return fillContent(arr)
}

export const getUrl = (val: string) => {
  return val?.indexOf("http") !== -1 || val?.indexOf("base64") !== -1
    ? val
    : (process.env.NODE_ENV === "development"
        ? process.env.VUE_APP_MEDIA_BASE_URL
        : (window as ObjTy).config.MEDIA_URL) + val
}

export const copyText = async (value: string) => {
  // navigator clipboard 需要https等安全上下文
  if (navigator.clipboard && window.isSecureContext) {
    // navigator clipboard 向剪贴板写文本
    try {
      const res = await navigator.clipboard.writeText(value)
      console.log(res)
      showNotify({ type: "success", content: "复制成功！" })
    } catch (e) {
      console.log(e)
      showNotify({ type: "warning", content: "复制失败！" })
    }
  } else {
    return new Promise((resolve) => {
      const input = document.createElement("input")
      input.style.opacity = "0"
      input.value = value
      document.body.appendChild(input)
      input.select() // 选择对象;
      try {
        document.execCommand("Copy") // 执行浏览器复制命令
        input.remove()
        showNotify({ type: "success", content: "复制成功！" })
        resolve(true)
      } catch (e) {
        input.remove()
        showNotify({ type: "warning", content: "复制失败！" })
        resolve(false)
      }
    })
  }
}

/**
 * Query语法格式化为对象
 * @param { String } str
 * @return { Object }
 */
export function queryToObject(str: string) {
  const params: any = {}
  for (const item of str.split("&")) {
    params[item.split("=")[0]] = item.split("=")[1]
  }
  return params
}
