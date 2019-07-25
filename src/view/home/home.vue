<template>
  <div>
    <div style="height: 66px; line-height: 26px;">
      <h5 style="display: inline-block; margin-right: 20px;">HI,{{basicInfo.userName}}</h5>
      <span>用户状态/类型：{{basicInfo.status}}/{{basicInfo.access}}</span>
      <div>
        <span>今日，{{basicInfo.day}}</span>
      </div>
    </div>
    <div style="display: flex;">
      <div class="card-box" style="flex: 2; margin-right: 20px;">
        <div>
          <h3 class="detailTitle">今日数据</h3>
          <span style="float: right; font-weight: 500;">数据获取时间: {{basicInfo.time}}</span>
        </div>
        <i-col
          :xs="12"
          :md="8"
          :lg="6"
          v-for="(infor, i) in cardData"
          :key="`infor-${i}`"
          style="height: 80px; padding: 4px 10px;"
        >
          <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="28">
            {{infor.count}}
            <p>{{ infor.title }}</p>
          </infor-card>
        </i-col>
        <example :online="online" :call="call" style="height: 380px; margin-top: 130px; padding: 0px;" />
      </div>
      <div class="card-box" style="flex: 1; height: 600px; overflow: auto;">
        <div style="border-bottom: .5px solid #ccc; margin-bottom: 20px;">
          <h3 class="detailTitle" style="border: none;">消息中心</h3>
          <span class="showMore" @click="showMore">更多</span>
        </div>
        <div v-if="timeLineData.length === 0">暂无消息!</div>
        <Timeline>
          <TimelineItem v-for="(item, index) in timeLineData" :key="index">
            <div style="padding-left: 20px;">
              <div class="title">
                <span v-if="item.isTop" style=" color: #ff9900; position: absolute; left: 16px;">置顶</span>
                <span
                  v-if="!item.isTop && item.showNew"
                  style=" color: #ed4014; position: absolute; left: 24px;"
                >新</span>
                <span class="pot"></span>
                <h5 class="nowrap-content">
                  <span class="left-title" @click="view(item.id)">{{item.title}}</span>
                  <span
                    style="float: right; font-size: 10px; color: #333333; font-weight: 400;"
                  >{{item.updateTime}}</span>
                </h5>
              </div>
              <p class="content nowrap-content">{{item.content}}</p>
            </div>
          </TimelineItem>
        </Timeline>
      </div>
    </div>
  </div>
</template>

<script>
import { parseTime } from '@/libs/tools'
import InforCard from '_c/info-card'
import Example from './example.vue'
import { getMsgList, getCard } from '@/api/data'

export default {
  components: {
    InforCard,
    Example
  },
  data() {
    return {
      online: [],
      call: [],
      topArr: [],
      normalArr: [],
      searchForm: { pageNumber: 1 },
      basicInfo: {
        userName: '',
        status: '正常',
        access: '',
        day: parseTime(new Date(), '{y}年{m}月{d}日'),
        time: parseTime(new Date(), '{h}:{i}:{s}')
      },
      cardData: [
        {
          title: '用户在线',
          icon: 'md-desktop',
          count: 0,
          color: '#2d8cf0'
        },
        { title: '用户峰值', icon: 'md-stats', count: 0, color: '#19be6b' },
        {
          title: '拨打总量',
          icon: 'md-call',
          count: 0,
          color: '#ff9900'
        },
        { title: '通话总量', icon: 'md-headset', count: 0, color: '#ed3f14' }
      ],
      timeLineData: []
    }
  },
  created() {
    this.basicInfo.userName = this.$store.state.user.userName
    // 控制权限
    let access = this.$store.state.user.access
    if (access.includes('super_admin')) {
      this.basicInfo.access = '系统管理员'
    } else if (access.includes('company')) {
      this.basicInfo.access = '企业'
    } else if (access.includes('personal')) {
      this.basicInfo.access = '个人'
    } else {
      this.basicInfo.access = '其他'
    }
  },
  methods: {
    // 详情查看
    view(id) {
      this.$router.push({
        name: 'edit_msg',
        params: {
          id: id,
          mode: 'view',
          title: '消息详情',
          to: 'home'
        }
      })
    },
    // 获取卡片数据，包括图表数据
    getCardData() {
      getCard().then(res => {
        if (res.data.code === 200) {
          this.cardData[0].count = res.data.data.userOnlineCount
            ? res.data.data.userOnlineCount
            : 0
          this.cardData[1].count = res.data.data.userMaxOnlineCount
            ? res.data.data.userMaxOnlineCount
            : 0
          this.cardData[2].count = res.data.data.callCount
            ? res.data.data.callCount
            : 0
          this.cardData[3].count = res.data.data.communicateCount
            ? res.data.data.communicateCount
            : 0
          this.online = res.data.data.userOnlineVOS
          this.call = res.data.data.logCallStatisticsVOS
        }
      })
    },
    // 跳转更多
    showMore() {
      this.$router.push({
        name: 'msg_page'
      })
    },
    // ios 时间格式不能new date xxxx-xx-xx类型，需要转换下
    getDateDiff(time) {
      return time.replace(/\-/g, '/')
    },
    // 获取消息数据
    getMsgLists() {
      getMsgList(this.searchForm).then(res => {
        if (res.data.code === 200) {
          let arr = res.data.data
          arr.forEach(item => {
            // 最新15天数据显示新
            let now = new Date()
            let ago = new Date(now.getTime() - 15 * 24 * 3600 * 1000).getTime()
            let updateTime = new Date(item.updateTime).getTime()
            if (ago > updateTime) {
              item.showNew = false
            } else {
              item.showNew = true
            }
            item.content = item.content.replace(/<[^>]+>/g, '')
            item.updateTime = parseTime(this.getDateDiff(item.updateTime), '{y}.{m}.{d}')
            if (item.isTop) {
              this.topArr.push(item)
            } else {
              this.normalArr.push(item)
            }
          })
          // this.dataList.concat(arr) 该方法每次合并后豆薯保留原来的对象，造成空间浪费
          // this.timeLineData.push.apply(this.timeLineData, arr)
          this.timeLineData = this.topArr.concat(this.normalArr)
        }
      })
    }
  },
  mounted() {
    this.getMsgLists()
    this.getCardData()
  }
}
</script>

<style scoped>
.pot {
  display: inline-block;
  width: 9px;
  height: 9px;
  background: rgb(45, 140, 240);
  position: absolute;
  left: 2px;
  top: 5px;
  border-radius: 10px;
}
.showMore {
  float: right;
  color: rgb(45, 140, 240);
}
.showMore:hover {
  text-decoration: underline;
  cursor: pointer;
}
.nowrap-content {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.left-title {
  display: inline-block;
  width: 70%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.left-title:hover {
  cursor: pointer;
  color: rgb(45, 140, 240);
}
</style>
