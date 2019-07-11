<template>
  <div class="card-box">
    <Row>
      <Button type="primary" @click="add">新增</Button>
      <div style="float: right; margin-bottom: -10px;">
        <Form ref="searchForm" :model="searchForm" inline>
          <FormItem>
            <Select
              @on-change="search"
              v-model="searchForm.status"
              style="width: 100px;"
              placeholder="服务状态"
            >
              <Option :value="0">已停止</Option>
              <Option :value="1">运行中</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Select
              @on-change="search"
              v-model="searchForm.serverType"
              style="width: 100px; "
              placeholder="服务类型"
            >
              <Option value="call">远程会议</Option>
              <Option value="gis">联情指挥</Option>
              <Option value="live">网络直播</Option>
            </Select>
          </FormItem>
          <FormItem prop="filter">
            <Select v-model="searchForm.filter" style="width: 100px; " placeholder="其他条件">
              <Option
                v-for="(item, index) in filterList"
                :value="item.value"
                :key="index"
              >{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem prop="content">
            <Input
              search
              v-model="searchForm.content"
              placeholder="请输入搜索内容"
              style="width: 200px; "
              @on-search="search"
            ></Input>
          </FormItem>
          <FormItem>
            <Button @click="search">刷新</Button>
          </FormItem>
        </Form>
      </div>
    </Row>
    <Table :loading="loading" border :columns="columns" :data="dataList.data"></Table>
    <div class="footerPage">
      <Page
        :current="dataList.pageNumber"
        :page-size="dataList.pageSize"
        :total="dataList.count"
        @on-change="changePage"
      />
    </div>
  </div>
</template>

<script>
import { getServiceList, delService, operateService } from '@/api/data'

export default {
  data() {
    return {
      btnStatus: '上线',
      loading: false,
      dataList: [],
      searchForm: {},
      filterList: [
        {
          name: 'name',
          value: 'val'
        }
      ],
      columns: [
        {
          title: '服务ID/服务名称',
          align: 'center',
          render: (h, params) => {
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
                        name: 'edit_service',
                        params: {
                          id: params.row.id,
                          mode: 'view',
                          title: '服务详情'
                        }
                      })
                    }
                  }
                },
                params.row.id
              ),
              h('div', {}, params.row.serverName)
            ])
          }
        },
        {
          title: '服务类型',
          align: 'center',
          render: (h, params) => {
            let curinstType = params.row.serverType
            switch (curinstType) {
              case 'call':
                curinstType = '远程会议'
                break
              case 'gis':
                curinstType = '联情指挥'
                break
              case 'live':
                curinstType = '网络直播'
                break
              default:
                curinstType = ''
            }
            return h('div', curinstType)
          }
        },
        {
          title: '状态',
          key: 'status',
          align: 'center',
          render: (h, params) => {
            let curStatus = params.row.status
            if (curStatus === 1) {
              curStatus = '运行中'
              return h(
                'div',
                {
                  style: {
                    color: '#19be6b'
                  }
                },
                curStatus
              )
            } else if (curStatus === 0) {
              curStatus = '已停止'
              return h(
                'div',
                {
                  style: {
                    color: '#ed4014'
                  }
                },
                curStatus
              )
            } else {
              curStatus = ''
              return h('div', curStatus)
            }
          }
        },
        {
          title: '服务地址',
          key: 'serverHost',
          align: 'center'
        },
        {
          title: '端口号',
          key: 'serverPort',
          align: 'center'
        },
        {
          title: '创建时间',
          align: 'center',
          key: 'createTime'
        },
        {
          title: '可用/用户容量',
          align: 'center',
          render: (h, params) => {
            let val =
              params.row.residualCapacity + '/' + params.row.totalCapacity
            return h('div', val)
          }
        },
        {
          title: '操作',
          width: 180,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: params.row.status ? 'warning' : 'success',
                    size: 'small'
                  },
                  style: {
                    margin: '4px'
                  },
                  on: {
                    click: () => {
                      let data = {
                        serverId: params.row.id
                      }
                      if (params.row.status) {
                        // 当前上线状态
                        data.serverStatus = 0
                        this.operate(data)
                      } else {
                        // 当前下线状态
                        data.serverStatus = 1
                        this.operate(data)
                      }
                    }
                  }
                },
                params.row.status ? '下线' : '上线'
              ),
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
                      this.$router.push({
                        name: 'edit_service',
                        params: {
                          id: params.row.id,
                          mode: 'edit',
                          title: '服务编辑'
                        }
                      })
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
                  on: {
                    click: () => {
                      this.remove(params.row.id)
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
    // 上下线
    operate(data) {
      operateService(data).then(res => {
        if (res.data.code === 200) {
          this.$Message.success(res.data.msg)
          this.getPage()
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    // 删除
    remove(id) {
      delService(id).then(res => {
        if (res.data.code === 200) {
          this.$Message.success(res.data.msg)
          this.loading = true
          this.getPage()
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    // 分页查询
    changePage(curPage) {
      let search = { ...this.searchForm }
      search.page = curPage
      this.loading = true
      this.getPage(search)
    },
    // 新增
    add() {
      this.$router.push({
        name: 'edit_service',
        params: {
          id: '',
          mode: 'add',
          title: '新增服务'
        }
      })
    },
    // 触发查询
    search() {
      if (!this.searchForm.content) {
        this.searchForm.content = null
      }
      if (!this.searchForm.filter && this.searchForm.content) {
        this.$Message.error('请先选择查询类型')
        return
      } else {
        this.searchForm[this.searchForm.filter] = this.searchForm.content
        this.loading = true
        this.getPage(this.searchForm)
      }
    },
    // 获取列表
    getPage(params = { page: 1 }) {
      params ? params : (params = this.searchForm)
      getServiceList(params).then(res => {
        if (res.data.code === 200 && res.data.data) {
          if (!res.data.data.data) {
            this.dataList.data = []
          } else {
            this.dataList = res.data.data
          }
        } else {
          console.log('服务列表获取失败')
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
