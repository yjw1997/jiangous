<template>
  <div class="dashboard-editor-container">
    <!-- 用户搜索 -->
    <div class="search-box" v-show="showSearch">
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-min-width="68px">
        <el-form-item label="用户名称" prop="userName">
          <el-input
            v-model="queryParams.userName"
            clearable
            size="small"
            style="width: 240px"
            placeholder="请输入"
            @keyup.enter.native="loadData(1)"
          />
        </el-form-item>
        <el-form-item label="账号" prop="phone">
          <el-input
            v-model="queryParams.phone"
            clearable
            size="small"
            style="width: 240px"
            placeholder="请输入"
            @keyup.enter.native="loadData(1)"
          />
        </el-form-item>
        <el-form-item label="用户类型" prop="userType">
          <w-dict-select-tag dictCode="userType" v-model="queryParams.userType" />
        </el-form-item>
        <el-form-item label="注册时间" prop="createTime">
          <el-date-picker v-model="queryParams.createTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="loadData(1)">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-box">
      <!-- 操作按钮 -->
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" :disabled="loading" plain icon="el-icon-plus" size="mini" @click="handleAdd"
            >新增用户</el-button
          >
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="loadData"></right-toolbar>
      </el-row>
      <el-table
        v-loading="loading"
        :data="dataSource"
        :row-key="rowKey"
        align="center"
        @selection-change="handleSelectionChange"
      >
        <el-table-column label="序号" prop="accountId" min-width="60" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="用户名称" prop="userName" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="用户昵称" prop="nickName" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="账号" prop="phone" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="用户类型" prop="userType" min-width="100" :show-overflow-tooltip="true">
          <template slot-scope="{ row }">
            <el-tag v-if="row.userType == 0">普通用户</el-tag>
            <el-tag v-if="row.userType == 1">商城卖家</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="注册日期" prop="createTime" min-width="120" :show-overflow-tooltip="true">
          <template slot-scope="{ row }">
            {{ parseTime(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          fixed="right"
          min-width="180"
        >
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-document" @click="handleDetail(scope.row)">查看</el-button>
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleReset(scope.row)">重置密码</el-button>
            <!-- <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row.id, '删除', 'id')"
              >删除</el-button
            > -->
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        :ipagination="ipagination"
        @pagination="getAppUserPageList"
      />
    </div>
    <resgister-modal ref="modalForm" @OK="modelOK"></resgister-modal>
    <detail ref="modalDetails"></detail>
  </div>
</template>

<script>
import { ListMixin } from '@/mixins/wtrfyListMixin'
import detail from './detail.vue'
import { getAppUserPageList, deleteAppUser, resetAppUserPwd, getAppUserDetail } from '@/api/user'
export default {
  name: '',
  mixins: [ListMixin],
  components: { detail },
  props: {},
  data() {
    return {
      url: {
        list: getAppUserPageList,
        delete: deleteAppUser,
      },
      rowKey: 'id',
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    getAppUserPageList,
    //  重置密码
    handleReset(row) {
      this.$confirm('请确认是否重置密码？密码重置原密码将清除重置后密码为admin666', '重置密码', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.resetPwd(row)
        })
        .catch(() => {})
    },
    resetPwd(row) {
      resetAppUserPwd(row).then((res) => {
        console.log('%c [ res ]', 'font-size:13px; background:pink; color:#bf2c9f;', res)
        const { code, message } = res
        if (code === 0) {
          this.$message.success(message || '操作成功')
        }
      })
    },
    //  详情
    handleDetail: function(record) {
      getAppUserDetail({ appUserId: record.id }).then((res) => {
        this.$refs.modalDetails.edit(res.data)
        this.$refs.modalDetails.title = '详情'
        this.$refs.modalDetails.disableSubmit = true
      })
    },
  },
}
</script>

<style scoped lang="scss"></style>
