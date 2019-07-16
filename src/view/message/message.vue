<template>
  <div class="card-box">
    <Row>
      <Button v-if="defAccount === 'super_admin'" type="primary" @click="add">新增</Button>
    </Row>
    <div style="margin: 20px 0;">
      <Scroll :height="520" :on-reach-bottom="handleReachBottom">
        <Timeline>
          <TimelineItem v-for="(item, index) in dataList" :key="index">
            <div style="padding-left: 20px;">
              <div class="title">
                <span v-if="index === 0" style=" color: red; position: absolute; left: 24px;">新</span>
                <span class="pot"></span>
                <h5>
                  {{item.title}}
                  <span
                    style="float: right; font-size: 10px; color: #c5c5c5; font-weight: 400;"
                  >{{item.time}}</span>
                </h5>
              </div>
              <div style="display: flex;">
                <span class="line-content">{{item.content}}</span>
                <span style="padding: 0 20px; font-weight: 500;">{{item.updateTime}}</span>
                <span class="btn" @click="view(item.id)">详情</span>
                <span class="btn" @click="edit(item.id)" v-if="defAccount==='super_admin'">编辑</span>
                <span
                  class="btn"
                  style="color: #BE6B75;"
                  @click="showDel(item.id)"
                  v-if="defAccount === 'super_admin'"
                >删除</span>
              </div>
            </div>
          </TimelineItem>
          <div v-show="showBottom" style="text-align: center; font-size: 14px;">---啊哦，没有更多消息了---</div>
        </Timeline>
      </Scroll>
    </div>
    <Modal v-model="modal" title="信息" @on-ok="del">
      <p>确定移除该实例吗？</p>
    </Modal>
  </div>
</template>

<script>
import { getMsgList, delMsg } from '@/api/data'
import { parseTime } from '@/libs/tools'
// import vuescroll from 'vuescroll'

export default {
  data() {
    return {
      showBottom: false,
      defAccount: '',
      delId: '',
      modal: false,
      dataList: [],
      searchForm: { pageNumber: 1 }
    }
  },
  created() {
    let access = this.$store.state.user.access
    if (access.includes('super_admin')) {
      this.defAccount = 'super_admin'
    } else if (access.includes('company') || access.includes('personal')) {
      this.defAccount = 'unit'
    }
  },
  methods: {
    // 底部加载
    handleReachBottom() {
      this.getList()
    },
    // 删除弹窗
    showDel(id) {
      this.delId = id
      this.modal = true
    },
    del() {
      delMsg(this.delId).then(res => {
        if (res.data.code === 200) {
          this.$Message.success(res.data.msg)
          this.getList()
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    // 编辑
    edit(id) {
      this.$router.push({
        name: 'edit_msg',
        params: {
          id: id,
          mode: 'edit',
          title: '消息编辑'
        }
      })
    },
    // 详情查看
    view(id) {
      this.$router.push({
        name: 'edit_msg',
        params: {
          id: id,
          mode: 'view',
          title: '消息详情'
        }
      })
    },
    // 新增
    add() {
      this.$router.push({
        name: 'edit_msg',
        params: {
          id: '',
          mode: 'add',
          title: '新建消息'
        }
      })
    },
    // 获取数据
    getList() {
      getMsgList(this.searchForm).then(res => {
        if (res.data.code === 200) {
          let arr = res.data.data
          // 默认每次加载20条数据，后端返回
          if (arr.length > 0) {
            this.searchForm.pageNumber++
          } else {
            this.showBottom = true
            return
          }
          arr.forEach(item => {
            item.updateTime = parseTime(item.updateTime, '{y}.{m}.{d}')
          })
          // this.dataList.concat(arr) 该方法每次合并后豆薯保留原来的对象，造成空间浪费
          this.dataList.push.apply(this.dataList, arr)
        }
      })
    }
  },
  mounted() {
    this.getList()
  }
}
</script>

<style scoped>
.pot {
  display: inline-block;
  width: 9px;
  height: 9px;
  background: rgb(45, 140, 240);
  position: absolute;
  left: 2px;
  top: 5px;
  border-radius: 10px;
}
.line-content {
  display: inline-block;
  width: 400px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.btn {
  padding: 0 10px;
  color: #5b8cff;
}
.btn:hover {
  text-decoration: underline;
  cursor: pointer;
}
</style>