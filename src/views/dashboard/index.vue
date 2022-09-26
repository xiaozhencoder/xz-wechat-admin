<template>
  <div class="dashboard">
    <div class="dashb-left">
      <div v-loading="statLoading" class="dashb-stat">
        <div v-for="(item, index) in workData" class="cell pointer">
          <el-card shadow="always">
            <div class="title">
              <span class="m-r-8">{{ item.title }}</span>
              <el-tooltip effect="dark" :content="item.tips" placement="top-start">
                <svg-icon class="tips-icon" icon-class="wenhao-tips" />
              </el-tooltip>
            </div>
            <div class="count">
              <count-to v-if="item.count !== 0" :start-val="0" :end-val="item.count" :decimals="2" :duration="3000" />
              <template v-else>--</template>
            </div>
          </el-card>
        </div>
      </div>

      <div class="dashb-echarts m-r-16">
        <el-card v-loading="chartLoading" shadow="always">
          <span class="f-s-20 f-w-700">客户趋势</span>
          <el-date-picker
            v-model="dateArr"
            type="daterange"
            class="m-l-16"
            unlink-panels
            :clearable="false"
            placement="bottom-end"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :shortcuts="shortcuts"
            value-format="YYYY-MM-DD"
            @change="getDateValue"
          />
          <!-- @panel-change="getDateValue" -->
          <div class="eport-echarts">
            <no-result v-if="false" />
            <div v-else ref="chartEl" style="width: 100%; height: 350px"></div>
          </div>
        </el-card>
      </div>

      <div class="dashb-map">
        <el-card shadow="always">
          <div class="map-header">能力地图</div>
          <div class="map-content">
            <div v-for="item in routeMenu" :key="item.name" class="map-content-module">
              <div class="left-title">{{ item.name }}</div>
              <div class="right-content">
                <div
                  v-for="value in item.children"
                  :key="value.title"
                  class="content-card"
                  @click="goTo(value.routePath)"
                >
                  <div class="card-left">
                    <svg-icon :icon-class="value.icon" />
                  </div>
                  <div class="card-right">
                    <div>{{ value.title }}</div>
                    <div>{{ value.text }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <div class="dashb-rigth p-t-8">
      <div class="rigth-header">
        <div class="lg m-b-18 f-w-700">欢迎回来</div>
        <div class="user-info">
          <div class="name f-s-20 f-w-500">{{ userInfo.userName }}</div>
          <div class="company md f-w-500">
            <svg-icon icon-class="icon-person-tag" />
            <span>{{ service.serviceShowName }}</span>
          </div>
          <div class="tag m-t-5">
            <div v-for="item in userInfo.roleNames" :key="item" class="tag-info m-r-5">{{ item }}</div>
          </div>
          <div class="time m-t-8">服务中（有效期至{{ service.expireDate }}）</div>
        </div>

        <el-divider />
        <div class="user-guide">
          <div class="lg m-b-18 f-w-700">使用引导</div>
          <div class="view">
            <div class="title">
              <svg-icon icon-class="icon-version" class="f-s-24" />
              <span>版本更新说明</span>
            </div>
            <a href="https://docs.skying.cn" target="_blank">查看</a>
          </div>
          <div class="view">
            <div class="title">
              <svg-icon icon-class="icon-view" class="f-s-24" />
              <span>客户使用手册</span>
            </div>
            <a href="https://docs.skying.cn" target="_blank">查看</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useChart, { RenderType, ThemeType } from "@/hooks/useChart/index.ts"
import { Ref } from "vue"
import { CountTo } from "vue3-count-to"
import { workData, option as optionData, routeMenu } from "./config"

import { getCompanyAuthStatus, getWorkChatData as getStatData, getUserTrendData } from "@/api/dashboard/index"
import { ObjTy } from "~/common"
import { beforeDay } from "@/utils"
import { shortcuts } from "@/constent/dateConstant"
import { useUserStore } from "@/store/user"

const { userInfo, service } = useUserStore()
const statLoading = ref<boolean>(false)
const chartLoading = ref<boolean>(false)
const statData = ref<ObjTy>(workData)

const dateArr = ref([beforeDay(new Date(), 13), beforeDay(new Date())])
const chartEl = ref<HTMLDivElement | null>(null)

const { setOption, showLoading } = useChart(
  chartEl as Ref<HTMLDivElement>,
  true,
  true,
  RenderType.SVGRenderer,
  ThemeType.Light
)

const option = computed(() => optionData)

const getChartData = async () => {
  chartLoading.value = true
  await getUserTrendData({
    fromDate: dateArr.value[0],
    toDate: dateArr.value[1]
  })
    .then((res) => {
      let opt = res.data || []
      optionData.xAxis.data = opt.map((obj) => obj.date)
      optionData.series[0].data = opt.map((obj) => obj.count)
    })
    .finally(() => {
      chartLoading.value = false
    })
  refreshChartData()
}

const refreshChartData = async () => {
  setOption(option.value, { notMerge: true })
}

const getAuth = async () => {
  getCompanyAuthStatus(null).then((res) => {
    const { status, data } = res
    if (status === 0 && data.type === 3) {
      getWorkChatData()
    }
  })
}
// 获取企微数据
const getWorkChatData = async () => {
  statLoading.value = true
  getStatData()
    .then((res) => {
      const { data, status } = res
      if (status === 0) {
        statLoading.value = false
        statData.value = data || {}
        for (const key in statData.value) {
          const a = workData.find((item) => item.key === key)
          if (a) a.count = statData.value[key]
        }
      }
    })
    .finally(() => {
      statLoading.value = false
    })
}

const getDateValue = (val: Array<string>) => {
  dateArr.value = val
  console.log(dateArr)
  getChartData()
}

const goTo = (val) => {
  console.log(val)
}

onMounted(() => {
  nextTick(() => {
    getAuth()
    showLoading()
    getChartData()
  })
})
</script>

<style lang="scss" scoped>
.dashboard {
  display: flex;

  .dashb-left {
    width: 80%;
    padding: 8px;

    .dashb-stat {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      .cell {
        width: 23%;
        padding: 0 16px 16px 0;

        .title {
          font-size: 16px;
        }
        .count {
          font-size: 22px;
          font-weight: 700;
        }
      }
    }

    .dashb-map {
      background: $color-white;
      border-radius: 4px;
      margin: 16px 16px 16px 0;
      .map-header {
        height: 18px;
        font-size: 18px;
        font-weight: 500;
        color: $color-black;
        line-height: 18px;
      }
      .map-content {
        margin-top: 30px;
        .map-content-module {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 24px;
          .left-title {
            width: 64px;
            font-size: 16px;
            color: $color-text-secondary;
          }
          .right-content {
            display: flex;
            flex: 1;
            margin-left: 16px;
            width: 100%;
            .content-card {
              display: flex;
              height: 58px;
              width: calc(100% / 4 - 58px);
              padding: 20px 16px 10px;
              border-radius: 4px;
              border: 1px solid #f0f3f5;
              margin-left: 12px;
              margin-right: 12px;
              .card-left {
                > svg {
                  font-size: 24px;
                }
              }
              .card-right {
                margin-left: 12px;
                :nth-child(1) {
                  height: 14px;
                  font-size: 14px;
                  font-weight: 500;
                  color: $color-black;
                  line-height: 14px;
                }
                :nth-child(2) {
                  font-size: 12px;
                  font-weight: 400;
                  color: $color-text-secondary;
                  margin-top: 8px;
                }
              }
            }
            .content-card:hover {
              box-shadow: 0px 4px 8px 0px rgba(23, 22, 23, 0.06);
              cursor: pointer;
              .card-right {
                :nth-child(1) {
                  color: $color-primary;
                }
              }
            }
          }
        }
        :nth-child(1) {
          margin-top: 0;
        }
      }
    }
  }

  .dashb-rigth {
    flex: 1;

    .rigth-header {
      background-color: #fff;
      padding: 18px;
      box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
      border-radius: 4px;
      .user-info {
        // background-image: linear-gradient(45deg, #fff, #e2f5e2);
        padding: 18px;
        // background-color: rgba(135, 153, 163, 0.1) !important;
        color: #fff;
        background-image: linear-gradient(45deg, #9aadb9, #354855) !important;
        border-radius: 4px;
        box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);

        .tag {
          display: flex;

          &-info {
            padding: 3px;
            background: $color-secondary-light-3;
            border-radius: 4px;
          }
        }
      }

      .user-guide {
        .view {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .title {
            display: flex;
            align-items: center;
          }
          > a {
            color: $color-primary;
          }
        }
      }
    }
  }
}
</style>
