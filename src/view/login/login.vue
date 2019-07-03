<style lang="less">
@import './login.less';
</style>

<template>
  <div class="login">
    <img class="login-logo" src="../../assets/images/logo.png" alt="智能中心">
    <div class="login-con">
      <Card icon="log-in" title="账号登录" :bordered="false">
        <div class="form-con">
          <login-form style="margin: 20px 0;" @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">
            <a href="javascript:void(0)" @click="forgetPwd">忘记密码</a>
            <a href="javascript:void(0)" @click="register">免费注册</a>
          </p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
export default {
  components: {
    LoginForm
  },
  methods: {
    // 忘记密码页面跳转
    forgetPwd() {
      this.$router.push({
        name: 'forget'
      })
    },
    // 注册账号页面跳转
    register() {
      this.$router.push({
        name: 'register'
      })
    },
    ...mapActions(['handleLogin']),
    handleSubmit({ userName, password }) {
      this.handleLogin({ userName, password }).then(res => {
        if (res.data.code === 200 && res.data.data.token !== null) {
          this.$router.push({
            name: this.$config.homeName
          })
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    }
  }
}
</script>

<style scoped>
.login-con {
  /* zoom: 1.2; */
}
</style>
