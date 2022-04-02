<template>
  <div class="dashboard-editor-container">
    <!-- 用户搜索 -->
    <div class="search-box" v-show="showSearch">
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-min-width="68px">
        <el-row :gutter="20">
          <el-form-item label="商品名称" prop="activityName">
            <el-input
              v-model="queryParams.activityName"
              clearable
              size="small"
              style="width: 240px"
              placeholder="请输入"
              @keyup.enter.native="loadData(1)"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="loadData(1)">搜索</el-button>
            <el-button
              icon="el-icon-refresh"
              size="mini"
              @click="resetQuery({ activityId: queryParams.activityId, auditStatus: queryParams.auditStatus })"
              >重置</el-button
            >
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="content-box">
      <!-- 操作按钮 -->
      <el-row :gutter="10" class="mb8">
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
        <el-table-column label="商品原价($)" prop="priceRange" min-width="80" :show-overflow-tooltip="true" />
        <el-table-column label="活动价格($)" prop="enrollPriceRange" min-width="80" :show-overflow-tooltip="true" />
        <el-table-column label="参与库存" prop="stock" min-width="80" :show-overflow-tooltip="true" />
        <el-table-column label="活动销量" prop="saleStock" min-width="80" :show-overflow-tooltip="true" />
        <el-table-column label="商品状态" prop="auditStatus" min-width="80" :show-overflow-tooltip="true">
          <template slot-scope="{ row }">
            <span v-if="row.auditStatus == 0">待审核</span>
            <span v-if="row.auditStatus == 1">审核通过</span>
            <span v-if="row.auditStatus == 2">审核拒绝</span>
            <span v-if="row.auditStatus == 3">撤销报名</span>
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
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleDetail(scope.row)">查看详情</el-button>
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
  </div>
</template>

<script>
import { ListMixin } from '@/mixins/wtrfyListMixin'
import { queryactivityRushPurchaseAuditList } from '@/api/goods'

export default {
  mixins: [ListMixin],
  name: '',
  components: {},
  props: ['activeName'],

  data() {
    return {
      url: {
        list: queryactivityRushPurchaseAuditList,
      },
      rowKey: 'id',
      disableMixinCreated: true,
      timeRanger: [],
      goodsClassifyCodeOption: [],
      closeBatchButtonDisabled: true,
    }
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  activated() {
    this.queryParams.activityId = JSON.parse(decodeURIComponent(this.$route.query.edit)).id
    this.queryParams.auditStatus = this.activeName === 'tab-' ? undefined : Number(this.activeName.replace('tab-', ''))
    this.loadData()
  },
  methods: {
    init() {},

    //查看详情
    handleDetail(row) {
      let url = encodeURIComponent(
        JSON.stringify({
          id: row.activityRushPurchaseGoodsDetailId,
        }),
      )
      this.$router.replace({
        path: '/goods/activity/activity_audit_list/detail',
        query: { edit: url },
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
