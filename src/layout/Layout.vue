<template>
  <div class="layout">
    <div class="header">
      <Navbar />
    </div>
    <div class="main">
      <Sidebar />
      <AppMain />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Sidebar, Navbar, AppMain } from "./components"
</script>

<style lang="scss">
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  min-width: $layout-min-width;
  .header {
    width: 100%;
  }
  .main {
    display: flex;
    flex: 1;
    min-width: 0;
  }
}
</style>
