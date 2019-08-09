<template>
  <div class="bg">
    <img class="logo" src="../../assets/images/error-logo.png" alt="云上会面" />
    <img style="width: 100%;" :src="src" alt="error" />
    <div class="tips">当前路径token失效，请重新获取</div>
  </div>
</template>

<script>
import error from '@/assets/images/error-page/error-token.svg'
export default {
  data() {
    return {
      src: error
    }
  }
}
</script>

<style scoped>
.bg {
  width: 100vw;
  height: 100vh;
  background: #ccc;
}
.logo {
  position: absolute;
  width: 132px;
  height: 38px;
  left: 30px;
  top: 20px;
}
.tips {
  font-size: 38px;
  color: #2d4f7b;
  position: absolute;
  bottom: 10%;
  left: 50%;
  z-index: 2;
  transform: translate(-50%, 0);
}
</style>

