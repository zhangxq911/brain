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
            <Button :disabled="selectExmpArr.length === 0" type="primary" @click="saveService">确定</Button>
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
            <Input
              v-model="searchForm.accountInfo"
              @on-search="searchAccount"
              search
              placeholder="请输入账户ID/账户名称"
            ></Input>
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
            @on-change="changeAccountPage"
            style="text-align: center;"
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
          <div style="padding: 20px 60px;" v-show="selectExmpArr2.length === 0">当前未选中任何账户</div>
          <div style="display: flex; justify-content: center;">
            <Button :disabled="selectExmpArr2.length === 0" type="primary" @click="saveAccount">确定</Button>
          </div>
        </div>
      </div>
    </div>
    <div class="mask" v-if="basicInfo.type === 'addOrg'">
      <div @click="closeMask" class="mask-left" :style="{'width': (100 - basicInfo.width) + 'vw'}"></div>
      <div class="mask-content" :style="{'width': basicInfo.width + 'vw'}">
        <Row>
          <span class="mask-title">添加部门</span>
          <Icon class="closeBtn" type="ios-close" @click="closeMask" />
        </Row>
        <div style="padding: 20px;">
          <Form ref="orgForm" :model="orgForm" :rules="orgValidate" label-position="top">
            <FormItem prop="name" label="部门名称">
              <Input v-model="orgForm.name"></Input>
            </FormItem>
            <FormItem label="顶级部门">
              <!-- 顶级部门为否的话 pid 传 0 -->
              <RadioGroup v-model="orgForm.top">
                <Radio :label="0">否</Radio>
                <Radio :label="1">是</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem v-show="!orgForm.top" label="上级部门">
              <Input disabled v-model="orgForm2.ptitle"></Input>
            </FormItem>
            <FormItem>
              <Button :disabled="disabledOrg" type="primary" @click="saveOrg">保存</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
    <div class="mask" v-if="basicInfo.type === 'editOrg'">
      <div @click="closeMask" class="mask-left" :style="{'width': (100 - basicInfo.width) + 'vw'}"></div>
      <div class="mask-content" :style="{'width': basicInfo.width + 'vw'}">
        <Row>
          <span class="mask-title">组织结构编辑</span>
          <Icon class="closeBtn" type="ios-close" @click="closeMask" />
        </Row>
        <div style="padding: 20px;">
          <Form
            ref="orgEditForm"
            :model="orgEditForm"
            :rules="orgEditValidate"
            label-position="top"
          >
            <FormItem prop="name" label="部门名称">
              <Input v-model="orgEditForm.name"></Input>
            </FormItem>
            <FormItem label="顶级部门">
              <RadioGroup v-model="orgEditForm.top">
                <Radio :label="0">否</Radio>
                <Radio :label="1">是</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem v-if="!orgEditForm.top" label="上级部门">
              <treeselect v-model="orgEditForm.parentOid" :options="orgTree" />
            </FormItem>
            <FormItem>
              <Button type="primary" @click="updateOrgs">保存</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
    <div class="mask" v-if="basicInfo.type === 'addUser'">
      <div @click="closeMask" class="mask-left" :style="{'width': (100 - basicInfo.width) + 'vw'}"></div>
      <div class="mask-content" :style="{'width': basicInfo.width + 'vw'}">
        <Row>
          <span class="mask-title">添加人员</span>
          <Icon class="closeBtn" type="ios-close" @click="closeMask" />
        </Row>
        <div style="padding: 20px;">
          <Form ref="userForm" :model="userForm" :rules="userValidate" label-position="top">
            <FormItem prop="tel" label="人员号码">
              <Input placeholder="请输入人员号码" v-model="userForm.tel">
                <span slot="prepend">{{prefix}}</span>
              </Input>
            </FormItem>
            <!-- <FormItem prop="regPwd" label="人员密码">
              <Input placeholder="请输入人员密码" v-model="userForm.regPwd" type="password"></Input>
            </FormItem>-->
            <FormItem prop="name" label="人员名称">
              <Input v-model="userForm.name"></Input>
            </FormItem>
            <FormItem prop="phone" label="手机号码">
              <Input v-model="userForm.phone"></Input>
            </FormItem>
            <FormItem prop="position" label="职称">
              <Input v-model="userForm.position"></Input>
            </FormItem>
            <FormItem>
              <Button :disabled="disabledUser" type="primary" @click="saveUser">保存</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
    <div class="mask" v-if="basicInfo.type === 'editUser'">
      <div @click="closeMask" class="mask-left" :style="{'width': (100 - basicInfo.width) + 'vw'}"></div>
      <div class="mask-content" :style="{'width': basicInfo.width + 'vw'}">
        <Row>
          <span class="mask-title">人员编辑</span>
          <Icon class="closeBtn" type="ios-close" @click="closeMask" />
        </Row>
        <div style="padding: 20px;">
          <Form
            ref="editUserFrom"
            :model="editUserFrom"
            :rules="userValidate2"
            label-position="top"
          >
            <FormItem label="人员号码">
              <Input disabled v-model="editUserFrom.tel"></Input>
            </FormItem>
            <!-- <FormItem label="人员密码">
              <Input v-model="editUserFrom.regPwd" type="password"></Input>
            </FormItem>-->
            <FormItem prop="name" label="人员名称">
              <Input v-model="editUserFrom.name"></Input>
            </FormItem>
            <FormItem prop="phone" label="手机号码">
              <Input v-model="editUserFrom.phone"></Input>
            </FormItem>
            <FormItem label="职称">
              <Input v-model="editUserFrom.position"></Input>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="updateUser">保存</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
    <div class="mask" v-if="basicInfo.type === 'changePermission'">
      <div @click="closeMask" class="mask-left" :style="{'width': (100 - basicInfo.width) + 'vw'}"></div>
      <div class="mask-content" :style="{'width': basicInfo.width + 'vw'}">
        <Row>
          <span class="mask-title">修改权限</span>
          <Icon class="closeBtn" type="ios-close" @click="closeMask" />
        </Row>
        <div style="padding: 20px;">
          <Form label-position="top">
            <!-- <treeselect :flat="true" :multiple="true" v-model="modifyArr2" :options="orgTree" /> -->
            <Tree
              @on-check-change="selectModifyArr"
              :multiple="true"
              :data="orgTree2"
              show-checkbox
            ></Tree>
            <FormItem>
              <Button type="primary" @click="modifyPermission">保存</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
    <div class="mask" v-if="basicInfo.type === 'addToWork'">
      <div @click="closeMask" class="mask-left" :style="{'width': (100 - basicInfo.width) + 'vw'}"></div>
      <div class="mask-content" :style="{'width': basicInfo.width + 'vw'}">
        <Row>
          <span class="mask-title">添加至工作组</span>
          <Icon class="closeBtn" type="ios-close" @click="closeMask" />
        </Row>
        <div style="padding: 20px;">
          <Form label-position="top">
            <FormItem label="工作组名称">
              <Select filterable v-model="groupEditForm.gid">
                <Option :value="item.id" v-for="item in groupTree" :key="item.id">{{item.title}}</Option>
              </Select>
            </FormItem>
            <FormItem>
              <Button :disabled="disabledToGroup" type="primary" @click="updateToGroup">保存</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
    <div class="mask" v-if="basicInfo.type === 'addWork'">
      <div @click="closeMask" class="mask-left" :style="{'width': (100 - basicInfo.width) + 'vw'}"></div>
      <div class="mask-content" :style="{'width': basicInfo.width + 'vw'}">
        <Row>
          <span class="mask-title">添加工作组</span>
          <Icon class="closeBtn" type="ios-close" @click="closeMask" />
        </Row>
        <Form
          style="margin: 10px 60px;"
          label-position="top"
          ref="addWorkForm"
          :model="addWorkForm"
          :rules="ruleWorkForm"
        >
          <FormItem prop="workName" label="工作组名称">
            <Input v-model="addWorkForm.workName" placeholder="请输入工作组名称"></Input>
          </FormItem>
        </Form>
        <div style="padding: 0px 60px;">
          <h5 style="margin-bottom: 6px;">选择主持人</h5>
          <Input
            v-model="searchForm.nameAndTel"
            @on-search="searchOrgUsers"
            search
            placeholder="请输入人员名称/人员号码/手机号码"
          ></Input>
        </div>
        <Table border :columns="workColumns" :data="orgUsersData" style="margin: 10px 60px;"></Table>
        <Page
          :current.sync="orgUsersPage.pageNumber"
          :page-size="orgUsersPage.pageSize"
          :total="orgUsersPage.count"
          style="text-align: center;"
          @on-change="changeOrgPage"
        />
        <div style="padding: 20px 60px;" v-show="selectExmpArr3.length > 0">
          已选中：
          <span style="color: #2d8cf0;" v-for="(item, index) in selectExmpArr3" :key="item.id">
            {{item.name}}
            <span class="del-select" @click="delSelect3">删除</span>
          </span>
        </div>
        <div style="padding: 20px 60px;" v-show="selectExmpArr3.length === 0">当前未选中任何账户</div>
        <div style="display: flex; justify-content: center;">
          <Button
            :disabled="selectExmpArr3.length === 0 || disabledAdd"
            type="primary"
            @click="addWork"
          >确定</Button>
        </div>
      </div>
    </div>
    <div class="mask" v-if="basicInfo.type === 'editWork'">
      <div @click="closeMask" class="mask-left" :style="{'width': (100 - basicInfo.width) + 'vw'}"></div>
      <div class="mask-content" :style="{'width': basicInfo.width + 'vw'}">
        <Row>
          <span class="mask-title">修改工作组</span>
          <Icon class="closeBtn" type="ios-close" @click="closeMask" />
        </Row>
        <div style="padding: 20px;">
          <Form label-position="top" ref="editWorkForm" :model="editWorkForm" :rules="ruleWorkForm">
            <FormItem prop="name" label="工作组名称">
              <Input v-model="editWorkForm.name"></Input>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="editWork">保存</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getAllPocUser,
  getServiceList,
  getAccountList,
  addOrg,
  updateOrg,
  addUser2,
  addToGroup,
  updateUsers,
  getDefPermission,
  getOrgList,
  putPermission,
  addGroop,
  putGroup,
  getNumberPrefix
} from '@/api/data'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  props: [
    'basicInfo',
    'editForm',
    'orgForm2',
    'orgTree',
    'groupTree',
    'selectUserStr',
    'editUserFrom',
    'groupForm'
  ],
  components: { Treeselect },
  data() {
    const validateMobile = (rule, value, callback) => {
      const reg = 11 && /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/
      if (!value) {
        callback(new Error('请输入手机号码'))
      } else if (!reg.test(value)) {
        callback(new Error('手机号格式不正确'))
      } else {
        callback()
      }
    }

    const validateName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入人员名称'))
      } else {
        callback()
      }
    }

    const validateTel = (rule, value, callback) => {
      const reg = /^[0-9]*$/
      if (!value) {
        callback(new Error('请输入人员号码'))
      } else if (!reg.test(value)) {
        callback(new Error('人员号码必须为数字'))
      } else {
        callback()
      }
    }

    return {
      disabledAdd: false,
      disabledOrg: false,
      disabledUser: false,
      disabledToGroup: false,
      orgUsersData: [],
      orgUsersPage: {},
      prefix: '',
      defAccount: '',
      addWorkForm: {},
      editWorkForm: {},
      ruleWorkForm: {
        workName: [
          { required: true, message: '请输入工作组名称', trigger: 'blur' }
        ],
        name: [{ required: true, message: '请输入工作组名称', trigger: 'blur' }]
      },
      orgTree3: [],
      orgTree2: [],
      modifyArr: [],
      modifyForm: {},
      groupEditForm: {},
      userForm: {
        tel: ''
      },
      userValidate: {
        tel: [{ required: true, message: '号码最大为12位', max: 12, trigger: 'blur' }],
        name: [{ required: true, validator: validateName, trigger: 'blur' }],
        phone: [{ required: true, validator: validateMobile, trigger: 'blur' }]
      },
      userValidate2: {
        // tel: [{ required: true, validator: validateTel, trigger: 'blur' }],
        name: [{ required: true, validator: validateName, trigger: 'blur' }],
        phone: [{ required: true, validator: validateMobile, trigger: 'blur' }]
      },
      orgEditForm: {
        name: '',
        parentOid: '',
        oid: '',
        top: 0
      },
      orgEditValidate: {
        name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }]
      },
      orgForm: {
        top: this.orgForm2.pid ? 0 : 1,
        parentOid: this.orgForm2.pid ? this.orgForm2.pid : 0
      },
      showTop: this.orgForm2.pid ? true : false,
      orgValidate: {
        name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }]
      },
      selectExmpArr: [], // 选中的服务
      selectExmpArr2: [], // 选中的账户
      selectExmpArr3: [], // 选中的部门人员
      selectOrg: [],
      isDisabled: false,
      isDisabled2: false,
      isDisabled3: false,
      loading: false,
      searchForm: {
        page: 1,
        status: 1,
        capacity: 0
      },
      dataServiceList: [],
      dataAccountList: [],
      workColumns: [
        {
          title: '选中',
          width: 60,
          align: 'center',
          render: (h, params) => {
            let val = false
            if (this.selectExmpArr3.length > 0) {
              this.selectExmpArr3.forEach(item => {
                if (item.id === params.row.uid) {
                  val = true
                }
              })
            }
            return h('Checkbox', {
              props: {
                value: val,
                disabled: this.isDisabled3
              },
              on: {
                'on-change': res => {
                  // 选中时填入arr数组，且查询时要先查看是否有数据
                  if (res) {
                    if (this.selectExmpArr3.length > 0) {
                      this.$Message.warning('当前已选择，请清空选择后重试！')
                      val = false
                      return
                    }
                    let data = {
                      id: params.row.uid,
                      name: params.row.name
                    }
                    this.selectExmpArr3.push(data)
                    this.isDisabled3 = true
                  } else {
                    let id = params.row.id
                    let arr = [...this.selectExmpArr3]
                    this.selectExmpArr3.forEach((item, index) => {
                      if (id === item.id) {
                        arr.splice(index, 1)
                      }
                    })
                    this.selectExmpArr3 = arr
                    this.isDisabled3 = false
                  }
                }
              }
            })
          }
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
          title: '部门名称',
          align: 'center',
          key: 'orgName'
        },
        {
          title: '人员职称',
          align: 'center',
          key: 'position'
        }
      ],
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
          title: '服务地址',
          key: 'serverHost',
          align: 'center'
        },
        {
          title: '创建时间',
          align: 'center',
          key: 'createTime'
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
  created() {
    // 控制权限
    let access = this.$store.state.user.access
    if (access.includes('super_admin')) {
      this.defAccount = 'super_admin'
    } else if (access.includes('company') || access.includes('personal')) {
      this.defAccount = 'unit'
    }
  },
  watch: {
    basicInfo: function() {
      // 更新部门
      this.orgEditForm.name = this.orgForm2.ptitle
      this.orgEditForm.top = !this.orgForm2.realPid ? 1 : 0
      this.orgEditForm.parentOid = !this.orgForm2.realPid
        ? null
        : this.orgForm2.realPid
      this.orgEditForm.oid = this.orgForm2.pid
      this.orgEditForm.ip = this.orgForm2.ip
      if (this.basicInfo.type === 'changePermission') {
        this.getOrgLists()
      }
      if (this.basicInfo.type === 'example') {
        this.searchForm.serverType = this.editForm.instType
        this.getServicePage(this.searchForm)
      }
      if (this.basicInfo.type === 'addUser') {
        // 获取人员号码前缀
        this.getPrefix()
      }
      if (this.basicInfo.type === 'addWork') {
        // 获取所有部门人员
        this.getOrgUsersPage()
      }
      // 添加部门判断是否顶级
      if (this.orgForm2.activeOrg) {
        this.orgForm.top = 0
      } else {
        this.orgForm.top = 1
      }
    },
    groupForm: function() {
      this.editWorkForm = this.groupForm
    }
  },
  methods: {
    searchOrgUsers() {
      this.getOrgUsersPage()
    },
    // 组织表格数据, 人员
    getOrgUsersPage(params) {
      params ? params : (params = this.searchForm)
      let data = {
        instanceId: this.orgForm2.ip,
        page: params.page
      }
      if (this.searchForm.nameAndTel) {
        data.nameAndTel = this.searchForm.nameAndTel
      } else {
        delete data.nameAndTel
      }
      getAllPocUser(data).then(res => {
        if (!res.data.data.data) {
          this.orgUsersData = []
        } else {
          // let tempArr = []
          // res.data.data.data.forEach(item => {
          //   item.pocUserList.forEach(item2 => {
          //     item2.orgName = item.name
          //   })
          //   tempArr.push.apply(tempArr, item.pocUserList)
          // })
          this.orgUsersData = res.data.data.data
          this.orgUsersPage = {
            pageNumber: res.data.data.pageNumber,
            pageSize: res.data.data.pageSize,
            count: res.data.data.count
          }
        }
        this.loading = false
      })
    },
    // 获取前缀信息
    getPrefix() {
      let data = {
        instanceId: this.orgForm2.ip
      }
      getNumberPrefix(data).then(res => {
        let result = JSON.parse(res.data.msg)
        if (res.data.code === 200) {
          this.prefix = res.data.data.numberPrefix
          this.userForm.tel = res.data.data.tel
        } else {
          this.$Message.error(result.REASON)
        }
      })
    },
    // 修改工作组
    editWork() {
      let data = {
        ip: this.orgForm2.ip,
        gid: this.editWorkForm.gid,
        name: this.editWorkForm.name,
        regPwd: this.editWorkForm.regPwd,
        level: this.editWorkForm.level,
        record: 0,
        crtMode: this.editWorkForm.crtMode,
        regName: this.editWorkForm.regName,
        vgcsTel: this.editWorkForm.vgcsTel
      }
      putGroup(data).then(res => {
        let result = JSON.parse(res.data.msg)
        if (res.data.code === 200) {
          this.$refs['editWorkForm'].resetFields()
          this.closeMask()
          this.$emit('refreshWork', true)
          this.$Message.success('编辑成功')
        } else {
          this.$Message.error(result.REASON)
        }
      })
    },
    // 添加工作组
    addWork() {
      this.disabledAdd = true
      setTimeout(() => {
        this.disabledAdd = false
      }, 1000)
      let data = {
        ip: this.orgForm2.ip,
        name: this.addWorkForm.workName
      }
      // 判断是否有选择主持人
      if (this.selectExmpArr3.length === 0) {
        this.$Message.error('请选择主持人后提交')
        return
      }
      data.uid = this.selectExmpArr3[0].id
      addGroop(data).then(res => {
        let result = JSON.parse(res.data.msg)
        if (result.RES === 'OK') {
          this.$refs['addWorkForm'].resetFields()
          this.closeMask()
          this.$emit('refreshWork', true)
          this.$Message.success('添加成功')
        } else {
          this.$Message.error(result.REASON)
        }
      })
    },
    // 组织菜单数据
    getOrgLists() {
      let params = { instanceId: this.orgForm2.ip }
      getOrgList(params).then(res => {
        if (res.data.code === 200) {
          this.orgTree3 = this.listToTree(this.handleList(res.data.data))
          this.getDefPermissions(this.orgForm2.uid)
        }
      })
    },
    handleList(list) {
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
    // 获取当前人员的默认权限
    getDefPermissions(uid) {
      let params = {
        uid: uid,
        ip: this.orgForm2.ip
      }
      getDefPermission(params).then(res => {
        let arr = []
        res.data.data.forEach(item => {
          arr.push(item.oid)
        })
        this.modifyArr = arr
        this.ifSelect(this.orgTree3, arr)
        this.orgTree2 = this.orgTree3
      })
    },
    ifSelect(arr, temp) {
      arr.forEach(item => {
        if (temp.indexOf(item.oid) > -1) {
          item.checked = true
        }
        if (item.children) {
          this.ifSelect(item.children, temp)
        }
      })
    },
    selectModifyArr(selectArr) {
      // 将数组处理 / 分割
      let str = ''
      selectArr.forEach(item => {
        str += item.oid + '/'
      })
      str = str.substring(0, str.length - 1)
      this.selectOrg = str
    },
    // 修改权限
    modifyPermission() {
      let data = {
        uid: this.orgForm2.uid,
        oid: this.selectOrg,
        ip: this.orgForm2.ip
      }
      putPermission(data).then(res => {
        let result = JSON.parse(res.data.msg)
        if (res.data.code === 200) {
          this.closeMask()
          this.$Message.success('修改成功')
        } else {
          this.$Message.error(result.REASON)
        }
      })
    },
    // 人员编辑
    updateUser() {
      let data = {
        ip: this.orgForm2.ip,
        tel: this.editUserFrom.tel,
        uid: this.editUserFrom.uid,
        position: this.editUserFrom.position,
        regPwd: this.editUserFrom.regPwd ? this.editUserFrom.regPwd : null,
        name: this.editUserFrom.name,
        phone: this.editUserFrom.phone
      }
      updateUsers(data).then(res => {
        let result = JSON.parse(res.data.msg)
        if (res.data.code === 200) {
          this.$refs['editUserFrom'].resetFields()
          this.closeMask()
          this.$emit('refreshUser', true)
          this.$Message.success('编辑成功')
        } else {
          this.$Message.error(result.REASON)
        }
      })
    },
    // 添加至工作组
    updateToGroup() {
      this.disabledToGroup = true
      setTimeout(() => {
        this.disabledToGroup = false
      }, 1000)
      let data = {
        gid: this.groupEditForm.gid,
        ip: this.orgForm2.ip,
        idList: this.selectUserStr
      }
      if (!data.gid) {
        this.$Message.error('请选择工作组！')
        return
      }
      addToGroup(data).then(res => {
        let result = JSON.parse(res.data.msg)
        if (res.data.code === 200) {
          this.groupEditForm.gid = ''
          this.closeMask()
          if (result.RES === 'OK') {
            this.$Message.success('添加成功')
          } else {
            // 部分失败, 显示所有失败数目及原因
            let str = ''
            result.list.forEach(item => {
              str += `<div><span style="display: inline-block; width: 60px;">${item.idOrTel}</span> ${item.rEASON}</div>`
            })
            this.$Modal.error({
              title: '错误信息',
              content: str
            })
          }
        } else {
          this.$Message.error('添加失败')
        }
      })
    },
    // 添加人员
    saveUser() {
      // 马上关闭弹窗，防止点击过快
      this.disabledUser = true
      setTimeout(() => {
        this.disabledUser = false
      }, 1000)
      if (!this.prefix) {
        this.$Message.error('人员前缀为空不能添加！')
        return
      }
      if (!this.userForm.tel) {
        this.$Message.error('请输入人员号码')
        return
      }
      this.userForm.ip = this.orgForm2.ip
      this.userForm.oid = this.orgForm2.pid
      if (!this.userForm.oid) {
        this.$Message.error('请先选择对应部门')
        return
      }
      if (!this.userForm.position) {
        this.userForm.position = ''
      }
      this.$refs['userForm'].validate(valid => {
        if (valid) {
          let data = {
            ip: this.orgForm2.ip,
            oid: this.orgForm2.pid,
            tel: this.prefix + '' + this.userForm.tel,
            name: this.userForm.name,
            phone: this.userForm.phone,
            position: this.userForm.position
          }
          // this.userForm.tel = this.prefix + '' + this.userForm.tel
          addUser2(data).then(res => {
            let result = JSON.parse(res.data.msg)
            if (res.data.code === 200) {
              this.$refs['userForm'].resetFields()
              this.closeMask()
              this.$Message.success('添加成功')
              this.$emit('refreshUser', true)
            } else {
              this.$Message.error(result.REASON)
            }
          })
        } else {
          console.log('校验失败')
        }
      })
    },
    // 更新部门
    updateOrgs() {
      if (this.orgEditForm.top === 1) {
        this.orgEditForm.parentOid = 0
      }
      this.$refs['orgEditForm'].validate(valid => {
        updateOrg(this.orgEditForm).then(res => {
          let result = JSON.parse(res.data.msg)
          if (result.RES === 'OK') {
            this.$refs['orgEditForm'].resetFields()
            this.closeMask()
            this.$Message.success('更新成功')
            this.$emit('refreshOrg', true)
          } else {
            this.$Message.error(result.REASON)
          }
        })
      })
    },
    // 改变顶级部门状态
    // changeTop(val) {
    //   if (val === 1) {
    //     this.showTop = false
    //   } else {
    //     this.showTop = true
    //   }
    // },
    // 添加部门
    saveOrg() {
      this.disabledOrg = true
      setTimeout(() => {
        this.disabledOrg = false
      }, 1000)
      this.orgForm.ip = this.orgForm2.ip
      if (this.orgForm.top === 0) {
        this.orgForm.parentOid = this.orgForm2.pid
      } else {
        this.orgForm.parentOid = 0
      }
      this.$refs['orgForm'].validate(valid => {
        if (valid) {
          addOrg(this.orgForm).then(res => {
            let result = JSON.parse(res.data.msg)
            if (result.RES === 'OK') {
              this.$refs['orgForm'].resetFields()
              this.closeMask()
              this.$Message.success('添加成功')
              this.$emit('refreshOrg', true)
            } else {
              this.$Message.error(result.REASON)
            }
          })
        } else {
          console.log('校验失败')
        }
      })
    },
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
    delSelect3() {
      this.selectExmpArr3 = []
      this.isDisabled3 = false
    },
    // 账户分页
    changeAccountPage(curPage) {
      let search = { ...this.searchForm }
      search.page = curPage
      search.type = this.defAccount
      this.getAccountPage(search)
    },
    // 服务分页
    changeServicePage(curPage) {
      let search = { ...this.searchForm }
      search.page = curPage
      this.getServicePage(search)
    },
    // 部门人员分页
    changeOrgPage(curPage) {
      let search = { ...this.searchForm }
      search.page = curPage
      this.getOrgUsersPage(search)
    },
    // 账户查询
    searchAccount() {
      this.loading = true
      this.getAccountPage(this.searchForm)
    },
    // 服务查询
    searchService() {
      this.loading = true
      this.getServicePage(this.searchForm)
    },
    closeMask() {
      // 清空表单
      if (this.searchForm.serverInfo) {
        delete this.searchForm.serverInfo
        this.getServicePage()
      }
      if (this.searchForm.accountInfo) {
        delete this.searchForm.accountInfo
        this.getAccountPage()
      }
      if (this.orgForm.name) {
        this.orgForm.name = ''
      }
      if (this.$refs['userForm']) {
        this.$refs['userForm'].resetFields()
      }
      if (this.addWorkForm.workName) {
        this.addWorkForm.workName = ''
      }
      if (this.searchForm.nameAndTel) {
        this.searchForm.nameAndTel = ''
        this.getOrgUsersPage()
      }
      this.delSelect3()
      this.basicInfo.type = 'normal'
      this.$emit('sendModal', this.basicInfo.type)
    },
    getServicePage(params) {
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
    getAccountPage(params) {
      params ? params : (params = this.searchForm)
      this.searchForm.type = this.defAccount
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
