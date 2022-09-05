import axios from "axios"
import request from "@/utils/axiosReq"

import { ObjTy } from "~/common"
import { getHostName, getBaseUrl } from "@/utils"
import { ApiAuth, ApiUser, ApiData } from "@/api/config"
import { getDataByCache } from "@/utils/cache"

export function loginReq(params: ObjTy) {
  return axios({
    headers: {
      service: getHostName(),
      Authorization: "Basic d2ViQXBwOndlYkFwcA=="
    },
    method: "post",
    url: `${getBaseUrl()}${ApiAuth}/oauth/token`,
    params
  })
}

export function logoutReq() {
  return axios({
    method: "GET",
    headers: {
      Authorization: "Bearer " + getDataByCache("token"),
      service: getHostName(),
      currentProject: getDataByCache("currentProject")?.projectName
    },
    url: `${getBaseUrl()}${ApiAuth}/oauth/remove/token`
  })
}

// 登录后获取登录人信息
export function getLoginUserInfo(params: ObjTy) {
  return axios({
    headers: {
      service: getHostName(),
      Authorization: `Bearer ${params.accessToken}`
    },
    method: "get",
    url: `${getBaseUrl()}${ApiUser}/users/current`
  })
}

// export function loginReq(data: ObjTy) {
//   return request({
//     url: "/integration-front/user/loginValid",
//     data,
//     method: "post",
//     bfLoading: false,
//     isAlertErrorMsg: false
//   })
// }

export function getInfoReq() {
  return request({
    url: `${ApiUser}/user/info`,
    method: "get"
  })
}
