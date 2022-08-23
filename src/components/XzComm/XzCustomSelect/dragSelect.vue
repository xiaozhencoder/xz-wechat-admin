<template>
  <el-dialog
    custom-class="label-container dialog-cantainer"
    :title="title"
    v-model="visible"
    :close-on-click-modal="false"
    width="800px"
    append-to-body
    :before-close="handleClose"
  >
    <div class="dialog-body">
      <div class="dialog-body__left">
        <div class="select-content">
          <XzSearch v-model:value="searchVal" width="100%" @input="changeSearchVal" />
          <div class="select-content-top">
            <el-checkbox-group v-model="checkList" @change="changeCheckbox">
              <div v-for="(item, i) in columnList" :key="i">
                <el-checkbox :label="item.prop">
                  <div class="checkbox-label">
                    <span :title="item.label" class="label-name">
                      {{ item.label }}
                    </span>
                  </div>
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <div class="dialog-body__right">
        <div class="check-top">
          <span>选定的列</span>
          <span class="check-num">{{ dragList.length }}</span>
        </div>
        <div class="check-body">
          <vuedraggable
            chosen-class="chosen"
            force-fallback="true"
            group="people"
            item-key="prop"
            animation="500"
            handle=".drag-icon"
            v-model="dragList"
            @update="dragUpdate($event, dragList)"
          >
            <template #item="{ element }">
              <div class="check-body__item">
                <div class="item-text">
                  <div class="item-pre__icon">
                    <svg-icon icon-class="drag" class="drag-icon item-drag" />
                  </div>
                  <span>{{ element.label }}</span>
                </div>
                <div class="item-close">
                  <svg-icon icon-class="close" @click="cancelCheckDrag(element.prop)" />
                </div>
              </div>
            </template>
          </vuedraggable>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="onConfirm">确 定</el-button>
        <el-button plain @click="handleClose">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import vuedraggable from "vuedraggable"
import { deepClone } from "@/utils"
import { ObjTy } from "~/common"
const emit = defineEmits(["close", "change"])
const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
    default: false
  },
  allColumns: {
    type: Array<any>,
    default: () => []
  },
  columns: {
    type: Array,
    default: () => []
  },
  config: {
    type: Object,
    default: () => {}
  },
  title: {
    type: String,
    default: "编辑列"
  }
})

const columnList = ref<Array<ObjTy>>([])
const sourceColumnList = ref<Array<ObjTy>>([])
const dragList = ref<Array<ObjTy>>([])
const checkList = ref<Array<ObjTy>>([])
const searchVal = ref<string>("")

watch(
  () => props.visible,
  (val) => {
    if (val) {
      searchVal.value = ""
      if (props.config) {
        columnList.value = props.allColumns.map((c: any) => {
          return { prop: c[props.config.prop], label: c[props.config.label] }
        })
        checkList.value = props.columns.map((c: any) => c[props.config.prop])
      } else {
        columnList.value = props.allColumns
        checkList.value = props.columns.map((c: any) => c.prop)
      }
      sourceColumnList.value = deepClone(columnList.value) as Array<ObjTy>
    }
  }
)

watch(
  () => checkList.value,
  (val) => {
    if (dragList.value.length === 0) {
      const drags: Array<ObjTy> = []
      val.forEach((v) => {
        const tmpC = sourceColumnList.value.filter((c) => v === c.prop)
        if (tmpC && tmpC.length > 0) {
          drags.push(tmpC[0])
        }
      })
      dragList.value = drags
    } else {
      if (val.length > dragList.value.length) {
        const tmpArr = val.filter((v) => !dragList.value.find((d) => d.prop === v))
        const value = sourceColumnList.value.find((s) => s.prop === tmpArr[0])
        if (value) {
          dragList.value.push(value)
        }

        // this.dragList = deepClone(this.sourceColumnList).filter(d => val.indexOf(d.prop) > -1)
      } else {
        const tmpArr = dragList.value.filter((v) => !val.find((d) => d === v.prop))
        if (tmpArr.length > 0) {
          dragList.value.forEach((d, index) => {
            if (tmpArr[0].prop === d.prop) {
              dragList.value.splice(index, 1)
            }
          })
        }
      }
    }
  }
)

const dragUpdate = async (evt, data) => {
  evt.preventDefault()
  dragList.value = data
}
const changeSearchVal = (val) => {
  if (searchVal.value !== val && val) {
    columnList.value = sourceColumnList.value.filter((t) => t.label.toLowerCase().indexOf(val.toLowerCase()) !== -1)
  } else {
    columnList.value = sourceColumnList.value
  }
}

const changeCheckbox = (v) => {}

const cancelCheckDrag = (val) => {
  checkList.value = checkList.value.filter((c) => c !== val)
}

const handleClose = () => {
  searchVal.value = ""
  dragList.value = []
  emit("close")
}

const onConfirm = () => {
  emit(
    "change",
    props.config
      ? dragList.value.map((d) => {
          return { [props.config.prop]: d.prop, [props.config.label]: d.label }
        })
      : dragList.value
  )
  handleClose()
}
</script>

<style lang="scss" scoped>
.chosen {
  box-shadow: 0 8px 12px 0 rgba(23, 22, 23, 0.1) !important;
}
.dialog-body {
  display: flex;
  width: 760px;
  height: 448px;
  border-radius: 4px;
  border: 1px solid #f0f3f5;

  &__left {
    width: 375px;
    flex: 1;
    height: auto;
    border-right: 1px solid #f0f3f5;
    padding: 12px 16px;

    .select-content {
      &-top {
        margin: 12px 0;
        overflow: auto;
        height: 375px;
      }
    }
  }

  &__right {
    flex: 1;
    height: auto;
    padding: 12px 16px;

    .check-top {
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      .check-num {
        width: 31px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        background-color: #f6f7f9;
        margin-left: 5px;
      }
    }

    .check-body {
      height: 375px;
      overflow: auto;

      & > div:first-child {
        margin-right: 4px;
      }

      ul {
        margin-right: 4px;
        padding: 0;
      }

      &__item {
        width: 100%;
        height: 40px;
        background: #fafbfc;
        border-radius: 3px;
        border: 1px solid #dbdee4;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 5px 0;

        .item-text {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          cursor: default;

          .item-pre__icon {
            width: 32px;

            svg {
              display: none;
              font-size: 32px;
            }

            svg:hover {
              cursor: move;
            }
          }
        }

        .item-close {
          cursor: pointer;
          font-size: 26px;
          padding-right: 12px;
          display: none;
        }
      }

      &__item:hover > .item-close {
        display: block;
      }

      &__item:hover > .item-text > .item-pre__icon > .item-drag {
        display: block;
      }
    }
  }
}

:deep(.el-checkbox-group) {
  display: flex;
  flex-direction: column;
  .el-checkbox {
    display: flex;
    align-items: center;
    height: 38px;
    width: 100%;
    padding-left: 16px;
    margin: 2px 0;
    box-sizing: border-box;
    &:hover {
      border-radius: 4px;
      background: #f5f6f7;
    }
  }
  .el-checkbox__label {
    display: flex;
    align-items: center;
    flex: 1;
    width: 100%;
    justify-content: space-between;
    font-weight: normal;
    padding-left: 14px;

    .checkbox-label {
      color: #000;
    }
  }
}
</style>
