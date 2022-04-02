<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="1000px" destroy-on-close :modal="false">
    <div class="dashboard-editor-container">
      <div class="content-box">
        <el-table
          v-loading="loading"
          :data="dataSource"
          highlight-current-row
          row-key="rowKey"
          @current-change="handleCurrentChange"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" v-if="multiplate"> </el-table-column>
          <el-table-column label="序号" prop="index" min-width="50" align="center">
            <template slot-scope="scope">
              <span>{{ (ipagination.current - 1) * ipagination.pageSize + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="商品名称" prop="goodsName" min-width="100" align="center" />
          <el-table-column label="商品库存" prop="saleStock" min-width="100" align="center" />
          <el-table-column label="已参与时间段" prop="joinTimes" min-width="100" align="center" />
        </el-table>
        <pagination
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          :ipagination="ipagination"
          @pagination="loadData"
        />
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close()">取 消</el-button>
      <el-button type="primary" @click="handleSubmit()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { ListMixin } from '@/mixins/wtrfyListMixin'
import { getGoodsList } from '@/api/api'
export default {
  name: '',
  mixins: [ListMixin],
  components: {},
  props: {
    keyProp: { type: String },
    value: { type: [String, Object] },
    multiplate: { type: Boolean, default: false },
    query: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },

  data() {
    return {
      url: {
        list: getGoodsList,
      },
      disableMixinCreated: true,
      title: '选择商品',
      dialogVisible: false,
      //  用户表格唯一标识
      rowKey: 'id',
      currentRow: {},
    }
  },
  computed: {},
  watch: {
    dialogVisible(value) {
      if (value) {
        Object.assign(this.queryParams, this.query)
        this.loadData(1)
      }
    },
  },

  created() {},
  mounted() {},
  methods: {
    init() {
      this.dialogVisible = true
    },
    handleCurrentChange(currentRow) {
      this.currentRow = currentRow
    },
    handleSubmit() {
      if (this.multiplate) {
        if (this.selectionRows.length === 0) {
          this.$message.warning('请选择一条记录')
          return
        }
        this.$emit('change', this.selectionRows)
        this.close()
      } else {
        if (Object.keys(this.currentRow).length === 0) {
          this.$message.warning('请选择一条记录')
          return
        }
        this.$emit('change', this.currentRow)
        this.close()
      }
    },
    close() {
      //  表单重置
      this.dialogVisible = false
    },
  },
}
</script>

<style scoped lang="scss">
.dialog-footer {
  text-align: center;
}
</style>
