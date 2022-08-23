<template>
  <div class="simple-container">
    <div class="simple-operation">
      <xz-search v-model:value="searchVal" width="100%" @input="handleSearchVal" />
    </div>
    <div v-if="options.length" class="simple-bottom">
      <div class="simple-group">
        <!-- :class="{ 'is-diabeld': item1[attrs?.disabledKey] && item1[props.config?.value] !== currentVal }" -->
        <div
          v-for="(item, index) in currentOption"
          :key="index"
          class="simple-group-item pointer"
          :class="{ 'is-active': item[props.config?.value] === currentVal }"
          @click="handleSelect(item[props.config?.value])"
        >
          {{ item[props.config?.label] }}
        </div>
      </div>
    </div>
    <no-result v-else style="height: 280px" text="请输入其他搜索词检索" />
  </div>
</template>

<script lang="ts" setup>
import NoResult from "@/components/NoResult"
import { ObjTy } from "~/common"
const emit = defineEmits(["update:value", "change"])

const props = defineProps({
  // 选项
  options: {
    type: Array<ObjTy>,
    default: () => []
  },

  // 选项配置
  config: {
    type: Object,
    default: () => {
      return {
        label: "label",
        value: "value",
        children: "children"
      }
    }
  },

  // 当前选中值
  currentVal: {
    type: String,
    default: ""
  }
})

const searchVal = ref<string>("")
const currentOption = ref<Array<ObjTy>>(props.options)

// 搜索
const handleSearchVal = (val: string) => {
  currentOption.value = props.options.filter(item => item[props.config.label].toLocaleLowerCase()
          .includes(val.toLocaleLowerCase()))
}

const handleSelect = (val) => {
  emit("update:value", val)
  emit("change", val)
}
</script>

<style lang="scss" scoped>
.simple-container {
  max-height: 305px;
  min-height: 210px;
  .simple-operation {
    display: flex;
    align-items: center;
    border-bottom: 1px solid $background-color-base;
  }

  :deep(.el-input__wrapper) {
    background-color: $background-color-base;

    :hover {
      box-shadow: none;
    }
  }

  .simple-bottom {
    flex: 1;
    max-height: 256px;
    padding-top: 10px;
    overflow: hidden;

    &:hover {
      width: 439px;
      overflow-y: auto;
    }
    .simple-group {
      display: flex;
      flex-wrap: wrap;
      line-height: 28px;
      width: 436px;
      &-item {
        width: 45%;
        padding: 0 10px;
        margin: 2px 0;
        border-radius: 4px;

        &:hover {
          border: 0px;
          background-color: $background-color-base;
        }
      }
      .simple-group-item:nth-child(even) {
        margin-left: 3px;
      }
    }
  }
}
.is-active {
  background: $color-primary !important;

  color: $color-white;
  transition: all 0.3s;
}
.is-diabeld {
  color: $diabeld-color;
  cursor: not-allowed;
}
.item-test {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
