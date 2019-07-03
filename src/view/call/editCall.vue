<template>
  <div class="card-box">
    <h3 class="detailTitle">通话详情</h3>
    <Row>
      <Col span="8" v-show="curMode === 'view'">
        <FormItem label="通话时间">{{editForm.callTime }}</FormItem>
        <FormItem label="通话时长">{{editForm.length }}</FormItem>
        <FormItem label="通话号码">{{editForm.calledTel }}</FormItem>
        <FormItem label="通话对象">{{editForm.calledName }}</FormItem>
        <FormItem label="通话类型">{{editForm.callType }}</FormItem>
        <FormItem label="用户名称">{{editForm.calledName }}</FormItem>
        <FormItem label="账户名称">{{editForm.accountName }}</FormItem>
      </Col>
      <Col span="8" v-show="curMode === 'view'">
        <FormItem label="应答时间">{{editForm.answerTime }}</FormItem>
      </Col>
      <Col span="8" v-show="curMode === 'view'">
        <FormItem label="结束时间">{{editForm.endTime }}</FormItem>
      </Col>
    </Row>
  </div>
</template>

<script>
// import getCallInfo from '@/api/data'

export default {
  props: ['id', 'mode'],
  data() {
    return {
      curMode: this.mode,
      editForm: {},
    }
  },
  methods: {
    getInfo() {
      if (this.id === '') {
        return
      }
      // getCallInfo(this.id).then(res => {
      //   if (res.data.code === 200) {
      //     this.editForm = res.data.data
      //     switch (this.editForm.callType) {
      //         case 1:
      //           this.editForm.callType = '语音通话'
      //           break
      //         case 2:
      //           this.editForm.callType = '视频通话'
      //           break
      //         case 3:
      //           this.editForm.callType = '语音对讲'
      //           break
      //         case 4:
      //           this.editForm.callType = '视频对讲'
      //           break
      //         case 5:
      //           this.editForm.callType = '语音会议'
      //           break
      //         case 6:
      //           this.editForm.callType = '视频会议'
      //           break
      //         default:
      //           break
      //       }
      //   } else {
      //     this.$Message.error(res.data.msg)
      //   }
      // })
    }
  },
  mounted() {
    this.getInfo()
  }
}
</script>
