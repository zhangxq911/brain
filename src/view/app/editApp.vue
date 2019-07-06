<template>
  <div class="card-box">
    <h3 class="detailTitle">基本信息</h3>
    <Row>
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
              <Option value="center">联络中心</Option>
              <Option value="call">远程会议</Option>
              <Option value="gis">联情指挥</Option>
              <Option value="live">网络直播</Option>
              <Option value="meeting">云会议</Option>
              <Option value="remote">云Remote</Option>
              <Option value="tv">云视听</Option>
            </Select>
            <!-- <Input type="text" v-model="addForm.appName" placeholder="请输入应用名称"></Input> -->
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
            <Input :rows="7" type="textarea" v-model="addForm.url" placeholder="请输入应用地址"></Input>
            <Upload
              :before-upload="handleUpload"
              action=''
              v-show="addForm.type === 'android'"
              class="upload-icon"
            >
              <Icon type="ios-cloud-upload-outline" />
            </Upload>
          </FormItem>
          <FormItem prop="content" label="更新内容">
            <Input :rows="7" type="textarea" v-model="addForm.content" placeholder="请输入更新内容"></Input>
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
          :rules="rulesValidate2"
          :label-width="80"
          style="min-width: 500px;"
        >
          <FormItem prop="appName" label="应用名称">
            <Input type="text" v-model="editForm.appName" placeholder="请输入应用名称"></Input>
          </FormItem>
          <FormItem prop="type" label="应用类型">
            <RadioGroup v-model="editForm.type">
              <Radio label="android"></Radio>
              <Radio label="ios"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem prop="version" label="更新版本">
            <Input v-model="editForm.version" placeholder="请输入更新版本"></Input>
          </FormItem>
          <FormItem label="应用描述">
            <Input type="textarea" v-model="editForm.description" placeholder="请输入应用描述"></Input>
          </FormItem>
          <FormItem prop="url" label="下载链接">
            <Input type="text" v-model="editForm.url" placeholder="请输入下载链接"></Input>
          </FormItem>
          <FormItem prop="status" label="更新状态">
            <Select v-model="editForm.status">
              <Option :value="0">无更新</Option>
              <Option :value="1">建议更新</Option>
              <Option :value="2">必须更新</Option>
            </Select>
          </FormItem>
          <FormItem label="更新内容">
            <Input type="textarea" v-model="editForm.content"></Input>
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
import { addApp } from '@/api/data'

export default {
  props: ['id', 'mode'],
  data() {
    return {
      file: null,
      curMode: this.mode,
      editForm: {},
      addForm: {
        type: 'android'
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
          { required: true, message: '请输入更新版本', trigger: 'blur' }
        ],
        url: [{ required: true, message: '请输入应用地址', trigger: 'blur' }],
        status: [
          {
            type: 'number',
            required: true,
            message: '请选择更新状态',
            trigger: 'change'
          }
        ]
      },
      rulesValidate2: {}
    }
  },
  created() {},
  methods: {
    // 上传文件前处理
    handleUpload(file) {
      this.file = file
      return false
    },
    // 更新
    update() {},
    // 保存
    save() {
      console.log(this.file)
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          addApp(this.addForm).then(res => {
            if (res.data.code === 200) {
              this.$Message.success(res.data.msg)
              // 重置表单
              this.$refs['addForm'].resetFields()
              this.$router.push({
                name: 'app_page'
              })
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        }
      })
    }
  },
  mounted() {}
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
</style>
