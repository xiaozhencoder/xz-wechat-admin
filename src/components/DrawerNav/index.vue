<template>
  <div class="common-active-nav" :class="{ disabled: disabled }">
    <nav
      v-for="item in data"
      :key="item.path"
      :class="{ active: value === item.name }"
      @click="handle(item.name, item)"
    >
      {{ item?.meta?.title }}
    </nav>
  </div>
</template>

<script setup lang="ts">
let clickTime = 0
const propsSideBarNew = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  value: {
    type: [String, Number],
    default: ""
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
const emitSideBarNew = defineEmits(["handle"])
const handle = function (id: string | number, row: any) {
  if (Date.now() - clickTime > 500) {
    clickTime = Date.now()
    if (!propsSideBarNew.disabled && !row.development && id !== propsSideBarNew.value) {
      emitSideBarNew("handle", id, row)
    }
  }
}
</script>

<style lang="scss" scoped>
.common-active-nav {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: #fff;
  padding: 15px 40px;
  position: sticky;
  top: 56px;
  z-index: 10;
  &.disabled {
    cursor: not-allowed;
    nav {
      cursor: not-allowed;
    }
  }
  nav {
    color: #888d97;
    font-size: 18px;
    margin-right: 52px;
    position: relative;
    cursor: pointer;
    &:not(:last-child) {
      &::after {
        content: "";
        position: absolute;
        width: 1px;
        height: 50%;
        top: 30%;
        right: -26px;
        background: #dbdee4;
      }
    }
    &:last-child {
      margin-right: 0;
    }
    &.active {
      color: #26292e;
      font-size: 22px;
    }
    &.development {
      display: flex;
      align-items: center;
      cursor: not-allowed;
    }
    .development-svg {
      font-size: 32px;
      margin-left: 8px;
    }
  }
}
</style>
