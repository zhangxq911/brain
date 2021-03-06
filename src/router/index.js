import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import { setToken, getToken, canTurnTo, setTitle } from '@/libs/util'
import config from '@/config'
import { tokenLogin, getAccount } from '@/api/user'
const { homeName } = config

Vue.use(Router)
const router = new Router({
  routes,
  // mode: 'hash',
  mode: 'history',
  base: '/console'
})
const LOGIN_PAGE_NAME = 'login'

const turnTo = (to, access, next) => {
  if (canTurnTo(to.name, access, routes)) next() // 有权限，可访问
  else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
}

// 获取url中token参数值, 适用于 history 模式
const getQueryStringHistory = name => {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  let r = window.location.search.substr(1).match(reg);
  if (r != null) return r[2]; return '';
}

// 获取url中token参数值,适用于 hash 模式
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

router.beforeEach((to, from, next) => {
  // 如果传参有title 值，则替换原本的值
  if (to.params.title) {
    to.meta.title = to.params.title
  }
  iView.LoadingBar.start()
  let token = getToken()

  if (!token && to.name !== LOGIN_PAGE_NAME) {
    // 未登录且要跳转的页面不是登录页
    if (to.name === 'register' || to.name === 'forget' || to.name === 'h5' || to.name === 'error') {
      turnTo(to, store.state.user.access, next)
    } else {
      next({
        name: LOGIN_PAGE_NAME // 跳转到登录页
      })
    }
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    // 判断是否带token参数，如果带token参数带话直接加入 token， 获取权限后跳转主页
    var loginToken = ''
    if (router.mode === 'hash') {
      loginToken = getQueryStringHash('token')
    } else if (router.mode === 'history') {
      loginToken = getQueryStringHistory('token')
    }
    if (loginToken) {
      store.commit('setToken', '')
      // 请求操作
      tokenLogin(loginToken).then(res => {
        if (res.data.code === 200) {
          let data = res.data.data
          // 返回成功，重新插入数据
          store.commit('setToken', data.token)
          store.commit('setUserName', data.accountName)
          store.commit('setUserId', data.accountId)
          // 0 系统 1 阿里
          store.commit('setSource', data.accountSource)
          switch (data.accountType) {
            case 0:
              store.commit('setAccess', ['super_admin', 'company', 'personal'])
              break;
            case 1:
              store.commit('setAccess', ['company', 'personal'])
              break;
            case 2:
              store.commit('setAccess', ['personal'])
              break;
            default:
              return
          }
          // 判断是否首次登录，要完善信息
          if (data.isPerfectInfo) {
            next({
              name: 'basicInfo' // 跳转到完善信息页
            })
          } else {
            next({
              name: homeName // 跳转到homeName页
            })
          }
        }
      })
    } else {
      next() // 跳转
    }
  } else if (token && !to.name) {
    // 请求操作
    getAccount(token).then(res => {
      if (res.data.code === 200) {
        // 返回成功，重新插入数据, 在axios 拦截错误请求-10086 token过期，跳转error 或 login
        let data = res.data.data
        store.commit('setUserName', data.accountName)
        store.commit('setUserId', data.id)
        store.commit('setSource', data.accountSource)
        switch (data.accountType) {
          case 0:
            store.commit('setAccess', ['super_admin', 'company', 'personal'])
            break;
          case 1:
            store.commit('setAccess', ['company', 'personal'])
            break;
          case 2:
            store.commit('setAccess', ['personal'])
            break;
          default:
            return
        }
        next({
          name: homeName // 跳转到homeName页
        })
      } else {
        // 跳转失败，返回页面，后续要修改
        location.hash = ''
        next() // 跳转
      }
    })
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    // 判断是否带token参数，如果带token参数带话直接加入 token， 获取权限后跳转主页
    var loginToken = ''
    if (router.mode === 'hash') {
      loginToken = getQueryStringHash('token')
    } else if (router.mode === 'history') {
      loginToken = getQueryStringHistory('token')
    }
    if (loginToken) {
      store.commit('setToken', '')
      // 请求操作
      tokenLogin(loginToken).then(res => {
        if (res.data.code === 200) {
          // 返回成功，重新插入数据
          let data = res.data.data
          store.commit('setToken', data.token)
          store.commit('setUserName', data.accountName)
          store.commit('setUserId', data.accountId)
          // 0 系统 1 阿里
          store.commit('setSource', data.accountSource)
          switch (data.accountType) {
            case 0:
              store.commit('setAccess', ['super_admin', 'company', 'personal'])
              break;
            case 1:
              store.commit('setAccess', ['company', 'personal'])
              break;
            case 2:
              store.commit('setAccess', ['personal'])
              break;
            default:
              return
          }
          // 判断是否首次登录，要完善信息
          if (data.isPerfectInfo) {
            next({
              name: 'basicInfo' // 跳转到完善信息页
            })
          } else {
            next({
              name: homeName // 跳转到homeName页
            })
          }
        }
      })
    } else {
      next({
        name: homeName // 跳转到homeName页
      })
    }
  } else {
    // 重新获取数据
    getAccount(token).then(res => {
      if (res.data.code === 200) {
        // 返回成功，重新插入数据
        let data = res.data.data
        store.commit('setUserName', data.accountName)
        store.commit('setUserId', data.id)
        store.commit('setSource', data.accountSource)
        switch (data.accountType) {
          case 0:
            store.commit('setAccess', ['super_admin', 'company', 'personal'])
            break;
          case 1:
            store.commit('setAccess', ['company', 'personal'])
            break;
          case 2:
            store.commit('setAccess', ['personal'])
            break;
          default:
            return
        }
        next()
      } else {
        // 跳转失败，返回页面
        next() // 跳转
      }
    })
    if (!store.state.user.hasGetInfo) {
      turnTo(to, store.state.user.access, next)
    } else {
      // console.log('获取用户信息，正常来说这里是不进的')
      if (store.state.user.access != '') {
        turnTo(to, store.state.user.access, next)
      } else {
        store.dispatch('getUserInfo').then(user => {
          // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
          turnTo(to, user.access, next)
        }).catch(() => {
          setToken('')
          next({
            name: LOGIN_PAGE_NAME
          })
        })
      }
    }
  }
})

router.afterEach(to => {
  setTitle(to, router.app)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
