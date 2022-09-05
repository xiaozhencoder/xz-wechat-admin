import axios from "axios"
import router from "@/router"
import { getBaseUrl, getHostName, showNotify } from "@/utils"
import { ElLoading, ElMessage, ElMessageBox } from "element-plus"
import { AxiosConfigTy, AxiosReqTy, ObjTy } from "~/common"
import { useUserStore } from "@/store/user"
import { getDataByCache } from "./cache"
import { ERRMSG_DURATION_TIME } from "@/constent/globalConstant"

let reqConfig: any
let loadingE: any

const service: any = axios.create({
  baseURL: getBaseUrl()
})

// 请求拦截
service.interceptors.request.use(
  (request: AxiosReqTy) => {
    // 配置请求头
    request.headers["Authorization"] = `Bearer ${getDataByCache("token")}`
    // config.headers['token'] = getDataByCache('token')
    request.headers["userId"] = getDataByCache("userId")
    // request.headers["currentProject"] = getDataByCache("currentProject")?.projectName
    // request.headers["productName"] = getDataByCache("visitProduct")?.codeName
    request.headers["currentProject"] = "kwn9iffp"
    request.headers["productName"] = "scrm"
    request.headers["service"] = getHostName()

    /* download file*/
    if (request.isDownLoadFile) {
      request.responseType = "blob"
    }
    /* upload file*/
    if (request.isUploadFile) {
      request.headers["Content-Type"] = "multipart/form-data"
    }
    reqConfig = request
    if (request.bfLoading) {
      loadingE = ElLoading.service({
        lock: true,
        text: "数据载入中",
        // spinner: 'el-icon-ElLoading',
        background: "rgba(0, 0, 0, 0.1)"
      })
    }
    /*
     *params会拼接到url上
     * */
    // if (request.isParams) {
    //   request.params = request.data
    //   request.data = {}
    // }
    return request
  },
  (err: any) => {
    Promise.reject(err)
  }
)
// 响应拦截
service.interceptors.response.use(
  async (res: any) => {
    if (reqConfig.afHLoading && loadingE) {
      loadingE.close()
    }
    // 如果是下载文件直接返回
    if (reqConfig.isDownLoadFile) {
      return res
    }
    const { status } = res.data

    if (res.status !== 200) {
      await debounceFun(res)
      return Promise.reject(new Error(res.message || "Error"))
    } else {
      if (res.data.status === 2 || res.data.status === 6) {
        await debounceToLoginFun(res.data)
      } else if (res.data.status === 7) {
        await debounceToLoginOverTime(res.data.message)
      } else if (res.data.status === undefined) {
        return res.data
      } else if (
        res.data.status === 4001 ||
        res.data.status === 4002 ||
        res.data.status === 4003 ||
        res.data.status === 4004
      ) {
        // await debounceNoPermission(res)
      } else if (res.data.status === 48002) {
        // 企微授权被取消时返回该错误码
        await unAuthErrorHandle(res)
      } else if (res.data.status !== 0) {
        if (!res.config.config?.silence) {
          await debounceFun(res.data)
        }
        return Promise.reject(new Error(res.data.message || "Error"))
      } else {
        return res.data
      }
    }

    // const successCode = "0,200,20000"
    // if (successCode.includes(status)) {
    //   return res.data
    // } else {
    //   showNotify({
    //     type: "warning",
    //     content: res?.data?.message || "服务器异常"
    //   })
    //   return Promise.reject(res.data)
    // }
  },
  (err: any) => {
    /*http错误处理，处理跨域，404，401，500*/
    if (loadingE) loadingE.close()
    showNotify({
      type: "warning",
      content: err || "服务器异常"
    })

    //如果是跨域
    //Network Error,cross origin
    const errObj: ObjTy = {
      msg: err.toString(),
      reqUrl: reqConfig.baseURL + reqConfig.url,
      data: reqConfig.data,
      params: reqConfig.params
    }
    return Promise.reject(JSON.stringify(errObj))
  }
)

// 错误处理具体逻辑
const errHandleFun = (res) => {
  return new Promise<void>((resolve, reject) => {
    showNotify({
      content: res.message || "请求错误！",
      type: "warning"
    })
    setTimeout(() => {
      resolve()
    }, ERRMSG_DURATION_TIME)
  })
}

// const noPermission = (res) => {
//   let ori, uri
//   const status = res.data.status
//   if (status === 4003) {
//     ori = res.config.url
//     uri = res.data.data ? res.data.data : res.config.url
//   }
//   return new Promise((resolve) => {
//     Router.push({
//       path: "/no-permission",
//       query: { ori, uri, status }
//     })
//     resolve(status)
//   })
// }

const overtimeHandleToLoginFun = (res) => {
  return new Promise((resolve, reject) => {
    ElMessageBox({
      title: "账号提示",
      message: "您的账号在其他设备登录，请重新登录如不是您本人的操作，你的账号密码已经泄露，建议您尽快修改密码",
      confirmButtonText: "确定",
      callback: () => {
        useUserStore().resetUserInfo()
      }
    })
  })
}

const unAuthErrorFun = (res) => {
  return new Promise((resolve, reject) => {
    resolve(res)
    ElMessageBox({
      title: "暂无企微 API权限",
      dangerouslyUseHTMLString: true,
      showCancelButton: false,
      message:
        '请联系企业微信管理员完成授权 ；若您是管理员请点击这里<a target="_blank" style="text-decoration: underline;" href="https://www.yuque.com/u25374364/dvv3gw">查看帮助</a>，完成权限的授权，以便可以继续使用该服务',
      confirmButtonText: "好的",
      customClass: "confirm-container more230",
      confirmButtonClass: "btn-center",
      center: true,
      callback: () => {}
    })
  })
}

const errHandleToLoginFun = (data) => {
  return new Promise((resolve, reject) => {
    ElMessage({
      message: `${data.status === 6 ? "距离您上次操作已经过去24小时" : "登录失效"}，请重新登录！`,
      type: "warning",
      duration: ERRMSG_DURATION_TIME
    })
    setTimeout(() => {
      useUserStore().resetUserInfo()
    }, ERRMSG_DURATION_TIME)
  })
}
// 错误处理报错防抖
const debounce = (fn: Function) => {
  let flag = true
  return async function (...args: any) {
    if (!flag) return
    flag = false
    await fn.apply(this, args)
    flag = true
  }
}

const debounceFun = debounce(errHandleFun)
const debounceToLoginFun = debounce(errHandleToLoginFun)
// const debounceNoPermission = debounce(noPermission)
const debounceToLoginOverTime = debounce(overtimeHandleToLoginFun)
const unAuthErrorHandle = debounce(unAuthErrorFun)

export function axiosReq({
  url,
  data,
  params,
  method,
  bfLoading,
  afHLoading,
  isUploadFile,
  isDownLoadFile,
  baseURL,
  timeout,
  isAlertErrorMsg = true
}: AxiosConfigTy): any {
  return service({
    url: url,
    method: method ?? "get",
    data: data ?? {},
    params: params ?? {},
    bfLoading: bfLoading ?? false,
    afHLoading: afHLoading ?? true,
    isUploadFile: isUploadFile ?? false,
    isDownLoadFile: isDownLoadFile ?? false,
    isAlertErrorMsg: isAlertErrorMsg,
    baseURL: baseURL ?? import.meta.env.VITE_APP_BASE_URL,
    timeout: timeout ?? 15000
  })
}

export default axiosReq
