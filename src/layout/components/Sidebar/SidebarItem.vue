<template>
  <template v-if="item && !item.hidden">
    <template v-if="showSidebarItem(item.children, item)">
      <Link v-if="item.meta" :to="resolvePath(item.path)" :class="{ 'router-link-active': isActive }">
        <el-menu-item :index="item.path" :class="{ 'submenu-title': !isNest }">
          <item :meta="item.meta || item.meta" />
          <template #title>{{ item.meta?.title }}</template>
        </el-menu-item>
      </Link>
    </template>
    <el-sub-menu v-else ref="subMenu" :index="item.path">
      <template v-if="item.meta" #title>
        <item :meta="item.meta" />
        <span>{{ item.meta.title }}</span>
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="resolvePath(child.path)"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(item.path)"
      />
    </el-sub-menu>
  </template>
</template>

<script setup lang="ts">
/*初始化参数比如引入组件，proxy,state等*/
import Link from "./Link.vue"
import Item from "./Item"
import { isExternal } from "@/utils/validate"
import path from "path"
import { RouteItemTy } from "~/router"
const route = useRoute()

const props = defineProps({
  //每一个router Item
  item: {
    type: Object,
    required: true
  },
  //用于判断是不是子Item,设置响应的样式
  isNest: {
    type: Boolean,
    default: false
  },
  //基础路径，用于拼接
  basePath: {
    type: String,
    default: ""
  }
})
onMounted(() => {
  // console.log("我挂载了");
  // console.log(proxy.item);
})

const isActive = computed(() => {
  const name = props.item.name
  return (route.name as string).includes(name)
})

const showSidebarItem = (children = [], parent: RouteItemTy) => {
  const showingChildren = children.filter((item: RouteItemTy) => !item.hidden)
  if (showingChildren.length === 0) {
    return true
  }
  return false
}

const resolvePath = (routePath: string) => {
  if (isExternal(routePath)) {
    return routePath
  }
  if (isExternal(props.basePath)) {
    return props.basePath
  }
  return path.resolve(props.basePath, routePath)
}
</script>

<style lang="scss" scoped>
.submenu-title {
  > svg {
    font-size: 20px;
    margin-right: 8px;
  }
}
</style>
