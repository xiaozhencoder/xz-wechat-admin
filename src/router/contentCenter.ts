import Layout from "@/layout"

export default [
  {
    path: "/contentCenter",
    name: "ContentCenter",
    component: Layout,
    meta: { title: "内容中心", icon: "drop-down-white", pullDown: true },
    children: [
      {
        path: "materialLibrary",
        name: "MaterialLibrary",
        component: () => import("@/views/contentCenter/materialLibrary/index.vue"),
        meta: {
          title: "素材库",
          icon: "material-lib"
        }
      },
      {
        path: "verbalTrickLibrary",
        name: "VerbalTrickLibrary",
        component: () => import("@/views/contentCenter/verbalTrickLibrary/index.vue"),
        meta: {
          title: "话术库",
          icon: "verbal-trick-lib"
        }
      }
    ]
  }
]
