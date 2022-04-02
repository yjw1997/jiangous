<template>
	<div class="dashboard-editor-container" v-loading="loading">
		<div class="content-box">
			<el-tabs v-model="activeName" style="margin-top:15px;" type="border-card" @tab-click="changeActive">
				<el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
					<keep-alive>
						<tab-pane v-if="activeName == item.key" :type="item.key" :activeName="activeName" />
					</keep-alive>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script>
import TabPane from './components/TabPane'
import { listOrderCount } from '@/api/order'
export default {
	name: 'order_list',
	components: { TabPane },
	props: {},
	data() {
		return {
			activeName: 'tab-',
			loading: false,
			tabMapOptions: [
				{ label: '全部订单', key: 'tab-' },
				{ label: '等待买家付款', key: 'tab-1' },
				{ label: '待发货', key: 'tab-301' },
				{ label: '待取货', key: 'tab-302' },
				{ label: '已发货', key: 'tab-401' },
				{ label: '交易完成', key: 'tab-501' },
				{ label: '交易关闭', key: 'tab-6' },
			],
		}
	},
	computed: {},
	watch: {},
	created() {},
	mounted() {
		// this.loading = true
		listOrderCount({}).then(res => {
			this.tabMapOptions.map((item, index) => {
				item.label += `(${res.data[index].count})`
			})
		})
	},

	methods: {
		changeActive() {
			console.log('%c [ changeActive ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.activeName)
		},
	},
}
</script>

<style scoped lang="scss">
@page {
	size: auto; /* auto is the initial value */
	margin: 3px; /* this affects the margin in the printer settings */
}

html {
	background-color: #ffffff;
	margin: 0; /* this affects the margin on the html before sending to printer */
}

body {
	margin: 10px 15px 10px 15px; /* margin you want for the content */
}
</style>
