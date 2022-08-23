<template>
  <el-popover
    ref="editDefaultRef"
    :virtual-ref="ref"
    v-model:visible="visible"
    width="512px"
    placement="bottom-end"
    :popper-class="`edit-default__popper default_${uniqueKey}`"
    trigger="manual"
    :disabled="disabled"
    :show-arrow="false"
    :teleported="false"
    virtual-triggering
  >
    <div class="edit-default__header">属性值为空时，替换为</div>
    <div class="edit-default__body">
      <el-form ref="defaultFormRef" label-width="auto">
        <el-form-item label=" " prop="value" label-width="auto">
          <xz-input
            ref="editDefaultInput"
            v-model:value.trim="defalutVal"
            show-limit
            :maxlength="20"
            @change="(val) => (defalutVal = val)"
            placeholder="输入默认值"
          />
        </el-form-item>
      </el-form>
      <div class="prompt-message">
        <span>建议填写默认值，当属性被删除或空值时，用于占位</span>
      </div>
    </div>
    <div class="edit-default__footer">
      <el-button type="primary" @click="onConfirm">确 定</el-button>
      <el-button plain @click="handleClose">取 消</el-button>
    </div>
  </el-popover>
</template>

<script lang="ts" setup>
const emit = defineEmits(["handleConfirm", "handleClose"])

const props = defineProps({
  ref: {
    type: Object,
    default: () => {}
  },
  visible: {
    type: Boolean,
    default: false
  },

  value: {
    type: String,
    default: ""
  },

  disabled: {
    type: Boolean,
    default: false
  },

  uniqueKey: {
    type: String,
    default: ""
  }
})

let defalutVal = ref<string>(props.value)

function onConfirm() {
  emit("handleConfirm", defalutVal.value)
  handleClose()
}

function handleClose() {
  emit("handleClose")
}
</script>

<style lang="scss" scoped>
.edit-default__popper {
  position: relative;
  max-width: 512px;
  box-shadow: 0 8px 12px 0 rgba(23, 22, 23, 0.1);
  border-radius: 4px;
  border: 1px solid #dbdee4;
  z-index: 999;

  .edit-default__header {
    font-weight: 700;
    color: #26292e;
    line-height: 14px;
    margin-bottom: 8px;
  }

  .edit-default__body {
    .prompt-message {
      margin: 24px 0;
      font-size: 12px;
    }
  }

  .edit-default__footer {
    padding-top: 16px;
  }
}
</style>
