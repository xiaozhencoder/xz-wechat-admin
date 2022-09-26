import Layout from "@/layout"
import AppMain from "@/layout/components/AppMain.vue"
export default [
  {
    path: "/pullDrainage",
    name: "PullDrainage",
    component: Layout,
    redirect: "/pullDrainage/welcomeSpeech/customWelcome",
    meta: { title: "拉新引流", icon: "example" },
    children: [
      {
        path: "welcomeSpeech",
        name: "WelcomeSpeech",
        component: () => import("@/views/pullDrainage/index.vue"),
        // component: AppMain,
        meta: { title: "欢迎语", elSvgIcon: "WindPower" },
        children: [
          {
            path: "customWelcome",
            name: "CustomWelcome",
            component: () => import("@/views/pullDrainage/welcomeSpeech/customSpeech/index.vue"),
            meta: { title: "客户欢迎语" }
          },
          {
            path: "createCustomWelcome",
            name: "CreateCustomWelcome",
            hidden: true,
            component: () => import("@/views/pullDrainage/welcomeSpeech/customSpeech/modules/create.vue"),
            meta: { title: "创建客户欢迎语" }
          },
          {
            path: "customGroupWelcome",
            name: "CustomGroupWelcome",
            component: () => import("@/views/pullDrainage/welcomeSpeech/customGroupSpeech/index.vue"),
            meta: { title: "客户群欢迎语" }
          }
        ]
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
