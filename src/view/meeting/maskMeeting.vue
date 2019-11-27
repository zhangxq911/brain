<template>
  <div>
    <div v-show="basicInfo.type === 'addMeeting' || basicInfo.type === 'editMeeting'" class="mask">
      <div @click="closeMask" class="mask-left" :style="{'width': (100 - basicInfo.width) + 'vw'}"></div>
      <div class="mask-content" :style="{'width': basicInfo.width + 'vw'}">
        <Row>
          <span class="mask-title">会议预约</span>
          <Icon class="closeBtn" type="ios-close" @click="closeMask" />
        </Row>
        <!-- 表单信息 -->
        <div style="padding: 20px;">
          <Form
            ref="editForm"
            :model="editForm"
            :rules="rulesValidate"
            label-position="left"
            :label-width="80"
          >
            <FormItem prop="meetingSubject" label="会议主题">
              <!-- <div style="margin-left: -60px;">
              <div style="font-weight: 500;">会议主题</div>-->
              <Input v-model="editForm.meetingSubject" placeholder="请输入会议主题" style="width: 100%;"></Input>
              <!-- </div> -->
            </FormItem>
            <Row>
              <Col span="14">
                <FormItem prop="startTime" label="会议时间">
                  <DatePicker
                    @on-change="changeTime"
                    type="datetimerange"
                    format="yyyy-MM-dd HH:mm"
                    :options="options"
                    placeholder="请选择时间区间"
                    style="width: 300px"
                  ></DatePicker>
                </FormItem>
              </Col>
              <Col span="10">
                <FormItem label="会议类型">
                  <RadioGroup v-model="editForm.meetingType" type="button">
                    <Radio :label="0">视频会议</Radio>
                    <Radio :label="1">语音会议</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
            </Row>
            <FormItem prop="remark" label="会议备注">
              <Input v-model="editForm.remark" type="textarea"></Input>
            </FormItem>
          </Form>
        </div>
        <div class="divider"></div>
        <div class="tree-box">
          <!-- 左侧已选择 -->
          <div class="select-box">
            <div class="host">
              <div class="title">主持人</div>
              <div class="host-content" v-if="host.id">
                <div class="content-item">
                  <Icon @click="change2attendee()" class="del-btn" type="ios-remove-circle" />
                  <div class="avatar" :style="avatarSelect"></div>
                  <div style="padding: 0 6px;">
                    <div class="name">{{host.name}}</div>
                    <div class="org">{{host.org}}</div>
                  </div>
                </div>
              </div>
              <div class="host-content" v-else>
                <div class="avatar" :style="avatarBasic"></div>
                <div class="unselect">未选择</div>
              </div>
            </div>
            <div class="attendee">
              <div class="title">会议成员({{participantsInfo.length ? participantsInfo.length : 0}})</div>
              <div style="flex: 1; overflow: auto;">
                <div class="host-content flex-host" v-for="item in participantsInfo" :key="item.id">
                  <div class="content-item">
                    <Icon
                      @click="removeAttendee(item.id)"
                      class="del-btn"
                      type="ios-remove-circle"
                      title="删除"
                    />
                    <div class="avatar" :style="avatarSelect"></div>
                    <div style="padding: 0 6px;">
                      <div class="name">{{item.name}}</div>
                      <div class="org">{{item.org}}</div>
                    </div>
                  </div>
                  <div @click="change2host(item.id)" class="host-btn">申请主持人</div>
                </div>
              </div>
            </div>
          </div>
          <!-- 右侧组织树 -->
          <div class="select-box">
            <Input search placeholder="搜索成员名称" />
            <!-- 菜单导航 -->
            <div class="bread">
              <ul>
                <li v-for="(item, index) in breadList">
                  <Icon v-if="index" style="color: #999999;" type="ios-arrow-forward" />
                  <a
                    v-if="index !== breadList.length -1"
                    href="#"
                    @click="expendList(item.id, 1, '')"
                  >{{item.name}}</a>
                  <a
                    v-if="index === breadList.length -1"
                    style="color: #999999;"
                    href="#"
                  >{{item.name}}</a>
                </li>
              </ul>
            </div>
            <div style="flex: 1; overflow: auto; margin: 0 -20px;">
              <div style="padding: 0 20px;" v-if="orgList.length > 0">
                <ul style="margin: 0 -20px;">
                  <li v-for="item in showList" :key="item.id">
                    <!-- 部门类型 -->
                    <div
                      class="host-content"
                      style="height: 50px;display: flex;justify-content: space-between;"
                      @click="expendList(item.id, 0, item.name)"
                      v-if="item.type === 0"
                    >
                      <div style="display: flex; align-items: center;">
                        <div class="org-basic" :style="orgBasic" v-if="item.pid === 0"></div>
                        <div v-else>
                          <Icon
                            @click.stop="selectOrg(item.id)"
                            class="icon-select"
                            type="ios-radio-button-off"
                          />
                          <!-- <Icon
                          class="icon-select"
                          style="color: #5B8CFF;"
                          type="ios-checkmark-circle"
                          />-->
                        </div>
                        <div class="name-content">{{item.name}}</div>
                      </div>
                      <Icon type="ios-arrow-forward" />
                    </div>
                    <!-- 人员类型 -->
                    <div class="host-content" v-else>
                      <Icon
                        v-if="!isActiveItem(item.id)"
                        @click.stop="selectItem(item.id)"
                        class="icon-select"
                        style="margin-right: 6px;"
                        type="ios-radio-button-off"
                      />
                      <Icon
                        v-else
                        @click.stop="removeItem(item.id)"
                        class="icon-select"
                        style="margin-right: 6px;color: #5B8CFF;"
                        type="ios-checkmark-circle"
                      />
                      <div class="avatar" :style="avatarSelect"></div>
                      <div class="name-content">{{item.name}}</div>
                    </div>
                  </li>
                </ul>
              </div>
              <div v-else>暂无数据</div>
            </div>
          </div>
        </div>
        <div class="footer">
          <Button type="primary" @click="addMeet">保存</Button>
        </div>
      </div>
    </div>
    <div v-show="basicInfo.type === 'success'" class="mask">
      <div @click="closeMask" class="mask-left" :style="{'width': (100 - basicInfo.width) + 'vw'}"></div>
      <div class="mask-content" :style="{'width': basicInfo.width + 'vw'}">
        <Row>
          <span class="mask-title">预约成功</span>
          <Icon class="closeBtn" type="ios-close" @click="closeMask" />
        </Row>
        <div class="success-logo">
          <Icon class="icon" type="md-checkmark-circle" />
          <div>会议预约成功</div>
        </div>
        <div class="success-info">
          <div>
            <div class="qrcode">
              <VueQrcode tag="img" style="padding: 26px;" :options="{ size: 126 }"></VueQrcode>
            </div>
            <div class="qrcode-discription">手机扫码分享</div>
          </div>
          <div>
            <Form :label-width="80">
              <FormItem style="margin:0;" label="会议主题">{{editForm.meetingSubject }}</FormItem>
              <FormItem style="margin:0;" label="主持人">{{host.name }}</FormItem>
              <FormItem style="margin:0;" label="会议类型">{{editForm.meetingType | filterType }}</FormItem>
              <FormItem style="margin:0;" label="会议时间">{{meetingTime }}</FormItem>
              <FormItem style="margin:0;" label="会议备注">会议备注</FormItem>
            </Form>
          </div>
        </div>
        <div class="link">
          <Input style="padding-right: 20px;">
            <span style="padding: 0 10px; color: #999999;" slot="prepend">链接</span>
          </Input>
          <Button type="primary">复制链接</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getOrgList, getAllPocUser, addMeeting, getMeetInfo } from '@/api/data'
import { getDateDiff } from '@/libs/tools'
import VueQrcode from '@xkeshi/vue-qrcode'

export default {
  components: { VueQrcode },
  props: ['basicInfo'],
  data() {
    return {
      default: false,
      breadList: [{ id: 0, name: '通讯录' }], // 面包屑导航
      showList: [], // 展示处理过后的组织和人员list
      orgList: [], // 默认查询出来的所有组织数据
      orgPage: {
        count: 0,
        pageNumber: 1,
        pageSize: 20,
        totalPage: 0
      },
      host: {},
      avatarBasic: {
        backgroundImage:
          'url(' + require('@/assets/images/avatar-basic.png') + ')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%'
      },
      avatarSelect: {
        backgroundImage:
          'url(' + require('@/assets/images/avatar-select.png') + ')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%'
      },
      orgBasic: {
        backgroundImage:
          'url(' + require('@/assets/images/org-basic.png') + ')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%'
      },
      participantsInfo: [
        // {
        //   id: 3,
        //   name: '盖伦',
        //   org: '德玛西亚',
        //   displayPhoto: '',
        //   type: ''
        // }
      ], // 已选参会人员
      options: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000
        }
      },
      editForm: {
        startTime: '',
        endTime: '',
        meetingSubject: '',
        meetingType: 0,
        hostId: '',
        participantsIds: '',
        remark: ''
      },
      meetingTime: '',
      rulesValidate: {
        meetingSubject: [
          { required: true, message: '请输入会议主题', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '请选择会议时间', trigger: 'change' }
        ],
        remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      }
    }
  },
  watch: {
    basicInfo: function() {
      if (this.basicInfo.type === 'editMeeting') {
        this.getInfo(this.basicInfo.id)
      }
    }
  },
  filters: {
    filterType: function(val) {
      return val ? '语音会议' : '视频会议'
    }
  },
  methods: {
    getInfo(id) {
      if (id === '') {
        return
      }
      getMeetInfo(id).then(res => {
        if (res.data.code === 200) {
          this.editForm = res.data.data
          this.host = {
            id: this.editForm.hostId,
            name: this.editForm.hostName,
            org: this.editForm.hostOrganizationName
          }
          this.participantsInfo = this.editForm.participantInfoDOS
          this.participantsInfo.forEach(item => {
            item.id = item.uid
            item.org = item.organizationName
            delete item.uid
          })
          console.log('getMeetInfo', this.editForm)
          // 处理会议时间
          // let startTime = this.editForm.startTime
          // let endTime = this.editForm.endTime
          // let week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
          // let startDate = new Date(getDateDiff(startTime))
          // let endDate = new Date(getDateDiff(endTime))
          // this.meetingTime =
          //   getDateDiff(startTime.slice(0, 10)) +
          //   '(' +
          //   week[startDate.getDay()] +
          //   ')' +
          //   startTime.substring(10, startTime.length - 3) +
          //   ' - ' +
          //   getDateDiff(endTime.slice(0, 10)) +
          //   '(' +
          //   week[endDate.getDay()] +
          //   ')' +
          //   endTime.substring(10, endTime.length - 3)
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    changeTime(val) {
      this.editForm.startTime = val[0]
      this.editForm.endTime = val[1]
      if (val[0]) {
        let startTime = val[0]
        let endTime = val[1]
        let week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
        let startDate = new Date(getDateDiff(startTime))
        let endDate = new Date(getDateDiff(endTime))
        this.meetingTime =
          getDateDiff(startTime.slice(0, 10)) +
          '(' +
          week[startDate.getDay()] +
          ')' +
          startTime.substring(10) +
          ' - ' +
          getDateDiff(endTime.slice(0, 10)) +
          '(' +
          week[endDate.getDay()] +
          ')' +
          endTime.substring(10)
      } else {
        this.meetingTime = ''
      }
    },
    addMeet() {
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          // FIXME 主持人和参会人员选择状态校验
          let participantsInfoStr = ''
          this.participantsInfo.forEach(item => {
            participantsInfoStr += item.id + ','
          })
          if (participantsInfoStr.length > 0) {
            participantsInfoStr = participantsInfoStr.substring(
              0,
              participantsInfoStr.length - 1
            )
          }
          let data = JSON.parse(JSON.stringify(this.editForm))
          data.participantsIds = participantsInfoStr
          data.hostId = this.host.id ? this.host.id : ''
          data.startTime = new Date(this.editForm.startTime)
          data.endTime = new Date(this.editForm.endTime)
          addMeeting(data).then(res => {
            if (res.data.code === 200) {
              this.basicInfo.type = 'success'
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        }
      })
    },
    isActiveItem(id) {
      if (this.host.id === id) {
        return true
      }
      for (let i = 0; i < this.participantsInfo.length; i++) {
        if (this.participantsInfo[i].id === id) {
          return true
        }
      }
      return false
    },
    removeAttendee(id) {
      this.participantsInfo.forEach((item, index) => {
        if (item.id === id) {
          this.participantsInfo.splice(index, 1)
        }
      })
    },
    change2host(id) {
      // 判断是否有主持人
      if (this.host.id) {
        this.$Message.warning('当前已存在主持人')
        return
      }
      this.participantsInfo.forEach((item, index) => {
        if (item.id === id) {
          this.host = item
          this.participantsInfo.splice(index, 1)
        }
      })
    },
    change2attendee() {
      this.participantsInfo.push(this.host)
      this.host = {}
    },
    selectOrg(id) {
      console.log('当前选择的部门id', id)
      // 通过这个id 查找所有user
    },
    selectItem(id) {
      // 选择参会人员
      this.showList.forEach(item => {
        if (item.id === id) {
          this.participantsInfo.push(item)
        }
      })
    },
    removeItem(id) {
      //移除参会人员
      this.participantsInfo.forEach((item, index) => {
        if (item.id === id) {
          this.participantsInfo.splice(index, 1)
        }
      })
    },
    // 展开次级菜单
    expendList(id, type, name) {
      // type 0 菜单中部门选择 type 1 面包屑选择
      if (type !== 0 && type !== 1) {
        this.$Message.error('expendList方法未获取正确的type')
        return
      }

      // 处理面包屑
      if (!type) {
        this.breadList.push({ id: id, name: name })
      } else {
        let realIndex = -1
        this.breadList.forEach((item, index) => {
          if (item.id === id) {
            realIndex = index
          }
        })
        this.breadList.length = realIndex + 1
      }

      this.showList = []

      // 面包屑导航id传值为0时，处理菜单为默认列表
      if (id === 0) {
        this.defalutOrgList(this.orgList)
        return
      }
      // 其他情况时处理
      this.orgList.forEach(item => {
        if (item.parentOid === id) {
          let tempObj = {
            id: item.oid,
            pid: item.parentOid,
            name: item.name,
            type: 0
          }
          this.showList.push(tempObj)
        }
      })
      this.getUser(id)
    },
    // 点击部门查询人员
    getUser(id) {
      this.orgPage.oid = id
      getAllPocUser(this.orgPage).then(res => {
        if (!res.data.data.data) {
          return
        }
        res.data.data.data.forEach(item => {
          let tempObj = {
            id: item.uid,
            name: item.name,
            type: 1,
            displayPhoto: item.displayPhoto,
            org: this.breadList[this.breadList.length - 1].name
          }
          this.showList.push(tempObj)
        })
      })
    },
    closeMask() {
      // 清空表单
      this.$refs['editForm'].resetFields()
      this.expendList(0, 1, '')
      this.editForm.meetingType = 0
      this.host = {}
      this.participantsInfo = []
      // this.participantsIds
      // this.defalutOrgList(this.orgList)
      this.basicInfo.type = 'normal'
      this.$emit('resetPage', true)
      this.$emit('sendModal', this.basicInfo.type)
    },
    // 组织菜单数据
    getOrgLists() {
      getOrgList().then(res => {
        if (res.data.code === 200) {
          if (!res.data.data) {
            return
          }
          this.orgList = res.data.data
          // 处理默认展现的组织结构数据
          this.defalutOrgList(this.orgList)
        }
      })
    },
    defalutOrgList(data) {
      data.forEach(item => {
        if (item.parentOid === 0) {
          let tempObj = {
            id: item.oid,
            pid: item.parentOid,
            name: item.name,
            type: 0 // 0 为组织， 1为人员
          }
          this.showList.push(tempObj)
        }
      })
    }
  },
  mounted() {
    this.getOrgLists()
  }
}
</script>

<style scoped>
.mask-content {
  display: flex;
  flex-direction: column;
}
.divider {
  width: 100%;
  flex: 0 0 5px;
  background: #f5f5f5;
  margin: 0;
}
.bread {
  padding: 6px 0;
}
.bread ul {
  display: flex;
  flex-wrap: wrap;
}
.tree-box {
  display: flex;
  flex: 1;
  overflow: hidden;
}
.tree-box .select-box {
  flex: 1;
  border: 1px solid #f5f5f5;
  padding: 20px;
  display: flex;
  flex-direction: column;
}
.select-box .host {
  height: 70px;
  margin: 0 -20px;
}
.select-box .attendee {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin: 0 -20px;
}
.select-box .title {
  font-weight: 500;
  margin-left: 20px;
}
.select-box .avatar {
  width: 38px;
  height: 38px;
}
.select-box .host-content {
  display: flex;
  padding: 6px 20px;
  align-items: center;
}
.select-box .content-item {
  display: flex;
  align-items: center;
  overflow: hidden;
}
.select-box .host-content:hover {
  background: #eff7ff;
}
.select-box .host-content:hover .del-btn,
.select-box .host-content:hover .host-btn {
  display: flex;
}
.select-box .host-content:hover .del-btn {
  margin: 0 4px;
}
.select-box .flex-host {
  justify-content: space-between;
}
.select-box .host .host-content .unselect {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #999999;
  padding: 0 6px;
}
.select-box .name {
  font-size: 14px;
  font-weight: 500;
}
.select-box .org {
  font-size: 12px;
  color: #999999;
}
.select-box .host-content .del-btn {
  /* width: 18px; */
  /* height: 18px; */
  color: #e12e44;
  font-size: 18px;
  margin: 0 4px 0 -20px;
  transition: margin 0.5s;
  -webkit-transition: margin 0.5s;
}
.select-box .host-content .del-btn:hover {
  cursor: pointer;
  opacity: 0.6;
}
.select-box .host-content .host-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 78px;
  height: 20px;
  background: rgba(74, 144, 226, 1);
  border-radius: 2px;
  color: #ffffff;
  display: none;
}
.select-box .host-content .host-btn:hover {
  cursor: pointer;
  background: #57a3f3;
}
.select-box .org-basic {
  width: 38px;
  height: 38px;
}
.select-box .icon-select {
  font-size: 18px;
}
.select-box .icon-select:hover {
  cursor: pointer;
}
.select-box .name-content {
  padding: 0 6px;
  color: #333333;
}
.footer {
  padding: 10px 20px;
}
.success-logo {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
}
.success-logo .icon {
  font-size: 100px;
  color: #2d8cf0;
}
.success-logo > div {
  font-size: 20px;
  color: #2d8cf0;
}
.success-info {
  display: flex;
  justify-content: center;
  margin-top: 60px;
}
.success-info > div:nth-child(1) {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
}
.success-info .qrcode {
  background: #f3f7fd;
  margin: 10px 20px;
}
.success-info .qrcode-discription {
  width: 126px;
  text-align: center;
  color: #333333;
  margin: 6px 20px 0 0;
}
.success-info > div:nth-child(2) {
  flex: 1;
  padding-right: 20px;
}
.link {
  display: flex;
  justify-content: center;
  padding: 60px 80px;
}
</style>