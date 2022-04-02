<template>
  <div class="dashboard-editor-container">
    <!-- 用户搜索 -->
    <div class="search-box" v-show="showSearch">
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
        <el-form-item label="用户名称" prop="username">
          <el-input
            v-model="queryParams.username"
            placeholder="请输入用户名称"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="loadData"
          />
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input
            v-model="queryParams.mobile"
            placeholder="请输入手机号码"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="loadData"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="loadData">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-box">
      <!-- 操作按钮 -->
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAddUser">添加用户</el-button>
          <el-button type="danger" plain icon="el-icon-delete" size="mini" @click="handleBatchDel"
            >批量取消授权</el-button
          >
          <el-button type="warning" plain icon="el-icon-back" size="mini" @click="handleGoback">返回</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="loadData" :columns="columns"></right-toolbar>
      </el-row>
      <el-table v-loading="loading" :data="dataSource" @select="handleSelectionChange" row-key="rowKey">
        <el-table-column type="selection" width="50" align="center" />
        <!-- <el-table-column
          label="登录名称"
          align="center"
          key="username"
          prop="username"
          v-if="columns[1].visible"
          :show-overflow-tooltip="true"
        /> -->
        <el-table-column label="用户名称" align="center" key="username" prop="username" :show-overflow-tooltip="true" />

        <!-- <el-table-column
          label="邮箱"
          align="center"
          key="email"
          prop="dept.email"
          v-if="columns[3].visible"
          :show-overflow-tooltip="true"
        /> -->
        <el-table-column label="手机号码" align="center" key="mobile" prop="mobile" width="120" />
        <!-- <el-table-column label="状态" align="center" key="status" v-if="columns[5].visible">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-value="0"
              inactive-value="1"
              @change="handleStatusChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column> -->
        <el-table-column label="创建时间" align="center" prop="createTime">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDel(scope.row)">取消授权</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <add-user-modal ref="addUser" @OK="modelOK"></add-user-modal>
  </div>
</template>

<script>
import { ListMixin } from '@/mixins/wtrfyListMixin'
import { userAllocation, getUserListByRoleCode } from '@/api/system/role'
import addUserModal from './addUserModal'
export default {
  mixins: [ListMixin],
  name: '',

  components: { addUserModal },
  props: {},
  data() {
    return {
      url: {
        list: getUserListByRoleCode,
      },
      // 列信息
      columns: [
        // { key: 0, label: `用户编号`, visible: true },
        // { key: 1, label: `登录名称`, visible: true },
        // { key: 2, label: `用户名称`, visible: true },
        // { key: 3, label: `邮箱`, visible: true },
        // { key: 4, label: `手机号码`, visible: true },
        // { key: 5, label: `状态`, visible: true },
        // { key: 6, label: `创建时间`, visible: true },
      ],
      queryParams: { roleCode: this.$route.params.code },
      //  用户表格唯一标识
      rowKey: 'id',
      jsonData: {
        allocationUserIdSet: [],
        cancelUserIdSet: [],
        roleCode: this.$route.params.code,
      },
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    if (!this.queryParams.roleCode) {
      this.handleGoback()
    }
  },
  methods: {
    handleGoback() {
      this.$router.push('/system/role')
    },
    //  重置
    resetQuery() {
      this.queryParams = { code: this.$route.params.roleCode }
      this.loadData(1)
    },
    //  取消授权
    handleDel(row) {
      console.log('%c [ row ]', 'font-size:13px; background:pink; color:#bf2c9f;', row)
      this.jsonData.allocationUserIdSet = []
      this.jsonData.cancelUserIdSet = [row.id]
      this.postAdmin().then(() => {
        this.loadData()
        this.onClearSelected()
      })
    },
    // 批量取消授权
    handleBatchDel() {
      this.jsonData.allocationUserIdSet = []
      this.jsonData.cancelUserIdSet = this.selectedRowKeys
      this.postAdmin().then(() => {
        this.loadData()
        this.onClearSelected()
      })
    },
    //  添加用户
    handleAddUser() {
      this.$refs.addUser.init({ code: this.queryParams.code })
      //  表单重置
      this.onClearSelected()
    },
    postAdmin() {
      return userAllocation(this.jsonData).then((res) => {
        if (res.code === 0) {
          this.$message.success('操作成功')
        } else {
          this.$message.warning(res.msg || '服务器错误')
        }
      })
    },
  },
}
</script>

<style scoped lang="scss"></style>
