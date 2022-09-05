import { loginReq, logoutReq, getInfoReq, getLoginUserInfo } from "@/api/user"
import { ObjTy } from "~/common"
import router, { constantRoutes, asyncRoutes } from "@/router"
import { defineStore } from "pinia"
import { usePermissionStore } from "@/store/permission"
import { getDataByCache, setDataToCache } from "@/utils/cache"
import Cookies from "js-cookie"
import { showNotify } from "@/utils"

const resetRouter = () => {
  const asyncRouterNameArr: Array<any> = asyncRoutes.map((mItem) => mItem.name)
  asyncRouterNameArr.forEach((name) => {
    if (router.hasRoute(name)) {
      router.removeRoute(name)
    }
  })
}

const removeInfo = () => {
  const removeArr = [
    "userInfo",
    "service",
    "currentProject",
    "visitProduct",
    "userId",
    "dashboards",
    "projects",
    "token",
    "Dashboard"
  ]
  removeArr.forEach((item) => {
    localStorage.removeItem(item)
    Cookies.remove(item)
    Cookies.remove(item, { domain: "." + (window as any).config.DOMAIN, path: "/" })
    console.log(item)
  })
}

const getDefaultState = () => {
  return {
    userId: getDataByCache("userId") || "",
    userName: "",
    token: "",
    loginInfo: getDataByCache("loginInfo")
      ? getDataByCache("loginInfo")
      : { productProjects: [], userName: "", email: "" },
    userInfo: getDataByCache("userInfo") || {},
    avatar: "",
    roles: [] as Array<any>,
    service: getDataByCache("service") || {},
    projects: getDataByCache("projects") || [],
    dashboards: getDataByCache("dashboards") || []
  }
}

export const useUserStore = defineStore("user", {
  state: () => getDefaultState(),

  actions: {
    setResetState() {
      this.$patch((state) => {
        state = getDefaultState()
      })
    },
    setUserId(id: number) {
      this.$patch((state) => {
        state.userId = id
      })
    },
    setUserName(userName: string) {
      this.$patch((state) => {
        state.userName = userName
      })
    },
    setUserInfo(userInfo: ObjTy) {
      this.$patch((state) => {
        state.userInfo = userInfo
      })
    },
    setRoles(roles: Array<string>) {
      this.$patch((state) => {
        state.roles = roles
      })
    },
    setLoginInfo(data: ObjTy) {
      this.$patch((state) => {
        state.loginInfo = data
      })
    },

    setService(service: ObjTy) {
      this.$patch((state) => {
        state.service = service
      })
    },

    setProjects(projects: Array<ObjTy>) {
      this.$patch((state) => {
        state.projects = projects
      })
    },

    setDashboards(dashboards: Array<ObjTy>) {
      this.$patch((state) => {
        state.dashboards = dashboards
      })
    },

    login(userInfo: ObjTy) {
      return new Promise((resolve, reject) => {
        loginReq(userInfo)
          .then(async (res) => {
            if (res.data.status === 0) {
              const accessToken = res.data.data.access_token
              setDataToCache("token", accessToken)
              const info = await getLoginUserInfo({ accessToken })
              if (info.data.status === 0) {
                const data = info.data.data
                if (!data.userName) data["userName"] = data.username
                const userId = data.id
                const service = { serviceName: data.serviceName }

                this.setUserId(userId)
                this.setLoginInfo(data)
                this.setService(service)
                setDataToCache("service", service)
                setDataToCache("userId", userId)
                setDataToCache("loginInfo", data)
                resolve(info.data)
              } else {
                resolve(null)
              }
            } else {
              resolve(res.data)
            }
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // get user info
    getUserInfo() {
      return new Promise((resolve, reject) => {
        getInfoReq()
          .then((response: ObjTy) => {
            const { data, status } = response

            if (!data) {
              reject("用户信息失效，请重新登录！")
            }
            if (status === 0) {
              const { projects, service, user, dashboards, actionDays, lastActionTime } = data
              user.actionDays = actionDays // 近30天活跃天数
              user.lastActionTime = lastActionTime // 上次访问时间
              if (!user.userName) user["userName"] = user.username
              setDataToCache("projects", projects)

              setDataToCache("userInfo", user)
              setDataToCache("dashboards", dashboards)

              if (service) {
                setDataToCache("service", service)
                this.setService(service)
              }
              this.setUserName(user.username || user.userName)
              this.setUserInfo(user)
              this.setProjects(projects)
              this.setDashboards(dashboards)

              resolve(data)
            }
          })
          .catch((error: any) => {
            reject(error)
          })
      })
    },

    // remove UserInfo
    resetUserInfo() {
      return new Promise((resolve) => {
        removeInfo()
        this.resetState()
        resetRouter()
        window.location.reload()
        resolve(null)
      })
    },
    // user logout
    logout() {
      return new Promise((resolve, reject) => {
        logoutReq()
          .then((res: ObjTy) => {
            if (res.data.status === 0) {
              this.resetState()
              resolve(null)
            } else {
              showNotify({
                content: res.data.message || "注销失败！",
                type: "warning"
              })
            }
            resolve(null)
          })
          .catch((error: any) => {
            reject(error)
          })
      })
    },
    resetState() {
      return new Promise((resolve) => {
        this.setResetState()

        const permissionStore = usePermissionStore()
        permissionStore.M_isGetUserInfo(false)
        resolve(null)
      })
    }
  }
})
