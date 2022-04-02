<template>
  <!-- 导入表 -->
  <el-dialog title="导入表" :visible.sync="visible" width="800px" top="5vh" append-to-body>
    <el-form :model="queryParams" ref="queryForm" :inline="true">
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
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="loadData">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-table
        @row-click="clickRow"
        ref="table"
        :data="dataSource"
        @selection-change="handleSelectionChange"
        height="350px"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="tableName" label="表名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="tableComment" label="表描述" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间"></el-table-column>
      </el-table>
      <!-- <pagination
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        :ipagination="ipagination"
        @pagination="loadData"
      /> -->
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleImportTable">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { listDbTable, importTable } from '@/api/tool/gen'
import { ListMixin } from '@/mixins/wtrfyListMixin'
export default {
  mixins: [ListMixin],
  data() {
    return {
      // 遮罩层
      visible: false,
      url: {
        list: listDbTable,
      },
      rowKey: 'tableName',
    }
  },
  methods: {
    // 显示弹框
    show() {
      this.loadData(1)
      this.visible = true
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row)
    },
    /** 导入按钮操作 */
    handleImportTable() {
      console.log('%c [ this.selectionRows ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.selectedRowKeys)
      importTable({ tables: this.selectedRowKeys.join(',') }).then((res) => {
        this.$message.success(res.message || '操作成功')
        if (res.code === 0) {
          this.visible = false
          this.$emit('OK')
        }
      })
    },
  },
}
</script>
