<template>
  <el-dialog
    v-model="dialogShow"
    :title="handleType === 'add' ? '添加分组' : handleType === 'edit' ? '编辑分组' : '删除分组'"
    :close-on-click-modal="false"
    @open="open"
    @close="close"
  >
    <el-form ref="ruleFormRef" :model="ruleForm" label-position="top" :rules="rules">
      <el-form-item v-if="handleType !== 'del'" label="分组名称" prop="inputVala">
        <xz-input
          ref="xzInputRef"
          v-model:value="ruleForm.inputVala"
          show-limit
          :maxlength="20"
          placeholder="请输入分组名称"
        />
      </el-form-item>
      <el-form-item v-if="handleType === 'del'" label="" prop="delType">
        <el-radio-group v-model="ruleForm.delType">
          <el-radio :label="0">删除分组，并将组内所有内容移动至「默认分组」</el-radio>
          <el-radio :label="1">删除分组，同时删除组内所有内容</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" :loading="btnloading" @click="submit(ruleFormRef)">确 定</el-button>
        <el-button plain @click="close">取 消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus"
import ContenCenterApi from "@/api/contentCenter/index"
import { useElement } from "@/hooks/global/useElement"
import { ObjTy } from "~/common"
const emit = defineEmits(["close"])
const { elNotify } = useElement()
const api = new ContenCenterApi()

const props = defineProps({
  dialogShow: {
    type: Boolean,
    default: false
  },
  handleType: {
    type: String,
    default: "add"
  },
  groupItem: {
    type: Object,
    default: {}
  }
})

const btnloading = ref(false)

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  inputVala: "",
  delType: 0
})

const rules = reactive<FormRules>({
  inputVala: [
    { required: true, message: "请输入分组名称", trigger: "blur" },
    { min: 1, max: 20, message: "长度在 1 到 10 个字符", trigger: "blur" }
  ]
})

const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      let res: ObjTy = {}
      if (props.handleType === "add") {
        const params = {
          groupName: ruleForm.inputVala
        }
        res = await api.addGroup(params)
      } else if (props.handleType === "edit") {
        const params = {
          groupName: ruleForm.inputVala,
          groupId: props.groupItem.groupId
        }
        res = await api.updateGroup(params)
      } else if (props.handleType === "del") {
        const params = {
          deleteType: ruleForm.delType,
          groupId: props.groupItem.groupId
        }
        res = await api.deleteGroup(params)
      }
      if (res.status !== 0) {
        elNotify(props.handleType === "add" ? "添加失败！" : props.handleType === "edit" ? "修改失败！" : "删除失败！")
      } else {
        elNotify(props.handleType === "add" ? "添加成功！" : props.handleType === "edit" ? "修改成功！" : "删除成功！")
      }
    } else {
      return false
    }
  })
  close()
}

function open() {
  const groupName = props.groupItem.groupName
  if (groupName) {
    ruleForm.inputVala = groupName
  }
}

function close() {
  ruleForm.inputVala = ""
  emit("close", "refresh")
}
</script>

<style lang="scss" scoped></style>
