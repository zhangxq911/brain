<template>
  <div class="mask" v-show="modal">
    <div @click="closeMask" class="mask-left" :style="{'width': (100 - width) + 'vw'}"></div>
    <div class="mask-content" :style="{'width': width + 'vw'}">
      <Row>
        <span class="mask-title">开通</span>
        <Icon class="closeBtn" type="ios-close" @click="closeMask" />
      </Row>
      <div>
        <Form :label-width="120">
          <FormItem label="开通对象">{{editForm.id }} / {{editForm.userName }}</FormItem>
          <!-- <FormItem label="选择实例"></FormItem> -->
        </Form>
        <div style="padding: 0px 60px;">
          <h5 style="margin-bottom: 6px;">选择实例</h5>
          <Input
            v-model="searchForm.instanceInfo"
            search
            placeholder="请输入实例ID/实例名称"
            @on-search="search"
          ></Input>
        </div>
        <Table border :columns="columns" :data="dataList.data" style="margin: 10px 60px;"></Table>
        <Page
          v-show="dataList.length != 0"
          :current.sync="dataList.pageNumber"
          :page-size="dataList.pageSize"
          :total="dataList.totalPage"
          style="text-align: center;"
          @on-change="changePage"
        />
        <div style="padding: 20px 60px;" v-show="selectExmpArr.length > 0">
          已选中：
          <span style="color: #2d8cf0;" v-for="(item, index) in selectExmpArr" :key="item.id">
            {{item.name}}
            <span class="del-select" @click="delSelect">删除</span>
          </span>
        </div>
        <div style="padding: 20px 60px;" v-show="selectExmpArr.length === 0">当前未选中任何实例</div>
        <Row>
          <Col span="18">
            <Form
              ref="rulesValidate"
              :model="addForm"
              :label-width="120"
              style="min-width: 500px;"
              :rules="rulesValidate"
            >
              <FormItem label="登录名称" prop="username">
                <Input v-model="addForm.username"></Input>
              </FormItem>
              <FormItem label="登录密码" prop="password">
                <Input v-model="addForm.password"></Input>
              </FormItem>
              <Divider dashed />
              <Button type="default" @click="open">开通</Button>
            </Form>
          </Col>
        </Row>
      </div>
    </div>
  </div>
</template>

<script>
import { getExampleList, startUser } from '@/api/data'

export default {
  props: ['exampleModal', 'editForm', 'width'],
  data() {
    return {
      isDisabled: false,
      modal: this.exampleModal,
      dataList: {},
      selectExmpArr: [],
      searchForm: {
        page: 1
      },
      addForm: {},
      rulesValidate: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      columns: [
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
          title: '创建时间',
          align: 'center',
          key: 'createTime'
          // sortable: 'custom'
        }
      ]
    }
  },
  watch: {
    exampleModal(newName, oldName) {
      this.modal = this.exampleModal
    }
  },
  methods: {
    // 开通
    open() {
      this.addForm.instId = this.selectExmpArr[0].id
      this.addForm.userId = this.editForm.id
      startUser(this.addForm).then(res => {
        if (res.data.code === 200) {
          this.$Message.success(res.data.msg)
          this.closeMask()
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    // 删除当前选中实例
    delSelect() {
      this.selectExmpArr = []
      this.isDisabled = false
    },
    changePage(curPage) {
      let search = { ...this.searchForm }
      search.page = curPage
      this.getPage(search)
    },
    // 搜索
    search() {
      this.getPage(this.searchForm)
    },
    // 关闭mask通信父组件
    closeMask() {
      this.modal = false
      this.selectExmpArr = []
      this.$emit('sendModal', false)
    },
    // 获取实例列表
    getPage(params = {}) {
      params ? params : (params = this.searchForm)
      getExampleList(params).then(res => {
        if (res.status === 200) {
          if (!res.data.data) {
            this.dataList.data = []
          } else {
            this.dataList = res.data.data
          }
        } else {
          console.log('实例列表获取失败')
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

<style scoped>
</style>
