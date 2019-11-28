<template>
  <div class="tree-list" ref="wrapper">
    <!-- orglist -->
    <div>
      <div
        slot="list"
        class="nut-hor-list-item user-card"
        v-for="item in orgData"
        :key="item.oid"
        @click.stop="sendOrg(item.oid, 'join')"
      >
        <div class="card-left">
          <div
            class="select-icon"
            v-show="
              type === 'edit' && item.parentOid !== 0
            "
            @click.stop="selectAll(item.oid)"
          >
            <span
              v-show="
                userNum[item.oid]
                  ? userNum[item.oid].select === userNum[item.oid].all
                  : false
              "
              class="iconfont icon-reduce"
            ></span>
            <span class="iconfont icon-quan"></span>
          </div>
          <div class="avatar" v-show="item.parentOid === 0">
            <span class="iconfont icon-org"></span>
          </div>
          <div class="name">{{ item.name }}</div>
          <div
            :class="{
              selectUser: true,
              active: userNum[item.oid] ? userNum[item.oid].select : false
            }"
          >
            <span>(</span>
            <span
              v-show="userNum[item.oid] ? userNum[item.oid].select : false"
            >{{ userNum[item.oid] ? userNum[item.oid].select : "0" }}/</span>
            <span>{{ userNum[item.oid] ? userNum[item.oid].all : "0" }})</span>
          </div>
        </div>
        <div>
          <span
            v-show="
              item.oid && (userNum[item.oid] ? userNum[item.oid].all : false)
            "
            class="iconfont icon-right"
          ></span>
        </div>
      </div>
      <!-- 当组织结构和用户同时存在分割线 -->
      <div slot="list" class="dash" v-show="userData.length && orgData.length"></div>
      <!-- userlist -->
      <div
        slot="list"
        class="nut-hor-list-item user-card"
        v-for="item in userData"
        :key="item.uid"
        @click.stop="sendUser(item)"
      >
        <div class="card-left">
          <div class="select-icon">
            <span class="iconfont icon-reduce" v-show="hasSelect(item.uid)"></span>
            <span class="iconfont icon-quan"></span>
          </div>
          <div
            v-if="item.displayPhoto"
            class="avatar"
            :style="{
              backgroundImage: `url(http://oss.imbcloud.cn/image/${item.displayPhoto})`
            }"
          ></div>
          <div v-else class="avatar" :style="avatarSelect"></div>
          <div style="padding: 0 6px;">
            <div class="name">{{ item.name }}</div>
            <div class="org">{{item.organizationName}}</div>
          </div>
        </div>
        <!-- {{ item.name }} -->
      </div>
    </div>
  </div>
</template>

<script>
import Bscroll from 'better-scroll'

import { getUsers } from '@/api/data'

export default {
  name: 'treeList',
  props: ['type', 'orgData', 'userData', 'selectData', 'userNum'],
  data() {
    return {
      avatarSelect: {
        backgroundImage:
          'url(' + require('@/assets/images/avatar-select.png') + ')'
      },
      search: {
        page: 1,
        oid: '',
        userName: ''
      }
    }
  },
  watch: {
    selectData: function() {
      // 部门全选操作后需要刷新数据
      this.orgData.forEach(element => {
        let obj = {
          oid: element.oid,
          page: 1,
          select: 0
        }
        this.$emit('refreshSelect', obj)
      })
    }
  },
  methods: {
    selectAll(oid) {
      this.search = {
        page: 1,
        oid: oid,
        userName: ''
      }
      // 判断是否已经全部选中
      if (this.userNum[oid].select === this.userNum[oid].all) {
        // 已全选，清空
        this.clearAllUser()
      } else {
        // 未全选，全选
        this.selectAllUser()
      }
    },
    selectAllUser() {
      getUsers(this.search).then(res => {
        if (res.data.code === 200) {
          // 暂时获取数据
          if (res.data.data.length === 20) {
            this.search.page++
            if (this.selectData.length) {
              res.data.data.forEach(item => {
                if (!this.hasItem(item)) {
                  this.$emit('setUser', item)
                }
              })
            } else {
              res.data.data.forEach(item => {
                this.$emit('setUser', item)
              })
            }
            this.selectAllUser()
          } else {
            if (this.selectData.length) {
              res.data.data.forEach(item => {
                if (!this.hasItem(item)) {
                  this.$emit('setUser', item)
                }
              })
            } else {
              res.data.data.forEach(item => {
                this.$emit('setUser', item)
              })
            }
          }
        } else {
          this.$toast.text('选择失败！')
        }
      })
    },
    hasItem(obj) {
      for (let index = 0; index < this.selectData.length; index++) {
        if (this.selectData[index].uid === obj.uid) {
          return true
        }
      }
      return false
    },
    clearAllUser() {
      getUsers(this.search).then(res => {
        if (res.data.code === 200) {
          if (res.data.data.length === 20) {
            res.data.data.forEach(item => {
              this.selectData.forEach(item2 => {
                if (item.uid === item2.uid) {
                  this.$emit('setUser', item)
                }
              })
            })
            this.search.page++
            this.clearAllUser()
          } else {
            res.data.data.forEach(item => {
              this.selectData.forEach(item2 => {
                if (item.uid === item2.uid) {
                  this.$emit('setUser', item)
                }
              })
            })
          }
        }
      })
    },
    sendOrg(oid, type) {
      // 判断是否没有子元素
      if (oid && this.userNum[oid].all) {
        let obj = {
          oid: oid,
          type: type
        }
        this.$emit('searchOid', obj)
      }
    },
    sendUser(item) {
      this.$emit('setUser', item)
    },
    hasSelect(val) {
      for (let i = 0; i < this.selectData.length; i++) {
        if (this.selectData[i].uid === val) {
          return 1
        }
      }
      return 0
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.scroll = new Bscroll(this.$refs.wrapper, {
        click: false
      })
    })
  }
}
</script>

<style lang="scss" scoped>
.tree-list {
  flex: 1;
  overflow: hidden;
}
.dash {
  height: 2px;
  background: #f6f8fb;
}
.user-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  min-height: 30px;
  color: #333333;
  font-size: 14px;
  font-weight: 500;
  // font-size: 16px;
  .name {
    font-size: 14px;
    font-weight: 500;
    color: #333333;
  }
  .org {
    font-size: 12px;
    color: #999999;
  }
  .selectUser {
    color: #666666;
    &.active {
      color: #4a90e2;
    }
  }
  .card-left {
    display: flex;
    align-items: center;
    .select-icon {
      position: relative;
      left: 2px;
      width: 20px;
      height: 20px;
      margin-right: 8px;
      border-radius: 100%;
      .iconfont {
        font-size: 22px;
        position: absolute;
        top: -2px;
        left: -2px;
        color: #bed6f3;
      }
    }
  }
  .icon-right {
    color: #999999;
  }
}
.avatar {
  background: #67aee8;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 38px;
  height: 38px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  border-radius: 100%;
  margin-right: 6px;
  .icon-org {
    color: #ffffff;
    font-size: 26px;
  }
}
</style>
