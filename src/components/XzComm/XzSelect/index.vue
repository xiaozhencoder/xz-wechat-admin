<template>
  <div
    ref="selectContainer"
    class="com-select-container"
    :class="{ 'border-bottom': line }"
    :style="[styles, { width: line ? '100%' : selLen }]"
  >
    <el-select
      ref="selectRef"
      v-model="selectValue"
      :placeholder="placeholder"
      :visible-arrow="false"
      popper-class="com-el-select"
      :class="className"
      :style="[styles, { width: line ? '100%' : selLen }]"
      :disabled="disabled"
      @visible-change="visibleChange"
    >
      <el-option
        v-for="item in items"
        :key="item[config.value]"
        :label="item[config.label]"
        :value="item[config.value]"
        :disabled="item.disabled"
      />
    </el-select>
    <!-- <div :class="['common-drop-down', { visible: visible }]">
      <svg-icon icon-class="drop-down" />
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import { getCharSizeByCanvas } from "@/utils"
const { proxy }: any = getCurrentInstance()

const emitSelect = defineEmits(["change"])

const props = defineProps({
  value: {
    type: [String, Number],
    default: ""
  },
  placeholder: {
    type: String,
    default: "请选择"
  },
  items: {
    type: Array<any>,
    default: () => []
  },
  className: {
    type: String,
    default: ""
  },
  styles: {
    type: Object,
    default: () => ({})
  },
  disabled: {
    type: Boolean,
    default: false
  },
  config: {
    type: Object,
    default: () => ({
      label: "label",
      value: "value"
    })
  },
  line: {
    type: Boolean,
    default: false
  }
})

const sel = ref(props.value ? getLabel(props.items, props.value) : props.placeholder)
const selLen = ref(`${42 + getCharSizeByCanvas(sel.value).width}px`)
const visible = ref(false)
const selectValue = ref(props.value)

watch(
  () => selectValue.value,
  (newVal, oldVal) => {
    const label = getLabel(props.items, newVal)
    selLen.value = `${46 + getCharSizeByCanvas(label).width}px`
    emitSelect("change", newVal)
  }
)
watch(
  () => props.value,
  (newVal, oldVal) => {
    selectValue.value = newVal
  }
)

function getLabel(list: any[], val: string | number) {
   return typeof list[0] === "string"
    ? list?.find((item: any) => item === val) || list[0]
    : list?.find((item: { [x: string]: any }) => item[props.config.value] === val)?.[props.config.label] ||
        list[0]?.[props.config.label] ||
        val ||
        props.placeholder
}

function visibleChange(val: boolean) {
  visible.value = val
  proxy.$refs.selectContainer.click()
}
</script>
<style lang="scss" scoped>
.border-bottom {
  :deep(.el-select) {
    border-radius: 0;
    --el-select-input-focus-border-color: none;
    .el-input .is-focus {
      border-radius: 0;
      border-bottom: 1px solid $color-primary;
    }
    .el-input__wrapper {
      box-shadow: none;
      border-bottom: 1px solid $border-color-base;
    }
  }
}

.com-el-select {
  max-width: $select-max-width;
}

:deep(.el-input__wrapper) {
  box-shadow: none;
  &:hover {
    box-shadow: none;
  }
}
</style>
