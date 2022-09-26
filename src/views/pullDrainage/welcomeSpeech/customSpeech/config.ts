export const tableConfig = [
  {
    prop: "content",
    label: "欢迎语",
    slot: true,
    minWidth: 200,
    hideTips: true
  },
  {
    prop: "createUserName",
    label: "创建人",
    minWidth: 104
  },
  {
    prop: "updatedTime",
    label: "创建时间",
    minWidth: 144
  },
  {
    prop: "status",
    label: "状态",
    slot: true,
    width: 104
  },
  {
    align: "center",
    prop: "operation",
    label: "操作",
    slot: true,
    width: 104,
    fixed: "right"
  }
]

export const restrictConfig = {
  text: 1
}
