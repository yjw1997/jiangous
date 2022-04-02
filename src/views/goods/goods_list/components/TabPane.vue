<template>
  <div class="dashboard-editor-container">
    <!-- 用户搜索 -->
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
          <el-form-item label="商品ID" prop="goodsId">
            <el-input
              v-model="queryParams.goodsId"
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
          <el-form-item label="商品状态" prop="publishStatus">
            <w-dict-select-tag dictCode="publishStatus" v-model="queryParams.publishStatus" />
          </el-form-item>
          <el-form-item label="审核状态" prop="auditStatus">
            <w-dict-select-tag dictCode="auditStatus" v-model="queryParams.auditStatus" />
          </el-form-item>
          <el-form-item label="商品类目" prop="goodsClassifyCode">
            <el-cascader
              v-model="queryParams.goodsClassifyCode"
              :options="goodsClassifyCodeOption"
              filterable
              :show-all-levels="false"
              clearable
              :props="{
                expandTrigger: 'hover',
                label: 'classifyName',
                value: 'classifyCode',
                emitPath: false,
                checkStrictly: true,
              }"
            ></el-cascader>
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
      <!-- 操作按钮 -->
      <el-row :gutter="10" class="mb8">
        <right-toolbar :showSearch.sync="showSearch" @queryTable="loadData"></right-toolbar>
      </el-row>
      <el-table
        v-loading="loading"
        align="center"
        :data="dataSource"
        :rowKey="rowKey"
        row-class-name="promotion-table"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>

        <el-table-column prop="shopName" label="商品名称" min-width="200">
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

        <el-table-column label="商户名称" prop="shopName" min-width="100" :show-overflow-tooltip="true">
          <template slot-scope="{ row }">
            <div>{{ row.shopName }}</div>
            <el-tag type="warning" v-if="row.shopType == 1">(自营店铺)</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="价格" prop="price" sortable min-width="100" :show-overflow-tooltip="true" />
        <el-table-column label="库存" prop="stockNumber" sortable min-width="100" :show-overflow-tooltip="true" />
        <el-table-column label="销量" prop="saleVolume" sortable min-width="100" :show-overflow-tooltip="true" />
        <el-table-column label="审核状态" prop="auditStatus" min-width="100" :show-overflow-tooltip="true">
          <template slot-scope="{ row }">
            <span v-if="row.auditStatus == 0">待审核</span>
            <span v-if="row.auditStatus == 1">审核通过</span>
            <span v-if="row.auditStatus == 2">审核拒绝</span>
            <span v-if="row.auditStatus == 3">审核取消</span>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" prop="createTime" min-width="200" :show-overflow-tooltip="true">
          <template slot-scope="{ row }">
            <div>{{ parseTime(row.createTime) }}</div>
            <el-tag v-if="row.publishStatus == '2'"
              >{{ `定时上架: ${parseTime(row.publishScheduleTime * 1000, '{m}-{d} {h}:{i}')}上架` }}
            </el-tag>
            <el-tag v-if="row.publishStatus == '1'" type="success">上架</el-tag>
            <el-tag v-if="row.publishStatus == '0'" type="info">仓库中 </el-tag>
            <el-tag v-if="row.downOperator === 0 && row.publishStatus === 0 && row.auditStatus !== 2" type="warning"
              >违规被平台下架
            </el-tag>
             <el-tag v-if="row.downOperator === 2 && row.publishStatus === 0 && row.auditStatus !== 2" type="warning"
              >店铺停用下架
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          min-width="100"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleDetail(scope.row)">查看详情</el-button>
            <el-button size="mini" type="text" icon="el-icon-share" v-if="scope.row.publishStatus == '1'" @click="handleShare(scope.row)" class="share-btn">分享商品</el-button>
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
    <sharedia ref="sharedia"></sharedia>
  </div>
</template>

<script>
import { ListMixin } from '@/mixins/wtrfyListMixin'
import { queryGoodsPageList, goodsClassifyQueryGoodsClassify } from '@/api/goods'

export default {
  mixins: [ListMixin],
  name: '',
  components: {sharedia:() => import('./index.vue'),},
  props: ['activeName'],
  data() {
    return {
      url: {
        list: queryGoodsPageList,
      },
      rowKey: 'orderNo',
      disableMixinCreated: true,
      timeRanger: [],
      goodsClassifyCodeOption: [],
      closeBatchButtonDisabled: true,
      queryParams: {
        shopName: '',
      },
      goods:undefined
    }
  },
  computed: {},

  created() {
    goodsClassifyQueryGoodsClassify().then((res) => {
      this.goodsClassifyCodeOption = this.handleTree(res.data, 'classifyCode', 'parentCode')
    })
  },
  mounted() {},
  watch: {},
  activated() {
    this.queryParams.searchType = Number(this.activeName.replace('tab-', ''))
    if (this.$route.query && this.$route.query.edit) {
      this.queryParams.shopName = JSON.parse(decodeURIComponent(this.$route.query.edit)).shopName
    }
    this.loadData()
  },
  methods: {
    init() {},
    //查看详情
    handleDetail(row) {
      let url = encodeURIComponent(JSON.stringify({ id: row.goodsId }))
      this.$router.push({
        path: '/goods/goods_detail',
        query: { edit: url },
      })
    },
    handleShare(row) {
      this.$refs.sharedia.goods = row
      this.$refs.sharedia.show()
    }
  },
}
</script>

<style scoped lang="scss">
/* table */
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
.share-btn{
  margin-left:0px !important; 
}
</style>
