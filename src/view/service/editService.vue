<template>
  <div class="card-box">
    <h3 class="detailTitle">基本信息</h3>
    <a
      class="editBtn"
      href="javascript:void(0)"
      @click="curMode = 'edit'"
      v-show="curMode === 'view'"
    >
      编辑
      <Icon type="md-create" />
    </a>
    <Row>
      <!-- 查看 -->
      <Col span="24" v-show="curMode === 'view'">
        <Form :label-width="150" style="min-width: 500px;">
          <FormItem label="服务名称">{{editForm.serverName }}</FormItem>
          <FormItem label="服务类型">{{remoteType }}</FormItem>
          <FormItem label="服务描述">{{editForm.description }}</FormItem>
          <FormItem label="服务域名或IP">{{editForm.serverHost }}</FormItem>
          <FormItem label="服务端口">{{editForm.serverPort }}</FormItem>
          <!-- <FormItem v-if="showGps" label="定位服务域名或IP地址">{{editForm.gpsHost }}</FormItem> -->
          <!-- <FormItem v-if="showGps" label="定位服务端口">{{editForm.gpsPort }}</FormItem> -->
          <FormItem label="定位服务域名或IP地址">{{editForm.gpsHost }}</FormItem>
          <FormItem label="定位服务端口">{{editForm.gpsPort }}</FormItem>
          <FormItem label="创建时间">{{editForm.createTime }}</FormItem>
          <FormItem label="运行状态">{{editForm.status ? '运行中': '已停止' }}</FormItem>
          <FormItem label="用户容量">{{editForm.totalCapacity }}</FormItem>
          <Divider dashed />
          <h3 class="detailChildTitle">用户实例开通信息</h3>
          <Row style="margin-top: 20px;">
            <Table :columns="columns" :data="editForm.instanceDetailDOS"></Table>
          </Row>
        </Form>
      </Col>
      <!-- 新增 -->
      <Col span="12" v-if="curMode === 'add'">
        <Form
          ref="addForm"
          :model="addForm"
          :rules="rulesValidate"
          :label-width="150"
          style="min-width: 500px;"
        >
          <FormItem prop="serverName" label="服务名称">
            <Input type="text" v-model="addForm.serverName" placeholder="请输入服务名称"></Input>
          </FormItem>
          <FormItem prop="serverType" label="服务类型">
            <Select v-model="addForm.serverType" @on-change="ifShowGps">
              <Option value="call">及时通信</Option>
              <Option value="gis">GIS地图</Option>
              <Option value="live">网络直播</Option>
            </Select>
          </FormItem>
          <FormItem prop="serverHost" label="服务域名或IP">
            <Input type="text" v-model="addForm.serverHost" placeholder="请输入服务域名或IP"></Input>
          </FormItem>
          <FormItem prop="serverPort" label="服务端口">
            <InputNumber
              style="width: 100%;"
              :min="1"
              v-model="addForm.serverPort"
              placeholder="请输入服务端口"
            ></InputNumber>
          </FormItem>
          <FormItem prop="totalCapacity" label="服务总容量">
            <InputNumber
              style="width: 100%;"
              :min="1"
              v-model="addForm.totalCapacity"
              placeholder="请输入服务总容量"
            ></InputNumber>
          </FormItem>
          <FormItem v-show="showGps" label="定位服务域名或IP地址">
            <Input type="text" v-model="addForm.gpsHost" placeholder="请输入定位服务域名或IP地址"></Input>
          </FormItem>
          <FormItem v-show="showGps" label="定位服务端口">
            <Input type="text" v-model="addForm.gpsPort" placeholder="请输入定位服务端口"></Input>
          </FormItem>
          <FormItem label="服务描述">
            <Input :rows="7" type="textarea" v-model="addForm.description" placeholder="请输入服务描述"></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="save">保存</Button>
          </FormItem>
        </Form>
      </Col>
      <!-- 编辑 -->
      <Col span="12" v-if="curMode === 'edit'">
        <Form
          ref="editForm"
          :model="editForm"
          :rules="rulesValidate"
          :label-width="150"
          style="min-width: 500px;"
        >
          <FormItem prop="serverName" label="服务名称">
            <Input type="text" v-model="editForm.serverName" placeholder="请输入服务名称"></Input>
          </FormItem>
          <FormItem prop="serverType" label="服务类型">
            <Select v-model="editForm.serverType" @on-change="ifShowGps">
              <Option value="call">远程会议</Option>
              <Option value="gis">联情指挥</Option>
              <Option value="live">网络直播</Option>
            </Select>
          </FormItem>
          <FormItem prop="serverHost" label="服务域名或IP">
            <Input type="text" v-model="editForm.serverHost" placeholder="请输入服务域名或IP"></Input>
          </FormItem>
          <FormItem prop="serverPort" label="服务端口">
            <InputNumber
              style="width: 100%;"
              :min="1"
              v-model="editForm.serverPort"
              placeholder="请输入服务端口"
            ></InputNumber>
          </FormItem>
          <FormItem label="服务总容量">
            <InputNumber
              style="width: 100%;"
              :min="1"
              :value="editForm.totalCapacity"
              :disabled="true"
            ></InputNumber>
          </FormItem>
          <FormItem v-if="showGps" label="定位服务域名或IP地址">
            <Input type="text" v-model="editForm.gpsHost" placeholder="请输入定位服务域名或IP地址"></Input>
          </FormItem>
          <FormItem v-if="showGps" label="定位服务端口">
            <Input type="text" v-model="editForm.gpsPort" placeholder="请输入定位服务端口"></Input>
          </FormItem>
          <FormItem label="服务描述">
            <Input :rows="7" type="textarea" v-model="editForm.description" placeholder="请输入服务描述"></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="update">保存</Button>
          </FormItem>
        </Form>
      </Col>
    </Row>
  </div>
</template>

<script>
import { addServer, getServiceInfo, putService } from '@/api/data'

export default {
  props: ['id', 'mode'],
  data() {
    return {
      remoteType: '',
      showGps: false,
      curMode: this.mode,
      addForm: {
        serverPort: 1,
        totalCapacity: 1
      },
      editForm: {},
      rulesValidate: {
        serverName: [
          { required: true, message: '请输入服务名称', trigger: 'blur' }
        ],
        serverType: [
          { required: true, message: '请选择服务类型', trigger: 'change' }
        ],
        serverHost: [
          { required: true, message: '请输入服务域名或IP', trigger: 'blur' }
        ],
        serverPort: [
          {
            type: 'number',
            required: true,
            message: '请输入服务端口',
            trigger: 'blur'
          }
        ],
        totalCapacity: [
          {
            type: 'number',
            required: true,
            message: '请输入服务总容量',
            trigger: 'blur'
          }
        ]
      },
      columns: [
        {
          title: '实例ID/实例名称',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'div',
                {
                  // style: {
                  //   color: '#2d8cf0'
                  // },
                  // attrs: {
                  //   class: 'hoverAccount'
                  // },
                  // on: {
                  //   click: () => {
                  //     this.$router.push({
                  //       name: 'edit_example',
                  //       params: {
                  //         id: params.row.id,
                  //         mode: 'view',
                  //         title: '实例详情',
                  //         to: 'edit_service'
                  //       }
                  //     })
                  //   }
                  // }
                },
                params.row.id
              ),
              h('div', {}, params.row.instName)
            ])
          }
        },
        {
          title: '实例类型',
          align: 'center',
          render: (h, params) => {
            let curinstType = params.row.instType
            switch (curinstType) {
              case 'call':
                curinstType = '远程会议'
                break
              case 'gis':
                curinstType = '联情指挥'
                break
              case 'live':
                curinstType = '网络直播'
                break
              default:
                curinstType = ''
            }
            return h('div', curinstType)
          }
        },
        {
          title: '状态',
          align: 'center',
          render: (h, params) => {
            let curStatus = params.row.status
            if (curStatus === 1) {
              curStatus = '运行中'
              return h(
                'div',
                {
                  style: {
                    color: '#19be6b'
                  }
                },
                curStatus
              )
            } else if (curStatus === 0) {
              curStatus = '已停止'
              return h(
                'div',
                {
                  style: {
                    color: '#ed4014'
                  }
                },
                curStatus
              )
            } else {
              curStatus = ''
              return h('div', curStatus)
            }
          }
        },
        {
          title: '创建时间',
          align: 'center',
          key: 'createTime'
        },
        {
          title: '用户容量',
          align: 'center',
          key: 'capacity'
        },
        {
          title: '账户ID/账户名称',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'div',
                // {
                //   style: {
                //     color: '#2d8cf0'
                //   },
                //   attrs: {
                //     class: 'hoverAccount'
                //   },
                //   on: {
                //     click: () => {
                //       this.$router.push({
                //         name: 'edit_account',
                //         params: {
                //           id: params.row.accountId,
                //           mode: 'view',
                //           title: '账户详情',
                //           to: 'service_page'
                //         }
                //       })
                //     }
                //   }
                // },
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
            return h('div', {
              // porps: {
              //   size: 'small'
              // }
            },'释放实例')
          }
        }
      ]
    }
  },
  methods: {
    // 更新
    update() {
      console.log(this.editForm)
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          putService(this.editForm).then(res => {
            if (res.data.code === 200) {
              this.$Message.success(res.data.msg)
              this.$router.push({
                name: 'service_page'
              })
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        }
      })
    },
    // 获取详情
    getInfo() {
      if (!this.id) {
        return
      }
      getServiceInfo(this.id).then(res => {
        if (res.data.code === 200) {
          this.editForm = res.data.data
          if (this.editForm.serverType === 'gis') {
            this.showGps = true
          }
          switch (this.editForm.serverType) {
            case 'call':
              this.remoteType = '远程会议'
              break
            case 'gis':
              this.remoteType = '联情指挥'
              break
            case 'live':
              this.remoteType = '网络直播'
              break
            default:
              break
          }
          if (!this.editForm.instanceDOS) {
            this.editForm.instanceDOS = []
          }
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    // 是否显示填写gps内容
    ifShowGps(val) {
      if (val === 'gis') {
        this.showGps = true
      } else {
        this.showGps = false
      }
    },
    // 保存
    save() {
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          addServer(this.addForm).then(res => {
            if (res.data.code === 200) {
              this.$Message.success(res.data.msg)
              // 重置表单
              this.$refs['addForm'].resetFields()
              this.$router.push({
                name: 'service_page'
              })
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        } else {
          console.log('校验失败')
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
.editBtn {
  padding-left: 24px;
}
</style>

