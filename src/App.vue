<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
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
  background-color: #3D6EE0;
}
</style>
