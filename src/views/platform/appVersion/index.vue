<template>
  <div class="dashboard-editor-container">
    <div class="search-box" v-show="showSearch">
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-min-width="68px">
        <el-row :gutter="20">
          <el-form-item label="名称" prop="name">
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
        <el-table-column prop="name" label="名称" :show-overflow-tooltip="true" min-width="120" />
        <el-table-column prop="platform" label="APP" :show-overflow-tooltip="true" min-width="100">
          <template slot-scope="{ row }">
            <span v-if="row.platform == 1">商家端</span>
            <span v-if="row.platform == 0">用户端</span>
          </template>
        </el-table-column>
        <el-table-column prop="version" label="版本号" :show-overflow-tooltip="true" min-width="100" />
        <el-table-column prop="downloadUrl" label="下载链接" :show-overflow-tooltip="true" min-width="150" />
        <el-table-column prop="forceFlag" label="强制更新" :show-overflow-tooltip="true" min-width="80" align="center">
          <template slot-scope="{ row }">
            <span v-if="row.forceFlag === true">是</span>
            <span v-if="row.forceFlag === false">否</span>
          </template>
        </el-table-column>
        <el-table-column prop="systems" label="系统" :show-overflow-tooltip="true" min-width="80">
          <template slot-scope="{ row }">
            <span v-if="row.systems == 0">安卓</span>
            <span v-if="row.systems == 1">IOS</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="时间" :show-overflow-tooltip="true" min-width="150" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="120">
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
import { getPageListAppVersion, deleteAppVersion } from '@/api/platform'
import rewriteModal from './rewriteModal.vue'
export default {
  mixins: [ListMixin],
  name: 'specification',
  components: { rewriteModal },
  props: {},
  data() {
    return {
      url: {
        list: getPageListAppVersion,
        delete: deleteAppVersion,
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
  methods: {},
}
</script>

<style scoped lang="scss"></style>
