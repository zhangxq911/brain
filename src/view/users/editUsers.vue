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
          <Divider dashed />
          <h3 class="detailChildTitle">用户实例开通信息</h3>
          <!-- 最多三条，每个类型一条 -->
          <Row>
            <Button
              @click="exampleModal = true"
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
          <FormItem prop="mobile" label="手机号码">
            <Input type="text" v-model="addForm.mobile" placeholder="请输入手机号码"></Input>
          </FormItem>
          <FormItem prop="email" label="电子邮箱">
            <Input type="text" v-model="addForm.email" placeholder="请输入电子邮箱"></Input>
          </FormItem>
          <FormItem prop="description" label="用户描述">
            <Input type="textarea" v-model="addForm.description" placeholder="请输入用户描述"></Input>
          </FormItem>
          <div v-if="defAccount === 'super_admin'">
            <Divider dashed />
            <FormItem style="position: relative;" label="账户名称">
              <Input
                readonly
                v-model="addForm.accountName"
                placeholder="请选择账户"
                @on-focus="getAccount"
              ></Input>
              <Input v-show="false" v-model="addForm.accountId"></Input>
              <Button
                @click="getAccount"
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
          :rules="rulesValidate"
          :label-width="120"
          style="min-width: 500px;"
        >
          <FormItem prop="userName" label="用户名称">
            <Input type="text" v-model="editForm.userName" placeholder="请输入用户名称"></Input>
          </FormItem>
          <FormItem label="用户密码">
            <Input type="text" v-model="editForm.userPsw" placeholder="用户密码不修改请留空"></Input>
          </FormItem>
          <FormItem prop="userPsw2" label="重复密码">
            <Input type="text" v-model="editForm.userPsw2" placeholder="请再次输入密码"></Input>
          </FormItem>
          <FormItem label="昵称">
            <Input type="textarea" v-model="editForm.nickName" placeholder="请输入昵称"></Input>
          </FormItem>
          <FormItem prop="mobile" label="手机号码">
            <Input type="text" v-model="editForm.mobile" placeholder="请输入手机号码"></Input>
          </FormItem>
          <FormItem prop="email" label="电子邮箱">
            <Input type="text" v-model="editForm.email" placeholder="请输入电子邮箱"></Input>
          </FormItem>
          <FormItem label="用户状态">
            <RadioGroup v-model="editForm.status">
              <Radio :label="1">正常</Radio>
              <Radio :label="0">停用</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="用户描述">
            <Input type="textarea" v-model="editForm.description" placeholder="请输入用户描述"></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="update">保存</Button>
          </FormItem>
        </Form>
      </Col>
    </Row>
    <Modal v-model="modalAccount" :scrollable="true" title="账户选择">
      <Table style="margin-top:20px;" border :columns="accountColumns" :data="accountData.data"></Table>
      <h3 v-show="accountData.length == 0">当前没有账户可进行选择，请选择先添加账户！</h3>
      <div slot="footer">
        <Page
          v-show="accountData.length != 0"
          :current.sync="accountData.pageNumber"
          :page-size="accountData.pageSize"
          :total="accountData.totalPage"
        />
      </div>
    </Modal>
    <!-- 实例开通页面 -->
    <MaskUsers @sendModal="getModal" :exampleModal="exampleModal" :editForm="editForm"></MaskUsers>
  </div>
</template>

<script>
import {
  getUserInfo,
  getIdentityCode,
  putUser,
  getAccountList,
  addUser,
  getUserExample
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
        callback(new Error('这是必填字段'))
      } else if (!reg.test(value) || value.length < 2 || value.length > 16) {
        callback(new Error('长度为 2~16 个英文或中文字符'))
      } else {
        callback() // 不管结果如何都要返回一个值，不然就一直校验中，无法提交了。
      }
    }

    const validatePwd2 = (rule, value, callback) => {
      if (!value) {
        callback(new Error('密码确认不能为空'))
      } else if (value === this.addForm.userPsw) {
        callback()
      } else {
        callback(new Error('两次输入密码不一致!'))
      }
    }

    const validateMobile = (rule, value, callback) => {
      const reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/
      if (value && !reg.test(value)) {
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

    return {
      editForm: {},
      addForm: {},
      curMode: this.mode,
      modalAccount: false,
      accountData: [],
      exampleColumns: [{}],
      exampleData: [],
      exampleModal: false,
      rulesValidate: {
        userName: [
          { required: true, validator: validateName, trigger: 'blur' }
        ],
        userPsw: [
          { required: true, message: '请输入用户密码', trigger: 'blur' }
        ],
        repeatPsw: [
          { required: true, validator: validatePwd2, trigger: 'blur' }
        ],
        nickName: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        mobile: [{ validator: validateMobile, trigger: 'blur' }],
        email: [{ validator: validateEmail, trigger: 'blur' }]
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
            let val = params.row.instId + '/' + params.row.instName
            h('div', val)
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
          title: '登录名称',
          align: 'center',
          key: 'username'
        },
        {
          title: '登录密码',
          align: 'center',
          key: 'password'
        },
        {
          title: '操作',
          align: 'center',
          render: (h, params) => {
            return h(
              'span',
              {
                on: {
                  click: () => {
                    // 选择当前信息后关闭模态框
                    // this.addForm.accountId = params.row.id
                    // this.addForm.accountName = params.row.accountName
                    // this.modalAccount = false
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
  watch: {
    exampleModal: () => {
      if (this.exampleModal === false) {
        this.getExample()
      }
    }
  },
  methods: {
    // 监听子组件关闭mask变化
    getModal(data) {
      this.exampleModal = data
    },
    // 是否显示填写gps内容
    ifShowGps(val) {
      if (val === 'gis') {
        this.showGps = true
      } else {
        this.showGps = false
      }
    },
    // 列表获取
    getAccount() {
      this.modalAccount = true
      this.getAccountPage()
    },
    // 获取列表
    getAccountPage() {
      getAccountList({ page: 1 }).then(res => {
        if (res.status === 200 && res.data.data.data !== '') {
          this.accountData = res.data.data
        } else {
          console.log('账户列表获取失败')
        }
        this.loading = false
      })
    },
    // 新增提交
    save() {
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          // 定位服务端口号，后端未插入 FIXME
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
      // let data = {
      //   id: this.editForm.id,
      //   instName: this.editForm.instName,
      //   instType: this.editForm.instType,
      //   description: this.editForm.description,
      //   host: this.editForm.host,
      //   port: this.editForm.port,
      //   gpsHost: '',
      //   gpsPort: ''
      // }
      console.log('更新用户数据', this.editForm)
      return
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          putUser(this.editForm).then(res => {
            console.log('更新用户', res)
            // if (res.data.code === 200) {
            //   this.$Message.success(res.data.msg)
            //   this.$router.push({ name: 'example_page' })
            // } else {
            //   this.$Message.error(res.data.msg)
            // }
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
        // this.$router.push({
        //   name: 'users_page'
        // })
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
</style>
