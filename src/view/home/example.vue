<template>
  <div ref="dom"></div>
</template>

<script>
import echarts from 'echarts'
import { on, off, parseTime } from '@/libs/tools'
import { randomBytes } from 'crypto'
export default {
  name: 'serviceRequests',
  props: ['online', 'call'],
  data() {
    return {
      dom: null,
      onlineData: [],
      callData: [],
      option: {},
      basicDateArr: []
    }
  },
  watch: {
    online(val) {
      // 获取当前时间到零点每隔5分钟的数据
      let basicInfo = this.getDateArray()
      let resultArr = []
      if (!val) return
      basicInfo.forEach((item, index) => {
        let tempArr = []
        let time = ''
        val.forEach((item2, index2) => {
          let tempArr = []
          if (item === item2.createTime) {
            time = item
            tempArr.push(new Date(item2.createTime.replace(/\-/g, '/')).getTime())
            tempArr.push(item2.onlineCount)
            resultArr.push(tempArr)
          }
        })
        // 如果以上已处理过的时间，则不再处理
        if (time !== item) {
          tempArr.push(new Date(item.replace(/\-/g, '/')).getTime())
          tempArr.push(0)
          resultArr.push(tempArr)
        }
      })
      // 添加一个24点点节点
      let startDate = new Date(new Date().setHours(0, 0, 0, 0)).getTime()
      let endDate = startDate + 24 * 3600 * 1000
      resultArr.push([endDate, 0])
      this.onlineData = resultArr
      this.option.series[0].data = this.onlineData
      this.dom.setOption(this.option, true)
    },
    call(val) {
      // 获取当前时间到零点每隔5分钟的数据
      let basicInfo = this.getDateArray()
      let resultArr = []
      if (!val) return
      basicInfo.forEach((item, index) => {
        let tempArr = []
        let time = ''
        val.forEach((item2, index2) => {
          let tempArr = []
          if (item === item2.callTime) {
            time = item
            tempArr.push(new Date(item2.callTime.replace(/\-/g, '/')).getTime())
            tempArr.push(item2.callCount)
            resultArr.push(tempArr)
          }
        })
        // 如果以上已处理过的时间，则不再处理
        if (time !== item) {
          tempArr.push(new Date(item.replace(/\-/g, '/')).getTime())
          tempArr.push(0)
          resultArr.push(tempArr)
        }
      })
      // 添加一个24点点节点
      let startDate = new Date(new Date().setHours(0, 0, 0, 0)).getTime()
      let endDate = startDate + 24 * 3600 * 1000
      resultArr.push([endDate, 0])
      this.callData = resultArr
      this.option.series[1].data = this.callData
      this.dom.setOption(this.option, true)
    }
  },
  methods: {
    getDateArray(startDate, endDate, space, type) {
      let endTime, mod
      if (!endDate) {
        endDate = new Date()
      }
      if (!startDate) {
        // 开始时间没有的话，处理为当前日期的0点
        startDate = new Date(new Date().setHours(0, 0, 0, 0)).getTime()
        // startDate = new Date(new Date().getTime() - 1 * 60 * 60 * 1000);
      }
      if (!space) {
        // 默认值5分钟
        space = 5 * 60 * 1000
      } else {
        space = space * 60 * 1000
      }
      if (type === 'before' || !type) {
        endTime = endDate.getTime()
      } else if (type === 'end') {
        endTime = endDate.getTime() + space * 60 * 1000
      }
      mod = endTime - startDate
      if (mod <= space) {
        return
        console.log('时间太短')
      }
      // 返回值
      let dateArray = []
      dateArray.push(parseTime(startDate))
      while (mod - space > -space) {
        var d = new Date()
        d.setTime(startDate + space)
        dateArray.push(parseTime(d))
        mod = mod - space
        startDate = startDate + space
      }
      return dateArray
    },
    resize() {
      this.dom.resize()
    }
  },
  mounted() {
    // 设置默认的初始值
    let startDate = new Date(new Date().setHours(0, 0, 0, 0)).getTime()
    let endDate = startDate + 24 * 3600 * 1000
    this.onlineData = [[startDate, 0], [endDate, 0]]
    this.callData = [[startDate, 0], [endDate, 0]]
    this.option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        formatter: params => {
          let str = ''
          str += `<div><p>${params[0].axisValueLabel.substring(0, 6)}</p><p>${
            params[0].marker
          }${params[0].seriesName}：${params[0].data[1]}</p><p>${
            params[1].marker
          }${params[1].seriesName}：${params[1].data[1]}</p></div>`
          return str
        }
      },
      legend: {
        data: ['用户在线', '通话数量']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'time',
          splitNumber: 6, // 5分钟一个
          splitLine: {
            show: false
          },
          minInterval: 1000 * 3600 * 2,
          maxInterval: 1000 * 2 * 3600,
          interval: 1000 * 3600 * 2,
          axisLabel: {
            formatter: function(value, index) {
              // 24点的时候特殊处理
              if (value === endDate) {
                return '24:00'
              }
              return parseTime(new Date(value), '{h}:{i}')
            }
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          boundaryGap: [0, '100%'],
          splitNumber: 5,
          splitLine: {
            show: false
          }
        }
      ],
      series: [
        {
          name: '用户在线',
          type: 'line',
          areaStyle: {
            opacity: 0.3
          },
          itemStyle: {
            normal: {
              color: '#ADC4FF'
            }
          },
          showSymbol: false,
          hoverAnimation: false,
          data: this.onlineData
        },
        {
          name: '通话数量',
          type: 'line',
          areaStyle: {
            opacity: 0.3
          },
          itemStyle: {
            normal: {
              color: '#7728CE'
            }
          },
          showSymbol: false,
          hoverAnimation: false,
          data: this.callData
        }
      ]
    }
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
