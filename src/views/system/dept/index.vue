<template>
  <div class="dashboard-editor-container">
    <!-- 用户搜索 -->
    <div class="search-box" v-show="showSearch">
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
        <el-form-item label="部门名称" prop="deptName">
          <el-input
            v-model="queryParams.deptName"
            placeholder="请输入部门名称"
            clearable
            size="small"
            @keyup.enter.native="loadData"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="部门状态" clearable size="small">
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
        <right-toolbar :showSearch.sync="showSearch" @queryTable="loadData"></right-toolbar>
      </el-row>
      <el-table
        v-loading="loading"
        :data="dataSource"
        :row-key="rowKey"
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        ref="tree"
      >
        <el-table-column prop="deptName" label="部门名称" width="260"></el-table-column>
        <el-table-column prop="orderNum" label="排序" width="200"></el-table-column>
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
          <template slot-scope="scope" v-if="scope.row.parentId !== '0'">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row.deptId, 'deptId')"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <rewrite-modal ref="modalForm" @OK="modelOK"></rewrite-modal>
  </div>
</template>

<script>
import { ListMixin } from '@/mixins/wtrfyListMixin'
import { getTreeData, removeDept } from '@/api/system/dept'
import rewriteModal from './rewriteModal.vue'
export default {
  mixins: [ListMixin],
  name: '',

  components: { rewriteModal },
  props: {},
  data() {
    return {
      url: {
        list: getTreeData,
        delete: removeDept,
      },
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
      rowKey: 'deptId',
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style scoped lang="scss"></style>
