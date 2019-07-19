<template>
  <div class="custom-bread-crumb">
    <Breadcrumb :style="{fontSize: `${fontSize}px`}">
      <BreadcrumbItem>
        <Icon
          class="backBtn"
          type="ios-arrow-back"
          v-if="list[list.length-1].meta.to && !list[list.length-1].meta.disBack"
          @click="to(list[list.length-1].meta.to)"
        ></Icon>
        {{showTitle(list[list.length-1])}}
      </BreadcrumbItem>
    </Breadcrumb>

    <!-- {{ list[list.length-1].meta }} -->
  </div>
</template>
<script>
import { showTitle } from '@/libs/util' // showtitle 是为了走i18
import CommonIcon from '_c/common-icon'
import './custom-bread-crumb.less'
export default {
  name: 'customBreadCrumb',
  components: {
    CommonIcon
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    fontSize: {
      type: Number,
      default: 14
    },
    showIcon: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 返回路由跳转
    to(route) {
      this.$router.push({
        name: route
      })
    },
    showTitle(item) {
      return showTitle(item, this)
    },
    isCustomIcon(iconName) {
      return iconName.indexOf('_') === 0
    },
    getCustomIconName(iconName) {
      return iconName.slice(1)
    }
  }
}
</script>

<style>
.backBtn {
  padding: 10px;
}
.backBtn:hover {
  cursor: pointer;
  color: #5fa1ee;
}
</style>