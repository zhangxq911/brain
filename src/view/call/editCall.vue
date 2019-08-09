<template>
  <div class="card-box">
    <!-- <h3 class="detailTitle">通话详情</h3> -->
    <Row>
      <Col span="8" v-show="curMode === 'view'">
        <Form>
          <FormItem label="通话时间">{{editForm.callTime }}</FormItem>
          <FormItem label="通话时长">{{editForm.length }}</FormItem>
          <FormItem label="通话号码">{{editForm.calledTel }}</FormItem>
          <FormItem label="通话对象">{{editForm.calledName }}</FormItem>
          <FormItem label="通话类型">{{editForm.callType }}</FormItem>
          <FormItem label="用户">{{editForm.callerId }} / {{editForm.callerName }}</FormItem>
          <FormItem
            v-if="defAccount === 'super_admin'"
            label="账户"
          >{{editForm.accountId }} / {{editForm.accountName }}</FormItem>
        </Form>
      </Col>
      <Col span="8" v-show="curMode === 'view'">
        <Form>
          <FormItem label="应答时间">{{editForm.answerTime }}</FormItem>
        </Form>
      </Col>
      <Col span="8" v-show="curMode === 'view'">
        <Form>
          <FormItem label="结束时间">{{editForm.endTime }}</FormItem>
        </Form>
      </Col>
    </Row>
  </div>
</template>

<script>
import { getCallInfo } from '@/api/data'
import { formatSeconds } from '@/libs/tools'

export default {
  props: ['id', 'mode'],
  data() {
    return {
      curMode: this.mode,
      editForm: {}
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
      getCallInfo(this.id).then(res => {
        if (res.data.code === 200) {
          this.editForm = res.data.data
          switch (this.editForm.callType) {
            case 1:
              this.editForm.callType = '语音通话'
              break
            case 2:
              this.editForm.callType = '视频通话'
              break
            case 3:
              this.editForm.callType = '语音对讲'
              break
            case 4:
              this.editForm.callType = '视频对讲'
              break
            case 5:
              this.editForm.callType = '语音会议'
              break
            case 6:
              this.editForm.callType = '视频会议'
              break
            default:
              break
          }
          this.editForm.length = formatSeconds(this.editForm.length)
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
