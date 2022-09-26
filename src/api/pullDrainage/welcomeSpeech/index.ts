// export class  调用的时候new出一个实例对象 引用方法
import request from "@/utils/axiosReq"
import { ApiScrmAcquisition } from "@/api/config"

// 企业微信-欢迎语api
export default class WelcomeSpeechApi {
  // 查询欢迎语列表
  getCustomerList(data) {
    return request({
      method: "POST",
      url: `${ApiScrmAcquisition}/workchat/userWelcomeMsg/list`,
      data
    })
  }

  // 添加欢迎语
  addCustomer(data) {
    return request({
      method: "POST",
      url: `${ApiScrmAcquisition}/workchat/userWelcomeMsg/add`,
      data
    })
  }
  // 编辑欢迎语
  updateCustomer(data) {
    return request({
      method: "POST",
      url: `${ApiScrmAcquisition}/workchat/userWelcomeMsg/edit`,
      data
    })
  }
  // 开启或关闭欢迎语
  changeCustomerStatus(data) {
    return request({
      method: "GET",
      url: `${ApiScrmAcquisition}/workchat/userWelcomeMsg/on?id=${data}`
    })
  }
  // 欢迎语详情
  getCustomerById(id) {
    return request({
      method: "GET",
      url: `${ApiScrmAcquisition}/workchat/welcomeMsg/getOne?id=${id}`
    })
  }
  // 删除欢迎语
  deleteCustomerById(id) {
    return request({
      method: "GET",
      url: `${ApiScrmAcquisition}/workchat/welcomeMsg/delete?id=${id}`
    })
  }
  // 查询客户群欢迎语列表
  getCustomerGroupList(data) {
    return request({
      method: "POST",
      url: `${ApiScrmAcquisition}/workchat/groupWelcomeMsg/list`,
      data
    })
  }

  // 添加客户群欢迎语
  addCustomerGroup(data) {
    return request({
      method: "POST",
      url: `${ApiScrmAcquisition}/workchat/groupWelcomeMsg/add`,
      headers: { "Content-type": "application/x-www-form-urlencoded" },
      data
    })
  }

  updateCustomerGroup(data) {
    return request({
      method: "POST",
      url: `${ApiScrmAcquisition}/workchat/groupWelcomeMsg/edit`,
      headers: { "Content-type": "application/x-www-form-urlencoded" },
      data
    })
  }

  getCustomerGroupById(id) {
    return request({
      method: "GET",
      url: `${ApiScrmAcquisition}/workchat/welcomeMsg/getOne?id=${id}`
    })
  }

  deleteCustomerGroupById(id) {
    return request({
      method: "GET",
      url: `${ApiScrmAcquisition}/workchat/welcomeMsg/delete?id=${id}`
    })
  }

  syncCustomerGroupMsgById(id) {
    return request({
      method: "GET",
      url: `${ApiScrmAcquisition}/workchat/groupWelcomeMsg/syn?id=${id}`
    })
  }
}
