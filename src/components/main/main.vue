<template>
  <Layout style="height: 100%" class="main">
    <Sider
      hide-trigger
      collapsible
      :width="256"
      :collapsed-width="64"
      v-model="collapsed"
      class="left-sider"
      :style="{overflow: 'hidden'}"
    >
      <side-menu
        accordion
        ref="sideMenu"
        :active-name="$route.meta.to ? $route.meta.to : $route.name"
        :collapsed="collapsed"
        @on-select="turnToPage"
        :menu-list="menuList"
      >
        <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
        <div class="logo-con">
          <img class="logo" v-show="!collapsed" :src="maxLogo" key="max-logo">
          <div class="logo-title">云上会面</div>
          <!-- <img v-show="collapsed" :src="minLogo" key="min-logo"> -->
        </div>
      </side-menu>
    </Sider>
    <Layout>
      <Header class="header-con">
        <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
          <user :message-unread-count="unreadCount" :user-name="userName"/>
          <!-- <language
            v-if="$config.useI18n"
            @on-lang-change="setLocal"
            style="margin-right: 10px;"
            :lang="local"
          />-->
          <!-- <error-store
            v-if="$config.plugin['error-store'] && $config.plugin['error-store'].showInHeader"
            :has-read="hasReadErrorPage"
            :count="errorCount"
          ></error-store>-->
          <!-- <fullscreen v-model="isFullscreen" style="margin-right: 10px;"/> -->
        </header-bar>
      </Header>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <!-- <div class="tag-nav-wrapper"> -->
          <!-- <tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag"/> -->
          <!-- </div> -->
          <Content class="content-wrapper">
            <!-- <keep-alive :include="cacheList"> -->
            <router-view/>
            <!-- </keep-alive> -->
            <ABackTop :height="100" :bottom="80" :right="50" container=".content-wrapper"></ABackTop>
          </Content>
        </Layout>
      </Content>
    </Layout>
  </Layout>
</template>
<script>
import SideMenu from './components/side-menu'
import HeaderBar from './components/header-bar'
import User from './components/user'
import ABackTop from './components/a-back-top'
import { mapMutations, mapActions, mapGetters } from 'vuex'
import routers from '@/router/routers'
import minLogo from '@/assets/images/logo-min.jpg'
import maxLogo from '@/assets/images/logo-small.png'
import './main.less'
export default {
  name: 'Main',
  components: {
    SideMenu,
    HeaderBar,
    User,
    ABackTop
  },
  data () {
    return {
      collapsed: false,
      minLogo,
      maxLogo
    }
  },
  computed: {
    ...mapGetters(['errorCount']),
    tagRouter () {
      return this.$store.state.app.tagRouter
    },
    userName () {
      return this.$store.state.user.userName
    },
    menuList () {
      return this.$store.getters.menuList
    },
    local () {
      return this.$store.state.app.local
    },
    hasReadErrorPage () {
      return this.$store.state.app.hasReadErrorPage
    },
    unreadCount () {
      return this.$store.state.user.unreadCount
    }
  },
  methods: {
    ...mapMutations([
      'setBreadCrumb',
      'addTag',
      'setLocal',
      'setHomeRoute',
      'closeTag'
    ]),
    ...mapActions(['handleLogin']),
    turnToPage (route) {
      let { name, params, query } = {}
      if (typeof route === 'string') name = route
      else {
        name = route.name
        params = route.params
        query = route.query
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }
      this.$router.push({
        name,
        params,
        query
      })
    },
    handleCollapsedChange (state) {
      this.collapsed = state
    },
    handleClick (item) {
      this.turnToPage(item)
    }
  },
  watch: {
    $route (newRoute) {
      const { name, query, params, meta } = newRoute
      // this.addTag({
      //   route: { name, query, params, meta },
      //   type: 'push'
      // })
      this.setBreadCrumb(newRoute)
      this.$refs.sideMenu.updateOpenName(newRoute.name)
    }
  },
  mounted () {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    this.setHomeRoute(routers)
    const { name, params, query, meta } = this.$route
    // this.addTag({
    //   route: { name, params, query, meta }
    // })
    this.setBreadCrumb(this.$route)
    // 获取未读消息条数
  }
}
</script>

<style scoped>
.main .logo-con img.logo {
  display: inline-block;
  padding-left: 18px;
}
.logo-title {
  position: relative;
  display: inline-block;
  top: -14px;
  left: 24px;
  /* width: 85px; ie 超出长度折叠 */
  height: 28px;
  font-size: 20px;
  font-family: Arial-Black;
  font-weight: 900;
  color: rgba(255, 255, 255, 1);
  line-height: 28px;
  letter-spacing: 1px;
}
</style>
