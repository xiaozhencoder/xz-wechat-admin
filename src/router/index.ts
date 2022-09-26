import { createRouter, createWebHashHistory, createWebHistory, Router } from "vue-router"
import Layout from "@/layout"
import { RouterTy } from "~/router"
import uiRouter from "./ui"
import pullDrainage from "./pullDrainage"
import contentCenter from "./contentCenter"

export const constantRoutes: RouterTy = [
  // {
  //   path: "/redirect",
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: "/redirect/:path(.*)",
  //       component: () => import("@/views/redirect")
  //     }
  //   ]
  // },
  {
    path: "/login",
    component: () => import("@/views/login/Login.vue"),
    hidden: true
  },

  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    meta: { title: "Dashboard" },
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        meta: { title: "Dashboard", elSvgIcon: "Fold" }
      }
    ]
  },

  {
    path: "/404",
    component: () => import("@/views/error-page/404.vue"),
    hidden: true
  },
  {
    path: "/401",
    component: () => import("@/views/error-page/401.vue"),
    hidden: true
  },

  ...pullDrainage,
  ...contentCenter,
  ...uiRouter
]
/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes: RouterTy = [{ path: "/:pathMatch(.*)", redirect: "/404", hidden: true }]

const router: Router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: constantRoutes
})

// export function resetRouter() {
//   const newRouter = createRouter({
//     history: createWebHashHistory(),
//     scrollBehavior: () => ({ top: 0 }),
//     routes: constantRoutes
//   })
// }

export default router
