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
      <Col span="12" v-show="curMode === 'view'">
        <Form :label-width="80" style="min-width: 500px;">
          <FormItem label="账户名称">{{editForm.accountName }}</FormItem>
          <FormItem label="账户类型">{{remoteType }}</FormItem>
          <FormItem label="手机号码">{{editForm.mobile }}</FormItem>
          <FormItem label="企业名称">{{editForm.companyName }}</FormItem>
          <FormItem label="电子邮箱">{{editForm.email }}</FormItem>
          <FormItem label="创建时间">{{editForm.createTime }}</FormItem>
          <FormItem label="账户描述">{{editForm.description }}</FormItem>
          <!-- <FormItem label="账户状态">{{editForm.description }}</FormItem> -->
        </Form>
      </Col>
      <!-- 新增 -->
      <Col span="12" v-if="curMode === 'add'">
        <Form
          ref="addForm"
          :model="addForm"
          :rules="rulesValidate"
          :label-width="80"
          style="min-width: 500px;"
        >
          <input type="text" name="accountName" style="position: absolute;z-index: -99" />
          <input type="password" name="accountPsw" style="position: absolute;z-index: -99" />
          <FormItem prop="accountName" label="账户名称">
            <Input type="text" v-model="addForm.accountName" placeholder="请输入账户名称"></Input>
          </FormItem>
          <FormItem prop="accountPsw" label="账户密码">
            <Input type="password" v-model="addForm.accountPsw" placeholder="请输入账户密码"></Input>
          </FormItem>
          <FormItem prop="accountPsw2" label="重复密码">
            <Input type="password" v-model="addForm.accountPsw2" placeholder="请再次输入密码"></Input>
          </FormItem>
          <FormItem prop="accountType" label="账户类型">
            <Select v-model="addForm.accountType">
              <Option :value="0">系统管理员</Option>
              <Option :value="1">企业</Option>
              <Option :value="2">个人</Option>
            </Select>
            <!-- <Input type="text" v-model="addForm.accountType" placeholder="请输入账户类型"></Input> -->
          </FormItem>
          <FormItem prop="mobile" label="手机号码">
            <Input type="text" v-model="addForm.mobile" placeholder="请输入手机号码"></Input>
          </FormItem>
          <FormItem label="企业名称">
            <Input type="text" v-model="addForm.companyName" placeholder="请输入企业名称"></Input>
          </FormItem>
          <FormItem prop="email" label="电子邮箱">
            <Input type="text" v-model="addForm.email" placeholder="请输入电子邮箱"></Input>
          </FormItem>
          <FormItem prop="description" label="账户描述">
            <Input :rows="7" type="textarea" v-model="addForm.description" placeholder="请输入账户描述"></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="save">保存</Button>
          </FormItem>
        </Form>
      </Col>
      <!-- 编辑 -->
      <Col span="12" v-if="curMode === 'edit'">
        <Form
          ref="editForm"
          :model="editForm"
          :rules="rulesValidate2"
          :label-width="80"
          style="min-width: 500px;"
        >
          <input type="text" name="accountName" style="position: absolute;z-index: -99" />
          <input type="password" name="accountPsw" style="position: absolute;z-index: -99" />
          <FormItem prop="accountName" label="账户名称">
            <Input type="text" v-model="editForm.accountName" placeholder="请输入账户名称"></Input>
          </FormItem>
          <FormItem prop="accountPsw" label="账户密码">
            <Input type="password" v-model="editForm.accountPsw" placeholder="不修改账户密码请留空"></Input>
          </FormItem>
          <FormItem v-if="defAccount === 'unit'" prop="confirmAccountPsw" label="重复密码">
            <Input type="password" v-model="editForm.confirmAccountPsw"></Input>
          </FormItem>
          <FormItem v-if="defAccount === 'super_admin'" prop="accountType" label="账户类型">
            <Select v-model="editForm.accountType">
              <Option :value="0">系统管理员</Option>
              <Option :value="1">企业</Option>
              <Option :value="2">个人</Option>
            </Select>
          </FormItem>
          <FormItem
            v-if="defAccount !== 'super_admin'"
            label="账户类型"
          >{{editForm.accountType === 1 ? '企业' : '个人'}}</FormItem>
          <FormItem label="企业名称">
            <Input v-model="editForm.companyName" placeholder="请输入企业名称"></Input>
          </FormItem>
          <FormItem prop="description" label="账户描述">
            <Input :rows="7" type="textarea" v-model="editForm.description" placeholder="请输入账户描述"></Input>
          </FormItem>
          <!-- 预留功能 -->
          <!-- <FormItem label="自定义头像">
            <Input type="textarea" placeholder></Input>
          </FormItem>-->
          <FormItem prop="mobile" label="手机号码">
            <Input type="text" v-model="editForm.mobile" placeholder="请输入手机号码"></Input>
          </FormItem>
          <FormItem v-if="defAccount === 'unit'" prop="identityCode" label="验证码">
            <Row>
              <Col span="16">
                <Input v-model="editForm.identityCode" placeholder="请输入验证码"></Input>
              </Col>
              <Button
                @click="sendCode"
                style="float: right;"
                :disabled="btnAttr.type"
                type="primary"
              >{{btnAttr.btntxt}}</Button>
            </Row>
          </FormItem>
          <FormItem prop="email" label="电子邮箱">
            <Input type="text" v-model="editForm.email" placeholder="请输入电子邮箱"></Input>
          </FormItem>
          <FormItem v-if="defAccount === 'super_admin'" label="账户状态">
            <RadioGroup v-model="editForm.status">
              <Radio :label="1">正常</Radio>
              <Radio :label="0">禁用</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="update">保存</Button>
          </FormItem>
        </Form>
      </Col>
    </Row>
  </div>
</template>

<script>
import {
  getAccountInfo,
  getIdentityCode,
  putAccount,
  addAccount,
  putPersonalAccount
} from '@/api/data'
import { defaultCoreCipherList } from 'constants'

export default {
  props: ['id', 'mode'],
  data() {
    const validateName = (rule, value, callback) => {
      const reg = /^[\u4e00-\u9fa5a-zA-Z]+$/
      if (!value) {
        callback(new Error('请输入账户名称'))
      } else if (!reg.test(value) || value.length < 2 || value.length > 16) {
        callback(new Error('长度为 2~16 个英文或中文字符'))
      } else {
        callback() // 不管结果如何都要返回一个值，不然就一直校验中，无法提交了。
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

    const validatePwd2 = (rule, value, callback) => {
      const reg = /^[a-zA-Z0-9_@]+$/
      if (!value) {
        callback()
      } else if (!reg.test(value) || value.length < 2 || value.length > 16) {
        callback(new Error('长度为 2~16 个英文字符、数字、@、_'))
      } else {
        callback()
      }
    }

    const validatePass2 = (rule, value, callback) => {
      if (!value) {
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

    const validatePwd3 = (rule, value, callback) => {
      if (value === this.editForm.accountPsw || !this.editForm.accountPsw) {
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

    const validateType = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('请选择账户类型'))
      } else {
        callback()
      }
    }

    const validateCode = (rule, value, callback) => {
      if (!this.editForm.mobile) {
        callback(new Error('请先填写手机号'))
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
      time: 60,
      btnAttr: {
        btntxt: '发送验证码',
        type: false
      },
      defAccount: '',
      editForm: {},
      addForm: {},
      remoteType: '', // 详细展示账号类型
      curMode: this.mode,
      rulesValidate: {
        accountName: [
          { required: true, validator: validateName, trigger: 'blur' }
        ],
        accountPsw: [
          { required: true, validator: validatePwd, trigger: 'blur' }
        ],
        accountPsw2: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ],
        accountType: [
          {
            required: true,
            validator: validateType,
            trigger: 'change'
          }
        ],
        mobile: [
          { required: true, validator: validateMobile, trigger: 'blur' }
        ],
        email: [{ validator: validateEmail, trigger: 'blur' }],
        companyName: [{ max: 36, message: '最多为36个字符', trigger: 'blur' }],
        description: [{ max: 100, message: '最多为100个字符', trigger: 'blur' }]
      },
      rulesValidate2: {
        accountName: [
          { required: true, validator: validateName, trigger: 'blur' }
        ],
        accountPsw: [{ validator: validatePwd2, trigger: 'blur' }],
        confirmAccountPsw: [{ validator: validatePwd3, trigger: 'blur' }],
        mobile: [
          { required: true, validator: validateMobile, trigger: 'blur' }
        ],
        email: [{ validator: validateEmail, trigger: 'blur' }],
        identityCode: [{ validator: validateCode, trigger: 'blur' }],
        description: [{ max: 100, message: '最多为100个字符', trigger: 'blur' }]
      },
      btntxt: '发送验证码',
      codeType: false,
      time: 0,
      defMobile: '' // 编辑默认手机号，用来判断是否需要校验
    }
  },
  created() {
    if (this.curMode === 'view') {
    } else if (this.curMode === 'add') {
      this.rulesValidate.mobile[0].required = true
    } else if (this.curMode === 'edit') {
      this.defMobile = this.editForm.mobile
      this.rulesValidate.mobile[0].required = false
    } else {
      this.$router.push({
        name: 'account_page'
      })
    }
    // 控制权限
    let access = this.$store.state.user.access
    if (access.includes('super_admin')) {
      this.defAccount = 'super_admin'
    } else if (access.includes('company') || access.includes('personal')) {
      this.defAccount = 'unit'
    }
  },
  methods: {
    // 验证码计时器
    timer() {
      if (this.time > 1) {
        this.time--
        this.btnAttr.btntxt = '重发(' + this.time + 's)'
        this.btnAttr.type = true
        setTimeout(this.timer, 1000)
      } else {
        this.time = 0
        this.btnAttr.btntxt = '发送验证码'
        this.btnAttr.type = false
      }
    },
    // 新增提交
    save() {
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          addAccount(this.addForm).then(res => {
            if (res.data.code === 200) {
              this.$Message.success(res.data.msg)
              // 重置表单
              this.$refs['addForm'].resetFields()
              this.$router.push({
                name: 'account_page'
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
      if (this.defAccount === 'super_admin') {
        // 管理员更新
        let data = {
          id: this.editForm.id,
          accountName: this.editForm.accountName,
          accountPsw: this.editForm.accountPsw,
          accountType: this.editForm.accountType,
          companyName: this.editForm.companyName,
          description: this.editForm.description,
          imageUrl: '',
          email: this.editForm.email,
          mobile: this.editForm.mobile,
          status: this.editForm.status
        }
        if (this.editForm.mobile === this.defMobile) {
          data.mobile = null
          this.rulesValidate2.mobile[0].required = false
        } else {
          this.rulesValidate2.identityCode[0].required = true
        }
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
      } else {
        // 个人/企业更新
        let data = {
          id: this.editForm.id,
          accountName: this.editForm.accountName,
          accountPsw: this.editForm.accountPsw,
          confirmAccountPsw: this.editForm.confirmAccountPsw,
          accountType: this.editForm.accountType,
          companyName: this.editForm.companyName,
          description: this.editForm.description,
          imageUrl: '',
          email: this.editForm.email,
          mobile: this.editForm.mobile,
          identityCode: this.editForm.identityCode,
          status: this.editForm.status
        }
        if (this.editForm.mobile === this.defMobile) {
          data.mobile = null
          this.rulesValidate2.mobile[0].required = false
        } else {
          this.rulesValidate2.identityCode[0].required = true
        }
        this.$refs['editForm'].validate(valid => {
          if (valid) {
            putPersonalAccount(data).then(res => {
              if (res.data.code === 200) {
                this.$Message.success(res.data.msg)
                this.$router.push({ name: 'home' })
              } else {
                this.$Message.error(res.data.msg)
              }
            })
          }
        })
      }
    },
    // 验证码发送
    sendCode() {
      if (this.editForm.mobile === this.defMobile) {
        this.rulesValidate2.mobile[0].required = false
        this.$Message.error('手机号未修改！')
        return
      } else {
        this.rulesValidate2.identityCode[0].required = true
      }
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          this.time = 59
          this.timer()
          let data = {
            mobile: this.editForm.mobile,
            type: 3
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
      getAccountInfo(this.id).then(res => {
        if (res.data.code === 200) {
          this.editForm = res.data.data
          this.defMobile = this.editForm.mobile
          switch (this.editForm.accountType) {
            case 0:
              this.remoteType = '系统管理员'
              break
            case 1:
              this.remoteType = '企业'
              break
            case 2:
              this.remoteType = '个人'
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
</style>
