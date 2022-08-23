<template>
  <div v-loading="vLoading" class="xz xz-table-wrap">
    <no-result v-if="data.length === 0 && !vLoading" :text="noResultText" />
    <template v-else-if="data.length > 0 && !vLoading">
      <div class="table-content xz-table-content">
        <el-table
          :ref="mref"
          v-loading="vLoading"
          v-bind="$attrs"
          :data="data"
          :element-loading-text="elementLoadingText"
          :tree-props="treeProps"
          :lazy="lazy"
          :load="load"
          :size="size"
          :max-height="maxHeight"
          :row-key="rowKey"
          @selection-change="handleSelectionChange"
          @sort-change="handleSort"
        >
          <el-table-column v-if="isMultiple" :cell-class-name="'selection-th'" type="selection" width="48" />
          <template v-for="(th, idx) in formatTableConfig">
            <el-table-column
              v-if="!th.type"
              :key="th.prop + th.label + idx"
              :column-key="th.prop + th.label + idx"
              :prop="th.prop"
              :label="th.label"
              :fixed="th.fixed"
              :width="th.width"
              :min-width="th.minWidth"
              :align="th.align"
              :type="th.type"
              :reserve-selection="!!th.reserveSelection"
              :sortable="th.sortable"
              :sort-by="th.sortBy"
              :show-overflow-tooltip="!th.hideTips"
            >
              <template #header="scope">
                <span v-if="!th.header">
                  {{ th.label }}
                  <el-tooltip
                    v-if="!!th.tooltip"
                    class="item"
                    effect="dark"
                    :content="th.tooltip"
                    placement="top-start"
                  >
                    <svg-icon class="tips-icon" icon-class="wenhao-tips" />
                  </el-tooltip>
                </span>
                <slot v-else :name="th.prop + 'header'" :row="scope.row" :$index="scope.$index" />
              </template>
              <template #default="scope">
                <slot :name="th.prop" :row="scope.row" :$index="scope.$index">
                  <template v-if="th.filter">
                    <div v-html="getFilterVal(th, scope.row[th.prop])" />
                  </template>
                  <template v-else>
                    {{ placeEmpty(scope.row[th.prop]) }}
                  </template>
                </slot>
              </template>
            </el-table-column>
            <el-table-column
              v-else
              :key="th.prop + th.label + th.type"
              :prop="th.prop"
              :label="th.label"
              :fixed="th.fixed"
              :width="th.width"
              :min-width="th.minWidth"
              :align="th.align"
              :type="th.type"
              :reserve-selection="!!th.reserveSelection"
            />
          </template>
        </el-table>
      </div>
      <div v-if="showPagination" class="jump-page-wrap">
        <Pagination
          :total="total"
          :page="page"
          :limit="limit"
          :auto-scroll="autoScroll"
          :hide-on-single-page="total <= 20"
          @cpage="(val) => emitXzTable('update:page', val)"
          @climit="(val) => emitXzTable('update:limit', val)"
          @pagination="handlePagination"
        />
      </div>

      <div
        v-if="isMultiple && selectedData.length > 0 && !!proxy.$slots['multiple-head']"
        :style="headMaskStyle"
        class="table-multiple-head"
      >
        <slot name="multiple-head" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import Pagination from "@/components/XzComm/XzPagination/index.vue"
import NoResult from "@/components/NoResult"

const { proxy }: any = getCurrentInstance()
const emitXzTable = defineEmits(["sort-change", "selectionChange", "propsFn", "update:page", "update:limit"])

const props = defineProps({
  tableKey: {
    type: String,
    default: ""
  },
  treeProps: {
    type: Object,
    default: () => ({
      children: "children",
      hasChildren: "hasChildren"
    })
  },
  lazy: {
    type: Boolean,
    default: false
  },
  vLoading: {
    type: Boolean,
    default: false
  },
  mref: {
    type: String,
    default: "mtable1"
  },
  data: {
    type: Array,
    default: () => []
  },
  size: {
    type: String,
    default: "default"
  },
  maxHeight: {
    type: [Number, String],
    default: "600"
  },
  rowKey: {
    type: Function,
    default: (row) => row.id
  },
  load: {
    type: Function,
    default: (row, treeNode, resolve) => {}
  },
  elementLoadingText: {
    type: String,
    default: "Loading"
  },
  tableConfig: {
    type: Array,
    default: () => []
  },
  total: {
    type: Number,
    default: 0
  },
  page: {
    type: Number,
    default: 1
  },
  limit: {
    type: Number,
    default: 20
  },
  pageSizes: {
    type: Array,
    default() {
      return [5, 10, 20, 30, 50, 100, 200]
    }
  },
  showPagination: {
    type: Boolean,
    default: true
  },
  autoScroll: {
    type: Boolean,
    default: true
  },
  showOverflowTooltip: {
    type: Boolean,
    default: true
  },
  isMultiple: {
    type: Boolean,
    default: false
  },
  columnKey: {
    type: String,
    default: ""
  },
  allColumns: {
    type: Array,
    default: () => []
  },
  noResultText: {
    type: String,
    default: "暂无结果"
  },
  //表格自适应宽度
  autoAdaption: {
    type: Boolean,
    default: false
  }
})

let selectedData = ref([])
let headMaskStyle: any = ref("")
let formatTableConfig: any = ref(props.tableConfig)

watch(
  () => props.tableConfig,
  (newVal, oldVal) => {
    formatTableConfig.value = newVal
  },
  {
    deep: true
  }
)
// 排序
const handleSort = function (column) {
  emitXzTable("sort-change", column)
}
// 选择行改变
const handleSelectionChange = function (rows) {
  selectedData.value = rows
  emitXzTable("selectionChange", rows)
  if (props.isMultiple) setHeaderMask()
}
// 切页
const handlePagination = function (val) {
  emitXzTable("propsFn", val)
}
// filter字段等
const getFilterVal = function (th, val) {
  if (th.filter[val]) {
    let str = th.filter[val]
    str = str.replace(/{{k}}/g, th.prop || "/")
    str = str.replace(/{{v}}/g, val || "/")
    return str
  }
  if (th.filter.def) {
    return th.filter.def
  }
  return "/"
}
// 清除多选
const clearSelects = function () {
  proxy.$refs[props.mref].clearSelection()
}
// 多选时设置表头遮罩宽高
const setHeaderMask = function () {
  if (!headMaskStyle.value) {
    const tableElement = proxy.$refs[props.mref].$el.querySelector(".el-table__header-wrapper")
    const height = tableElement?.offsetHeight || 55
    headMaskStyle.value = "height:" + height + "px;"
  }
}
// 计算列头宽度 自适应
// 注意 暂未处理当内容长度大于表头项长度时的自适应 可预处理此种场景
const flexColumnWidth = function (str) {
  if (!str) return
  let flexWidth = 0
  const padding = 20
  for (const char of str) {
    if ((char >= "A" && char <= "Z") || (char >= "a" && char <= "z")) {
      // 如果是英文字符，为字符分配10个单位宽度
      flexWidth += 10
    } else if (char >= "\u4e00" && char <= "\u9fa5") {
      // 如果是中文字符，为字符分配25个单位宽度
      flexWidth += 25
    } else {
      // 其他种类字符，为字符分配11个单位宽度
      flexWidth += 11
    }
  }
  if (flexWidth < 80) {
    // 设置最小宽度
    flexWidth = 80
  }
  flexWidth += padding
  return flexWidth
}
const placeEmpty = function (val) {
  if (!val && val !== 0) {
    return "--"
  }
  return val
}
</script>

<style scoped lang="scss">
@import "./index.scss";

.xz-table-content .el-table {
  border-radius: 4px;
  border: 1px solid #f0f3f5;
}
.el-table td,
.el-table th.is-leaf {
  border-bottom: none !important;
}
</style>
