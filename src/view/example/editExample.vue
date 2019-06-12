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
      <Icon type="md-create"/>
    </a>
    <Row>
      <!-- 查看 -->
      <Col span="12" v-show="curMode === 'view'">
        <Form :label-width="120" style="min-width: 500px;">
          <FormItem label="实例名称">{{editForm.instName }}</FormItem>
          <FormItem label="实例类型">{{remoteType }}</FormItem>
          <FormItem label="实例描述">{{editForm.description }}</FormItem>
          <FormItem label="实例链接地址">{{editForm.host }}</FormItem>
          <FormItem label="实例端口号">{{editForm.port }}</FormItem>
          <FormItem label="定位服务链接地址">{{editForm.gpsHost }}</FormItem>
          <FormItem label="定位服务端口号">{{editForm.gpsPort }}</FormItem>
          <FormItem label="创建时间">{{editForm.createTime }}</FormItem>
          <FormItem label="运行状态">{{remoteStatus }}</FormItem>
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
          <FormItem prop="instName" label="实例名称">
            <Input type="text" v-model="addForm.instName" placeholder="请输入实例名称"></Input>
          </FormItem>
          <FormItem prop="instType" label="实例类型">
            <Select v-model="addForm.instType" @on-change="ifShowGps">
              <Option value="call">远程会议</Option>
              <Option value="gis">联情指挥</Option>
              <Option value="live">网络直播</Option>
            </Select>
          </FormItem>
          <FormItem label="实例描述">
            <Input type="textarea" v-model="addForm.description" placeholder="请输入实例描述"></Input>
          </FormItem>
          <FormItem prop="host" label="实例连接地址">
            <Input v-model="addForm.host" placeholder="请输入实例连接地址"></Input>
          </FormItem>
          <FormItem prop="port" label="实例端口号">
            <InputNumber style="width: 100%;" v-model="addForm.port" placeholder="请输入实例端口号"></InputNumber>
          </FormItem>
          <FormItem v-if="showGps" label="定位服务连接地址">
            <Input type="text" v-model="addForm.gpsHost" placeholder="请输入定位服务连接地址"></Input>
          </FormItem>
          <FormItem v-if="showGps" label="定位服务端口号">
            <InputNumber style="width: 100%;" v-model="addForm.gpsPort" placeholder="请输入定位服务端口号"></InputNumber>
          </FormItem>
        </Col>

        <!-- 判断是否管理员权限 -->
        <Divider dashed/>
        <Col span="12">
          <!-- <FormItem prop="accountId" label="账户Id">
            <Input type="text" v-model="addForm.accountId" placeholder="请输入账户Id"></Input>
          </FormItem>-->
          <FormItem label="账户id" v-if="defAccount === 'super_admin'">
            <Input readonly v-model="addForm.accountId" placeholder="点击选择" @on-focus="getAccount"></Input>
            <Icon class="addIcon" type="md-add"/>
          </FormItem>
          <FormItem label="频道所属账户" v-if="defAccount === 'unit'">
            <Input readonly v-model="curChannelDetail.account_name"></Input>
          </FormItem>

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
          <!-- <FormItem prop="accountPsw" label="账户密码">
            <Input type="password" v-model="editForm.accountPsw" placeholder="不修改密码请留空"></Input>
          </FormItem>-->
          <FormItem prop="instType" label="实例类型">
            <Select v-model="editForm.instType">
              <Option value="call">远程会议</Option>
              <Option value="gis">联情指挥</Option>
              <Option value="live">网络直播</Option>
            </Select>
          </FormItem>
          <FormItem label="实例描述">
            <Input type="textarea" v-model="editForm.description" placeholder="请输入实例描述"></Input>
          </FormItem>
          <FormItem porp="host" label="实例链接地址">
            <Input type="text" v-model="editForm.host" placeholder="请输入实例链接地址"></Input>
          </FormItem>
          <FormItem prop="port" label="实例端口号">
            <Input type="text" v-model="editForm.port" placeholder="请输入实例端口号"></Input>
          </FormItem>
          <FormItem label="定位服务连接地址">
            <Input type="text" v-model="editForm.gpsHost" placeholder="请输入定位服务连接地址"></Input>
          </FormItem>
          <FormItem label="定位服务端口号">
            <Input type="text" v-model="editForm.gpsPort" placeholder="请输入定位服务端口号"></Input>
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
  </div>
</template>

<script>
import {
  getExampleInfo,
  getIdentityCode,
  putAccount,
  addExample,
  getAccountList
} from '@/api/data'
import { defaultCoreCipherList } from 'constants'

export default {
  props: ['id', 'mode'],
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
      showGps: false,
      modalAccount: false,
      accountData: [],
      defAccount: '',
      editForm: {},
      addForm: {
        port: 1
      },
      editForm: {},
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
                    // this.addForm.instName = params.row.instName
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
          { required: true, message: '请输入实例类型', trigger: 'blur' }
        ],
        host: [
          { required: true, message: '请输入实例连接地址', trigger: 'blur' }
        ],
        port: [
          {
            type: 'number',
            required: true,
            // message: '请输入实例端口号',
            validator: validatePort,
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
        ]
      },
      rulesValidate2: {
        instName: [{ validator: validateName, trigger: 'blur' }],
        mobile: [{ validator: validateMobile, trigger: 'blur' }],
        identityCode: [
          { required: false, validator: validateCode, trigger: 'blur' }
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
    // 是否显示填写gps内容
    ifShowGps(val) {
      if (val === 'gis') {
        this.showGps = true
      } else {
        this.showGps = false
      }
    },
    // 账户列表获取
    getAccount() {
      this.modalAccount = true
      this.getAccountPage()
    },
    // 获取账户列表
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
    // 修改账户信息
    update() {
      // 判断手机号是否填写
      // if (this.editForm.mobile) {
      //   console.log('需要验证码')
      //   this.rulesValidate.identityCode[0].required = true
      // } else {
      //   this.rulesValidate.mobile[0].required = false
      // }
      let data = {
        id: this.editForm.id,
        instName: this.editForm.instName,
        accountPsw: '',
        instType: this.editForm.instType,
        companyName: this.editForm.companyName,
        description: this.editForm.description,
        imageUrl: '',
        email: this.editForm.email,
        mobile: this.editForm.mobile
      }
      if (this.editForm.mobile === this.defMobile) {
        data.mobile = null
        this.rulesValidate.mobile[0].required = false
      } else {
        this.rulesValidate.identityCode[0].required = true
      }
      // console.log(data)
      // return
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          putAccount(data).then(res => {
            if (res.data.code === 200) {
              this.$Message.success(res.data.msg)
              this.$router.push({ name: 'account_page' })
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
    // 获取用户信息，新增时无id传入，不查询
    getInfo() {
      if (this.id === '') {
        return
      }
      getExampleInfo(this.id).then(res => {
        if (res.data.code === 200) {
          this.editForm = res.data.data
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
</style>
