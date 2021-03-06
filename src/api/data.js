import axios from '@/libs/api.request'
import store from '@/store'

export const getCard = () => {
  return axios.request({
    url: '/index',
    method: 'get'
  })
}

/** 
 * 阿里跳转第一次登录需要填写信息
*/
export const savePerfectInfo = data => {
  return axios.request({
    url: '/account/accountPerfectInfo',
    data: data,
    method: 'post'
  })
}

/**
 * 免密token跳转到直播后台管理
 */
export const getImbLoginUrl = () => {
  return axios.request({
    url: '/account/getImbLoginUrl',
    method: 'get'
  })
}

/**
 * 验证码获取
 */
export const getIdentityCode = data => {
  return axios.request({
    url: '/common/getIdentityCode',
    data: data,
    method: 'post'
  })
}

/**
 * 服务管理
 * @param  params 
 */
export const getServiceList = params => {
  return axios.request({
    url: '/server',
    params: params,
    method: 'get'
  })
}

export const addServer = data => {
  return axios.request({
    url: '/server',
    data: data,
    method: 'post'
  })
}

export const getServiceInfo = params => {
  return axios.request({
    url: `/server/info/${params}`,
    method: 'get'
  })
}

export const putService = data => {
  return axios.request({
    url: `/server/${data.id}`,
    data: data,
    method: 'put'
  })
}

export const delService = data => {
  return axios.request({
    url: `/server/${data}`,
    method: 'delete'
  })
}

export const operateService = data => {
  return axios.request({
    url: `/server/${data.serverId}/${data.serverStatus}/operate`,
    data: {},
    method: 'post'
  })
}

/**
 * 账户数据接口
 */
export const getAccountList = params => {
  return axios.request({
    url: '/account',
    params: params,
    method: 'get'
  })
}

export const addAccount = data => {
  return axios.request({
    url: '/account',
    data: data,
    method: 'post'
  })
}

export const delAccount = data => {
  return axios.request({
    url: `/account/${data}`,
    method: 'delete'
  })
}

export const getAccountInfo = params => {
  return axios.request({
    url: `/account/info/${params}`,
    method: 'get'
  })
}

// 管理员修改
export const putAccount = data => {
  return axios.request({
    url: `/account/${data.id}`,
    data: data,
    method: 'put'
  })
}

// 个人/企业修改
export const putPersonalAccount = data => {
  return axios.request({
    url: `/account/info/${data.id}`,
    data: data,
    method: 'put'
  })
}

export const register = data => {
  return axios.request({
    url: '/account/register',
    data: data,
    method: 'post'
  })
}

export const registered = params => {
  return axios.request({
    url: '/account/registered',
    params: params,
    method: 'get'
  })
}

export const isExitsAccount = params => {
  return axios.request({
    url: '/account/isExitsAccount',
    params: params,
    method: 'get'
  })
}

export const forget = data => {
  return axios.request({
    url: '/account/forget',
    data: data,
    method: 'post'
  })
}

/**
 * 实例列表
 */
export const getExampleList = params => {
  return axios.request({
    url: '/instance',
    params: params,
    method: 'get'
  })
}

export const addExample = data => {
  return axios.request({
    url: '/instance',
    data: data,
    method: 'post'
  })
}

export const delExample = data => {
  return axios.request({
    url: `/instance/${data}`,
    method: 'delete'
  })
}

export const putExample = data => {
  return axios.request({
    url: `/instance/${data.id}`,
    data: data,
    method: 'put'
  })
}

export const getExampleInfo = params => {
  return axios.request({
    url: `/instance/${params}`,
    method: 'get'
  })
}

export const operateExample = data => {
  return axios.request({
    url: `/instance/${data.instId}/${data.instStatus}/operate`,
    data: {},
    method: 'post'
  })
}

/**
 * 用户
 */
export const getUserList = params => {
  return axios.request({
    url: '/user',
    params: params,
    method: 'get'
  })
}

export const getUserInfo = params => {
  return axios.request({
    url: `/user/${params}`,
    method: 'get'
  })
}

export const getUserExample = params => {
  return axios.request({
    url: `/user/${params}/relation`,
    method: 'get'
  })
}

export const addUser = data => {
  return axios.request({
    url: '/user',
    data: data,
    method: 'post'
  })
}

export const startUser = data => {
  return axios.request({
    url: `/user/${data.userId}/relation`,
    data: data,
    method: 'post'
  })
}

export const closeUser = data => {
  return axios.request({
    url: `/user/${data}/relation`,
    method: 'delete'
  })
}

export const delUser = data => {
  return axios.request({
    url: `/user/${data}`,
    method: 'delete'
  })
}

export const putUser = data => {
  return axios.request({
    url: `/user/${data.id}`,
    data: data,
    method: 'put'
  })
}

/**
 * 日志管理
 */
export const getLogList = data => {
  return axios.request({
    url: '/log/userLog',
    data: data,
    method: 'post'
  })
}

/**
 * 通话查询
 */
export const getCdrList = data => {
  return axios.request({
    url: '/stats/cdr',
    data: data,
    method: 'post'
  })
}

export const getCallInfo = params => {
  return axios.request({
    url: `/stats/cdr/${params}`,
    method: 'get'
  })
}

/**
 * 统计数据
 */
export const getStatsCount = params => {
  return axios.request({
    url: '/stats/getStatsCount',
    params: params,
    method: 'get'
  })
}

export const getCallLengthChart = params => {
  return axios.request({
    url: '/stats/getCallLengthChart',
    params: params,
    method: 'get'
  })
}

export const getCallLengthData = params => {
  return axios.request({
    url: '/stats/getCallLengthData',
    params: params,
    method: 'get'
  })
}

export const getOnlineUserChart = params => {
  return axios.request({
    url: '/stats/getOnlineUserChart',
    params: params,
    method: 'get'
  })
}

export const getOnlineUserData = params => {
  return axios.request({
    url: '/stats/getOnlineUserData',
    params: params,
    method: 'get'
  })
}

export const getCallApexChart = params => {
  return axios.request({
    url: '/stats/getCallApexChart',
    params: params,
    method: 'get'
  })
}

export const getCallApexData = params => {
  return axios.request({
    url: '/stats/getCallApexData',
    params: params,
    method: 'get'
  })
}

/**
 * 应用列表
 */
export const getAppList = () => {
  return axios.request({
    url: '/app/versions',
    method: 'get'
  })
}

export const addApp = data => {
  return axios.request({
    url: '/app/versions',
    data: data,
    method: 'post',
    upload: true,
    onUploadProgress: (progressEvent) => {
      // 使用本地 progress 事件
      if (progressEvent.lengthComputable) {
        let num = Math.round((progressEvent.loaded / progressEvent.total) * 100)
        store.commit('setUploadProgress', num)
      }
    }
  })
}

export const delApp = data => {
  return axios.request({
    url: `/app/versions/${data}`,
    method: 'delete'
  })
}

export const getAppInfo = params => {
  return axios.request({
    url: `/app/versions/getAppVersionInfo/${params}`,
    method: 'get'
  })
}

export const putApp = data => {
  return axios.request({
    url: `/app/versions/${data.get('id')}`,
    data: data,
    method: 'put'
  })
}

// h5 下载，最新app内容请求
export const getLatestInfo = () => {
  return axios.request({
    url: '/app/versions/getNewestAppVersionList',
    method: 'get'
  })
}


/**
 * 消息
 */
export const getMsgList = params => {
  return axios.request({
    url: '/message',
    params: params,
    method: 'get'
  })
}

export const saveMsg = data => {
  return axios.request({
    url: 'message',
    data: data,
    method: 'post'
  })
}

export const getMsgInfo = params => {
  return axios.request({
    url: `/message/${params}`,
    method: 'get'
  })
}

export const putMsg = data => {
  return axios.request({
    url: `/message/${data.id}`,
    data: data,
    method: 'put'
  })
}

export const delMsg = data => {
  return axios.request({
    url: `/message/${data}`,
    method: 'delete'
  })
}

/**
 * 会议预约
 */
export const getMeetPage = params => {
  return axios.request({
    url: '/meeting/getMeetingPage',
    params: params,
    method: 'get',
  })
}

export const addMeeting = data => {
  return axios.request({
    url: '/meeting/addMeeting',
    data: data,
    method: 'post'
  })
}

export const updateMeeting = data => {
  return axios.request({
    url: `/meeting/updateMeeting/${data.id}`,
    data: data,
    method: 'put'
  })
}

export const getMeetInfo = params => {
  return axios.request({
    url: `/meeting/getMeetingInfo/${params}`,
    method: 'get'
  })
}

export const delMeet = data => {
  return axios.request({
    url: `/meeting/delMeeting/${data}`,
    method: 'delete'
  })
}

export const getUsers = params => {
  return axios.request({
    url: "/pocuser/getPocUserPageInfo",
    params: params,
    method: "get"
  });
};

/**
 * poc接口
 */

export const ayncData = data => {
  return axios.request({
    url: '/pocorganization/importData',
    data: data,
    method: 'post'
  })
}

export const getNumberPrefix = data => {
  return axios.request({
    url: '/pocuser/getNumberPrefix',
    data: data,
    method: 'post'
  })
}

export const delUserGroup = data => {
  return axios.request({
    url: 'usergroup/delusersgroup',
    data: data,
    method: 'post'
  })
}

export const putGroup = data => {
  return axios.request({
    url: 'pocgroup/updategroup',
    data: data,
    method: 'post'
  })
}

export const delGroup = data => {
  return axios.request({
    url: '/pocgroup/delgroup',
    data: data,
    method: 'post'
  })
}

export const addGroop = data => {
  return axios.request({
    url: '/pocgroup/addgroup',
    data: data,
    method: 'post'
  })
}

export const putPermission = data => {
  return axios.request({
    url: '/pocuser/udpusershow',
    data: data,
    method: 'post'
  })
}

export const getDefPermission = params => {
  return axios.request({
    url: '/pocuser/selectusershow',
    params: params,
    method: 'get'
  })
}

export const updateUsers = data => {
  return axios.request({
    url: '/pocuser/updateuser',
    data: data,
    method: 'post'
  })
}

export const addToGroup = data => {
  return axios.request({
    url: '/pocgroup/addusersgroup',
    data: data,
    method: 'post'
  })
}

export const delUsers = data => {
  return axios.request({
    url: '/pocuser/delusers',
    data: data,
    method: 'post'
  })
}

export const addUser2 = data => {
  return axios.request({
    url: '/pocuser/adduser',
    data: data,
    method: 'post'
  })
}

export const getOrgDatas = params => {
  return axios.request({
    url: '/pocorganization/selectorg',
    params: params,
    method: 'get'
  })
}

export const getUser = params => {
  return axios.request({
    url: '/pocorganization/selectuserorg',
    params: params,
    method: 'get'
  })
}

export const getAllPocUser = params => {
  return axios.request({
    url: '/pocorganization/getAllPocUser',
    params: params,
    method: 'get'
  })
}

export const getOrgList = params => {
  return axios.request({
    url: '/pocorganization/selectallorg',
    params: params,
    method: 'get'
  })
}

export const getGroupList = params => {
  return axios.request({
    url: '/pocgroup/selectgroup',
    params: params,
    method: 'get'
  })
}

export const getGroupData = params => {
  return axios.request({
    url: '/pocgroup/selectusergroup',
    params: params,
    method: 'get'
  })
}

export const addOrg = data => {
  return axios.request({
    url: '/pocorganization/addorg',
    data: data,
    method: 'post'
  })
}

export const delOrg = data => {
  return axios.request({
    url: '/pocorganization/delorg',
    data: data,
    method: 'post'
  })
}

export const updateOrg = data => {
  return axios.request({
    url: '/pocorganization/updateorg',
    data: data,
    method: 'post'
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
