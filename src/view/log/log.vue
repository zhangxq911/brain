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
          v-model="searchForm.detail"
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
import { getLogList } from '@/api/data'
import { parseTime } from '@/libs/tools'

export default {
  data() {
    return {
      loading: false,
      rangeTime: [
        parseTime(new Date(), '{y}-{m}-{d}') + '0:0:0',
        parseTime(new Date(), '{y}-{m}-{d}') + '23:59:59'
      ],
      dataList: [],
      searchForm: {
        filter: 'object'
      },
      filterList: [
        {
          name: '操作对象',
          value: 'object'
        },
        {
          name: '操作内容',
          value: 'content'
        },
        {
          name: '操作人员',
          value: 'name'
        }
      ],
      columns: [
        {
          title: '操作时间',
          align: 'center',
          width: 150,
          sortable: 'custom',
          key: 'logTime'
        },
        {
          title: '操作对象',
          align: 'center',
          sortable: 'custom',
          key: 'object'
        },
        {
          title: '操作内容',
          align: 'center',
          sortable: 'custom',
          key: 'content'
        },
        {
          title: '操作人员',
          align: 'center',
          sortable: 'custom',
          key: 'name'
        },
        {
          title: '源IP地址',
          align: 'center',
          sortable: 'custom',
          key: 'sourceIpAddr'
        },
        {
          title: '账户ID/账户名称',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('div', params.row.id),
              h('div', params.row.name)
            ])
          }
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
      this.columns.splice(5, 1)
    }
  },
  methods: {
    sortChange(res) {
      let key = res.key.replace(/([A-Z])/g, '_$1').toLowerCase()
      let search = { ...this.searchForm }
      search.sort = key + ',' + res.order
      res.order === 'normal' ? (search.sort = '') : ''
      this.loading = true
      this.getPage(search)
    },
    refresh() {
      this.searchForm.detail = ''
      this.search()
    },
    // 分页
    changePage(curPage) {
      this.searchForm.page = curPage
      this.getPage(this.searchForm)
    },
    // 时间筛选
    selectTime() {
      // 判断是否已经输入查询条件
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
    // 搜索
    search() {
      let searchForm = { ...this.searchForm }
      searchForm.page = 1
      if (!searchForm.startTime || !searchForm.endTime) {
        this.$Message.error('请先选择查询时间')
        return
      }
      if (searchForm.filter === undefined) {
        this.$Message.error('请先选择查询类型')
        return
      } else {
        searchForm[searchForm.filter] = searchForm.detail
        this.loading = true
        this.getPage(searchForm)
      }
    },
    // 获取列表
    getPage(params = {}) {
      getLogList(params).then(res => {
        if (res.data.code === 200 && res.data) {
          if (!res.data.data.data) {
            this.dataList = res.data.data
            this.dataList.data = []
          } else {
            this.dataList = res.data.data
          }
        } else {
          console.log('实例列表获取失败')
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
