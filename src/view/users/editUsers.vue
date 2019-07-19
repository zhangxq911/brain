<template>
  <div class="card-box">
    <h3 class="detailTitle">基本信息</h3>
    <a
      class="editBtn"
      href="javascript:void(0)"
      @click="curMode = 'edit'"
      v-show="curMode === 'view'"
    >
      编辑
      <Icon type="md-create" />
    </a>
    <Row>
      <!-- 查看 -->
      <Col span="24" v-show="curMode === 'view'">
        <Form :label-width="120" style="min-width: 500px;">
          <FormItem label="用户名称">{{editForm.userName }}</FormItem>
          <FormItem label="昵称">{{editForm.nickName }}</FormItem>
          <FormItem label="手机号码">{{editForm.mobile }}</FormItem>
          <FormItem label="电子邮箱">{{editForm.email }}</FormItem>
          <FormItem label="用户描述">{{editForm.description }}</FormItem>
          <FormItem label="会议角色">{{!editForm.userType ? '参会者' : '主持人' }}</FormItem>
          <Divider dashed />
          <h3 class="detailChildTitle">用户实例开通信息</h3>
          <!-- 最多三条，每个类型一条 -->
          <Row>
            <Button
              @click="showMask('open', 50)"
              style="margin: 0 70px 10px;"
              size="small"
              type="primary"
            >开通</Button>
            <Table :columns="exampleColumns" :data="exampleData"></Table>
          </Row>
          <Divider dashed />
          <h3 class="detailChildTitle">归属账号</h3>
          <Row>
            <FormItem label="账户名称">{{editForm.accountName}}</FormItem>
          </Row>
        </Form>
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
          <input type="text" name="userName" style="position: absolute;z-index: -99" />
          <input type="password" name="userPsw" style="position: absolute;z-index: -99" />
          <FormItem prop="userName" label="用户名称">
            <Input type="text" v-model="addForm.userName" placeholder="请输入用户名称"></Input>
          </FormItem>
          <FormItem prop="userPsw" label="用户密码">
            <Input type="password" v-model="addForm.userPsw" placeholder="请输入用户密码"></Input>
          </FormItem>
          <FormItem prop="repeatPsw" label="重复密码">
            <Input type="password" v-model="addForm.repeatPsw" placeholder="请再次输入密码"></Input>
          </FormItem>
          <FormItem prop="nickName" label="昵称">
            <Input type="text" v-model="addForm.nickName" placeholder="请输入昵称"></Input>
          </FormItem>
          <FormItem v-if="defAccount === 'super_admin'" label="会议角色">
            <RadioGroup v-model="addForm.userType">
              <Radio :label="0">参会者</Radio>
              <Radio :label="1">主持人</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem prop="mobile" label="手机号码">
            <Input type="text" v-model="addForm.mobile" placeholder="请输入手机号码"></Input>
          </FormItem>
          <FormItem prop="email" label="电子邮箱">
            <Input type="text" v-model="addForm.email" placeholder="请输入电子邮箱"></Input>
          </FormItem>
          <FormItem prop="description" label="用户描述">
            <Input :rows="7" type="textarea" :maxlength="100" v-model="addForm.description" placeholder="请输入用户描述"></Input>
            <span class="font-tips">已输入 {{addForm.description.length}}/100 个字符</span>
          </FormItem>
          <div v-if="defAccount === 'super_admin'">
            <Divider dashed />
            <FormItem style="position: relative;" label="账户名称">
              <Input
                readonly
                :value="accontContent"
                placeholder="请选择账户"
                @on-focus="showMask('account', 50)"
              ></Input>
              <Input v-show="false" v-model="addForm.accountId"></Input>
              <Button
                @click="showMask('account', 50)"
                style="position: absolute; right: -60px; top: 1px; font-weight: bold; background: #86A1C1; color: #fff;"
              >· · ·</Button>
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
          <input type="text" name="userName" style="position: absolute;z-index: -99" />
          <input type="password" name="userPsw" style="position: absolute;z-index: -99" />
          <FormItem prop="userName" label="用户名称">
            <Input type="text" v-model="editForm.userName" placeholder="请输入用户名称"></Input>
          </FormItem>
          <FormItem prop="userPsw" label="用户密码">
            <Input type="password" v-model="editForm.userPsw" placeholder="用户密码不修改请留空"></Input>
          </FormItem>
          <FormItem prop="repeatPsw" label="重复密码">
            <Input type="password" v-model="editForm.repeatPsw" placeholder="请再次输入密码"></Input>
          </FormItem>
          <FormItem prop="nickName" label="昵称">
            <Input type="text" v-model="editForm.nickName" placeholder="请输入昵称"></Input>
          </FormItem>
          <FormItem v-if="defAccount === 'super_admin'" label="会议角色">
            <RadioGroup v-model="editForm.userType">
              <Radio :label="0">参会者</Radio>
              <Radio :label="1">主持人</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem v-if="defAccount === 'unit'" label="会议角色">{{addForm.userType ? '主持人': '参会者'}}</FormItem>
          <FormItem prop="mobile" label="手机号码">
            <Input type="text" v-model="editForm.mobile" placeholder="请输入手机号码"></Input>
          </FormItem>
          <FormItem prop="email" label="电子邮箱">
            <Input type="text" v-model="editForm.email" placeholder="请输入电子邮箱"></Input>
          </FormItem>
          <FormItem v-if="defAccount === 'super_admin'" label="用户状态">
            <RadioGroup v-model="editForm.status">
              <Radio :label="1">正常</Radio>
              <Radio :label="0">停用</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem prop="description" label="用户描述">
            <Input :rows="7" :maxlength="100" type="textarea" v-model="editForm.description" placeholder="请输入用户描述"></Input>
            <span class="font-tips">已输入 {{editForm.description ? editForm.description.length : 0}}/100 个字符</span>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="update">保存</Button>
          </FormItem>
        </Form>
      </Col>
    </Row>
    <!-- 实例开通页面 -->
    <MaskUsers
      @sendModal="getModal"
      @sendAccount="getAccount"
      @refreshExample="refreshEx"
      :editForm="editForm"
      :basicInfo="basicInfo"
    ></MaskUsers>
  </div>
</template>

<script>
import {
  getUserInfo,
  getIdentityCode,
  putUser,
  getAccountList,
  addUser,
  getUserExample,
  closeUser
} from '@/api/data'
import { defaultCoreCipherList } from 'constants'
import MaskUsers from './maskUsers'

export default {
  props: ['id', 'mode'],
  components: { MaskUsers },
  data() {
    const validateName = (rule, value, callback) => {
      const reg = /^[\u4e00-\u9fa5a-zA-Z]+$/
      if (!value) {
        callback(new Error('请输入用户名称'))
      } else if (!reg.test(value) || value.length < 2 || value.length > 16) {
        callback(new Error('长度为 2~16 个英文或中文字符'))
      } else {
        callback() // 不管结果如何都要返回一个值，不然就一直校验中，无法提交了。
      }
    }

    const validatePwd2 = (rule, value, callback) => {
      if (
        (!value && this.addForm.userPsw) ||
        (!value && this.editForm.userPsw)
      ) {
        callback(new Error('密码确认不能为空'))
      } else if (
        value === this.addForm.userPsw ||
        value === this.editForm.userPsw
      ) {
        callback()
      } else {
        callback(new Error('两次输入密码不一致!'))
      }
    }

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

    const validateEmail = (rule, value, callback) => {
      // 邮箱校验 只允许英文字母、数字、下划线、英文句号、以及中划线组成
      const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      // ^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$
      // 名称允许汉字、字母、数字，域名只允许英文域名
      if (value && !reg.test(value)) {
        callback(new Error('邮箱格式不正确'))
      } else {
        callback()
      }
    }

    const validatePwd = (rule, value, callback) => {
      const reg = /^[a-zA-Z0-9_@]+$/
      if (!value) {
        callback(new Error('请输入账户密码'))
      } else if (!reg.test(value) || value.length < 2 || value.length > 16) {
        callback(new Error('长度为 2~16 个英文字符、数字、@、_'))
      } else {
        callback()
      }
    }

    const validatePwd3 = (rule, value, callback) => {
      const reg = /^[a-zA-Z0-9_@]+$/
      if (!value) {
        callback()
      } else if (!reg.test(value) || value.length < 2 || value.length > 16) {
        callback(new Error('长度为 2~16 个英文字符、数字、@、_'))
      } else {
        callback()
      }
    }

    return {
      defAccount: '',
      accontContent: '',
      basicInfo: {},
      editForm: {
        description: ''
      },
      addForm: {
        userType: 0,
        description: ''
      },
      curMode: this.mode,
      modalAccount: false,
      accountData: [],
      exampleColumns: [{}],
      exampleData: [],
      rulesValidate: {
        userName: [
          { required: true, validator: validateName, trigger: 'blur' }
        ],
        userPsw: [{ required: true, validator: validatePwd, trigger: 'blur' }],
        repeatPsw: [
          { required: true, validator: validatePwd2, trigger: 'blur' }
        ],
        nickName: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        mobile: [
          { required: true, validator: validateMobile, trigger: 'blur' }
        ],
        email: [{ validator: validateEmail, trigger: 'blur' }],
        description: [{ max: 100, message: '最多为100个字符', trigger: 'blur' }]
      },
      rulesValidate2: {
        userName: [
          { required: true, validator: validateName, trigger: 'blur' }
        ],
        userPsw: [{ validator: validatePwd3, trigger: 'blur' }],
        repeatPsw: [{ validator: validatePwd2, trigger: 'blur' }],
        nickName: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        mobile: [
          { required: true, validator: validateMobile, trigger: 'blur' }
        ],
        email: [{ validator: validateEmail, trigger: 'blur' }],
        description: [{ max: 100, message: '最多为100个字符', trigger: 'blur' }]
      },
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
      exampleColumns: [
        {
          title: '实例ID/实例名称',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('div', params.row.instId),
              h('div', params.row.instName)
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
          title: '实例地址',
          align: 'center',
          key: 'serverHost'
        },
        {
          title: '用户容量',
          align: 'center',
          key: 'capacity'
        },
        {
          title: '操作',
          align: 'center',
          render: (h, params) => {
            return h(
              'Button',
              {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    // 选择当前信息后关闭模态框
                    this.$Modal.confirm({
                      title: '信息',
                      content: '<p>确定移除该实例吗？</p>',
                      onOk: () => {
                        this.remove(params.row.relationId)
                      }
                    })
                  }
                }
              },
              '移除实例'
            )
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
    }
  },
  methods: {
    // 刷新实例列表
    refreshEx() {
      this.getExample()
    },
    // 移除实例
    remove(id) {
      closeUser(id).then(res => {
        if (res.data.code === 200) {
          this.$Message.success(res.data.msg)
          this.getExample()
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    getAccount(data) {
      this.addForm.accountId = data[0].id
      this.accontContent = data[0].name
    },
    getModal(data) {
      this.basicInfo.type = data
    },
    showMask(type, width) {
      if (this.curMode === 'add') {
        this.$refs['addForm'].validate(valid => {
          if (valid) {
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
      if (this.defAccount !== 'super_admin') {
        this.addForm.userType = 0
      }
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          addUser(this.addForm).then(res => {
            if (res.data.code === 200) {
              this.$Message.success(res.data.msg)
              // 重置表单
              this.$refs['addForm'].resetFields()
              this.$router.push({
                name: 'users_page'
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
      if (this.defAccount !== 'super_admin') {
        this.editForm.userType = 0
      }
      this.rulesValidate2.userPsw[0].required = false
      this.rulesValidate2.repeatPsw[0].required = false
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          putUser(this.editForm).then(res => {
            if (res.data.code === 200) {
              this.$Message.success(res.data.msg)
              this.$router.push({ name: 'users_page' })
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
    // 获取用户相关实例, 最多三条，每个类型一个
    getExample() {
      if (this.id === '') {
        return
      }
      getUserExample(this.id).then(res => {
        if (!res.data.data) {
          this.exampleData = []
        } else {
          this.exampleData = res.data.data
        }
      })
    },
    // 获取用户信息，新增时无id传入，不查询
    getInfo() {
      if (!this.id) {
        return
      }
      getUserInfo(this.id).then(res => {
        if (res.data.code === 200) {
          this.editForm = res.data.data
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    }
  },
  mounted() {
    this.getInfo()
    this.getExample()
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
.detailChildTitle {
  display: inline-block;
  /* border-bottom: 2px solid #5fa1ee; */
  margin-bottom: 20px;
}
.link {
  color: blue;
}
</style>
