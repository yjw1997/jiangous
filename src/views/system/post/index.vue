<template>
  <div class="dashboard-editor-container">
    <!-- 用户搜索 -->
    <div class="search-box" v-show="showSearch">
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
        <el-form-item label="岗位编码" prop="postCode">
          <el-input
            v-model="queryParams.postCode"
            placeholder="请输入岗位编码"
            clearable
            size="small"
            @keyup.enter.native="loadData"
          />
        </el-form-item>
        <el-form-item label="岗位名称" prop="postName">
          <el-input
            v-model="queryParams.postName"
            placeholder="请输入岗位名称"
            clearable
            size="small"
            @keyup.enter.native="loadData"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="岗位状态" clearable size="small">
            <el-option
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
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
          <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click.prevent="handleEdit"
            >修改</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="batchDel"
            >删除</el-button
          >
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="loadData"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="dataSource" @select="handleSelectionChange" :row-key="rowKey">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="岗位编号" align="center" prop="postId" />
        <el-table-column label="岗位编码" align="center" prop="postCode" />
        <el-table-column label="岗位名称" align="center" prop="postName" />
        <el-table-column label="岗位排序" align="center" prop="postSort" />
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="{ row }">
            <el-tag :type="row.status === '0' ? 'success' : 'danger'">{{
              row.status === '0' ? '正常' : '停用'
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row.postId, 'postId')"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        :ipagination="ipagination"
        @pagination="getPostList"
      />
    </div>
    <rewrite-modal ref="modalForm" @OK="modelOK"></rewrite-modal>
  </div>
</template>

<script>
import { ListMixin } from '@/mixins/wtrfyListMixin'
import { getPostList, removePost } from '@/api/system/post'
import rewriteModal from './rewriteModal'

export default {
  name: '',
  mixins: [ListMixin],
  components: { rewriteModal },
  props: {},
  data() {
    return {
      url: {
        list: getPostList,
        delete: removePost,
        deleteBatch: removePost,
      },
      rowKey: 'postId',
      // 状态数据字典
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
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: { getPostList },
}
</script>

<style scoped lang="scss"></style>
