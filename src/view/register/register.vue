<template>
  <div class="basic-wrapper">
    <img class="login-logo" src="../../assets/images/logo.png" alt="智能中心" />
    <div class="card-box">
      <h2 style="text-align: center;">账号注册</h2>
      <Form
        class="basic-form"
        ref="formData"
        :model="formData"
        :rules="ruleValidate"
        :label-width="0"
      >
        <FormItem prop="accountName">
          <Input v-model="formData.accountName" placeholder="设置账号名称"></Input>
        </FormItem>
        <FormItem prop="accountPsw">
          <Input type="password" v-model="formData.accountPsw" placeholder="设置你的登录密码"></Input>
        </FormItem>
        <FormItem prop="repeatAccountPsw">
          <Input type="password" v-model="formData.repeatAccountPsw" placeholder="请再次输入你的密码"></Input>
        </FormItem>
        <FormItem prop="mobile">
          <Input v-model="formData.mobile" placeholder="请输入手机号"></Input>
        </FormItem>
        <FormItem prop="identityCode">
          <Row>
            <Col span="16">
              <Input @click="sendCode" v-model="formData.identityCode" placeholder="请输入验证码"></Input>
            </Col>
            <Button
              @click="sendCode"
              style="float: right;"
              :disabled="btnAttr.type"
              type="primary"
            >{{btnAttr.btntxt}}</Button>
          </Row>
        </FormItem>
        <FormItem>
          <Button @click="register" style="width: 100%;" type="primary">注册</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
import { getIdentityCode, register, registered } from '@/api/data'

export default {
  data() {
    const validateAccount = (rule, value, callback) => {
      const reg = /^[\u4e00-\u9fa5a-zA-Z]+$/
      let data = {
        accountName: value
      }
      registered(data).then(res => {
        if (res.data.code === 500) {
          callback(new Error(res.data.msg))
        } else {
          if (!value) {
            callback(new Error('请输入账户名称'))
          } else if (
            !reg.test(value) ||
            value.length < 2 ||
            value.length > 16
          ) {
            callback(new Error('长度为 2~16 个英文或中文字符'))
          } else {
            callback()
          }
        }
      })
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
      if (!value) {
        callback(new Error('请确认账户密码'))
      } else if (value === this.formData.accountPsw) {
        callback()
      } else {
        callback(new Error('两次输入密码不一致!'))
      }
    }

    const validateMobile = (rule, value, callback) => {
      const reg = 11 && /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/
      let data = {
        mobile: value
      }
      registered(data).then(res => {
        if (res.data.code === 500) {
          callback(new Error(res.data.msg))
        } else {
          if (!value) {
            callback(new Error('请输入手机号码'))
          } else if (!reg.test(value)) {
            callback(new Error('手机号格式不正确'))
          } else {
            callback()
          }
        }
      })
    }

    return {
      time: 60,
      btnAttr: {
        btntxt: '发送验证码',
        type: false
      },
      ruleValidate: {
        accountName: [
          { required: true, validator: validateAccount, trigger: 'blur' }
        ],
        accountPsw: [
          { required: true, validator: validatePwd, trigger: 'blur' }
        ],
        repeatAccountPsw: [
          { required: true, validator: validatePwd2, trigger: 'blur' }
        ],
        mobile: [
          { required: true, validator: validateMobile, trigger: 'blur' }
        ],
        identityCode: [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ]
      },
      formData: {}
    }
  },
  methods: {
    // 提交注册
    register() {
      this.ruleValidate.identityCode[0].required = true
      this.$refs['formData'].validate(valid => {
        if (valid) {
          register(this.formData).then(res => {
            if (res.data.code === 200) {
              this.$router.push({
                name: 'login'
              })
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
      this.$refs['formData'].validate(valid => {
        if (valid) {
          this.time = 60
          this.timer()
          let data = {
            mobile: this.formData.mobile,
            type: 1
          }
          getIdentityCode(data).then(res => {
            if (res.data.code === 200) {
              this.$Message.success(res.data.msg)
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        }
      })
    },
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
.basic-form {
  width: 400px;
  margin: 40px auto;
}
</style>
