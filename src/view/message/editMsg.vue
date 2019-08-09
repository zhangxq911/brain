<template>
  <div ref="box" class="card-box">
    <h3 v-if="curMode === 'add'" class="detailTitle">基本信息</h3>
    <Row>
      <!-- 详情 -->
      <Col span="24" v-if="curMode === 'view'">
        <div style="text-align: center; line-height: 30px;">
          <h3>{{editForm.title}}</h3>
          <div style="color: #999999;">{{editForm.updateTime}}</div>
          <pre
            v-html="editForm.content"
            style="text-align: justify; white-space: pre-wrap; padding: 0 200px;"
          ></pre>
        </div>
      </Col>
      <!-- 新增 -->
      <Col span="24" v-if="curMode === 'add'">
        <Form
          ref="addForm"
          :model="addForm"
          :rules="rulesValidate"
          :label-width="80"
          style="min-width: 500px;"
        >
          <FormItem style="width: 50%;" prop="title" label="标题">
            <Input type="text" v-model="addForm.title" placeholder="请输入标题"></Input>
          </FormItem>
          <FormItem label="内容">
            <div class="editor-height" ref="menuEditor"></div>
          </FormItem>
          <FormItem label="置顶">
            <RadioGroup v-model="addForm.isTop">
              <Radio :label="0">否</Radio>
              <Radio :label="1">是</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem>
            <Button :disabled="disabledNew" type="primary" @click="save">保存</Button>
          </FormItem>
        </Form>
      </Col>
      <!-- 编辑 -->
      <Col span="24" v-if="curMode === 'edit'">
        <Form
          ref="editForm"
          :model="editForm"
          :rules="rulesValidate"
          :label-width="80"
          style="min-width: 500px;"
        >
          <FormItem style="width: 50%" prop="title" label="标题">
            <Input type="text" v-model="editForm.title" placeholder="请输入标题"></Input>
          </FormItem>
          <FormItem prop="content" label="内容">
            <div class="editor-height" ref="menuEditor2"></div>
            <!-- <Input :rows="20" type="textarea" v-model="editForm.content" placeholder="请输入内容"></Input> -->
          </FormItem>
          <FormItem label="置顶">
            <RadioGroup v-model="editForm.isTop">
              <Radio :label="0">否</Radio>
              <Radio :label="1">是</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="update">保存</Button>
          </FormItem>
        </Form>
      </Col>
    </Row>
    <div class="mask-loading" v-show="loading">
      <div class="loading-box">
        <Icon class="loading-btn" type="ios-loading"></Icon>
        <span style="padding-top: 20px; font-size: 16px; color: #fff;">图片上传中，请稍后...</span>
      </div>
    </div>
  </div>
</template>

<script>
import { saveMsg, getMsgInfo, putMsg } from '@/api/data'
import Editor from 'wangeditor'
import { setTimeout } from 'timers'

export default {
  props: ['id', 'mode'],
  components: {
    Editor
  },
  data() {
    return {
      disabledNew: false,
      editor: null,
      editor2: null,
      loading: false,
      defAccount: '',
      curMode: this.mode,
      addForm: {
        isTop: 0
      },
      editForm: {},
      rulesValidate: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }]
      }
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
    // 更新
    update() {
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          putMsg(this.editForm).then(res => {
            if (res.data.code === 200) {
              this.$Message.success(res.data.msg)
              // 重置表单
              this.$router.push({
                name: 'msg_page'
              })
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        }
      })
    },
    save() {
      // 判断content 是否为空
      if (
        this.editor.txt.text().length === 0 &&
        this.editor.txt.html().indexOf('img') < 0
      ) {
        this.$Message.error('请填写内容！')
        return
      }
      this.disabledNew = true
      setTimeout(() => {
        this.disabledNew = false
      }, 1000)
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          saveMsg(this.addForm).then(res => {
            if (res.data.code === 200) {
              this.$Message.success(res.data.msg)
              // 重置表单
              this.$refs['addForm'].resetFields()
              this.$router.push({
                name: 'msg_page'
              })
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        }
      })
    },
    getInfo() {
      if (this.id === '') {
        return
      }
      getMsgInfo(this.id).then(res => {
        if (res.data.code === 200) {
          this.editForm = res.data.data
          if (this.editor2) {
            this.editor2.txt.html(this.editForm.content)
          }
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    }
  },
  mounted() {
    let basicConfig = {
      menus: [
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        'italic', // 斜体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'link', // 插入链接
        'image', // 插入图片
        'list', // 列表
        'justify', // 对齐方式
        'quote', // 引用
        'table', // 表格
        'code', // 插入代码
        'undo', // 撤销
        'redo' // 重复
      ],
      uploadImgMaxLength: 1,
      uploadImgServer: '/access/common/uploadImage', // 上传图片到服务器
      // uploadImgServer: 'http://192.168.1.14:8888/access/common/uploadImage', // 上传图片到服务器
      showLinkImg: false,
      uploadImgHeaders: {
        token: this.$store.state.user.token
      },
      uploadImgTimeout: 180000,
      uploadFileName: 'file',
      // 自定义上传文件，返回的数据格式不是默认的时候处理
      uploadImgHooks: {
        before: (xhr, editor, files) => {
          this.loading = true
        },
        customInsert: (insertImg, result, editor) => {
          if (result.code === 200) {
            // 插入图片
            insertImg(result.data)
          } else {
            this.$Message.error(result.msg)
          }
          this.loading = false
        }
      },
      // 自定义提示
      customAlert: info => {
        // info 是需要提示的内容
        this.$Message.error(info)
      }
    }
    // 初始化 wangeditor
    if (this.curMode === 'add') {
      this.editor = new Editor(this.$refs.menuEditor)
      this.editor.customConfig = basicConfig
      this.editor.customConfig.onchange = html => {
        this.addForm.content = html
      }
      this.$refs.menuEditor.style.height =
        this.$refs.box.clientHeight - 280 + 'px'
      this.$refs.menuEditor.style['max-height'] =
        this.$refs.box.clientHeight - 200 + 'px'
      this.editor.create()
    } else if (this.curMode === 'edit') {
      this.getInfo()
      this.editor2 = new Editor(this.$refs.menuEditor2)
      this.editor2.customConfig = basicConfig
      this.editor2.customConfig.onchange = html => {
        this.editForm.content = html
      }
      this.$refs.menuEditor2.style.height =
        this.$refs.box.clientHeight - 240 + 'px'
      this.$refs.menuEditor2.style['max-height'] =
        this.$refs.box.clientHeight - 200 + 'px'
      this.editor2.create()
    } else {
      // 详情
      this.getInfo()
    }
  }
}
</script>

<style scoped>
.mask-loading {
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  z-index: 99999;
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
.loading-btn {
  font-size: 50px;
  color: #fff;
}
.loading-btn {
  -webkit-animation: myRotate 1s linear infinite;
  animation: myRotate 1s linear infinite;
}
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
.editor-height {
  min-height: 300px;
  display: flex;
  width: 100%;
  flex-direction: column;
}
</style>
