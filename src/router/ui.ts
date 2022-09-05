import Layout from "@/layout"
export default [
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
      },
      {
        path: "svgView",
        component: () => import("@/views/ui/svg/index.vue"),
        meta: { title: "SVG", elSvgIcon: "Star" },
        name: "SvgView"
      }
    ]
  }
]
