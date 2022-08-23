<template>
  <el-popover
    ref="selectPopoverRef"
    placement="bottom-start"
    :show-arrow="false"
    popper-class="outside-popover"
    trigger="click"
    width="280px"
    v-bind="$attrs"
    @hide="popoverHide"
    @show="popoverShow"
  >
    <template #reference>
      <slot />
    </template>

    <div class="select-content">
      <xz-search
        v-if="isSearch"
        ref="searchBoxRef"
        :is-add="attrs['is-add']"
        v-model:value="searchVal"
        :real-time="true"
        :width="'100%'"
        @input="(val) => (searchVal = val)"
        @add="attrs.onAdd"
      />
      <div class="select-content-top">
        <div v-if="isCheckAll && isMultiple" :class="customClass" class="select-all">
          <div>
            <el-checkbox v-model="getCheckAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
              选择全部
            </el-checkbox>
          </div>
          <span>{{ getNum }}</span>
        </div>

        <el-checkbox-group v-model="checkList" @change="changeCheckbox" :id="key">
          <div v-for="(item, i) in options" :key="i">
            <el-checkbox :label="item.label" :disabled="!!item.disabled" :class="'checkbox__' + i">
              <div class="checkbox-label">
                <span :title="item.name" class="label-name">
                  {{ item.name }}
                </span>
                <div v-if="attrs['is-add']" :class="'handle handle-index__' + i">
                  <svg-icon icon-class="edit" @click.prevent="editTags(i, item)" />
                  <svg-icon icon-class="delete" @click.prevent="deleteLabel(item, i)" />
                </div>
              </div>
            </el-checkbox>

            <div v-if="attrs['is-add']" :class="'update-label update-label__' + i">
              <el-input v-model.trim="updateLabelName" :maxlength="'20'" />
              <div class="update-label-icon">
                <svg-icon icon-class="confirm" @click.prevent="updateLabel(item, i)" />
                <svg-icon icon-class="cancel" @click.prevent="cancelLabel(i)" />
              </div>
            </div>
          </div>
        </el-checkbox-group>
      </div>
      <div class="select-content-bottom">
        <el-button :class="disabled" type="primary" @click="submit">确定</el-button>
      </div>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { createUniqueString } from "@/utils"
const attrs = useAttrs()
const { proxy }: any = getCurrentInstance()
const emitInnerSelect = defineEmits(["changeCheckbox", "changeBorderColor", "updateById", "deleteById"])

const disabled = ref("bottom-hidden")
let options = ref<any>([])
const searchVal = ref<string>("")
const checkList = ref<any>([])
const isIndeterminate = ref<boolean>(true)
const updateLabelName = ref<string>("")
const key = ref<any>(Math.random().toString(36).slice(-6))

const propsInnerSelect = defineProps({
  isSearch: {
    type: Boolean,
    default: false
  },
  isCheckAll: {
    type: Boolean,
    default: false
  },
  isMultiple: {
    type: Boolean,
    default: false
  },
  isNullDataCommit: {
    type: Boolean,
    default: false
  },
  targetOptions: {
    type: Array<any>,
    required: false,
    default: () => []
  },
  selects: {
    type: Array,
    required: true,
    default: () => []
  },
  customClass: {
    type: String,
    default: ""
  }
})

const init = () => {
  checkList.value = propsInnerSelect.selects.slice(0)
  isDisabled()
}

watch(
  () => propsInnerSelect.selects,
  () => {
    init()
  },
  { deep: true }
)


watch(
  () => searchVal,
  (n, o) => {
    if (n.value && !attrs['is-add']) {
      options.value = propsInnerSelect.targetOptions.filter((t) => t.name.indexOf(n.value) !== -1)
    } else {
      options.value = propsInnerSelect.targetOptions
      checkList.value = propsInnerSelect.selects
    }
  },
  { deep: true }
)


let getNum = computed(() => {
  return checkList.value.length > 0 ? checkList.value.length : ""
})


let getCheckAll = computed(() => {
  const checkedCount = checkList.value.filter((v) => v !== "").length
  return checkedCount === propsInnerSelect.targetOptions.length && checkedCount !== 0
})

const changeCheckbox = (v) => {
  if ((!propsInnerSelect.isCheckAll || !propsInnerSelect.isMultiple) && checkList.value.length > 1) {
    checkList.value.splice(0, 1)
  }
  const checkedCount = checkList.value.filter((v) => v !== "").length

  isIndeterminate.value = checkedCount > 0 && checkedCount < propsInnerSelect.targetOptions.length
  isDisabled()
}

const handleCheckAllChange = (val) => {
  checkList.value = val ? options.value.map((t) => t.label) : []
  isIndeterminate.value = false
  isDisabled()
}

const submit = () => {
  if (checkList.value.length > 0 || propsInnerSelect.isNullDataCommit) {
    proxy.$refs.selectPopoverRef?.hide()
    emitInnerSelect("changeCheckbox", checkList.value)
  }
}

const isDisabled = () => {
  if (propsInnerSelect.isNullDataCommit) {
    disabled.value = "bottom-show"
  } else {
    disabled.value = checkList.value.length > 0 ? "bottom-show" : "bottom-hidden"
  }
}

const popoverHide = () => {
  if (propsInnerSelect.isSearch) searchVal.value = ""
  emitInnerSelect("changeBorderColor", false)
}

const popoverShow = () => {
  emitInnerSelect("changeBorderColor", true)
  options.value = propsInnerSelect.targetOptions
  checkList.value = propsInnerSelect.selects
  isDisabled()
}

const cancelLabelStatus = () => {
  // key.value = document.querySelector('.label-tag')?.getAttribute('aria-describedby')
  for (let i = 0; i < propsInnerSelect.targetOptions.length; i++) {
    cancelLabel(i)
  }
}

const editTags = (index: number, item) => {
  cancelLabelStatus()
  const element = document.querySelector('#' + key.value)
  const labelEl = element?.querySelector('.checkbox__' + index) as HTMLElement
  const labelTextEl = element?.querySelector('.update-label__' + index) as HTMLElement
  labelEl.style.display = 'none'
  labelTextEl.style.display = 'block'
  updateLabelName.value = item.name
}

 const cancelLabel = (index)=> {
    updateLabelName.value = ''
    defaultLabelState(index)
}

const defaultLabelState = (index) =>  {
  const element = document.querySelector('#' + key.value)
  const labelEl = element?.querySelector('.checkbox__' + index) as HTMLElement
  const labelTextEl = element?.querySelector('.update-label__' + index) as HTMLElement
  labelEl.style.display = 'flex'
  labelTextEl.style.display = 'none'
}

const deleteLabel = (item, index) => {
  cancelLabelStatus()
  emitInnerSelect("deleteById", item, index)
}

const updateLabel = (item, index) => {
  if (updateLabelName.value) {
    item.labelName = updateLabelName.value
    emitInnerSelect("updateById", item, index)
    defaultLabelState(index)
    updateLabelName.value = ''
  }
}
</script>
<style lang="scss" scoped>
:deep(.el-button--primary) {
  --el-button-border-color: none;
}

:deep(.update-label) {
  .el-input__wrapper {
    box-shadow: none;
    padding: 0;
    .el-input__inner {
      border-radius: 4px;
    }
  }
}

:deep(.el-button:focus, .el-button:hover) {
  border: none;
  border-color: none !important;
}
.select-content {
  width: 255px;
  .select-all {
    position: sticky;
    top: 0;
    background-color: #fff;
    z-index: 99;
  }
  &-top {
    height: 288px;
    margin: 4px 0;
    overflow: hidden;

    .select-all {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 32px;
      width: 85%;
      padding: 0 6px 0 16px;
      margin: 4px 0;
      border-bottom: 1px solid #f0f3f5;
      &.channel-select {
        display: none;
      }
    }

    .checkbox-label {
      padding: 10px 0;
      width: inherit;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .label-name {
        flex: 1;
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        display: inline-block;
        color: #26292e;
      }
      .handle {
        font-size: 24px;
        visibility: hidden;
      }
    }

    .update-label {
      display: none;
      position: relative;
      padding: 4px 0;

      .update-label-icon {
        cursor: pointer;
        position: absolute;
        top: 8px;
        right: 7px;
        font-size: 24px;
      }

      :deep(.el-input__inner) {
        border: none;
        background-color: #f5f6f7;
        padding: 0 0 0 15px;
      }
    }
  }

  &-top:hover {
    overflow-y: auto;
  }
  &-bottom {
    height: 32px;
    width: 100%;

    .bottom-show {
      height: 32px;
      width: 100%;
      background-color: $color-secondary;
    }

    .bottom-hidden {
      color: #dbdee4;
      height: 32px;
      width: 100%;
      border-color: transparent;
      background-color: #f6f7f9;
      cursor: not-allowed;

      &:hover {
        border-color: transparent;
      }
    }
  }
}
.select-content-inner {
  &-top {
    width: 100%;
    height: 240px;
    .inner-header {
      display: flex;
      align-items: center;
      height: 30px;
      i {
        cursor: pointer;
        font-size: 16px;
      }
      span {
        font-size: 14px;
        font-weight: 700;
        color: #333;
      }
    }
    .color-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      margin-right: 20px;
      margin-bottom: 15px;
      width: 24px;
      height: 24px;
      border-radius: 2px;
      cursor: pointer;
      &-inner {
        width: 16px;
        height: 16px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        i {
          color: #fff;
          font-size: 16px;
          font-weight: 700;
        }
      }
    }
  }
  &-bottom {
    padding: 0 12px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

:deep(.el-checkbox-group) {
  display: flex;
  flex-direction: column;
  .el-checkbox {
    display: flex;
    align-items: center;
    height: 32px;
    width: 100%;
    padding-left: 16px;
    margin: 4px 0;
    box-sizing: border-box;
    &:hover {
      border-radius: 4px;
      background: #f5f6f7;
    }
  }

  .el-checkbox:hover .handle {
    visibility: visible;
  }
  .el-checkbox__label {
    display: flex;
    align-items: center;
    flex: 1;
    width: 97%;
    justify-content: space-between;
    font-weight: normal;
    color: #000;
    padding-left: 14px;

    .checkbox-label > span {
      width: 150px;
    }
  }
}
.el-form {
  margin-top: 30px;
  .el-form-item {
    margin-bottom: 20px;
    :deep(.el-form-item__label) {
      color: #7f8fa4;
      font-size: 14px;
      font-weight: normal;
    }
    :deep(.el-form-item__content) {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    }
  }
}
</style>
