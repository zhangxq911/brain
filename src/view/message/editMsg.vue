<template>
  <div class="card-box">
    <h3 v-if="curMode === 'add'" class="detailTitle">基本信息</h3>
    <Row>
      <!-- 详情 -->
      <Col span="24" v-if="curMode === 'view'">
        <div style="text-align: center; line-height: 30px;">
          <h3>{{editForm.title}}</h3>
          <div style="color: #999999;">{{editForm.updateTime}}</div>
          <pre style="text-align: justify; white-space: pre-wrap; padding: 0 200px;">
            {{editForm.content}}
          <Button
  type="primary"
  style="float: right; margin-top: 20px;"
  @click="curMode = 'edit'"
>编辑</Button>  
          </pre>
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
          <FormItem prop="content" label="内容">
            <Input :rows="20" type="textarea" v-model="addForm.content" placeholder="请输入内容"></Input>
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
            <Input :rows="20" type="textarea" v-model="editForm.content" placeholder="请输入内容"></Input>
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

export default {
  props: ['id', 'mode'],
  data() {
    return {
      curMode: this.mode,
      addForm: {},
      editForm: {},
      rulesValidate: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
      }
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
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    }
  },
  mounted() {
    this.getInfo()
  }
}
</script>
