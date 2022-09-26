/*
 * @Description: 内容中心接口
 */
import request from "@/utils/axiosReq"
import { ApiData, ApiScrmWechat } from "@/api/config"

export default class ContenCenterApi {
  // 内容中心分页列表
  contentList(params) {
    return request({
      method: "GET",
      url: `${ApiData}/contentCenter/content/list`,
      params
    })
  }
  // 内容中心 内容 修改分组
  contentEditGroup(params) {
    return request({
      method: "GET",
      url: `${ApiData}/contentCenter/content/updateGroup`,
      params
    })
  }
  // 内容中心 内容 修改
  contentEdit(params, data) {
    return request({
      method: "POST",
      url: `${ApiData}/contentCenter/content/update`,
      params,
      data
    })
  }
  // 内容中心 内容 重命名
  contentRename(params, data) {
    return request({
      method: "POST",
      url: `${ApiData}/contentCenter/content/reName`,
      params,
      data
    })
  }
  // 内容中心 内容 删除
  contentDelete(params) {
    return request({
      method: "GET",
      url: `${ApiData}/contentCenter/content/delete`,
      params
    })
  }
  // 内容中心 同步素材（图片-图文）
  syncMaterialData(params, type) {
    return request({
      method: "GET",
      url: `${ApiData}/contentCenter/content/syncMaterial/${type}`,
      params
    })
  }
  // 内容中心 分组  增加分组
  addGroup(params) {
    return request({
      method: "GET",
      url: `${ApiData}/contentCenter/group/add`,
      params
    })
  }
  // 内容中心 分组  分组统计
  groupCount(params) {
    return request({
      method: "GET",
      url: `${ApiData}/contentCenter/group/count`,
      params
    })
  }
  // 内容中心 分组  删除分组
  deleteGroup(params) {
    return request({
      method: "GET",
      url: `${ApiData}/contentCenter/group/delete`,
      params
    })
  }
  // 内容中心 分组 更新分组
  updateGroup(params) {
    return request({
      method: "GET",
      url: `${ApiData}/contentCenter/group/update`,
      params
    })
  }
  // 内容中心 分组 更新排序
  updateGroupOrder(params) {
    return request({
      method: "GET",
      url: `${ApiData}/contentCenter/group/updateGroupOrder`,
      params
    })
  }
  // 微信服务号-列表
  wechatList(params) {
    return request({
      method: "GET",
      url: `${ApiData}/contentCenter/content/wechatList`,
      params
    })
  }
  // 操作人列表
  operatorList(params) {
    return request({
      method: "GET",
      url: `${ApiData}/contentCenter/content/userList`,
      params
    })
  }
  // 查询微信服务号列表
  getWechatServiceList(data) {
    return request({
      method: "POST",
      url: `${ApiScrmWechat}/setting/wechatService/list`,
      data
    })
  }
  // 微信同步信息
  getWechatServiceSyncData() {
    return request({
      method: "GET",
      url: `${ApiData}/contentCenter/content/wechatSyncInfo`
    })
  }

  addContent(params, data) {
    return request({
      method: "POST",
      url: `${ApiData}/contentCenter/content/add`,
      params,
      data
    })
  }

  // 会话菜单新增
  addMsgMenu(params, data) {
    return request({
      method: "POST",
      url: `${ApiData}/contentCenter/content/addMsgMenu`,
      params,
      data
    })
  }

  // 修改会话菜单
  updateMsgMenu(params, data) {
    return request({
      method: "POST",
      url: `${ApiData}/contentCenter/content/updateMsgMenu`,
      params,
      data
    })
  }

  updateContent(params, data) {
    return request({
      method: "POST",
      url: `${ApiData}/contentCenter/content/update`,
      params,
      data
    })
  }
  // 上传图片
  uploadImg(data) {
    return request({
      method: "POST",
      url: `${ApiData}/contentCenter/content/uploadFile`,
      data
    })
  }
  // 根据内容id查询详情
  queryContentById(contentId) {
    return request({
      method: "GET",
      url: `${ApiData}/contentCenter/content/query/${contentId}`
    })
  }

  queryChannelList(data) {
    return request({
      method: "POSt",
      url: `${ApiData}/setting/channel/creativeChannelList`,
      data
    })
  }

  queryWeChatAccount(data) {
    return request({
      method: "POST",
      url: `${ApiScrmWechat}/setting/wechatService/list`,
      data
    })
  }

  queryTemplateList(params) {
    return request({
      method: "GET",
      url: `${ApiScrmWechat}/wx/messageTemplate/list`,
      params
    })
  }

  importFile(data) {
    return request({
      method: "POST",
      url: `${ApiData}/scriptLibrary/content/fileImport`,
      data
    })
  }
}
