<template>
  <div class="common-select-container" :style="{ width: selLen }">
    <el-popover
      ref="popoverRef"
      trigger="click"
      :width="465"
      placement="bottom-start"
      v-bind="$attrs"
      @show="() => (visible = true)"
      @hide="() => (visible = false)"
    >
      <div v-if="options.length" style="width: 100%">
        <component
          :is="Simple"
          :config="config"
          v-model:current-val="value"
          v-bind="$attrs"
          :options="options"
          @change="handleSelect"
        />
      </div>
      <div v-else class="no-options">无数据</div>

      <!-- 下拉框 -->
      <template #reference>
        <!-- 内容 -->

        <span
          :class="[
            'select-container pointer',
            customClass,
            {
              'is-disabled': isDisabled,
              'disabled-select': disabled,
              'border-color': visible
            }
          ]"
        >
          <svg-icon v-if="isDisabled" class="mr8" icon-class="warn" />
          <span class="select-container-val">{{ formatVal }}</span>
          <span v-if="!formatVal" class="select-placeholder">
            {{ placeholder }}
          </span>
          <div v-if="hasDropdwonIcon || !formatVal" :class="['common-drop-down', { visible: visible }]">
            <svg-icon icon-class="drop-down" />
          </div>
        </span>
      </template>
    </el-popover>
  </div>
</template>

<script lang="ts" setup>
import Simple from "./module/simpleSelect.vue"
import { getCharSizeByCanvas } from "@/utils"
const popoverRef = ref()
const emit = defineEmits(["change", "update:visible"])
const props = defineProps({
  // 下拉框类型
  type: {
    type: String,
    default: "Simple"
  },
  // 选中值
  value: {
    type: String,
    default: ""
  },

  // 下拉框是否可见
  // visible: {
  //   type: Boolean,
  //   default: false
  // },

  // 被选中的值
  selectAllData: {
    type: Array,
    default: () => []
  },

  // 选择器类型
  selectType: {
    type: String,
    default: "simple"
  },

  // 是否被禁用选择
  disabled: {
    type: Boolean,
    default: false
  },

  // 选项禁用字段
  disabledKey: {
    type: String,
    default: ""
  },

  // 下拉菜单选项
  dropdownOptions: {
    type: Array,
    default: () => []
  },
  // 选项
  options: {
    type: Array<any>,
    default: () => []
  },
  // 选项配置
  config: {
    type: Object,
    require: false,
    default: () => ({
      label: "label",
      value: "value",
      children: "children"
    })
  },
  placeholder: {
    type: String,
    default: "请选择"
  },

  hasDropdwonIcon: {
    type: Boolean,
    default: true
  },

  customClass: {
    type: String,
    default: ""
  }
})

const visible = ref<boolean>(false)
const selLen = ref(`${42 + getCharSizeByCanvas(props.placeholder).width}px`)

watch(() => props.value, (newVal, oldVal) => {
  popoverRef.value.hide()
})

const formatVal = computed(() => {
  // 做回显
  const { value, label } = props.config

  let currentLabel = ""
  if (props.value) {
    currentLabel = props.options.find((v: any) => v[value] === props.value)[label]
  }
  selLen.value = `${42 + getCharSizeByCanvas(currentLabel || props.placeholder).width}px`
  return currentLabel
})



// 当前选中值是否被禁用
const isDisabled = computed(() => {
  let disabled = false
  const { value, children, label } = props.config

  if (props.value) {
  }
  return disabled
})

// 选择
const handleSelect = (val) => {
  emit("change", val)
}
</script>

<style lang="scss" scoped>
.common-select-container {
  max-width: 166px;
  min-width: 80px;

  .select-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px;
    height: 32px;
    line-height: 32px;
    border: 1px solid transparent;
    border-radius: 4px;
    position: relative;
    &-val {
      max-width: 166px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    &:hover {
      background-color: $background-color-base;
    }

    .common-drop-down {
      font-size: 16px;
      margin-left: 8px;
      position: absolute;
      right: 5px;
      top: 0px;
      pointer-events: none;
      transform: rotate(0deg);
      transition: transform 0.2s;
      &.visible {
        transform: rotate(-180deg);
        transition: transform 0.2s;
      }
    }
  }

  .border-color {
    border: 1px solid $color-primary;
    background-color: $background-color-base;
  }
}

.is-disabled {
  border: 1px solid $diabeld-border-color;
}
.select-options {
  display: flex;
  flex-direction: column;
  > li {
    list-style: none;
    padding: 0 20px;
    cursor: pointer;
    height: 34px;
    line-height: 34px;
    &:hover {
      background-color: $background-color-base;
    }
  }
}
.no-options {
  min-width: 100px;
  padding: 0px 12px;
  text-align: center;
  color: #999;
}

.select-placeholder {
  color: #888d97;
}

.select-suffix {
  margin-right: 6px;
}
.mr8 {
  margin-right: 8px;
}
.disabled-select {
  cursor: not-allowed;
  pointer-events: none;
  > span {
    color: #dbdee4;
  }
  > svg {
    color: #dbdee4;
  }
}
</style>
<style lang="scss">
.el-popper.el-dropdown-menu {
  margin: 4px 0;
  box-shadow: 0px 10px 12px 0px rgba(23, 22, 23, 0.1);
  border-radius: 4px;
  border: 1px solid #dbdee4;

  .popper__arrow {
    display: none;
  }
}
</style>
