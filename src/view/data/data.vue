<template>
  <!-- 统计数据 -->
  <!-- <div>暂无数据</div> -->
  <div class="count">
    <div class="card-box search">
      <div class="search-left">
        <div class="btn-area">
          <div
            v-for="(item, index) in searchBtn"
            @click="searchForBtn(item.value, index)"
            :key="index"
            :class="{'search-btn': true, 'active': curBtn === index}"
          >{{item.name}}</div>
        </div>
        <DatePicker
          @on-change="selectTime"
          type="daterange"
          format="yyyy-MM-dd"
          :value="searchForm"
          :options="options"
          :clearable="false"
          placeholder="请选择时间区间"
          class="date-picker"
        ></DatePicker>
      </div>
      <div class="search-right">
        <div v-for="(item, index) in showItem" :key="index" class="show-item">
          <div class="time">{{item | formatData}}</div>
          <div class="title">{{item.title}}</div>
        </div>
      </div>
    </div>
    <div class="card-box content">
      <div style="width: 100%; height: 36px;"></div>
      <Tabs value="0" @on-click="selectTab">
        <TabPane label="通话时长" name="0">
          <div>
            <h3 style="padding: 10px 0px;">折线图统计</h3>
            <callTime
              :val="callTimeChart"
              :option="callTimeOption"
              style="height: 360px; width: 100%;"
            />
            <Divider />
            <h3 style="padding: 0px 0px 10px 0px;">表格统计</h3>
            <Table border :columns="callColumns" :data="callTimeList"></Table>
            <Page
              class="page"
              :current="page"
              :page-size="size"
              :total="count"
              @on-change="changePage"
            />
          </div>
        </TabPane>
        <TabPane label="在线用户" name="1">
          <div>
            <h3 style="padding: 10px 0px;">折线图统计</h3>
            <callTime :val="userChart" :option="userOption" style="height: 360px; width: 100%;" />
            <Divider />
            <h3 style="padding: 0px 0px 10px 0px;">表格统计</h3>
            <Table border :columns="userColumns" :data="userList"></Table>
            <Page
              class="page"
              :current="page"
              :page-size="size"
              :total="count"
              @on-change="changePage"
            />
          </div>
        </TabPane>
        <TabPane label="并发通话峰值" name="2">
          <h3 style="padding: 10px 0px;">折线图统计</h3>
          <callTime :val="apexChart" :option="apexOption" style="height: 360px; width: 100%;" />
          <Divider />
          <h3 style="padding: 0px 0px 10px 0px;">表格统计</h3>
          <Table border :columns="apexColumns" :data="apexList"></Table>
          <Page
            class="page"
            :current="page"
            :page-size="size"
            :total="count"
            @on-change="changePage"
          />
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>
import {
  getStatsCount,
  getCallLengthChart,
  getCallLengthData,
  getOnlineUserChart,
  getOnlineUserData,
  getCallApexChart,
  getCallApexData
} from '@/api/data'
import { getDateDiff, parseTime } from '@/libs/tools'
import callTime from './callTime'
import { log } from 'util'

export default {
  data() {
    return {
      endDate: '',
      xAxis24: [
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
              if (index === 12) {
                return '24:00'
              }
              return parseTime(new Date(value), '{h}:{i}')
            }
          }
        }
      ],
      xAxis: [
        {
          type: 'time',
          splitLine: {
            show: false
          },
          boundaryGap: false
        }
      ],
      apexChart: [],
      apexOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          top: '3%',
          left: '1.2%',
          right: '3%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'time',
            splitLine: {
              show: false
            },
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '通话总数',
            type: 'line',
            // stack: '总量',
            areaStyle: {
              opacity: 0.3
            },
            itemStyle: {
              normal: {
                color: '#ADC4FF'
              }
            },
            data: []
          }
        ]
      },
      apexList: [],
      apexColumns: [
        {
          title: '通话时间',
          key: 'time',
          align: 'center'
        },
        {
          title: '通话总数',
          key: 'callCount',
          align: 'center'
        }
      ],
      userChart: [],
      userOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          top: '3%',
          left: '1.2%',
          right: '3%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'time',
            splitLine: {
              show: false
            },
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '用户数量',
            type: 'line',
            // stack: '总量',
            areaStyle: {
              opacity: 0.3
            },
            itemStyle: {
              normal: {
                color: '#ADC4FF'
              }
            },
            data: []
          }
        ]
      },
      userList: [],
      userColumns: [
        {
          title: '通话时间',
          key: 'time',
          align: 'center'
        },
        {
          title: '用户数量',
          key: 'onlineCount',
          align: 'center'
        }
      ],
      callTimeChart: [],
      callTimeOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          top: '3%',
          left: '1.2%',
          right: '3%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'time',
            splitLine: {
              show: false
            },
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '通话时长',
            type: 'line',
            // stack: '总量',
            areaStyle: {
              opacity: 0.3
            },
            itemStyle: {
              normal: {
                color: '#ADC4FF'
              }
            },
            data: []
          }
        ]
      },
      callTimeList: [],
      callColumns: [
        {
          title: '通话时间',
          key: 'time',
          align: 'center'
        },
        {
          title: '通话时长',
          key: 'length',
          align: 'center'
        }
      ],
      page: 1,
      size: 10,
      count: 0,
      curTab: 0,
      curBtn: 0,
      searchBtn: [
        {
          name: '昨日',
          value: 1
        },
        {
          name: '近7日',
          value: 7
        },
        {
          name: '近30天',
          value: 30
        }
      ],
      searchForm: [],
      options: {
        disabledDate(date) {
          return (
            (date && date.valueOf() < Date.now() - 86400000 * 365) ||
            date.valueOf() > Date.now()
          )
        }
      },
      showItem: [
        {
          time: 0,
          title: '累计通话时长'
        },
        {
          count: 0,
          title: '累计通话总量'
        }
      ]
    }
  },
  components: { callTime },
  filters: {
    formatData: function(data) {
      if (data.time || data.time === 0) {
        let val = data.time
        if (val > 3600) {
          return (
            parseInt(val / 3600) + '小时' + parseInt((val % 3600) / 60) + '分钟'
          )
        } else if (val > 60) {
          return parseInt((val % 3600) / 60) + '分钟'
        } else if (val > 0) {
          return '0分钟'
        } else {
          return '0分钟'
        }
      } else if (data.count || data.count === 0) {
        return data.count + '条'
      }
    }
  },
  methods: {
    // 计算当前时间间隔
    timeInterval() {
      let startTime = new Date(getDateDiff(this.searchForm[0])).getTime()
      let endTime = new Date(getDateDiff(this.searchForm[1])).getTime()
      if (startTime === endTime) {
        endTime += 86400000
      }
      let ms = (endTime - startTime) / 288
      return ms
    },
    /**
     * 处理图数据节点，判断首尾是否要添加节点
     */
    handleChartData(arr, type) {
      if (!arr) return
      let startArr = arr[0][0]
      let startTimeMs = new Date(getDateDiff(this.searchForm[0])).getTime()
      let endArr = arr[arr.length - 1][0]
      let endTimeMs = new Date(getDateDiff(this.searchForm[1])).getTime()
      // 如果时间是24小时的话(昨日)，则特殊处理
      if (startTimeMs === endTimeMs) {
        this[type].xAxis = this.xAxis24
        endTimeMs += 86400000
      } else {
        this[type].xAxis = this.xAxis
      }
      let intervalMs = this.timeInterval() // 时间查询间隔 ms

      if (startArr - startTimeMs > intervalMs) {
        // 两者相差时间多于时间间隔，则前面添加两个点
        let firstDot = [startTimeMs, 0]
        let secondDot = [startArr - intervalMs, 0]
        arr.unshift(secondDot)
        arr.unshift(firstDot)
      } else if (startArr - startTimeMs > 0) {
        // 添加一个点
        let firstDot = [startTimeMs, 0]
        arr.unshift(firstDot)
      }

      if (endTimeMs - endArr > intervalMs) {
        // 两者相差时间多于时间间隔，则后面添加两个点
        let lastDot = [endTimeMs, 0]
        let lastSecondDot = [endArr + intervalMs, 0]
        arr.push(lastSecondDot)
        arr.push(lastDot)
      } else if (endTimeMs - endArr > 0) {
        let lastDot = [endTimeMs, 0]
        arr.push(lastDot)
      }
      return arr
    },
    changePage(curPage) {
      this.page = curPage
      this.updateData()
    },
    // 当前选中tab 的name 值
    selectTab(name) {
      this.page = 1
      this.count = 1
      this.curTab = parseInt(name)
      // 判断原tab 下是否有数据，没有数据则重新加载
      switch (parseInt(name)) {
        case 0:
          // 根据 list 长度重新处理 page size
          this.getCallLengthCharts()
          this.getCallLengthList()
          break
        case 1:
          this.getOnlineUserCharts()
          this.getOnlineUserList()
          break
        case 2:
          this.getCallApexCharts()
          this.getCallApexList()
          break
        default:
          break
      }
    },
    // datetimepicker
    selectTime(val, type) {
      this.searchForm = val
      // 判断时间是否满足左侧样式, some 方法会在第一个 return true 后停止遍历
      this.searchBtn.some((item, index) => {
        let lastday = this.getDateStr(-item.value)
        let yesterday = this.getDateStr(-1)
        let tempVal = [lastday, yesterday]
        if (
          tempVal[0] === this.searchForm[0] &&
          tempVal[1] === this.searchForm[1]
        ) {
          this.curBtn = index
          return true
        } else {
          this.curBtn = -1
        }
      })

      this.getStatsCounts()
      this.updateData()
    },
    // 点击按钮查询时间
    searchForBtn(val, index) {
      // 通过获取都val 值修改时间选择区间，触发查询条件。
      this.curBtn = index
      let lastday = this.getDateStr(-val)
      let yesterday = this.getDateStr(-1)
      this.searchForm[0] = lastday
      this.searchForm[1] = yesterday
      // 数组变化要主动通知
      this.$set(this.searchForm, 0, this.searchForm[0])
      this.$set(this.searchForm, 1, this.searchForm[1])
      // 主动查询
      this.getStatsCounts()
      this.updateData()
    },
    // 更新当前图表数据
    updateData() {
      switch (this.curTab) {
        case 0:
          // 通话时长
          this.getCallLengthCharts()
          this.getCallLengthList()
          break
        case 1:
          // 在线用户
          this.getOnlineUserCharts()
          this.getOnlineUserList()
          break
        case 2:
          // 并发通话峰值
          this.getCallApexCharts()
          this.getCallApexList()
          break
        default:
          break
      }
    },
    // 获取累计通话时长 累计通话总量
    getStatsCounts(params) {
      params ? params : (params = this.searchForm)

      let data = {
        startTime: params[0],
        endTime: params[1] + ' 23:59:59' // 时间处理加上时分秒 SQL查询需要
      }
      getStatsCount(data).then(res => {
        if (res.data.code === 200) {
          this.showItem[0].time = res.data.data.callTimeTotal
          this.showItem[1].count = res.data.data.callCountTotal
        }
      })
    },
    getCallApexCharts(params) {
      params ? params : (params = this.searchForm)

      let data = {
        startTime: params[0] + ' 00:00:00',
        endTime: params[1] + ' 23:59:59' // 时间处理加上时分秒 SQL查询需要
      }
      getCallApexChart(data).then(res => {
        if (res.data.code === 200) {
          if (res.data.data) {
            this.apexChart = []
            res.data.data.forEach(element => {
              let arr = []
              arr.push(new Date(getDateDiff(element.time)).getTime())
              arr.push(element.callCount)
              this.apexChart.push(arr)
            })
            this.apexChart = this.handleChartData(this.apexChart, 'apexOption')
            this.apexOption.series[0].data = this.apexChart
          } else {
            this.apexChart = []
            this.apexChart.push([])
            this.apexOption.series[0].data = this.apexChart
          }
        }
      })
    },
    getCallApexList(params) {
      params ? params : (params = this.searchForm)

      let data = {
        startTime: params[0] + ' 00:00:00',
        endTime: params[1] + ' 23:59:59', // 时间处理加上时分秒 SQL查询需要
        page: this.page,
        size: this.size
      }
      getCallApexData(data).then(res => {
        if (res.data.code === 200) {
          if (res.data.data.data) {
            this.page = res.data.data.pageNumber
            this.size = res.data.data.pageSize
            this.count = res.data.data.count
            this.apexList = res.data.data.data
          } else {
            this.page = 1
            this.count = 1
            this.apexList = []
          }
        }
      })
    },
    getOnlineUserCharts(params) {
      params ? params : (params = this.searchForm)

      let data = {
        startTime: params[0] + ' 00:00:00',
        endTime: params[1] + ' 23:59:59' // 时间处理加上时分秒 SQL查询需要
      }
      getOnlineUserChart(data).then(res => {
        if (res.data.code === 200) {
          if (res.data.data) {
            this.userChart = []
            res.data.data.forEach(element => {
              let arr = []
              arr.push(new Date(getDateDiff(element.time)).getTime())
              arr.push(element.onlineCount)
              this.userChart.push(arr)
            })
            this.userChart = this.handleChartData(this.userChart, 'userOption')
            this.userOption.series[0].data = this.userChart
          } else {
            this.userChart = []
            this.userChart.push([])
            this.userOption.series[0].data = this.userChart
          }
        }
      })
    },
    getOnlineUserList(params) {
      params ? params : (params = this.searchForm)

      let data = {
        startTime: params[0] + ' 00:00:00',
        endTime: params[1] + ' 23:59:59', // 时间处理加上时分秒 SQL查询需要
        page: this.page,
        size: this.size
      }
      getOnlineUserData(data).then(res => {
        if (res.data.code === 200) {
          if (res.data.data.data) {
            this.page = res.data.data.pageNumber
            this.size = res.data.data.pageSize
            this.count = res.data.data.count
            this.userList = res.data.data.data
          } else {
            this.page = 1
            this.count = 1
            this.userList = []
          }
        }
      })
    },
    // 获取通话时长图形统计显示
    getCallLengthCharts(params) {
      params ? params : (params = this.searchForm)

      let data = {
        startTime: params[0] + ' 00:00:00',
        endTime: params[1] + ' 23:59:59' // 时间处理加上时分秒 SQL查询需要
      }
      getCallLengthChart(data).then(res => {
        if (res.data.code === 200) {
          if (res.data.data) {
            this.callTimeChart = []
            res.data.data.forEach(element => {
              let arr = []
              // 2019-01-01 转 2019/01/01 兼容safari
              arr.push(new Date(getDateDiff(element.time)).getTime())
              arr.push(element.length)
              this.callTimeChart.push(arr)
            })
            this.callTimeChart = this.handleChartData(
              this.callTimeChart,
              'callTimeOption'
            )
            // this.callTimeOption.xAxis = this.xAxis24
            this.callTimeOption.series[0].data = this.callTimeChart
          } else {
            this.callTimeChart = []
            this.callTimeChart.push([])
            this.callTimeOption.series[0].data = this.callTimeChart
          }
        }
      })
    },
    // 获取通话时长表格显示
    getCallLengthList(params) {
      params ? params : (params = this.searchForm)

      let data = {
        startTime: params[0] + ' 00:00:00',
        endTime: params[1] + ' 23:59:59', // 时间处理加上时分秒 SQL查询需要
        page: this.page,
        size: this.size
      }
      getCallLengthData(data).then(res => {
        if (res.data.code === 200) {
          if (res.data.data.data) {
            this.page = res.data.data.pageNumber
            this.size = res.data.data.pageSize
            this.count = res.data.data.count
            this.callTimeList = res.data.data.data
          } else {
            this.page = 1
            this.count = 1
            this.callTimeList = []
          }
        }
      })
    },
    // 时间处理
    getDateStr(dayCount) {
      if (null == dayCount) {
        dayCount = 0
      }
      let dd = new Date()
      dd.setDate(dd.getDate() + dayCount) //设置日期
      let y = dd.getFullYear()
      let m =
        dd.getMonth() + 1 < 10
          ? '0' + '' + (dd.getMonth() + 1)
          : dd.getMonth() + 1 //获取当前月份的日期
      let d = dd.getDate() < 10 ? '0' + '' + dd.getDate() : dd.getDate()
      return y + '-' + m + '-' + d
    }
  },
  mounted() {
    // 时间默认值为昨天
    let yesterday = this.getDateStr(-1)
    this.searchForm = [yesterday, yesterday]

    this.getStatsCounts()
    this.getCallLengthCharts()
    this.getCallLengthList()
  }
}
</script>  

<style scoped>
.count {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.count .card-box {
  min-height: inherit;
}
.count .search {
  height: 74px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.count .content {
  flex: 1;
  /* overflow: hidden; */
}
.count .btn-area {
  height: 32px;
  box-sizing: border-box;
  display: inline-block;
  background: rgba(252, 250, 250, 1);
  border: 1px solid #e4e4e4;
  border-radius: 36px;
  display: flex;
  flex-direction: row;
  width: 212px;
  /* margin-right: 20px; */
}
.count .search-btn {
  height: 30px;
  width: 70px;
  display: inline-block;
  color: #999999;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-right: 1px solid #e4e4e4;
}
.count .search-btn.active {
  background: #4a90e2;
  color: #fff;
  position: relative;
  z-index: 99;
  height: 32px;
  margin-top: -1px;
}
.count .search-btn:first-child.active {
  border-radius: 30px 0px 0px 30px;
}
.count .search-btn:last-child.active {
  border-radius: 0px 30px 30px 0px;
}
.count .search-btn:last-child {
  border: none;
}
.count .search-btn:hover {
  cursor: pointer;
}
.count .date-picker {
  width: 200px;
  height: 34px;
}
.count .search-left,
.count .search-right {
  display: flex;
}
.count .search-left > div {
  margin-right: 20px;
}
.count .search-right > div {
  margin-left: 20px;
}
.count .show-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.count .show-item .time {
  font-size: 20px;
  color: #2671c9;
}
.count .show-item .title {
  color: #666666;
  font-size: 14px;
}
.count .page {
  display: flex;
  justify-content: center;
  padding-top: 10px;
}
</style>
