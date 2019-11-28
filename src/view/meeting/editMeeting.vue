<template>
  <div class="meet-box">
    <div class="card-box">
      <h3 class="detailTitle">基本信息</h3>
      <a
        v-if="this.defAccount === 'unit'"
        class="editBtn"
        href="javascript:void(0)"
        @click="showMask('editMeeting', 50, id)"
      >
        编辑
        <Icon type="md-create" />
      </a>
      <Row>
        <Form :label-width="80" style="min-width: 500px;">
          <FormItem label="会议主题">{{editForm.meetingSubject }}</FormItem>
          <FormItem
            v-if="editForm.participantInfoDOS"
            :label="`参会人员(${editForm.participantInfoDOS.length + 1})`"
          >
            <div style="display: flex; flex-wrap: wrap; padding-top: 10px;">
              <div class="attendee">
                <div class="host-label">主持人</div>
                <div v-if="!editForm.hostDisplayPhoto" class="avatar" :style="avatarSelect"></div>
                <div
                  v-else
                  class="avatar"
                  :style="{backgroundImage: `url(http://oss.imbcloud.cn/image/${editForm.hostDisplayPhoto})`, backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat'}"
                ></div>
                <div class="name">{{editForm.hostName}}</div>
                <div class="org">{{editForm.hostOrganizationName}}</div>
              </div>
              <div class="attendee" v-for="item in editForm.participantInfoDOS" :key="item.uid">
                <div v-if="!item.displayPhoto" class="avatar" :style="avatarSelect"></div>
                <div
                  v-else
                  class="avatar"
                  :style="{backgroundImage: `url(http://oss.imbcloud.cn/image/${item.displayPhoto})`, backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat'}"
                ></div>
                <div class="name">{{item.name}}</div>
                <div class="org">{{item.organizationName}}</div>
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
        <div class="share-title">分享：</div>
        <div class="share-content">
          <div class="qrcode">
            <VueQrcode
              tag="img"
              :value="shareUri"
              style="padding: 26px;"
              :options="{ size: 126, background: '#F3F7FD' }"
            ></VueQrcode>
          </div>
          <div class="qrcode-discription">手机扫码分享</div>
          <div class="link">
            <Input style="padding-right: 20px;" v-model="shareUri">
              <span style="padding: 0 10px; color: #999999;" slot="prepend">链接</span>
            </Input>
            <Button type="primary" v-clipboard="clipOptions">复制链接</Button>
          </div>
        </div>
      </Row>
    </div>
    <MaskMeeting @sendModal="getModal" @resetPage="getInfo" :basicInfo="basicInfo"></MaskMeeting>
  </div>
</template>

<script>
import { getMeetInfo } from '@/api/data'
import { getDateDiff } from '@/libs/tools'
import VueQrcode from '@xkeshi/vue-qrcode'
import MaskMeeting from './maskMeeting'

export default {
  components: { VueQrcode, MaskMeeting },
  props: ['id', 'mode'],
  data() {
    return {
      defAccount: '',
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
      },
      shareUri: '',
      basicInfo: {}
    }
  },
  filters: {
    filterType: function(val) {
      return val ? '语音会议' : '视频会议'
    }
  },
  computed: {
    clipOptions() {
      return {
        value: this.shareUri,
        success: e => {
          this.$Message.success('复制成功')
        },
        error: () => {
          this.$Message.error('复制失败')
        }
      }
    }
  },
  created() {
    // 控制权限
    let access = this.$store.state.user.access
    if (access.includes('super_admin')) {
      this.defAccount = 'super_admin'
    } else if (access.includes('company') || access.includes('personal')) {
      this.defAccount = 'unit'
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
          // 分享链接
          this.shareUri = location.origin + '/h5/#/share/' + res.data.data.id
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
    },
    showMask(type, width, id) {
      // 新增要填写基本信息后才能选择，否则选择页面相关字段为空值
      this.basicInfo = {
        type: type,
        width: width,
        id: id
      }
    },
    getModal(data) {
      this.basicInfo.type = data
    }
  },
  mounted() {
    this.getInfo()
  }
}
</script>

<style lang="scss" scoped>
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
.share-title {
  font-weight: 500;
}
.share-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .qrcode-discription {
    font-weight: 500;
  }
  .link {
    display: flex;
    width: 100%;
    margin-top: 50px;
  }
}
</style>
