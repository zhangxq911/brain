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
      <!-- 详情 -->
      <Col span="12" v-if="curMode === 'view'">
        <Form :label-width="80" style="min-width: 500px;">
          <FormItem label="应用名称">{{editForm.appName}}</FormItem>
          <FormItem label="应用类型">{{editForm.type}}</FormItem>
          <FormItem label="更新状态">{{curStatus}}</FormItem>
          <FormItem label="更新版本">{{editForm.version}}</FormItem>
          <FormItem label="应用地址">{{editForm.url}}</FormItem>
          <FormItem label="更新内容">{{editForm.content}}</FormItem>
        </Form>
      </Col>
      <!-- 新增 -->
      <Col span="12" v-if="curMode === 'add'">
        <Form
          ref="addForm"
          :model="addForm"
          :rules="rulesValidate"
          :label-width="80"
          style="min-width: 500px;"
        >
          <FormItem prop="appName" label="应用名称">
            <Select v-model="addForm.appName">
              <Option value="center">云上会面pad版</Option>
              <Option value="centerhd">云上会面HD</Option>
              <Option value="call">远程会议</Option>
              <Option value="gis">应急一张图</Option>
              <Option value="live">网络直播</Option>
              <Option value="meeting">云上会面手机版</Option>
              <Option value="remote">云上会面Remote</Option>
              <Option value="tv">云视听</Option>
              <Option value="livepush">直播推流</Option>
            </Select>
          </FormItem>
          <FormItem prop="type" label="应用类型">
            <RadioGroup v-model="addForm.type">
              <Radio label="android"></Radio>
              <Radio label="ios"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem prop="status" label="更新状态">
            <Select v-model="addForm.status">
              <Option :value="0">无更新</Option>
              <Option :value="1">建议更新</Option>
              <Option :value="2">必须更新</Option>
            </Select>
          </FormItem>
          <FormItem prop="version" label="更新版本">
            <Input type="text" v-model="addForm.version" placeholder="请输入更新版本"></Input>
          </FormItem>
          <FormItem prop="url" label="应用地址">
            <Input
              v-if="file === null"
              :rows="7"
              type="textarea"
              v-model="addForm.url"
              placeholder="请输入应用地址"
            ></Input>
            <Input v-else :rows="7" type="textarea" v-model="file.name"></Input>
            <Upload
              :before-upload="handleUpload"
              :on-progress="handProgress"
              action
              v-show="addForm.type === 'android'"
              class="upload-icon"
            >
              <Icon type="ios-cloud-upload-outline" />
            </Upload>
          </FormItem>
          <FormItem prop="content" label="更新内容">
            <Input
              :rows="7"
              :maxlength="100"
              type="textarea"
              v-model="addForm.content"
              placeholder="请输入更新内容"
            ></Input>
            <span class="font-tips">已输入 {{addForm.content.length}}/100 个字符</span>
          </FormItem>
          <FormItem>
            <Button :disabled="disabledNew" :loading="loading" type="primary" @click="save">保存</Button>
          </FormItem>
        </Form>
      </Col>
      <!-- 编辑 -->
      <Col span="12" v-if="curMode === 'edit'">
        <Form
          ref="editForm"
          :model="editForm"
          :rules="rulesValidate2"
          :label-width="80"
          style="min-width: 500px;"
        >
          <FormItem label="应用名称">{{editForm.appName}}</FormItem>
          <FormItem label="应用类型">{{editForm.type}}</FormItem>
          <FormItem prop="status" label="更新状态">
            <Select v-model="editForm.status">
              <Option :value="0">无更新</Option>
              <Option :value="1">建议更新</Option>
              <Option :value="2">必须更新</Option>
            </Select>
          </FormItem>
          <FormItem prop="version" label="更新版本">
            <Input v-model="editForm.version" placeholder="请输入更新版本"></Input>
          </FormItem>
          <FormItem prop="url" label="应用地址">
            <Input
              v-if="file === null"
              :rows="7"
              type="textarea"
              v-model="editForm.url"
              placeholder="请输入应用地址"
            ></Input>
            <Input v-else :rows="7" type="textarea" v-model="file.name"></Input>
            <Upload
              :before-upload="handleUpload"
              :on-progress="handProgress"
              action
              v-show="editForm.type === 'android'"
              class="upload-icon"
            >
              <Icon type="ios-cloud-upload-outline" />
            </Upload>
          </FormItem>
          <FormItem label="更新内容">
            <Input :rows="7" :maxlength="100" type="textarea" v-model="editForm.content"></Input>
            <span class="font-tips">已输入 {{editForm.content ? editForm.content.length : 0}}/100 个字符</span>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="update">保存</Button>
          </FormItem>
        </Form>
      </Col>
    </Row>
    <div class="mask-loading" v-show="loading">
      <div class="loading-box">
        <progress
          style="padding-top: 20px; font-size: 16px; color: #fff;"
          :value="getProgress"
          max="100"
        ></progress>
        <!-- <Progress :percent="uploadProgress" :stroke-width="20" status="active" /> -->

        <span style="padding-top: 20px; font-size: 16px; color: #fff;">应用上传中，请稍后...</span>
      </div>
    </div>
  </div>
</template>

<script>
import { addApp, getAppInfo, putApp } from '@/api/data'
import { stat } from 'fs'
import { log } from 'util'

export default {
  props: ['id', 'mode'],
  data() {
    const validateVersion = (rule, value, callback) => {
      const reg = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){2}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/
      if (!value) {
        callback(new Error('请输入更新版本'))
      } else if (!reg.test(value)) {
        callback(new Error('请输入正确的版本格式，如 1.0.0'))
      } else {
        callback()
      }
    }
    return {
      appNameObj: {
        center: '云上会面pad版',
        centerhd: '云上会面HD',
        call: '远程会议',
        gis: '应急一张图',
        live: '网络直播',
        meeting: '云上会面手机版',
        remote: '云上会面Remote',
        tv: '云视听',
        livepush: '直播推流'
      },
      percent: 0,
      disabledNew: false,
      loading: false,
      file: null,
      curMode: this.mode,
      curStatus: '',
      editForm: {
        content: ''
      },
      addForm: {
        type: 'android',
        content: ''
      },
      rulesValidate: {
        appName: [
          { required: true, message: '请输入应用名称', trigger: 'change' }
        ],
        type: [{ required: true, message: '请输入应用类型', trigger: 'blur' }],
        content: [
          { required: true, message: '请输入更新内容', trigger: 'blur' }
        ],
        version: [
          { required: true, validator: validateVersion, trigger: 'blur' }
        ],
        // url: [{ required: true, message: '请输入应用地址', trigger: 'blur' }],
        status: [
          {
            type: 'number',
            required: true,
            message: '请选择更新状态',
            trigger: 'change'
          }
        ]
      },
      rulesValidate2: {
        content: [
          { required: true, message: '请输入更新内容', trigger: 'blur' }
        ],
        version: [
          { required: true, validator: validateVersion, trigger: 'blur' }
        ],
        status: [
          {
            type: 'number',
            required: true,
            message: '请选择更新状态',
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {
    // 提交后显示进度
    getProgress() {
      return this.$store.state.app.uploadProgress
    }
  },
  methods: {
    // 判断处理romote, 如何是remote 地址不能修改, （弃用）
    changeAppName(val) {
      if (val === 'remote') {
        this.addForm.url =
          'http://server.m.pp.cn/download/apk?appId=8061165&custom=0&ch_src=pp_dev&ch=default'
      } else {
        this.addForm.url = ''
      }
    },
    handProgress(event) {
      this.loading = true
      debugger
      this.percent = event.percent
    },
    // 上传文件前处理
    handleUpload(file) {
      this.file = file
      this.addForm.url = file.name
      return false
    },
    // 更新
    update() {
      let formData = new FormData()
      formData.append('file', this.file)
      formData.append('id', this.id)
      formData.append('content', this.editForm.content)
      formData.append('version', this.editForm.version)
      formData.append('url', this.editForm.url)
      formData.append('status', this.editForm.status)
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          this.loading = true
          putApp(formData).then(res => {
            if (res.data.code === 200) {
              this.loading = false
              this.$Message.success(res.data.msg)
              // 重置表单
              this.$refs['editForm'].resetFields()
              this.$router.push({
                name: 'app_page'
              })
            } else {
              this.loading = false
              this.$Message.error(res.data.msg)
            }
          })
        }
      })
    },
    // 保存
    save() {
      this.disabledNew = true
      setTimeout(() => {
        this.disabledNew = false
      }, 1000)
      let formData = new FormData()
      formData.append('file', this.file)
      formData.append('appName', this.addForm.appName)
      formData.append('type', this.addForm.type)
      formData.append('content', this.addForm.content)
      formData.append('version', this.addForm.version)
      formData.append('url', this.addForm.url)
      formData.append('status', this.addForm.status)
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          this.loading = true
          addApp(formData).then(res => {
            if (res.data.code === 200) {
              this.loading = false
              this.$Message.success(res.data.msg)
              // 重置表单
              this.$refs['addForm'].resetFields()
              this.$router.push({
                name: 'app_page'
              })
            } else {
              this.loading = false
              this.$Message.error(res.data.msg)
            }
          })
        }
      })
    },
    getInfo() {
      if (!this.id) {
        return
      }
      getAppInfo(this.id).then(res => {
        if (res.data.code === 200) {
          this.editForm = res.data.data
          let appName = res.data.data.appName
          let status = res.data.data.status
          if (this.appNameObj[appName]) {
            this.editForm.appName = this.appNameObj[appName]
          } else {
            this.editForm.appName = ''
          }

          switch (status) {
            case 0:
              this.curStatus = '无更新'
              break
            case 1:
              this.curStatus = '建议更新'
              break
            case 2:
              this.curStatus = '必须更新'
              break
            default:
              break
          }
        } else {
          console.log('获取详情失败')
        }
      })
    }
  },
  mounted() {
    this.getInfo()
    // 每次加载组件时重置上传进度
    this.$store.commit('setUploadProgress', 0)
    this.percent = this.$store.state.app.uploadProgress
  }
}
</script>

<style scoped>
.upload-icon {
  position: absolute;
  top: 0px;
  right: -60px;
  width: 60px;
  text-align: center;
  font-size: 28px;
  color: #c5c5c5;
}
.upload-icon:hover {
  cursor: pointer;
  color: #2d8cf0;
}
.editBtn {
  padding-left: 24px;
}
.mask-loading {
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999;
}
.loading-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
/* .loading-btn {
  font-size: 50px;
  color: #fff;
}
.loading-btn {
  -webkit-animation: myRotate 1s linear infinite;
  animation: myRotate 1s linear infinite;
} */
@-webkit-keyframes myRotate {
  0% {
    -webkit-transform: rotate(0deg);
  }
  50% {
    -webkit-transform: rotate(180deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}
@keyframes myRotate {
  0% {
    -webkit-transform: rotate(0deg);
  }
  50% {
    -webkit-transform: rotate(180deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}
</style>
