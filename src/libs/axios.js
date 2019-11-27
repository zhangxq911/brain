import axios from 'axios'
import store from '@/store'
import router from '@/router'
// import { Spin } from 'iview'
const addErrorLog = errorInfo => {
  const { statusText, status, request: { responseURL } } = errorInfo
  let info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL
  }
  if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}

// 获取url中token参数值,适用于 hash 模式
const getQueryStringHistory = name => {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  let r = window.location.search.substr(1).match(reg);
  if (r != null) return r[2]; return '';
}

const getHashParameters = () => {
  let arr = (location.hash || '').split('?')[1]
  if (!arr) { return '' } else {
    arr = arr.split('&')
  }
  let params = {}
  for (let i = 0; i < arr.length; i++) {
    let data = arr[i].split('=')
    if (data.length === 2) {
      params[data[0]] = data[1]
    }
  }
  return params
}

const getQueryStringHash = key => {
  let params = getHashParameters()
  return params[key]
}
class HttpRequest {
  constructor(baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        //
      }
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 初始化页面未加载时候，token 值为空
      if (store.state.user.token) {
        config.headers.token = store.state.user.token
      }
      config.headers.source = 'PC'
      if (config.method === 'post' && !config.upload) {
        // 处理post 数据类型转为 formdata
        const formData = new FormData()
        Object.keys(config.data).forEach(key => formData.append(key, config.data[key]))
        config.data = formData
      }
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      // token 失效拦截
      if (res.data.code === -10086) {
        store.commit('setToken', '')
        // 判断是系统过来的还是阿里过来的，通过是否有token判断
        let loginToken = ''
        if (router.mode === 'hash') {
          loginToken = getQueryStringHash('token')
        } else if (router.mode === 'history') {
          loginToken = getQueryStringHistory('token')
        }
        if (loginToken) {
          router.push({ name: 'error' })
        } else {
          router.push({ name: 'login' })
        }
      }
      this.destroy(url)
      const { data, status } = res
      return { data, status }
    }, error => {
      this.destroy(url)
      let errorInfo = error.response
      if (!errorInfo) {
        const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
        errorInfo = {
          statusText,
          status,
          request: { responseURL: config.url }
        }
      }
      // addErrorLog(errorInfo)
      return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
