import { createRouter, createWebHashHistory, Router } from "vue-router"
import Layout from "@/layout"
import { RouterTy } from "~/router"

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
    path: "/ui",
    name: "UI",
    component: Layout,
    redirect: "/ui/style",
    meta: { title: "UI", icon: "example" },
    children: [
      {
        path: "style",
        name: "Style",
        component: () => import("@/views/ui/comm/index.vue"),
        meta: { title: "公共样式组件", elSvgIcon: "Compass" }
      },
      {
        path: "tabs",
        component: () => import("@/views/ui/tabs/index.vue"),
        meta: { title: "Tabs", elSvgIcon: "Switch" },
        name: "Tabs"
      },
      {
        path: "input",
        component: () => import("@/views/ui/input/index.vue"),
        meta: { title: "Input 输入框", elSvgIcon: "Edit" },
        name: "Input"
      },
      {
        path: "select",
        component: () => import("@/views/ui/select/index.vue"),
        meta: { title: "单选", elSvgIcon: "SetUp" },
        name: "Select"
      },
      {
        path: "multiselect",
        component: () => import("@/views/ui/multiselect/index.vue"),
        meta: { title: "多选", elSvgIcon: "ScaleToOriginal" },
        name: "MultiSelect"
      },
      {
        path: "custom-select",
        component: () => import("@/views/ui/select/customSelect/index.vue"),
        meta: { title: "自定义选择器", elSvgIcon: "Operation" },
        name: "CustomSelect"
      },
      {
        path: "search",
        component: () => import("@/views/ui/search/index.vue"),
        meta: { title: "搜索", elSvgIcon: "Search" },
        name: "Search"
      },
      {
        path: "table",
        component: () => import("@/views/ui/table/index.vue"),
        meta: { title: "表格", elSvgIcon: "Menu" },
        name: "Table"
      },
      {
        path: "edit",
        component: () => import("@/views/ui/edit/index.vue"),
        meta: { title: "自定义文本编辑器", elSvgIcon: "EditPen" },
        name: "Edit"
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
  }
]
/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes: RouterTy = [{ path: "/:pathMatch(.*)", redirect: "/404", hidden: true }]

const router: Router = createRouter({
  history: createWebHashHistory(),
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
