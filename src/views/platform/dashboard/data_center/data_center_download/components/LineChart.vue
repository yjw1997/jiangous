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
			console.log('%c [ actualData, expectedData, layout, threeData ]', 'font-size:13px; background:pink; color:#bf2c9f;', actualData, expectedData, layout, threeData)
			let series = [
				// {
				//   name: layout[2],
				//   smooth: true,
				//   type: 'bar',
				//   itemStyle: {
				//     normal: {
				//       color: '#3888fa',
				//       lineStyle: {
				//         color: '#3888fa',
				//         width: 2,
				//       },
				//       areaStyle: {
				//         color: '#f3f8ff',
				//       },
				//     },
				//   },

				//   data: actualData,
				//   label: {
				//     show: true,
				//     position: 'top',
				//   },
				//   animationDuration: 2800,
				//   animationEasing: 'quadraticOut',
				// },
				// {
				// 	name: layout[1],
				// 	itemStyle: {
				// 		normal: {
				// 			color: '#2dc7c9',
				// 			lineStyle: {
				// 				color: '#2dc7c9',
				// 				width: 2,
				// 			},
				// 		},
				// 	},

				// 	smooth: true,
				// 	type: 'bar',
				// 	data: expectedData,
				// 	label: {
				// 		show: true,
				// 		position: 'top',
				// 	},
				// 	animationDuration: 2800,
				// 	animationEasing: 'cubicInOut',
				// },

				{
					name: layout[0],
					itemStyle: {
						normal: {
							color: '#ffba00',
							lineStyle: {
								color: '#ffba00',
								width: 2,
							},
						},
					},
           barWidth: 50,

					smooth: true,
					type: 'bar',
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
					boundaryGap: true,
					axisTick: {
						show: false,
					},
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true,
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross',
					},
					padding: [5, 10],
				},
				axisLabel: {
					//坐标轴刻度标签的相关设置。
					formatter: function(params) {
						var newParamsName = '' // 最终拼接成的字符串
						var paramsNameNumber = params.length // 实际标签的个数
						var provideNumber = 4 // 每行能显示的字的个数
						var rowNumber = Math.ceil(paramsNameNumber / provideNumber) // 换行的话，需要显示几行，向上取整
						/**
						 * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
						 */
						// 条件等同于rowNumber>1
						if (paramsNameNumber > provideNumber) {
							/** 循环每一行,p表示行 */
							for (var p = 0; p < rowNumber; p++) {
								var tempStr = '' // 表示每一次截取的字符串
								var start = p * provideNumber // 开始截取的位置
								var end = start + provideNumber // 结束截取的位置
								// 此处特殊处理最后一行的索引值
								if (p == rowNumber - 1) {
									// 最后一次不换行
									tempStr = params.substring(start, paramsNameNumber)
								} else {
									// 每一次拼接字符串并换行
									tempStr = params.substring(start, end) + '\n'
								}
								newParamsName += tempStr // 最终拼成的字符串
							}
						} else {
							// 将旧标签的值赋给新标签
							newParamsName = params
						}
						//将最终的字符串返回
						return newParamsName
					},
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
