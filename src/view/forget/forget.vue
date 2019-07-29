<template>
  <div class="basic-wrapper">
    <img class="login-logo" src="../../assets/images/logo.png" alt="云上会面" />
    <div class="card-box">
      <div class="content-area" v-if="type === 'step1'">
        <h2 style="text-align: center;">忘记密码</h2>
        <div class="tips">
          <Icon
            style="color: #2d8cf0; font-size: 16px; position: relative; top: -1px;"
            type="md-alert"
          />
          <span>&nbsp;请输入您的账号或手机号码，以进行密码重设</span>
        </div>
        <Form ref="stepForm1" :model="stepForm1" :rules="ruleValidate1" @submit.native.prevent>
          <FormItem prop="account">
            <Input style="width: 400px;" v-model="stepForm1.account" @on-enter="validate1"></Input>
          </FormItem>
          <FormItem>
            <Button style="width: 100%;" type="primary" @click="validate1">下一步</Button>
          </FormItem>
        </Form>
      </div>
      <div class="content-area" v-if="type === 'step2'">
        <h2 style="text-align: center;">忘记密码</h2>
        <Form
          class="basic-form"
          ref="formData"
          :model="formData"
          :rules="ruleValidate"
          :label-width="0"
        >
          <FormItem>账号： {{formData.accountName}}</FormItem>
          <FormItem>手机号码： {{curMobile}}</FormItem>
          <FormItem prop="identityCode">
            <Row>
              <Col span="16">
                <Input v-model="formData.identityCode" placeholder="请输入验证码"></Input>
              </Col>
              <Button
                @click="sendCode"
                style="float: right;"
                :disabled="btnAttr.type"
                type="primary"
              >{{btnAttr.btntxt}}</Button>
            </Row>
          </FormItem>
          <FormItem prop="password">
            <Input type="password" v-model="formData.password" placeholder="设置你的登录密码"></Input>
            <div v-show="pwdTip" class="pwd-tips">
              <span>弱:</span>
              试试字母、数字和标点混合
            </div>
          </FormItem>
          <FormItem prop="repeatPassword">
            <Input
              @on-enter="save"
              type="password"
              v-model="formData.repeatPassword"
              placeholder="请再次输入你的密码"
            ></Input>
          </FormItem>
          <FormItem>
            <Button @click="save" style="width: 100%;" type="primary">确认</Button>
          </FormItem>
        </Form>
      </div>
      <div class="content-area success-area" v-if="type === 'step3'">
        <Icon class="success-icon" type="ios-checkmark-circle" />
        <h2 style="color: #2d8cf0;">修改成功</h2>
        <h3>账号： {{formData.accountName}}</h3>
        <Button style="width: 100%;" type="primary" @click="jumpToLogin">立即登录</Button>
      </div>
    </div>
  </div>
</template>

<script>
import { isExitsAccount, getIdentityCode, forget } from '@/api/data'

export default {
  data() {
    const validateAccount = (rule, value, callback) => {
      let data = {
        account: value
      }
      isExitsAccount(data).then(res => {
        if (res.data.code === 200) {
          this.formData.accountName = res.data.data.accountName
          this.formData.mobile = res.data.data.mobile
          this.curMobile = this.formData.mobile.replace(
            /(\d{3})\d{4}(\d{4})/,
            '$1****$2'
          )
          callback()
        } else {
          callback(new Error(res.data.msg))
        }
      })
    }

    const validatePwd = (rule, value, callback) => {
      const reg = /^[a-zA-Z0-9_@]+$/
      if (!value) {
        this.pwdTip = false
        callback()
      } else if (!reg.test(value) || value.length < 6 || value.length > 16) {
        this.pwdTip = false
        callback(new Error('长度为 6~16 个英文字符、数字、@、_'))
      } else if (Number.isInteger(+value)) {
        this.pwdTip = true
        callback()
      } else {
        this.pwdTip = false
        callback()
      }
    }

    const validatePwd2 = (rule, value, callback) => {
      if (!value) {
        callback()
      } else if (value === this.formData.password) {
        callback()
      } else {
        callback(new Error('两次输入密码不一致!'))
      }
    }

    return {
      pwdTip: false,
      time: 60,
      btnAttr: {
        btntxt: '发送验证码',
        type: false
      },
      type: 'step1',
      formData: {},
      curMobile: '',
      ruleValidate: {
        identityCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePwd, trigger: 'change' },
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        repeatPassword: [
          { required: true, validator: validatePwd2, trigger: 'blur' },
          { required: true, message: '请输入重复密码', trigger: 'blur' }
        ]
      },
      stepForm1: {},
      ruleValidate1: {
        account: [
          { required: true, validator: validateAccount, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 提交修改
    save() {
      this.$refs['formData'].validate(valid => {
        if (valid) {
          forget(this.formData).then(res => {
            if (res.data.code === 200) {
              this.type = 'step3'
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        }
      })
    },
    // 发送验证码
    sendCode() {
      // 验证码不校验
      this.ruleValidate.identityCode[0].required = false
      this.ruleValidate.password[1].required = false
      this.ruleValidate.repeatPassword[1].required = false
      this.$refs['formData'].validate(valid => {
        if (valid) {
          this.time = 60
          this.timer()
          let data = {
            mobile: this.formData.mobile,
            type: 2
          }
          getIdentityCode(data).then(res => {
            if (res.data.code === 200) {
              this.$Message.success(res.data.msg)
              this.ruleValidate.password[1].required = true
              this.ruleValidate.repeatPassword[1].required = true
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        }
      })
    },
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
    // 忘记密码下一步
    validate1() {
      this.$refs['stepForm1'].validate(valid => {
        if (valid) {
          this.type = 'step2'
        }
      })
    },
    jumpToLogin() {
      this.$router.push({
        name: 'login'
      })
    }
  }
}
</script>

<style scoped>
.login-logo {
  width: 132px;
  height: 40px;
  position: absolute;
  top: 10px;
  left: 20px;
}
.card-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 60px;
}
.content-area {
  width: 400px;
}
.success-area {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.success-icon {
  font-size: 68px;
  color: #2d8cf0;
}
</style>
