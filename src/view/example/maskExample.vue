<template>
  <div>
    <div class="mask" v-if="basicInfo.type === 'example'">
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
            <h5 style="margin-bottom: 6px;">选择服务ID/服务名称</h5>
            <Input
              v-model="searchForm.serverInfo"
              search
              placeholder="请输入服务ID/服务名称"
              @on-search="searchService"
            ></Input>
          </div>
          <Table
            style="margin: 10px 60px;"
            :loading="loading"
            border
            :columns="serviceColumns"
            :data="dataServiceList.data"
          ></Table>
          <Page
            v-show="dataServiceList.length != 0"
            :current.sync="dataServiceList.pageNumber"
            :page-size="dataServiceList.pageSize"
            :total="dataServiceList.totalPage"
            style="text-align: center;"
            @on-change="changeServicePage"
          />
          <div style="padding: 20px 60px;" v-show="selectExmpArr.length > 0">
            已选中：
            <span style="color: #2d8cf0;" v-for="(item, index) in selectExmpArr" :key="item.id">
              {{item.name}}
              <span class="del-select" @click="delSelect">删除</span>
            </span>
          </div>
          <div style="padding: 20px 60px;" v-show="selectExmpArr.length === 0">当前未选中任何服务</div>
          <div style="display: flex; justify-content: center;">
            <Button type="primary" @click="saveService">确定</Button>
          </div>
        </div>
      </div>
    </div>
    <div class="mask" v-if="basicInfo.type === 'account'">
      <div @click="closeMask" class="mask-left" :style="{'width': (100 - basicInfo.width) + 'vw'}"></div>
      <div class="mask-content" :style="{'width': basicInfo.width + 'vw'}">
        <Row>
          <span class="mask-title">开通</span>
          <Icon class="closeBtn" type="ios-close" @click="closeMask" />
        </Row>
        <div>
          <Form :label-width="120">
            <FormItem label="开通对象">{{editForm.instName}}</FormItem>
            <!-- <FormItem label="选择实例"></FormItem> -->
          </Form>
          <div style="padding: 0px 60px;">
            <h5 style="margin-bottom: 6px;">选择账户</h5>
            <Input v-model="searchForm.accountInfo" @on-search="searchAccount" search placeholder="请输入账户ID/账户名称"></Input>
          </div>
          <Table
            border
            :columns="accountColumns"
            :data="dataAccountList.data"
            style="margin: 10px 60px;"
          ></Table>
          <Page
            v-show="dataAccountList.length != 0"
            :current.sync="dataAccountList.pageNumber"
            :page-size="dataAccountList.pageSize"
            :total="dataAccountList.totalPage"
            style="text-align: center;"
          />
          <div style="padding: 20px 60px;" v-show="selectExmpArr2.length > 0">
            已选中：
            <span style="color: #2d8cf0;" v-for="(item, index) in selectExmpArr2" :key="item.id">
              {{item.name}}
              <span class="del-select" @click="delSelect2">删除</span>
            </span>
          </div>
          <div style="padding: 20px 60px;" v-show="selectExmpArr2.length === 0">当前未选中任何服务</div>
          <div style="display: flex; justify-content: center;">
            <Button type="primary" @click="saveAccount">确定</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getServiceList, getAccountList } from '@/api/data'

export default {
  props: ['basicInfo', 'editForm'],
  data() {
    return {
      selectExmpArr: [], // 选中的服务
      selectExmpArr2: [], // 选中的账户
      isDisabled: false,
      isDisabled2: false,
      loading: false,
      searchForm: {
        page: 1
      },
      dataServiceList: [],
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
                      name: params.row.accountName,
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
      ],
      serviceColumns: [
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
                      name: params.row.serverName,
                      serverHost: params.row.serverHost,
                      serverPort: params.row.serverPort,
                      gpsHost: params.row.gpsHost ? params.row.gpsHost : '',
                      gpsPort: params.row.gpsPort ? params.row.gpsPort : ''
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
          title: '服务地址',
          key: 'serverHost',
          align: 'center'
        },
        {
          title: '创建时间',
          align: 'center',
          key: 'createTime'
          // sortable: 'custom'
        },
        {
          title: '可用/用户容量',
          align: 'center',
          render: (h, params) => {
            let val =
              params.row.residualCapacity + '/' + params.row.totalCapacity
            return h('div', val)
          }
        }
      ]
    }
  },
  methods: {
    // 确定提交账户
    saveAccount() {
      if (!this.selectExmpArr2.length) {
        this.$Message.error('请选择账户后提交')
      } else {
        this.$emit('sendAccount', this.selectExmpArr2)
        this.closeMask()
      }
    },
    // 确定提交服务
    saveService() {
      if (!this.selectExmpArr.length) {
        this.$Message.error('请选择服务后提交')
      } else {
        this.$emit('sendServer', this.selectExmpArr)
        this.closeMask()
      }
    },
    // 清空选择内容
    delSelect() {
      this.selectExmpArr = []
      this.isDisabled = false
    },
    delSelect2() {
      this.selectExmpArr2 = []
      this.isDisabled2 = false
    },
    // 账户分页
    changeServicePage(curPage) {
      let search = { ...this.searchForm }
      search.page = curPage
      this.getAccountPage(searchForm)
    },
    // 服务分页
    changeServicePage(curPage) {
      let search = { ...this.searchForm }
      search.page = curPage
      this.getServicePage(searchForm)
    },
    // 账户查询
    searchAccount() {
      console.log(this.searchForm)
      this.loading = true
      this.getAccountPage(this.searchForm)
    },
    // 服务查询
    searchService() {
      this.loading = true
      this.getServicePage(this.searchForm)
    },
    closeMask() {
      this.basicInfo.type = 'normal'
      this.$emit('sendModal', this.basicInfo.type)
    },
    getServicePage(params = { page: 1 }) {
      params ? params : (params = this.searchForm)
      getServiceList(params).then(res => {
        if (res.data.code === 200 && res.data.data) {
          if (!res.data.data.data) {
            this.dataServiceList.data = []
          } else {
            this.dataServiceList = res.data.data
          }
        } else {
          console.log('服务列表获取失败')
        }
        this.loading = false
      })
    },
    // 获取账户列表
    getAccountPage(params = {}) {
      params ? params : (params = this.searchForm)
      getAccountList(params).then(res => {
        if (res.status === 200 && res.data.data) {
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
    }
  },
  mounted() {
    this.getServicePage()
    this.getAccountPage()
  }
}
</script>
