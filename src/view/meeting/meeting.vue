<template>
  <div class="card-box">
    <Row>
      <Button v-if="defAccount === 'unit'" type="primary" @click="showMask('addMeeting', 50)">会议预约</Button>
      <div style="float: right; margin-bottom: -10px;">
        <Form ref="searchForm" :model="searchForm" inline>
          <FormItem>
            时间
            <DatePicker
              @on-change="changeTime"
              style="width: 180px"
              type="daterange"
              placeholder="请选择开始时间"
            ></DatePicker>
          </FormItem>
          <FormItem>
            <Select
              @on-change="search"
              v-model="searchForm.meetingState"
              clearable
              style="width: 100px;"
              placeholder="会议状态"
            >
              <Option :value="0">预约中</Option>
              <Option :value="1">进行中</Option>
              <Option :value="2">已结束</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Select
              @on-change="search"
              clearable
              v-model="searchForm.meetingType"
              style="width: 100px;"
              placeholder="会议类型"
            >
              <Option :value="0">视频会议</Option>
              <Option :value="1">语音会议</Option>
            </Select>
          </FormItem>
          <FormItem prop="filter">
            <Select
              @on-change="clearSearch"
              v-model="searchForm.filter"
              clearable
              style="width: 100px;"
              placeholder="其他条件"
            >
              <Option
                v-for="(item, index) in filterList"
                :value="item.value"
                :key="index"
              >{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem prop="content">
            <Input
              search
              v-model="searchForm.content"
              placeholder="请输入搜索内容"
              style="width: 200px; "
              @on-search="search"
            ></Input>
          </FormItem>
          <FormItem>
            <Button @click="refresh">刷新</Button>
          </FormItem>
        </Form>
      </div>
    </Row>
    <Table
      @on-sort-change="sortChange"
      :loading="loading"
      border
      :columns="columns"
      :data="dataList.data"
    ></Table>
    <div class="footerPage">
      <span
        class="pageMsg"
      >当前 {{dataList.data ? dataList.data.length : 0}} 条记录，共 {{dataList.count ? dataList.count : 0}} 条记录。</span>
      <Page
        :current="dataList.pageNumber"
        :page-size="dataList.pageSize"
        :total="dataList.count"
        @on-change="changePage"
      />
    </div>
    <MaskMeeting @sendModal="getModal" @resetPage="getPage" :basicInfo="basicInfo"></MaskMeeting>
  </div>
</template>

<script>
import MaskMeeting from './maskMeeting'
import { getMeetPage, delMeet } from '@/api/data'
import { getDateDiff } from '@/libs/tools'

export default {
  components: { MaskMeeting },
  data() {
    return {
      defAccount: '',
      loading: false,
      searchForm: {
        page: 1,
        // sort: 'create_time,desc',
        meetingType: '',
        meetingState: '',
        startTime: '',
        endTime: '',
        filter: '',
        meetingSubject: '',
        hostName: ''
      },
      filterList: [
        {
          name: '会议主题',
          value: 'meetingSubject'
        }
        // {
        //   name: '主持人',
        //   value: 'hostName'
        // }
      ],
      dataList: {},
      columns: [
        {
          title: '会议主题',
          align: 'center',
          width: 150,
          sortable: 'custom',
          key: 'meetingSubject',
          render: (h, params) => {
            return h(
              'div',
              {
                style: {
                  color: '#2d8cf0'
                },
                attrs: {
                  class: 'hoverAccount'
                },
                on: {
                  click: () => {
                    this.$router.push({
                      name: 'edit_meeting',
                      params: {
                        id: params.row.id,
                        mode: 'view',
                        title: '会议详情'
                      }
                    })
                  }
                }
              },
              params.row.meetingSubject
            )
          }
        },
        {
          title: '主持人',
          align: 'center',
          sortable: 'custom',
          key: 'hostName'
        },
        {
          title: '会议时间',
          align: 'center',
          // width: 190,
          // sortable: 'custom',
          key: 'startTime',
          render: (h, params) => {
            let startTime = params.row.startTime
            let endTime = params.row.endTime
            let week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
            let startDate = new Date(getDateDiff(startTime))
            let endDate = new Date(getDateDiff(endTime))
            let val1 =
              getDateDiff(startTime.slice(0, 10)) +
              '(' +
              week[startDate.getDay()] +
              ')' +
              startTime.substring(10, startTime.length - 3)
            let val2 =
              getDateDiff(endTime.slice(0, 10)) +
              '(' +
              week[endDate.getDay()] +
              ')' +
              endTime.substring(10, endTime.length - 3)
            return h('div', [h('div', val1), h('div', val2)])
          }
        },
        {
          title: '会议类型',
          align: 'center',
          sortable: 'custom',
          key: 'meetingType',
          width: 120,
          render: (h, params) => {
            let val = params.row.meetingType
            switch (val) {
              case 0:
                val = '视频会议'
                break
              case 1:
                val = '语音会议'
                break
              default:
                val = ''
            }
            return h('div', val)
          }
        },
        {
          title: '会议状态',
          align: 'center',
          sortable: 'custom',
          key: 'meetingState',
          width: 120,
          render: (h, params) => {
            let val = params.row.meetingState
            switch (val) {
              case 0:
                val = '预约中'
                break
              case 1:
                val = '进行中'
                break
              case 2:
                val = '已结束'
                break
              default:
                val = ''
            }
            return h('div', val)
          }
        },
        {
          title: '账户ID/账户名称',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'div',
                {
                  style: {
                    color: '#2d8cf0'
                  },
                  attrs: {
                    class: 'hoverAccount'
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        name: 'edit_account',
                        params: {
                          id: params.row.accountId,
                          mode: 'view',
                          title: '账户详情'
                        }
                      })
                    }
                  }
                },
                params.row.accountId
              ),
              h('div', {}, params.row.accountName)
            ])
          }
        },
        {
          title: '操作',
          align: 'center',
          width: 140,
          render: (h, params) => {
            if (this.defAccount === 'super_admin') {
              return h('div', [
                h(
                  'Button',
                  {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    style: {
                      margin: '4px'
                    },
                    on: {
                      click: () => {
                        this.$Modal.confirm({
                          title: '信息',
                          content: `<p>确认删除 ${params.row.meetingSubject} 吗？</p>`,
                          onOk: () => {
                            this.delete(params.row.id)
                          }
                        })
                      }
                    }
                  },
                  '删除'
                )
              ])
            } else if (this.defAccount === 'unit') {
              return h('div', [
                h(
                  'Button',
                  {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      margin: '4px'
                    },
                    on: {
                      click: () => {
                        this.showMask('editMeeting', 50, params.row.id)
                      }
                    }
                  },
                  '编辑'
                ),
                h(
                  'Button',
                  {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    style: {
                      margin: '4px'
                    },
                    on: {
                      click: () => {
                        this.$Modal.confirm({
                          title: '信息',
                          content: `<p>确认删除 ${params.row.meetingSubject} 吗？</p>`,
                          onOk: () => {
                            this.delete(params.row.id)
                          }
                        })
                      }
                    }
                  },
                  '删除'
                )
              ])
            } else {
              return {}
            }
          }
        }
      ],
      basicInfo: {}
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
    refresh() {
      this.searchForm.content = ''
      this.search()
    },
    delete(id) {
      delMeet(id).then(res => {
        if (res.data.code === 200) {
          this.$Message.success(res.data.msg)
          this.getPage()
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    clearSearch() {
      this.searchForm.meetingSubject = ''
      this.searchForm.hostName = ''
    },
    search() {
      this.searchForm.page = 1
      if (!this.searchForm.content) {
        this.searchForm.content = null
      }
      if (this.searchForm.filter === undefined && this.searchForm.content) {
        this.$Message.error('请先选择查询类型')
        return
      } else {
        this.searchForm[this.searchForm.filter] = this.searchForm.content
        this.loading = true
        this.getPage(this.searchForm)
      }
    },
    changeTime(val) {
      this.searchForm.startTime = val[0]
      this.searchForm.endTime = val[1]
      this.getPage(this.searchForm)
    },
    getPage(params = {}) {
      params ? params : (params = this.searchForm)
      // 类型、状态不存在不传
      if (Number.isNaN(this.searchForm.meetingType)) {
        delete this.searchForm.meetingType
      }
      if (Number.isNaN(this.searchForm.meetingState)) {
        delete this.searchForm.meetingState
      }
      getMeetPage(params)
        .then(res => {
          if (res.data.code === 200 && res.data) {
            if (!res.data.data.data) {
              this.dataList = res.data.data
              this.dataList.data = []
            } else {
              this.dataList = res.data.data
            }
          } else {
            this.$Message.error('会议列表获取失败')
          }
          this.loading = false
        })
        .catch(err => this.$Message.error(err))
    },
    sortChange(res) {
      // FIXME： 后端未支持
      let key = res.key.replace(/([A-Z])/g, '_$1').toLowerCase()
      let search = { ...this.searchForm }
      search.sort = key + ',' + res.order
      res.order === 'normal' ? (search.sort = '') : ''
      this.loading = true
      this.getPage(search)
    },
    // 分页查询
    changePage(curPage) {
      let search = { ...this.searchForm }
      search.page = curPage
      this.getPage(search)
    },
    showMask(type, width, id) {
      // 新增要填写基本信息后才能选择，否则选择页面相关字段为空值
      this.basicInfo = {
        type: type,
        width: width,
        id: id
      }
    },
    getModal(data) {
      this.basicInfo.type = data
    }
  },
  mounted() {
    this.getPage()
  }
}
</script>

<style>
</style>