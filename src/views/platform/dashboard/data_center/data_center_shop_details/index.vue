<template>
  <div class="dashboard-editor-container">
    <div class="dashboard-box">
      <div class="dashboardTitle">
        <svg-icon icon-class="store" style="font-size:40px" />
        {{ $route.query.shopName }}
      </div>
    </div>
    <div class="dashboard-box">
      <!-- 待办事项 -->
      <pending :dataSource="dataSource.orderInfo" />
    </div>
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
          <!-- 客户总览 -->
          <user-overView :dataSource="dataSource.fansInfo" />
        </div>
      </el-col>
      <el-col>
        <!-- 商家数据 -->
        <div class="dashboard-box">
          <sales-statistics :dataSource="dataSource.shopOrderTotalSale" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import pending from './components/pending.vue'
import salesOverView from './components/salesOverView.vue'
import commodityOverView from './components/commodityOverView.vue'
import userOverView from './components/userOverView.vue'
import salesStatistics from './components/salesStatistics.vue'
import { getShopStatisticsDataDetail } from '@/api/platform'
export default {
  name: 'Index',
  components: {
    salesOverView,
    commodityOverView,
    userOverView,
    salesStatistics,
    pending,
  },
  watch: {},
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (!vm.$route.query || !vm.$route.query.id || vm.$route.query.id === null) {
        vm.$router.push({ path: '/platform/dashboard/data_center/data_center_shop' })
      }
      vm.init(vm.$route.query.id)
    })
  },
  created() {},
  data() {
    return {
      dataSource: {
        orderInfo: {},
        shopOrderTotalSale: {},
        amountInfo: {},
        goodsCountInfo: {},
        fansInfo: {},
      },
    }
  },
  methods: {
    init(id) {
      getShopStatisticsDataDetail({ id: id })
        .then((res) => {
          this.dataSource = res.data
          console.log('%c [ dataSource ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.dataSource)
        })
        .catch(() => {
          this.$message.error('服务器错误')
          this.$router.push({ path: '/platform/dashboard/data_center/data_center_shop' })
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
