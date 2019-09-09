<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    //在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem('store')) {
      this.$store.replaceState(
        Object.assign(
          {},
          this.$store.state,
          JSON.parse(sessionStorage.getItem('store'))
        )
      )
    }

    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('store', JSON.stringify(this.$store.state))
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
  background: #fff;
  box-shadow: 0px 4px 10px #cccccc;
  padding: 20px;
  width: 100%;
  height: 100%;
  overflow: auto;
  min-height: 600px;
  // display: flex;
  // flex-direction: column;
}
.detailTitle {
  display: inline-block;
  border-bottom: 2px solid #5fa1ee;
  margin-bottom: 20px;
}
.footerPage {
  position: relative;
  padding-top: 20px;
  text-align: center;
}
.pageMsg {
  position: absolute;
  left: 0;
  bottom: 12px;
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
  font-size: 32px;
  color: #c5c5c5;
  margin-left: 6px;
}
.refreshBtn:hover {
  color: #5fa1ee;
  cursor: pointer;
}
.mask {
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  position: absolute;
  z-index: 999;
  top: 0;
  left: 0;
}
.mask-left {
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
}
.mask-content {
  // width: 50vw;
  height: 100vh;
  overflow: auto;
  background: #fff;
  position: absolute;
  top: 0;
  right: 0;
}
.mask-title {
  font-size: 18px;
  padding: 10px;
  float: left;
}
.closeBtn {
  padding: 0;
  float: right;
  font-size: 50px;
  color: #e0e0e0;
}
.closeBtn:hover {
  cursor: pointer;
  color: #000;
}
.clickBtn {
  color: #5b8cff;
}
.clickBtn:hover {
  text-decoration: underline;
  cursor: pointer;
}
.basic-wrapper {
  width: 100%;
  height: 100%;
  background: rgba(246, 248, 254, 1);
  padding: 100px;
}
.basic-wrapper .ivu-input {
  border-radius: 0;
}
.del-select {
  color: #c5c5c5;
}
.del-select:hover {
  color: rgb(237, 64, 20);
  cursor: pointer;
  text-decoration: underline;
}
.show-more {
  font-size: 16px;
}
.show-more:hover {
  cursor: pointer;
  // color: #2d8cf0;
}
.tree-active {
  display: inline-block;
  width: 100%;
  // color: #fff;
  // font-size: 14px;
  height: 32px;
  line-height: 32px;
  margin-left: -12px;
  background: #d8e1ef;
}
.tree-padding {
  height: 32px;
  line-height: 32px;
}
.tree-active:hover {
  cursor: pointer;
}
.tree-active ~ .ivu-tree-arrow {
  color: #fff;
}
.tree-active > span,
.tree-active > i {
  margin-left: 12px;
}
.tree-active > div {
  margin-right: 3px;
}
.font-tips {
  position: absolute;
  right: -132px;
  bottom: -6px;
}
// 这个样式影响，select 日历
.ivu-select-dropdown {
  max-height: 300px !important;
}
.pwd-tips {
  position: absolute;
  top: 100%;
  left: 0;
  line-height: 1;
  padding-top: 6px;
  color: #969696;
}
.pwd-tips > span {
  color: #ed4014;
}
.count .date-picker .ivu-input {
  border-radius: 32px;
  color: #999999;
}
/*
  统计分析处理tab 固定，内容可滚动
*/
.count .content {
  display: flex;
  flex-direction: column;
}
.count .ivu-tabs {
  flex: 1;
  overflow: auto;
}
.count .ivu-tabs-bar {
  position: fixed;
  margin-top: -36px;
  // padding-top: 20px;
  background: #fff;
  z-index: 99;
}
// .count .ivu-tabs-content {
//   // margin-top: 46px;
// }
</style>
