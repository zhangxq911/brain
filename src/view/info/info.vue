<template>
  <div class="basic-wrapper">
    <img class="login-logo" src="../../assets/images/logo.png" alt="智能中心" />
    <div class="card-box">
      <h2 style="text-align: center;">完善基本信息</h2>
      <Form
        class="basic-form"
        ref="formData"
        :model="formData"
        :rules="ruleValidate"
        :label-width="0"
      >
        <FormItem prop="accountName">
          <Input v-model="formData.accountName" placeholder="请输入账号名称"></Input>
        </FormItem>
        <FormItem>
          <Input v-model="formData.companyName" placeholder="请输入企业名称"></Input>
        </FormItem>
        <FormItem prop="email">
          <Input v-model="formData.email" placeholder="请输入您的邮箱"></Input>
        </FormItem>
        <FormItem prop="mobile">
          <Input v-model="formData.mobile" placeholder="请输入手机号码"></Input>
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
          <Button @click="save" style="width: 100%;" type="primary">提交</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
import { getIdentityCode, registered, savePerfectInfo } from '@/api/data'
import { callbackify } from 'util'

export default {
  data() {
    const validateAccount = (rule, value, callback) => {
      const reg = /^[\u4e00-\u9fa5a-zA-Z]+$/
      let data = {
        accountName: value
      }
      if (!value) {
        return callback(new Error('账户名称必填'))
      }
      registered(data).then(res => {
        if (res.data.code === 500) {
          callback(new Error(res.data.msg))
        } else {
          if (!value) {
            callback(new Error('账户名称必填'))
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
            callback(new Error('手机号码必填'))
          } else if (!reg.test(value)) {
            callback(new Error('手机号格式不正确'))
          } else {
            callback()
          }
        }
      })
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
      formData: {},
      ruleValidate: {
        accountName: [
          { required: true, validator: validateAccount, trigger: 'blur' }
        ],
        email: [{ required: true, validator: validateEmail, trigger: 'blur' }],
        mobile: [
          { required: true, validator: validateMobile, trigger: 'blur' }
        ],
        identityCode: [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    save() {
      this.ruleValidate.identityCode[0].required = true
      this.$refs['formData'].validate(valid => {
        if (valid) {
          savePerfectInfo(this.formData).then(res => {
            if (res.data.code === 200) {
              this.$router.push({
                name: 'home'
              })
              this.$Message.success(res.data.msg)
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
            type: 3
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
  },
  mounted() {
    this.$Notice.info({
      title: '完善基本信息',
      desc: '用户首次登录后需填写基本信息，后续登录不显示该页面。'
    })
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
