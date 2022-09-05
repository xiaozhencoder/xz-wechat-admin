import router, { asyncRoutes } from "@/router"
import settings from "./settings"
import { getDataByCache, setDataToCache } from "@/utils/cache"
import NProgress from "nprogress"
NProgress.configure({ showSpinner: false }) // NProgress Configuration
import "nprogress/nprogress.css"
import getPageTitle from "@/utils/getPageTitle"
import { RouterRowTy } from "~/router"
import { useUserStore } from "@/store/user"
import { usePermissionStore } from "@/store/permission"
import { ObjTy } from "~/common"

const whiteList = ["/login", "/404", "/401"] // no redirect whitelist
router.beforeEach(async (to: any, from, next: any) => {
  // start progress bar
  if (settings.isNeedNprogress) NProgress.start()
  // set page title
  // document.title = getPageTitle(to.meta.title)

  // 暂时不需要权限
  const permissionStore = usePermissionStore()
  permissionStore.M_routes(asyncRoutes)
  asyncRoutes.forEach((route: RouterRowTy) => {
    router.addRoute(route)
  })
  // next()

  const userStore = useUserStore()
  const hasToken: string | null = getDataByCache("token")
  const userId: string | null = getDataByCache("userId")
  const hasUserInfo: ObjTy | null = getDataByCache("userInfo")
  const currentProject: string | null = getDataByCache("currentProject")
  const visitProduct: string | null = getDataByCache("visitProduct")

  if (hasToken) {
    if (to.path === "/login") {
      next({ path: "/" })
    } else {
      if (hasUserInfo) {
        next()
      } else {
        try {
          // if (userId && currentProject && visitProduct) {
          if (userId) {
            await userStore.getUserInfo()
            next({ ...to, replace: true })
          } else {
            await userStore.resetUserInfo()
          }
        } catch (error) {
          await userStore.resetUserInfo()
          location.href = "/login"
          if (settings.isNeedNprogress) NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login`)
      // if (localStorage.getItem("userInfo")) {
      //   // $showNotify({ type: "warning", content: "登录失效，请重新登录！" })
      //   setTimeout(() => {
      //     location.href = "/login"
      //   }, 2000)
      // } else {
      //   location.href = "/login"
      // }

      if (settings.isNeedNprogress) NProgress.done()
    }
  }
})

router.afterEach(() => {
  if (settings.isNeedNprogress) NProgress.done()
})
