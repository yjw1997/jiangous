<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from '../../../mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart',
    },
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '350px',
    },
    autoResize: {
      type: Boolean,
      default: true,
    },
    chartData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      chart: null,
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.initChart(val)
      },
    },
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions({ xAxisData, actualData, expectedData, layout, threeData } = {}) {
      console.log(
        '%c [ actualData, expectedData, layout, threeData ]',
        'font-size:13px; background:pink; color:#bf2c9f;',
        actualData,
        expectedData,
        layout,
        threeData,
      )
      let series = [
        {
          name: layout[0],
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2,
              },
              areaStyle: {
                color: '#f3f8ff',
              },
            },
          },

          data: actualData,
          label: {
            show: true,
            position: 'top',
          },
          animationDuration: 2800,
          animationEasing: 'quadraticOut',
        },
        {
          name: layout[1],
          itemStyle: {
            normal: {
              color: '#2dc7c9',
              lineStyle: {
                color: '#2dc7c9',
                width: 2,
              },
            },
          },

          smooth: true,
          type: 'line',
          data: expectedData,
          label: {
            show: true,
            position: 'top',
          },
          animationDuration: 2800,
          animationEasing: 'cubicInOut',
        },
        {
          name: layout[2],
          itemStyle: {
            normal: {
              color: '#ffba00',
              lineStyle: {
                color: '#ffba00',
                width: 2,
              },
            },
          },

          smooth: true,
          type: 'line',
          data: threeData,
          label: {
            show: true,
            position: 'top',
          },
          animationDuration: 2800,
          animationEasing: 'cubicInOut',
        },
      ]
      this.chart.setOption({
        xAxis: {
          data: xAxisData,
          boundaryGap: false,
          axisTick: {
            show: false,
          },
        },
        grid: {
          left: '2%',
          right: '2%',
          bottom: 20,
          top: 30,
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
          padding: [5, 10],
        },
        yAxis: {
          axisTick: {
            show: false,
          },
        },
        legend: {
          data: layout,
        },
        series: series,
      })
    },
  },
}
</script>
