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
          <XzSearch v-model:value="searchVal" width="100%" @input="onSearchChanged" />
          <div class="select-content-top">
            <el-tree
              ref="treeRef"
              :data="sourceData"
              show-checkbox
              default-expand-all
              :node-key="nodeKey"
              :default-expanded-keys="defaultExpandedKeys"
              :default-checked-keys="defaultCheckedKeys"
              :props="defaultProps"
              :filter-node-method="filterMethod"
              @check-change="checkChange"
            />
          </div>
        </div>
      </div>
      <div class="dialog-body__right">
        <div class="check-top">
          <span>已选择的{{ title }}</span>
          <span class="check-num">{{ selectData.length }}</span>
        </div>
        <div class="check-body">
          <ul class="checked-node-box">
            <li v-for="(item, index) in selectData" :key="item[nodeKey] + index" class="checked-node-li">
              <div class="flex-center">
                <div class="checked-item m-r-8"></div>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="item[defaultProps.label]"
                  placement="top"
                  :disabled="item[defaultProps.label] && item[defaultProps.label].length <= 3"
                >
                  <span class="checked-name">{{ item[defaultProps.label] }}</span>
                </el-tooltip>
              </div>

              <svg-icon style="cursor: pointer; font-size: 24px" icon-class="close" @click="cancelChecked(item)" />
            </li>
          </ul>
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
import { ref } from 'vue'
import type { TreeNode, TreeKey } from 'element-plus/es/components/tree-v2/src/types'
import { FilterNodeMethodFunction } from 'element-plus/es/components/tree/src/tree.type';
import { deepClone } from "@/utils"
import { ObjTy } from "~/common"
import { ElTree } from 'element-plus';


const selectData = ref<any>([])
const treeDataMapData = ref<ObjTy>({})

const { proxy }: any = getCurrentInstance()
const emit = defineEmits(["close", "change"])
const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
    default: false
  },
  sourceData: {
    type: Array<any>,
    defalut: () => []
  },
  nodeKey: {
    type: String,
    required: true,
    default: "wxId"
  },
  defaultCheckedKeys: {
    type: Array<TreeKey>,
    default: () => []
  },
  defaultExpandedKeys: {
    type: Array<TreeKey>,
    default: () => []
  },
  defaultProps: {
    type: Object,
    default: () => {
      return {
        children: 'children',
        label: 'name'
      }
    }
  },
  config: {
    type: Object,
    default: () => {}
  },
  title: {
    type: String,
    default: "员工"
  },
  maxCount: {
    type: Number,
    default: 100
  }
})


const searchVal = ref<string>("")
const treeRef = ref<InstanceType<typeof ElTree>>()

const onSearchChanged = (val: string) => {
  searchVal.value = ""
  treeRef.value!.filter(val)
}

const filterMethod = (value: string, node: TreeNode): FilterNodeMethodFunction => {
  return node[props.defaultProps.label]!.includes(value)
}

const checkChange = (val: any, checked: any) => {
  console.log("checkChange:", val, checked)
  let selectKey: any = []
  const sameNode = treeDataMapData.value[val[props.nodeKey]]
  if (sameNode) {
    // 找到id相同的结点，都勾选或者都取消勾选
    selectKey = Array.from(sameNode).map((item: any) => {
      return item[props.nodeKey]
    })
  }
  selectKey.map(item => {
    treeRef.value!.setChecked(item, checked, true)
  })
  // 勾选或者取消勾选后，改变右侧已选人员列表
  proxy.$nextTick(() => {
    const selecteData = deepClone(
      treeRef.value!.getCheckedNodes(true)
    )
    selectData.value = deleteRepeatData(selecteData)
  })
}

 // 右侧删除重复数据
const deleteRepeatData = (data) => {
  return data.reduce((prev, cur) => {
    const duplicate = prev.filter(x => x[props.nodeKey] === cur[props.nodeKey])
    if (duplicate.length) {
      return prev
    } else {
      prev.push(cur)
      return prev
    }
  }, [])
}

// 取消选择
const cancelChecked = (val) => {
  if (treeDataMapData.value[val[props.nodeKey]]) {
    const sameNode = treeDataMapData.value[val[props.nodeKey]]
    // 相同节点
    if (sameNode) {
      const selectKey = Array.from(sameNode).map((item: any) => {
        return item[props.nodeKey]
      })
      selectKey.map(item => {
        treeRef.value!.setChecked(item, false, true)
      })
      selectData.value.map((i, index) => {
        if (i[props.nodeKey] === val[props.nodeKey]) {
          selectData.value.splice(index, 1)
        }
      })
    }
  }
}

const handleClose = () => {
  searchVal.value = ""
  emit("close")
}

const onConfirm = () => {
  if (selectData.length === 0) {
    proxy.$showNotify({ type: 'warning', content: '选择不能为空！' })
    return
  }
  if (props.maxCount < 100 && props.maxCount < selectData?.length) {
    proxy.$showNotify({
      type: 'warning',
      content: '最多允许选择' + props.maxCount + '！'
    })
    return
  }
  const allData = [...selectData.value, ...(props.defaultCheckedKeys || [])]
  const uniqueData = unique(allData, 'wxId')
  if (uniqueData.length > 100) {
    proxy.$showNotify({ type: 'warning', content: '可选'+ props.title +'不得超过100！' })
    return
  }

  emit( "change", selectData.value)
  handleClose()
}

const unique = (data, key) => {
  return data.reduce((prev, cur) => {
    const duplicate = prev.filter(x => x[key] === cur[key])
    if (duplicate.length) {
      return prev
    } else {
      prev.push(cur)
      return prev
    }
  }, [])
}

// treeData初始化处理
const treeDataMap = () =>  {
  const treeMap = {}
  const fn = arr => {
    arr.map(item => {
      if (item.children && item.children.length > 0) {
        fn(item.children)
      } else {
        if (treeMap[item[props.nodeKey]]) {
          treeMap[item[props.nodeKey]].add(item)
        } else {
          treeMap[item[props.nodeKey]] = new Set()
          treeMap[item[props.nodeKey]].add(item)
        }
      }
    })
  }
  fn(props.sourceData)
  treeDataMapData.value = treeMap
}
onMounted(() => {
  treeDataMap()
})
</script>

<style lang="scss" scoped>
.chosen {
  box-shadow: 0 8px 12px 0 rgba(23, 22, 23, 0.1) !important;
}

:deep(.el-tree-node__content) {
  margin-right: 5px;
}
.dialog-body {
  display: flex;
  width: 762px;
  height: 448px;
  border-radius: 4px;
  border: 1px solid #f0f3f5;

  &__left {
    width: 485px;
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

      > span {
        color: #26292e;
        font-size: 16px;
        margin-left: 20px;
        font-weight: 600;
      }

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

      &__item {
        width: 100%;
        height: 48px;
        background: #fafbfc;
        border-radius: 3px;
        border: 1px solid #dbdee4;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 4px 0;
      }
    }
  }
}

:deep(.el-tree-node__label) {
  overflow: hidden;
  /* white-space: nowrap; */
  text-overflow: ellipsis;
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

.checked-node-box {
  display: flex;
  flex-wrap: wrap;
  list-style: none;

  .checked-node-li {
    width: 100%;
    list-style: none;
    opacity: 1;
    padding: 4px 10px;
    margin-bottom: 12px;
    margin-right: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &:hover {
      background: #f6f7f9;
      border-radius: 2px;
    }

    .checked-item::after {
      content: "";
      display: inline-block;
      width: 12px;
      height: 7px;
      border-top: 2px solid #aaa;
      border-bottom: 2px solid #aaa;
    }
    .checked-name {
      width: 135px;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
    > i {
      font-size: 12px;
      cursor: pointer;
    }
  }
}
</style>
