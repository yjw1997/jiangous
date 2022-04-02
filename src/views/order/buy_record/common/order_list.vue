<template>
	<div class="dashboard-editor-container">
		<div class="search-box">
			店铺管理/ 收支明细
		</div>
		<div class="main">
			<div class="header">
				<div class="search-box box1">
					<strong>商家信息</strong>
					<div class="info mt30">
						<el-form ref="form" :model="form" label-width="120px">
							<el-form-item label="店铺名称">
								{{ shopInfo.shopName }}
							</el-form-item>
							<el-form-item label="收款银行">
								{{ shopInfo.bankName }}
							</el-form-item>
							<el-form-item label="收款人账号名称">
								{{ shopInfo.cardHolder }}
							</el-form-item>
							<el-form-item label="账户类型">
								{{ shopInfo.shopCardType === 0 ? '储蓄卡' : '信用卡' }}
							</el-form-item>
							<el-form-item label="个账/公账">
								{{ shopInfo.businessType === 0 ? '个账' : '公账' }}
							</el-form-item>
							<el-form-item label="收款路线号码">
								{{ shopInfo.routingNumber }}
							</el-form-item>
							<el-form-item label="账户号码">
								{{ shopInfo.cardNumber }}
							</el-form-item>
						</el-form>
					</div>
				</div>
				<div class="search-box box2 ml0">
					<strong>账单详细</strong>
					<div class="info mt30">
						<el-form ref="form" :model="form" label-width="120px">
							<el-form-item label="结算单号">
								{{ platTradeSettleDetail.id }}
							</el-form-item>
							<el-form-item label="起止日期">
								{{ parseTime(platTradeSettleDetail.settleBeginTime, '{y}/{m}/{d}') }}-{{ parseTime(platTradeSettleDetail.settleEndTime, '{y}/{m}/{d}') }}
							</el-form-item>
							<el-form-item label="出账日期">
								{{ parseTime(platTradeSettleDetail.billTime, '{y}/{m}/{d}') }}
							</el-form-item>
							<el-form-item label="当前状态">
								{{ getWord(platTradeSettleDetail) }}
							</el-form-item>
							<el-form-item label="平台打款时间">
								{{ platTradeSettleDetail.settleConfirmTime }}
							</el-form-item>
							<el-form-item label="订单付款总额">
								{{ platTradeSettleDetail.orderTotalAmount }}
							</el-form-item>
							<el-form-item label="平台抽佣率">
								{{ platTradeSettleDetail.rakeRate }}
							</el-form-item>
							<el-form-item label="平台抽佣">
								<span class="red">{{ platTradeSettleDetail.rakeAmount }}</span>
							</el-form-item>
							<el-form-item label="退款金额">
								<span class="red">{{ platTradeSettleDetail.refundAmount }}</span>
							</el-form-item>
							<el-form-item label="结算金额">
								{{ platTradeSettleDetail.settleAmount }}
							</el-form-item>
						</el-form>
					</div>
				</div>
			</div>
			<div class="content-box">
				<el-tabs v-model="activeName" @tab-click="handleClick">
					<el-tab-pane label="订单列表" name="first">
						<el-table v-loading="loading" :data="dataSource" width="100%">
							<el-table-column label="序号" prop="shopId" width="150" :show-overflow-tooltip="true" />
							<el-table-column label="入账时间" prop="orderTime" width="180" :show-overflow-tooltip="true">
								<template #default="{row}">
									{{ parseTime(row.orderTime, '{y}/{m}/{d} {h}:{i}:{s}') }}
								</template>
							</el-table-column>
							<el-table-column label="订单编号" prop="oderTradeNo" :show-overflow-tooltip="true" />
							<el-table-column label="支付交易号" prop="orderNo" :show-overflow-tooltip="true" />
							<el-table-column label="订单金额（美元）" prop="tradeAmount" :show-overflow-tooltip="true" />
							<el-table-column label="结算类型" prop="orderType" :show-overflow-tooltip="true">
								<template #default="{row}">
									{{ row.orderType === 0 ? '商城订单' : '' }}
								</template>
							</el-table-column>
						</el-table>
						<pagination :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" :ipagination="ipagination" @pagination="loadData" />
					</el-tab-pane>
					<el-tab-pane label="退单列表" name="second">
						<el-table v-loading="loading" :data="dataSource" width="100%">
							<el-table-column label="序号" prop="shopId" width="150" :show-overflow-tooltip="true" />
							<el-table-column label="退款时间" prop="orderTime" width="180" :show-overflow-tooltip="true">
								<template #default="{row}">
									{{ parseTime(row.orderTime, '{y}/{m}/{d} {h}:{i}:{s}') }}
								</template>
							</el-table-column>
							<el-table-column label="退款编号" prop="oderTradeNo" :show-overflow-tooltip="true" />
							<el-table-column label="订单编号" prop="orderNo" :show-overflow-tooltip="true" />
							<el-table-column label="退款金额（美元）" prop="tradeAmount" :show-overflow-tooltip="true" />
							<el-table-column label="退单类型" prop="orderType" :show-overflow-tooltip="true">
								<template #default="{row}">
									{{ row.orderType === 0 ? '商城订单' : '' }}
								</template>
							</el-table-column>
						</el-table>
						<pagination :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" :ipagination="ipagination" @pagination="loadData" />
					</el-tab-pane>
				</el-tabs>
			</div>
		</div>
	</div>
</template>

<script>
import { ListMixin } from '@/mixins/wtrfyListMixin'
import { getOrderList, initList } from '@/api/afterSale'

export default {
	name: 'order_list',
	mixins: [ListMixin],
	data() {
		return {
			disableMixinCreated: true,
			activeName: 'first',
			url: {
				list: initList,
			},
			platTradeSettleDetail: '',
			shopInfo: '',
			form: {},
			queryParams: {
				tradeType: 0,
			},
		}
	},
	created() {
    if (this.$route.query) {

      let {row} = this.$route.query
      row = JSON.parse(row)
      console.log(321321321,row)
      this.init(row)
      this.queryParams = {
        ...this.queryParams, settleBeginTime: row.settleBeginTime, settleEndTime: row.settleEndTime, shopId: row.shopId,
      }
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
		init(data) {
			console.log(data)
			getOrderList(data)
				.then(res => {
					this.platTradeSettleDetail = res.data.platTradeSettleDetail
					this.shopInfo = res.data.shopInfo
				})
				.catch(e => {
					console.log(e)
				})
		},
		handleClick() {
			this.activeName === 'first' ? (this.queryParams.tradeType = 0) : (this.queryParams.tradeType = 1)
			this.loadData()
		},
	},
}
</script>

<style lang="scss" scoped>
.main {
	display: flex;
	flex-direction: column;
	.header {
		display: flex;
		.box1 {
			width: 40%;
		}
		.box2 {
			flex: 1;
		}
	}
}
</style>