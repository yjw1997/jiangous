<template>
  <div class="dashboard-editor-container">
    <!-- 用户搜索 -->
    <div class="search-box" v-show="showSearch">
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
        <el-form-item label="角色名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入角色名称"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="loadData"
          />
        </el-form-item>
        <el-form-item label="权限字符" prop="code">
          <el-input
            v-model="queryParams.code"
            placeholder="请输入权限字符"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="loadData"
          />
        </el-form-item>
        <!-- <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="角色状态" clearable size="small" style="width: 240px">
            <el-option
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="dateRange"
            size="small"
            style="width: 240px"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
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
          <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <!-- <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click.prevent="handleEdit"
            >修改</el-button
          > -->
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="batchDel('id')"
            >删除</el-button
          >
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="loadData"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="dataSource" @select="handleSelectionChange" :row-key="rowKey">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="角色编号" prop="code" width="120" />
        <el-table-column label="角色名称" prop="name" :show-overflow-tooltip="true" width="150" />
        <!-- <el-table-column label="权限字符" prop="code" :show-overflow-tooltip="true" width="150" /> -->
        <!-- <el-table-column label="显示顺序" prop="roleSort" width="100" /> -->
        <!-- <el-table-column label="状态" align="center" width="100">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-value="0"
              inactive-value="1"
              @change="handleStatusChange(scope.row, 'status', 'status', writeRole)"
            ></el-switch>
          </template>
        </el-table-column> -->
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(new Date(scope.row.createTime)) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
            <el-button size="mini" type="text" icon="el-icon-circle-check" @click="handleDataScope(scope.row)"
              >数据权限</el-button
            >
            <el-button size="mini" type="text" icon="el-icon-user" @click="handlePushDistribution(scope.row)"
              >分配用户</el-button
            >
            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row.id, 'id')"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        :ipagination="ipagination"
        @pagination="getRoleList"
      />
    </div>
    <rewrite-modal ref="modalForm" @OK="modelOK"></rewrite-modal>
    <data-scope ref="dataPermission" @OK="modelOK"></data-scope>
  </div>
</template>

<script>
import { ListMixin } from '@/mixins/wtrfyListMixin'
import { getRoleList, removeRole, writeRole } from '@/api/system/role'
import rewriteModal from './rewriteModal'
import dataScope from './dataScope'

export default {
  name: '',
  mixins: [ListMixin],
  components: { rewriteModal, dataScope },
  props: {},
  data() {
    return {
      url: {
        list: getRoleList,
        delete: removeRole,
        deleteBatch: removeRole,
      },
      rowKey: 'id',
      dateRange: [],

      // 状态数据字典
      // statusOptions: [
      //   {
      //     dictLabel: '所有',
      //     dictValue: undefined,
      //   },
      //   {
      //     dictLabel: '正常',
      //     dictValue: '0',
      //   },
      //   {
      //     dictLabel: '停用',
      //     dictValue: '1',
      //   },
      // ],
    }
  },
  computed: {},
  watch: {
    dateRange(val) {
      if (!val || val === null) {
        this.queryParams.beginTime = ''
        this.queryParams.endTime = ''
        return
      }
      this.queryParams.beginTime = val[0]
      this.queryParams.endTime = val[1]
    },
  },
  created() {},
  mounted() {},
  methods: {
    getRoleList,
    writeRole,
    /** 分配数据权限操作 */
    handleDataScope(row) {
      row.deptIds = '1,2,3,4,5,6'
      row.dataScope = '2'
      this.$refs.dataPermission.title = '修改数据权限'
      this.$refs.dataPermission.init(row)
    },
    //  分配用户
    handlePushDistribution(row) {
      this.$router.push('/role/' + row.code)
    },
  },
}
</script>

<style scoped lang="scss"></style>
