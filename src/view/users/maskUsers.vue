<template>
  <div>
    <div class="mask" v-if="basicInfo.type === 'account'">
      <div @click="closeMask" class="mask-left" :style="{'width': (100 - basicInfo.width) + 'vw'}"></div>
      <div class="mask-content" :style="{'width': basicInfo.width + 'vw'}">
        <Row>
          <span class="mask-title">选择</span>
          <Icon class="closeBtn" type="ios-close" @click="closeMask" />
        </Row>
        <div>
          <Form :label-width="120">
            <FormItem label="开通对象">{{editForm.instName }}</FormItem>
          </Form>
          <div style="padding: 0px 60px;">
            <h5 style="margin-bottom: 6px;">选择账户</h5>
            <Input
              v-model="searchForm.accountInfo"
              search
              placeholder="请输入账户ID/名称"
              @on-search="searchAccount"
            ></Input>
          </div>
          <Table
            style="margin: 10px 60px;"
            :loading="loading"
            border
            :columns="accountColumns"
            :data="dataAccountList.data"
          ></Table>
          <Page
            v-show="dataAccountList.length != 0"
            :current.sync="dataAccountList.pageNumber"
            :page-size="dataAccountList.pageSize"
            :total="dataAccountList.totalPage"
            style="text-align: center;"
            @on-change="changeAccountPage"
          />
          <div style="padding: 20px 60px;" v-show="selectExmpArr2.length > 0">
            已选中：
            <span
              style="color: #2d8cf0;"
              v-for="(item, index) in selectExmpArr2"
              :key="item.id"
            >
              {{item.name}}
              <span class="del-select" @click="delSelect2">删除</span>
            </span>
          </div>
          <div style="padding: 20px 60px;" v-show="selectExmpArr2.length === 0">当前未选中任何实例</div>
          <div style="display: flex; justify-content: center;">
            <Button :disabled="selectExmpArr2.length === 0" type="primary" @click="saveAccount">确定</Button>
          </div>
        </div>
      </div>
    </div>
    <div class="mask" v-if="basicInfo.type === 'open'">
      <div @click="closeMask" class="mask-left" :style="{'width': (100 - basicInfo.width) + 'vw'}"></div>
      <div class="mask-content" :style="{'width': basicInfo.width + 'vw'}">
        <Row>
          <span class="mask-title">开通</span>
          <Icon class="closeBtn" type="ios-close" @click="closeMask" />
        </Row>
        <div>
          <Form :label-width="120">
            <FormItem label="开通对象">{{editForm.userName }}</FormItem>
          </Form>
          <div style="padding: 0px 60px;">
            <h5 style="margin-bottom: 6px;">选择实例</h5>
            <Input
              v-model="searchForm.instanceInfo"
              search
              placeholder="请输入实例ID/名称"
              @on-search="searchExample"
            ></Input>
          </div>
          <Table
            style="margin: 10px 60px;"
            :loading="loading"
            border
            :columns="exampleColumns"
            :data="dataExampleList.data"
          ></Table>
          <Page
            v-show="dataExampleList.length != 0"
            :current.sync="dataExampleList.pageNumber"
            :page-size="dataExampleList.pageSize"
            :total="dataExampleList.totalPage"
            style="text-align: center;"
            @on-change="changeExamplePage"
          />
          <div style="padding: 20px 60px;" v-show="selectExmpArr.length > 0">
            已选中：
            <span style="color: #2d8cf0;" v-for="(item, index) in selectExmpArr" :key="item.id">
              {{item.name}}
              <span class="del-select" @click="delSelect">删除</span>
            </span>
          </div>
          <div style="padding: 20px 60px;" v-show="selectExmpArr.length === 0">当前未选中任何实例</div>
          <div style="display: flex; justify-content: center;">
            <Button :disabled="selectExmpArr.length === 0" type="primary" @click="saveExample">确定</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAccountList, getExampleList, startUser } from '@/api/data'

export default {
  props: ['basicInfo', 'editForm'],
  data() {
    return {
      selectExmpArr2: [], // 账户
      isDisabled2: false,
      selectExmpArr: [], // 实例
      isDisabled: false,
      searchForm: {},
      loading: false,
      dataExampleList: [],
      exampleColumns: [
        {
          title: '选中',
          width: 60,
          align: 'center',
          render: (h, params) => {
            let val = false
            if (this.selectExmpArr.length > 0) {
              this.selectExmpArr.forEach(item => {
                if (item.id === params.row.id) {
                  val = true
                }
              })
            }
            return h('Checkbox', {
              props: {
                value: val,
                disabled: this.isDisabled
              },
              on: {
                'on-change': res => {
                  // 选中时填入arr数组，且查询时要先查看是否有数据
                  if (res) {
                    if (this.selectExmpArr.length > 0) {
                      this.$Message.warning('当前已选择，请清空选择后重试！')
                      val = false
                      return
                    }
                    let data = {
                      id: params.row.id,
                      name: params.row.instName
                    }
                    this.selectExmpArr.push(data)
                    this.isDisabled = true
                  } else {
                    let id = params.row.id
                    let arr = [...this.selectExmpArr]
                    this.selectExmpArr.forEach((item, index) => {
                      if (id === item.id) {
                        arr.splice(index, 1)
                      }
                    })
                    this.selectExmpArr = arr
                    this.isDisabled = false
                  }
                }
              }
            })
          }
        },
        {
          title: '实例ID/实例名称',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('div', {}, params.row.id),
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
                curinstType = '应急一张图'
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
          title: '创建时间',
          align: 'center',
          key: 'createTime'
        }
      ],
      dataAccountList: [],
      accountColumns: [
        {
          title: '选中',
          width: 60,
          align: 'center',
          render: (h, params) => {
            let val = false
            if (this.selectExmpArr2.length > 0) {
              this.selectExmpArr2.forEach(item => {
                if (item.id === params.row.id) {
                  val = true
                }
              })
            }
            return h('Checkbox', {
              props: {
                value: val,
                disabled: this.isDisabled2
              },
              on: {
                'on-change': res => {
                  // 选中时填入arr数组，且查询时要先查看是否有数据
                  if (res) {
                    if (this.selectExmpArr2.length > 0) {
                      this.$Message.warning('当前已选择，请清空选择后重试！')
                      val = false
                      return
                    }
                    let data = {
                      id: params.row.id,
                      name: params.row.accountName
                    }
                    this.selectExmpArr2.push(data)
                    this.isDisabled2 = true
                  } else {
                    let id = params.row.id
                    let arr = [...this.selectExmpArr2]
                    this.selectExmpArr2.forEach((item, index) => {
                      if (id === item.id) {
                        arr.splice(index, 1)
                      }
                    })
                    this.selectExmpArr2 = arr
                    this.isDisabled2 = false
                  }
                }
              }
            })
          }
        },
        {
          title: '账户ID/账户名称',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('div', {}, params.row.id),
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
          title: '企业名称',
          align: 'center',
          key: 'companyName',
          ellipsis: true
        },
        {
          title: '创建时间',
          align: 'center',
          key: 'createTime'
        }
      ]
    }
  },
  methods: {
    saveExample() {
      if (!this.selectExmpArr.length) {
        this.$Message.error('请选择实例后提交')
      } else {
        let data = {
          userId: this.editForm.id,
          instId: this.selectExmpArr[0].id
        }
        startUser(data).then(res => {
          if (res.data.code === 200) {
            this.$Message.success(res.data.msg)
            this.selectExmpArr = []
            this.isDisabled = false
            this.$emit('refreshExample', true)
            this.closeMask()
          } else {
            this.$Message.error(res.data.msg)
          }
        })
      }
    },
    saveAccount() {
      if (!this.selectExmpArr2.length) {
        this.$Message.error('请选择账号后提交')
      } else {
        this.$emit('sendAccount', this.selectExmpArr2)
        this.closeMask()
      }
    },
    delSelect2() {
      this.selectExmpArr2 = []
      this.isDisabled2 = false
    },
    delSelect() {
      this.selectExmpArr = []
      this.isDisabled = false
    },
    changeAccountPage(curPage) {
      let search = { ...this.searchForm }
      search.page = curPage
      this.getAccountPage(searchForm)
    },
    changeExamplePage() {
      let search = { ...this.searchForm }
      search.page = curPage
      this.getExamplePage(searchForm)
    },
    searchAccount() {
      this.loading = true
      this.getAccountPage(this.searchForm)
    },
    searchExample() {
      this.loading = true
      this.getExamplePage(this.searchForm)
    },
    closeMask() {
      if (this.searchForm.accountInfo) {
        this.searchForm.accountInfo = ''
        this.searchAccount()
      }
      this.delSelect2()
      if (this.searchForm.instanceInfo) {
        this.searchForm.instanceInfo = ''
        this.searchExample()
      }
      this.delSelect()
      this.basicInfo.type = 'normal'
      this.$emit('sendModal', this.basicInfo.type)
      // thhis.
    },
    // 获取用户信息
    getAccountPage(params = {}) {
      params ? params : (params = this.searchForm)
      getAccountList(params).then(res => {
        if (res.data.code === 200) {
          if (!res.data.data.data) {
            this.dataAccountList.data = []
          } else {
            this.dataAccountList = res.data.data
          }
        } else {
          console.log('账户列表获取失败')
        }
        this.loading = false
      })
    },
    getExamplePage(params = {}) {
      params ? params : (params = this.searchForm)
      getExampleList(params).then(res => {
        if (res.status === 200) {
          if (!res.data.data.data) {
            this.dataExampleList.data = []
          } else {
            this.dataExampleList = res.data.data
          }
        } else {
          console.log('实例列表获取失败')
        }
        this.loading = false
      })
    }
  },
  mounted() {
    this.getAccountPage()
    this.getExamplePage()
  }
}
</script>

<style scoped>
</style>
