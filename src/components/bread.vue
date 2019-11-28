<template>
  <div class="bread">
    <div>
      <span @click="search(0, 'back')">通讯录</span>
      <span @click="search(item.oid, 'back')" v-for="item in data" :key="item.oid">/{{ item.name }}</span>
    </div>
  </div>
</template>

<script>
// import Bscroll from 'better-scroll'

export default {
  props: ['data'],
  methods: {
    search(oid, type) {
      let obj = {
        oid: oid,
        type: type
      }
      this.$emit('searchOid', obj)
    }
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.scroll = new Bscroll(this.$refs.wrapper, {
    //     scrollX: true,
    //     scrollY: false,
    //     click: true,
    //     mouseWhell: true
    //   })
    // })
  }
}
</script>

<style lang="scss" scoped>
.bread {
  width: 318px;
  overflow: hidden;
  // font-size: 14px;
  color: #4a90e2;
  white-space: nowrap;
}
// .bread span:first-child {
//   padding-left: 16px;
// }
.bread span {
  cursor: pointer;
}
.bread span:last-child {
  padding-right: 16px;
  color: #999999;
}
</style>
