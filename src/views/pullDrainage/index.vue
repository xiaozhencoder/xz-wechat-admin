<template>
  <router-view v-slot="{ Component }">
    <transition name="fade-transform">
      <component :is="Component" :key="route.path" />
    </transition>
  </router-view>
</template>

<script lang="ts" name="welcomeSpeech" setup>
const route = useRoute()
</script>

<style lang="scss" scoped></style>
