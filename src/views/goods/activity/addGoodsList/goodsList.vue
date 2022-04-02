<template>
  <div class="dashboard-editor-container">
    <!-- 用户搜索 -->
    <div class="search-box" v-show="showSearch">
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-min-width="68px">
        <el-row :gutter="20" style="font-weight:700">秒杀时段:{{ this.form.timeName }} </el-row>
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
      <el-table v-loading="loading" align="center" :data="dataSource" :rowKey="rowKey" row-class-name="promotion-table">
        <el-table-column prop="shopName" label="商品名称" min-width="180">
          <template slot-scope="scope">
            <div class="goodsdata-name">
              <el-image :src="scope.row.picUrl">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline" />
                </div>
              </el-image>
              <div class="goodsdata-name-desc">
                <el-tooltip :content="scope.row.goodsName" placement="top">
                  <div>{{ scope.row.goodsName }}</div>
                </el-tooltip>
                <div>{{ scope.row.goodsId }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="商家名称" prop="shopName" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="商品原价($)" prop="salePriceRange" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="活动价格($)" prop="enrollPriceRange" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="商品库存" prop="saleStock" min-width="80" :show-overflow-tooltip="true" />
        <el-table-column label="本轮活动销量" prop="activitySaleNum" min-width="120" :show-overflow-tooltip="true" />

        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          fixed="right"
          min-width="170"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-top"
              @click="handleSort(scope.row, 1)"
              :disabled="scope.$index === 0"
              >上移
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-bottom"
              @click="handleSort(scope.row, 2)"
              :disabled="scope.$index + 1 === ipagination.total"
              >下移</el-button
            >
            <el-button size="mini" type="text" icon="el-icon-close" @click="handleDelete(scope.row.id, '删除', 'ids')"
              >删除</el-button
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
    </div>
    <rewrite-modal ref="modalForm" @OK="modelOK()"></rewrite-modal>
    <w-goods-list-modal ref="goodsListModal" multiplate @change="currentRowChange" :query="query"></w-goods-list-modal>
  </div>
</template>

<script>
import { ListMixin } from '@/mixins/wtrfyListMixin'
import { queryRushGoodsByTime, deleteGoodsByGoodsIds, saveRushGoods, updateRushGoodsSort } from '@/api/goods'
import rewriteModal from './rewriteModal.vue'
import WGoodsListModal from '@/components/jianshops/WGoodsListModal'
export default {
  mixins: [ListMixin],
  name: '',
  components: { rewriteModal, WGoodsListModal },
  props: ['activeName'],

  data() {
    return {
      url: {
        list: queryRushGoodsByTime,
        delete: deleteGoodsByGoodsIds,
      },
      rowKey: 'id',
      disableMixinCreated: true,
      timeRanger: [],
      goodsClassifyCodeOption: [],
      closeBatchButtonDisabled: true,
      form: {},
      activityId: '',
      query: {},
    }
  },
  computed: {},
  created() {},
  mounted() {},
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (!vm.$route.query || !vm.$route.query.edit) {
        vm.$router.go(-1)
      }
      vm.form = JSON.parse(decodeURIComponent(vm.$route.query.edit))
      vm.queryParams.rushScheduleId = vm.form.id
      vm.queryParams.activityId = vm.form.activityId
      vm.query = {
        rushScheduleId: vm.form.id,
        activityId: vm.form.activityId,
      }
      vm.loadData().catch(() => {
        vm.$router.go(-1)
      })
    })
  },
  watch: {},
  methods: {
    init() {},
    //  排序
    handleSort(row, sortFlag) {
      row.sortFlag = sortFlag
      updateRushGoodsSort(row)
        .then((res) => {
          const { code, message } = res
          if (code === 0) {
            this.$message.success(message || '操作成功')
            this.loadData()
          }
        })
        .catch((err) => {
          this.$message.error(err.message || '服务器错误')
        })
    },
    //  新增
    handleAdd() {
      this.$refs.goodsListModal.init()
    },
    //编辑
    handleEdit(row) {
      let url = encodeURIComponent(
        JSON.stringify({
          id: row.activityId,
        }),
      )
      this.$router.replace({
        path: '/goods/activity/activity_audit_list/detail',
        query: { edit: url },
      })
    },
    currentRowChange(arr) {
      let _this = this
      arr.forEach((item) => {
        item.activityId = _this.form.activityId
        item.rushScheduleId = _this.form.id
      })
      saveRushGoods(arr)
        .then((res) => {
          this.$message.success(res.message || '操作成功')
          this.loadData()
        })
        .catch((err) => {
          this.$message.warning(err.message || '服务器错误')
        })
    },
  },
}
</script>

<style scoped lang="scss">
/* table */
.goodsdata-name {
  display: flex;
  align-items: center;

  .el-image {
    min-width: 40px;
    max-width: 40px;
    height: 40px;
    i {
      font-size: 20px;
      color: #aaa;
    }
  }

  &-desc {
    margin-left: 20px;

    div:nth-of-type(1) {
      font-weight: bold;
    }
  }
}
</style>
