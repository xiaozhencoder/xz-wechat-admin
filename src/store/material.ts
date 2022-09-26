import { defineStore } from "pinia"
import ContenCenterApi from "@/api/contentCenter/index"
import { deepClone, removeDuplicate } from "@/utils"
import { ObjTy } from "~/common"

const api = new ContenCenterApi()

export type GroupTy = {
  type: string
  isMe?: boolean
  picType?: string
  wechatId?: number
}

export type ContentTy = {
  keyword: string
  groupId: number
  userId: number | string
  type: string
  picType: string
  wechatId: number | string
  currentPage?: number
  pageSize?: number
}

export const useMaterialStore = defineStore("material", {
  state: () => {
    return {
      loading: false,
      materialDataList: [],
      groupId: -1,
      groups: [] as Array<ObjTy>,
      type: "",
      userId: "",
      keyword: "",
      paging: {
        currentPage: 1,
        pageSize: 20,
        totalPage: 0
      }
    }
  },

  actions: {
    async getGroups(params: GroupTy) {
      const resp = await api.groupCount(params)
      if (resp?.status === 0) {
        this.$patch({
          groups: resp.data
        })
      }
      return resp
    },

    resetState(params) {
      if (this.type !== params.type) {
        this.$patch({
          type: params.type,
          materialDataList: []
        })
      }

      if (this.groupId !== params.groupId) {
        this.$patch({
          groupId: params.groupId,
          materialDataList: []
        })
      }

      if (this.userId !== params.userId) {
        this.$patch({
          userId: params.userId,
          materialDataList: []
        })
      }

      if (this.keyword !== params.keyword) {
        this.$patch({
          keyword: params.keyword,
          materialDataList: []
        })
      }
    },

    async getContentList(params: ContentTy) {
      this.loading = true
      this.resetState(params)
      let { currentPage, pageSize } = this.paging
      const resp = await api.contentList({ ...params, currentPage, pageSize })
      if (resp?.status === 0) {
        const { data, currentPage, pageSize, totalPage } = resp.data
        this.materialDataList = removeDuplicate(deepClone(this.materialDataList).concat(data), "id")
        this.paging = { currentPage, pageSize, totalPage }
      }
      this.loading = false
      return resp
    }
  }
})
