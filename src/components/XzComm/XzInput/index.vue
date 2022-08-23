<template>
  <div class="com-input-container">
    <el-input
      ref="comInputRef"
      v-model.trim="inputValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :maxlength="maxlength !== 0 ? maxlength : ''"
      :autosize="autosize"
      :readonly="readonly"
      :class="{ 'input-show-limit': showLimit }"
      @input="handleInput"
      @change="handleChange"
    />
    <span v-if="showLimit && maxlength" class="com-input-number">
      {{ maxlength - (value ? value.length : 0) < 0 ? 0 : maxlength - (value ? value.length : 0) }}
    </span>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(["update:value", "change", "input"])

const propsSearch = defineProps({
  type: {
    type: String,
    default: "textarea"
  },
  maxlength: {
    type: Number,
    default: 0
  },
  value: {
    type: String,
    default: ""
  },
  placeholder: {
    type: String,
    default: "请输入"
  },
  showLimit: {
    type: Boolean,
    default: false
  },
  autosize: {
    type: [Object, Boolean],
    default: () => {
      return { minRows: 1, maxRows: 3 }
    }
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  }
})

// 子组件定义自己的value
const inputValue = computed({
  get: () => propsSearch.value.trim(),
  set: (val) => emit("update:value", val)
})

const handleInput = (val: string) => {
  emit("update:value", val)
  emit("input", val)
}

const handleChange = (val: string) => {
  emit("update:value", val)
  emit("change", val)
}
</script>

<style lang="scss" scoped>
.com-input-container {
  position: relative;
  width: 100%;

  .com-input-number {
    position: absolute;
    right: 0;
    bottom: 8px;
    color: $color-text-secondary;
  }

  .input-show-limit {
    :deep(.el-textarea__inner) {
      padding-right: 30px;
    }
  }

  :deep(.el-input__inner) {
    border: none;
    border-bottom: 1px solid $border-color-base;
    border-radius: 0px;
    padding: 5px 0;
    height: 32px;
    &::placeholder {
      color: $color-text-placeholder;
      // font-size: 14px;
      // font-weight: 400;
    }
  }

  :deep(.el-textarea__inner) {
    border: none;
    border-bottom: 1px solid $border-color-base;
    border-radius: 0;
    resize: none;
    padding: 5px 0;
    box-shadow: none;
    &::placeholder {
      font-size: 12px;
      font-weight: 400;
    }
  }

  :deep(.el-textarea .el-textarea__inner:focus) {
    border-bottom-color: $color-primary;
    box-shadow: none;
  }

  :deep(.el-textarea__inner:hover) {
    box-shadow: none;
  }

  // :deep(.el-textarea.is-disabled .el-textarea__inner) {
  //   background-color: #fff;
  // }

  // :deep(.el-input.is-disabled .el-input__inner) {
  //   background-color: #fff;
  // }
}
</style>
