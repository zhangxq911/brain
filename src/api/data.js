import axios from '@/libs/api.request'
import store from '@/store'

/**
 * 验证码获取
 */
export const getIdentityCode = data => {
  return axios.request({
    url: '/access/console/common/getIdentityCode',
    data: data,
    method: 'post'
  })
}

/**
 * 账户数据接口
 */
export const getAccountList = params => {
  return axios.request({
    url: '/access/console/account',
    params: params,
    method: 'get'
  })
}

export const addAccount = data => {
  return axios.request({
    url: '/access/console/account',
    data: data,
    method: 'post'
  })
}

export const delAccount = data => {
  return axios.request({
    url: `/access/console/account/${data}`,
    method: 'delete'
  })
}

export const getAccountInfo = params => {
  return axios.request({
    url: `/access/console/account/info/${params}`,
    method: 'get'
  })
}

export const putAccount = data => {
  return axios.request({
    url: `/access/console/account/${data.id}`,
    data: data,
    method: 'put'
  })
}

/**
 * 实例列表
 */
export const getExampleList = params => {
  return axios.request({
    url: '/access/console/instance',
    params: params,
    method: 'get'
  })
}

export const addExample = data => {
  return axios.request({
    url: '/access/console/instance',
    data: data,
    method: 'post'
  })
}

export const delExample = data => {
  return axios.request({
    url: `/access/console/instance/${data}`,
    method: 'delete'
  })
}

export const putExample = data => {
  return axios.request({
    url: `/access/console/instance/${data.id}`,
    data: data,
    method: 'put'
  })
}

export const getExampleInfo = params => {
  return axios.request({
    url: `/access/console/instance/${params}`,
    method: 'get'
  })
}

/**
 * 用户
 */
export const getUserList = params => {
  return axios.request({
    url: '/access/console/user',
    params: params,
    method: 'get'
  })
}


/**
 * -------------------
 */
export const getTableData = () => {
  return axios.request({
    url: 'get_table_data',
    method: 'get'
  })
}

export const getDragList = () => {
  return axios.request({
    url: 'get_drag_list',
    method: 'get'
  })
}

export const errorReq = () => {
  return axios.request({
    url: 'error_url',
    method: 'post'
  })
}

export const saveErrorLogger = info => {
  return axios.request({
    url: 'save_error_logger',
    data: info,
    method: 'post'
  })
}

export const uploadImg = formData => {
  return axios.request({
    url: 'image/upload',
    data: formData
  })
}

export const getOrgData = () => {
  return axios.request({
    url: 'get_org_data',
    method: 'get'
  })
}

export const getTreeSelectData = () => {
  return axios.request({
    url: 'get_tree_select_data',
    method: 'get'
  })
}
