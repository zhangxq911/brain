<template>
  <div class="user-avatar-dropdown">
    <span style="margin-right: 20px;">
      APP下载
      <!-- <span>sdfa</span> -->
    </span>
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
  data() {
    return {
      source: 0
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
  }
}
</script>
