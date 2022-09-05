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
      <div class="nav-user flex-center" ref="userRef" v-click-outside="onClickOutside">
        <div class="content">
          <svg-icon icon-class="nav-user" />
          <span class="m-l-8 line-1">{{ userInfo.email }}</span>
          <svg-icon class="drop-color" icon-class="drop-down" />
        </div>
      </div>
    </div>
  </div>

  <el-popover
    ref="popoverRef"
    popper-class="user-center"
    :show-arrow="false"
    :virtual-ref="userRef"
    trigger="click"
    virtual-triggering
  >
    <div class="nav-user-info">
      <div class="user f-s-20 f-w-500">
        <span>{{ userInfo.userName }}</span>
      </div>
      <span>{{ userInfo.email }}</span>
      <div class="nav-setting">
        <div @click="router.push({ path: '/' })">
          <svg-icon icon-class="icon-user-center" />
          <span>个人中心</span>
        </div>
        <div>
          <a href="https://www.yuque.com/u25374364/zdata/" target="_blank">
            <svg-icon icon-class="icon-help-center" />
            <span>帮助中心</span>
          </a>
        </div>
      </div>
      <span class="p-t-10" @click="loginOut">退出登录</span>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { ClickOutside as vClickOutside, ElMessageBox } from "element-plus"
import Logo from "./Sidebar/Logo.vue"
import { ElMessage } from "element-plus"
import { usePermissionStore } from "@/store/permission"
import { isQuery } from "@/utils/validate"

import { useAppStore } from "@/store/app"
import { useUserStore } from "@/store/user"
import { queryToObject } from "@/utils"
const { userInfo, service } = useUserStore()

const permissionStore = usePermissionStore()

const { proxy }: any = getCurrentInstance()
console.log(proxy.$router.currentRoute.value?.fullPath)

const userRef = ref()
const popoverRef = ref()
const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.()
}

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
const loginOut = () => {
  const userStore = useUserStore()
  ElMessageBox.confirm("此操作将退出登录, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消"
  })
    .then(() => {
      ElMessage({
        type: "success",
        message: "退出成功，请重新登录！"
      })
      setTimeout(async () => {
        await userStore.resetUserInfo()
      }, 1000)
    })
    .catch(() => {})
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

<style lang="scss">
.user-center {
  width: 188px !important;

  .nav-user-info {
    .user {
      padding-left: 10px;
    }

    > span {
      display: inline-block;
      margin-left: 10px;
      cursor: pointer;
    }

    .nav-setting {
      padding: 16px 0;
      border-bottom: 1px solid #f6f7f9;

      div {
        height: 32px;
        border-radius: 4px;

        a {
          display: flex;
        }

        display: flex;
        align-items: center;
        cursor: pointer;

        svg {
          margin-left: 16px;
          width: 24px;
          height: 24px;
        }

        span {
          margin-left: 12px;
        }
      }

      div:first-child {
        margin-bottom: 8px;
      }

      div:hover {
        background: #f6f7f9;
      }
    }
  }
}
</style>
