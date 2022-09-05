export const workData = [
  {
    title: "客户数量",
    key: "totalContact",
    count: 0,
    tips:
      "管理范围内员工添加的客户总数（包含已流失、未流失状态的客户），数据去重（一个客户添加多名员工将被视为一个客户）。"
  },
  {
    title: "昨日新增客户",
    key: "yesterdayIncrease",
    count: 0,
    tips:
      "管理范围内员工昨日添加的客户总数（包含已流失、未流失状态的客户），数据去重（一个客户添加多名员工将被视为一个客户）。若客户之前已添加某员工，昨日又添加另一名员工则不纳入统计。"
  },
  {
    title: "昨日流失客户",
    key: "yesterdayLost",
    count: 0,
    tips:
      "截止昨天，管理范围内的员工全部删除某客户 或 某客户全部删除管理范围内所有员工 将被视为昨日流失。流失意味着企业将无法直接触达客户。"
  },
  {
    title: "过去7日新增客户",
    key: "last7DayIncrease",
    count: 0,
    tips:
      "管理范围内员工过去七日（不含今日）添加的客户总数（包含已流失、未流失状态的客户），数据去重（一个客户添加多名员工将被视为一个客户）。"
  },
  { title: "群聊数量", key: "totalGroup", count: 0, tips: "管理范围内员工作为群主的群聊数量，仅包含未解散的群聊。" },
  {
    title: "群内总人数",
    key: "totalGroupAccumulate",
    count: 0,
    tips: "管理范围内成员为群主的客户群的群成员总数（包含员工），数据末去重。"
  },
  {
    title: "昨日入群人次",
    key: "yesterdayJoinGroup",
    count: 0,
    tips: "管理范围内员工作为群主的群聊中，昨日新增的入群人次；多次入群会统计多次。"
  },
  {
    title: "昨日退群人次",
    key: "yesterdayLostGroup",
    count: 0,
    tips: "管理范围内员工作为群主的群聊中，昨日退群人次；多次退群会统计多次。"
  }
]

export const option = {
  title: {
    text: ""
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      crossStyle: {
        color: "#999"
      }
    }
  },
  toolbox: {
    showTitle: false,
    feature: {
      dataView: { show: false, readOnly: false },
      magicType: { show: true, type: ["line", "bar"] },
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  legend: {
    data: ["新增客户数"]
  },
  grid: {
    left: 50,
    top: 70,
    right: 50,
    bottom: 50
  },
  xAxis: {
    type: "category",
    data: [
      "2022-09-01",
      "2022-09-02",
      "2022-09-03",
      "2022-09-04",
      "2022-09-05",
      "2022-09-06",
      "2022-09-07",
      "2022-09-08",
      "2022-09-09",
      "2022-09-10",
      "2022-09-11",
      "2022-09-12",
      "2022-09-13",
      "2022-09-14",
      "2022-09-15",
      "2022-09-16"
    ]
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      name: "新增客户数",
      type: "line",
      color: "#2749F1",
      label: {
        show: true, //开启显示
        position: "top" //在上方显示
      },
      data: [120, 200, 150, 80, 70, 110, 130, 17, 80, 100, 200, 269, 267, 30, 17, 900]
    }
  ]
}

/*
 * @Author: xu zhen
 * @LastEditors: xu zhen
 * @Date: 2022-04-27 17:09:12
 */
export const routeMenu = [
  {
    name: "拉新引流",
    children: [
      {
        title: "员工活码",
        text: "灵活设置跟踪好友添加",
        routePath: { path: "/drainage/customerManagement/liveCode" },
        icon: "icon-alive"
      },
      {
        title: "批量添加客户",
        text: "私域主动获客利器",
        routePath: { path: "/drainage/customerManagement/batchAddFriend" },
        icon: "icon-batch"
      },
      {
        title: "老客标签拉群",
        text: "针对现有客户的聚类建群",
        routePath: { path: "/drainage/intoGroupManagement/pullOldDrainageList" },
        icon: "icon-old"
      },
      {
        title: "新客自动拉群",
        text: "添加客户后自动建群运营",
        routePath: { path: "/drainage/intoGroupManagement/pullNewDrainageList" },
        icon: "icon-new"
      }
    ]
  },
  {
    name: "促活转化",
    children: [
      {
        title: "客户群发",
        text: "多类型圈选直接触达",
        routePath: { path: "/promoting/sendingTool/customer" },
        icon: "icon-group-send"
      },
      {
        title: "客户群群发",
        text: "群触达更加灵活",
        routePath: { path: "/promoting/sendingTool/customerBase" },
        icon: "icon-customer-group-send"
      },
      {
        title: "朋友圈群发",
        text: "支持企微和个微朋友圈",
        routePath: { path: "/promoting/sendingTool/massPostingTasksMoments" },
        icon: "icon-friend"
      },
      {
        title: "运营SOP",
        text: "社群成体系运营流程",
        routePath: { path: "/promoting/groupSopList" },
        icon: "icon-Sop"
      }
    ]
  },
  {
    name: "客户管理",
    children: [
      {
        title: "客户管理",
        text: "企微内的客户资产",
        routePath: { path: "/customerManagement/customerMent/clientManagementMain" },
        icon: "icon-customer-manage"
      },
      {
        title: "客户群管理",
        text: "群聊运营全局观",
        routePath: { path: "/customerManagement/customeBaserMent/customerBaseManagement" },
        icon: "icon-customer-group"
      },
      {
        title: "客户标签",
        text: "规则自动计算+人工标签处理",
        routePath: { path: "/customerManagement/customerMent/customerTagManagement" },
        icon: "icon-customer-tag"
      }
    ]
  },
  {
    name: "聊天辅助",
    children: [
      {
        title: "聊天侧边栏",
        text: "灵活的SOP法宝",
        routePath: { path: "/chatManagement/chatMain/chatBase" },
        icon: "icon-chat-slider"
      },
      {
        title: "会话存档",
        text: "提升对外服务质量",
        routePath: { path: "/chatManagement/chatStore" },
        icon: "icon-save-text"
      }
    ]
  },
  {
    name: "其他",
    children: [
      {
        title: "元数据",
        text: "管理数据的数据",
        routePath: { path: "/dataManagement/metaEvent" },
        icon: "icon-meta-event"
      },
      {
        title: "数据源",
        text: "简单配置即可扩展数据来源",
        routePath: { path: "/setting/dataSourceManagement" },
        icon: "icon-data-source"
      },
      {
        title: "内容中心",
        text: "多类型素材分组管理",
        routePath: { path: "/contentCenter" },
        icon: "icon-content-center"
      }
      //   {
      //     title: '标签管理',
      //     text: '管理数据的数据',
      //     routePath: { path: '/customerManagement/customerMent/customerTagManagement' },
      //     icon: 'icon-tag-manage'
      //   }
    ]
  }
]
