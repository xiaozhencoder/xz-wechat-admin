<template>
  <div class="sidebar" v-if="routes.length > 0">
    <!--router nav-->
    <el-scrollbar>
      <el-menu
        class="sidebar-menu"
        :default-active="activeMenu"
        :collapse="!isCollapse"
        :unique-opened="false"
        :collapse-transition="false"
        mode="vertical"
        @select="menuSelect"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import SidebarItem from "./SidebarItem.vue"
import { useAppStore } from "@/store/app"
import { usePermissionStore } from "@/store/permission"

//导入配置文件
const appStore = useAppStore()
const settings = computed(() => {
  return appStore.settings
})

const route = useRoute()
const permissionStore = usePermissionStore()

const routes = computed(() => {
  let routeArr = getCurrRoutes()
  return routeArr.length > 0 ? routeArr[0]?.children : []
})
const isCollapse = computed(() => {
  // return appStore.sidebar.opened
  return true
})

const menuSelect = (val) => {
  console.log(val)
}

const getCurrRoutes = () => {
  let obj = {}
  let path = activeMenu.value?.slice(activeMenu.value?.lastIndexOf("/") + 1)
  const getRoutes = (routes, path, obj) => {
    routes?.forEach((v) => {
      let p = v.path.replace("/", "")
      if (p) {
        obj[p] = path
        if (v?.children && v.children.length > 0) {
          getRoutes(v?.children, v.path, obj)
        }
      }
    })
  }
  getRoutes(permissionStore.routes, "", obj)
  return permissionStore.routes.filter((r) => r.path === obj[path])
}

const activeMenu = computed((): any => {
  const { meta, path } = route
  if (meta.activeMenu) {
    return meta.activeMenu
  }
  return path
})
</script>
<style lang="scss">
.sidebar {
  background-color: $color-white;
  margin: 10px 0;
  border-radius: 8px;
  box-shadow: $navbar-box-shadow;

  .sidebar-menu {
    width: $sidebar-width;
    border-radius: 8px;
  }
}
</style>
