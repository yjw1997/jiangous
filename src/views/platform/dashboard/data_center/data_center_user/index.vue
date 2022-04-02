<template>
  <div class="dashboard-editor-container">
    <div class="dashboard-box">
      <!-- 用户数据 -->
      <user-data />
    </div>
    <!-- 商家数据 -->
    <div class="dashboard-box">
      <shop-data />
    </div>
  </div>
</template>

<script>
import userData from './components/userData.vue'
import shopData from './components/shopData.vue'

export default {
  name: 'Index',
  components: {
    userData,
    shopData,
  },
  watch: {},
  created() {},
  data() {
    return {}
  },
  methods: {},
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
