<template>
  <div class="dashboard-editor-container">
    <div class="search-box" v-show="showSearch">
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-min-width="68px">
        <el-form-item label="表名称" prop="tableName">
          <el-input
            v-model="queryParams.tableName"
            placeholder="请输入表名称"
            clearable
            size="small"
            @keyup.enter.native="loadData"
          />
        </el-form-item>
        <el-form-item label="表描述" prop="tableComment">
          <el-input
            v-model="queryParams.tableComment"
            placeholder="请输入表描述"
            clearable
            size="small"
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
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-box">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" plain icon="el-icon-download" size="mini" @click="handleBatchGenTable()"
            >生成</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button type="info" plain icon="el-icon-upload" size="mini" @click="openImportTable">导入</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleEditTable()"
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

      <el-table v-loading="loading" :data="dataSource" @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" min-width="55"></el-table-column>
        <el-table-column label="序号" type="index" min-width="50" align="center">
          <template slot-scope="scope">
            <span>{{ (ipagination.current - 1) * ipagination.pageSize + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="表名称" align="center" prop="tableName" :show-overflow-tooltip="true" min-width="120" />

        <el-table-column label="表名称" align="center" prop="tableName" :show-overflow-tooltip="true" min-width="120" />
        <el-table-column
          label="表描述"
          align="center"
          prop="tableComment"
          :show-overflow-tooltip="true"
          min-width="120"
        />
        <el-table-column label="实体" align="center" prop="className" :show-overflow-tooltip="true" min-width="120" />
        <el-table-column label="创建时间" align="center" prop="createTime" min-width="160" />
        <el-table-column label="更新时间" align="center" prop="updateTime" min-width="160" />
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          fixed="right"
          min-width="250"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" icon="el-icon-view" @click="handlePreview(scope.row)">预览</el-button>
            <el-button type="text" size="small" icon="el-icon-edit" @click="handleEditTable(scope.row)">编辑</el-button>
            <el-button
              type="text"
              size="small"
              icon="el-icon-delete"
              @click="handleDelete(scope.row.tableId, '删除', 'ids')"
              >删除</el-button
            >
            <el-button type="text" size="small" icon="el-icon-download" @click="handleGenTable(scope.row)"
              >生成代码</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        :ipagination="ipagination"
        @pagination="loadData"
      />
      <!-- 预览界面 -->
      <el-dialog :title="preview.title" :visible.sync="preview.open" min-width="80%" top="5vh" append-to-body>
        <el-tabs v-model="preview.activeName">
          <el-tab-pane
            v-for="(value, key) in preview.data"
            :label="key.substring(key.lastIndexOf('/') + 1, key.indexOf('.vm'))"
            :name="key.substring(key.lastIndexOf('/') + 1, key.indexOf('.vm'))"
            :key="key"
          >
            <pre><code class="hljs" v-html="highlightedCode(value, key)"></code></pre>
          </el-tab-pane>
        </el-tabs>
      </el-dialog>
      <import-table ref="import" @OK="modelOK" />
    </div>
  </div>
</template>

<script>
import { ListMixin } from '@/mixins/wtrfyListMixin'
import { listTable, previewTable, delTable, genCode, batchGenCode } from '@/api/tool/gen'
import importTable from './importTable'
import { resolveBlob } from '@/utils/zipdownload'
import hljs from 'highlight.js/lib/highlight'
import 'highlight.js/styles/github-gist.css'
hljs.registerLanguage('java', require('highlight.js/lib/languages/java'))
hljs.registerLanguage('xml', require('highlight.js/lib/languages/xml'))
hljs.registerLanguage('html', require('highlight.js/lib/languages/xml'))
hljs.registerLanguage('vue', require('highlight.js/lib/languages/xml'))
hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'))
hljs.registerLanguage('sql', require('highlight.js/lib/languages/sql'))
export default {
  mixins: [ListMixin],
  name: 'Gen',
  components: { importTable },
  data() {
    return {
      url: {
        list: listTable,
        delete: delTable,
        deleteBatch: delTable,
      },
      // 唯一标识符
      uniqueId: '',
      // 日期范围
      dateRange: '',
      rowKey: 'tableId',
      // 预览参数
      preview: {
        open: false,
        title: '代码预览',
        data: {},
        activeName: 'domain.java',
      },
    }
  },
  created() {},
  activated() {
    const time = this.$route.query.t
    if (time != null && time != this.uniqueId) {
      this.uniqueId = time
      this.resetQuery()
    }
  },
  methods: {
    /** 修改按钮操作 */
    handleEditTable(row) {
      const data = row || this.selectionRows[0]
      console.log('%c [ data ]', 'font-size:13px; background:pink; color:#bf2c9f;', data)
      this.$router.push({ path: '/gen/edit/' + data.tableId })
      localStorage.setItem('genDetail', JSON.stringify(data))
    },
    /** 生成代码操作 */
    handleGenTable(row) {
      const selectionRows = row.tableName
      if (selectionRows == '') {
        this.$message.error('请选择要生成的数据')
        return
      }
      let obj = {
        tableName: selectionRows,
        type: '1',
      }
      genCode(obj).then((res) => {
        console.log('%c [ res ]', 'font-size:13px; background:pink; color:#bf2c9f;', res)
        resolveBlob(res)
      })
    },
    /** 批量生成代码操作 */
    handleBatchGenTable() {
      const selectionRows = this.selectionRows.map((item) => {
        return item.tableName
      })

      if (selectionRows == '') {
        this.$message.error('请选择要生成的数据')
        return
      }
      let obj = {
        tables: selectionRows.join(),
        type: '1',
      }
      console.log('%c [ obj ]', 'font-size:13px; background:pink; color:#bf2c9f;', obj)
      batchGenCode(obj).then((res) => {
        resolveBlob(res)
      })
    },
    /** 打开导入表弹窗 */
    openImportTable() {
      this.$refs.import.show()
    },
    /** 预览按钮 */
    handlePreview(row) {
      previewTable(row.tableId).then((response) => {
        console.log('%c [ response ]', 'font-size:13px; background:pink; color:#bf2c9f;', response)
        this.preview.data = response.data
        this.preview.open = true
      })
    },
    /** 高亮显示 */
    highlightedCode(code, key) {
      const vmName = key.substring(key.lastIndexOf('/') + 1, key.indexOf('.vm'))
      var language = vmName.substring(vmName.indexOf('.') + 1, vmName.length)
      const result = hljs.highlight(language, code || '', true)
      return result.value || '&nbsp;'
    },
  },
}
</script>
