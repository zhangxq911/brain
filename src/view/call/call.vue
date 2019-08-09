<template>
  <div class="card-box">
    <Row style="padding-bottom: 10px;">
      时间
      <DatePicker
        @on-ok="selectTime"
        @on-clear="clearTime"
        v-model="rangeTime"
        type="datetimerange"
        placeholder="请选择时间区间"
        style="width: 300px"
      ></DatePicker>
      <div style="float: right;">
        <Select
          @on-change="search"
          v-model="searchForm.callType"
          style="width: 100px; "
          placeholder="通话类型"
        >
          <Option :value="0">所有类型</Option>
          <Option :value="1">语音通话</Option>
          <Option :value="2">视频通话</Option>
          <Option :value="3">语音对讲</Option>
          <Option :value="4">视频对讲</Option>
          <Option :value="5">语音会议</Option>
          <Option :value="6">视频会议</Option>
        </Select>
        <Select v-model="searchForm.filter" style="width: 100px; margin-left: 10px;">
          <Option
            v-for="(item, index) in filterList"
            :value="item.value"
            :key="index"
          >{{ item.name }}</Option>
        </Select>
        <Input
          search
          v-model="searchForm.content"
          placeholder="请输入搜索内容"
          style="width: 200px; margin-left: 10px;"
          @on-search="search"
        ></Input>
        <Button @click="refresh" style="margin-left: 10px;">刷新</Button>
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
  </div>
</template>

<script>
import { getCdrList } from '@/api/data'
import { parseTime, formatSeconds } from '@/libs/tools'
import { parse } from 'path'

export default {
  data() {
    return {
      rangeTime: [
        parseTime(new Date(), '{y}-{m}-{d}') + '0:0:0',
        parseTime(new Date(), '{y}-{m}-{d}') + '23:59:59'
      ],
      loading: false,
      dataList: [],
      columns: [
        {
          title: '通话时间',
          align: 'center',
          width: 160,
          key: 'callTime',
          // render: (h, params) => {
          //   return h('div', params.row.callTime + ' - ' + params.row.endTime)
          // }
        },
        {
          title: '通话类型',
          align: 'center',
          sortable: 'custom',
          key: 'callType',
          render: (h, params) => {
            let curType = ''
            switch (params.row.callType) {
              case 1:
                curType = '语音通话'
                break
              case 2:
                curType = '视频通话'
                break
              case 3:
                curType = '语音对讲'
                break
              case 4:
                curType = '视频对讲'
                break
              case 5:
                curType = '语音会议'
                break
              case 6:
                curType = '视频会议'
                break
              default:
                break
            }
            return h('div', curType)
          }
        },
        {
          title: '通话号码',
          align: 'center',
          sortable: 'custom',
          key: 'calledTel',
          ellipsis: true
        },
        {
          title: '通话对象',
          align: 'center',
          sortable: 'custom',
          key: 'calledName',
          ellipsis: true
        },
        {
          title: '通话时长',
          align: 'center',
          sortable: 'custom',
          key: 'length',
          render: (h, params) => {
            let time = formatSeconds(params.row.length)
            return h('div', time)
          }
        },
        {
          title: '用户ID/用户名称',
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
                        name: 'edit_users',
                        params: {
                          id: params.row.callerId,
                          mode: 'view',
                          title: '用户详情',
                          to: 'call_page'
                        }
                      })
                    }
                  }
                },
                params.row.callerId
              ),
              h('div', params.row.callerName)
            ])
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
                          title: '账户详情',
                          to: 'call_page'
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
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'success',
                    size: 'small'
                  },
                  style: {
                    margin: '4px'
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        name: 'edit_call',
                        params: {
                          id: params.row.id,
                          mode: 'view',
                          title: '通话详情'
                        }
                      })
                    }
                  }
                },
                '详情'
              )
            ])
          }
        }
      ],
      searchForm: {
        startTime: '2009-06-21 11:07:33',
        endTime: new Date(),
        page: 1,
        order: 'call_time|desc',
        filter: 'calledName',
        callType: 0
      },
      filterList: [
        {
          name: '通话号码',
          value: 'calledTel'
        },
        {
          name: '通话对象',
          value: 'calledName'
        },
        {
          name: '用户ID',
          value: 'callerId'
        },
        {
          name: '用户名称',
          value: 'callerName'
        }
      ]
    }
  },
  created() {
    let access = this.$store.state.user.access
    if (access.includes('super_admin')) {
      this.defAccount = 'super_admin'
    } else if (access.includes('company') || access.includes('personal')) {
      this.defAccount = 'unit'
      this.columns.splice(6, 1)
    }
  },
  methods: {
    refresh() {
      this.searchForm.content = ''
      this.search()
    },
    sortChange(res) {
      // let key = res.key.replace(/([A-Z])/g, '_$1').toLowerCase()
      let search = { ...this.searchForm }
      search.sort = res.key + ',' + res.order
      res.order === 'normal' ? (search.sort = '') : ''
      this.getPage(search)
    },
    // 改变时间
    selectTime() {
      this.searchForm.startTime = parseTime(this.rangeTime[0])
      this.searchForm.endTime = parseTime(this.rangeTime[1])
      let searchForm = { ...this.searchForm }
      searchForm.page = '1'
      if (searchForm.filter && searchForm.content) {
        searchForm[searchForm.filter] = searchForm.content
        this.getPage(searchForm)
      } else if (!searchForm.filter && searchForm.content) {
        this.$Message.error('请先选择查询类型')
      } else {
        this.getPage(searchForm)
      }
    },
    // 清空时间
    clearTime() {
      this.searchForm.startTime = ''
      this.searchForm.endTime = ''
      this.searchForm.page = '1'
      this.getPage(this.searchForm)
    },
    // 分页
    changePage(curPage) {
      let search = { ...this.searchForm }
      search.page = curPage
      this.getPage(searchForm)
    },
    // 搜索
    search() {
      this.searchForm.page = 1
      if (!this.searchForm.content) {
        this.searchForm.content = null
      }
      if (this.searchForm.filter === undefined && this.searchForm.content) {
        this.$Message.error('请先选择查询类型')
        return
      } else {
        if (this.searchForm.content) {
          this.searchForm[this.searchForm.filter] = this.searchForm.content
        } else {
          delete this.searchForm[this.searchForm.filter]
        }
        this.loading = true
        this.getPage(this.searchForm)
      }
    },
    // 获取列表
    getPage(params = {}) {
      if (this.searchForm.callType === 0) {
        delete this.searchForm.callType
      }
      params ? params : (params = this.searchForm)
      // 格式化日期
      if (params.startTime) {
        params.startTime = parseTime(params.startTime)
      }
      if (params.endTime) {
        params.endTime = parseTime(params.endTime)
      }
      getCdrList(params).then(res => {
        if (res.data.code === 200 && res.data) {
          if (!res.data.data.data) {
            this.dataList = res.data.data
            this.dataList.data = []
          } else {
            this.dataList = res.data.data
          }
        } else {
          console.log('通话列表获取失败')
        }
        this.loading = false
      })
    }
  },
  mounted() {
    this.searchForm.startTime = parseTime(this.rangeTime[0])
    this.searchForm.endTime = parseTime(this.rangeTime[1])
    this.getPage(this.searchForm)
  }
}
</script>
