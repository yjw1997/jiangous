<template>
  <div class="panel-group">
    <el-row :gutter="40">
      <el-col class="boxTitle">
        <div class="dashboardTitle">
          待处理事务
        </div>
      </el-col>
    </el-row>
    <el-row class="row-bg" :gutter="40">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="dtjzfpz" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              待提交支付凭证
            </div>
            <count-to :start-val="0" :end-val="dataSource.waitPayCount" :duration="2600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="dqrzfpz" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              待确认支付凭证
            </div>
            <count-to :start-val="0" :end-val="dataSource.waitCommitCount" :duration="2600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="dfh" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              待发货
            </div>
            <count-to :start-val="0" :end-val="dataSource.waitDeliverCount" :duration="2600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="dqh" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              待取货
            </div>
            <count-to :start-val="0" :end-val="dataSource.waitReceiveCount" :duration="2600" class="card-panel-num" />
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
    dataSource: {
      type: Object,
      require: true,
      default: () => {},
    },
  },
  components: {
    CountTo,
  },
  computed: {},
  methods: {},
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
}
.titleTime {
  margin: 10px 0 0 10px;
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
