<template>
  <div class="dashboard-editor-container">
    <div class="dashboard-box">
      <!-- 平台销售总览 -->
      <sales-overView :dataSource="dataSource.amountInfo" />
    </div>
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="dashboard-box">
          <!-- 商品总览 -->
          <commodity-overView :dataSource="dataSource.goodsCountInfo" />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="dashboard-box">
          <!-- 平台用户总览 -->
          <user-overView :dataSource="dataSource.userDayStatistics" />
        </div>
      </el-col>
      <el-col>
        <!-- 销售统计 -->
        <div class="dashboard-box">
          <sales-statistics :dataSource="dataSource.shopOrderTotalSale" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import salesOverView from './components/salesOverView.vue'
import commodityOverView from './components/commodityOverView.vue'
import userOverView from './components/userOverView.vue'
import salesStatistics from './components/salesStatistics.vue'
import { getPlatformStatistics } from '@/api/platform'
export default {
  name: 'Index',
  components: {
    salesOverView,
    commodityOverView,
    userOverView,
    salesStatistics,
  },
  watch: {},
  created() {
    this.getData()
  },
  data() {
    return {
      dataSource: {
        goodsCountInfo: {},
        amountInfo: {},
        shopOrderTotalSale: {},
        userDayStatistics: {},
      },
    }
  },
  methods: {
    getData() {
      getPlatformStatistics().then((res) => {
        console.log('%c [ getPlatformStatistics ]', 'font-size:13px; background:pink; color:#bf2c9f;', res)
        this.dataSource = res.data
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.chart-wrapper {
  background: #fff;
  padding: 16px 16px 0;
  margin-bottom: 32px;
}
.dashboard-box {
  padding: 20px;
  background-color: #fff;
  margin-bottom: 20px;
}
@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
.boxTitle {
  display: flex;
  justify-content: space-between;
  color: #949494;
  padding: 0 10px;
}
</style>
