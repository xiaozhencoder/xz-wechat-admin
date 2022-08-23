<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <router-link key="collapse" class="sidebar-logo-link" to="/">
        <svg-icon v-if="logo" icon-class="logo-owl" class="sidebar-logo" />
        <h1 v-if="!collapse" class="sidebar-title">{{ title }}</h1>
      </router-link>
      <!-- <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <svg-icon v-if="logo" icon-class="sidebar-logo" class="sidebar-logo" />
        <h1 class="sidebar-title">{{ title }}</h1>
      </router-link> -->
    </transition>
  </div>
</template>

<script setup lang="ts">
import setting from "@/settings"
defineProps({
  collapse: {
    type: Boolean,
    required: true
  }
})
const state = reactive({
  title: setting.title,
  logo: setting.logoUrl
})
//export to page for
const { title, logo } = toRefs(state)
</script>

<style lang="scss">
.sidebar-logo-container {
  width: $sidebar-width - 15px;
  height: $navbar-height;
  line-height: $navbar-height;
  background: $sidebar-logo-background;
  padding-left: 15px;
  text-align: left;
  overflow: hidden;
  & .sidebar-logo-link {
    height: 100%;
    width: 100%;
    & .sidebar-logo {
      color: $sidebar-logo-color;
      width: $sidebar-logo-width;
      height: $sidebar-logo-hight;
      vertical-align: middle;
      margin-right: 12px;
      border-radius: 50%;
    }
    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: $color-white;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }
  &.collapse {
    .sidebar-logo {
      margin-right: 0;
    }
  }
}
</style>
