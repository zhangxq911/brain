import Main from '@/components/main'
// import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login')
  },
  {
    path: '/register',
    name: 'register',
    meta: {
      title: '注册',
      hideInMenu: true
    },
    component: () => import('@/view/register/register')
  },
  {
    path: '/basicInfo',
    name: 'basicInfo',
    meta: {
      title: '基本信息',
      hideInMenu: true
    },
    component: () => import('@/view/info/info')
  },
  {
    path: '/forget',
    name: 'forget',
    meta: {
      title: '忘记密码',
      hideInMenu: true
    },
    component: () => import('@/view/forget/forget')
  },
  {
    path: '/h5',
    name: 'h5',
    meta: {
      title: 'APP下载',
      hideInMenu: true
    },
    component: () => import('@/view/h5/h5')
  },
  {
    path: '/error',
    name: 'error',
    meta: {
      title: '错误',
      hideInMenu: true
    },
    component: () => import('@/view/error-page/error-token')
  },
  {
    path: '/main',
    name: '_home',
    redirect: '/home',
    meta: {},
    component: Main,
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          title: '概述',
          notCache: true,
          icon: 'ios-stats'
        },
        component: () => import('@/view/home/home')
      }
    ]
  },
  {
    path: '/service',
    name: 'service',
    component: Main,
    meta: {
      access: ['super_admin'],
      hideInBread: true
    },
    children: [
      {
        path: 'service_page',
        name: 'service_page',
        meta: {
          icon: 'ios-paper',
          title: '服务管理'
        },
        component: () => import('@/view/service/service')
      },
      {
        path: 'service/:id',
        name: 'edit_service',
        props: true,
        meta: {
          icon: 'ios-paper',
          title: '新增服务',
          hideInMenu: true,
          to: 'service_page'
        },
        component: () => import('@/view/service/editService')
      }
    ]
  },
  {
    path: '/account',
    name: 'account',
    component: Main,
    meta: {
      access: ['super_admin'],
      hideInBread: true
    },
    children: [
      {
        path: 'account_page',
        name: 'account_page',
        meta: {
          icon: 'md-people',
          title: '账户管理'
        },
        component: () => import('@/view/account/account')
      },
      {
        path: 'info/:id',
        name: 'edit_account',
        props: true,
        meta: {
          icon: 'ios-paper',
          title: '新增账户',
          hideInMenu: true,
          to: 'account_page'
        },
        component: () => import('@/view/account/editAccount')
      }
    ]
  },
  {
    path: '/example',
    name: 'example',
    component: Main,
    meta: {
      hideInBread: true,
      title: '实例管理',
      notCache: true,
      icon: 'md-albums'
    },
    children: [
      {
        path: 'example_page',
        name: 'example_page',
        meta: {
          title: '实例列表'
        },
        component: () => import('@/view/example/example')
      },
      {
        path: 'example/:id',
        name: 'edit_example',
        props: true,
        meta: {
          title: '新增实例',
          hideInMenu: true,
          to: 'example_page'
        },
        component: () => import('@/view/example/editExample')
      },
      {
        path: 'users_page',
        name: 'users_page',
        meta: {
          title: '用户'
        },
        component: () => import('@/view/users/users')
      },
      {
        path: 'users',
        name: 'edit_users',
        props: true,
        meta: {
          title: '新增用户',
          hideInMenu: true,
          to: 'users_page'
        },
        component: () => import('@/view/users/editUsers')
      },
    ]
  },
  {
    path: '/meeting',
    name: 'meeting',
    divider: true,
    component: Main,
    meta: {
      hideInBread: true
    },
    children: [
      {
        path: 'meeting_page',
        name: 'meeting_page',
        meta: {
          icon: 'md-calendar',
          title: '会议预约'
        },
        component: () => import('@/view/meeting/meeting')
      },
      {
        path: 'info/:id',
        name: 'edit_meeting',
        props: true,
        meta: {
          icon: 'ios-paper',
          title: '新增会议',
          hideInMenu: true,
          to: 'meeting_page'
        },
        component: () => import('@/view/meeting/editMeeting')
      }
    ]
  },
  {
    path: '/analyze',
    name: 'analyze',
    divider: true,
    component: Main,
    meta: {
      hideInBread: true,
      icon: 'md-trending-up',
      title: '统计分析'
    },
    children: [
      {
        path: 'call_page',
        name: 'call_page',
        meta: {
          title: '通话查询'
        },
        component: () => import('@/view/call/call')
      }, {
        path: 'call',
        name: 'edit_call',
        props: true,
        meta: {
          title: '通话详情',
          hideInMenu: true,
          to: 'call_page'
        },
        component: () => import('@/view/call/editCall')
      },
      {
        path: 'data_page',
        name: 'data_page',
        meta: {
          title: '统计数据',
        },
        component: () => import('@/view/data/data')
      }
    ]
  },
  {
    path: '/app',
    name: 'app',
    divider: true,
    component: Main,
    meta: {
      access: ['super_admin'],
      hideInBread: true
    },
    children: [
      {
        path: 'app_page',
        name: 'app_page',
        meta: {
          icon: 'ios-apps',
          title: '应用管理'
        },
        component: () => import('@/view/app/app')
      },
      {
        path: 'app',
        name: 'edit_app',
        props: true,
        meta: {
          title: '新增应用',
          hideInMenu: true,
          to: 'app_page'
        },
        component: () => import('@/view/app/editApp')
      }
    ]
  },

  {
    path: '/log',
    name: 'log',
    component: Main,
    meta: {
      hideInBread: true
    },
    children: [
      {
        path: 'log_page',
        name: 'log_page',
        meta: {
          icon: 'ios-calendar',
          title: '操作日志'
        },
        component: () => import('@/view/log/log')
      }
    ]
  },
  {
    path: '/msg',
    name: 'msg',
    component: Main,
    meta: {
      hideInBread: true,
      access: ['super_admin'],
    },
    children: [
      {
        path: 'msg_page',
        name: 'msg_page',
        meta: {
          icon: 'md-chatboxes',
          title: '消息管理'
        },
        component: () => import('@/view/message/message')
      },
      {
        path: 'msg',
        name: 'edit_msg',
        props: true,
        meta: {
          title: '新建消息',
          hideInMenu: true,
          to: 'msg_page'
        },
        component: () => import('@/view/message/editMsg')
      }
    ]
  },
  // {
  //   path: '/error',
  //   name: 'error',
  //   meta: {
  //     hideInMenu: true
  //   },
  //   component: () => import('@/view/error-page/error-token.vue')
  // }
  // {
  //   path: '',
  //   name: 'doc',
  //   meta: {
  //     title: '文档',
  //     href: 'https://lison16.github.io/iview-admin-doc/#/',
  //     icon: 'ios-book'
  //   }
  // },
  // {
  //   path: '/message',
  //   name: 'message',
  //   component: Main,
  //   meta: {
  //     hideInBread: true,
  //     hideInMenu: true
  //   },
  //   children: [
  //     {
  //       path: 'message_page',
  //       name: 'message_page',
  //       meta: {
  //         icon: 'md-notifications',
  //         title: '消息中心'
  //       },
  //       component: () => import('@/view/single-page/message/index.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/components',
  //   name: 'components',
  //   meta: {
  //     icon: 'logo-buffer',
  //     title: '组件'
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'tree_select_page',
  //       name: 'tree_select_page',
  //       meta: {
  //         icon: 'md-arrow-dropdown-circle',
  //         title: '树状下拉选择器'
  //       },
  //       component: () => import('@/view/components/tree-select/index.vue')
  //     },
  //     {
  //       path: 'count_to_page',
  //       name: 'count_to_page',
  //       meta: {
  //         icon: 'md-trending-up',
  //         title: '数字渐变'
  //       },
  //       component: () => import('@/view/components/count-to/count-to.vue')
  //     },
  //     {
  //       path: 'drag_list_page',
  //       name: 'drag_list_page',
  //       meta: {
  //         icon: 'ios-infinite',
  //         title: '拖拽列表'
  //       },
  //       component: () => import('@/view/components/drag-list/drag-list.vue')
  //     },
  //     {
  //       path: 'drag_drawer_page',
  //       name: 'drag_drawer_page',
  //       meta: {
  //         icon: 'md-list',
  //         title: '可拖拽抽屉'
  //       },
  //       component: () => import('@/view/components/drag-drawer')
  //     },
  //     {
  //       path: 'org_tree_page',
  //       name: 'org_tree_page',
  //       meta: {
  //         icon: 'ios-people',
  //         title: '组织结构树'
  //       },
  //       component: () => import('@/view/components/org-tree')
  //     },
  //     {
  //       path: 'tree_table_page',
  //       name: 'tree_table_page',
  //       meta: {
  //         icon: 'md-git-branch',
  //         title: '树状表格'
  //       },
  //       component: () => import('@/view/components/tree-table/index.vue')
  //     },
  //     {
  //       path: 'cropper_page',
  //       name: 'cropper_page',
  //       meta: {
  //         icon: 'md-crop',
  //         title: '图片裁剪'
  //       },
  //       component: () => import('@/view/components/cropper/cropper.vue')
  //     },
  //     {
  //       path: 'tables_page',
  //       name: 'tables_page',
  //       meta: {
  //         icon: 'md-grid',
  //         title: '多功能表格'
  //       },
  //       component: () => import('@/view/components/tables/tables.vue')
  //     },
  //     {
  //       path: 'split_pane_page',
  //       name: 'split_pane_page',
  //       meta: {
  //         icon: 'md-pause',
  //         title: '分割窗口'
  //       },
  //       component: () => import('@/view/components/split-pane/split-pane.vue')
  //     },
  //     {
  //       path: 'markdown_page',
  //       name: 'markdown_page',
  //       meta: {
  //         icon: 'logo-markdown',
  //         title: 'Markdown编辑器'
  //       },
  //       component: () => import('@/view/components/markdown/markdown.vue')
  //     },
  //     {
  //       path: 'editor_page',
  //       name: 'editor_page',
  //       meta: {
  //         icon: 'ios-create',
  //         title: '富文本编辑器'
  //       },
  //       component: () => import('@/view/components/editor/editor.vue')
  //     },
  //     {
  //       path: 'icons_page',
  //       name: 'icons_page',
  //       meta: {
  //         icon: '_bear',
  //         title: '自定义图标'
  //       },
  //       component: () => import('@/view/components/icons/icons.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/update',
  //   name: 'update',
  //   meta: {
  //     icon: 'md-cloud-upload',
  //     title: '数据上传'
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'update_table_page',
  //       name: 'update_table_page',
  //       meta: {
  //         icon: 'ios-document',
  //         title: '上传Csv'
  //       },
  //       component: () => import('@/view/update/update-table.vue')
  //     },
  //     {
  //       path: 'update_paste_page',
  //       name: 'update_paste_page',
  //       meta: {
  //         icon: 'md-clipboard',
  //         title: '粘贴表格数据'
  //       },
  //       component: () => import('@/view/update/update-paste.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/excel',
  //   name: 'excel',
  //   meta: {
  //     icon: 'ios-stats',
  //     title: 'EXCEL导入导出'
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'upload-excel',
  //       name: 'upload-excel',
  //       meta: {
  //         icon: 'md-add',
  //         title: '导入EXCEL'
  //       },
  //       component: () => import('@/view/excel/upload-excel.vue')
  //     },
  //     {
  //       path: 'export-excel',
  //       name: 'export-excel',
  //       meta: {
  //         icon: 'md-download',
  //         title: '导出EXCEL'
  //       },
  //       component: () => import('@/view/excel/export-excel.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/tools_methods',
  //   name: 'tools_methods',
  //   meta: {
  //     hideInBread: true
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'tools_methods_page',
  //       name: 'tools_methods_page',
  //       meta: {
  //         icon: 'ios-hammer',
  //         title: '工具方法',
  //         beforeCloseName: 'before_close_normal'
  //       },
  //       component: () => import('@/view/tools-methods/tools-methods.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/i18n',
  //   name: 'i18n',
  //   meta: {
  //     hideInBread: true
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'i18n_page',
  //       name: 'i18n_page',
  //       meta: {
  //         icon: 'md-planet',
  //         title: 'i18n - {{ i18n_page }}'
  //       },
  //       component: () => import('@/view/i18n/i18n-page.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/error_store',
  //   name: 'error_store',
  //   meta: {
  //     hideInBread: true
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'error_store_page',
  //       name: 'error_store_page',
  //       meta: {
  //         icon: 'ios-bug',
  //         title: '错误收集'
  //       },
  //       component: () => import('@/view/error-store/error-store.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/error_logger',
  //   name: 'error_logger',
  //   meta: {
  //     hideInBread: true,
  //     hideInMenu: true
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'error_logger_page',
  //       name: 'error_logger_page',
  //       meta: {
  //         icon: 'ios-bug',
  //         title: '错误收集'
  //       },
  //       component: () => import('@/view/single-page/error-logger.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/directive',
  //   name: 'directive',
  //   meta: {
  //     hideInBread: true
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'directive_page',
  //       name: 'directive_page',
  //       meta: {
  //         icon: 'ios-navigate',
  //         title: '指令'
  //       },
  //       component: () => import('@/view/directive/directive.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/multilevel',
  //   name: 'multilevel',
  //   meta: {
  //     icon: 'md-menu',
  //     title: '多级菜单'
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'level_2_1',
  //       name: 'level_2_1',
  //       meta: {
  //         icon: 'md-funnel',
  //         title: '二级-1'
  //       },
  //       component: () => import('@/view/multilevel/level-2-1.vue')
  //     },
  //     {
  //       path: 'level_2_2',
  //       name: 'level_2_2',
  //       meta: {
  //         access: ['super_admin'],
  //         icon: 'md-funnel',
  //         showAlways: true,
  //         title: '二级-2'
  //       },
  //       component: parentView,
  //       children: [
  //         {
  //           path: 'level_2_2_1',
  //           name: 'level_2_2_1',
  //           meta: {
  //             icon: 'md-funnel',
  //             title: '三级'
  //           },
  //           component: () => import('@/view/multilevel/level-2-2/level-2-2-1.vue')
  //         },
  //         {
  //           path: 'level_2_2_2',
  //           name: 'level_2_2_2',
  //           meta: {
  //             icon: 'md-funnel',
  //             title: '三级'
  //           },
  //           component: () => import('@/view/multilevel/level-2-2/level-2-2-2.vue')
  //         }
  //       ]
  //     },
  //     {
  //       path: 'level_2_3',
  //       name: 'level_2_3',
  //       meta: {
  //         icon: 'md-funnel',
  //         title: '二级-3'
  //       },
  //       component: () => import('@/view/multilevel/level-2-3.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/argu',
  //   name: 'argu',
  //   meta: {
  //     hideInMenu: true
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'params/:id',
  //       name: 'params',
  //       meta: {
  //         icon: 'md-flower',
  //         title: route => `{{ params }}-${route.params.id}`,
  //         notCache: true,
  //         beforeCloseName: 'before_close_normal'
  //       },
  //       component: () => import('@/view/argu-page/params.vue')
  //     },
  //     {
  //       path: 'query',
  //       name: 'query',
  //       meta: {
  //         icon: 'md-flower',
  //         title: route => `{{ query }}-${route.query.id}`,
  //         notCache: true
  //       },
  //       component: () => import('@/view/argu-page/query.vue')
  //     }
  //   ]
  // },
  // 
  // {
  //   path: '/500',
  //   name: 'error_500',
  //   meta: {
  //     hideInMenu: true
  //   },
  //   component: () => import('@/view/error-page/500.vue')
  // },
  // {
  //   path: '*',
  //   name: 'error_404',
  //   meta: {
  //     hideInMenu: true
  //   },
  //   component: () => import('@/view/error-page/404.vue')
  // }
]
