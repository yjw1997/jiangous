<template>
  <div class="dashboard-editor-container">
    <div class="content-box">
      <!-- 操作按钮 -->
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" :disabled="loading"
            >新增</el-button
          >
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" :showSearchButton="false" @queryTable="loadData"></right-toolbar>
      </el-row>
      <el-table
        v-loading="loading"
        :data="dataList"
        :row-key="rowKey"
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        ref="tree"
      >
        <el-table-column prop="classifyName" label="类目名称" :show-overflow-tooltip="true" min-wihit="160" />
        <el-table-column label="是否启用" prop="status" min-width="80" :show-overflow-tooltip="true">
          <template slot-scope="{ row }">
            <el-switch
              v-model="row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChangeNumber(row, 'status', 'status', goodsClassifyUpdateClassifyStatus)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" :show-overflow-tooltip="true" min-width="160">
          <template slot-scope="{ row }">
            {{ parseTime(row.createTime * 1000) }}
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-top"
              @click="handleUp(scope.row)"
              :disabled="scope.$index === 0"
              >上移</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-bottom"
              @click="handleDown(scope.row)"
              :disabled="scope.$index === ipagination.total - 2"
              >下移</el-button
            >
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">设置</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <rewrite-modal ref="modalForm" @OK="modelOK" :dataList="dataListLevelTwo" :dataSource="dataSource"></rewrite-modal>
  </div>
</template>

<script>
import { ListMixin } from '@/mixins/wtrfyListMixin'
import {
  goodsClassifyQueryGoodsClassify,
  goodsClassifyUpdateClassifyStatus,
  updateSortGoodsClassify,
} from '@/api/goods'
import rewriteModal from './rewriteModal.vue'
export default {
  mixins: [ListMixin],
  name: '',

  components: { rewriteModal },
  props: {},
  data() {
    return {
      url: {
        list: goodsClassifyQueryGoodsClassify,
      },

      rowKey: 'id',
      treeData: {
        code: 'classifyCode',
        parentCode: 'parentCode',
      },
      dataListLevelTwo: [],
    }
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    goodsClassifyUpdateClassifyStatus,
    loadData(arg) {
      if (!this.url || !this.url.list) {
        this.$message.error('请设置url.list属性!')
        return
      }
      let getAction = this.url.list
      // 加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1
      }
      var params = this.getQueryParams() // 查询条件
      this.loading = true
      return getAction(params).then((res) => {
        if (res.code === 0) {
          this.dataSource = res.data.records || res.data
          this.dataSource.sort((a, b) => {
            return a.sort - b.sort
          })
          let obj = this.cloneDeep(this.dataSource)
          this.dataList = this.handleTree(this.dataSource, this.treeData.code, this.treeData.parentCode)
          let aa = obj.filter((item) => item.level !== 3)
          this.dataListLevelTwo = this.handleTree(aa, this.treeData.code, this.treeData.parentCode)
          this.ipagination.total = res.total || res.data.total || this.dataSource.length + 1
        }
        if (res.code !== 0) {
          this.$message.warning(res.message)
        }
        this.loading = false
      })
    },

    //  编辑
    handleEdit: function(record) {
      delete record.children
      this.$refs.modalForm.title = '编辑'
      this.$refs.modalForm.disableSubmit = false
      this.$refs.modalForm.edit(record)
    },
    //  上移
    handleUp(row) {
      row.type = 0
      updateSortGoodsClassify(row).then((res) => {
        const { code, message } = res
        if (code === 0) {
          this.$message.success(message || '操作成功')

          this.loadData()
        }
      })
    },
    // 下移
    handleDown(row) {
      row.type = 1
      updateSortGoodsClassify(row).then((res) => {
        const { code, message } = res
        if (code === 0) {
          this.$message.success(message || '操作成功')

          this.loadData()
        }
      })
    },
  },
}
</script>

<style scoped lang="scss"></style>
