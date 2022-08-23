import axios from "axios"
import router from "@/router"
import { showNotify } from "@/utils"
import { ElLoading, ElMessage, ElMessageBox } from "element-plus"
import { getToken, setToken } from "@/utils/auth"
import { AxiosConfigTy, AxiosReqTy, ObjTy } from "~/common"
import { useUserStore } from "@/store/user"
let reqConfig: any
let loadingE: any

const service: any = axios.create()

// 请求拦截
service.interceptors.request.use(
  (request: AxiosReqTy) => {
    // token setting
    // request.headers['AUTHORIZE_TOKEN'] = getToken()
    /* download file*/
    // if (request.isDownLoadFile) {
    //   request.responseType = 'blob'
    // }
    /* upload file*/
    // if (request.isUploadFile) {
    //   request.headers['Content-Type'] = 'multipart/form-data'
    // }
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
  (res: any) => {
    if (reqConfig.afHLoading && loadingE) {
      loadingE.close()
    }
    // 如果是下载文件直接返回
    if (reqConfig.isDownLoadFile) {
      return res
    }
    const { flag, msg, isNeedUpdateToken, updateToken, status } = res.data
    //更新token保持登录状态
    if (isNeedUpdateToken) {
      setToken(updateToken)
    }
    const successCode = "0,200,20000"
    if (successCode.includes(status)) {
      return res.data
    } else {
      showNotify({
        type: "warning",
        content: res?.data?.message || "服务器异常"
      })
      return Promise.reject(res.data)
    }
  },
  (err: any) => {
    /*http错误处理，处理跨域，404，401，500*/
    if (loadingE) loadingE.close()
    ElMessage({
      message: err,
      type: "error",
      duration: 2 * 1000
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
