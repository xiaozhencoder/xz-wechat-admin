<template>
  <div :class="{ 'multi-select-line': isLine }">
    <InnerSelect
      ref="innerSelectRef"
      :custom-class="customClass"
      :selects="selects"
      :target-options="targetOptions"
      :is-multiple="isMultiple"
      :is-search="isSearch"
      :is-check-all="isCheckAll"
      v-bind="$attrs"
      :is-null-data-commit="isNullDataCommit"
      @changeCheckbox="changeCheckbox"
      @changeBorderColor="changeBorderColor"
    >
      <div v-if="!isLine" class="label-tag" :class="borderBottomColor">
        <span v-show="selectData.length === 0" class="tag-input-placeholder">{{ placeholder }}</span>
        <el-tag
          v-for="(item, index) in selectData"
          :key="index"
          :closable="isMultiple"
          :disable-transitions="false"
          @close="remove(index)"
        >
          {{ item.name }}
        </el-tag>
      </div>
      <div v-else class="frame-content" :class="borderColor">
        <el-button plain @click="isVisible = true">
          <span :class="{ overflow: isLine }">{{ selectData.length === 0 ? placeholder : selectData[0].name }}</span>
          <span v-if="selectData.length > 0" class="check-num">{{ selectData.length }}</span>
          <svg-icon icon-class="drop-down" style="font-size: 16px" />
        </el-button>
      </div>
    </InnerSelect>
  </div>
</template>

<script setup lang="ts">
import InnerSelect from "./module/innerSelect.vue"

const emit = defineEmits(["changeCheckbox", "update:limit", "cpage", "climit", "pagination"])

const borderBottomColor = ref("")
const borderColor = ref("")
const selectData = ref<any>([])
const selects = ref<any>([])
const isVisible = ref(false)

const porps = defineProps({
  placeholder: {
    type: String,
    default: "请选择"
  },
  type: {
    type: String,
    default: ""
  },
  isNullDataCommit: {
    type: Boolean,
    default: false
  },
  isSearch: {
    type: Boolean,
    default: true
  },
  isCheckAll: {
    type: Boolean,
    default: true
  },
  isMultiple: {
    type: Boolean,
    default: true
  },
  isLine: {
    type: Boolean,
    default: false
  },
  targetOptions: {
    type: Array<any>,
    default: ()=> []
  },
  value: {
    type: [String, Array],
    default: ""
  },
  customClass: {
    type: String,
    default: ""
  }
})

watch(
  () => porps.value,
  () => {
    getData()
  },
  { deep: true }
)

watch(
  () => porps.targetOptions,
  () => {
    getData()
  },
  { deep: true }
)

const changeCheckbox = (v) => {
  selectData.value = porps.targetOptions.filter((item) => v.includes(item.label))
  const val = selectData.value.map((s) => s.label)
  selects.value = val
  emit(
    "changeCheckbox",
    typeof porps.value === "string" ? val.join(",") : val,
    porps.type
  )
}

const changeBorderColor = (flag) => {
  if (flag) {
    borderBottomColor.value = "border-bottom-color"
    borderColor.value = "border-color"
  } else {
    borderBottomColor.value = ""
    borderColor.value = ""
  }
}
const remove = (index) => {
  selectData.value.splice(index, 1)
  const val = selectData.value.map((s) => s.label)
  selects.value = val
  emit("changeCheckbox", val, porps.type)
}

const getData = () => {
  selects.value =
    typeof porps.value === "string"
    ? porps.value.split(",")
    : porps.value
  selectData.value = porps.targetOptions.filter((item) => selects.value.indexOf(item.label) !== -1)
}

onMounted(() => {
  getData()
})
</script>

<style lang="scss" scoped>
.multi-select-line {
  width: max-content;
}
.disabled {
  cursor: not-allowed;
}

.label-tag {
  border-bottom: 1px solid #dcdfe6;
  padding-bottom: 5px;
}

.border-bottom-color {
  border-bottom-color: $color-primary;
}
.border-color {
  border-color: $color-primary !important;
  background-color: #f6f7f9 !important;
}
.frame-content {
  :deep(.el-button) {
    min-width: 50px !important;
    height: 30px !important;
    > span {
      margin: 0 8px;
    }
  }
  :deep(.el-button.is-plain) {
    color: #26292e;
    font-size: 14px;
    padding: initial;
    background-color: transparent;
    border: none;
  }
  border: 1px solid transparent;
  border-radius: 4px;

  &:hover {
    border-color: $color-primary;
    background-color: #f6f7f9;
  }

  .check-num {
    margin-left: 6px;
    width: 22px;
    height: 22px;
    font-size: 8px;
    background-color: #f6f7f9;
    line-height: 22px;
    text-align: center;
  }
  .overflow {
    max-width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
