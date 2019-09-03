<template>
  <div style="width: 100vw; height: 100vh; overflow: auto;">
    <div style="width: 100vw; height: 100vh; overflow: hidden; background: #333333;" v-if="isWx">
      <img style="width: 96%; float: right;" src="../../assets/images/open-wx.png" alt="请从浏览器打开" />
    </div>
    <div class="h5-wrap" v-if="!isWx">
      <div class="header">
        <img class="head-img" src="../../assets/images/head-logo.png" alt="logo" />
      </div>
      <div class="h5-card" v-for="(item, index) in basicInfo" :key="index">
        <div style="height: 420px;" v-if="item.child.length > 0">
          <div class="card-top">
            <div style="width: 106px; height: 106px;">
              <img
                style="width: 100%; height: 100%;"
                src="../../assets/images/logo-meeting.png"
                v-if="item.app === 'meeting'"
                alt="图标"
              />
              <img
                style="width: 100%; height: 100%;"
                src="../../assets/images/logo-remote.png"
                v-if="item.app === 'remote'"
                alt="图标"
              />
              <img
                style="width: 100%; height: 100%;"
                src="../../assets/images/logo-tv.png"
                v-if="item.app === 'tv'"
                alt="图标"
              />
              <img
                style="width: 100%; height: 100%;"
                src="../../assets/images/logo-live.png"
                v-if="item.app === 'live'"
                alt="图标"
              />
            </div>
            <div style="flex: 1; padding-left: 10px;">
              <h2 style="color: #333333;">{{item.name}}</h2>
              <div class="description">{{item.description}}</div>
              <div class="device" v-if="item.device === 1">支持iOS/Android设备</div>
              <div class="device" v-if="item.device === 2">支持Android设备</div>
              <div class="device" v-if="item.device === 3">支持iOS设备</div>
            </div>
          </div>
          <Divider style="margin: 16px 0;" dashed />
          <div class="card-content">
            <div class="tips">长按二维码下载</div>
            <div style="display: flex; padding: 10px 0;">
              <div class="qr-box" v-for="(child, i) in item.child" :key="i">
                <div class="qrcode">
                  <VueQrcode tag="img" :value="child.url" :options="{ size: 158 }"></VueQrcode>
                </div>
                <div class="qr-btn" v-if="child.type === 'android'">
                  <Icon type="logo-android" class="h5-icon" />
                  <span @click="jump(child.url)">安卓下载</span>
                </div>
                <div class="qr-btn" v-if="child.type === 'ios'">
                  <Icon type="logo-ios" class="h5-icon" />
                  <span @click="jump(child.url)">苹果下载</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getLatestInfo } from '@/api/data'
import VueQrcode from '@xkeshi/vue-qrcode'

export default {
  components: { VueQrcode },
  data() {
    return {
      isWx: false,
      basicInfo: [
        {
          app: 'meeting',
          name: '云上会面手机版',
          description: '随时随地进行高清视频通话、视频会议、多人聊天。',
          icon: '../../assets/images/logo-call.png',
          device: 1, // 1 两个 2 android 3 ios
          child: []
        },
        {
          app: 'remote',
          name: '云上会面Remote',
          description: '远程控制，让APP使用更加方便。',
          icon: '../../assets/images/logo-remote.png',
          device: 1,
          child: []
        },
        {
          app: 'tv',
          name: '美播云视听',
          description: '实时直播观看，聊天评论、回放观看、直播分享。',
          icon: '../../assets/images/logo-listen.png',
          device: 1,
          child: []
        },
        {
          app: 'livepush',
          name: '直播推流',
          description: '美播云直播专用推流工具。',
          icon: '../../assets/images/logo-live.png',
          device: 2,
          child: []
        }
      ]
    }
  },
  created() {
    // 微信浏览器且是安卓的时候提示浏览器右上角打开
    const u = navigator.userAgent
    let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
    let wx = this.isWeiXin()
    if (wx && isAndroid) {
      this.isWx = true
    }
  },
  methods: {
    // 判断是否微信
    isWeiXin() {
      const ua2 = navigator.userAgent.toLowerCase()
      if (ua2.match(/MicroMessenger/i) == 'micromessenger') {
        return true
      } else {
        return false
      }
    },
    // 按钮跳转链接
    jump(url) {
      window.location.href = url
    },
    getInfo() {
      getLatestInfo().then(res => {
        if (res.data.code === 200) {
          // 公共部分统一用android处理
          let data = res.data.data
          let basic = this.basicInfo
          data.forEach(item1 => {
            basic.forEach(item2 => {
              if (item1.appName === item2.app) {
                item2.child.push(item1)
              }
            })
          })
          this.basicInfo = basic
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

<style scoped>
.h5-wrap {
  display: flex;
  flex-direction: column;
  background: #f9f9f9;
  overflow: auto;
}
.header {
  background-image: url('../../assets/images/head-bg.png');
  background-size: cover;
  height: 60px;
  display: flex;
  align-items: center;
}
.head-img {
  width: 128px;
  height: 42px;
  margin-left: 20px;
}
.h5-card {
  margin-bottom: 10px;
  background: #fff;
  /* height: 420px; */
}
.card-top {
  padding: 16px 16px 0px;
  display: flex;
  flex-direction: row;
}
.description {
  font-size: 14px;
  padding: 10px 0px;
  font-weight: 500;
  height: 62px;
}
/* .version {
  font-size: 14px;
  color: #666666;
} */
.device {
  font-size: 14px;
  color: #999999;
  padding-top: 10px;
}
.card-content {
  /* text-align: center; */
  padding: 0px 16px 16px;
}
.tips {
  text-align: center;
  color: #666666;
  font-size: 14px;
}
.qr-box {
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
}
.qrcode {
  width: 158px;
  height: 158px;
  background: #ccc;
}
.qr-btn {
  margin: 10px 0;
  width: 136px;
  height: 32px;
  background: #61adff;
  padding: 6px 10px;
  border-radius: 6px;
  border-radius: 32px;
  text-align: center;
  color: #fff;
}
.h5-icon {
  position: relative;
  top: -2px;
  font-size: 18px;
  padding: 0 2px;
}
</style>
