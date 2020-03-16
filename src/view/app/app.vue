<template>
  <div class="card-box">
    <Row style="padding-bottom: 10px;">
      <Button type="primary" @click="add">新建</Button>
    </Row>
    <Table :loading="loading" border :columns="columns" :data="dataList"></Table>
    <div class="footerPage">
      <span
        style="float: left;"
      >当前 {{dataList ? dataList.length : 0}} 条记录，共 {{dataList ? dataList.length : 0}} 条记录。</span>
    </div>
    <!--<Page
        :current="dataList.pageNumber"
        :page-size="dataList.pageSize"
        :total="dataList.count"
        @on-change="changePage"
      />
    </div>-->
  </div>
</template>

<script>
import { getAppList, delApp } from '@/api/data'
import { parseTime } from '@/libs/tools'
import { stat } from 'fs'

export default {
  data() {
    return {
      appNameObj: {
        center: '云上会面pad版',
        centerhd: '云上会面HD',
        call: '远程会议',
        gis: '应急一张图',
        live: '网络直播',
        meeting: '云上会面手机版',
        remote: '云上会面Remote',
        tv: '云视听',
        livepush: '直播推流'
      },
      loading: false,
      dataList: [],
      columns: [
        {
          title: '应用ID/应用名称',
          align: 'center',
          render: (h, params) => {
            let appName = params.row.appName
            if (this.appNameObj[appName]) {
              appName = this.appNameObj[appName]
            } else {
              appName = ''
            }

            return h('div', [
              h(
                'div',
                {
                  style: {
                    color: '#2d8cf0'
                  },
                  attrs: {
                    class: 'hoverAccount'
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        name: 'edit_app',
                        params: {
                          id: params.row.id,
                          mode: 'view',
                          title: '应用详情'
                        }
                      })
                    }
                  }
                },
                params.row.id
              ),
              h('div', appName)
            ])
          }
        },
        {
          title: '应用类型',
          align: 'center',
          sortable: true,
          key: 'type'
        },
        {
          title: '更新内容',
          align: 'center',
          sortable: true,
          ellipsis: true,
          key: 'content'
        },
        {
          title: '更新版本',
          align: 'center',
          sortable: true,
          key: 'version'
        },
        {
          title: '更新状态',
          align: 'center',
          sortable: true,
          render: (h, params) => {
            let status = params.row.status
            switch (status) {
              case 0:
                status = '无更新'
                break
              case 1:
                status = '建议更新'
                break
              case 2:
                status = '必须更新'
                break
              default:
                break
            }
            return h('div', status)
          }
        },
        {
          title: '更新时间',
          align: 'center',
          sortable: true,
          key: 'updateTime'
        },
        {
          title: '操作',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    margin: '4px'
                  },
                  on: {
                    click: () => {
                      this.edit(params.row)
                    }
                  }
                },
                '编辑'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    margin: '4px'
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: '信息',
                        content: `<p>确定删除 ${params.row.appName} 应用吗？</p>`,
                        onOk: () => {
                          this.delete(params.row.id)
                        }
                      })
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ]
    }
  },
  methods: {
    // 分页
    changePage(curPage) {
      let search = { ...this.searchForm }
      search.page = curPage
      this.loading = true
      this.getPage(searchForm)
    },
    // 删除
    delete(id) {
      delApp(id).then(res => {
        if (res.data.code === 200) {
          this.$Message.success(res.data.msg)
          this.getPage()
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    // 编辑
    edit(curAccount) {
      this.$router.push({
        name: 'edit_app',
        params: {
          id: curAccount.id,
          mode: 'edit',
          title: '编辑应用'
        }
      })
    },
    // 新增
    add() {
      this.$router.push({
        name: 'edit_app',
        params: {
          id: '',
          mode: 'add',
          title: '新增应用'
        }
      })
    },
    // 获取列表
    getPage() {
      getAppList().then(res => {
        if (res.status === 200 && res.data) {
          if (!res.data.data) {
            this.dataList.data = []
          } else {
            this.dataList = res.data.data
          }
        } else {
          console.log('应用列表获取失败')
        }
        this.loading = false
      })
    }
  },
  mounted() {
    this.getPage()
  }
}
</script>
