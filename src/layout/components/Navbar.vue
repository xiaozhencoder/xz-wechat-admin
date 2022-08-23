<template>
  <div class="navbar">
    <div class="nav-left flex">
      <!--logo-->
      <Logo v-if="settings.sidebarLogo" :collapse="false" />
      <div class="nav-menu m-l-8" v-for="item in routes" :key="item.path">
        <router-link :to="{ path: item.path, query: resolveQuery(item) }">
          <div class="nav-title">
            <span>{{ item.meta?.title }}</span>
          </div>
        </router-link>
      </div>
    </div>
    <div class="nav-right">
      <div class="nav-setting"></div>
      <div class="nav-user flex-center">
        <div class="content">
          <svg-icon icon-class="nav-user" />
          <span class="m-l-8 line-1">liushuang@163.com</span>
          <svg-icon class="drop-color" icon-class="drop-down" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Logo from "./Sidebar/Logo.vue"
import { ElMessage } from "element-plus"
import { usePermissionStore } from "@/store/permission"
import { isQuery } from "@/utils/validate"

import { useAppStore } from "@/store/app"
import { useUserStore } from "@/store/user"
import { queryToObject } from "@/utils"

const permissionStore = usePermissionStore()

import { ref } from "vue"
const { proxy }: any = getCurrentInstance()
console.log(proxy.$router.currentRoute.value?.fullPath)

const props = defineProps({
  pointer: {
    type: Boolean,
    defalut: false
  }
})

const settings = computed(() => {
  return appStore.settings
})
const currRoute = ref<string>(proxy.$router.currentRoute.value?.fullPath)

const routes = computed(() => {
  return permissionStore.routes.filter((item) => !item.hidden)
})

// 解析参数'{id:1}'|| id=1 => {id: 1}
const resolveQuery = computed(() => {
  return (route) => {
    const query = route.value?.query
    if (query) {
      try {
        if (isQuery(query)) {
          return queryToObject(query)
        } else {
          return JSON.parse(query)
        }
      } catch (error) {}
    }
  }
})

const appStore = useAppStore()
// const toggleSideBar = () => {
//   appStore.M_toggleSideBar()
// }
/*
 * 退出登录
 * */
const router = useRouter()
const route = useRoute()
const loginOut = () => {
  const userStore = useUserStore()
  userStore.logout().then(() => {
    ElMessage({ message: "退出登录成功", type: "success" })
    router.push(`/login?redirect=/`)
  })
}
</script>

<style lang="scss" scoped>
.navbar {
  height: $navbar-height;
  line-height: $navbar-height;
  background: $navbar-background;
  box-shadow: $navbar-box-shadow;
  display: flex;
  justify-content: space-between;
}
.nav-menu {
  font-weight: 700;
  color: $color-white;
  cursor: pointer;

  .router-link-active > .nav-title {
    border-bottom: 2px solid $color-white;
    height: 95%;
  }

  .nav-title {
    padding: 0 10px;
    color: $color-white;
    &:hover {
      background-color: #425369;
    }
  }
}

.nav-right {
  display: flex;
  cursor: pointer;
  margin-right: 30px;
  background-color: $navbar-background;

  .nav-user {
    margin: 10px 0;
    padding: 4px 8px;
    border-radius: 5px;

    > div.content {
      display: contents;
      > svg {
        font-size: 24px;
      }

      > span {
        color: $color-white;
        max-width: 90px;
      }
      .drop-color {
        stroke: #fff;
      }
    }

    &:hover {
      background-color: #425369;
    }
  }
}
</style>
