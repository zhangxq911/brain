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
                    v-model="date"
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
              <div class="host-content" v-if="host.uid">
                <div class="content-item">
                  <Icon @click="change2attendee()" class="del-btn" type="ios-remove-circle" />
                  <!-- <div class="avatar" :style="avatarSelect"></div> -->
                  <div
                    v-if="host.displayPhoto"
                    class="avatar"
                    :style="{
                      backgroundImage: `url(http://oss.imbcloud.cn/image/${host.displayPhoto})`
                    }"
                  ></div>
                  <div v-else class="avatar" :style="avatarSelect"></div>
                  <div style="padding: 0 6px;">
                    <div class="name">{{host.name}}</div>
                    <div class="org">{{host.organizationName}}</div>
                  </div>
                </div>
              </div>
              <div class="host-content" v-else>
                <div class="avatar" :style="avatarBasic"></div>
                <div class="unselect">未选择</div>
              </div>
            </div>
            <div class="attendee">
              <div class="title">会议成员({{users.length ? users.length : 0}})</div>
              <div style="flex: 1; overflow: auto;">
                <div class="host-content flex-host" v-for="item in users" :key="item.uid">
                  <div class="content-item">
                    <Icon
                      @click="removeAttendee(item.uid)"
                      class="del-btn"
                      type="ios-remove-circle"
                      title="删除"
                    />
                    <div
                      v-if="item.displayPhoto"
                      class="avatar"
                      :style="{
                      backgroundImage: `url(http://oss.imbcloud.cn/image/${item.displayPhoto})`
                    }"
                    ></div>
                    <div v-else class="avatar" :style="avatarSelect"></div>
                    <!-- <div class="avatar" :style="avatarSelect"></div> -->
                    <div style="padding: 0 6px;">
                      <div class="name">{{item.name}}</div>
                      <div class="org">{{item.organizationName}}</div>
                    </div>
                  </div>
                  <div @click="change2host(item.uid)" class="host-btn">申请主持人</div>
                </div>
              </div>
            </div>
          </div>
          <!-- 右侧组织树 -->
          <div class="select-box">
            <Input search v-model="searchName" placeholder="搜索成员名称" />
            <!-- 菜单导航 -->
            <bread v-show="isOrg" @searchOid="getOidSearch" :data="breadList"></bread>
            <!-- 部门及用户选择 -->
            <div v-show="isOrg" class="wrapper" ref="wrapper">
              <treeList
                @searchOid="getOidSearch"
                @setUser="getUser"
                @refreshSelect="findUserNum"
                type="edit"
                :orgData="curOrg"
                :userData="curUser"
                :selectData="selectData"
                :userNum="userNum"
              ></treeList>
            </div>
            <div v-show="!isOrg && !tempUser.length" class="miss">
              找不到关于
              <span>“{{ searchName }}”</span>
              的联系人
            </div>
            <div class="card clearborder wrapper" v-show="!isOrg" ref="wrapper2">
              <treeList
                @searchOid="getOidSearch"
                @setUser="getUser"
                type="view"
                :orgData="[]"
                :userData="tempUser"
                :selectData="selectData"
              ></treeList>
            </div>
            <!-- </div>
            <div v-if="!isOrg" class="wrapper" ref="wrapper2">
              <treeList
                @searchOid="getOidSearch"
                @setUser="getUser"
                @refreshSelect="findUserNum"
                type="edit"
                :orgData="[]"
                :userData="curUser"
                :selectData="selectData"
                :userNum="userNum"
              ></treeList>
            </div>-->
          </div>
        </div>
        <div class="footer">
          <Button type="primary" @click="save">保存</Button>
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
              <VueQrcode
                tag="img"
                :value="shareUri"
                style="padding: 26px;"
                :options="{ size: 126 }"
              ></VueQrcode>
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
          <Input style="padding-right: 20px;" v-model="shareUri">
            <span style="padding: 0 10px; color: #999999;" slot="prepend">链接</span>
          </Input>
          <Button type="primary" v-clipboard="clipOptions">复制链接</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getOrgList,
  getUsers,
  addMeeting,
  getMeetInfo,
  updateMeeting
} from '@/api/data'
import { getDateDiff } from '@/libs/tools'
import VueQrcode from '@xkeshi/vue-qrcode'
import treeList from '_c/tree-list.vue'
import bread from '_c/bread.vue'
import { log } from 'util'
import Bscroll from 'better-scroll'

export default {
  components: { VueQrcode, treeList, bread },
  props: ['basicInfo'],
  data() {
    return {
      timeout: null,
      searchName: '',
      defAccount: '',
      date: [], // 展示用显示时间
      search: {
        oid: '',
        userName: '',
        page: 1
      },
      breadList: [], // 面包屑导航
      orgList: [], // 默认查询出来的所有组织数据
      host: {},
      users: [],
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
        hostTel: '',
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
      },
      curOrg: [],
      curUser: [],
      orgList: [], // 获取所有
      userList: [],
      selectData: [],
      userNum: {},
      shareUri: '',
      pageSize: 20,
      isOrg: true,
      tempUser: [] // 存放名称搜索
    }
  },
  watch: {
    basicInfo: function() {
      if (this.basicInfo.type === 'editMeeting') {
        this.getInfo(this.basicInfo.id)
      }
    },
    searchName: {
      handler(curVal) {
        clearTimeout(this.timeout)
        // 设置延时300ms查询
        this.timeout = setTimeout(() => {
          // 判断是否为空
          if (curVal) {
            this.isOrg = false
            this.search = {
              page: 1,
              userName: curVal,
              oid: ''
            }
            this.tempUser = []
            this.searchUser()
          } else {
            this.isOrg = true
            this.tempUser = []
          }
          // curVal ? (this.isOrg = false) : (this.isOrg = true);
        }, 300)
      },
      deep: true
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
    searchUser() {
      getUsers(this.search).then(res => {
        if (res.data.code === 200) {
          if (res.data.data) {
            this.tempUser = this.tempUser.concat(res.data.data)
          } else if (res.data.data && res.data.data.length === 20) {
            this.tempUser = this.tempUser.concat(res.data.data)
            this.search.page++
            this.searchUser()
          } else {
            this.tempUser = []
          }
        } else {
          this.tempUser = []
        }
      })
    },
    getInfo() {
      if (!this.basicInfo.id) {
        return
      }
      getMeetInfo(this.basicInfo.id).then(res => {
        if (res.data.code === 200) {
          this.editForm = res.data.data
          // 时间区间处理
          let startDate = new Date(getDateDiff(this.editForm.startTime))
          let endDate = new Date(getDateDiff(this.editForm.endTime))
          this.date = []
          this.date.push(startDate)
          this.date.push(endDate)
          this.host = {
            tel: res.data.data.hostTel,
            name: res.data.data.hostName,
            organizationName: res.data.data.hostOrganizationName,
            uid: res.data.data.hostId,
            displayPhoto: res.data.data.hostDisplayPhoto
          }
          if (res.data.data.participantInfoDOS) {
            this.users = res.data.data.participantInfoDOS
          }
          let tempArr = JSON.parse(JSON.stringify(this.users))
          tempArr.push(this.host)
          this.selectData = tempArr
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    // 获取默认组织机构（全部）
    getOrgList() {
      getOrgList(this.search).then(res => {
        if (res.data.code === 200) {
          this.orgList = this.orgList.concat(res.data.data)
          if (res.data.data.length === 20) {
            this.search.page++
            this.getOrgList()
          } else {
            this.search.page = 1
            this.getOrgUser()
          }
          res.data.data.forEach(item => {
            if (item.parentOid === 0) {
              this.curOrg.push(item)
              let obj = {
                page: 1,
                oid: item.oid,
                select: 0
              }
              this.findUserNum(obj)
            }
          })
        } else {
          this.orgList = []
        }
      })
    },
    // 获取默认人员（全部）
    getOrgUser() {
      getUsers(this.search).then(res => {
        if (res.data.code === 200) {
          // 暂时获取数据
          if (res.data.data) {
            this.userList = this.userList.concat(res.data.data)
            if (res.data.data && res.data.data.length === this.pageSize) {
              // this.userList = this.userList.concat(res.data.data);
              this.search.page++
              this.getOrgUser()
            }
          } else {
            this.userList = []
          }
        } else {
          this.userList = []
        }
      })
    },
    // 组织机构点击查询处理
    getOidSearch(val) {
      this.search.oid = val.oid
      this.curOrg = []
      this.curUser = []
      this.userNum = {}
      this.orgList.forEach(item => {
        if (item.parentOid === val.oid) {
          // 计算全部和选中的人 oid, page, select
          let obj = {
            page: 1,
            oid: item.oid,
            select: 0
          }
          this.findUserNum(obj)
          this.curOrg.push(item)
        }
        if (item.oid === val.oid && val.type === 'join') {
          this.breadList.push(item)
        }
      })
      if (val.oid === 0) {
        this.breadList = []
      }
      this.breadList.forEach((item, index) => {
        if (item.oid === val.oid && val.type === 'back') {
          this.breadList = this.breadList.slice(0, index + 1)
        }
      })
      // 过滤用户信息
      this.userList.forEach(item => {
        if (item.oid === val.oid) {
          this.curUser.push(item)
        }
      })
    },
    // 计算该部门下全部和选中的人
    findUserNum(obj) {
      // oid, page, select
      let search = {
        page: obj.page,
        oid: obj.oid,
        userName: ''
      }
      let num = obj.select
      getUsers(search).then(res => {
        if (res.data.code === 200) {
          if (res.data.data) {
            if (res.data.data.length === this.pageSize) {
              search.page++
              res.data.data.forEach(item => {
                this.selectData.forEach(element => {
                  if (item.uid === element.uid) {
                    num++
                  }
                })
              })
              let obj = {
                page: search.page,
                oid: search.oid,
                select: num
              }
              this.findUserNum(obj)
            } else {
              res.data.data.forEach(item => {
                this.selectData.forEach(element => {
                  if (item.uid === element.uid) {
                    num++
                  }
                })
              })
              let temp = {
                select: num,
                all: res.data.data.length + (search.page - 1) * 20
              }
              this.$set(this.userNum, obj.oid, temp)
            }
          } else {
            let temp = {
              select: 0,
              all: 0
            }
            this.$set(this.userNum, obj.oid, temp)
          }
        } else {
          let temp = {
            select: 0,
            all: 0
          }
          this.$set(this.userNum, obj.oid, temp)
        }
      })
    },
    // 人员点击处理
    getUser(obj) {
      let hasUid = false
      let that = this
      this.selectData.forEach((item, index) => {
        if (item.uid === obj.uid) {
          this.selectData.splice(index, 1)
          // 判断移除host 还是 users
          that.users.forEach((item2, index2) => {
            if (item2.uid === obj.uid) {
              that.users.splice(index2, 1)
            }
          })
          if (that.host.uid === obj.uid) {
            that.host = {}
          }
          hasUid = true
        }
      })
      if (!hasUid) {
        this.selectData.push(obj)
        this.users.push(obj)
      }
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
    save() {
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          // FIXME 主持人和参会人员选择状态校验
          let participantsInfoStr = ''
          this.users.forEach(item => {
            participantsInfoStr += item.tel + ','
          })
          if (participantsInfoStr.length > 0) {
            participantsInfoStr = participantsInfoStr.substring(
              0,
              participantsInfoStr.length - 1
            )
          }
          let data = JSON.parse(JSON.stringify(this.editForm))
          data.participantsTels = participantsInfoStr
          data.hostTel = this.host.tel ? this.host.tel : ''
          data.startTime = new Date(getDateDiff(this.editForm.startTime))
          data.endTime = new Date(getDateDiff(this.editForm.endTime))
          // 判断 主持人和参会人员是否为空
          if (!data.hostTel || !data.participantsTels.length) {
            this.$Message.error('请填写完整信息！')
            return false
          }
          if (this.basicInfo.type === 'editMeeting') {
            // 修改
            data.meetingId = data.id
            updateMeeting(data).then(res => {
              if (res.data.code === 200) {
                this.$Message.success(res.data.msg)
                this.closeMask()
              } else {
                this.$Message.error(res.data.msg)
              }
            })
          } else {
            // 新增
            // 开始时间为当前时间后五分钟
            let now = new Date().getTime()
            if (data.startTime.getTime() < now + 30000) {
              this.$Message.error('会议开始时间最早为5分钟后')
              return false
            }
            addMeeting(data).then(res => {
              if (res.data.code === 200) {
                this.basicInfo.type = 'success'
                this.shareUri = location.origin + '/h5/#/share/' + res.data.data
              } else {
                this.$Message.error(res.data.msg)
              }
            })
          }
        }
      })
    },
    removeAttendee(uid) {
      this.selectData.forEach((item, index) => {
        if (item.uid === uid) {
          this.selectData.splice(index, 1)
        }
      })
      this.users.forEach((item, index) => {
        if (item.uid === uid) {
          this.users.splice(index, 1)
        }
      })
    },
    change2host(uid) {
      // 判断是否有主持人
      if (this.host.uid) {
        this.$Message.warning('当前已存在主持人')
        return
      }
      this.selectData.forEach((item, index) => {
        if (item.uid === uid) {
          this.host = item
          this.users.splice(index, 1)
        }
      })
    },
    change2attendee() {
      this.users.push(this.host)
      this.host = {}
    },
    closeMask() {
      // 清空表单
      this.$refs['editForm'].resetFields()
      this.editForm.meetingType = 0
      this.host = {}
      this.users = []
      this.selectData = []
      this.basicInfo.type = 'normal'
      this.$emit('resetPage', true)
      this.$emit('sendModal', this.basicInfo.type)
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.scroll = new Bscroll(this.$refs.wrapper, {
        click: false,
        mouseWheel: true
      })
      this.scroll2 = new Bscroll(this.$refs.wrapper2, {
        click: false,
        mouseWheel: true
      })
    })
    if (this.defAccount === 'unit') {
      this.getOrgList()
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  flex: 1;
  overflow: hidden;
  height: 100%;
}
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
  border-radius: 100%;
  background-size: 100%;
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
.miss {
  color: #999;
  text-align: center;
  padding: 20px 0;
  span {
    color: #333;
  }
}
</style>