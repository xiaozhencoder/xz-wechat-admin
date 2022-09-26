<template>
  <div :class="{ hidden: hidden }" class="pagination-container">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      class="paging"
      :background="background"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { WritableComputedRef } from "@vue/runtime-core"

const emitPagintion = defineEmits(["update:page", "update:limit", "cpage", "climit", "pagination"])

const propsPagintion = defineProps({
  total: {
    required: true,
    type: Number
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
      return [20, 50, 100]
    }
  },
  layout: {
    type: String,
    default: "total, prev, pager, next, sizes" // 'total, prev, pager, next, sizes, jumper'
  },
  background: {
    type: Boolean,
    default: false
  },
  autoScroll: {
    type: Boolean,
    default: true
  },
  hidden: {
    type: Boolean,
    default: false
  }
})

let currentPage: WritableComputedRef<number> = computed({
  get: () => {
    return propsPagintion.page
  },
  set: (val: number) => {
    emitPagintion("update:page", val)
    emitPagintion("cpage", val)
  }
})

let pageSize: WritableComputedRef<number> = computed({
  get: () => {
    return propsPagintion.limit
  },
  set: (val: number) => {
    emitPagintion("update:limit", val)
    emitPagintion("climit", val)
    localStorage.setItem("commPageSize", val + "")
  }
})

const handleSizeChange = (val: number) => {
  if (currentPage.value > 1) currentPage.value = 1
  emitPagintion("pagination", { pageNum: currentPage.value, pageSize: val })
}
const handleCurrentChange = (val: number) => {
  emitPagintion("pagination", { pageNum: val, pageSize: pageSize.value })
}
</script>

<style scoped lang="scss">
.pagination-container {
  box-sizing: border-box;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  background: #fff;
  padding: 18px 0 18px 16px;
}
.pagination-container.hidden {
  display: none;
}
</style>
