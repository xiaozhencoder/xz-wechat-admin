<template>
  <el-popover
    ref="editLinkRef"
    v-model:visible="visible"
    :virtual-ref="ref"
    width="512px"
    placement="bottom-end"
    :popper-class="`edit-link__popover link_${uniqueKey}`"
    trigger="manual"
    :disabled="disabled"
    :show-arrow="false"
    :teleported="false"
    virtual-triggering
  >
    <div class="edit-default__header" />
    <div class="edit-default__body">
      <el-form ref="linkFormRef" label-width="auto" :rules="rules" :model="from">
        <el-form-item label="自定义标题" prop="name" label-width="auto">
          <xz-input
            ref="nameRef"
            v-model:value.trim="from.name"
            show-limit
            :maxlength="20"
            placeholder="请输入链接显示标题"
          />
        </el-form-item>
        <el-form-item label="链接 URL" prop="url" label-width="auto">
          <xz-input
            ref="urlRef"
            v-model:value.trim="from.url"
            show-limit
            placeholder="请输入以https或者http开头的任意地址"
          />
        </el-form-item>
      </el-form>
    </div>
    <div class="edit-default__footer">
      <el-button type="primary" @click="onConfirm(linkFormRef)">确 定</el-button>
      <el-button plain @click="handleClose">取 消</el-button>
    </div>
  </el-popover>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus"
import { ObjTy } from "~/common"
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
    type: Object,
    default: () => {
      return { name: "", url: "http://" }
    }
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

const linkFormRef = ref<FormInstance>()

let from = reactive<ObjTy>(props.value)

const rules = reactive<FormRules>({
  name: [
    { required: true, message: "请输入链接名称", trigger: "blur" },
    { max: 30, message: "最多可输入30个字", trigger: "blur" }
  ],
  url: [
    { required: true, message: "请输入链接地址", trigger: "blur" },
    { type: "url", message: `请输入以http/https开头的链接名称`, trigger: "blur" }
  ]
})

function onConfirm(formEl: FormInstance | undefined) {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      emit("handleConfirm", from)
      handleClose()
    }
  })
}

function handleClose() {
  emit("handleClose")
}

watch(
  () => props.value,
  (val) => {
    linkFormRef.value?.clearValidate()
    if (val) {
      from = props.value
    }
  },
  { deep: true }
)
</script>

<style lang="scss" scoped></style>
