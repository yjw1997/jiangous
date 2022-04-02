<template>
  <div class="dashboard-editor-container" v-loading="loading">
    <div class="dashboard-box">
      <!-- 待办事项 -->
      <panel-group :backlog="dataSource" />
    </div>
    <div class="dashboard-box">
      <!-- 平台销售总览 -->
      <top-up-group :topUpData="dataSource.adminPlatformDataVO.amountInfo" />
    </div>
    <div class="dashboard-box">
      <!-- 平台用户总览 -->
      <user-statistics :userData="dataSource.adminPlatformDataVO.userDayStatistics" />
    </div>
  </div>
</template>

<script>
import PanelGroup from '@/views/platform/dashboard/components/PanelGroup'
import topUpGroup from '@/views/platform/dashboard/components/topUpGroup'
import userStatistics from '@/views/platform/dashboard/components/userStatistics'
import { getSystemAdsList } from '@/api/dashboard'
export default {
  name: 'Index',
  components: {
    PanelGroup,
    topUpGroup,
    userStatistics,
  },
  watch: {},
  created() {
    this.init()
  },
  data() {
    return {
      dataSource: {
        adminPlatformDataVO: {
          userDayStatistics: {},
          amountInfo: {},
        },
      },
      loading: false,
    }
  },
  methods: {
    init() {
      this.loading = true
      getSystemAdsList().then((res) => {
        console.log('%c [ res ]', 'font-size:13px; background:pink; color:#bf2c9f;', res)
        this.dataSource = res.data
        this.loading = false
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
