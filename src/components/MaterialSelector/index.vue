<template>
  <div>
    <el-dialog
      title="素材选择器"
      width="880px"
      :close-on-click-modal="false"
      v-model="visible"
      @open="open"
      :before-close="close"
    >
      <div class="dialog-head">
        <div
          v-for="(item, index) in materialType"
          :key="index"
          class="head-icon"
          :class="{ active: type === item.type }"
        >
          <el-tooltip :content="item.label" :offset="-3" placement="top">
            <svg-icon :icon-class="'icon-content-' + item.type" @click="onSelectType(item.type)" />
          </el-tooltip>
        </div>
      </div>
      <div class="dialog-body">
        <div class="body-left">
          <div class="nav-search">
            <xz-search v-model:value="searchVal" @input="getSearchVal" />
          </div>
          <div class="nav-tree">
            <div class="tree-top">
              <xz-tabs :tabs="tabs" :curr-tab="currTab" @change="getTabVal" />
            </div>
            <div class="tree-content">
              <ul class="content-group" v-for="(item, index) in groups" :key="index">
                <li :class="{ active: groupId === item.groupId }" @click="onSelectGroup(item.groupId)">
                  {{ item.groupName }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="body-right">
          <template v-if="componentName && dataList!.length > 0">
            <component
              :is="componentName"
              :dataList="dataList"
              :selectList="selectList"
              v-bind="$attrs"
              @loadData="loadData"
              @select="onSelect"
              @preview="onPreview"
            />
          </template>
          <el-empty v-else style="width: 100%" description="暂无数据" :image-size="100" />
        </div>
      </div>
      <div class="dialog-foot">
        <el-collapse v-model="activeNames">
          <el-collapse-item title="已选择的素材" name="1">
            <selected-material v-bind="$attrs" :selectList="selectList" @cancel="onCancel" />
          </el-collapse-item>
        </el-collapse>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button :loading="isLoad" type="success" @click="submit">确定</el-button>
          <el-button plain @click="close">取 消</el-button>
        </span>
      </template>
    </el-dialog>
    <media-preview
      :media-list="previewMediaData"
      :is-edit="false"
      v-model:media-dialog-visible="previewDialog"
      @close="closeMedia"
    />
  </div>
</template>

<script lang="ts" setup>
import XzTabs from "@/components/XzComm/XzTabs/index.vue"
import MediaPreview from "@/components/MediaPreview/index.vue"
import SelectedMaterial from "@/components/MaterialSelector/selected.vue"
import ImageList from "./module/imageList.vue"
import VoiceList from "./module/voiceList.vue"
import VideoList from "./module/videoList.vue"
import FileList from "./module/fileList.vue"
import LinkList from "./module/linkList.vue"
import SmsList from "./module/smsList.vue"
import AppletList from "./module/appletList.vue"
import MsgMenuList from "./module/msgMenuList.vue"
import MpNewsList from "./module/mpNewsList.vue"
import TemplateList from "./module/templateList.vue"
import { materialType, tabs } from "./config"

import TextList from "./module/textList.vue"
import { ObjTy } from '~/common'
import { deepClone } from "@/utils"

export interface MaterialObj {
  totalPage?: number
  pageSize?: number
  type: string
  search: string
  groupType: string
  groupId: number
}

const props = defineProps({
  dataList: {
    type: Array<ObjTy>,
    defalut: () => []
  },
  selectDataList: {
    type: Array<ObjTy>,
    defalut: () => []
  },
  visible: {
    type: Boolean,
    default: false
  },
  groups: {
    type: Array<ObjTy>,
    default: []
  },
  totalPage: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 20
  },
  type: {
    type: String,
    default: 'image'
  }
})

const isLoad = ref<boolean>(false)
const loadLimitTime = ref<number>(Date.now())
const emit = defineEmits(["close", "submit", "getData"])

const page = ref<number>(1)
const searchVal = ref<string>("")
const currType = ref<string>("image")
const groupId = ref<number>(-1)

const activeNames = ref(['1'])
const previewDialog = ref(false)
const previewMediaData = ref<any>([])

const selectList = ref<any>([])

const currTab = ref<string>('pub')


const typeComponent = {
  text: markRaw(TextList),
  image: markRaw(ImageList),
  voice: markRaw(VoiceList),
  mpnews: markRaw(MpNewsList),
  video: markRaw(VideoList),
  msgmenu: markRaw(MsgMenuList),
  miniprogrampage: markRaw(AppletList),
  news: markRaw(LinkList),
  sms: markRaw(SmsList),
  template: markRaw(TemplateList),
  // content: markRaw(HtmlContentChat),
  // multiple: markRaw(MultipleChat),
  file: markRaw(FileList)
}

// watch(() => props.selectDataList, (val) => {
//   console.log(val)
//   selectList.value = val
// },{deep: true})


const componentName = computed(() => {
  return typeComponent[props.type]
})

const onSelectGroup = (val) => {
  groupId.value = val
  getData()
}

const onSelectType = (val: string) => {
  searchVal.value = ''
  currType.value = val
  groupId.value = -1
  getData()
}

const onSelect = (val: ObjTy) => {
  if (selectList.value.length === 0 || !selectList.value.some(v => v.contentType === val.contentType && v.id === val.id)) {
    selectList.value.push(val)
  } else {
    onCancel(val)
  }
}

const onCancel = (val: ObjTy) => {
  var index = selectList.value.findIndex(i => i.contentType == val.contentType  && i.id === val.id);
  if(index != -1) {
    selectList.value.splice(index, 1);
  }
}

const onPreview = (val) => {
  console.log(JSON.parse(val.contentDetail))
  previewMediaData.value = [JSON.parse(val.contentDetail)]
  previewDialog.value = true
}

const getSearchVal = (val: string) => {
  // const arr = val.trim()
  //   ? sourceDataList.value.filter(v => v.contentName.toLocaleLowerCase().indexOf(val.trim().toLocaleLowerCase()) !== -1)
  //   : sourceDataList.value
  searchVal.value = val
  getData()
}

const getTabVal = (val: string) => {
  currTab.value = val
  getData()
}

function closeMedia() {
  previewDialog.value = false
}

const loadData = () => {
  if (Date.now() - loadLimitTime.value > 300) {
    loadLimitTime.value = Date.now()

    if ((page.value++) <= Math.ceil(props.totalPage / props.pageSize)) {
      page.value += 1
      getData()
    }
  }
}

const getData = () => {
  emit('getData', {
    currentPage: page.value,
    pageSize: props.pageSize,
    type: currType.value,
    search: searchVal.value,
    groupType: currTab.value,
    groupId: groupId.value
  } as MaterialObj)
}

const open = () => {
  console.log("open", props.selectDataList)
  selectList.value = deepClone(props.selectDataList)
}

const close = () => {
  emit("close")
}

const submit = () => {
  emit("submit", deepClone(selectList.value))
  close()
}
</script>

<style lang="scss" scoped>
:deep(.el-collapse-item__header, .el-collapse-item__wrap) {
  .el-collapse-item__content {
    border-bottom: none;
  }
  border-bottom: none;
}
.dialog-head {
  display: flex;
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 1px solid #dbdee4;

  .head-icon {
    font-size: 48px;
    height: 48px;
    border-radius: 10px;
    line-height: 48px;

    &:hover {
      transform: scale(1.3);
      // transform: translate3d(0, -2px, 0);
      cursor: pointer;
    }
  }

  .active {
    box-shadow: 0px 15px 30px rgb(0 0 0 / 12%);
    font-size: 52px;
    background-color: #f8f4f4;

    &:hover {
      transform: none;
    }
  }
}

.dialog-body {
  display: flex;
  border-bottom: 1px solid #dbdee4;

  :deep(.search-box) {
    width: 150px !important;
  }

  .body-left {
    padding: 12px 12px 0 0;
    border-right: 1px solid #dbdee4;

    .nav-tree {
      display: flex;
      justify-content: center;
      flex-direction: column;
      margin: 8px 0;

      .tree-top {
        :deep(.el-tabs) {
          display: flex;
          justify-content: space-around;

          .el-tabs__header {
            margin-bottom: 5px;
          }
        }
      }

      .tree-content {
        margin-top: 5px;
        .content-group {
          > li {
            padding: 5px 0 5px 15px;
            margin-bottom: 3px;
            border-radius: 5px;

            &:hover {
              background-color: #f6f7f9;
              cursor: pointer;
            }
          }

          .active {
            background-color: #f6f7f9;
          }
        }
      }
      ul,
      li {
        list-style: none;
        padding: 0;
        margin: 0;
      }
    }
  }

  .body-right {
    overflow: auto;
    flex: 1;
    height: min-content;
    max-height: 248px;
    margin: 7px 0 7px 7px;
    display: flex;
    flex-wrap: wrap;
  }
}
// .dialog-foot {
// }
</style>
