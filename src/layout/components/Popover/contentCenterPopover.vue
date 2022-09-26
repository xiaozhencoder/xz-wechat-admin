<template>
  <div class="nav-li">
    <div v-for="item in subMenu" :key="item.icon" class="nav-link" @click="linkPage(item.name)">
      <svg-icon :icon-class="item.meta.icon" class="icon" />
      {{ item.meta?.title }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { usePermissionStore } from "@/store/permission"

const emit = defineEmits(["closePopover"])
const props = defineProps({
  subMenu: {
    type: Object,
    default: () => {}
  }
})
const permissionStore = usePermissionStore()
const { routerPush } = useVueRouter()
const route = useRoute()

const routes = computed(() => {
  console.log(permissionStore.routes)
  return permissionStore.routes.filter((item) => !item.hidden)
})

function linkPage(name) {
  routerPush(name)
  emit("closePopover")
}
</script>

<style lang="scss" type="text/scss" scoped>
.nav-li {
  display: flex;
  justify-content: center;
  .nav-link {
    width: 184px;
    height: 56px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
    &:hover {
      background: $color-primary-light-9;
      border-radius: 4px;
    }
    .icon {
      font-size: 32px;
      margin-right: 8px;
      margin-left: 24px;
    }
  }
}
</style>
