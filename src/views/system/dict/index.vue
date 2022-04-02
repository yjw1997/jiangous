<template>
  <div class="dashboard-editor-container">
    <!-- 用户搜索 -->
    <div class="search-box" v-show="showSearch">
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="字典名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入字典名称"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="loadData"
          />
        </el-form-item>
        <el-form-item label="字典类型" prop="value">
          <el-input
            v-model="queryParams.value"
            placeholder="请输入字典类型"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="loadData"
          />
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
        <right-toolbar :showSearch.sync="showSearch" @queryTable="loadData"></right-toolbar>
      </el-row>
      <el-table
        v-loading="loading"
        :data="dataList"
        default-expand-all
        @select="handleSelectionChange"
        ref="table"
        :row-key="rowKey"
        al
      >
        <el-table-column label="字典主键" align="left" prop="code" />
        <el-table-column label="字典名称" align="center" prop="name" :show-overflow-tooltip="true" />
        <el-table-column label="字典值" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.value }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否隐藏" align="center" prop="hidden">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.hidden"
              :active-value="true"
              :inactive-value="false"
              @change="handleStatusChange(scope.row, 'hidden', 'hidden', writeDict)"
            ></el-switch>
          </template>
        </el-table-column>
        <!-- <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" /> -->
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope" v-if="scope.row.parentId !== '0'">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row.id, 'id')"
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
import { getDictList, removeDict, writeDict } from '@/api/system/dict'
import rewriteModal from './rewriteModal.vue'
export default {
  mixins: [ListMixin],
  name: '',
  components: { rewriteModal },
  props: {},
  data() {
    return {
      url: {
        list: getDictList,
        delete: removeDict,
      },
      dateRange: [],
      rowKey: 'id',
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
    writeDict,
  },
}
</script>

<style scoped lang="scss"></style>
