<template>
  <div class="dashboard-editor-container">
    <div class="search-box" v-show="showSearch">
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-min-width="68px">
        <el-row :gutter="20">
          <el-form-item label="规格名称" prop="name">
            <el-input
              v-model="queryParams.name"
              clearable
              size="small"
              style="width: 240px"
              placeholder="请输入"
              @keyup.enter.native="loadData(1)"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="loadData(1)">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery()">重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="content-box">
      <!-- 操作按钮 -->
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" :disabled="loading"
            >新增</el-button
          >
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="loadData"></right-toolbar>
      </el-row>
      <el-table v-loading="loading" :data="dataSource" :row-key="rowKey" default-expand-all ref="tree">
        <el-table-column prop="id" label="ID" :show-overflow-tooltip="true" min-width="80" />

        <el-table-column prop="name" label="规格名称" :show-overflow-tooltip="true" min-width="120" />
        <el-table-column prop="specificationValues" label="规格值" :show-overflow-tooltip="true" min-width="160" />
        <el-table-column label="是否启用" prop="status" min-width="80" :show-overflow-tooltip="true">
          <template slot-scope="{ row }">
            <el-tag v-if="row.status === 0">否</el-tag>
            <el-tag v-if="row.status === 1">是</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" icon="el-icon-close" @click="handleDelete(scope.row.id)">删除</el-button>
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
    <rewrite-modal ref="modalForm" @OK="modelOK"></rewrite-modal>
  </div>
</template>

<script>
import { ListMixin } from '@/mixins/wtrfyListMixin'
import { querySpecificationPageList, deleteSpecification, updateSpecification } from '@/api/goods'
import rewriteModal from './rewriteModal.vue'
export default {
  mixins: [ListMixin],
  name: 'specification',
  components: { rewriteModal },
  props: {},
  data() {
    return {
      url: {
        list: querySpecificationPageList,
        delete: deleteSpecification,
      },

      rowKey: 'id',
      treeData: {
        code: 'classifyCode',
        parentCode: 'parentCode',
      },
    }
  },
  computed: {},
  watch: {},
  created() {},
  methods: { updateSpecification },
}
</script>

<style scoped lang="scss"></style>
