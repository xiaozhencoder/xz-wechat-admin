<template>
  <div
    class="app-main"
    :class="{
      'app-custom-class': baseRout?.children.length > 0 && !baseRout?.meta?.pullDown
    }"
  >
    <router-view v-slot="{ Component, route }">
      <transition name="fade-transform">
        <component :is="Component" :key="route.fullPath" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

console.log(route)

const baseRout = computed(() => {
  return route.matched.filter((r) => r.name)[0]
})
</script>

<style scoped lang="scss">
.app-main {
  width: 100%;

  padding: $app-main-padding;
  top: $layout-header-height;
  // background-color: $color-white;
  // box-shadow: $navbar-box-shadow;
  // border-radius: 8px;
  // margin: 10px;
  overflow-y: scroll;
  height: calc(100vh - $layout-header-height - $app-main-padding * 2 + 5px);

  .app-main {
    padding: 0;
  }
}

.app-custom-class {
  width: calc(100vw - $sidebar-width - $app-main-padding * 2 - 5px);
}
</style>
