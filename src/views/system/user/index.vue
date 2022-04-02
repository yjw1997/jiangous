<template>
  <!--用户数据-->

  <div class=" right-user  dashboard-editor-container">
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
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="用户状态" clearable size="small" style="width: 240px">
            <el-option
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
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
        <!-- <el-col :span="1.5">
          <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="batchDel"
            >删除</el-button
          >
        </el-col> -->

        <!-- <el-col :span="1.5">
            <el-button type="info" plain icon="el-icon-upload2" size="mini" @click="handleImport">导入</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              :loading="exportLoading"
              @click="handleExport"
              >导出</el-button
            >
          </el-col> -->
        <right-toolbar :showSearch.sync="showSearch" @queryTable="loadData" :columns="columns"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="dataSource" @select="handleSelectionChange" row-key="rowKey">
        <!-- <el-table-column type="selection" width="50" align="center" /> -->
        <!-- <el-table-column label="用户编号" align="center" key="userId" prop="userId" v-if="columns[0].visible" />
        <el-table-column
          label="登录名称"
          align="center"
          key="username"
          prop="username"
          v-if="columns[1].visible"
          :show-overflow-tooltip="true"
        /> -->
        <el-table-column label="用户名称" align="center" prop="username" :show-overflow-tooltip="true" />
        <!-- <el-table-column
          label="用户昵称"
          align="center"
          key="nickName"
          prop="nickName"
          v-if="columns[3].visible"
          :show-overflow-tooltip="true"
        /> -->
        <!-- <el-table-column
          label="部门"
          align="center"
          key="deptName"
          prop="dept.deptName"
          v-if="columns[4].visible"
          :show-overflow-tooltip="true"
        /> -->
        <el-table-column label="手机号码" align="center" key="mobile" prop="mobile" width="120" />
        <!-- <el-table-column label="状态" align="center" key="status" v-if="columns[6].visible">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-value="0"
              inactive-value="1"
              @change="handleStatusChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column> -->
        <el-table-column label="创建时间" align="center" prop="createTime" width="160">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
            <el-button
              v-if="scope.row.userId !== 1"
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row.id)"
              >删除</el-button
            >
            <!-- <el-button size="mini" type="text" icon="el-icon-key" @click="handleResetPwd(scope.row)">重置</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        :ipagination="ipagination"
        @pagination="loadData"
      />
    </div>
    <!-- <resetPwdModal ref="resetPwd" @OK="modelOK()"></resetPwdModal> -->
    <rewrite-modal ref="modalForm" @OK="modelOK()"></rewrite-modal>
  </div>
</template>

<script>
import { ListMixin } from '@/mixins/wtrfyListMixin'
import { getUserList, removeUser } from '@/api/system/user'
// import resetPwdModal from './resetPwdModal.vue'
import rewriteModal from './rewriteModal.vue'
export default {
  name: '',
  mixins: [ListMixin],
  components: { rewriteModal },
  props: {},
  data() {
    return {
      url: {
        list: getUserList,
        deleteBatch: removeUser,
        delete: removeUser,
      },
      expandAll: true,
      deptOptions: [],
      defaultProps: {
        children: 'children',
        label: 'deptName',
      },
      treeLoading: false,
      showTree: false,
      dateRange: [],
      statusOptions: [
        {
          dictLabel: '所有',
          dictValue: undefined,
        },
        {
          dictLabel: '正常',
          dictValue: '0',
        },
        {
          dictLabel: '停用',
          dictValue: '1',
        },
      ],
      // 列信息
      columns: [
        // { key: 0, label: `用户编号`, visible: true },
        // { key: 1, label: `登录名称`, visible: true },
        // { key: 2, label: `用户名称`, visible: true },
        // { key: 3, label: `用户昵称`, visible: true },
        // { key: 4, label: `部门`, visible: true },
        // { key: 5, label: `手机号码`, visible: true },
        // { key: 6, label: `状态`, visible: true },
        // { key: 7, label: `创建时间`, visible: true },
      ],
      //  用户表格唯一标识
      rowKey: 'userId',
    }
  },
  computed: {},
  watch: {
    expandAll(val) {
      this.setAllExpand(val)
    },
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
  mounted() {
    // this.getTree()
  },
  methods: {
    getUserList,
    //  获取部门数据
    // getTree() {
    //   this.deptOptions = []
    //   this.treeLoading = true
    //   getTreeData().then((res) => {
    //     setTimeout(() => {
    //       this.treeLoading = false
    //       this.expandAll = true
    //       const { data } = res
    //       this.deptOptions = data
    //     }, 1000)
    //   })
    // },
    // // 点击部门添加条件
    // handleNodeClick(data) {
    //   this.queryParams.deptId = data.deptId
    //   this.loadData()
    // },
    // //  展开折叠
    // setAllExpand(state) {
    //   var nodes = this.$refs.tree.store.nodesMap
    //   for (var i in nodes) {
    //     nodes[i].expanded = state
    //   }
    // },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.$refs.resetPwd.init(row)
    },
    // handlePushDept() {
    //   this.$router.push('/system/dept')
    // },
  },
}
</script>

<style scoped lang="scss">
.box {
  width: 100%;
  height: 100%;
  display: flex;
  .left-dep {
    width: 200px;
    transition: width 0.28s;
    background-color: #fff;
    padding-top: 10px;
    position: relative;
    .head-container {
      display: flex;
      justify-content: space-between;
      padding: 10px 20px;
      .tooltip {
        i {
          margin-left: 8px;
        }
      }
      border-bottom: 1px solid #eee;
    }
    .el-tree {
      padding: 0 10px;
    }
    .button {
      position: absolute;
      right: -16px;
      top: 200px;
      margin-top: 20px;
      z-index: 3;
      height: 40px;
      background-color: #fff;
      line-height: 40px;
      &:hover {
        background-color: rgba(0, 0, 0, 0.025);
      }
    }
  }
  .right-user {
    // width: calc(100% - 220px);
  }
}

.hasTree {
  .left-dep {
    width: 0;
    transition: width 0.28s;
  }
  // .right-user {
  //   width: 100%;
  // }
}
</style>
