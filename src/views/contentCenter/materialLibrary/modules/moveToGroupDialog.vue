<template>
  <el-dialog v-model="dialogShow" title="移动分组" :close-on-click-modal="false" @open="open" @close="close">
    <el-form ref="ruleFormRef" :model="ruleForm" label-position="top" :rules="rules">
      <el-form-item label="移动至分组" prop="selectVal" style="wigth: 100%">
        <xz-select
          v-model:value="ruleForm.selectVal"
          placeholder="请选择分组"
          :line="true"
          :items="
            props.groups.map((g) => {
              return { label: g.id, value: g.groupName }
            })
          "
          @change="getSelectedValue"
        />
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
  groups: {
    type: Array<ObjTy>,
    default: []
  },
  handleType: {
    type: String,
    default: "add"
  },
  contentIds: {
    type: Array,
    default: () => {
      return []
    }
  }
})

const btnloading = ref(false)

const presetOptions = ref([])

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  selectVal: "",
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
      const params = {
        groupId: ruleForm.selectVal,
        contentIds: props.contentIds.join(",")
      }
      res = await api.contentEditGroup(params)

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

function getSelectedValue(item) {
  console.log("getSelectValue:", item)
}

function open() {}

function close() {
  ruleForm.selectVal = ""
  emit("close", "refresh")
}
</script>

<style lang="scss" scoped></style>
