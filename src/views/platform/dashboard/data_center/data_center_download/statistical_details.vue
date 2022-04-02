<template>
	<div class="dashboard-editor-container">
		<div class="search-box">
			<el-row :gutter="40" class="download-d">
				<el-col class="boxTitle">
					<div class="titleTime">
						<div class="dashboardTitle">
							近30日渠道下载统计
						</div>
					</div>
					<!-- <lineChart :chart-data="fifteenCountData" /> -->
				</el-col>
				<el-col style="display:flex;justify-content: space-between;">
					<div>
						<span style="paddingRight:20px">快速查看</span>
						<el-button :type="currentIndex === index ? 'primary' : ''" v-for="(butItem, index) in quicklook" :key="butItem.name" @click="getData(butItem.key, butItem.time, index)">
							{{ butItem.name }}
						</el-button>
					</div>
					<el-date-picker
						v-model="timeRanger"
						type="daterange"
						value-format="yyyy-MM-dd HH:mm:ss"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						@change="dateChange"
					></el-date-picker>
				</el-col>
			</el-row>
			<line-chart :chart-data="integralConsumption" />
		</div>
	</div>
</template>

<script>
import { frontChannelStatisticsSearchCountSingle, frontChannelStatisticsSearchCount } from '@/api/platform'
import lineChart from './components/LineChart_d.vue'
import { getYearTIme } from '@/utils'
export default {
	name: 'statistical_details',
	components: {
		lineChart,
	},
	data() {
		return {
			timeRanger: [],
			currentIndex: 0,
			quicklook: [
				{ name: '最近七日', time: 'sevenTime', key: 'recentSeven' },
				{ name: '最近30日', time: 'dayTime', key: 'countDay' },
				{ name: '近12月', time: 'monTime', key: 'countMon' },
			],
			id: this.$route.query.id,
			integralConsumption: {},
			dataOrigin: {},
		}
	},
	created() {
		this.init()
	},
	methods: {
		init() {
			frontChannelStatisticsSearchCount({ id: this.id }).then(res => {
				if (res.code === 0) {
					this.dataOrigin = res.data
					let countDay = res.data.countDay.split(',')
					let countMon = res.data.countMon.split(',')
					countDay.reverse()
					countMon.reverse()
					countDay.shift()
					countMon.shift()
					let dayTime = this.NearlyDays(30)
					let monTime = getYearTIme()
					let recentSeven = countDay.slice(0, 7)
					let sevenTime = dayTime.slice(23, 30)
					let obj = { countDay, countMon, dayTime, monTime, recentSeven, sevenTime }
					this.dataOrigin = Object.assign({}, this.dataOrigin, obj)
					this.getData(this.quicklook[0].key, this.quicklook[0].time)
				}else{
					this.$message.error('服务器错误请刷新重试')
				}
			})
		},
		NearlyDays(numDays) {
			function YTD(timestamp) {
				const date = new Date(timestamp)
				const year = date.getFullYear()
				let month = date.getMonth() + 1
				month = month > 9 ? month : '0' + month
				let day = date.getDate()
				day = day > 9 ? day : '0' + day
				return `${year}/${month}/${day}`
			}
			let arr = []
			for (let i = 0; i < numDays; i++) {
				arr.push(YTD(Date.now() - 24 * 60 * 60 * 1000 * i))
			}
			return arr.reverse()
		},
		getData(key, time, index = 0) {
			this.currentIndex = index
			this.integralConsumption = {
				xAxisData: this.dataOrigin[time],
				actualData: this.dataOrigin[key],
				layout: [''],
			}
		},
		dateChange(e) {
			this.currentIndex = -1
			let id = this.id
			let startDate = e[0]
			let endDate = e[1]
			let adminChannelStatisticsQueryDTO = {
				id,
				endDate,
				startDate,
			}
			frontChannelStatisticsSearchCountSingle(adminChannelStatisticsQueryDTO).then(res => {
				if (res.code === 0) {
					let xAxisData = res.data.canlendarData.replace(/-/g, '/').split(',')
					xAxisData = xAxisData.map(item => {
						return item.split(' ')[0]
					})
					let actualData = res.data.countData.split(',')
					xAxisData.reverse()
					actualData.reverse()
					xAxisData.shift()
					actualData.shift()
					this.integralConsumption = {
						xAxisData,
						actualData,
						layout: [''],
					}
					console.log(xAxisData, actualData)
				} else {
					this.$message.error(res.message || '服务器错误请刷新重试')
				}
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.download-d {
	margin-top: 18px;
}
</style>
