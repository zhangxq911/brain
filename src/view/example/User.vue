<template>
  <main>
    <aside class="firstMenu">
      <div class="menu">
        <div
          @click="handleMenu(index)"
          v-for="(item, index) in menu"
          :key="index"
          class="item"
          :style="menuIndex == index ? 'color: #a4d8ff': 'color: #333'"
        >{{ item }}</div>
      </div>
    </aside>
    <aside v-show="menuIndex == 0" class="secMenu">
      <div class="user">
        <div v-if="auth">
          <Button size="small" style="margin-right:2px" @click="handleAddOrg" type="primary">添加</Button>
          <Button size="small" style="margin-right:2px" @click="handleEditOrg" type="primary">修改</Button>
          <Button size="small" @click="handleDelOrg" type="primary">删除</Button>
        </div>
        <Input
          @on-change="handleSearchOrg"
          size="small"
          style="width:150px;margin:10px;transform:translateX(-28px);"
          v-model="searchOrgName"
        ></Input>
        <Tree @on-select-change="handleTree" :data="userTree"></Tree>
      </div>
    </aside>
    <div v-show="menuIndex == 0" class="content">
      <!-- 添加用户 -->
      <Modal v-model="addUserModal" title="操作" width="650">
        <Form
          ref="addUserByIdformValidate"
          :rules="ruleValidate"
          :model="addUserForm"
          :label-width="150"
          label-position="left"
        >
          <FormItem label="用户号码" prop="tel">
            <Input v-model="addUserForm.tel"></Input>
          </FormItem>
          <FormItem label="用户名称" prop="name">
            <Input v-model="addUserForm.name"></Input>
          </FormItem>
          <FormItem label="用户密码" prop="regPwd">
            <Input type="password" v-model="addUserForm.regPwd"></Input>
          </FormItem>
          <FormItem label="用户级别">
            <Select v-model="addUserForm.level">
              <Option :value="0">0</Option>
              <Option :value="1">1</Option>
              <Option :value="2">2</Option>
              <Option :value="3">3</Option>
              <Option :value="4">4</Option>
            </Select>
          </FormItem>
          <FormItem label="半双工权限">
            <Select v-model="addUserForm.singleAuth">
              <Option :value="0">无权限</Option>
              <Option :value="1">有权限</Option>
            </Select>
          </FormItem>
          <FormItem label="半双工录音">
            <Select v-model="addUserForm.singleRecord">
              <Option :value="0">不录音</Option>
              <Option :value="1">录音</Option>
            </Select>
          </FormItem>
          <FormItem label="全双工权限">
            <Select v-model="addUserForm.duplexAuth">
              <Option :value="0">无权限</Option>
              <Option :value="1">有权限</Option>
            </Select>
          </FormItem>
          <FormItem label="全双工录音">
            <Select v-model="addUserForm.duplexRecord">
              <Option :value="0">不录音</Option>
              <Option :value="1">录音</Option>
            </Select>
          </FormItem>
          <FormItem label="定位权限">
            <Select v-model="addUserForm.orientation">
              <Option :value="0">没有</Option>
              <Option :value="1">有</Option>
            </Select>
          </FormItem>
          <FormItem label="连接模式">
            <Select v-model="addUserForm.jbMode">
              <Option :value="0">WIFI</Option>
              <Option :value="1">3G</Option>
            </Select>
          </FormItem>
          <FormItem label="语音质量">
            <Select v-model="addUserForm.voiceQuality">
              <Option :value="0">高</Option>
              <Option :value="1">中</Option>
              <Option :value="2">低</Option>
            </Select>
          </FormItem>
          <FormItem label="视频">
            <Select v-model="addUserForm.videoFlg">
              <Option :value="1">有</Option>
              <Option :value="0">没有</Option>
            </Select>
          </FormItem>
          <FormItem label="图片">
            <Select v-model="addUserForm.pictureFlg">
              <Option :value="1">有</Option>
              <Option :value="0">没有</Option>
            </Select>
          </FormItem>
          <FormItem label="短信">
            <Select v-model="addUserForm.messageFlg">
              <Option :value="1">有</Option>
              <Option :value="0">没有</Option>
            </Select>
          </FormItem>
          <FormItem label="监控">
            <Select v-model="addUserForm.monitorFlg">
              <Option :value="1">有</Option>
              <Option :value="0">没有</Option>
            </Select>
          </FormItem>
          <FormItem label="用户类型">
            <Select v-model="addUserForm.trunkFlag">
              <Option :value="0">poc用户</Option>
              <Option :value="1">esip用户</Option>
              <Option :value="2">本地调度用户</Option>
              <Option :value="3">中继用户</Option>
            </Select>
          </FormItem>
          <FormItem label="组呼免打扰权限">
            <Select v-model="addUserForm.powerDdbGroupcall">
              <Option :value="0">没有</Option>
              <Option :value="1">有</Option>
            </Select>
          </FormItem>
          <FormItem label="用户职位">
            <Input v-model="addUserForm.position"></Input>
          </FormItem>
          <FormItem label="电话号码">
            <Input v-model="addUserForm.phone"></Input>
          </FormItem>
          <FormItem>
            <Button @click="submitUserAdd" type="primary" style="margin:10px;">提交</Button>
          </FormItem>
        </Form>
        <div slot="footer"></div>
      </Modal>
      <!-- 编辑用户 -->
      <Modal v-model="editOrgUserModal" title="操作" width="650">
        <Form
          ref="editUserByIdformValidate"
          :rules="ruleEditValidate"
          :model="editOrgUserForm"
          :label-width="150"
          label-position="left"
        >
          <FormItem label="ID">
            <Input disabled v-model="editOrgUserForm.uid"></Input>
          </FormItem>
          <FormItem label="用户号码" prop="tel">
            <Input disabled v-model="editOrgUserForm.tel"></Input>
          </FormItem>
          <FormItem label="用户名称" prop="name">
            <Input v-model="editOrgUserForm.name"></Input>
          </FormItem>
          <FormItem label="用户密码" prop="regPwd">
            <Input type="password" v-model="editOrgUserForm.regPwd"></Input>
          </FormItem>
          <FormItem label="用户级别">
            <Select v-model="editOrgUserForm.level">
              <Option :value="0">0</Option>
              <Option :value="1">1</Option>
              <Option :value="2">2</Option>
              <Option :value="3">3</Option>
              <Option :value="4">4</Option>
            </Select>
          </FormItem>
          <FormItem label="半双工权限">
            <Select v-model="editOrgUserForm.singleAuth">
              <Option :value="0">无权限</Option>
              <Option :value="1">有权限</Option>
            </Select>
          </FormItem>
          <FormItem label="半双工录音">
            <Select v-model="editOrgUserForm.singleRecord">
              <Option :value="0">不录音</Option>
              <Option :value="1">录音</Option>
            </Select>
          </FormItem>
          <FormItem label="全双工权限">
            <Select v-model="editOrgUserForm.duplexAuth">
              <Option :value="0">无权限</Option>
              <Option :value="1">有权限</Option>
            </Select>
          </FormItem>
          <FormItem label="全双工录音">
            <Select v-model="editOrgUserForm.duplexRecord">
              <Option :value="0">不录音</Option>
              <Option :value="1">录音</Option>
            </Select>
          </FormItem>
          <FormItem label="定位权限">
            <Select v-model="editOrgUserForm.orientation">
              <Option :value="0">没有</Option>
              <Option :value="1">有</Option>
            </Select>
          </FormItem>
          <FormItem label="连接模式">
            <Select v-model="editOrgUserForm.jbMode">
              <Option :value="0">WIFI</Option>
              <Option :value="1">3G</Option>
            </Select>
          </FormItem>
          <FormItem label="语音质量">
            <Select v-model="editOrgUserForm.voiceQuality">
              <Option :value="0">高</Option>
              <Option :value="1">中</Option>
              <Option :value="2">低</Option>
            </Select>
          </FormItem>
          <FormItem label="视频">
            <Select v-model="editOrgUserForm.videoFlg">
              <Option :value="1">有</Option>
              <Option :value="0">没有</Option>
            </Select>
          </FormItem>
          <FormItem label="图片">
            <Select v-model="editOrgUserForm.pictureFlg">
              <Option :value="1">有</Option>
              <Option :value="0">没有</Option>
            </Select>
          </FormItem>
          <FormItem label="短信">
            <Select v-model="editOrgUserForm.messageFlg">
              <Option :value="1">有</Option>
              <Option :value="0">没有</Option>
            </Select>
          </FormItem>
          <FormItem label="监控">
            <Select v-model="editOrgUserForm.monitorFlg">
              <Option :value="1">有</Option>
              <Option :value="0">没有</Option>
            </Select>
          </FormItem>
          <FormItem label="用户类型">
            <Select v-model="editOrgUserForm.trunkFlag">
              <Option :value="0">poc用户</Option>
              <Option :value="1">esip用户</Option>
              <Option :value="2">本地调度用户</Option>
              <Option :value="3">中继用户</Option>
            </Select>
          </FormItem>
          <FormItem label="组呼免打扰权限">
            <Select v-model="editOrgUserForm.powerDdbGroupcall">
              <Option :value="0">没有</Option>
              <Option :value="1">有</Option>
            </Select>
          </FormItem>
          <FormItem label="用户职位">
            <Input v-model="editOrgUserForm.position"></Input>
          </FormItem>
          <FormItem label="电话号码">
            <Input v-model="editOrgUserForm.phone"></Input>
          </FormItem>
          <FormItem>
            <Button @click="submitUserEdit" type="primary" style="margin:10px;">提交</Button>
          </FormItem>
        </Form>
        <div slot="footer"></div>
      </Modal>
      <!-- 添加部门 -->
      <Modal v-model="addOrgModal" title="添加" width="650">
        <Form :model="addOrgForm" :label-width="150" label-position="left">
          <FormItem label="部门名称">
            <Input v-model="addOrgForm.name"></Input>
          </FormItem>
          <FormItem v-if="addOrgForm.node == 'this'" label="上级部门">
            <Input disabled v-model="addOrgForm.orgName"></Input>
          </FormItem>
          <!-- <Tree @on-select-change="handleAddOrgTree" :data="userAddOrgTree"></Tree> -->
          <FormItem label="根节点">
            <RadioGroup v-model="addOrgForm.node">
              <Radio label="this">否</Radio>
              <Radio label="root">是</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem>
            <Button @click="submitAddOrg" type="primary" style="margin:10px;">提交</Button>
          </FormItem>
        </Form>
        <div slot="footer"></div>
      </Modal>
      <!-- 编辑部门 -->
      <Modal v-model="editOrgModal" title="编辑" width="650" @on-cancel="handleCancel">
        <Form :model="editOrgForm" :label-width="150" label-position="left">
          <FormItem label="部门名称">
            <Input v-model="editOrgForm.name"></Input>
          </FormItem>
          <FormItem label="上级部门">
            <RadioGroup v-model="editOrgForm.node" @on-change="handleRadioChange">
              <Radio label="this">有</Radio>
              <Radio label="root">无</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem v-if="editOrgForm.node == 'this'" label="上级部门名称" @click.native="handleWarn">
            <Input readonly v-model="editOrgForm.parentName"></Input>
          </FormItem>
          <!-- <div style="color:red" v-if="warn && editOrgForm.node == 'this'">请选择上级部门</div>
          <Tree
            v-if="editOrgForm.node == 'this'"
            @on-select-change="handleEditOrgTree"
            :data="userEditOrgTree"
            :class="warn && editOrgForm.node == 'this' ? 'warn' : ''"
          ></Tree>-->
          <FormItem>
            <Button @click="submitEditOrg" type="primary" style="margin:10px;">提交</Button>
          </FormItem>
        </Form>
        <div slot="footer"></div>
      </Modal>
      <!-- 树弹框 -->
      <Modal
        v-model="editOrgTreeModal"
        title="编辑"
        width="450"
        :mask="false"
        class-name="modalStyle"
      >
        <Tree
          v-if="editOrgForm.node == 'this'"
          @on-select-change="handleEditOrgTree"
          :data="userEditOrgTree"
        ></Tree>
        <div slot="footer"></div>
      </Modal>
      <Modal v-model="addOrgUserModal" title="添加" width="650">
        <!-- 权限树 -->
        <Tree ref="treeData" show-checkbox multiple :data="showTree"></Tree>
        <Button @click="handleOrgUserTree" type="primary" style="margin:10px;">修改</Button>
        <div slot="footer"></div>
      </Modal>
      <Modal v-model="UserDetailModal" title="详情" width="1600">
        <!-- 用户详情 -->
        <Table stripe border :columns="userDetailColumns" :data="userDetailData"></Table>
        <div slot="footer"></div>
      </Modal>
      <!-- <Breadcrumb style="margin:20px 10px 10px 45px;">
        <BreadcrumbItem v-for="(item, index) in breadCrumbData" :key="index">{{ item.name }}</BreadcrumbItem>
      </Breadcrumb>-->
      <Form
        :model="searchGroup"
        label-position="right"
        inline
        style="padding:20px 20px 0px 20px;"
        @submit.native.prevent
        :label-width="60"
      >
        <FormItem label="号码">
          <Input @on-enter="submitSearchGroup" v-model="searchGroup.tel"></Input>
        </FormItem>
        <FormItem label="名称">
          <Input @on-enter="submitSearchGroup" v-model="searchGroup.name"></Input>
        </FormItem>
        <FormItem label="状态">
          <Select v-model="searchGroup.status">
            <Option value>请选择</Option>
            <Option value="login">登录</Option>
            <Option value="logout">未登录</Option>
          </Select>
        </FormItem>
        <FormItem label="类型">
          <Select v-model="searchGroup.trunkFlag">
            <Option value>请选择</Option>
            <Option :value="0">poc用户</Option>
            <Option :value="1">esip用户</Option>
            <Option :value="2">本地调度用户</Option>
            <Option :value="3">中继用户</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Checkbox v-model="searchGroup.isGlobal">全局搜索</Checkbox>
        </FormItem>
        <FormItem :label-width="20">
          <Button @click="submitSearchGroup({})" type="primary">查询</Button>
        </FormItem>
      </Form>
      <Table
        ref="tree"
        stripe
        border
        @on-selection-change="handleDelUsers"
        :columns="groupUserColumns"
        :data="groupUserData"
      ></Table>
      <div class="flex">
        <div v-if="auth">
          <Button @click="handleAddUserModal" type="primary" style="margin:10px;">添加用户</Button>
          <Button @click="handleAddUsers" type="primary" style="margin:10px;">批量添加用户</Button>
          <Button @click="DelOrgUsers" style="margin:10px;" type="primary">批量删除用户</Button>
          <Button @click="handleAddUserGroup" style="margin:10px;" type="primary">用户批量加入群组</Button>
        </div>
        <Page
          :current="OrgUserPage"
          :total="total"
          :page-size="orgPageSize"
          @on-change="handlePage"
        />
      </div>
      <Modal v-model="addUsersModal" title="操作" width="650">
        <Form
          ref="formAddUsers"
          :rules="ruleAddUsers"
          :model="addUsersForm"
          :label-width="150"
          label-position="left"
        >
          <FormItem label="数量" prop="phoneCount">
            <Input v-model="addUsersForm.phoneCount"></Input>
          </FormItem>
          <FormItem label="步长" prop="phoneLen">
            <Input v-model="addUsersForm.phoneLen"></Input>
          </FormItem>
          <FormItem label="用户号码" prop="tel">
            <Input v-model="addUsersForm.tel"></Input>
          </FormItem>
          <FormItem label="用户名称" prop="name">
            <Input v-model="addUsersForm.name"></Input>
          </FormItem>
          <FormItem label="用户密码" prop="regPwd">
            <Input type="password" v-model="addUsersForm.regPwd"></Input>
          </FormItem>
          <FormItem label="用户级别">
            <Select v-model="addUsersForm.level">
              <Option :value="0">0</Option>
              <Option :value="1">1</Option>
              <Option :value="2">2</Option>
              <Option :value="3">3</Option>
              <Option :value="4">4</Option>
            </Select>
          </FormItem>
          <FormItem label="半双工权限">
            <Select v-model="addUsersForm.singleAuth">
              <Option :value="0">无权限</Option>
              <Option :value="1">有权限</Option>
            </Select>
          </FormItem>
          <FormItem label="半双工录音">
            <Select v-model="addUsersForm.singleRecord">
              <Option :value="0">不录音</Option>
              <Option :value="1">录音</Option>
            </Select>
          </FormItem>
          <FormItem label="全双工权限">
            <Select v-model="addUsersForm.duplexAuth">
              <Option :value="0">无权限</Option>
              <Option :value="1">有权限</Option>
            </Select>
          </FormItem>
          <FormItem label="全双工录音">
            <Select v-model="addUsersForm.duplexRecord">
              <Option :value="0">不录音</Option>
              <Option :value="1">录音</Option>
            </Select>
          </FormItem>
          <FormItem label="定位权限">
            <Select v-model="addUsersForm.orientation">
              <Option :value="0">没有</Option>
              <Option :value="1">有</Option>
            </Select>
          </FormItem>
          <FormItem label="连接模式">
            <Select v-model="addUsersForm.jbMode">
              <Option :value="0">WIFI</Option>
              <Option :value="1">3G</Option>
            </Select>
          </FormItem>
          <FormItem label="语音质量">
            <Select v-model="addUsersForm.voiceQuality">
              <Option :value="0">高</Option>
              <Option :value="1">中</Option>
              <Option :value="2">低</Option>
            </Select>
          </FormItem>
          <FormItem label="视频">
            <Select v-model="addUsersForm.videoFlg">
              <Option :value="1">有</Option>
              <Option :value="0">没有</Option>
            </Select>
          </FormItem>
          <FormItem label="图片">
            <Select v-model="addUsersForm.pictureFlg">
              <Option :value="1">有</Option>
              <Option :value="0">没有</Option>
            </Select>
          </FormItem>
          <FormItem label="短信">
            <Select v-model="addUsersForm.messageFlg">
              <Option :value="1">有</Option>
              <Option :value="0">没有</Option>
            </Select>
          </FormItem>
          <FormItem label="监控">
            <Select v-model="addUsersForm.monitorFlg">
              <Option :value="1">有</Option>
              <Option :value="0">没有</Option>
            </Select>
          </FormItem>
          <FormItem label="用户类型">
            <Select v-model="addUsersForm.trunkFlag">
              <Option :value="0">poc用户</Option>
              <Option :value="1">esip用户</Option>
              <Option :value="2">本地调度用户</Option>
              <Option :value="3">中继用户</Option>
            </Select>
          </FormItem>
          <FormItem label="组呼免打扰权限">
            <Select v-model="addUsersForm.powerDdbGroupcall">
              <Option :value="0">没有</Option>
              <Option :value="1">有</Option>
            </Select>
          </FormItem>
          <FormItem label="用户职位">
            <Input v-model="addUsersForm.position"></Input>
          </FormItem>
          <FormItem label="电话号码">
            <Input v-model="addUsersForm.phone"></Input>
          </FormItem>
          <FormItem>
            <Button @click="submitUsersAdd" type="primary" style="margin:10px;">提交</Button>
          </FormItem>
        </Form>
        <div slot="footer"></div>
      </Modal>
      <Modal v-model="handleAddUserGroupModal" title="添加" width="650">
        <Form :model="handleAddUserGroupForm" :label-width="150" label-position="left">
          <FormItem label="用户ID">
            <Input disabled v-model="handleAddUserGroupForm.idList"></Input>
          </FormItem>
          <FormItem label="添加类型">
            <RadioGroup v-model="handleAddUserGroupForm.type" @on-change="handleChange">
              <Radio label="uid">根据ID添加</Radio>
              <Radio label="tel">根据号码添加</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="群组ID/号码">
            <Input v-model="handleAddUserGroupForm.gid"></Input>
          </FormItem>
          <FormItem label="群组类型">
            <Select v-model="handleAddUserGroupForm.auth">
              <Option value="1">参与者</Option>
              <Option value="2">能发起组呼</Option>
              <Option value="3">能发起广播</Option>
              <Option value="4">能发起组呼和广播</Option>
              <Option value="5">只查看</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button @click="handleAddUserGroupSubmit" type="primary" style="margin:10px;">提交</Button>
          </FormItem>
        </Form>
        <div slot="footer"></div>
      </Modal>
    </div>
    <aside v-show="menuIndex == 1" class="secMenu">
      <div class="user">
        <Input
          size="small"
          style="margin:10px 0 10px 0;padding-right:10px;"
          @on-change="handleSearchGroup"
          v-model="searchGroupName"
        ></Input>
        <div
          class="item"
          style="cursor: pointer;"
          v-for="item in group"
          @click="handleGroup(item.gid)"
        >
          <img :src="item.broadcastTel ? broadcastTelImg : vgcsTel" style="width:20px">
          <span>{{ item.name + ' ' + '(' + (item.broadcastTel || item.vgcsTel) + ')' }}</span>
        </div>
      </div>
    </aside>
    <div v-show="menuIndex == 1" class="content">
      <div v-if="auth">
        <Button @click="modal = true" type="primary" style="margin:10px;">添加对讲组</Button>
        <Button @click="modals = true" type="primary" style="margin:10px;">批量添加对讲组</Button>
      </div>
      <Modal v-model="modals" title="添加" width="650">
        <Form
          ref="addGroupsValidate"
          :rules="ruleAddGroups"
          :model="formItems"
          :label-width="150"
          label-position="left"
        >
          <FormItem label="数量" prop="groupCount">
            <Input v-model="formItems.groupCount"></Input>
          </FormItem>
          <FormItem label="步长" prop="groupLen">
            <Input v-model="formItems.groupLen"></Input>
          </FormItem>
          <FormItem label="群组名称" prop="name">
            <Input v-model="formItems.name"></Input>
          </FormItem>
          <FormItem label="注册密码" prop="regPwd">
            <Input type="password" v-model="formItems.regPwd"></Input>
          </FormItem>
          <FormItem label="群组类型">
            <Select v-model="formItems.type">
              <Option value="vgcsTel">组呼群组</Option>
              <Option value="broadcastTel">广播群组</Option>
            </Select>
          </FormItem>
          <FormItem label="组呼号码" prop="num">
            <Input v-model="formItems.num"></Input>
          </FormItem>
          <FormItem label="组呼级别">
            <Select v-model="formItems.level">
              <Option value="0">0</Option>
              <Option value="1">1</Option>
              <Option value="2">2</Option>
              <Option value="3">3</Option>
              <Option value="4">4</Option>
            </Select>
          </FormItem>
          <FormItem label="是否录音">
            <Select v-model="formItems.record">
              <Option value="0">不录音</Option>
              <Option value="1">录音</Option>
            </Select>
          </FormItem>
          <FormItem label="创建模式">
            <Select v-model="formItems.crtMode">
              <Option value="0">不等待所有用户应答</Option>
              <Option value="1">等待所有用户应答</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button @click="handleAddGroups" type="primary" style="margin:10px;">提交</Button>
          </FormItem>
        </Form>
        <div slot="footer"></div>
      </Modal>
      <!-- 添加对讲组 -->
      <Modal v-model="modal" title="添加" width="650">
        <Form
          ref="formValidate"
          :rules="ruleAddGroup"
          :model="formItem"
          :label-width="150"
          label-position="left"
        >
          <FormItem label="群组名称" prop="name">
            <Input v-model="formItem.name"></Input>
          </FormItem>
          <FormItem label="注册密码" prop="regPwd">
            <Input type="password" v-model="formItem.regPwd"></Input>
          </FormItem>
          <FormItem label="群组类型">
            <Select v-model="formItem.type">
              <Option value="vgcsTel">组呼群组</Option>
              <Option value="broadcastTel">广播群组</Option>
            </Select>
          </FormItem>
          <FormItem label="组呼号码" prop="num">
            <Input v-model="formItem.num"></Input>
          </FormItem>
          <FormItem label="组呼级别">
            <Select v-model="formItem.level">
              <Option value="0">0</Option>
              <Option value="1">1</Option>
              <Option value="2">2</Option>
              <Option value="3">3</Option>
              <Option value="4">4</Option>
            </Select>
          </FormItem>
          <FormItem label="是否录音">
            <Select v-model="formItem.record">
              <Option value="0">不录音</Option>
              <Option value="1">录音</Option>
            </Select>
          </FormItem>
          <FormItem label="创建模式">
            <Select v-model="formItem.crtMode">
              <Option value="0">不等待所有用户应答</Option>
              <Option value="1">等待所有用户应答</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button @click="handleAddGroup" type="primary" style="margin:10px;">提交</Button>
          </FormItem>
        </Form>
        <div slot="footer"></div>
      </Modal>
      <!-- 编辑对讲组 -->
      <Modal v-model="editModal" title="编辑" width="650">
        <Form
          ref="editFormValidate"
          :rules="ruleEditGroup"
          :model="editFormItem"
          :label-width="150"
          label-position="left"
        >
          <FormItem label="群组ID">
            <Input disabled v-model="editFormItem.gid"></Input>
          </FormItem>
          <FormItem label="群组名称" prop="name">
            <Input v-model="editFormItem.name"></Input>
          </FormItem>
          <FormItem label="注册密码">
            <Input type="password" v-model="editFormItem.regPwd"></Input>
          </FormItem>
          <FormItem label="群组类型">
            <Select v-model="editFormItem.type">
              <Option value="vgcsTel">组呼群组</Option>
              <Option value="broadcastTel">广播群组</Option>
            </Select>
          </FormItem>
          <FormItem label="组呼号码" prop="num">
            <Input v-model="editFormItem.num"></Input>
          </FormItem>
          <FormItem label="组呼级别">
            <Select v-model="editFormItem.level">
              <Option value="0">0</Option>
              <Option value="1">1</Option>
              <Option value="2">2</Option>
              <Option value="3">3</Option>
              <Option value="4">4</Option>
            </Select>
          </FormItem>
          <FormItem label="是否录音">
            <Select v-model="editFormItem.record">
              <Option value="0">不录音</Option>
              <Option value="1">录音</Option>
            </Select>
          </FormItem>
          <FormItem label="创建模式">
            <Select v-model="editFormItem.crtMode">
              <Option value="0">不等待所有用户应答</Option>
              <Option value="1">等待所有用户应答</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button @click="handleEditGroup" type="primary" style="margin:10px;">提交</Button>
          </FormItem>
        </Form>
        <div slot="footer"></div>
      </Modal>
      <Table stripe border :columns="groupColumns" :data="groupData"></Table>
      <div style="font-size:14px;margin:100px 10px 10px 10px;">组内用户列表</div>
      <Form
        :model="searchUser"
        label-position="left"
        inline
        style="padding-left:20px;"
        @submit.native.prevent
        :label-width="60"
      >
        <FormItem label="电话">
          <Input @on-enter="submitSearchUser" v-model="searchUser.tel"></Input>
        </FormItem>
        <FormItem :label-width="120" label="用户在组中的权限">
          <Select v-model="searchUser.auth">
            <Option value>请选择</Option>
            <Option value="1">参与者</Option>
            <Option value="2">能发起组呼</Option>
            <Option value="3">能发起广播</Option>
            <Option value="4">能发起组呼和广播</Option>
            <Option value="5">只查看</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button @click="submitSearchUser" type="primary">查询</Button>
        </FormItem>
      </Form>
      <Table
        stripe
        border
        :columns="userColumns"
        :data="userData"
        @on-selection-change="handleDelGroupUsers"
      ></Table>
      <Modal v-model="editUserModal" title="编辑" width="650">
        <Form :model="editUserForm" :label-width="150" label-position="left">
          <FormItem label="群组ID">
            <Input disabled v-model="editUserForm.gid"></Input>
          </FormItem>
          <FormItem label="用户ID">
            <Input disabled v-model="editUserForm.uid"></Input>
          </FormItem>
          <FormItem label="用户在组中的权限">
            <Select v-model="editUserForm.auth">
              <Option value="1">参与者</Option>
              <Option value="2">能发起组呼</Option>
              <Option value="3">能发起广播</Option>
              <Option value="4">能发起组呼和广播</Option>
              <Option value="5">只查看</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button @click="submitEdit" type="primary" style="margin:10px;">提交</Button>
          </FormItem>
        </Form>
        <div slot="footer"></div>
      </Modal>
      <Modal v-model="addUserByIdmodal" title="添加" width="650">
        <Form
          ref="addUserByIdRef"
          :model="addUserByIdformItem"
          :label-width="150"
          label-position="left"
        >
          <FormItem label="群组ID">
            <Input disabled v-model="addUserByIdformItem.gid"></Input>
          </FormItem>
          <FormItem label="用户ID">
            <Input v-model="addUserByIdformItem.uid"></Input>
          </FormItem>
          <FormItem label="群组类型">
            <Select v-model="addUserByIdformItem.auth">
              <Option value="1">参与者</Option>
              <Option value="2">能发起组呼</Option>
              <Option value="3">能发起广播</Option>
              <Option value="4">能发起组呼和广播</Option>
              <Option value="5">只查看</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button @click="handleAddUserById" type="primary" style="margin:10px;">提交</Button>
          </FormItem>
        </Form>
        <div slot="footer"></div>
      </Modal>
      <Modal v-model="addUserByTelmodal" title="添加" width="650">
        <Form :model="addUserByTelformItem" :label-width="150" label-position="left">
          <FormItem label="群组号码">
            <Input disabled v-model="addUserByTelformItem.gtel"></Input>
          </FormItem>
          <FormItem label="用户号码">
            <Input v-model="addUserByTelformItem.utel"></Input>
          </FormItem>
          <FormItem label="群组类型">
            <Select v-model="addUserByTelformItem.auth">
              <Option value="1">参与者</Option>
              <Option value="2">能发起组呼</Option>
              <Option value="3">能发起广播</Option>
              <Option value="4">能发起组呼和广播</Option>
              <Option value="5">只查看</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button @click="handleAddUserByTel" type="primary" style="margin:10px;">提交</Button>
          </FormItem>
        </Form>
        <div slot="footer"></div>
      </Modal>
      <Modal v-model="addUserByStepModal" title="添加" width="650">
        <Form
          ref="formAddStep"
          :rules="ruleAddStep"
          :model="addUserByStepformItem"
          :label-width="150"
          label-position="left"
        >
          <FormItem label="步长" prop="step">
            <Input v-model="addUserByStepformItem.step"></Input>
          </FormItem>
          <FormItem label="开始号码">
            <Input v-model="addUserByStepformItem.utelStart"></Input>
          </FormItem>
          <FormItem label="结束号码">
            <Input v-model="addUserByStepformItem.utelEnd"></Input>
          </FormItem>
          <FormItem label="群组类型">
            <Select v-model="addUserByStepformItem.auth">
              <Option value="1">参与者</Option>
              <Option value="2">能发起组呼</Option>
              <Option value="3">能发起广播</Option>
              <Option value="4">能发起组呼和广播</Option>
              <Option value="5">只查看</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button @click="handleAddUserByStep" type="primary" style="margin:10px;">提交</Button>
          </FormItem>
        </Form>
        <div slot="footer"></div>
      </Modal>
      <div class="flex">
        <div v-if="auth">
          <Button
            @click="gid ? addUserByIdmodal = true : $Message.error('请选择对讲组')"
            type="primary"
            style="margin:10px;"
          >通过ID添加</Button>
          <Button
            @click="gid ? addUserByTelmodal = true : $Message.error('请选择对讲组')"
            type="primary"
            style="margin:10px;"
          >通过号码添加</Button>
          <Button
            @click="gid ? addUserByStepModal = true : $Message.error('请选择对讲组')"
            type="primary"
            style="margin:10px;"
          >分段加入群组</Button>
          <Button @click="DelGroupUsers" style="margin:10px;" type="primary">批量删除用户</Button>
        </div>
        <Page
          :current="groupUserPage"
          :total="groupTotal"
          :page-size="groupPageSize"
          @on-change="handlePageChange"
        />
      </div>
    </div>
    <Modal :mask-closable="false" v-model="delFailed" title="失败详情" width="1600">
      <!-- 用户详情 -->
      <div style="font-size:14px;">
        <span>
          失败条数:
          <span style="color:red;">{{ failedCount.errCount }}</span>,
        </span>
        <span>成功条数: {{ failedCount.sucCount }},</span>
        <span>总条数: {{ failedCount.count }}</span>
      </div>
      <Table stripe border :columns="delFailedColumns" :data="delFailedData"></Table>
      <div slot="footer"></div>
    </Modal>
  </main>
</template>
<script>
import {
  selectusergroup,
  addusersgroup,
  addgroups,
  delusersgroup,
  delusers,
  addusers,
  addusergroupbystep,
  selectallgroup,
  selectgroup,
  addGroup,
  delGroup,
  editGroup,
  addUserById,
  addUserByTel,
  editUser,
  delUser,
  addOrg,
  editOrg,
  delOrg,
  addUser,
  updateUser,
  delOrgUser,
  getUserShow,
  editUserShow,
  selectallorg,
  getOrgInfo
} from '@/api/data'
import _ from 'lodash'
import { formatData, _formatData, handleExpand } from '@/libs/tools'
import { mapState } from 'vuex'
export default {
  name: 'User',
  data() {
    return {
      failedCount: {
        count: 0,
        errCount: 0,
        sucCount: 0
      },
      delFailedColumns: [
        {
          title: '用户',
          align: 'center',
          key: 'idOrTel'
        },
        {
          title: '原因',
          align: 'center',
          key: 'rEASON'
        }
      ],
      delFailedData: [],
      delFailed: false,
      breadCrumbData: [],
      editOrgUserForm: {},
      editOrgUserModal: false,
      editOrgTreeModal: false,
      warn: false,
      orgPageSize: 0,
      groupPageSize: 0,
      ruleAddStep: {
        step: [
          {
            type: 'number',
            min: 1,
            message: '步长最小为1',
            trigger: 'blur',
            transform(value) {
              return Number(value)
            }
          }
        ]
      },
      ruleAddUsers: {
        phoneCount: [
          { required: true, message: '请填写此字段', trigger: 'blur' },
          {
            type: 'number',
            min: 2,
            max: 1000,
            message: '必须为数字大于1且小于1000',
            trigger: 'blur',
            transform(value) {
              return Number(value)
            }
          }
        ],
        phoneLen: [
          { required: true, message: '请填写此字段', trigger: 'blur' },
          {
            type: 'number',
            min: 1,
            message: '步长最小为1',
            trigger: 'blur',
            transform(value) {
              return Number(value)
            }
          }
        ],
        tel: [
          { required: true, message: '请填写此字段', trigger: 'blur' },
          {
            pattern: /^[0-9]*$/,
            message: '请输入数字',
            trigger: 'blur'
          }
        ],
        name: [
          { required: true, message: '请填写此字段', trigger: 'blur' },
          {
            type: 'number',
            message: '必须为数字',
            trigger: 'blur',
            transform(value) {
              return Number(value)
            }
          }
        ],
        regPwd: [
          { required: true, message: '请填写此字段', trigger: 'blur' },
          {
            type: 'string',
            max: 128,
            message: '最大长度128',
            trigger: 'blur'
          }
        ]
      },
      ruleAddGroups: {
        groupCount: [
          { required: true, message: '请填写此字段', trigger: 'blur' },
          {
            type: 'number',
            min: 2,
            max: 1000,
            message: '必须为数字大于1且小于1000',
            trigger: 'blur',
            transform(value) {
              return Number(value)
            }
          }
        ],
        groupLen: [
          { required: true, message: '请填写此字段', trigger: 'blur' },
          {
            type: 'number',
            min: 1,
            message: '步长最小为1',
            trigger: 'blur',
            transform(value) {
              return Number(value)
            }
          }
        ],
        name: [{ required: true, message: '请填写此字段', trigger: 'blur' }],
        regPwd: [
          { required: true, message: '请填写此字段', trigger: 'blur' },
          {
            type: 'string',
            max: 128,
            message: '最大长度128',
            trigger: 'blur'
          }
        ],
        num: [{ required: true, message: '请填写此字段', trigger: 'blur' }]
      },
      ruleEditGroup: {
        name: [{ required: true, message: '请填写此字段', trigger: 'blur' }],
        num: [{ required: true, message: '请填写此字段', trigger: 'blur' }]
      },
      ruleAddGroup: {
        name: [{ required: true, message: '请填写此字段', trigger: 'blur' }],
        regPwd: [
          { required: true, message: '请填写此字段', trigger: 'blur' },
          {
            type: 'string',
            max: 128,
            message: '最大长度128',
            trigger: 'blur'
          }
        ],
        num: [{ required: true, message: '请填写此字段', trigger: 'blur' }]
      },
      ruleValidate: {
        tel: [
          {
            required: true,
            message: '用户号码不能为空',
            trigger: 'blur'
          },
          {
            pattern: /^[0-9]*$/,
            message: '请输入数字',
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: '用户名称不能为空',
            trigger: 'blur'
          }
        ],
        regPwd: [
          {
            required: true,
            message: '用户密码不能为空',
            trigger: 'blur'
          },
          {
            type: 'string',
            max: 128,
            message: '最大长度128',
            trigger: 'blur'
          }
        ]
      },
      ruleEditValidate: {
        tel: [
          {
            required: true,
            message: '用户号码不能为空',
            trigger: 'blur'
          },
          {
            pattern: /^[0-9]*$/,
            message: '请输入数字',
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: '用户名称不能为空',
            trigger: 'blur'
          }
        ],
        regPwd: [
          {
            type: 'string',
            max: 128,
            message: '最大长度128',
            trigger: 'blur'
          }
        ]
      },
      handleAddUserGroupModal: false,
      handleAddUserGroupForm: {
        idList: '',
        type: 'uid',
        gid: '',
        auth: '1'
      },
      usersTel: [],
      modals: false,
      delGroupUsersList: [],
      delUsers: [],
      addUsersForm: {},
      addUsersModal: false,
      addUserByStepformItem: {
        step: '',
        utelStart: '',
        utelEnd: '',
        gtel: '',
        auth: '4'
      },
      addUserByStepModal: false,
      searchOrgName: '',
      searchGroupName: '',
      searchGroup: {
        tel: '',
        name: '',
        status: '',
        trunkFlag: '',
        isGlobal: false
      },
      searchUser: {
        tel: '',
        auth: ''
      },
      broadcastTelImg: require('../../assets/images/b.png'),
      vgcsTel: require('../../assets/images/a.png'),
      userDetailColumns: [
        {
          title: 'ID',
          align: 'center',
          key: 'uid'
        },
        {
          title: '部门',
          align: 'center',
          key: 'parentOrgName'
        },
        {
          title: '号码',
          align: 'center',
          key: 'tel'
        },
        {
          title: '名称',
          align: 'center',
          key: 'name'
        },
        {
          title: '级别',
          align: 'center',
          key: 'level'
        },
        {
          title: '状态',
          align: 'center',
          key: 'status',
          render(h, params) {
            let text = ''
            switch (params.row.status) {
              case 'logout':
                text = '未登录'
                break
              case 'login':
                text = '登录'
                break
              default:
                text = ''
            }
            return h('div', text)
          }
        },
        {
          title: '半双工权限',
          align: 'center',
          key: 'singleAuth',
          render(h, params) {
            let text = ''
            switch (params.row.singleAuth) {
              case 0:
                text = '无权限'
                break
              case 1:
                text = '有权限'
                break
              default:
                text = ''
            }
            return h('div', text)
          }
        },
        {
          title: '半双工录音',
          align: 'center',
          key: 'singleRecord',
          render(h, params) {
            let text = ''
            switch (params.row.singleRecord) {
              case 0:
                text = '不录音'
                break
              case 1:
                text = '录音'
                break
              default:
                text = ''
            }
            return h('div', text)
          }
        },
        {
          title: '全双工权限',
          align: 'center',
          key: 'duplexAuth',
          render(h, params) {
            let text = ''
            switch (params.row.duplexAuth) {
              case 0:
                text = '无权限'
                break
              case 1:
                text = '有权限'
                break
              default:
                text = ''
            }
            return h('div', text)
          }
        },
        {
          title: '全双工录音',
          align: 'center',
          render(h, params) {
            let text = ''
            switch (params.row.duplexRecord) {
              case 0:
                text = '不录音'
                break
              case 1:
                text = '录音'
                break
              default:
                text = ''
            }
            return h('div', text)
          }
        },
        {
          title: '定位权限',
          align: 'center',
          render(h, params) {
            return h('div', params.row.orientation ? '有' : '没有')
          }
        },
        {
          title: '连接模式',
          align: 'center',
          render(h, params) {
            return h('div', params.row.jbMode ? '3G' : 'WIFI')
          }
        },
        {
          title: '语音质量',
          align: 'center',
          render(h, params) {
            let text = ''
            switch (params.row.voiceQuality) {
              case 0:
                text = '高'
                break
              case 1:
                text = '中'
                break
              case 2:
                text = '低'
                break
              default:
                text = ''
            }
            return h('div', text)
          }
        },
        {
          title: '视频',
          align: 'center',
          render(h, params) {
            return h('div', params.row.videoFlg ? '有' : '没有')
          }
        },
        {
          title: '图片',
          align: 'center',
          render(h, params) {
            return h('div', params.row.pictureFlg ? '有' : '没有')
          }
        },
        {
          title: '短信',
          align: 'center',
          render(h, params) {
            return h('div', params.row.messageFlg ? '有' : '没有')
          }
        },
        {
          title: '监控',
          align: 'center',
          render(h, params) {
            return h('div', params.row.monitorFlg ? '有' : '没有')
          }
        },
        {
          title: '类型',
          align: 'center',
          render(h, params) {
            let text = ''
            switch (params.row.trunkFlag) {
              case 0:
                text = 'poc用户'
                break
              case 1:
                text = 'esip用户'
                break
              case 2:
                text = '本地调度用户'
                break
              case 3:
                text = '中继用户'
                break
            }
            return h('div', text)
          }
        },
        {
          title: '组呼免打扰权限',
          align: 'center',
          key: 'powerDdbGroupcall',
          render(h, params) {
            return h('div', params.row.powerDdbGroupcall ? '有' : '无')
          }
        },
        {
          title: '用户职务',
          align: 'center',
          key: 'position'
        },
        {
          title: '电话号码',
          align: 'center',
          key: 'phone'
        }
        // {
        //   title: '组织机构',
        //   align: 'center',
        //   key: 'organization'
        // }
      ],
      userDetailData: [],
      UserDetailModal: false,
      userEditOrgTree: [],
      userAddOrgTree: [],
      rawTree: [],
      showTree: [],
      addOrgUserModal: false,
      menu: ['通讯录管理页', '对讲组管理页'],
      menuIndex: 0,
      group: [],
      groupColumns: [
        {
          title: 'ID',
          align: 'center',
          key: 'gid'
        },
        {
          title: '群组名称',
          align: 'center',
          key: 'name'
        },
        {
          title: '群组类型',
          align: 'center',
          render(h, params) {
            return h('div', params.row.broadcastTel ? '广播群组' : '组呼群组')
          }
        },
        {
          title: '群组号码',
          align: 'center',
          render(h, params) {
            return h('div', params.row.broadcastTel || params.row.vgcsTel)
          }
        },
        {
          title: '群组优先级',
          align: 'center',
          key: 'level'
        },
        {
          title: '创建模式',
          align: 'center',
          key: 'crtMode',
          render(h, params) {
            let text = ''
            switch (params.row.crtMode) {
              case 0:
                text = '不等待'
                break
              case 1:
                text = '等待'
                break
              default:
                text = ''
            }
            return h('div', text)
          }
        },
        {
          title: '是否录音',
          align: 'center',
          key: 'record',
          render(h, params) {
            let text = ''
            switch (params.row.record) {
              case 0:
                text = '不录音'
                break
              case 1:
                text = '录音'
                break
              default:
                text = ''
            }
            return h('div', text)
          }
        },
        {
          title: '操作',
          align: 'center',
          key: 'gid',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'info',
                    size: 'small'
                  },
                  style: {
                    marginRight: '3px',
                    display: this.auth ? '' : 'none'
                  },
                  on: {
                    click: () => {
                      this.edit(params.row)
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
                    display: this.auth ? '' : 'none'
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: '信息',
                        content: '<p>确定删除？</p>',
                        onOk: () => {
                          this.remove(params.row.gid)
                        },
                        onCancel: () => {
                          return
                        }
                      })
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ],
      groupData: [],
      userColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: 'ID',
          align: 'center',
          key: 'uid'
        },
        {
          title: '号码',
          align: 'center',
          key: 'tel'
        },
        {
          title: '用户在组中的权限',
          align: 'center',
          key: 'userGroup',
          render(h, params) {
            let text = ''
            switch (params.row.userGroup) {
              case 1:
                text = '参与者'
                break
              case 2:
                text = '能发起组呼'
                break
              case 3:
                text = '能发起广播'
                break
              case 4:
                text = '能发起组呼和广播'
                break
              case 5:
                text = '只查看'
                break
              default:
                text = ''
            }
            return h('div', text)
          }
        },
        {
          title: '操作',
          algin: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'info',
                    size: 'small'
                  },
                  style: {
                    marginRight: '3px',
                    display: this.auth ? '' : 'none'
                  },
                  on: {
                    click: () => {
                      this.editUser(params.row)
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
                    display: this.auth ? '' : 'none'
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: '信息',
                        content: '<p>确定删除？</p>',
                        onOk: () => {
                          this.removeUser(params.row.uid)
                        },
                        onCancel: () => {
                          return
                        }
                      })
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ],
      userData: [],
      userTree: [],
      groupUserColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: 'ID',
          align: 'center',
          key: 'uid'
        },
        {
          title: '号码',
          align: 'center',
          key: 'tel'
        },
        {
          title: '名称',
          align: 'center',
          key: 'name'
        },
        {
          title: '级别',
          align: 'center',
          key: 'level'
        },
        {
          title: '状态',
          align: 'center',
          key: 'status',
          render(h, params) {
            let text = ''
            switch (params.row.status) {
              case 'logout':
                text = '未登录'
                break
              case 'login':
                text = '登录'
                break
              default:
                text = ''
            }
            return h('div', text)
          }
        },
        {
          title: '半双工权限',
          align: 'center',
          key: 'singleAuth',
          render(h, params) {
            let text = ''
            switch (params.row.singleAuth) {
              case 0:
                text = '无权限'
                break
              case 1:
                text = '有权限'
                break
              default:
                text = ''
            }
            return h('div', text)
          }
        },
        {
          title: '全双工权限',
          align: 'center',
          key: 'duplexAuth',
          render(h, params) {
            let text = ''
            switch (params.row.duplexAuth) {
              case 0:
                text = '无权限'
                break
              case 1:
                text = '有权限'
                break
              default:
                text = ''
            }
            return h('div', text)
          }
        },
        {
          title: '用户类型',
          align: 'center',
          render(h, params) {
            let text = ''
            switch (params.row.trunkFlag) {
              case 0:
                text = 'poc用户'
                break
              case 1:
                text = 'esip用户'
                break
              case 2:
                text = '本地调度用户'
                break
              case 3:
                text = '中继用户'
                break
            }
            return h('div', text)
          }
        },
        {
          title: '操作',
          align: 'center',
          width: 240,
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'info',
                    size: 'small'
                  },
                  style: {
                    marginRight: '3px'
                  },
                  on: {
                    click: () => {
                      this.handleUserDetail(params.row)
                    }
                  }
                },
                '详情'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'info',
                    size: 'small'
                  },
                  style: {
                    marginRight: '3px',
                    display: this.auth ? '' : 'none'
                  },
                  on: {
                    click: () => {
                      this.editOrgUser(params.row)
                    }
                  }
                },
                '编辑'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'info',
                    size: 'small'
                  },
                  style: {
                    marginRight: '3px',
                    display: this.auth ? '' : 'none'
                  },
                  on: {
                    click: () => {
                      this.handleUserTree(params.row.uid)
                    }
                  }
                },
                '权限'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    display: this.auth ? '' : 'none'
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: '信息',
                        content: '<p>确定删除？</p>',
                        onOk: () => {
                          this.removeOrgUser(params.row.uid)
                        },
                        onCancel: () => {
                          return
                        }
                      })
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ],
      groupUserData: [],
      modal: false,
      editModal: false,
      addUserByIdmodal: false,
      addUserByTelmodal: false,
      editUserModal: false,
      editOrgModal: false,
      addUserModal: false,
      formItems: {
        groupCount: '',
        groupLen: '',
        name: '',
        regPwd: '',
        type: 'vgcsTel',
        num: '',
        level: '2',
        record: '0',
        crtMode: '0'
      },
      formItem: {
        name: '',
        regPwd: '',
        type: 'vgcsTel',
        num: '',
        level: '2',
        record: '0',
        crtMode: '0'
      },
      editFormItem: {
        name: '',
        regPwd: '',
        type: '',
        num: '',
        level: '',
        record: '',
        crtMode: ''
      },
      addUserByIdformItem: {
        gid: '',
        uid: '',
        auth: '4'
      },
      addUserByTelformItem: {
        utel: '',
        gtel: '',
        auth: '4'
      },
      editUserForm: {
        gid: '',
        uid: '',
        auth: ''
      },
      editOrgForm: {
        parentOid: '',
        orgName: '',
        node: 'this',
        parentName: ''
      },
      total: 0,
      groupTotal: 0,
      oid: 0,
      gid: 0,
      uid: 0,
      parentOid: 0,
      addOrgModal: false,
      addOrgForm: {
        name: '',
        parentOid: '',
        orgName: '',
        node: 'root'
      },
      orgData: {},
      addUserForm: {},
      orgName: '',
      orgPage: 1,
      groupPage: 1,
      OrgUserPage: 1,
      groupUserPage: 1
    }
  },
  computed: {
    ...mapState(['auth'])
  },
  methods: {
    handleRadioChange(data) {
      this.warn = false
    },
    handleWarn() {
      this.warn = true
      this.editOrgTreeModal = true
    },
    handleCancel() {
      this.editOrgTreeModal = false
    },
    // 菜单切换
    handleMenu(e) {
      this.menuIndex = e
      if (e == 0) {
        this.getAllUser()
        this.oid = 0
        this.groupUserData = []
        this.total = 0
      }
      if (e == 1) {
        this.searchGroup.tel = ''
        this.searchGroup.name = ''
        this.searchGroup.status = ''
        this.searchGroup.status = ''
        this.searchGroup.trunkFlag = ''
        this.searchGroup.isGlobal = false
        this.getAllGroup()
        this.gid = 0
        this.userData = []
        this.groupData = []
        this.groupTotal = 0
      }
    },
    // 查询所有对讲组及用户
    getAllGroup() {
      selectallgroup({}).then(res => {
        this.group = res.data
      })
    },
    // 查询所有部门及用户
    getAllUser() {
      selectallorg({}).then(res => {
        formatData(res.data)
        this.rawTree = res.data
        this.userTree = formatData(res.data)
      })
    },
    // 根据ID查询组下用户
    handleGroup(gid, currentPage = 1) {
      this.gid = gid
      selectusergroup({ gid, currentPage }).then(res => {
        this.groupData = res.data.list
        res.data.list[0].pocUserList.forEach(e => {
          e.userGroup = e.userGroup.auth
        })
        this.userData = res.data.list[0].pocUserList
        this.addUserByIdformItem.gid = gid
        this.addUserByTelformItem.gtel =
          res.data.list[0].broadcastTel || res.data.list[0].vgcsTel
        this.groupTotal = res.data.total
        this.groupPageSize = res.data.pageSize
        this.groupUserPage = res.data.pageNum
      })
    },
    // 根据ID查询部门下用户
    handleTree(data) {
      this.addOrgForm.node = 'this'
      this.searchGroup.tel = ''
      this.searchGroup.name = ''
      this.searchGroup.status = ''
      this.searchGroup.status = ''
      this.searchGroup.trunkFlag = ''
      this.searchGroup.isGlobal = false
      this.searchUser.name = ''
      this.searchUser.status = ''
      this.searchUser.trunkFlag = ''
      this.editOrgForm.parentName = ''
      this.oid = data[0].oid
      this.parentOid = data[0].parentOid
      this.orgName = data[0].title
      selectgroup({ oid: data[0].oid, currentPage: 1 }).then(res => {
        this.orgData = res.data.list[0]
        this.groupUserData = res.data.list[0].pocUserList
        this.total = res.data.total
        this.orgPageSize = res.data.pageSize
        this.OrgUserPage = res.data.pageNum
      })
      const rawData = _.cloneDeep(this.rawTree)
      this.breadCrumbData = handleExpand(
        this.oid,
        this.parentOid,
        rawData
      ).filter(e => e.expand)
    },
    // 添加对讲组
    handleAddGroup() {
      this.$refs['formValidate'].validate(valid => {
        if (valid) {
          const data = this.formItem
          const name = data.name
          const regPwd = data.regPwd
          const type = data.type
          const key = `${type}`
          const num = data.num
          const level = data.level
          const record = data.record
          const crtMode = data.crtMode
          const res = {
            name,
            regPwd,
            level,
            record,
            crtMode,
            regName: num
          }
          res[`${type}`] = num
          addGroup(res).then(res => {
            if (JSON.parse(res.data).RES == 'OK') {
              this.$Message.success('添加成功')
              this.getAllGroup()
              this.modal = false
            } else {
              this.$Message.error(JSON.parse(res.data).REASON)
              this.modal = false
            }
            this.$refs['formValidate'].resetFields()
          })
        }
      })
    },
    // 删除组
    remove(gid) {
      delGroup({ gid }).then(res => {
        if (JSON.parse(res.data).RES == 'OK') {
          this.$Message.success('删除成功')
          this.groupTotal = 0
          this.getAllGroup()
          this.groupData = []
          this.userData = []
        } else {
          this.$Message.error(JSON.parse(res.data).REASON)
        }
      })
    },
    // 编辑组
    edit(row) {
      selectusergroup({ gid: row.gid }).then(res => {
        const data = {}
        data.gid = res.data.list[0].gid
        data.name = res.data.list[0].name
        data.regPwd = ''
        if (res.data.list[0].broadcastTel) {
          data.type = 'broadcastTel'
          data.num = res.data.list[0].broadcastTel
        } else {
          data.type = 'vgcsTel'
          data.num = res.data.list[0].vgcsTel
        }
        data.level = `${res.data.list[0].level}`
        data.record = `${res.data.list[0].record}`
        data.crtMode = `${res.data.list[0].crtMode}`
        this.editFormItem = data
        this.groupUserPage = res.data.pageNum
      })
      this.editModal = true
    },
    //编辑提交组
    handleEditGroup() {
      this.$refs['editFormValidate'].validate(valid => {
        if (valid) {
          const data = this.editFormItem
          const gid = data.gid
          const name = data.name
          const regPwd = data.regPwd
          const type = data.type
          const num = data.num
          const level = data.level
          const record = data.record
          const crtMode = data.crtMode
          const res = {
            gid,
            name,
            regPwd,
            level,
            record,
            crtMode,
            regName: num
          }
          res[`${type}`] = num
          editGroup(res).then(res => {
            if (JSON.parse(res.data).RES == 'OK') {
              this.$Message.success('修改成功')
              this.getAllGroup()
              this.handleGroup(gid)
              this.editModal = false
            } else {
              this.$Message.error(JSON.parse(res.data).REASON)
              this.editModal = false
            }
          })
        }
      })
    },
    // 通过ID添加用户
    handleAddUserById() {
      addUserById({
        gid: this.addUserByIdformItem.gid,
        uid: this.addUserByIdformItem.uid,
        auth: this.addUserByIdformItem.auth
      }).then(res => {
        if (JSON.parse(res.data).RES == 'OK') {
          this.$Message.success('添加成功')
          selectusergroup({ gid: this.gid }).then(res => {
            res.data.list[0].pocUserList.forEach(e => {
              e.userGroup = e.userGroup.auth
            })
            this.userData = res.data.list[0].pocUserList
            this.groupUserPage = res.data.pageNum
          })
          this.addUserByIdmodal = false
        } else {
          this.$Message.error(JSON.parse(res.data).REASON)
          this.addUserByIdmodal = false
        }
        this.addUserByIdformItem.uid = ''
        this.addUserByIdformItem.auth = '4'
      })
    },
    // 根据号码添加用户
    handleAddUserByTel() {
      addUserByTel({
        gtel: this.addUserByTelformItem.gtel,
        utel: this.addUserByTelformItem.utel,
        auth: this.addUserByTelformItem.auth
      }).then(res => {
        if (JSON.parse(res.data).RES == 'OK') {
          this.$Message.success('添加成功')
          selectusergroup({ gid: this.gid }).then(res => {
            res.data.list[0].pocUserList.forEach(e => {
              e.userGroup = e.userGroup.auth
            })
            this.userData = res.data.list[0].pocUserList
            this.groupUserPage = res.data.pageNum
          })
          this.addUserByTelmodal = false
        } else {
          this.$Message.error(JSON.parse(res.data).REASON)
          this.addUserByTelmodal = false
        }
        this.addUserByTelformItem.utel = ''
        this.addUserByTelformItem.auth = '4'
      })
    },
    // 在组下编辑用户
    editUser(row) {
      this.editUserForm.gid = this.gid
      this.editUserForm.uid = row.uid
      this.editUserForm.auth = `${row.userGroup}`
      this.editUserModal = true
    },
    // 在组下编辑用户
    submitEdit() {
      editUser({
        gid: this.editUserForm.gid,
        uid: this.editUserForm.uid,
        auth: this.editUserForm.auth
      }).then(res => {
        if (JSON.parse(res.data).RES == 'OK') {
          this.$Message.success('修改成功')
          this.getAllGroup()
          const currentPage = this.groupPage
          setTimeout(() => {
            this.handleGroup(this.gid, currentPage)
          }, 50)
          this.editUserModal = false
        } else {
          this.$Message.error(JSON.parse(res.data).REASON)
          this.editUserModal = false
        }
      })
    },
    // 删除组下用户
    removeUser(uid) {
      delUser({ uid, gid: this.gid }).then(res => {
        if (JSON.parse(res.data).RES == 'OK') {
          this.$Message.success('删除成功')
          const currentPage = this.groupPage
          this.handleGroup(this.gid, currentPage)
        } else {
          this.$Message.error(JSON.parse(res.data).REASON)
        }
      })
    },
    // 添加部门
    handleAddOrg() {
      if (this.addOrgForm.node == 'root') {
        this.addOrgForm.parentOid = 0
        this.addOrgForm.orgName = ''
      } else {
        this.addOrgForm.parentOid = this.oid
        this.addOrgForm.orgName = this.orgName
      }
      // this.userAddOrgTree = _.cloneDeep(this.userTree)
      this.addOrgModal = true
    },
    handleAddOrgTree(data) {
      this.addOrgForm.parentOid = data[0].oid
      this.addOrgForm.orgName = data[0].title
    },
    handleEditOrgTree(data) {
      this.editOrgForm.parentOid = data[0].oid
      this.editOrgForm.parentName = data[0].title
    },
    // 树的展开
    handleTreeExpand() {
      selectallorg({}).then(res => {
        handleExpand(this.oid, this.parentOid, res.data)
        _formatData(res.data)
        this.userTree = _formatData(res.data)
      })
    },
    // 添加部门提交
    submitAddOrg() {
      const name = this.addOrgForm.name
      if (this.addOrgForm.node == 'root') {
        this.addOrgForm.parentOid = 0
      } else {
        this.addOrgForm.parentOid = this.oid
      }
      const parentOid = this.addOrgForm.parentOid
      addOrg({ name, parentOid }).then(res => {
        if (JSON.parse(res.data).RES == 'OK') {
          this.$Message.success('添加成功')
          this.breadCrumbData = []
          this.handleTreeExpand()
        } else {
          this.$Message.error(JSON.parse(res.data).REASON)
        }
        this.addOrgModal = false
        this.addOrgForm.name = ''
        this.addOrgForm.parentOid = ''
        this.addOrgForm.orgName = ''
        this.addOrgForm.node = 'root'
      })
    },
    // 修改部门
    handleEditOrg() {
      if (this.oid) {
        this.editOrgModal = true
        this.editOrgForm.name = this.orgData.name
        this.editOrgForm.parentOid = this.orgData.parentOid
        if (this.orgData.parentOid == 0) {
          this.editOrgForm.node = 'root'
        } else {
          this.editOrgForm.node = 'this'
        }
        selectgroup({ oid: this.orgData.parentOid, currentPage: 1 }).then(
          res => {
            if (res.data.list.length) {
              this.editOrgForm.parentName = res.data.list[0].name
              this.OrgUserPage = res.data.pageNum
            }
          }
        )
        this.userEditOrgTree = _.cloneDeep(this.userTree)
      } else {
        this.$Message.error('请选择部门')
      }
    },
    // 修改部门提交
    submitEditOrg() {
      editOrg({
        oid: this.oid,
        name: this.editOrgForm.name,
        parentOid:
          this.editOrgForm.node == 'this' ? this.editOrgForm.parentOid : 0
      }).then(res => {
        if (JSON.parse(res.data).RES == 'OK') {
          this.$Message.success('修改成功')
          this.breadCrumbData = []
        } else {
          this.$Message.error(JSON.parse(res.data).REASON)
        }
        this.editOrgModal = false
        this.editOrgTreeModal = false
        this.handleTreeExpand()
        this.oid = ''
        this.warn = false
      })
    },
    // 删除部门
    handleDelOrg() {
      if (this.oid) {
        this.$Modal.confirm({
          title: '信息',
          content: `<p>确定删除 "${this.orgName}" ？</p>`,
          onOk: () => {
            delOrg({ oid: this.oid }).then(res => {
              if (JSON.parse(res.data).RES == 'OK') {
                this.$Message.success('删除成功')
                this.total = 0
                this.breadCrumbData = []
              } else {
                this.$Message.error(JSON.parse(res.data).REASON)
                this.getAllUser()
              }
              this.oid = 0
              this.groupUserData = []
              this.handleTreeExpand()
            })
          },
          onCancel: () => {
            return
          }
        })
      } else {
        this.$Message.error('请选择部门')
      }
    },
    // 点击添加用户
    handleAddUserModal() {
      if (this.oid) {
        this.$refs['addUserByIdformValidate'].resetFields()
        this.addUserForm = {}
        this.addUserForm.level = 3
        this.addUserForm.singleAuth = 1
        this.addUserForm.singleRecord = 0
        this.addUserForm.duplexAuth = 1
        this.addUserForm.duplexRecord = 0
        this.addUserForm.orientation = 1
        this.addUserForm.jbMode = 0
        this.addUserForm.powerDdbGroupcall = 1
        this.addUserForm.voiceQuality = 0
        this.addUserForm.videoFlg = 1
        this.addUserForm.pictureFlg = 1
        this.addUserForm.messageFlg = 1
        this.addUserForm.monitorFlg = 1
        this.addUserForm.trunkFlag = 0
        this.addUserModal = true
      } else {
        this.$Message.error('请选择部门')
      }
    },
    // 添加用户提交
    submitUserAdd() {
      this.$refs['addUserByIdformValidate'].validate(valid => {
        if (valid) {
          addUser({
            oid: this.oid,
            ...this.addUserForm
          }).then(res => {
            if (JSON.parse(res.data).RES == 'OK') {
              this.$Message.success('添加成功')
              // this.getAllUser()
              this.addUserModal = false
              // 添加完成刷新
              selectgroup({ oid: this.oid, currentPage: 1 }).then(res => {
                this.orgData = res.data.list[0]
                this.groupUserData = res.data.list[0].pocUserList
                this.total = res.data.total
                this.OrgUserPage = res.data.pageNum
              })
            } else {
              this.$Message.error(JSON.parse(res.data).REASON)
              this.addUserModal = false
            }
          })
        }
      })
    },
    // 点击编辑用户
    editOrgUser(row) {
      this.$refs['editUserByIdformValidate'].resetFields()
      const rowData = JSON.parse(JSON.stringify(row))
      this.editOrgUserForm = rowData
      this.editOrgUserModal = true
    },
    // 提交编辑用户
    submitUserEdit() {
      this.$refs['editUserByIdformValidate'].validate(valid => {
        if (valid) {
          delete this.editOrgUserForm.mediaFlag
          updateUser({ ...this.editOrgUserForm }).then(res => {
            if (JSON.parse(res.data).RES == 'OK') {
              this.$Message.success('修改成功')
              // this.getAllUser()
              this.editOrgUserModal = false
              // 修改完成刷新
              this.submitSearchGroup({ currentPage: this.orgPage })
              // selectgroup({
              //   oid: this.oid,
              //   currentPage: this.orgPage
              // }).then(res => {
              //   this.orgData = res.data.list[0]
              //   this.groupUserData = res.data.list[0].pocUserList
              //   this.total = res.data.total
              //   this.OrgUserPage = res.data.pageNum
              // })
            } else {
              this.$Message.error(JSON.parse(res.data).REASON)
              this.editOrgUserModal = false
            }
          })
        }
      })
    },
    removeOrgUser(uid) {
      delOrgUser({ uid }).then(res => {
        if (JSON.parse(res.data).RES == 'OK') {
          this.$Message.success('删除成功')
          // this.getAllUser()
          // 删除完成刷新
          this.submitSearchGroup({ currentPage: this.orgPage })
        } else {
          this.$Message.error(JSON.parse(res.data).REASON)
        }
      })
    },
    // 查权限
    handleUserTree(uid) {
      this.uid = uid
      selectallorg({}).then(res => {
        formatData(res.data)
        this.rawTree = res.data
      })
      getUserShow({ uid }).then(res => {
        const oidList = res.data
        oidList.forEach(item => {
          this.rawTree.forEach(ite => {
            if (item.oid == ite.oid) {
              ite.checked = true
            }
          })
        })
        this.showTree = formatData(this.rawTree)
      })
      this.addOrgUserModal = true
    },
    // 改权限
    handleOrgUserTree(data) {
      const checkedTree = this.$refs.treeData.getCheckedAndIndeterminateNodes()
      const checkedArr = []
      checkedTree.map(e => {
        checkedArr.push(e.oid)
      })
      editUserShow({ uid: this.uid, oid: checkedArr.join('/') }).then(res => {
        if (JSON.parse(res.data).RES == 'OK') {
          this.$Message.success('修改成功')
          this.addOrgUserModal = false
        } else {
          this.$Message.error(JSON.parse(res.data).REASON)
          this.addOrgUserModal = false
        }
      })
    },
    handleUserDetail(row) {
      getOrgInfo({ uid: row.uid }).then(res => {
        const rowData = JSON.parse(JSON.stringify(row))
        rowData.parentOrgName = JSON.parse(res.data).name
        const arr = []
        arr.push(rowData)
        this.userDetailData = arr
        this.UserDetailModal = true
      })
    },
    // 组下用户分页
    handlePageChange(currentPage) {
      this.delGroupUsersList = []
      this.groupPage = currentPage
      this.submitSearchUser({ currentPage })
    },
    // 条件查询组中用户
    submitSearchUser(params) {
      if (this.gid) {
        selectusergroup({
          gid: this.gid,
          tel: this.searchUser.tel,
          auth: this.searchUser.auth ? this.searchUser.auth : '',
          ...params
        }).then(res => {
          if (res.data.list.length) {
            res.data.list[0].pocUserList.forEach(e => {
              e.userGroup = e.userGroup.auth
            })
            this.userData = res.data.list[0].pocUserList
            this.groupTotal = res.data.total
            this.groupUserPage = res.data.pageNum
          } else {
            this.userData = []
          }
        })
      } else {
        this.$Message.error('请选择对讲组')
      }
    },
    // 部门下用户翻页
    handlePage(currentPage) {
      this.usersTel = []
      this.delUsers = []
      this.orgPage = currentPage
      this.submitSearchGroup({ currentPage })
    },
    // 条件查询部门下用户
    submitSearchGroup(params) {
      if (this.oid || this.searchGroup.isGlobal) {
        selectgroup({
          oid: this.oid,
          currentPage: 1,
          tel: this.searchGroup.tel,
          name: this.searchGroup.name,
          status: this.searchGroup.status ? this.searchGroup.status : '',
          trunkFlag:
            this.searchGroup.trunkFlag || this.searchGroup.trunkFlag == 0
              ? this.searchGroup.trunkFlag
              : '',
          isGlobal: this.searchGroup.isGlobal ? 1 : '',
          ...params
        }).then(res => {
          if (res.data.list.length) {
            this.groupUserData = this.searchGroup.isGlobal
              ? res.data.list
              : res.data.list[0].pocUserList
            this.total = res.data.total
            this.orgPageSize = res.data.pageSize
            this.OrgUserPage = res.data.pageNum
          } else {
            this.groupUserData = []
          }
        })
      } else {
        this.$Message.error('请选择部门')
      }
    },
    handleSearchGroup() {
      selectallgroup({ name: this.searchGroupName }).then(res => {
        this.group = res.data
      })
    },
    handleSearchOrg() {
      if (this.searchOrgName) {
        selectallorg({ orgName: this.searchOrgName }).then(res => {
          formatData(res.data, true)
          this.userTree = formatData(res.data, true)
        })
      } else {
        selectallorg({ orgName: this.searchOrgName }).then(res => {
          formatData(res.data)
          this.userTree = formatData(res.data)
        })
      }
    },
    handleAddUserByStep() {
      this.$refs['formAddStep'].validate(valid => {
        if (valid) {
          this.addUserByStepformItem.gtel = this.addUserByTelformItem.gtel
          this.handleShowSpin()
          addusergroupbystep({ ...this.addUserByStepformItem }).then(res => {
            this.handleHideSpin(res)
            if (JSON.parse(res.data).RES == 'OK') {
              this.$Message.success('添加成功')
            } else {
              // this.$Message.error(JSON.parse(res.data).REASON)
              // alert(JSON.parse(res.data).REASON)
              this.handleFailedDetail(res.data)
            }
            this.addUserByStepModal = false
            this.addUserByStepformItem.step = ''
            this.addUserByStepformItem.utelStart = ''
            this.addUserByStepformItem.utelEnd = ''
            this.addUserByStepformItem.auth = '4'
            setTimeout(() => {
              const currentPage = this.groupPage
              this.handleGroup(this.gid, currentPage)
            }, 100)
          })
        }
      })
    },
    handleAddUsers() {
      if (this.oid) {
        this.addUsersModal = true
        this.addUsersForm.phoneCount = ''
        this.addUsersForm.phoneLen = ''
        this.addUsersForm.tel = ''
        this.addUsersForm.name = ''
        this.addUsersForm.regPwd = ''
        this.addUsersForm.level = 3
        this.addUsersForm.singleAuth = 1
        this.addUsersForm.singleRecord = 0
        this.addUsersForm.duplexAuth = 1
        this.addUsersForm.duplexRecord = 0
        this.addUsersForm.orientation = 1
        this.addUsersForm.jbMode = 0
        this.addUsersForm.voiceQuality = 0
        this.addUsersForm.videoFlg = 1
        this.addUsersForm.pictureFlg = 1
        this.addUsersForm.messageFlg = 1
        this.addUsersForm.monitorFlg = 1
        this.addUsersForm.trunkFlag = 0
        this.addUsersForm.powerDdbGroupcall = 1
        this.addUsersForm.position = ''
        this.addUsersForm.phone = ''
        this.addUsersForm.oid = this.oid
      } else {
        this.$Message.error('请选择部门')
      }
    },
    submitUsersAdd() {
      this.$refs['formAddUsers'].validate(valid => {
        if (valid) {
          this.handleShowSpin()
          addusers({ ...this.addUsersForm }).then(res => {
            this.handleHideSpin(res)
            if (JSON.parse(res.data).RES == 'OK') {
              this.$Message.success('添加成功')
            } else {
              // this.$Message.error(JSON.parse(res.data).REASON)
              // alert(JSON.parse(res.data).REASON)
              this.handleFailedDetail(res.data)
            }
            // this.getAllUser()
            this.addUsersModal = false
            selectgroup({ oid: this.oid, currentPage: 1 }).then(res => {
              this.orgData = res.data.list[0]
              this.groupUserData = res.data.list[0].pocUserList
              this.total = res.data.total
              this.OrgUserPage = res.data.pageNum
            })
          })
        }
      })
    },
    handleDelUsers(data) {
      const arr = []
      const arr1 = []
      data.map(e => {
        arr.push(e.uid)
        arr1.push(e.tel)
      })
      this.usersTel = arr1
      this.delUsers = arr
    },
    DelOrgUsers() {
      if (this.usersTel.length) {
        this.$Modal.confirm({
          title: '信息',
          content: '<p>确定删除？</p>',
          onOk: () => {
            this.handleShowSpin()
            delusers({ uidList: this.delUsers }).then(res => {
              this.handleHideSpin(res)
              if (JSON.parse(res.data).RES == 'OK') {
                this.$Message.success('删除成功')
                this.delUsers = []
                // this.getAllUser()
                // 删除完成刷新
                selectgroup({
                  oid: this.oid,
                  currentPage: this.OrgUserPage
                }).then(res => {
                  this.orgData = res.data.list[0]
                  this.groupUserData = res.data.list[0].pocUserList
                  this.total = res.data.total
                  this.OrgUserPage = res.data.pageNum
                })
              } else {
                // this.$Message.error(JSON.parse(res.data).REASON)
                // alert(JSON.parse(res.data).REASON)
                this.handleFailedDetail(res.data)
              }
              this.$refs.tree.selectAll(false)
            })
          },
          onCancel: () => {
            return
          }
        })
      } else {
        this.$Message.error('请选择用户')
      }
    },
    handleDelGroupUsers(data) {
      const arr = []
      data.map(e => {
        arr.push(e.uid)
      })
      this.delGroupUsersList = arr
    },
    DelGroupUsers() {
      if (this.delGroupUsersList.length) {
        this.$Modal.confirm({
          title: '信息',
          content: '<p>确定删除？</p>',
          onOk: () => {
            this.handleShowSpin()
            delusersgroup({
              gid: this.gid,
              uidList: this.delGroupUsersList
            }).then(res => {
              this.handleHideSpin(res)
              if (JSON.parse(res.data).RES == 'OK') {
                this.$Message.success('删除成功')
              } else {
                // this.$Message.error(JSON.parse(res.data).REASON)
                // alert(JSON.parse(res.data).REASON)
                this.handleFailedDetail(res.data)
              }
              const currentPage = this.groupUserPage
              this.handleGroup(this.gid, currentPage)
              this.delGroupUsersList = []
            })
          },
          onCancel: () => {
            return
          }
        })
      } else {
        this.$Message.error('请选择用户')
      }
    },
    handleAddGroups() {
      this.$refs['addGroupsValidate'].validate(valid => {
        if (valid) {
          const data = this.formItems
          const groupCount = data.groupCount
          const groupLen = data.groupLen
          const name = data.name
          const regPwd = data.regPwd
          const type = data.type
          const key = `${type}`
          const num = data.num
          const level = data.level
          const record = data.record
          const crtMode = data.crtMode
          const res = {
            groupCount,
            groupLen,
            name,
            regPwd,
            level,
            record,
            crtMode,
            regName: num
          }
          res[`${type}`] = num
          this.handleShowSpin()
          addgroups(res).then(res => {
            this.handleHideSpin(res)
            if (JSON.parse(res.data).RES == 'OK') {
              this.$Message.success('添加成功')
            } else {
              // this.$Message.error(JSON.parse(res.data).REASON)
              // alert(JSON.parse(res.data).REASON)
              this.handleFailedDetail(res.data)
            }
            this.getAllGroup()
            this.formItems.groupCount = ''
            this.formItems.groupLen = ''
            this.formItems.name = ''
            this.formItems.regPwd = ''
            this.formItems.type = 'vgcsTel'
            this.formItems.num = ''
            this.formItems.level = '2'
            this.formItems.record = '0'
            this.formItems.crtMode = '0'
            this.modals = false
          })
        }
      })
    },
    handleChange(data) {
      if (data == 'uid') {
        this.handleAddUserGroupForm.idList = `${this.delUsers}`
      } else {
        this.handleAddUserGroupForm.idList = `${this.usersTel}`
      }
    },
    handleAddUserGroup() {
      if (this.usersTel.length && this.delUsers.length) {
        this.handleAddUserGroupModal = true
        if (this.handleAddUserGroupForm.type == 'uid') {
          this.handleAddUserGroupForm.idList = `${this.delUsers}`
        } else {
          this.handleAddUserGroupForm.idList = `${this.usersTel}`
        }
      } else {
        this.$Message.error('请选择用户')
      }
    },
    handleAddUserGroupSubmit() {
      this.handleShowSpin()
      addusersgroup({
        idList: this.handleAddUserGroupForm.idList,
        type: this.handleAddUserGroupForm.type,
        gid: this.handleAddUserGroupForm.gid,
        auth: this.handleAddUserGroupForm.auth
      }).then(res => {
        this.handleHideSpin(res)
        if (JSON.parse(res.data).RES == 'OK') {
          this.$Message.success('添加成功')
          this.handleAddUserGroupModal = false
          this.$refs.tree.selectAll(false)
        } else {
          // this.$Message.error(JSON.parse(res.data).REASON)
          // alert(JSON.parse(res.data).REASON)
          // let str = ``
          // JSON.parse(res.data).forEach(e => {
          //   str += `${e.idOrTel}:${e.rEASON}; `
          // })
          // alert(str)
          this.handleAddUserGroupModal = false
          this.handleFailedDetail(res.data)
          this.$refs.tree.selectAll(false)
        }
      })
    },
    handleShowSpin() {
      this.$Spin.show({
        render: h => {
          return h('div', [
            h('Icon', {
              class: 'demo-spin-icon-load',
              props: {
                type: 'ios-loading',
                size: 26
              }
            }),
            h('div', '数据处理中，请稍后...')
          ])
        }
      })
    },
    handleHideSpin(res) {
      if (res.status == 200) {
        this.$Spin.hide()
      }
    },
    handleFailedDetail(data) {
      this.failedCount = JSON.parse(data)
      this.delFailedData = JSON.parse(data).list
      this.delFailed = true
    }
  },
  mounted() {
    // 获取部门
    this.getAllUser()
  }
}
</script>
<style>
.ivu-tree-title-selected {
  background-color: #308ef0;
  color: white;
}

.ivu-tree-title-selected:hover {
  background-color: #57a3f3;
}
.modalStyle {
  left: 58%;
}

.warn {
  border: 1px solid red;
}

main {
  width: 100%;
  height: 100vh;
  display: flex;
  background-color: #b1c7de;
  padding-top: 4px;
  padding-left: 4px;
}

.firstMenu {
  width: 150px;
  background: #fff;
  margin-right: 5px;
}

.secMenu {
  height: 89vh;
  font-size: 12px;
  background: #b1c7de;
  margin-right: 5px;
  overflow: auto;
  background-color: #fff;
  padding-bottom: 50px;
}

.menu {
  font-size: 12px;
  padding-top: 15px;
}

.menu .item {
  height: 26px;
  line-height: 26px;
  padding-left: 25px;
  cursor: pointer;
}

.handle {
  height: 33px;
  line-height: 33px;
  margin-bottom: 2px;
  display: flex;
  background: #fff;
  padding-left: 8px;
}

.handle img {
  width: 15px;
  height: 15px;
  vertical-align: middle;
}

.handle .item {
  margin-right: 9px;
}

.user {
  background: #fff;
  padding-left: 30px;
  padding-top: 5px;
}

.user .item {
  margin-bottom: 5px;
}

.user .item:hover {
  color: #2d8cf0;
}

.content {
  width: 100%;
  background-color: #fff;
  overflow-y: auto;
  height: 89vh;
}

.content .top {
  height: 24px;
  background: #b1c7de;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
}

.top span {
  line-height: 24px;
  padding-left: 34px;
}

.input {
  color: blue;
}

.flex {
  display: flex;
  justify-content: space-between;
}

.ivu-spin-fix {
  background-color: rgba(255, 255, 255, 0.3);
  z-index: 9998;
}

.ivu-spin-text {
  transform: scale(2.5);
  z-index: 9999;
}
</style>