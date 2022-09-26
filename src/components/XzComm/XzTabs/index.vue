<template>
  <el-tabs v-model="activeName" @tab-change="handleChange">
    <el-tab-pane v-for="(item, index) in tabs" :key="index" :name="item[tabsConfig.label]">
      <template #label>
        {{ item[tabsConfig.name] }}
        <span v-if="item[tabsConfig.num] >= 0" :class="'event-num__' + item[tabsConfig.label]">
          {{ item[tabsConfig.num] }}
        </span>
      </template>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
const emit = defineEmits(["change"])
const props = defineProps({
  tabs: {
    type: [Object, Array],
    required: true,
    default: () => []
  },
  tabsConfig: {
    type: Object,
    default: {
      name: "name",
      lable: "lable",
      num: "num"
    }
  },
  currTab: {
    type: String,
    default: ""
  }
})

const activeName = ref<string>(props.currTab ? props.currTab : props.tabs[0][props.tabsConfig.lable])

const handleChange = (name: any) => {
  emit("change", name)
}
</script>

<style lang="scss" scoped>
:deep(.el-tabs__nav-wrap::after) {
  content: "";
  height: 1px;
  background-color: #f0f3f5;
}
:deep(.el-tabs__active-bar) {
  height: 1px;
  background-color: #2749f1;
}

:deep(.el-tabs__item.is-active) {
  font-size: 14px;
  color: #26292e;
}

:deep(.el-tabs__item) {
  color: #888d97;

  > span {
    padding: 0 10px;
  }
}

span[class^="event-num"] {
  margin-left: 8px;
  line-height: 25px;
  height: 25px;
  background-color: #f6f7f9;
}
</style>
