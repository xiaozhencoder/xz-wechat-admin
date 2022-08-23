<template>
  <div
    class="search-box"
    :style="{ width: width + (width.indexOf('%') !== -1 ? '' : width.indexOf('px') !== -1 ? '' : 'px') }"
  >
    <el-input
      v-model.trim="value"
      :placeholder="placeholder"
      :disabled="disabled"
      @focus="searchIcon = 'search-icon'"
      @blur="searchIcon = 'search-gray'"
      @change="onChange"
      @input="onInput"
    >
      <template v-if="!isAdd" #prefix>
        <svg-icon :icon-class="searchIcon" />
      </template>
      <template #suffix>
        <svg-icon v-if="value && !isAdd" style="cursor: pointer" icon-class="close" @click="clean" />
        <svg-icon v-if="isAdd" style="cursor: pointer" :icon-class="suffixIcon" @click="onAdd" />
      </template>
    </el-input>
  </div>
</template>

<script lang="ts" setup name="XzSearch">
const searchIcon = ref("search-gray")
const suffixIcon = ref("add-white")
const emitSearch = defineEmits(["update:value", "input", "change", "add"])

const propsSearch = defineProps({
  value: {
    type: String,
    default: ""
  },
  placeholder: {
    type: String,
    default: "输入关键字搜索"
  },
  width: {
    type: String,
    default: "232"
  },
  realTime: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  isAdd: {
    type: Boolean,
    defalut: false
  }
})

watch(
  () => propsSearch.value,
  (newVal, oldVal) => {
    if (newVal) {
      suffixIcon.value = "add-custom"
    } else {
      suffixIcon.value = "add-white"
    }
    if (propsSearch.realTime) {
      onInput(newVal)
    }
  },
  { deep: true }
)

const onChange = (val: string) => {
  emitSearch("update:value", val)
  emitSearch("change", val)
}
const clean = () => {
  if (propsSearch.disabled) return
  onChange("")
  onInput("")
}

const onInput = (val: string) => {
  emitSearch("input", val)
}

const onAdd = () => {
  if (propsSearch.value) {
    emitSearch("add", propsSearch.value)
    clean()
  }
}
</script>

<style lang="scss" scoped>
.search-box {
  height: 32px;
  line-height: 32px;

  :deep(.el-input__prefix) {
    font-size: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    left: 5px;
  }
  :deep(.el-input__suffix) {
    font-size: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
