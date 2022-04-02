<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="1000px" destroy-on-close :modal="false">
    <div class="dashboard-editor-container">
      <div class="search-box" v-show="showSearch">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-min-width="68px">
          <el-row :gutter="20">
            <el-form-item label="商品名称" prop="goodsName">
              <el-input
                v-model="queryParams.goodsName"
                clearable
                size="small"
                style="width: 240px"
                placeholder="请输入"
                @keyup.enter.native="loadData(1)"
              />
            </el-form-item>
            <el-form-item label="商户名称" prop="shopName">
              <el-input
                v-model="queryParams.shopName"
                clearable
                size="small"
                style="width: 240px"
                placeholder="请输入"
                @keyup.enter.native="loadData(1)"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="loadData(1)">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery({ searchType: queryParams.searchType })"
                >重置</el-button
              >
            </el-form-item>
          </el-row>
        </el-form>
      </div>
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
          <el-table-column prop="shopName" label="商品名称" min-width="150">
            <template slot-scope="scope">
              <div class="goodsdata-name">
                <el-image :src="scope.row.goodsPic" fit="cover">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline" />
                  </div>
                </el-image>
                <div class="goodsdata-name-desc">
                  <el-tooltip :content="scope.row.goodsName" placement="top">
                    <el-tooltip :content="scope.row.goodsName" placement="top">
                      <div>{{ scope.row.goodsName }}</div>
                    </el-tooltip>
                  </el-tooltip>
                  <div>ID:{{ scope.row.goodsId }}</div>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="商户名称"
            prop="shopName"
            min-width="100"
            :show-overflow-tooltip="true"
            align="center"
          >
            <template slot-scope="{ row }">
              <div>{{ row.shopName }}</div>
              <el-tag type="warning" v-if="row.shopType == 1">(自营店铺)</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="价格" prop="price" min-width="100" :show-overflow-tooltip="true" />
          <el-table-column label="库存" prop="stockNumber" min-width="80" :show-overflow-tooltip="true" />
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
import { queryGoodsPageList } from '@/api/goods'
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
        list: queryGoodsPageList,
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
        this.queryParams.searchType = 1
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
.goodsdata-name {
  display: flex;
  align-items: center;

  .el-image {
    width: 40px;
    height: 40px;
    i {
      font-size: 20px;
      color: #aaa;
    }
  }
  .limitTitle {
    width: 174px;
    word-break: break-all;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  &-desc {
    margin-left: 50px;
    position: absolute;
    div:nth-of-type(1) {
      font-weight: bold;
      display: -webkit-box;
      text-overflow: ellipsis;
      overflow: hidden;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1; //当属性值为3，表示超出3行隐藏
    }
  }
}
</style>
