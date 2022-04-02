<template>
  <div class="panel-group">
    <el-row :gutter="40">
      <el-col class="boxTitle">
        <div class="titleTime">
          <div class="dashboardTitle">
            平台用户总览
          </div>
          <!-- <div style="margin:10px 5px 0 10px">
            数据更新时间：{{ userData }}
            <svg-icon icon-class="refresh"></svg-icon>
          </div> -->
        </div>
        <div style="float:right" @click="handlePushDetail">查看详细 <i class="el-icon-arrow-right"></i></div>
      </el-col>
    </el-row>
    <el-row :gutter="40">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="zcyhzs" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              注册用户总数
            </div>
            <count-to :start-val="0" :end-val="userData.allUserCount" :duration="2600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="jrxzyhzs" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              今日新增用户数
            </div>
            <count-to :start-val="0" :end-val="userData.todayUserCount" :duration="2600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="rzsjzs" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              入驻商家总数
            </div>
            <count-to :start-val="0" :end-val="userData.allShopCount" :duration="2600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="jrxrzsjs" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              今日新入驻商家数
            </div>
            <count-to :start-val="0" :end-val="userData.todayShopCount" :duration="2600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  props: {
    userData: {
      type: Object,
      require: true,
      default: () => {},
    },
  },
  components: {
    CountTo,
  },
  computed: {},
  methods: {
    handlePushDetail() {
      this.$router.push('/platform/dashboard/data_center/data_center_user')
    },
  },
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    display: flex;
    justify-content: space-around;
    align-items: center;

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #333333;
      }

      .icon-message {
        background: #36a3f7;
      }
    }

    .icon-people {
      color: #333333;
    }

    .icon-message {
      color: #36a3f7;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 0 0 0 14px;
      padding: 12px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      font-size: 48px;
    }

    .card-panel-description {
      font-weight: bold;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
    .card-panel-math {
      margin-right: 10px;
      font-weight: bold;
      .card-panel-text {
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
.boxTitle {
  display: flex;
  color: #949494;
  justify-content: space-between;
}
.titleTime {
  display: flex;
}

@media screen and (min-width: 1200px) and (max-width: 1509px) {
  .card-panel-icon-wrapper {
    display: none;
  }
  .card-panel-description {
    margin-left: 14px;
  }
}

@media (max-width: 880px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
