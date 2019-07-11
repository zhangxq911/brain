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
        <Select v-model="searchForm.filter" style="width: 100px;">
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
        <Button @click="search" style="margin-left: 10px;">刷新</Button>
      </div>
    </Row>
    <Table :loading="loading" border :columns="columns" :data="dataList.data"></Table>
    <div class="footerPage">
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
import { parseTime } from '@/libs/tools'
import { parse } from 'path'

export default {
  data() {
    return {
      loading: false,
      rangeTime: '',
      dataList: [],
      columns: [
        {
          title: '通话时间',
          align: 'center',
          render: (h, params) => {
            return h('div', params.row.callTime + ' - ' + params.row.endTime)
          }
        },
        {
          title: '通话号码',
          align: 'center',
          key: 'calledTel'
        },
        {
          title: '通话对象',
          align: 'center',
          key: 'calledName'
        },
        {
          title: '通话时长',
          align: 'center',
          key: 'length'
        },
        {
          title: '通话类型',
          align: 'center',
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
          title: '用户IP/用户名称',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('div', params.row.sourceIpAddr),
              h('div', params.row.callerName)
            ])
          }
        },
        {
          title: '账户ID/账户名称',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('div', params.row.accountId),
              h('div', params.row.accountName)
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
        order: 'call_time|desc'
      },
      filterList: [
        {
          name: '主叫号码',
          value: 'callerTel'
        }
      ]
    }
  },
  methods: {
    // 改变时间
    selectTime() {
      this.searchForm.startTime = parseTime(this.rangeTime[0])
      this.searchForm.endTime = parseTime(this.rangeTime[1])
      let searchForm = { ...this.searchForm }
      searchForm.page = '1'
      if (searchForm.filter && searchForm.detail) {
        searchForm[searchForm.filter] = searchForm.detail
        this.getPage(searchForm)
      } else if (!searchForm.filter && searchForm.detail) {
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
      if (this.searchForm.filter === undefined) {
        this.$Message.error('请先选择查询类型')
        return
      } else {
        this.searchForm[this.searchForm.filter] = this.searchForm.content
        this.getPage(this.searchForm)
      }
    },
    // 获取列表
    getPage(params = {}) {
      params ? params : (params = this.searchForm)
      // 格式化日期
      if (params.startTime) {
        params.startTime = parseTime(params.startTime)
      }
      if (params.endTime) {
        params.endTime = parseTime(params.endTime)
      }
      getCdrList(params).then(res => {
        if (res.data.code === 200 && res.data.data !== null) {
          if (res.data.data.data === null) {
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
    this.getPage(this.searchForm)
  }
}
</script>
