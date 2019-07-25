<template>
  <div>
    <div class="card-box">
      <Row style>
        <Button type="primary" @click="add()">新增</Button>
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
                style="width: 200px; margin-left: 10px;"
                @on-search="search"
              ></Input>
            </FormItem>
            <FormItem>
              <Button @click="refresh">刷新</Button>
              <!-- <Icon @click="refresh" class="refreshBtn" type="md-refresh-circle"/> -->
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
        <span
          class="pageMsg"
        >当前 {{dataList.data ? dataList.data.length : 0}} 条记录，共 {{dataList.count}} 条记录。</span>
        <Page
          :current="dataList.pageNumber"
          :page-size="dataList.pageSize"
          :total="dataList.count"
          @on-change="changePage"
        />
      </div>
    </div>
    <MaskUsers
      @refreshExample="refresh"
      @sendModal="getModal"
      :basicInfo="basicInfo"
      :editForm="openForm"
    ></MaskUsers>
  </div>
</template>

<script>
import { delUser, getUserList } from '@/api/data'
import { parse } from 'path'
import { callbackify } from 'util'
import { loadavg } from 'os'
import MaskUsers from './maskUsers'

export default {
  components: { MaskUsers },
  data() {
    return {
      loading: false,
      openForm: {},
      basicInfo: {},
      searchForm: {
        page: 1,
        description: '',
        userName: '',
        nickName: '',
        filter: 'userName'
      },
      filterList: [
        {
          name: '用户名称',
          value: 'userName'
        },
        {
          name: '昵称',
          value: 'nickName'
        },
        {
          name: '描述',
          value: 'description'
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
          title: '用户ID/用户名称',
          align: 'center',
          width: 130,
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
                        name: 'edit_users',
                        params: {
                          id: params.row.id,
                          mode: 'view',
                          title: '用户详情'
                        }
                      })
                    }
                  }
                },
                params.row.id
              ),
              h('div', params.row.userName)
            ])
          }
        },
        {
          title: '昵称',
          align: 'center',
          sortable: 'custom',
          key: 'nickName'
        },
        {
          title: '会议角色',
          align: 'center',
          sortable: 'custom',
          key: 'userType',
          width: 120,
          render: (h, params) => {
            let userType = params.row.userType
            switch (userType) {
              case 0:
                userType = '参会者'
                break
              case 1:
                userType = '主持人'
                break
            }
            return h('div', userType)
          }
        },
        {
          title: '状态',
          key: 'status',
          sortable: 'custom',
          align: 'center',
          width: 100,
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
          title: '已开通实例',
          align: 'center',
          sortable: 'custom',
          width: 130,
          key: 'instanceTypeNames'
        },
        {
          title: '创建时间',
          align: 'center',
          sortable: 'custom',
          key: 'createTime'
          // sortable: 'custom'
        },
        {
          title: '账户ID/账户名称',
          align: 'center',
          width: 130,
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
                          to: 'users_page'
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
          width: 190,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'success',
                    size: 'small'
                  },
                  style: {
                    margin: '4px'
                  },
                  on: {
                    click: () => {
                      this.openForm.id = params.row.id
                      this.openForm.userName = params.row.userName
                      this.showMask('open', 50)
                    }
                  }
                },
                '开通'
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
                        content: `<p>确定删除 ${params.row.userName} 用户吗？</p>`,
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
  created() {
    let access = this.$store.state.user.access
    if (access.includes('super_admin')) {
      this.defAccount = 'super_admin'
    } else if (access.includes('company') || access.includes('personal')) {
      this.defAccount = 'unit'
      this.columns.splice(6, 1)
    }
  },
  methods: {
    getModal(data) {
      this.basicInfo.type = data
    },
    showMask(type, width) {
      this.basicInfo = {
        type: type,
        width: width
      }
    },
    // 空方法，阻止表单刷新
    searchN() {},
    // 处理查询条件
    clearSearch() {
      this.searchForm.userName = null
      this.searchForm.nickName = null
      this.searchForm.description = null
    },
    // 清空
    reset() {
      this.$refs['searchForm'].resetFields()
      this.loading = true
      this.getPage(this.searchForm)
    },
    // 搜索
    search() {
      this.searchForm.page = 1
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
    // 刷新
    refresh() {
      this.searchForm.content = ''
      this.search()
    },
    // 编辑
    edit(id) {
      this.$router.push({
        name: 'edit_users',
        params: {
          id: id,
          mode: 'edit',
          title: '编辑用户'
        }
      })
    },
    // 删除
    delete(id) {
      delUser(id).then(res => {
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
      // let key = res.key.replace(/([A-Z])/g, '_$1').toLowerCase()
      let search = { ...this.searchForm }
      search.sort = res.key + ',' + res.order
      res.order === 'normal' ? (search.sort = '') : ''
      this.loading = true
      this.getPage(search)
    },
    // 分页查询
    changePage(curPage) {
      let search = { ...this.searchForm }
      search.page = curPage
      this.loading = true
      this.getPage(search)
    },
    // 获取列表
    getPage(params = {}) {
      params ? params : (params = this.searchForm)
      getUserList(params).then(res => {
        if (res.status === 200 && res.data) {
          if (!res.data.data.data) {
            this.dataList = res.data.data
            this.dataList.data = []
          } else {
            this.dataList = res.data.data
          }
        } else {
          console.log('用户列表获取失败')
        }
        this.loading = false
      })
    },
    // 新增
    add() {
      this.$router.push({
        name: 'edit_users',
        params: {
          id: '',
          mode: 'add',
          title: '新增用户'
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
