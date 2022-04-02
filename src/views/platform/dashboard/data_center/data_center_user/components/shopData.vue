<template>
  <div class="panel-group" v-loading="loading">
    <el-row :gutter="40">
      <el-col class="boxTitle">
        <div class="titleTime">
          <div class="dashboardTitle">
            商家数据
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="40">
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
              新入驻商家数
            </div>
            <count-to :start-val="0" :end-val="userData.todayShopCount" :duration="2600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <div class="boxTitle">
        <div class="dashboardTitle">新入驻商家数</div>
        <el-date-picker
          v-model="timeRanger"
          type="daterange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          value-format="timestamp"
        >
        </el-date-picker>
      </div>
      <el-col>
        <line-chart :chart-data="integralConsumption" v-if="integralConsumption" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import { getStatisticsQueryShopStatistics } from '@/api/platform'
import lineChart from './LineChart.vue'
export default {
  components: {
    CountTo,
    lineChart,
  },
  watch: {
    //  积分消耗去向
    timeRanger: {
      handler(date) {
        this.getData(date)
      },
      immediate: true,
    },
  },

  data() {
    return {
      userData: {},
      timeRanger: [new Date(new Date() - 3600 * 1000 * 24 * 6), new Date()],
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 29)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 60)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近十二个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 330)
              picker.$emit('pick', [start, end])
            },
          },
        ],
      },
      loading: false,
      integralConsumption: {},
    }
  },
  computed: {},
  methods: {
    getData(data) {
      if (data === null) {
        this.$message.info('默认值为最近一周')
        this.timeRanger = [new Date(new Date() - 3600 * 1000 * 24 * 6), new Date()]
        data = [new Date(new Date() - 3600 * 1000 * 24 * 6), new Date()]
      }
       let today = new Date();
      let timestamp =  today.getHours() * 60 * 60 * 1000 + today.getMinutes() * 60 * 1000 + today.getSeconds() * 1000 + today.getMilliseconds()
      let H = new Date(data[1]).getHours();
      let Min = new Date(data[1]).getMinutes();
      let S = new Date(data[1]).getSeconds();
      if(H===0&&Min===0&&S===0){
       data[1] =  data[1] + timestamp
       data[0] =  data[0] + timestamp
      }
      let obj = {
        beginTime: parseInt(data[0] / 1000),
        endTime: parseInt(data[1] / 1000),
      }
      getStatisticsQueryShopStatistics(obj).then((res) => {
        console.log('%c [ res ]', 'font-size:13px; background:pink; color:#bf2c9f;', res)
        this.userData = res.data
        this.loading = false

        if (res.data.registerCount && res.data.registerCount !== null) {
          this.integralConsumption = {
            xAxisData: res.data.registerCount.map((item) => new Date(parseInt(("/Date("+item.time*1000+")/").substr(6, 13))).toLocaleDateString()),
            actualData: res.data.registerCount.map((item) => item.count),
            layout: ['商家数'],
          }
        }
      })
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
