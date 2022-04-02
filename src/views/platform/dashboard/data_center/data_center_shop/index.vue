<template>
  <div class="dashboard-editor-container">
    <!-- 用户搜索 -->
    <div class="search-box" v-show="showSearch">
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-min-width="68px">
        <el-form-item label="店铺名称" prop="shopName">
          <el-input
            v-model="queryParams.shopName"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="loadData(1)"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="loadData(1)">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-box">
      <el-table v-loading="loading" :data="dataSource" :row-key="rowKey" align="center">
        <el-table-column label="编号" prop="id" min-width="60" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="店铺名称" prop="shopName" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="店铺总付款金额" prop="allAmount" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="今日总付款金额" prop="todayAmount" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="店铺粉丝总量" prop="shopFansNum" min-width="120" :show-overflow-tooltip="true">
          <!-- <template slot-scope="scope">
            {{ scope.row.shopFansNum || 0 }}
          </template> -->
        </el-table-column>
        <el-table-column label="在售商品" prop="saleCount" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          fixed="right"
          min-width="120"
        >
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-document" @click="handleDetail(scope.row)">详情</el-button>
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
import { getShopStatisticsQueryPageList } from '@/api/platform'
export default {
  name: '',
  mixins: [ListMixin],
  components: {},
  props: {},
  data() {
    return {
      url: {
        list: getShopStatisticsQueryPageList,
      },
      rowKey: 'id',
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    handleDetail(row) {
      this.$router.push({
        path: '/platform/dashboard/data_center/data_center_shop_details',
        query: { id: row.id, shopName: row.shopName },
      })
    },
  },
}
</script>

<style scoped lang="scss"></style>
