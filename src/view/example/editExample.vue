<template>
  <div class="card-box">
    <h3 class="detailTitle" v-show="curMode !== 'view'">基本信息</h3>
    <Row>
      <!-- 查看 -->
      <Col span="24" v-show="curMode === 'view'">
        <Tabs value="name1" @on-click="getOrg">
          <TabPane label="基本信息" name="name1">
            <Row>
              <Col span="12">
                <Form :label-width="120" style="min-width: 500px;">
                  <FormItem label="实例名称">
                    {{editForm.instName }}
                    <a
                      class="editBtn"
                      href="javascript:void(0)"
                      @click="curMode = 'edit'"
                      v-show="curMode === 'view'"
                    >
                      编辑
                      <Icon type="md-create" />
                    </a>
                  </FormItem>
                  <FormItem label="实例描述">
                    {{editForm.description }}
                    <a
                      class="editBtn"
                      href="javascript:void(0)"
                      @click="curMode = 'edit'"
                      v-show="curMode === 'view' && editForm.description"
                    >
                      编辑
                      <Icon type="md-create" />
                    </a>
                  </FormItem>
                  <FormItem label="实例类型">{{remoteType }}</FormItem>
                  <FormItem label="实例容量">
                    {{editForm.capacity }}
                    <a
                      class="editBtn"
                      href="javascript:void(0)"
                      @click="curMode = 'edit'"
                      v-show="curMode === 'view'"
                    >
                      编辑
                      <Icon type="md-create" />
                    </a>
                  </FormItem>
                  <FormItem label="实例">
                    <Input :rows="7" readonly type="textarea" :value="this.serverContent2"></Input>
                  </FormItem>
                  <Divider dashed />
                  <FormItem label="账户名称">{{editForm.accountName }}</FormItem>
                </Form>
              </Col>
            </Row>
          </TabPane>
          <TabPane label="组织机构" name="name2">
            <Row>
              <Button type="primary" @click="showMask('addOrg', 30)">添加部门</Button>
              <Button type="primary" style="margin-left: 10px;">添加人员</Button>
              <div style="float: right; margin-bottom: -10px;">
                <Form inline>
                  <FormItem>
                    <Select style="width: 100px;">
                      <Option value="1">option1</Option>
                    </Select>
                  </FormItem>
                  <FormItem>
                    <Select style="width: 100px;">
                      <Option value="2">option2</Option>
                    </Select>
                  </FormItem>
                  <FormItem>
                    <Input search placeholder="请输入搜索内容" style="width: 200px;"></Input>
                  </FormItem>
                  <FormItem>
                    <Button type="default">同步</Button>
                  </FormItem>
                </Form>
              </div>
            </Row>
            <div style="display: flex; height: 100%;">
              <div style="width: 200px; background: #F1F3F6; padding: 0 10px;">
                <!-- 左侧组织树 -->
                <Tree :data="orgList" :render="renderContent"></Tree>
              </div>
              <div style="flex: 1;">
                <Table
                  border
                  ref="selection"
                  :columns="orgColumns"
                  :data="orgData.data[0].pocUserList"
                ></Table>
                <div>
                  <Button style="margin: 10px;" type="error">删除用户</Button>
                  <Button style="margin: 10px;" type="primary">添加至工作组</Button>
                </div>
                <div style="text-align: center;">
                  <Page
                    :current="orgData.pageNumber"
                    :page-size="orgData.pageSize"
                    :total="orgData.count"
                    @on-change="changeOrgPage"
                  />
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane label="工作组" name="name3">
            <Row>
              <Button type="primary">添加</Button>
              <div style="float: right; margin-bottom: -10px;">
                <Form inline>
                  <FormItem>
                    <Select style="width: 100px;">
                      <Option value="1">option1</Option>
                    </Select>
                  </FormItem>
                  <FormItem>
                    <Select style="width: 100px;">
                      <Option value="2">option2</Option>
                    </Select>
                  </FormItem>
                  <FormItem>
                    <Input search placeholder="请输入搜索内容" style="width: 200px;"></Input>
                  </FormItem>
                  <FormItem>
                    <Button type="default">同步</Button>
                  </FormItem>
                </Form>
              </div>
            </Row>
            <div style="display: flex; height: 100%;">
              <div style="width: 200px; background: #F1F3F6; padding: 0 10px;">
                <!-- 左侧组织树 -->
                <!-- <Tree :data="orgList" :render="renderContent"></Tree> -->
              </div>
              <div style="flex: 1;">
                <!-- <Table
                  border
                  ref="selection"
                  :columns="orgColumns"
                  :data="orgData.data[0].pocUserList"
                ></Table>-->
                <div>
                  <Button style="margin: 10px;" type="error">删除用户</Button>
                </div>
                <div style="text-align: center;">
                  <!-- <Page
                    :current="orgData.pageNumber"
                    :page-size="orgData.pageSize"
                    :total="orgData.count"
                    @on-change="changeOrgPage"
                  />-->
                </div>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </Col>
      <!-- 新增 -->
      <Form
        ref="addForm"
        :model="addForm"
        :rules="rulesValidate"
        :label-width="120"
        style="min-width: 500px;"
        v-if="curMode === 'add'"
      >
        <Col span="12">
          <FormItem prop="instName" label="实例名称">
            <Input type="text" v-model="addForm.instName" placeholder="请输入实例名称"></Input>
          </FormItem>
          <FormItem label="实例描述">
            <Input :rows="7" type="textarea" v-model="addForm.description" placeholder="请输入实例描述"></Input>
          </FormItem>
          <FormItem prop="instType" label="实例类型">
            <Select v-model="addForm.instType" @on-change="ifShowGps">
              <Option value="call">远程会议</Option>
              <Option value="gis">联情指挥</Option>
              <Option value="live">网络直播</Option>
            </Select>
          </FormItem>
          <FormItem prop="capacity" label="实例容量">
            <InputNumber style="width: 100%;" :min="1" v-model="addForm.capacity"></InputNumber>
          </FormItem>
          <FormItem prop="serverId" label="实例">
            <Input v-show="false" :value="addForm.serverId"></Input>
            <Input
              readonly
              :rows="7"
              type="textarea"
              placeholder="请选择实例"
              :value="serverContent"
              @on-focus="showMask('example', 50)"
            ></Input>
            <Button @click="showMask('example', 50)" class="select-btn">· · ·</Button>
          </FormItem>
          <div v-if="defAccount === 'super_admin'">
            <Divider dashed />
            <FormItem prop="accountName" style="position: relative;" label="账户名称">
              <Input v-show="false" :value="addForm.accountName"></Input>
              <Input
                readonly
                :value="accountContent"
                placeholder="请选择账户"
                @on-focus="showMask('account', 50)"
              ></Input>
              <Button @click="showMask('account', 50)" class="select-btn">· · ·</Button>
            </FormItem>
          </div>
          <FormItem>
            <Button type="primary" @click="save">保存</Button>
          </FormItem>
        </Col>
      </Form>
      <!-- 编辑 -->
      <Col span="12" v-if="curMode === 'edit'">
        <Form
          ref="editForm"
          :model="editForm"
          :rules="rulesValidate2"
          :label-width="120"
          style="min-width: 500px;"
        >
          <FormItem prop="instName" label="实例名称">
            <Input type="text" v-model="editForm.instName" placeholder="请输入实例名称"></Input>
          </FormItem>
          <FormItem label="实例描述">
            <Input :rows="7" type="textarea" v-model="editForm.description" placeholder="请输入实例描述"></Input>
          </FormItem>
          <FormItem label="实例类型">
            <Input readonly :value="remoteType"></Input>
          </FormItem>
          <FormItem prop="capacity" label="实例容量">
            <InputNumber style="width: 100%;" :min="1" v-model="editForm.capacity"></InputNumber>
          </FormItem>
          <FormItem label="实例">
            <Input readonly :rows="7" type="textarea" :value="serverContent2"></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="update">保存</Button>
          </FormItem>
        </Form>
      </Col>
    </Row>
    <MaskUsers
      @sendModal="getModal"
      @sendAccount="getAccount"
      @sendServer="getServer"
      :editForm="openForm"
      :basicInfo="basicInfo"
    ></MaskUsers>
  </div>
</template>

<script>
import {
  getExampleInfo,
  getIdentityCode,
  putExample,
  addExample,
  getAccountList,
  getOrgList,
  getOrgDatas,
  getGroupList,
  getGroupData
} from '@/api/data'
import { defaultCoreCipherList } from 'constants'
import MaskUsers from './maskExample'

export default {
  props: ['id', 'mode'],
  components: { MaskUsers },
  data() {
    const validateName = (rule, value, callback) => {
      const reg = /^[\u4e00-\u9fa5a-zA-Z]+$/
      if (value === undefined || value === '') {
        callback(new Error('请输入实例名称'))
      } else if (!reg.test(value) || value.length < 2 || value.length > 32) {
        callback(new Error('长度为 2~32 个英文或中文字符'))
      } else {
        callback() // 不管结果如何都要返回一个值，不然就一直校验中，无法提交了。
      }
    }

    const validatePwd = (rule, value, callback) => {
      const reg = /^[a-zA-Z][a-zA-Z0-9_]*$/
      if (value === '') {
        callback(new Error('这是必填字段'))
      } else if (!reg.test(value) || value.length < 6 || value.length > 16) {
        callback(new Error('字母开头,长度在6-16之间的字符,数字和下划线'))
      } else {
        callback()
      }
    }

    const validatePass2 = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('密码确认不能为空'))
      } else if (
        value === this.addForm.accountPsw ||
        value === this.editForm.accountPsw
      ) {
        callback()
      } else {
        callback(new Error('两次输入密码不一致!'))
      }
    }

    const validateMobile = (rule, value, callback) => {
      const reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/
      if (value === undefined || value === '') {
        callback(new Error('请输入手机号码'))
      } else if (!reg.test(value)) {
        callback(new Error('手机号格式不正确'))
      } else {
        callback()
      }
    }

    const validateType = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('请选择实例类型'))
      } else {
        callback()
      }
    }

    const validateCode = (rule, value, callback) => {
      if (this.editForm.mobile === null) {
        callback(new Error('请先填写手机号'))
      } else {
        callback()
      }
    }

    const validatePort = (rule, value, callback) => {
      if (this.editForm.port === null || this.editForm.port === '') {
        callback(new Error('请输入实例端口号'))
      } else {
        callback()
      }
    }

    return {
      orgColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '人员ID/人员名称',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('div', params.row.uid),
              h('div', params.row.name)
            ])
          }
        },
        {
          title: '人员号码',
          align: 'center',
          key: 'tel'
        },
        {
          title: '手机号码',
          align: 'center',
          key: 'phone'
        },
        {
          title: '人员职称',
          key: 'position'
        },
        {
          title: '状态',
          key: 'status',
          render: (h, params) => {
            let curStatus = ''
            switch (params.row.status) {
              case 'logout':
                curStatus = '登出'
                break
              case 'login':
                curStatus = '登录'
                break
              default:
                break
            }
            return h('div', curStatus)
          }
        },
        {
          title: '操作',
          render: (h, params) => {
            return h('div', '操作')
          }
        }
      ],
      orgData: { data: [{ pocUserList: [] }] },
      orgList: [],
      activeId: '',
      searchForm: {
        instanceId: this.id,
        page: 1
      },
      serverContent2: '', // 详情、编辑实例内容
      accountContent: '',
      serverContent: '',
      openForm: {},
      exampleModal: false,
      basicInfo: {},
      showGps: false,
      modalAccount: false,
      defAccount: '',
      editForm: {},
      addForm: {
        capacity: 1
      },
      remoteType: '',
      remoteStatus: '',
      curMode: this.mode,
      accountColumns: [
        {
          title: '账户名称',
          key: 'accountName'
        },
        {
          title: '账户ID',
          key: 'id'
        },
        {
          title: '账户类型',
          key: 'accountType',
          render(h, params) {
            let text = ''
            switch (params.row.accountType) {
              case 0:
                text = '系统管理员'
                break
              case 1:
                text = '企业'
                break
              case 2:
                text = '个人'
                break
              default:
                text = ''
            }
            return h('div', text)
          }
        },
        {
          title: '操作',
          render: (h, params) => {
            return h(
              'Button',
              {
                on: {
                  click: () => {
                    // 选择当前信息后关闭模态框
                    this.addForm.accountId = params.row.id
                    this.addForm.accountName = params.row.accountName
                    this.modalAccount = false
                  }
                }
              },
              '选择'
            )
          }
        }
      ],
      rulesValidate: {
        instName: [
          { required: true, validator: validateName, trigger: 'blur' }
        ],
        instType: [
          { required: true, message: '请选择实例类型', trigger: 'change' }
        ],
        capacity: [
          {
            type: 'number',
            required: true,
            message: '请输入实例容量',
            trigger: 'blur'
          }
        ],
        accountId: [
          {
            type: 'number',
            required: true,
            message: '请输入账户Id',
            trigger: 'blur'
          }
        ],
        serverId: [
          { required: true, message: '请选择实例', trigger: 'change' }
        ],
        accountName: [
          { required: true, message: '请选择账户', trigger: 'change' }
        ]
      },
      rulesValidate2: {
        instName: [
          { required: true, message: '请输入实例名称', trigger: 'blur' }
        ],
        instType: [
          { required: true, message: '请选择实例类型', trigger: 'change' }
        ],
        capacity: [
          {
            type: 'number',
            required: true,
            message: '请输入实例容量',
            trigger: 'blur'
          }
        ]
      },
      btntxt: '发送验证码',
      codeType: false,
      time: 0,
      defMobile: '' // 编辑默认手机号，用来判断是否需要校验
    }
  },
  created() {
    let access = this.$store.state.user.access
    if (access.includes('super_admin')) {
      this.defAccount = 'super_admin'
    } else if (access.includes('company') || access.includes('personal')) {
      this.defAccount = 'unit'
    }
  },
  methods: {
    // 组织分页
    changeOrgPage(curPage) {
      this.searchForm.page = curPage
      this.getOrgPage()
    },
    // 自定义组织菜单
    renderContent(h, { root, node, data }) {
      return h(
        'span',
        {
          style: {
            display: 'inline-block',
            width: '100%'
          }
        },
        [
          h(
            'span',
            {
              props: {
                'v-show': data.id === this.activeId
              }
            },
            data.title
          ),
          h(
            'Dropdown',
            {
              style: {
                display: 'inline-block',
                float: 'right',
                marginRight: '32px'
              }
            },
            [
              h('span', '···'),
              h(
                'DropdownMenu',
                {
                  slot: 'list'
                },
                [
                  h(
                    'DropdownItem',
                    {
                      on: {
                        'on-click': () => {
                          console.log('xixix')
                          alert('编辑')
                        }
                      }
                    },
                    '编辑'
                  ),
                  h('DropdownItem', '删除')
                ]
              )
            ]
          )
        ]
      )
    },
    // 获取组织信息
    getOrg(name) {
      if (name === 'name2') {
        // 组织结构
        this.searchForm.page = 1
        this.getOrgLists()
        this.getOrgPage()
      } else if (name === 'name3') {
        // 工作组
        this.searchForm.page = 1
        this.getGroupLists()
        this.getGroupPage()
      }
    },
    // 处理组织树数据，原数据格式 【】list pid id 关联
    listToTree(list) {
      const copyList = list.slice(0)
      const tree = []
      for (let i = 0; i < copyList.length; i++) {
        // 找出每一项的父节点，并将其作为父节点的children
        for (let j = 0; j < copyList.length; j++) {
          if (copyList[i].parentOid === copyList[j].oid) {
            if (copyList[j].children === undefined) {
              copyList[j].children = []
            }
            copyList[j].children.push(copyList[i])
          }
        }
        // 把根节点提取出来，parentId为null的就是根节点
        if (copyList[i].parentOid === 0) {
          tree.push(copyList[i])
        }
      }
      return tree
    },
    handleList(list) {
      let newList = []
      list.forEach((item, index) => {
        let obj = {}
        obj.title = item.name
        obj.oid = item.oid
        obj.parentOid = item.parentOid
        newList.push(obj)
      })
      return newList
    },
    // 组织表格数据
    getOrgPage() {
      let params = this.searchForm
      getOrgDatas(params).then(res => {
        this.orgData = res.data.data
      })
    },
    // 工作组数据
    getGroupPage() {
      let params = this.searchForm
      getGroupData(params).then(res => {
        console.log(res)
      })
    },
    // 组织菜单数据
    getOrgLists() {
      let params = { instanceId: this.id }
      getOrgList(params).then(res => {
        if (res.data.code === 200) {
          this.orgList = this.listToTree(this.handleList(res.data.data))
        }
      })
    },
    // 工作组菜单数据
    getGroupLists() {
      let params = { instanceId: this.id }
      getGroupList(params).then(res => {
        console.log(res)
      })
    },
    getAccount(data) {
      this.addForm.accountId = data[0].id
      this.accountContent = data[0].name
    },
    getServer(data) {
      this.addForm.serverId = data[0].id
      this.serverContent = `实例链接地址：${data[0].serverHost}\n实例端口号：${data[0].serverPort}\n定位服务链接地址：${data[0].gpsHost}\n定位服务端口号：${data[0].gpsPort}`
    },
    getModal(data) {
      this.basicInfo.type = data
    },
    showMask(type, width) {
      // 新增要填写基本信息后才能选择，否则选择页面相关字段为空值
      if (this.curMode === 'add') {
        this.rulesValidate.serverId[0].required = false
        this.rulesValidate.accountName[0].required = false
        this.$refs['addForm'].validate(valid => {
          if (valid) {
            this.openForm = this.addForm
            this.basicInfo = {
              type: type,
              width: width
            }
          } else {
            this.$Message.error('请先填写基本信息')
          }
        })
      } else {
        this.basicInfo = {
          type: type,
          width: width
        }
        this.openForm = this.editForm
      }
    },
    // 是否显示填写gps内容
    ifShowGps(val) {
      if (val === 'gis') {
        this.showGps = true
      } else {
        this.showGps = false
      }
    },
    // 新增提交
    save() {
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          // accountId 普通用户时为空
          // if(this.defAccount !== 'super_admin') {
          //   this.addForm.accountId = this.$store.state.user.userId
          // }
          addExample(this.addForm).then(res => {
            if (res.data.code === 200) {
              this.$Message.success(res.data.msg)
              // 重置表单
              this.$refs['addForm'].resetFields()
              this.$router.push({
                name: 'example_page'
              })
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        } else {
          console.log('校验失败')
        }
      })
    },
    // 修改信息
    update() {
      let data = {
        id: this.editForm.id,
        instName: this.editForm.instName,
        description: this.editForm.description,
        capacity: this.editForm.capacity
      }
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          putExample(data).then(res => {
            if (res.data.code === 200) {
              this.$Message.success(res.data.msg)
              this.$router.push({ name: 'example_page' })
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        }
      })
    },
    // 倒计时计算
    timer() {
      if (this.time > 0) {
        this.time--
        this.btntxt = this.time + 's后重新获取'
        this.codeType = true
        setTimeout(this.timer, 1000)
      } else {
        this.time = 0
        this.btntxt = '发送验证码'
        this.codeType = false
      }
    },
    // 验证码发送
    sendCode() {
      if (this.editForm.mobile === this.defMobile) {
        this.rulesValidate.mobile[0].required = false
        this.$Message.error('手机号未修改！')
        return
      } else {
        this.rulesValidate.identityCode[0].required = true
      }
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          this.time = 59
          this.timer()
          // let pageid = new Date().getTime()
          let data = {
            mobile: this.editForm.mobile,
            type: 2
          }
          getIdentityCode(data).then(res => {
            if (res.data.code === 200) {
              this.$Message.success('短信发送成功')
            } else {
              this.$Message.error(res.data.reason)
            }
          })
        } else {
          console.log('校验失败，短信未发送')
        }
      })
    },
    // 获取实例信息，新增时无id传入，不查询
    getInfo() {
      if (!this.id) {
        return
      }
      getExampleInfo(this.id).then(res => {
        if (res.data.code === 200) {
          this.editForm = res.data.data
          if (this.editForm.instType === 'gis') {
            this.showGps = true
          }
          switch (this.editForm.instType) {
            case 'call':
              this.remoteType = '远程会议'
              break
            case 'gis':
              this.remoteType = '联情指挥'
              break
            case 'live':
              this.remoteType = '网络直播'
              break
            default:
              break
          }
          switch (this.editForm.status) {
            case 0:
              this.remoteStatus = '已停止'
              break
            case 1:
              this.remoteStatus = '运行中'
              break
            default:
              break
          }
          let data = this.editForm
          this.serverContent2 = `实例链接地址：${data.serverHost}\n实例端口号：${data.serverPort}\n定位服务链接地址：${data.gpsHost}\n定位服务端口号：${data.gpsPort}`
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    }
  },
  mounted() {
    this.getInfo()
  }
}
</script>

<style scoped>
.editBtn {
  padding-left: 24px;
}
.addIcon {
  position: absolute;
  font-size: 20px;
  color: #ccc;
  right: 4px;
  top: 6px;
}
.select-btn {
  position: absolute;
  right: -60px;
  top: 1px;
  font-weight: bold;
  background: #86a1c1;
  color: #fff;
}
</style>
