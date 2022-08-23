<template>
  <el-dialog title="上传内容" width="858px" :close-on-click-modal="false" v-model="visible" :before-close="close">
    <div class="head">
      <xz-select
        v-model:value="groupId"
        placeholder="请选择"
        :config="{ label: 'groupName', value: 'groupId' }"
        :items="groups"
      />
      <div class="right-text">
        <span class="default-text">支持png/jpeg/jpg/gif格式；大小不超过10M；批量单次不超过9个素材</span>
      </div>
    </div>
    <div class="dialog-body">
      <el-upload
        v-model:file-list="fileList"
        action="#"
        list-type="picture-card"
        :limit="9"
        :http-request="handleUpload"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :before-upload="beforeImgUpload"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
      </el-dialog>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button :loading="isLoad" :disabled="btnDisabled" type="success" @click="close('submit')">
          {{ uploadNum > 0 ? uploadNum + "/9 确定" : "确定添加" }}
        </el-button>
        <el-button plain @click="close">取 消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import type { UploadProps, UploadUserFile } from "element-plus"
import { ref } from "vue"
import { Plus } from "@element-plus/icons-vue"
const { proxy }: any = getCurrentInstance()

const emit = defineEmits(["close", "input", "change", "add", "submit"])

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  groups: {
    type: Array,
    default: () => []
  }
})

const dialogImageUrl = ref("")
const dialogVisible = ref(false)
const btnDisabled = ref<boolean>(false)
const groupId = ref<number>(-1)
const fileList = ref<UploadUserFile[]>([])
const uploadNum = ref<number>(0) // 待上传的图片
const isUpload = ref<boolean>(false) // 是否正在上传

let timer = ref<number>(0)
let isLoad = ref<boolean>(false)

const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}

const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}

function close(type) {
  if (type === "submit") {
    submit()
  } else {
    emit("close", false)
  }
}

const handleUpload = (val): XMLHttpRequest => {
  console.log(val)
  return new XMLHttpRequest()
}

function beforeImgUpload(taskfile) {
  const task = async (file) => {
    if (
      ["png", "jpeg", "jpg", "gif"].indexOf(file.name.substr(file.name.lastIndexOf(".") + 1).toLocaleLowerCase()) === -1
    ) {
      if (Date.now() - timer.value > 2000) {
        timer.value = Date.now()
        proxy.$showNotify({ type: "warning", content: "图片格式只支持png、jpeg、jpg、gif" })
      }
      return
    }
    const isLt10M = file.size / 1024 / 1024 < 10
    if (fileList.value.length + 1 > 9) {
      if (Date.now() - timer.value > 2000) {
        timer.value = Date.now()
        proxy.$showNotify({ type: "warning", content: "超过数量限制,最多添加9个!" })
      }
      return
    }
    if (!isLt10M) {
      if (Date.now() - timer.value > 2000) {
        timer.value = Date.now()
        proxy.$showNotify({ type: "warning", content: "上传图片大小不能超过 10MB!" })
      }
      return
    }
  }
}

function submit() {
  emit("submit", fileList.value)
}
</script>
<style lang="scss" scoped>
:deep(.el-dialog__body > img) {
  width: 100%;
}
:deep(.el-upload-list--picture-card .el-upload-list__item) {
  margin: 8px;
}

:deep(.el-upload--picture-card) {
  // width: 121px;
  // height: 121px !important;
  margin: 8px;
}
.head {
  display: flex;
  height: 32px;
  :deep(.el-input input) {
    height: 32px;
  }
  .right-text {
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .default-text {
    color: #888d97;
    font-size: 12px;
    margin-right: 10px;
  }
}

.dialog-body {
  height: 330px;
  border-radius: 4px;
  border: 1px solid #f0f3f5;
  margin-top: 10px;

  > div:first-child {
    height: 280px;
  }
}
</style>
