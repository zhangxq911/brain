<template>
  <div>
    <div class="card-box">
      <Row style="padding-bottom: 10px;">
        <Button type="primary" @click="add()">新增</Button>
        <div style="float: right;">
          <Select v-model="searchForm.filter" style="width: 100px;">
            <Option
              v-for="(item, index) in filterList"
              :value="item.value"
              :key="index"
            >{{ item.name }}</Option>
          </Select>
          <Input
            search
            v-model="searchForm.content"
            placeholder="请输入搜索内容"
            style="width: 200px; margin-left: 10px;"
            @on-search="search"
          ></Input>
          <Icon @click="refresh" class="refreshBtn" type="md-refresh-circle"/>
        </div>
      </Row>
      <Table
        :loading="loading"
        border
        :columns="columns"
        :data="dataList.data"
        @on-sort-change="sortChange"
      ></Table>
      <div class="footerPage">
        <Page
          :current="dataList.pageNumber"
          :page-size="dataList.pageSize"
          :total="dataList.count"
          @on-change="changePage"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getExampleList, delExample } from '@/api/data'
import { parse } from 'path'
import { callbackify } from 'util'
import { loadavg } from 'os'
export default {
  data() {
    return {
      loading: true,
      searchForm: {
        accountId: null,
        order: null,
        page: 1,
        instName: null,
        description: null,
        instType: null,
        host: null,
        status: null
      },
      filterList: [
        {
          name: '账户ID',
          value: 'accountId'
        },
        {
          name: '实例名称',
          value: 'instName'
        },
        {
          name: '实例描述',
          value: 'description'
        },
        {
          name: '实例类型',
          value: 'instType'
        },
        {
          name: '实例连接地址',
          value: 'host'
        },
        {
          name: '实例状态',
          value: 'status'
        }
      ],
      modal: false,
      accountForm: {
        accountName: '',
        accountPsw: '',
        accoutnPsw2: '',
        accountType: '',
        companyName: '',
        description: '',
        mobile: '',
        email: ''
      },
      dataList: {},
      columns: [
        {
          title: '实例ID/实例名称',
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
                        name: 'edit_example',
                        params: {
                          id: params.row.id,
                          mode: 'view'
                        }
                      })
                    }
                  }
                },
                params.row.id
              ),
              h('div', {}, params.row.instName)
            ])
          }
        },
        {
          title: '实例类型',
          render: (h, params) => {
            let curinstType = params.row.instType
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
          title: '实例地址',
          key: 'host'
        },
        {
          title: '端口号',
          key: 'port'
        },
        {
          title: '创建时间',
          key: 'createTime',
          sortable: 'custom'
        },
        {
          title: '账户ID/账户名称',
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
                        name: 'edit_account',
                        params: {
                          id: params.row.accountId,
                          mode: 'view'
                        }
                      })
                    }
                  }
                },
                params.row.accountId
              ),
              h('div', {}, params.row.accountName)
            ])
          }
        },
        {
          title: '操作',
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
                      this.edit(params.row.id)
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
                        content: '<p>确定删除吗？</p>',
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
    // 搜索
    search() {
      if (!this.searchForm.content) {
        this.searchForm.content = null
      }
      if (this.searchForm.filter === undefined) {
        this.$Message.error('请先选择查询类型')
        return
      } else {
        this.searchForm[this.searchForm.filter] = this.searchForm.content
        this.getPage(this.searchForm)
      }
    },
    // 刷新
    refresh() {
      this.loading = true
      this.getPage(this.searchForm)
    },
    // 编辑
    edit(id) {
      this.$router.push({
        name: 'edit_example',
        params: {
          id: id,
          mode: 'edit',
          title: '编辑账户'
        }
      })
    },
    // 删除
    delete(id) {
      delExample(id).then(res => {
        if (res.data.code === 200) {
          this.$Message.success(res.data.msg)
          this.getPage()
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    // 排序
    sortChange(res) {
      let key = res.key.replace(/([A-Z])/g, '_$1').toLowerCase()
      let search = { ...this.search }
      search.sort = key + ',' + res.order
      res.order === 'normal' ? (search.sort = '') : ''
      this.getPage(search)
    },
    // 分页查询
    changePage(curPage) {
      let search = { ...this.searchForm }
      search.page = curPage
      this.loading = true
      this.getPage(search)
    },
    // 获取实例列表
    getPage(params = {}) {
      params ? params : (params = this.searchForm)
      getExampleList(params).then(res => {
        if (res.status === 200 && res.data.data.data !== '') {
          if (res.data.data.data === null) {
            return (this.dataList.data = [])
          }
          this.dataList = res.data.data
        } else {
          console.log('实例列表获取失败')
        }
        this.loading = false
      })
    },
    // 新增
    add() {
      this.$router.push({
        name: 'edit_example',
        params: {
          id: '',
          mode: 'add',
          title: '新增账户'
        }
      })
    }
  },
  mounted() {
    this.getPage()
  }
}
</script>

<style lang="less" scoped>
</style>
