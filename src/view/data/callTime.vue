<template>
  <div ref="dom"></div>
</template>

<script>
import echarts from 'echarts'
import { on, off } from '@/libs/tools'
export default {
  props: ['val', 'option'],
  data() {
    return {
      dom: null
    }
  },
  watch: {
    val: {
      handler(newVal, oldVal) {
        for (let i = 0; i < newVal.length; i++) {
          if (oldVal[i] != newVal[i]) {
            // console.log('图表更新')
            this.dom.setOption(this.option)
            return
          }
        }
      },
      deep: true
    }
  },
  methods: {
    resize() {
      this.dom.resize()
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.dom = echarts.init(this.$refs.dom)
      this.dom.setOption(this.option)
      on(window, 'resize', this.resize)
    })
  },
  beforeDestroy() {
    off(window, 'resize', this.resize)
  }
}
</script>
