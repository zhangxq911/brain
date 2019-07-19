<template>
  <div class="card-box">
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
      <Col span="12" v-if="curMode === 'add'">
        <Form
          ref="addForm"
          :model="addForm"
          :rules="rulesValidate"
          :label-width="80"
          style="min-width: 500px;"
        >
          <FormItem prop="title" label="标题">
            <Input type="text" v-model="addForm.title" placeholder="请输入标题"></Input>
          </FormItem>
          <FormItem label="内容">
            <div id="menuEditor" style="width: 600px;"></div>
          </FormItem>
          <FormItem label="置顶">
            <RadioGroup v-model="addForm.isTop">
              <Radio :label="0">否</Radio>
              <Radio :label="1">是</Radio>
            </RadioGroup>
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
          :label-width="80"
          style="min-width: 500px;"
        >
          <FormItem prop="title" label="标题">
            <Input type="text" v-model="editForm.title" placeholder="请输入标题"></Input>
          </FormItem>
          <FormItem prop="content" label="内容">
            <div id="menuEditor2" style="width: 600px;"></div>

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
  </div>
</template>

<script>
import { saveMsg, getMsgInfo, putMsg } from '@/api/data'
import Editor from 'wangeditor'

export default {
  props: ['id', 'mode'],
  components: {
    Editor
  },
  data() {
    return {
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
      if(this.editor.txt.text().length === 0) {
        this.$Message.error('请填写内容！')
        return
      }
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
          this.editor2.txt.html(this.editForm.content)
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    }
  },
  mounted() {
    this.getInfo()
    // 初始化 wangeditor
    this.editor = new Editor('#menuEditor')
    this.editor.customConfig.menus = [
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
      'list', // 列表
      'justify', // 对齐方式
      'quote', // 引用
      'table', // 表格
      'code', // 插入代码
      'undo', // 撤销
      'redo' // 重复
    ]
    this.editor.customConfig.onchange = html => {
      this.addForm.content = html
    }
    this.editor.create()
    this.editor2 = new Editor('#menuEditor2')
    this.editor2.customConfig.menus = [
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
      'list', // 列表
      'justify', // 对齐方式
      'quote', // 引用
      'table', // 表格
      'code', // 插入代码
      'undo', // 撤销
      'redo' // 重复
    ]
    this.editor2.customConfig.onchange = html => {
      this.editForm.content = html
    }
    this.editor2.create()
  }
}
</script>
