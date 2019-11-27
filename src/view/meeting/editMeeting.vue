<template>
  <div class="meet-box">
    <div class="card-box">
      <h3 class="detailTitle">基本信息</h3>
      <a class="editBtn" href="javascript:void(0)">
        编辑
        <Icon type="md-create" />
      </a>
      <Row>
        <Form :label-width="80" style="min-width: 500px;">
          <FormItem label="会议主题">{{editForm.meetingSubject }}</FormItem>
          <FormItem :label="`参会人员(${editForm.participantInfoDOS.length + 1})`">
            <div style="display: flex; flex-wrap: wrap; padding-top: 10px;">
              <div class="attendee">
                <div class="host-label">主持人</div>
                <div v-if="!editForm.hostDisplayPhoto" class="avatar" :style="avatarSelect"></div>
                <div
                  v-else
                  class="avatar"
                  :style="{backgroundImg: `url(${editForm.hostDisplayPhoto})`, backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat'}"
                ></div>
                <div class="name">{{editForm.hostName}}</div>
                <div class="org">部门</div>
              </div>
              <div class="attendee" v-for="item in editForm.participantInfoDOS" :key="item.uid">
                <div v-if="!item.displayPhoto" class="avatar" :style="avatarSelect"></div>
                <div
                  v-else
                  class="avatar"
                  :style="{backgroundImg: `url(${item.displayPhoto})`, backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat'}"
                ></div>
                <div class="name">{{item.name}}</div>
                <div class="org">部门</div>
              </div>
            </div>
          </FormItem>
          <FormItem label="会议类型">{{editForm.meetingType | filterType }}</FormItem>
          <FormItem label="会议时间">{{meetingTime }}</FormItem>
          <FormItem label="会议备注">{{editForm.remark }}</FormItem>
        </Form>
      </Row>
    </div>
    <div class="card-box">
      <h3 class="detailTitle"></h3>
      <Row>
        <Form>
          <FormItem label="分享">二维码</FormItem>
        </Form>
      </Row>
    </div>
  </div>
</template>

<script>
import { getMeetInfo } from '@/api/data'
import { getDateDiff } from '@/libs/tools'

export default {
  props: ['id', 'mode'],
  data() {
    return {
      editForm: {
        startTime: '',
        endTime: '',
        meetingSubject: '',
        meetingType: 0,
        hostId: '',
        hostDisplayPhoto: '',
        hostName: '',
        participantsIds: '',
        remark: '',
        participantInfoDOS: []
      },
      meetingTime: '',
      avatarSelect: {
        backgroundImage:
          'url(' + require('@/assets/images/avatar-select.png') + ')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%'
      }
    }
  },
  filters: {
    filterType: function(val) {
      return val ? '语音会议' : '视频会议'
    }
  },
  methods: {
    getInfo() {
      if (this.id === '') {
        return
      }
      getMeetInfo(this.id).then(res => {
        if (res.data.code === 200) {
          this.editForm = res.data.data
          // 处理会议时间
          let startTime = this.editForm.startTime
          let endTime = this.editForm.endTime
          let week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
          let startDate = new Date(getDateDiff(startTime))
          let endDate = new Date(getDateDiff(endTime))
          this.meetingTime =
            getDateDiff(startTime.slice(0, 10)) +
            '(' +
            week[startDate.getDay()] +
            ')' +
            startTime.substring(10, startTime.length - 3) +
            ' - ' +
            getDateDiff(endTime.slice(0, 10)) +
            '(' +
            week[endDate.getDay()] +
            ')' +
            endTime.substring(10, endTime.length - 3)
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    }
  },
  mounted() {
    this.getInfo()
  }
}
</script>

<style scoped>
.meet-box {
  display: flex;
}
.editBtn {
  padding-left: 24px;
}
.card-box:nth-child(1) {
  flex: 3;
  margin-right: 6px;
}
.card-box:nth-child(2) {
  flex: 2;
}
.attendee {
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.attendee .host-label {
  position: absolute;
  top: -16px;
  font-size: 10px;
  color: #666666;
}
.attendee .avatar {
  width: 36px;
  height: 36px;
  border-radius: 100%;
}
.attendee .name {
  font-size: 14px;
  font-weight: 500;
}
.attendee .org {
  font-size: 10px;
  color: #999999;
  position: relative;
  top: -14px;
}
</style>
