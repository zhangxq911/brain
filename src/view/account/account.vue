<template>
  <div>
    <div class="card-box">
      <Row style="padding-bottom: 10px;">
        <Button type="primary" @click="add('createAccount')">新增</Button>
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
        <Page :page-size="dataList.pageSize" :total="dataList.totalPage" :on-change="changePage"/>
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
      loading: true,
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
          title: '用户ID/账户名称',
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
                          mode: 'view'
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
              curStatus = '停用'
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
          key: 'companyName'
        },
        {
          title: '描述',
          key: 'description'
        },
        {
          title: '创建时间',
          key: 'createTime',
          sortable: 'custom'
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
      params ? params : this.searchForm
      getAccountList(params).then(res => {
        if (res.status === 200 && res.data.data.data !== '') {
          this.dataList = res.data.data
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
    this.getPage()
  }
}
</script>

<style lang="less" scoped>
</style>
