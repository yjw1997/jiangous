<template>
  <div class="dashboard-editor-container">
    <!-- 用户搜索 -->
    <div class="search-box" v-show="showSearch">
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-min-width="68px">
        <el-form-item label="词汇名称" prop="keyWord">
          <el-input
            v-model="queryParams.keyWord"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="loadData(1)"
          />
        </el-form-item>
        <el-form-item label="词汇等级" prop="level">
          <w-dict-select-tag v-model="queryParams.level" dictCode="wordLevel"></w-dict-select-tag>
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
            >新增词汇</el-button
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
        <el-table-column type="selection" width="55" />
        <el-table-column label="编号" prop="id" min-width="60" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="敏感词" prop="keyWord" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="词汇等级" prop="level" min-width="100" :show-overflow-tooltip="true">
          <template slot-scope="{ row }">
            <el-tag v-if="row.level == 1">可疑词汇</el-tag>
            <el-tag v-if="row.level == 2">危险词汇</el-tag>
            <el-tag v-if="row.level == 3">禁用词汇</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          fixed="right"
          min-width="120"
        >
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row.id, '删除', 'id')"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        :ipagination="ipagination"
        @pagination="getSensitiveWordList"
      />
    </div>
    <rewrite-modal ref="modalForm" @OK="modelOK"></rewrite-modal>
  </div>
</template>

<script>
import { ListMixin } from '@/mixins/wtrfyListMixin'
import rewriteModal from './rewriteModal.vue'
import { getSensitiveWordList, getSensitiveWordDetele } from '@/api/platform'
export default {
  name: '',
  mixins: [ListMixin],
  components: { rewriteModal },
  props: {},
  data() {
    return {
      url: {
        list: getSensitiveWordList,
        delete: getSensitiveWordDetele,
      },
      rowKey: 'id',
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    getSensitiveWordList,
  },
}
</script>

<style scoped lang="scss"></style>
