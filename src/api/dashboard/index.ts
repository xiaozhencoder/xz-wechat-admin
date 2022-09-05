import request from "@/utils/axiosReq"
import { Method, ApiScrmHome } from "@/api/config"

/**
 * 权限等相关接口
 */
const Action = {
  //获取企微授权状态
  getCompanyAuthStatus: `${ApiScrmHome}/workchat/corp/getAuthQrCode`,
  getWorkChatData: `${ApiScrmHome}/workchat/dashboard/workchatData`,
  getUserTrendData: `${ApiScrmHome}/workchat/dashboard/userTrendData`
}

// 获取企微授权状态
export function getCompanyAuthStatus(params) {
  return request({
    method: Method.get,
    url: Action.getCompanyAuthStatus,
    params
  })
}

export function getWorkChatData() {
  return request({
    method: Method.get,
    url: Action.getWorkChatData
  })
}

export function getUserTrendData(params) {
  return request({
    method: Method.get,
    url: Action.getUserTrendData,
    params
  })
}
