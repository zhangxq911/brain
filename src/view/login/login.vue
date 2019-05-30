<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <img class="login-logo" src="../../assets/images/logo.png" alt="智能中心">
    <div class="login-con">
      <Card icon="log-in" title="账号登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">
            <a href="javascript:void(0)">忘记密码</a>
            <a href="javascript:void(0)">免费注册</a>
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
    ...mapActions([
      'handleLogin'
    ]),
    handleSubmit ({ userName, password }) {
      this.handleLogin({ userName, password }).then(res => {
        console.log(res)
        if (res.code === 200) {
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

<style>

</style>
