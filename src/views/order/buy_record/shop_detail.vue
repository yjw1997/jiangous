<template>
	<div class="dashboard-editor-container">
		<div class="search-box">
			<p class="mb20">
				<strong>{{ queryParams.shopName }}</strong>
			</p>
			<div class="mb20">
				<el-row :gutter="10">
					<el-form :model="queryParams" ref="queryForm" :inline="true" label-min-width="80px">
						<el-col :span="7">
							<el-form-item label="结算单号：" prop="id">
								<el-input v-model="queryParams.id" placeholder="请输入" @keyup.enter.native="loadData" />
							</el-form-item>
						</el-col>
						<el-col :span="7">
							<el-form-item label="账单日：" prop="billTime">
								<el-input v-model="queryParams.billTime" placeholder="请选择" @keyup.enter.native="loadData" />
							</el-form-item>
						</el-col>
						<el-col :span="1.5">
							<el-form-item>
								<el-button type="primary" @click="loadData">查询</el-button>
							</el-form-item>
						</el-col>
						<el-col :span="1.5">
							<el-form-item>
								<el-button plain @click="resetQuery">重置</el-button>
							</el-form-item>
						</el-col>
					</el-form>
				</el-row>
			</div>
			<el-table v-loading="loading" :data="dataSource" width="100%">
				<el-table-column label="结算单号" prop="id" width="150" :show-overflow-tooltip="true" />
				<el-table-column label="账单日" prop="id" width="180" :show-overflow-tooltip="true">
					<template #default="{row}">{{ parseTime(row.billTime, '{y}年{m}月{d}日') }}</template>
				</el-table-column>
				<el-table-column label="结算时间段" prop="id" :show-overflow-tooltip="true">
					<template #default="{row}">
						{{ parseTime(row.settleBeginTime, '{y}年{m}月{d}日') }}-
						{{ parseTime(row.settleEndTime, '{y}年{m}月{d}日') }}
					</template>
				</el-table-column>
				<el-table-column label="订单金额（美元）" prop="orderTotalAmount" :show-overflow-tooltip="true" />
				<el-table-column label="结算金额（美元）" prop="settleAmount" :show-overflow-tooltip="true" />
				<el-table-column label="平台抽佣（美元）" prop="rakeRateAmount" :show-overflow-tooltip="true" />
				<el-table-column label="平台抽佣率" prop="rakeRate" :show-overflow-tooltip="true" />
				<el-table-column label="状态" prop="settleStatus" :show-overflow-tooltip="true">
					<template #default="{row}">
						{{ getWord(row) }}
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template #default="{row}">
						<el-button type="text" @click="handleSearch(row)">订单明细</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" :ipagination="ipagination" @pagination="loadData" />
		</div>
	</div>
</template>

<script>
import { ListMixin } from '@/mixins/wtrfyListMixin'
import { getList } from '@/api/afterSale'

export default {
	name: 'shop_detail',
	mixins: [ListMixin],
	data() {
		return {
			disableMixinCreated: true,
			url: {
				list: getList,
			},
		}
	},
	created() {
		if (this.$route.query) {
			let { row } = this.$route.query
			row = JSON.parse(row)
			this.queryParams.shopId = row.shopId
			this.queryParams.shopName = row.shopName
			this.loadData()
		}
	},
	methods: {
		getWord({ settleStatus }) {
			switch (settleStatus) {
				case 0:
					return '待汇款'
				case 1:
					return '已汇款'
				case 2:
					return '部分汇款'
			}
		},
		handleSearch(row) {
			this.$router.push({
				path: '/order/buy_record/order_detail',
				query: {
					row: JSON.stringify(row),
				},
			})
		},
	},
}
</script>

<style scoped></style>