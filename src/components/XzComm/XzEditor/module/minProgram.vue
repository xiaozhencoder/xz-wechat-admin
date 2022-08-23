<template>
  <el-popover
    ref="editAppletRef"
    v-model:visible="visible"
    :virtual-ref="ref"
    width="512px"
    placement="bottom-end"
    :popper-class="`edit-applet__popover applet_${uniqueKey}`"
    trigger="manual"
    :disabled="disabled"
    :show-arrow="false"
    :teleported="false"
    virtual-triggering
  >
    <div class="edit-default__header" />
    <div class="edit-default__body">
      <el-form ref="appletFormRef" label-width="auto" :rules="rules" :model="from">
        <el-form-item label="自定义标题" prop="name" label-width="auto">
          <xz-input
            ref="nameRef"
            v-model:value.trim="from.name"
            show-limit
            :maxlength="30"
            placeholder="请输入链接显示标题"
          />
        </el-form-item>
        <el-form-item label="小程序 appid" prop="appId" label-width="auto">
          <xz-input
            ref="appIdRef"
            v-model:value.trim="from.appId"
            show-limit
            placeholder="请输入与公众号关联的小程序appid"
          />
        </el-form-item>
        <el-form-item label="小程序内跳转路径" prop="url" label-width="auto">
          <xz-input
            ref="urlRef"
            v-model:value.trim="from.url"
            show-limit
            placeholder="请输入小程序路径，与app.json文件中的页面路径保持一致"
          />
        </el-form-item>
      </el-form>
    </div>
    <div class="edit-default__footer">
      <el-button type="primary" @click="onConfirm(appletFormRef)">确 定</el-button>
      <el-button plain @click="handleClose">取 消</el-button>
    </div>
  </el-popover>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus"
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
      return { name: "", appId: "", url: "" }
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

const appletFormRef = ref<FormInstance>()

let from = reactive(props.value)

const rules = reactive<FormRules>({
  name: [
    { required: true, message: "请输入小程序名称", trigger: "blur" },
    { max: 30, message: "最多可输入30个字", trigger: "blur" }
  ],
  appId: [{ required: true, message: "请输入小程序APPID", trigger: "blur" }],
  url: [{ required: true, message: "请输入小程序路径", trigger: "blur" }]
})

async function onConfirm(formEl: FormInstance | undefined) {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      emit("handleConfirm", from)
      handleClose()
    } else {
      console.log("error submit!", fields)
    }
  })
}

function handleClose() {
  emit("handleClose")
}

watch(
  () => props.value,
  (val) => {
    appletFormRef.value?.clearValidate()
    if (val) {
      from = props.value
    }
  },
  { deep: true }
)
</script>

<style lang="scss" scoped></style>
