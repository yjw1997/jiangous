<template>
	<div class="dashboard-editor-container">
		<div class="search-box">
			交易订单
		</div>
		<div class="search-box">
			资金管理
			<div class="mt30 s10">
				<el-card class="box-card">
					<p>
						已汇款（美元）
					</p>
					<p class="red">
						{{ totalList.remit }}
					</p>
				</el-card>
				<el-card class="box-card">
					<p>
						待汇款（美元）
					</p>
					<p class="red">
						{{ totalList.waitRemit }}
					</p>
				</el-card>
				<el-card class="box-card">
					<p>
						待结算（美元）
					</p>
					<p class="red">
						{{ totalList.waitSettle }}
					</p>
				</el-card>
				<el-card class="box-card">
					<p>
						冻结金额（美元）
					</p>
					<p class="red">
						{{ totalList.freeze }}
					</p>
				</el-card>
				<el-card class="box-card">
					<p>
						平台已结算佣金（美元）
					</p>
					<p class="red">
						{{ totalList.rakeRated }}
					</p>
				</el-card>
			</div>
		</div>
		<div class="content-box">
			<el-tabs v-model="activeName" @tab-click="handleClick">
				<el-tab-pane label="结算账单明细" name="bill">
					<el-table v-loading="loading" :data="dataSource" width="100%" @selection-change="handleSelectionChange">
						<el-table-column width="55" align="center" :show-overflow-tooltip="true" />
						<el-table-column label="账单日" align="center" prop="billTime" width="150" :show-overflow-tooltip="true">
							<template #default="{row}">
								{{ parseTime(row.billTime, '{y}年{m}月{d}日') }}
							</template>
						</el-table-column>
						<el-table-column label="结算时间段" align="center" prop="id" width="180" :show-overflow-tooltip="true">
							<template #default="{row}">{{ parseTime(row.settleBeginTime, '{y}年{m}月{d}日') }}-{{ parseTime(row.settleEndTime, '{y}年{m}月{d}日') }}</template>
						</el-table-column>
						<el-table-column label="结算金额（美元）" align="center" prop="settleAmount" :show-overflow-tooltip="true" />
						<el-table-column label="平台抽佣（美元）" align="center" prop="rakeRate" :show-overflow-tooltip="true" />
						<el-table-column label="状态（美元）" align="center" prop="settleStatus" column-key="settleStatus" :show-overflow-tooltip="true">
							<template #default="{row}">
								<el-tag :type="row.settleStatus === 1 ? 'success' : 'warning'">
									{{ getWord(row) }}
								</el-tag>
							</template>
						</el-table-column>
						<el-table-column label="操作">
							<template #default="{row}">
								<el-button type="text" @click="handleOrder(row)">账单明细</el-button>
								<el-button type="text" @click="exportBills(row)">导出账单</el-button>
								<el-button type="text" v-if="row.settleStatus !== 1" @click="handleRemit(row)">汇款</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
				<el-tab-pane label="店铺结算统计" name="total">
					<div class="search-box">
						<el-row :gutter="10">
							<el-form :model="queryParams" ref="queryForm" :inline="true" label-min-width="80px">
								<el-col :span="7">
									<el-form-item label="店铺信息：" prop="shopInfo">
										<el-input v-model="queryParams.shopInfo" placeholder="请输入店铺名称/店铺ID" @keyup.enter.native="loadData(1)" />
									</el-form-item>
								</el-col>
								<el-col :span="2">
									<el-form-item>
										<el-button type="primary" @click="loadData">查询</el-button>
									</el-form-item>
								</el-col>
								<el-col :span="3">
									<el-form-item>
										<el-button plain @click="resetQuery">重置</el-button>
									</el-form-item>
								</el-col>
							</el-form>
						</el-row>
					</div>
					<div class="content-box">
						<el-table v-loading="loading" :data="dataSource" width="100%" @selection-change="handleSelectionChange">
							<el-table-column label="店铺ID" prop="shopId" width="150" align="center" :show-overflow-tooltip="true" />
							<el-table-column label="店铺名称" prop="shopName" width="180" align="center" :show-overflow-tooltip="true" />
							<el-table-column label="已汇款金额（美元）" prop="remitedMoney" align="center" :show-overflow-tooltip="true" />
							<el-table-column label="待汇款金额（美元）" prop="waitRemitMoney" align="center" :show-overflow-tooltip="true" />
							<el-table-column label="待结算金额（美元）" prop="waitSettleMoney" align="center" :show-overflow-tooltip="true" />
							<el-table-column label="冻结金额（美元）" prop="freezeMoney" align="center" :show-overflow-tooltip="true" />
							<el-table-column label="平台已结算佣金（美元）" align="center" prop="platformSettledMoney" :show-overflow-tooltip="true" />
							<el-table-column label="操作">
								<template #default="{row}">
									<el-button type="text" @click="handleSearch(row)">查看详情</el-button>
								</template>
							</el-table-column>
						</el-table>
						<pagination :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" :ipagination="ipagination" @pagination="loadData" />
					</div>
				</el-tab-pane>
			</el-tabs>
		</div>
		<el-dialog :visible.sync="centerDialogVisible" width="30%" :show-close="false" center>
			<p class="desc">请确认{{ time }}的结算单内的店铺结算汇款已完成</p>
			<p class="text-muted desc">
				确认后该操作不可撤回，请确认无误后再进行操作
			</p>
			<span slot="footer" class="dialog-footer">
				<el-button @click="centerDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="configRemit">确认汇款</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { ListMixin } from '@/mixins/wtrfyListMixin'
import { obtainFunds, shopTotal, getBillDetails, sureRemit, initExcel } from '@/api/afterSale'
import { parseTime } from '@/utils'
import { Message } from 'element-ui'
// import { queryShopPageList, updateShopStatusShop } from '@/api/store'

export default {
	name: 'index',
	mixins: [ListMixin],
	data() {
		return {
			centerDialogVisible: false,
			url: {
				list: shopTotal,
			},
			rowInfo: {},
			activeName: 'total',
			form: {},
			totalList: '',
			type: 'success',
			time: '',
		}
	},
	created() {
		this.init()
	},
	methods: {
		configRemit() {
			sureRemit({ billTime: this.rowInfo.billTime })
				.then(res => {
					Message.success('汇款成功')
					this.centerDialogVisible = false
					this.loadData()
				})
				.catch(e => {
					Message.error(e)
				})
		},
		exportBills(row) {
			console.log(row)
			const params = {
				billTime: row.billTime,
				settleBeginTime: row.settleBeginTime,
				settleEndTime: row.settleEndTime,
				shopId: row.shopId,
				shopName: row.shopName,
			}
			initExcel(params)
				.then(res => {
					Message.success('导出成功')
				})
				.catch(e => {
					Message.error(e)
				})
		},
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
		handleRemit(row) {
			this.centerDialogVisible = true
			this.rowInfo = row
			this.time = parseTime(row.billTime, '{y}年{m}月{d}日')
		},
		init() {
			obtainFunds()
				.then(res => {
					console.log('data', res.data)
					this.totalList = res.data
				})
				.catch(e => {
					console.log(e)
				})
		},
		handleClick() {
			const { activeName } = this
			activeName === 'bill' ? (this.url.list = getBillDetails) : (this.url.list = shopTotal)
			this.loadData()
		},
		handleOrder(row) {
			this.$router.push({
				path: '/order/buy_record/order_detail',
				query: {
					row: JSON.stringify(row),
				},
			})
		},
		handleSearch(row) {
			this.$router.push({
				path: '/order/buy_record/shop_detail',
				query: {
					row: JSON.stringify(row),
				},
			})
		},
	},
}
</script>

<style lang="scss" scoped>
::v-deep .el-tabs__nav.is-top {
	padding-bottom: 30px;
	.el-tabs__item.is-top {
		font-size: 17px;
	}
}
.desc {
	text-align: center;
}
.s10 {
	display: flex;
	justify-content: space-between;
	.box-card {
		border-radius: 15px;
		width: 230px;
	}
}
</style>