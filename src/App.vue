<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    //在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem("store") ) {
        this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem("store"))))
    } 

    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload",()=>{
        sessionStorage.setItem("store",JSON.stringify(this.$store.state))
    })
  }
}
</script>

<style lang="less">
.size {
  width: 100%;
  height: 100%;
}
html,
body {
  .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  .size;
}
.ivu-btn-primary {
  background-color: #5b8cff;
}
.ivu-btn-primary:active {
  background-color: #3d6ee0;
}
.card-box {
  width: 100%;
  background: #fff;
  box-shadow: 0px 4px 10px #cccccc;
  padding: 20px;
}
.detailTitle {
  display: inline-block;
  border-bottom: 2px solid #5fa1ee;
  margin-bottom: 20px;
}
.footerPage {
  padding-top: 20px;
  text-align: center;
}
.ivu-form .ivu-form-item-label {
  font-weight: bold;
}
.ivu-input-wrapper textarea.ivu-input {
  font-size: 12px;
}
.hoverAccount:hover {
  text-decoration: underline;
  cursor: pointer;
}
.refreshBtn {
  font-size: 32px; color: #c5c5c5;
  margin-left: 6px;
}
.refreshBtn:hover {
  color: #5fa1ee;
  cursor: pointer;
}
</style>
