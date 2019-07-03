<template>
  <div class="basic-wrapper">
    <img class="login-logo" src="../../assets/images/logo.png" alt="智能中心" />
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
        <Form ref="stepForm1" :model="stepForm1" :rules="ruleValidate1">
          <FormItem prop="user">
            <Input style="width: 400px;"></Input>
          </FormItem>
          <FormItem>
            <Button style="width: 100%;" type="primary" @click="type = 'step2'">下一步</Button>
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
          <FormItem>账号： xx</FormItem>
          <FormItem>手机号码： xx</FormItem>

          <FormItem prop="name">
            <Row>
              <Col span="16">
                <Input placeholder="请输入验证码"></Input>
              </Col>
              <Button style="float: right;" type="primary">发送验证码</Button>
            </Row>
          </FormItem>
          <FormItem prop="name">
            <Input placeholder="设置你的登录密码"></Input>
          </FormItem>
          <FormItem prop="name">
            <Input placeholder="请再次输入你的密码"></Input>
          </FormItem>
          <FormItem>
            <Button @click="type = 'step3'" style="width: 100%;" type="primary">确认</Button>
          </FormItem>
        </Form>
      </div>
      <div class="content-area success-area" v-if="type === 'step3'">
        <Icon class="success-icon" type="ios-checkmark-circle" />
        <h2 style="color: #2d8cf0;">修改成功</h2>
        <h3>账号： xx</h3>
        <Button style="width: 100%;" type="primary" @click="jumpToLogin">立即登录</Button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      type: 'step1',
      formData: {},
      ruleValidate: {},
      stepForm1: {},
      ruleValidate1: {}
    }
  },
  methods: {
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
