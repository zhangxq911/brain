<template>
  <div class="card-box">
    <a class="jumpToLink" :href="baseUrl" target="_blank"></a>
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
                  <FormItem label="实例描述">{{editForm.description }}</FormItem>
                  <FormItem label="实例类型">{{remoteType }}</FormItem>
                  <FormItem label="实例容量">{{editForm.capacity }}</FormItem>
                  <FormItem label="到期时间">{{editForm.expirationTime}}</FormItem>
                  <FormItem label="实例">
                    <Input :rows="7" readonly type="textarea" :value="this.serverContent2"></Input>
                  </FormItem>
                  <FormItem
                    label="直播管理"
                    v-if="editForm.instType === 'live' && defAccount !== 'super_admin'"
                  >
                    <a
                      class="editBtn"
                      style="padding: 0px;"
                      href="javascript:void(0)"
                      @click="jumpToLive"
                    >
                      直播管理
                      <Icon type="ios-link" />
                    </a>
                  </FormItem>
                  <Divider dashed />
                  <FormItem label="账户名称">{{editForm.accountName }}</FormItem>
                </Form>
              </Col>
            </Row>
          </TabPane>
          <TabPane v-if="editForm.instType === 'call'" label="组织机构" name="name2">
            <Row>
              <Button type="primary" @click="showMask('addOrg', 30)">添加部门</Button>
              <Button type="primary" style="margin-left: 10px;" @click="addUserMask">添加人员</Button>
              <div style="float: right; margin-bottom: -10px;">
                <Form inline @submit.native.prevent>
                  <FormItem>
                    <Select
                      @on-change="search"
                      v-model="searchForm.status"
                      style="width: 100px;"
                      placeholder="状态"
                    >
                      <Option value="logout">登出</Option>
                      <Option value="login">登录</Option>
                    </Select>
                  </FormItem>
                  <FormItem prop="filter">
                    <Select
                      @on-change="clearSearch"
                      v-model="searchForm.filter"
                      style="width: 100px;"
                    >
                      <Option
                        v-for="(item, index) in filterList"
                        :value="item.value"
                        :key="index"
                      >{{ item.name }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem>
                    <Input
                      @on-search="search"
                      search
                      v-model="searchForm.content"
                      placeholder="请输入搜索内容"
                      style="width: 200px;"
                    ></Input>
                  </FormItem>
                  <FormItem>
                    <Button @click="sync" type="default">同步</Button>
                  </FormItem>
                </Form>
              </div>
            </Row>
            <div style="display: flex; height: 100%;">
              <div class="left-content">
                <!-- 左侧组织树 -->
                <Tree :data="orgList" :render="renderContent"></Tree>
              </div>
              <div style="flex: 1;">
                <Table
                  border
                  ref="selection"
                  :columns="orgColumns"
                  :data="orgData"
                  @on-selection-change="selectUser"
                ></Table>
                <div>
                  <Button
                    :disabled="selectUserStr.length > 0 ? false: true"
                    style="margin: 10px;"
                    type="error"
                    @click="delUser"
                  >删除用户</Button>
                  <Button
                    :disabled="selectUserStr.length > 0 ? false: true"
                    style="margin: 10px;"
                    type="primary"
                    @click="showMask('addToWork', 30)"
                  >添加至工作组</Button>
                </div>
                <div style="text-align: center; position: relative;">
                  <span
                    style="position: absolute; left: 10px; top: 8px;"
                  >当前 {{orgData.length}} 条记录，共 {{orgPage.count}} 条记录。</span>
                  <Page
                    :current="orgPage.pageNumber"
                    :page-size="orgPage.pageSize"
                    :total="orgPage.count"
                    @on-change="changeOrgPage"
                  />
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane v-if="editForm.instType === 'call'" label="工作组" name="name3">
            <Row>
              <Button type="primary" @click="showMask('addWork', 50)">添加</Button>
              <div style="float: right; margin-bottom: -10px;">
                <Form inline @submit.native.prevent>
                  <FormItem>
                    <Select
                      @on-change="searchWork"
                      v-model="searchForm.status"
                      style="width: 100px;"
                      placeholder="状态"
                    >
                      <Option value="logout">登出</Option>
                      <Option value="login">登录</Option>
                    </Select>
                  </FormItem>
                  <FormItem prop="filter">
                    <Select
                      @on-change="clearSearch"
                      v-model="searchForm.filter"
                      style="width: 100px;"
                    >
                      <Option
                        v-for="(item, index) in filterList2"
                        :value="item.value"
                        :key="index"
                      >{{ item.name }}</Option>
                    </Select>
                  </FormItem>
                  <FormItem>
                    <Input
                      @on-search="searchWork"
                      v-model="searchForm.content"
                      search
                      placeholder="请输入搜索内容"
                      style="width: 200px;"
                    ></Input>
                  </FormItem>
                  <!-- <FormItem>
                    <Button type="default">同步</Button>
                  </FormItem>-->
                </Form>
              </div>
            </Row>
            <div style="display: flex; height: 100%;">
              <div
                style="width: 200px; background: #F1F3F6; padding: 0 10px; height: 100%; overflow: auto;"
              >
                <!-- 左侧组织树 -->
                <Tree :data="groupList" :render="renderContent2"></Tree>
              </div>
              <div style="flex: 1;">
                <Table
                  border
                  ref="selection"
                  :columns="groupColumns"
                  :data="groupData"
                  @on-selection-change="selectWorkUser"
                ></Table>
                <div>
                  <Button
                    :disabled="selectWorkUserStr.length > 0 ? false: true"
                    style="margin: 10px;"
                    type="error"
                    @click="delWorkUser"
                  >删除用户</Button>
                </div>
                <div style="text-align: center; position: relative;">
                  <span
                    style="position: absolute; left: 10px; top: 8px;"
                  >当前 {{groupData.length}} 条记录，共 {{groupPage.count}} 条记录。</span>
                  <Page
                    :current="groupPage.pageNumber"
                    :page-size="groupPage.pageSize"
                    :total="groupPage.count"
                    @on-change="changeGroupPage"
                  />
                </div>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </Col>
      <!-- 新增 -->
      <Col span="12">
        <Form
          ref="addForm"
          :model="addForm"
          :rules="rulesValidate"
          :label-width="120"
          style="min-width: 500px;"
          v-if="curMode === 'add'"
        >
          <FormItem prop="instName" label="实例名称">
            <Input type="text" v-model="addForm.instName" placeholder="请输入实例名称"></Input>
          </FormItem>
          <FormItem prop="description" label="实例描述">
            <Input
              :rows="7"
              type="textarea"
              :maxlength="100"
              v-model="addForm.description"
              placeholder="请输入实例描述"
            ></Input>
            <span class="font-tips">已输入 {{addForm.description.length}}/100 个字符</span>
          </FormItem>
          <FormItem prop="instType" label="实例类型">
            <Select v-model="addForm.instType" @on-change="ifShowGps">
              <Option value="call">远程会议</Option>
              <Option value="gis">应急一张图</Option>
              <Option value="live">网络直播</Option>
            </Select>
          </FormItem>
          <FormItem prop="capacity" label="实例容量">
            <InputNumber style="width: 100%;" :min="1" v-model="addForm.capacity"></InputNumber>
          </FormItem>
          <FormItem prop="expirationTime" v-if="defAccount === 'super_admin'" label="到期时间">
            <DatePicker
              v-model="addForm.expirationTime"
              type="date"
              placeholder="请选择到期时间"
              style="width: 100%"
              :options="options"
            ></DatePicker>
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
            <Button :disabled="disabledNew" type="primary" @click="save">保存</Button>
          </FormItem>
        </Form>
      </Col>
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
          <FormItem prop="description" label="实例描述">
            <Input
              :rows="7"
              type="textarea"
              :maxlength="100"
              v-model="editForm.description"
              placeholder="请输入实例描述"
            ></Input>
            <span
              class="font-tips"
            >已输入 {{editForm.description ? editForm.description.length : 0}}/100 个字符</span>
          </FormItem>
          <FormItem label="实例类型">{{remoteType}}</FormItem>
          <FormItem v-if="defAccount === 'super_admin'" prop="capacity" label="实例容量">
            <InputNumber style="width: 100%;" :min="1" v-model="editForm.capacity"></InputNumber>
          </FormItem>
          <FormItem v-if="defAccount !== 'super_admin'" label="实例容量">{{editForm.capacity}}</FormItem>
          <FormItem prop="expirationTime" v-if="defAccount === 'super_admin'" label="到期时间">
            <DatePicker
              v-model="editForm.expirationTime"
              type="date"
              placeholder="请选择到期时间"
              style="width: 100%"
            ></DatePicker>
          </FormItem>
          <FormItem v-if="defAccount !== 'super_admin'" label="到期时间">{{editForm.expirationTime}}</FormItem>
          <FormItem label="实例">
            <Input readonly :rows="7" type="textarea" :value="serverContent2"></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="update">保存</Button>
          </FormItem>
        </Form>
      </Col>
    </Row>
    <MaskExample
      @sendModal="getModal"
      @sendAccount="getAccount"
      @sendServer="getServer"
      @refreshOrg="getRefreshOrg"
      @refreshUser="getRefrechUser"
      @refreshWork="getWork"
      @refreshWorkUser="getRefreshWork"
      :selectUserStr="selectUserStr"
      :groupTree="groupList"
      :orgTree="orgList"
      :editForm="openForm"
      :orgForm2="orgForm2"
      :basicInfo="basicInfo"
      :editUserFrom="editUserFrom"
      :modifyArr="modifyArr"
      :groupForm="groupForm"
    ></MaskExample>
    <div class="mask-loading" v-show="loadingSync">
      <div class="loading-box">
        <Icon class="loading-btn" type="ios-loading"></Icon>
        <span style="padding-top: 20px; font-size: 16px; color: #fff;">同步中，请稍后...</span>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getAllPocUser,
  getExampleInfo,
  getIdentityCode,
  putExample,
  addExample,
  getAccountList,
  getOrgList,
  getOrgDatas,
  getGroupList,
  getGroupData,
  delOrg,
  delUsers,
  delGroup,
  delUserGroup,
  ayncData,
  getImbLoginUrl
} from '@/api/data'
import { defaultCoreCipherList } from 'constants'
import MaskExample from './maskExample'
import config from '@/config'

export default {
  props: ['id', 'mode'],
  components: { MaskExample },
  data() {
    const baseUrl =
      process.env.NODE_ENV === 'development'
        ? config.baseUrl.livedev
        : config.baseUrl.livepro

    const validateName = (rule, value, callback) => {
      const reg = /^[\u4e00-\u9fa5a-zA-Z]+$/
      if (value === undefined || value === '') {
        callback(new Error('请输入实例名称'))
      } else if (!reg.test(value) || value.length < 2 || value.length > 10) {
        callback(new Error('长度为 2~10 个英文或中文字符'))
      } else {
        callback() // 不管结果如何都要返回一个值，不然就一直校验中，无法提交了。
      }
    }

    const validatePwd = (rule, value, callback) => {
      const reg = /^[a-zA-Z][a-zA-Z0-9_]*$/
      if (value === '') {
        callback(new Error('这是必填字段'))
      } else if (!reg.test(value) || value.length < 6 || value.length > 16) {
        callback(new Error('字母开头,长度在 6~16 之间的字符,数字和下划线'))
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
      const reg = 11 && /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/
      if (!value) {
        callback()
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
      baseUrl: baseUrl,
      disabledNew: false,
      loadingSync: false,
      options: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000 // 限制只能选择当前及之后的时间
        }
      },
      selectWorkUserStr: '',
      groupForm: {},
      modifyArr: [],
      editUserFrom: {},
      filterList: [
        {
          name: '人员名称',
          value: 'name'
        },
        {
          name: '人员号码',
          value: 'tel'
        },
        {
          name: '手机号码',
          value: 'phone'
        },
        {
          name: '人员职称',
          value: 'position'
        }
      ],
      filterList2: [
        {
          name: '人员名称',
          value: 'name'
        },
        {
          name: '人员号码',
          value: 'tel'
        }
      ],
      groupColumns: [
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
          title: '状态',
          key: 'status',
          align: 'center',
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
        }
      ],
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
          align: 'center',
          key: 'position'
        },
        {
          title: '状态',
          key: 'status',
          align: 'center',
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
                  on: {
                    click: () => {
                      this.editUserFrom = params.row
                      this.showMask('editUser', 30)
                    }
                  }
                },
                '编辑'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'success',
                    size: 'small'
                  },
                  style: {
                    'margin-left': '10px'
                  },
                  on: {
                    click: () => {
                      this.orgForm2.uid = params.row.uid
                      this.editUserFrom = params.row
                      this.showMask('changePermission', 30)
                    }
                  }
                },
                '权限'
              )
            ])
          }
        }
      ],
      orgData: [],
      orgPage: { count: 0 },
      groupData: [],
      groupPage: { count: 0 },
      orgList: [],
      groupList: [],
      activeId: '',
      searchForm: {
        instanceId: this.id,
        ip: this.id,
        page: 1,
        filter: 'name'
      },
      selectUserStr: '',
      serverContent2: '', // 详情、编辑实例内容
      accountContent: '',
      serverContent: '',
      openForm: {},
      exampleModal: false,
      basicInfo: {},
      showGps: false,
      modalAccount: false,
      defAccount: '',
      editForm: {
        description: ''
      },
      orgForm2: {
        ip: this.id
      },
      addForm: {
        capacity: 1,
        description: ''
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
        expirationTime: [
          {
            type: 'date',
            required: true,
            message: '请选择到期时间',
            trigger: 'change'
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
        ],
        description: [{ max: 100, message: '最多为100个字符', trigger: 'blur' }]
      },
      rulesValidate2: {
        instName: [
          { required: true, validator: validateName, trigger: 'blur' }
        ],
        instType: [
          { required: true, message: '请选择实例类型', trigger: 'change' }
        ],
        expirationTime: [
          {
            type: 'date',
            required: true,
            message: '请选择到期时间',
            trigger: 'change'
          }
        ],
        capacity: [
          {
            type: 'number',
            required: true,
            message: '请输入实例容量',
            trigger: 'blur'
          }
        ],
        description: [{ max: 100, message: '最多为100个字符', trigger: 'blur' }]
      },
      btntxt: '发送验证码',
      codeType: false,
      time: 0,
      defMobile: '', // 编辑默认手机号，用来判断是否需要校验
      activeOrg: '',
      activeOrg2: ''
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
    // 跳转到直播后台管理
    jumpToLive() {
      getImbLoginUrl().then(res => {
        if (res.data.code === 200) {
          // 跳转页面
          this.baseUrl += '?token=' + res.data.data
          document.querySelector('.jumpToLink').click()
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    addUserMask() {
      // 判断是否选中部门
      if (this.searchForm.oid) {
        this.showMask('addUser', 30)
      } else {
        this.$Message.warning('请先选择部门！')
      }
    },
    // 同步
    sync() {
      this.loadingSync = true
      let data = {
        instanceId: this.id
      }
      ayncData(data).then(res => {
        if (res.data.code === 200) {
          this.$Message.success(res.data.msg)
          // 选中部门的时候，同步后刷新该部门
          if (this.searchForm.oid) {
            this.getOrgLists()
            this.getOrgPage()
          } else {
            this.getOrgLists()
            this.orgData = []
            this.orgPage = {
              count: 0,
              pageNumber: 1,
              pageSize: 20,
              totalPage: 0
            }
          }
          this.selectUserStr = ''
        } else {
          this.$Message.error(res.data.msg)
        }
        this.loadingSync = false
      })
    },
    // 工作组查询
    searchWork(val) {
      if (!val) {
        // tab 切换时不触发 on-change
        return
      }
      if (!this.searchForm.filter && this.searchForm.content) {
        this.$Message.error('请先选择查询类型')
        return
      } else {
        this.searchForm[this.searchForm.filter] = this.searchForm.content
        this.loading = true
        this.getGroupPage(this.searchForm)
      }
    },
    // 删除选中的工作组用户
    delWorkUser() {
      let data = {
        ip: this.id,
        uidList: this.selectWorkUserStr,
        gid: this.searchForm.gid
      }
      delUserGroup(data).then(res => {
        let result = JSON.parse(res.data.msg)
        if (result.RES === 'OK') {
          this.getGroupPage()
          this.$Message.success('删除成功')
        } else {
          this.$Message.error(result.REASON)
        }
      })
    },
    // 工作组人员选中
    selectWorkUser(select) {
      let str = ''
      select.forEach(item => {
        str += item.uid + ','
      })
      str = str.substr(0, str.length - 1)
      this.selectWorkUserStr = str
    },
    // 删除工作组
    deleteGroup(params) {
      delGroup(params).then(res => {
        let result = JSON.parse(res.data.msg)
        if (result.RES === 'OK') {
          this.getGroupLists()
          this.$Message.success('删除成功')
        } else {
          this.$Message.error(result.REASON)
        }
      })
    },
    // 当前选中的人员
    selectUser(select) {
      let str = ''
      select.forEach(item => {
        str += item.uid + ','
      })
      str = str.substr(0, str.length - 1)
      this.selectUserStr = str
    },
    // 删除当前选中
    delUser() {
      let data = {
        uidList: this.selectUserStr,
        ip: this.id
      }
      delUsers(data).then(res => {
        let result = JSON.parse(res.data.msg)
        if (result.RES === 'OK') {
          this.loading = true
          this.getOrgPage()
          // 刷新工作组，主持人删除的话树要刷新
          this.$Message.success('删除成功')
          this.getGroupLists()
          this.selectUserStr = ''
        } else {
          this.$Message.error(result.REASON)
        }
      })
    },
    // 搜索组织结构
    search(val) {
      // 判断是否选中部门，没有选中的话提示
      if (!val) {
        // tab 切换时不触发 on-change
        return
      }
      if (!this.searchForm.filter && this.searchForm.content) {
        this.$Message.error('请先选择查询类型')
        return
      } else {
        this.searchForm[this.searchForm.filter] = this.searchForm.content
        this.loading = true
        this.getOrgPage(this.searchForm)
      }
    },
    // 组织机构筛选条件清除之前的
    clearSearch() {
      this.searchForm.name = ''
      this.searchForm.tel = ''
      this.searchForm.phone = ''
      this.searchForm.position = ''
    },
    // 组织刷新
    getRefreshOrg() {
      this.getOrgLists()
    },
    // 人员刷新
    getRefrechUser() {
      this.getOrgPage()
    },
    // 工作组刷新
    getWork() {
      this.getGroupLists()
    },
    // 工作组人员刷新
    getRefreshWork() {
      this.getGroupPage()
    },
    // 组织分页
    changeOrgPage(curPage) {
      this.searchForm.page = curPage
      this.getOrgPage()
    },
    changeGroupPage(curPage) {
      this.searchForm.page = curPage
      this.getGroupPage()
    },
    // 自定义组织菜单
    renderContent(h, { root, node, data }) {
      return h(
        'span',
        {
          style: {
            'font-size': '14px'
          },
          class: this.activeOrg === data.oid ? 'tree-active' : 'tree-padding',
          on: {
            click: () => {
              if (this.activeOrg === data.oid) {
                this.activeOrg = ''
                this.searchForm.oid = ''
                // 清空分页数据
                this.orgPage = {
                  count: 0,
                  pageNumber: 1,
                  pageSize: 20,
                  totalPage: 0
                }
                this.orgData = []
              } else {
                this.searchForm.oid = data.oid
                this.activeOrg = data.oid
                this.orgForm2.pid = data.oid
                this.orgForm2.realPid = data.parentOid
                this.orgForm2.ptitle = data.title
                this.searchForm.page = 1
                this.getOrgPage()
              }
              this.orgForm2.activeOrg = this.activeOrg
            }
          }
        },
        [
          h(
            'span',
            {
              props: {
                title: data.title
              },
              style: {
                overflow: 'hidden',
                'text-overflow': 'ellipsis',
                'white-space': 'nowrap',
                display: 'inline-block',
                'vertical-align': 'top',
                width: '126px'
              }
            },
            data.title
          ), // + '/' + data.oid),
          h(
            'Dropdown',
            {
              props: {
                trigger: 'click'
              },
              style: {
                display: 'inline-block',
                float: 'right'
              },
              on: {
                'on-click': name => {
                  if (name === 'edit') {
                    // 编辑部门
                    this.showMask('editOrg', 30)
                  } else if (name === 'del') {
                    this.$Modal.confirm({
                      title: '信息',
                      content:
                        '<p>删除该部门会同时删除底下关联的部门结构，确定删除吗？</p>',
                      onOk: () => {
                        let params = {
                          ip: this.orgForm2.ip,
                          oid: data.oid
                        }
                        this.deleteOrg(params)
                      }
                    })
                  } else {
                  }
                }
              }
            },
            [
              h('Icon', {
                props: {
                  type: 'ios-more'
                },
                class: 'show-more'
              }),
              h(
                'DropdownMenu',
                {
                  slot: 'list'
                },
                [
                  h(
                    'DropdownItem',
                    {
                      props: {
                        name: 'edit',
                        transfer: true
                      }
                      // style: {
                      //   color: '#2d8cf0'
                      // }
                    },
                    '编辑'
                  ),
                  h(
                    'DropdownItem',
                    {
                      props: {
                        name: 'del'
                      }
                      // style: {
                      //   color: '#ed4014'
                      // }
                    },
                    '删除'
                  )
                ]
              )
            ]
          )
        ]
      )
    },
    renderContent2(h, { root, node, data }) {
      return h(
        'span',
        {
          style: {
            'font-size': '14px'
          },
          class: this.activeOrg2 === data.gid ? 'tree-active' : 'tree-padding',
          on: {
            click: () => {
              if (this.activeOrg2 === data.gid) {
                this.activeOrg2 = ''
                // 清空分页数据
                this.groupPage = {
                  count: 0,
                  pageNumber: 1,
                  pageSize: 20,
                  totalPage: 0
                }
                this.groupData = []
              } else {
                this.activeOrg2 = data.gid
                this.searchForm.gid = data.gid
                this.searchForm.page = 1
                this.getGroupPage()
              }
            }
          }
        },
        [
          h('span', [
            h('Icon', {
              props: {
                type: 'md-people'
              },
              style: {
                color: '#2d8cf0',
                'font-size': '14px',
                'padding-right': '4px'
              }
            }),
            h(
              'span',
              {
                props: {
                  title: data.title + '(' + data.vgcsTel + ')'
                },
                style: {
                  overflow: 'hidden',
                  'text-overflow': 'ellipsis',
                  'white-space': 'nowrap',
                  display: 'inline-block',
                  'vertical-align': 'top',
                  width: '126px'
                }
              },
              data.title + '(' + data.vgcsTel + ')'
            )
          ]), // + '/' + data.gid),
          h(
            'Dropdown',
            {
              props: {
                trigger: 'click'
              },
              style: {
                display: 'inline-block',
                float: 'right'
              },
              on: {
                'on-click': name => {
                  if (name === 'edit') {
                    // 编辑工作组
                    this.groupForm = data
                    this.showMask('editWork', 30)
                  } else if (name === 'del') {
                    this.$Modal.confirm({
                      title: '信息',
                      content: `<p>确定删除${data.title}吗？</p>`,
                      onOk: () => {
                        let params = {
                          ip: this.orgForm2.ip,
                          gid: data.gid
                        }
                        this.deleteGroup(params)
                      }
                    })
                  } else {
                  }
                }
              }
            },
            [
              h('Icon', {
                props: {
                  type: 'ios-more'
                },
                class: 'show-more'
              }),
              h(
                'DropdownMenu',
                {
                  slot: 'list'
                },
                [
                  h(
                    'DropdownItem',
                    {
                      props: {
                        name: 'edit',
                        transfer: true
                      }
                      // style: {
                      //   color: '#2d8cf0'
                      // }
                    },
                    '编辑'
                  ),
                  h(
                    'DropdownItem',
                    {
                      props: {
                        name: 'del'
                      }
                      // style: {
                      //   color: '#ed4014'
                      // }
                    },
                    '删除'
                  )
                ]
              )
            ]
          )
        ]
      )
    },
    // 删除部门
    deleteOrg(data) {
      delOrg(data).then(res => {
        let result = JSON.parse(res.data.msg)
        if (result.RES === 'OK') {
          this.getOrgLists()
          this.$Message.success('删除成功')
        } else {
          this.$Message.error(result.REASON)
        }
      })
    },
    // 获取组织信息
    getOrg(name) {
      if (name === 'name2') {
        // 组织结构
        this.searchForm.page = 1
        // this.searchForm.status = ''
        delete this.searchForm.status
        this.searchForm.filter = 'name'
        delete this.searchForm.content
        if (this.orgList.length === 0) {
          this.getOrgLists()
        }
        if (this.groupList.length === 0) {
          this.getGroupLists()
        }
      } else if (name === 'name3') {
        // 工作组
        this.searchForm.page = 1
        // this.searchForm.status = ''
        delete this.searchForm.status
        this.searchForm.filter = 'name'
        delete this.searchForm.content
        if (this.groupList.length === 0) {
          this.getGroupLists()
        }
        // 清空选择样式
        // this.activeOrg = ''
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
      if (!list) {
        return
      }
      let newList = []
      list.forEach((item, index) => {
        let obj = {}
        obj.title = item.name
        obj.oid = item.oid
        obj.parentOid = item.parentOid
        obj.id = item.oid
        obj.label = item.name
        newList.push(obj)
      })
      return newList
    },
    // 组织表格数据, 人员
    getOrgPage() {
      if (!this.searchForm.oid) {
        this.$Message.error('请先选择部门')
        return
      }
      // if(this.searchForm.status === 'all') {
      //   this.searchForm.status = ''
      // }
      let params = this.searchForm
      getAllPocUser(params).then(res => {
        if (!res.data.data.data) {
          this.orgData = []
          this.orgPage = {
            count: 0,
            pageNumber: 1,
            pageSize: 20,
            totalPage: 0
          }
        } else {
          this.orgData = res.data.data.data
          this.orgPage = {
            count: res.data.data.count,
            pageNumber: res.data.data.pageNumber,
            pageSize: res.data.data.pageSize,
            totalPage: res.data.data.totalPage
          }
        }
        this.loading = false
      })
    },
    // 工作组数据
    getGroupPage() {
      if (!this.searchForm.gid) {
        this.$Message.error('请先选择工作组')
        return
      }

      let params = this.searchForm
      getGroupData(params).then(res => {
        if (res.data.code === 200) {
          if (!res.data.data.data) {
            this.groupData = []
            this.groupPage = {
              count: 0,
              pageNumber: 1,
              pageSize: 20,
              totalPage: 0
            }
          } else {
            this.groupData = res.data.data.data
            this.groupPage = {
              count: res.data.data.count,
              pageNumber: res.data.data.pageNumber,
              pageSize: res.data.data.pageSize,
              totalPage: res.data.data.totalPage
            }
          }
          this.loading = false
        } else {
          this.loading = false
          console.log('获取工作组人员失败')
        }
      })
    },
    // 组织菜单数据
    getOrgLists() {
      let params = { instanceId: this.id }
      getOrgList(params).then(res => {
        if (res.data.code === 200) {
          if (!res.data.data) {
            return
          }
          this.orgList = this.listToTree(this.handleList(res.data.data))
        }
      })
    },
    // 工作组菜单数据
    getGroupLists() {
      let params = { instanceId: this.id }
      getGroupList(params).then(res => {
        if (res.data.code === 200) {
          this.groupList = []
          let data = res.data.data
          if (!data) {
            return
          }
          data.forEach((item, index) => {
            let obj = item
            obj.id = item.gid
            obj.gid = item.gid
            obj.title = item.name
            obj.label = item.name
            obj.vgcsTel = item.vgcsTel
            obj.children = []
            this.groupList.push(obj)
          })
          this.loading = false
        }
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
      this.disabledNew = true
      setTimeout(() => {
        this.disabledNew = false
      }, 1000)
      if (this.defAccount !== 'super_admin') {
        this.addForm.expirationTime = null
      }
      this.$refs['addForm'].validate(valid => {
        if (valid) {
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
        capacity: this.editForm.capacity,
        expirationTime: this.editForm.expirationTime
      }
      if (this.defAccount !== 'super_admin') {
        this.editForm.expirationTime = null
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
          this.orgForm2.ip = res.data.data.id
          if (this.editForm.instType === 'gis') {
            this.showGps = true
          }
          switch (this.editForm.instType) {
            case 'call':
              this.remoteType = '远程会议'
              break
            case 'gis':
              this.remoteType = '应急一张图'
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
          this.serverContent2 = `服务：${data.serverName}\n实例链接地址：${
            data.serverHost
          }\n实例端口号：${data.serverPort}\n定位服务链接地址：${
            data.gpsHost ? data.gpsHost : ''
          }\n定位服务端口号：${data.gpsPort ? data.gpsPort : ''}\n总量：${
            data.totalCapacity
          }`
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
.left-content {
  width: 200px;
  background: #f1f3f6;
  padding: 0 10px;
  /* max-height: 460px; */
  overflow-y: auto;
  overflow-x: hidden;
}
.left-content .ivu-tree ul li {
  font-size: 14px;
}
.mask-loading {
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999;
}
.loading-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.loading-btn {
  font-size: 50px;
  color: #fff;
}
.loading-btn {
  -webkit-animation: myRotate 1s linear infinite;
  animation: myRotate 1s linear infinite;
}
@-webkit-keyframes myRotate {
  0% {
    -webkit-transform: rotate(0deg);
  }
  50% {
    -webkit-transform: rotate(180deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}
@keyframes myRotate {
  0% {
    -webkit-transform: rotate(0deg);
  }
  50% {
    -webkit-transform: rotate(180deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}
</style>
