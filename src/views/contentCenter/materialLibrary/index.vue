<template>
  <div class="common-page-container content">
    <div class="left">
      <div class="title">
        <div class="f-s-20">素材库</div>
        <div class="f-s-24 m-r-15 pointer add-group" @click="add">
          <svg-icon icon-class="add-upload" />
        </div>
      </div>
      <div>
        <ul class="content-group">
          <li
            v-for="(item, index) in useMaterial.groups.filter((g) => g.groupId <= 0)"
            :key="item.groupId"
            :class="{ active: state.activeGroupId === item.groupId }"
            @click="onChangeGroup(item)"
          >
            <span class="content-name">
              <svg-icon icon-class="" class="f-s-24" />
              {{ item?.groupName }}
            </span>
            <span class="content-num" style="display: block">{{ item?.count | 0 }}</span>
          </li>
        </ul>
        <el-divider />
        <ul class="content-group">
          <vuedraggable
            chosen-class="chosen"
            force-fallback="true"
            group="people"
            item-key="prop"
            animation="500"
            handle=".drag-icon"
            v-model="state.dragList"
            @update="dragUpdate($event, state.dragList)"
          >
            <template #item="{ element }">
              <li :class="{ active: state.activeGroupId === element?.groupId }" @click="onChangeGroup(element)">
                <span class="content-name">
                  <svg-icon icon-class="drag" class="drag-icon item-drag f-s-24" />
                  {{ element?.groupName }}
                </span>
                <span class="content-num">{{ element?.count | 0 }}</span>

                <el-popover
                  :ref="'popover_' + element?.groupId"
                  :show-arrow="false"
                  placement="bottom-start"
                  trigger="click"
                >
                  <template #reference>
                    <i class="content-icon" @click.stop="">
                      <svg-icon icon-class="more" />
                    </i>
                  </template>
                  <div class="pointer">
                    <div class="poeration" @click="edit(element)">
                      <svg-icon class="f-s-24 m-r-8" icon-class="edit" />
                      <span>编辑</span>
                    </div>
                    <div class="poeration" @click="del(element)">
                      <svg-icon class="f-s-24 m-r-8" icon-class="delete" />
                      <span>删除</span>
                    </div>
                  </div>
                </el-popover>
              </li>
            </template>
          </vuedraggable>
        </ul>
      </div>
    </div>
    <div class="right">
      <div class="content-material-head">
        <xz-tabs
          :tabs="materialType"
          :tabs-config="{ label: 'type', name: 'label' }"
          curr-tab="image"
          @change="changeMaterialType"
        />
      </div>
      <div class="content-material-body">
        <div class="nav-seach"></div>
        <div>
          <xz-table
            ref="materialTableRef"
            :v-loading="state.tableLoading"
            :data="state.tableData"
            :is-multiple="true"
            table-key="materialTables"
            :max-height="state.hHeight - 220"
            :table-config="currentTableConfig"
            :total="useMaterial.paging.totalPage"
            :page.sync="useMaterial.paging.currentPage"
            :limit.sync="useMaterial.paging.pageSize"
            @selectionChange="
              (val) => {
                state.selectData = val
              }
            "
            @sort-change="sortChange"
            @propsFn="handleFetch"
          >
            <template v-slot:multiple-head>
              <div class="select-edit">
                <div class="select-num">
                  <span>{{ state.selectData.length }}</span>
                  选择
                </div>
                <div class="state" @click="handleBatch('moveGroup')">
                  <svg-icon icon-class="move" />
                  <span>移动分组</span>
                </div>
                <div class="state" @click="handleBatch('delete')">
                  <svg-icon icon-class="delete" />
                  <span>删除</span>
                </div>
              </div>
            </template>
          </xz-table>
        </div>
      </div>
    </div>

    <create-groups-dialog
      :dialogShow="state.createGroupsDialog"
      :handleType="state.handleType"
      :group-item="state.editGroudData"
      @close="close"
    />

    <move-to-group-dialog
      :dialogShow="state.moveToGroupsDialog"
      :content-ids="state.contentIds"
      :groups="useMaterial.groups.filter((g) => g.groupId >= 0)"
      @close="close"
    />
  </div>
</template>

<script lang="ts" setup>
import vuedraggable from "vuedraggable"
import XzTabs from "@/components/XzComm/XzTabs/index.vue"
import XzTable from "@/components/XzComm/XzTable/index.vue"
import ContenCenterApi from "@/api/contentCenter/index"
import CreateGroupsDialog from "./modules/createGroupsDialog.vue"
import MoveToGroupDialog from "./modules/moveToGroupDialog.vue"
import { useMaterialStore } from "@/store/material"
import { useElement } from "@/hooks/global/useElement"
import { materialType } from "@/components/MaterialSelector/config"
import { TableConfig } from "./config"
import { ObjTy } from "~/common"
import { deepClone } from "@/utils"
import { STATUS_SUCCESS } from "@/constent/globalConstant"

const { elConfirm } = useElement()
const useMaterial = useMaterialStore()
const api = new ContenCenterApi()

const state = reactive({
  activeGroupId: -1,
  handleType: "add",
  editGroudData: {},
  createGroupsDialog: false,
  dragList: [],
  currentTypeObj: {
    name: "",
    num: ""
  },
  hHeight: 520,
  tableLoading: false,
  tableData: [],
  selectData: [],
  paging: {
    params: {
      currentPage: 1,
      pageSize: 20
    },
    total: 0
  },
  groupParams: {
    type: "image",
    groupId: -1
  },
  listParams: {
    keyword: "",
    groupId: -1,
    userId: "",
    type: materialType[0].type,
    picType: "",
    wechatId: ""
  },

  moveToGroupsDialog: false,
  contentIds: []
})

const currentTableConfig = computed(() => {
  const tableConfigCopy = deepClone(TableConfig)
  state.currentTypeObj.name === "image" || state.currentTypeObj.name === "file"
    ? tableConfigCopy.splice(1, 0, {
        prop: "picType",
        label: "格式",
        hideTips: true
      })
    : ""
  return tableConfigCopy
})

function sortChange(item) {}

async function handleFetch(item) {
  const { pageNum, pageSize } = item
  useMaterial.paging.currentPage = pageNum
  useMaterial.paging.pageSize = pageSize
  getMaterialData()
}

function onChangeGroup(item: ObjTy) {
  const { groupId } = item
  state.activeGroupId = groupId
  state.groupParams.groupId = groupId
  state.listParams.groupId = groupId
  init()
}

function close(params) {
  state.createGroupsDialog = false
  state.moveToGroupsDialog = false
  if (params) {
    getGroupsData()
  }
}

function add() {
  state.handleType = "add"
  state.editGroudData = {}
  state.createGroupsDialog = true
}

function edit(item) {
  state.handleType = "edit"
  state.createGroupsDialog = true
  state.editGroudData = item
}

function del(item) {
  state.handleType = "del"
  state.createGroupsDialog = true
  state.editGroudData = item
}

const handleBatch = (type: string) => {
  // type moveGroup：移动分组 删除
  if (type === "moveGroup") {
    handleMoveGroup("batch", state.selectData)
  } else if (type === "delete") {
    handleDelete("batch")
  }
}

const handleDelete = (type: string) => {}

const handleMoveGroup = (type: string, rows: Array<ObjTy>) => {
  console.log(type, rows)
  // if (type === "batch") {
  state.contentIds = rows.map((i) => i.id) as any

  state.moveToGroupsDialog = true
}

const dragUpdate = async (evt, data) => {
  evt.preventDefault()
  const params = {
    groupOrders: data.map((i: { groupId: any }) => i.groupId).join(",")
  }
  api.updateGroupOrder(params)
}

const changeMaterialType = (item) => {
  state.groupParams.type = item
  state.listParams.type = item
  getMaterialData()
  console.log("changeMaterialType:", item)
}

async function init() {
  getGroupsData()
  getMaterialData()
}

const getGroupsData = async () => {
  await useMaterial.getGroups(state.groupParams)
  // 设置初始化值
  state.dragList = useMaterial.groups.filter((g) => g.groupId > 0) as any
}

const getMaterialData = async () => {
  state.tableLoading = true
  const resp = await useMaterial.getContentList(state.listParams)
  if (resp?.status === STATUS_SUCCESS) {
    state.tableData = resp.data.data
  }
  state.tableLoading = false
}

nextTick(() => {
  state.hHeight = document.documentElement.clientHeight
})

init()
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  padding-left: 0;
  .left {
    overflow-y: scroll;
    padding-right: 12px;
    min-width: $sidebar-width;
    width: $sidebar-width;

    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 0 16px 22px;

      .add-group {
        border-radius: 5px;
        height: 24px;
        line-height: 24px;
        &:hover {
          background-color: $background-color-hover;
        }
      }
    }

    .content-group {
      padding-left: 22px;
      li {
        display: flex;
        font-size: 16px;
        justify-content: space-between;
        align-items: center;
        padding: 7px 10px;
        cursor: pointer;
        border-radius: 5px;
        position: relative;

        > i {
          position: absolute;
          right: 10px;
          visibility: hidden;
        }

        .content-name {
          position: relative;
          display: flex;
          align-items: center;
          > svg {
            display: none;
            position: absolute;
            left: -32px;
            border-left: 4px solid;
            padding: 7px 0;
            height: 32px;
          }
        }
        .content-num {
          display: block;
          padding: 0 7px;
          background-color: #f0f0f0;
          line-height: 20px;
          height: 20px;
          border-radius: 2px;
        }

        .content-icon {
          font-size: 24px;
          line-height: 20px;
          height: 20px;
        }
        &:hover {
          background-color: #efefef;
        }
      }
      li:hover .content-num {
        display: none;
      }

      li:hover > i {
        // display: block;
        visibility: visible;
        > svg {
          background-color: $background-color-hover;
          border-radius: 5px;
        }
      }

      li:hover > .content-name > svg {
        cursor: move;
        display: block;
        background-color: #efefef;
      }
    }
  }
  .right {
    flex: 1;
    padding-left: 20px;
    border-left: 1px solid $background-color-base;
  }
}

.active {
  color: $color-primary;
  background-color: $color-primary-light-9 !important;

  &:hover > i > svg {
    background-color: $color-primary-light-8 !important;
  }
  span.content-name > svg {
    display: block !important;
    background-color: $color-primary-light-9 !important;
    position: absolute;
    left: -32px;
    border-left: 4px solid;
    padding: 7px 0;
    height: 32px;
  }
}

.poeration {
  padding: 3px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  &:hover {
    width: 100%;
    background-color: $background-color-base;
  }
}
</style>
