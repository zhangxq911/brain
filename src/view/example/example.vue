<template>
  <div>
    <div class="card-box">
      <Row style>
        <Button v-if="defAccount === 'super_admin'" type="primary" @click="add()">新增</Button>
        <div style="float: right; margin-bottom: -10px;">
          <Form ref="searchForm" :model="searchForm" inline @keydown.native.enter.prevent="searchN">
            <FormItem prop="status">
              <Select
                @on-change="search"
                v-model="searchForm.status"
                style="width: 100px;"
                placeholder="实例状态"
              >
                <Option :value="0">停止</Option>
                <Option :value="1">运行</Option>
              </Select>
            </FormItem>
            <FormItem prop="instType">
              <Select
                @on-change="search"
                v-model="searchForm.instType"
                style="width: 100px; "
                placeholder="实例类型"
              >
                <Option value="call">远程会议</Option>
                <Option value="gis">联情指挥</Option>
                <Option value="live">网络直播</Option>
              </Select>
            </FormItem>
            <FormItem prop="filter">
              <Select
                @on-change="clearSearch"
                v-model="searchForm.filter"
                style="width: 100px; "
                placeholder="其他条件"
              >
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
            <!-- <FormItem>
              <Button type="primary" @click="search">查询</Button>
            </FormItem>-->
            <FormItem>
              <Button @click="search">刷新</Button>
            </FormItem>
            <!-- <FormItem></FormItem> -->
          </Form>
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
import { getExampleList, delExample, operateExample } from '@/api/data'
import { parse } from 'path'
import { callbackify } from 'util'
import { loadavg } from 'os'
import { parseTime } from '@/libs/tools'

export default {
  data() {
    return {
      defAccount: '',
      loading: false,
      searchForm: {
        accountId: null,
        order: null,
        page: 1,
        instName: null,
        description: null,
        instType: null,
        serverHost: null,
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
          name: '实例连接地址',
          value: 'serverHost'
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
                        name: 'edit_example',
                        params: {
                          id: params.row.id,
                          // aId: params.row.accountId,
                          mode: 'view',
                          title: '实例详情'
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
          align: 'center',
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
          title: '实例地址',
          key: 'serverHost',
          align: 'center'
        },
        {
          title: '端口号',
          align: 'center',
          key: 'serverPort'
        },
        {
          title: '创建时间',
          align: 'center',
          key: 'createTime'
        },
        {
          title: '到期时间',
          align: 'center',
          key: 'expirationTime'
        },
        {
          title: '账户ID/账户名称',
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
                        name: 'edit_account',
                        params: {
                          id: params.row.accountId,
                          mode: 'view',
                          title: '账户详情',
                          to: 'example_page'
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
          align: 'center',
          width: 130,
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
                      this.$router.push({
                        name: 'edit_example',
                        params: {
                          id: params.row.id,
                          mode: 'edit',
                          title: '实例编辑'
                        }
                      })
                    }
                  }
                },
                '管理'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small',
                    disabled:
                      parseTime(new Date(), '{y}-{m}-{d}') >
                      params.row.expirationTime
                        ? false
                        : true
                  },
                  on: {
                    click: () => {
                      this.delete(params.row.id)
                    }
                  }
                },
                '释放'
              )
            ])
          }
        }
      ]
    }
  },
  created() {
    let access = this.$store.state.user.access
    if (access.includes('super_admin')) {
      this.defAccount = 'super_admin'
    } else if (access.includes('company') || access.includes('personal')) {
      this.defAccount = 'unit'
      this.columns.splice(7, 1)
    }
  },
  methods: {
    // 空方法，阻止表单刷新
    searchN() {},
    // 处理查询条件
    clearSearch() {
      this.searchForm.accountId = null
      this.searchForm.description = null
      this.searchForm.serverHost = null
      this.searchForm.instName = null
    },
    // 清空
    reset() {
      this.$refs['searchForm'].resetFields()
      this.loading = true
      this.getPage(this.searchForm)
    },
    // 搜索
    search() {
      if (!this.searchForm.content) {
        this.searchForm.content = null
      }
      if (this.searchForm.filter === undefined && this.searchForm.content) {
        this.$Message.error('请先选择查询类型')
        return
      } else {
        this.searchForm[this.searchForm.filter] = this.searchForm.content
        this.loading = true
        this.getPage(this.searchForm)
      }
    },
    // 编辑
    edit(id) {
      this.$router.push({
        name: 'edit_example',
        params: {
          id: id,
          mode: 'edit',
          title: '编辑实例'
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
      search.order = 'i.' + key + ',' + res.order
      res.order === 'normal' ? (search.order = '') : ''
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
        if (res.status === 200 && res.data) {
          if (res.data.data.data === null) {
            this.dataList.data = []
          } else {
            this.dataList = res.data.data
          }
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
          title: '新增实例'
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
