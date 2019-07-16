<template>
  <div class="user-avatar-dropdown">
    <div class="app-down">
      APP下载
      <div class="qr-box">
        <VueQrcode class="share-qrcode" :value="qrcodeUrl" :options="{ size: 130 }"></VueQrcode>
        <div class="qr-title">扫一扫下载手机APP</div>
      </div>
    </div>

    <Dropdown @on-click="handleClick">
      <!-- <Avatar/></Avatar> -->
      {{userName}}
      <!-- <Badge :dot="!!messageUnreadCount">
      </Badge>-->
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="message">账户信息</DropdownItem>
        <DropdownItem v-if="source === 0" name="logout">退出管理</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
import VueQrcode from '@xkeshi/vue-qrcode'

export default {
  name: 'User',
  props: {
    userName: {
      type: String,
      default: ''
    },
    messageUnreadCount: {
      type: Number,
      default: 0
    }
  },
  components: {
    VueQrcode
  },
  data() {
    return {
      source: 0,
      qrcodeUrl: ''
    }
  },
  created() {
    this.source = this.$store.state.user.source
  },
  methods: {
    ...mapActions(['handleLogOut']),
    logout() {
      this.handleLogOut().then(() => {
        this.$router.push({
          name: 'login'
        })
      })
    },
    message() {
      let params = {
        id: this.$store.state.user.userId,
        mode: 'view',
        title: '账户详情'
      }
      // 判断是否显示返回按钮，这里的要判断权限是否是管理员，管理员才能显示返回
      let access = this.$store.state.user.access
      if (!access.includes('super_admin')) {
        params.disBack = true
      }
      this.$router.push({
        name: 'edit_account',
        params: params
      })
    },
    handleClick(name) {
      switch (name) {
        case 'logout':
          this.logout()
          break
        case 'message':
          this.message()
          break
      }
    }
  },
  mounted() {
    // 获取当前 qrcode 的二维码信息
    this.qrcodeUrl = location.origin + '/console/h5'
  }
}
</script>

<style scoped>
.app-down {
  margin-right: 20px;
  display: inline-block;
  position: relative;
}
.app-down:hover .qr-box {
  display: block;
}
.qr-box {
  display: none;
  position: absolute;
  z-index: 99;
  left: 50%;
  transform: translate(-50%);
  width: 150px;
  height: 160px;
  background: rgba(0, 0, 0, 0.5);
}
.qr-box:before {
  /* display: block; */
  content: '';
  border-width: 8px 8px 8px 8px;
  border-style: solid;
  border-color: transparent transparent rgba(0, 0, 0, 0.5) transparent;
  position: absolute;
  left: 50%;
  top: -16px;
  transform: translate(-50%);
}
.share-qrcode {
  margin: 10px 10px 0;
}
.qr-title {
  width: 100%;
  text-align: center;
  color: #fff;
  line-height: initial;
  position: absolute;
  bottom: 2px;
}
</style>
