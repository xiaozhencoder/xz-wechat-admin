import Layout from "@/layout"
export default [
  {
    path: "/pullDrainage",
    name: "PullDrainage",
    component: Layout,
    redirect: "/pullDrainage/welcomeSpeech",
    meta: { title: "拉新引流", icon: "example" },
    children: [
      {
        path: "welcomeSpeech",
        name: "WelcomeSpeech",
        component: () => import("@/views/pullDrainage/welcomeSpeech/index.vue"),
        meta: { title: "欢迎语", elSvgIcon: "WindPower" }
      },
      {
        path: "addCustomer",
        name: "AddCustomer",
        component: () => import("@/views/pullDrainage/addCustomer/index.vue"),
        meta: { title: "添加客户", elSvgIcon: "Avatar" }
      },
      {
        path: "pullCustomerGroup",
        name: "PullCustomerGroup",
        component: () => import("@/views/pullDrainage/pullCustomerGroup/index.vue"),
        meta: { title: "拉客进群", elSvgIcon: "UserFilled" }
      },
      {
        path: "getCustomerTools",
        name: "GetCustomerTools",
        component: () => import("@/views/pullDrainage/getCustomerTools/index.vue"),
        meta: { title: "获客工具", elSvgIcon: "Tools" }
      }
    ]
  }
]
