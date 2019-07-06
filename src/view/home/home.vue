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
        <example style="height: 380px; margin-top: 130px; padding: 0px;" />
      </div>
      <div class="card-box" style="flex: 1;">
        <div style="border-bottom: .5px solid #ccc; margin-bottom: 20px;">
          <h3 class="detailTitle" style="border: none;">消息中心</h3>
          <span class="showMore" style>更多</span>
        </div>
        <div v-if="timeLineData.length === 0">暂无消息!</div>
        <Timeline>
          <TimelineItem v-for="(item, index) in timeLineData" :key="index">
            <div style="padding-left: 20px;">
              <div class="title">
                <span v-if="index === 0" style=" color: red; position: absolute; left: 24px;">新</span>
                <span class="pot"></span>
                <h5>
                  {{item.title}}
                  <span style="float: right; font-size: 10px; color: #c5c5c5; font-weight: 400;">{{item.time}}</span>
                </h5>
              </div>
              <p class="content">{{item.content}}</p>
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

export default {
  components: {
    InforCard,
    Example
  },
  data() {
    return {
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
      timeLineData: [
        // {
        //   title: 'sda',
        //   content: 'csdsas',
        //   time: parseTime(new Date(), '{y}.{m}.{d}')
        // },
        // {
        //   title: 'sda',
        //   content: 'csdsas',
        //   time: parseTime(new Date(), '{y}.{m}.{d}')
        // },
        // {
        //   title: 'sda',
        //   content: 'csdsas',
        //   time: parseTime(new Date(), '{y}.{m}.{d}')
        // },
        // {
        //   title: 'sda',
        //   content: 'csdsas',
        //   time: parseTime(new Date(), '{y}.{m}.{d}')
        // },
        // {
        //   title: 'sda',
        //   content: 'csdsas',
        //   time: parseTime(new Date(), '{y}.{m}.{d}')
        // }
      ]
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
</style>
