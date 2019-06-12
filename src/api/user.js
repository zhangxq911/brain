import axios from '@/libs/api.request'
import { Base64 } from 'js-base64'
import md5 from 'crypto-js/md5'
import hmacsha1 from 'crypto-js/hmac-sha1'

// sign 设置
let date = new Date().getTime()
const stringToString = `POST\n${date}\n/access/console/account/login`

export const login = ({ userName, password }) => {
  // ZjMxMTM2MTdiYWQyYTQxNTcyODk2NmQwNDM2ZWUwMDgxYmU1ZTVhZg==
  const data = {
    account: userName
  }
  let sign = Base64.encode(hmacsha1(stringToString, md5(password).toString()).toString())
  return axios.request({
    url: '/access/console/account/login',
    data,
    method: 'post',
    headers: {
      'Authorization': sign,
      "Time": date
    }
  })
}

export const logout = (token) => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}

export const getUnreadCount = () => {
  return axios.request({
    url: 'message/count',
    method: 'get'
  })
}

export const getMessage = () => {
  return axios.request({
    url: 'message/init',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.request({
    url: 'message/content',
    method: 'get',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: 'message/has_read',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: 'message/remove_readed',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: 'message/restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}
