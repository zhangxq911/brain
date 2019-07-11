<template>
  <div>
    <div class="card-box">
      <Row style>
        <Button type="primary" @click="add('createAccount')">新增</Button>
        <div style="float: right; margin-bottom: -10px;">
          <Form ref="searchForm" :model="searchForm" inline @keydown.native.enter.prevent="searchN">
            <FormItem prop="filter">
              <Select @on-change="clearSearch" v-model="searchForm.filter" style="width: 100px;">
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
                style="width: 200px;"
                @on-search="search"
              ></Input>
            </FormItem>
            <FormItem>
              <Button @click="search">刷新</Button>
            </FormItem>
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
import { getAccountList, addAccount, delAccount } from '@/api/data'
import { parse } from 'path'
import { callbackify } from 'util'
import { loadavg } from 'os'
export default {
  data() {
    return {
      loading: false,
      searchForm: {
        accountId: '',
        sort: '',
        page: 1,
        accountName: '',
        companyName: '',
        mobile: '',
        content: ''
      },
      filterList: [
        {
          name: '账户名称',
          value: 'accountName'
        },
        {
          name: '企业名称',
          value: 'companyName'
        },
        {
          name: '手机号码',
          value: 'mobile'
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
                          id: params.row.id,
                          mode: 'view',
                          title: '账户详情'
                        }
                      })
                    }
                  }
                },
                params.row.id
              ),
              h('div', {}, params.row.accountName)
            ])
          }
        },
        {
          title: '账户类型',
          align: 'center',
          render: (h, params) => {
            let curaccountType = params.row.accountType
            switch (curaccountType) {
              case 0:
                curaccountType = '系统管理员'
                break
              case 1:
                curaccountType = '企业'
                break
              case 2:
                curaccountType = '个人'
                break
              default:
                curaccountType = ''
            }
            return h('div', curaccountType)
          }
        },
        {
          title: '状态',
          align: 'center',
          key: 'status',
          render: (h, params) => {
            let curStatus = params.row.status
            if (curStatus === 1) {
              curStatus = '正常'
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
              curStatus = '禁用'
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
          title: '企业名称',
          align: 'center',
          key: 'companyName',
          ellipsis: true
        },
        {
          title: '描述',
          align: 'center',
          key: 'description',
          ellipsis: true
        },
        {
          title: '创建时间',
          align: 'center',
          key: 'createTime',
          sortable: 'custom'
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
                        content:
                          '<p>删除账户信息会一同删除其他关联项，确定删除吗？</p>',
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
    // 处理查询条件
    clearSearch() {
      this.searchForm.accountName = null
      this.searchForm.companyName = null
      this.searchForm.mobile = null
    },
    // 清空
    reset() {
      this.$refs['searchForm'].resetFields()
      this.loading = true
      this.getPage(this.searchForm)
    },
    searchN() {},
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
        this.loading = true
        this.getPage(this.searchForm)
      }
    },
    // 编辑
    edit(curAccount) {
      this.$router.push({
        name: 'edit_account',
        params: {
          id: curAccount.id,
          mode: 'edit',
          title: '编辑账户'
        }
      })
    },
    // 删除
    delete(id) {
      delAccount(id).then(res => {
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
      this.getPage(searchForm)
    },
    // 获取账户列表
    getPage(params = {}) {
      params ? params : (params = this.searchForm)
      getAccountList(params).then(res => {
        if (res.status === 200 && res.data.data) {
          if (!res.data.data.data) {
            this.dataList.data = []
          } else {
            this.dataList = res.data.data
          }
        } else {
          console.log('账户列表获取失败')
        }
        this.loading = false
      })
    },
    // 新增
    add(param) {
      this.$router.push({
        name: 'edit_account',
        params: {
          id: '',
          mode: 'add',
          title: '新增账户'
        }
      })
    }
  },
  mounted() {
    this.getPage(this.searchForm)
  }
}
</script>

<style lang="less" scoped>
</style>
