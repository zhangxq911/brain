<template>
  <div class="user-avatar-dropdown">
    <Dropdown @on-click="handleClick">
      <!-- <Avatar/></Avatar> -->
      {{userName}}
      <!-- <Badge :dot="!!messageUnreadCount">
      </Badge> -->
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="message">账户信息</DropdownItem>
        <DropdownItem name="logout">退出管理</DropdownItem>
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
      console.log(this.$store.state.user.userId)
      this.$router.push({
        name: 'edit_account',
        params: {
          id: this.$store.state.user.userId,
          mode: 'view'
        }
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
