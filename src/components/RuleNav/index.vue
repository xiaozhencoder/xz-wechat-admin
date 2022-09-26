<template>
  <div class="rule-nav-container">
    <nav
      v-for="(item, index) in data"
      :key="index"
      :class="{ active: value === item.id, isComplete: item.isComplete }"
      @click="handle(item.id)"
    >
      <template v-if="item.isComplete && tickIcon">
        <span><svg-icon class="tick-icon" icon-class="rule-nav-tick" /></span>
        {{ item.name }}
      </template>
      <template v-else>
        <span>{{ index + 1 }}</span>
        {{ item.name }}
      </template>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ObjTy } from '~/common';

const emit = defineEmits(["handle"])
const props = defineProps({
  data: {
    type: Array<ObjTy>,
    default: () => []
  },
  value: {
    type: [String, Number],
    default: ''
  },
  tickIcon: {
    type: Boolean,
    default: false
  }
})
watch(
  () => props.data,
  (n, o) => {
    console.log('131231313213', n)
  },
  {
    deep: true,
    immediate: true
  }
)
const handle = (id) => {
  emit('handle', id)
}
</script>

<style lang="scss" scoped>
.rule-nav-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  nav {
    margin-right: 200px;
    font-size: 16px;
    position: relative;
    &:not(:last-child) {
      &::after {
        content: "";
        position: absolute;
        width: 140px;
        height: 1px;
        top: 50%;
        right: -170px;
        background: #dbdee4;
      }
    }
    &:last-child {
      margin-right: 0;
    }

    &.isComplete {
      color: #26292e;
      span {
        color: #00a39b;
        background: #fff;
        border: 1px solid #00a39b;
      }
    }
    &.active {
      color: #26292e;
      span {
        background: #00a39b;
        color: #fff;
      }
    }
    .tick-icon {
      font-size: 24px;
      margin-top: 3px;
    }
    span {
      width: 32px;
      height: 32px;
      font-size: 16px;
      background: #f0f3f5;
      border-radius: 34px;
      line-height: 32px;
      text-align: center;
      display: inline-block;
      cursor: pointer;
    }
  }
}
</style>
