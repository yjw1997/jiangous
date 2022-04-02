<template>
	<div class="dashboard-editor-container">
		<!-- 用户搜索 -->
		<div class="search-box" v-show="showSearch">
			<el-row :gutter="20">
				<el-form label-width="68px" label-position="right" :model="queryDTO">
					<el-col :span="24">
						<el-form-item label="查询时间" label-width="200">
							<el-select v-model="timeType" placeholder="请选择" v-if="distinction" size="medium" style="width:160px">
								<el-option label="退款申请时间" :value="0"></el-option>
								<el-option label="下单时间" :value="1"></el-option>
							</el-select>
							&nbsp;&nbsp;
							<el-date-picker
								v-model="timeRanger"
								type="daterange"
								range-separator="至"
								start-placeholder="开始日期"
								end-placeholder="结束日期"
								value-format="timestamp"
								@change="datePickerChange"
							></el-date-picker>
							<span v-for="fastTimeItem in fastTime" :key="fastTimeItem.name" :class="{'fastTime-st':true,}" @click="timeQuickQuery(fastTimeItem.time)">{{ fastTimeItem.name }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-row :gutter="5">
							<el-form-item label="金额范围">
								<el-col :span="11">
									<el-input v-model="queryDTO.tradeMoneyMin" clearable size="small" placeholder="￥金额" />
								</el-col>
								<el-col style="textAlign:center" :span="2">——</el-col>
								<el-col :span="11">
									<el-input v-model="queryDTO.tradeMoneyMax" clearable size="small" placeholder="￥金额" />
								</el-col>
							</el-form-item>
						</el-row>
					</el-col>
					<el-col :span="8">
						<el-form-item label="订单编号" prop="orderNo">
							<el-input v-model="queryDTO.orderNo" clearable size="small" placeholder="请输入" />
						</el-form-item>
					</el-col>
					<el-col :span="8" v-if="!distinction">
						<el-form-item label="支付交易号" prop="tradeNo" label-width="80">
							<el-input style="maxWidth:70%" v-model="queryDTO.tradeNo" clearable size="small" placeholder="请输入" />
						</el-form-item>
					</el-col>
					<el-col :span="8" v-else>
						<el-form-item label="退款编号" prop="refundNo" label-width="80">
							<el-input style="maxWidth:70%" v-model="queryDTO.refundNo" clearable size="small" placeholder="请输入" />
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="买家信息" prop="buyerInfo" label-width="100">
							<el-input style="maxWidth:70%" v-model="queryDTO.buyerInfo" clearable size="small" placeholder="请输入" />
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="卖家信息" prop="sellerInfo">
							<el-input v-model="queryDTO.sellerInfo" clearable size="small" placeholder="请输入" />
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label-width="10px" style="text-align:right">
							<el-button type="primary" icon="el-icon-search" size="mini" @click="getTableList()">搜索</el-button>
							<el-button
								icon="el-icon-refresh"
								size="mini"
								@click="resetQuery(['buyerInfo', 'createBeginTime', 'createEndTime', 'orderNo', 'sellerInfo', 'tradeMoneyMax', 'tradeMoneyMin', 'tradeNo', 'refundNo'])"
							>
								重置
							</el-button>
						</el-form-item>
					</el-col>
				</el-form>
			</el-row>
		</div>
		<div class="content-box">
			<right-toolbar :showSearch.sync="showSearch" @queryTable="getTableList"></right-toolbar>
			<el-table :data="tableList" style="width: 100%" v-loading="loading" v-if="!distinction">
				<el-table-column align="center" prop="createTime" label="创建时间" width="92">
					<template slot-scope="{ row }">
						{{ parseSecondTime(row.createTime) }}
					</template>
				</el-table-column>
				<el-table-column align="center" prop="orderId" label="主订单ID" width="180" :show-overflow-tooltip="true">
					<template slot-scope="{ row }">
						{{ row.orderId }}
					</template>
				</el-table-column>
				<el-table-column align="center" label="卖家信息" min-width="180" :show-overflow-tooltip="true">
					<template slot-scope="{ row }">
						<div>ID:{{ row.shopId }}</div>
						<div>{{ row.shopName }}</div>
					</template>
				</el-table-column>
				<el-table-column align="center" label="订单编号" min-width="180" :show-overflow-tooltip="true">
					<template slot-scope="{ row }">
						{{ row.orderNo }}
					</template>
				</el-table-column>
				<el-table-column align="center" prop="stripePaymentIntentId" label="支付交易号" min-width="200" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column align="center" label="买家信息" width="180" :show-overflow-tooltip="true">
					<template slot-scope="{ row }">
						<div>{{ row.userPhone }}</div>
						<div>{{ row.appNickName }}</div>
					</template>
				</el-table-column>
				<el-table-column align="center" prop="incomeType" label="收支类型" width="80" :show-overflow-tooltip="true">
					<template slot-scope="{ row }">
						<div>{{ row.incomeType == '0' ? '收入' : '支出' }}</div>
					</template>
				</el-table-column>
				<el-table-column align="center" prop="tradeMoney" label="金额(美元)">
					<template slot-scope="{ row }">
						<div style="color:#fd7d2c">+{{ row.tradeMoney }}</div>
					</template>
				</el-table-column>
				<el-table-column align="center" prop="tradeType" label="财务类型" width="80">
					<template slot-scope="{ row }">
						{{ row.tradeType == '0' ? '交易收入' : '' }}
					</template>
				</el-table-column>
			</el-table>
			<el-table :data="tableList" style="width: 100%" v-loading="loading" v-if="distinction">
				<el-table-column align="center" prop="refundApplyTime" label="申请时间" width="92">
					<template slot-scope="{ row }">
						{{ parseSecondTime(row.refundApplyTime) }}
					</template>
				</el-table-column>
				<el-table-column align="center" prop="orderCreateTime" label="下单时间" width="92">
					<template slot-scope="{ row }">
						{{ parseSecondTime(row.orderCreateTime) }}
					</template>
				</el-table-column>
				<el-table-column align="center" prop="orderId" label="主订单ID" width="180" :show-overflow-tooltip="true">
					<template slot-scope="{ row }">
						{{ row.orderId }}
					</template>
				</el-table-column>
				<el-table-column align="center" label="卖家信息" min-width="180" :show-overflow-tooltip="true">
					<template slot-scope="{ row }">
						<div>ID:{{ row.shopId }}</div>
						<div>{{ row.shopName }}</div>
					</template>
				</el-table-column>
				<el-table-column align="center" label="订单编号" min-width="180" :show-overflow-tooltip="true">
					<template slot-scope="{ row }">
						{{ row.orderNo }}
					</template>
				</el-table-column>
				<el-table-column align="center" prop="refundNo" label="退款编号" min-width="180" :show-overflow-tooltip="true">
					<template slot-scope="{ row }">
						{{ row.refundNo }}
					</template>
				</el-table-column>
				<el-table-column align="center" label="买家信息" width="180" :show-overflow-tooltip="true">
					<template slot-scope="{ row }">
						<div>{{ row.userPhone }}</div>
						<div>{{ row.appNickName }}</div>
					</template>
				</el-table-column>
				<el-table-column align="center" prop="refundMoney" label="退款金额(美元)" min-width="140" :show-overflow-tooltip="true">
					<template slot-scope="{ row }">-{{ row.refundMoney }}</template>
				</el-table-column>
				<el-table-column align="center" prop="refundType" label="财务类型" width="100" :show-overflow-tooltip="true">
					<template slot-scope="{ row }">
						{{ row.refundType == '0' ? '交易退款' : row.refundType == '1' ? '拒收手续费' : '银行拒收退款' }}
					</template>
				</el-table-column>
				<el-table-column align="center" label="操作" width="100" fixed="right">
					<template>
						<el-button size="mini" type="text">详情</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="queryDTO.current"
				:page-sizes="[10, 25, 50]"
				:page-size="queryDTO.size"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total"
				style="textAlign:right;paddingTop:20px"
			></el-pagination>
		</div>
	</div>
</template>
<script>
import { queryTradePageApi, queryRefundPageApi } from '@/api/order'
export default {
	name: 'trading_record',
	props: ['activeName'],
	data() {
		let today = new Date()
		// 今天 0点时间戳
		let todayStart = new Date(today.toDateString()).getTime()
		// 一天的时间戳
		let aDay = 24 * 60 * 60 * 1000
		return {
			timeType: 0,
			distinction: '',
			queryDTO: {
				buyerInfo: undefined, //买家信息
				createBeginTime: undefined, //创建开始时间 (交易流水)
				createEndTime: undefined, //创建结束时间 (交易流水)
				beginTime: undefined, //创建结束时间 (交易退款)
				endTime: undefined, //创建结束时间 (交易退款)
				current: 1, //页码,默认为1,示例值(1)
				orderNo: undefined, //订单号
				sellerInfo: undefined, //卖家信息
				size: 10, //页大小,默认为10,示例值(10)
				tradeMoneyMax: undefined, //最高交易金额（元
				tradeMoneyMin: undefined, //最低交易金额（元）
				tradeNo: undefined, //交易流水号
			},
			timeRanger: [],
			total: 0,
			deadline: aDay - 1000,
			loading: false,
			askApi: queryTradePageApi,
			showSearch: true,
			fastTime: [
				{ name: '今日', time: [todayStart, todayStart] },
				{ name: '昨日', time: [todayStart - aDay, todayStart - aDay] },
				{ name: '最近7天', time: [todayStart - aDay * 7, todayStart ] },
				{ name: '最近30天', time: [todayStart - aDay * 30, todayStart] },
			],
			tableList: [],
		}
	},
	computed: {},
	created() {
		if (!this.askApi) return this.$message.error('请设置askApi属性!')
	},
	mounted() {},
	watch: {},
	activated() {
		this.distinction = this.activeName.replace('tab-', '')
		this.tableList = []
		this.init()
	},
	methods: {
		init() {
			this.getTableList()
		},
		handleJump(row) {
			row.id = row.orderRefundId
			this.$router.push({
				path: '/order/sale_detail',
				query: {
					row: JSON.stringify(row),
				},
			})
		},
		// 获取表格数据
		getTableList() {
			this.loading = true
			let query
			if (this.distinction) {
				query = Object.assign({ timeType: this.timeType }, this.queryDTO)
				this.askApi = queryRefundPageApi
			} else {
				query = Object.assign({}, this.queryDTO)
				this.askApi = queryTradePageApi
			}
			this.askApi(query)
				.then(res => {
					if (res.code === 0) {
						this.tableList = res.data.records
						this.total = res.data.total
						this.loading = false
					} else {
						this.$message.error(res.message || '未知错误')
					}
				})
				.finally(() => {
					this.loading = false
				})
		},
		// 时间快速查询
		timeQuickQuery(e) {
			this.datePickerChange(e)
			this.loading = true
			let query
			if (this.distinction) {
				query = Object.assign({ timeType: this.timeType }, this.queryDTO)
				this.askApi = queryRefundPageApi
			} else {
				query = Object.assign({}, this.queryDTO)
				this.askApi = queryTradePageApi
			}
			console.log(query)
			this.askApi(query)
				.then(res => {
					if (res.code === 0) {
						this.tableList = res.data.records
						this.total = res.data.total
						this.loading = false
					} else {
						this.$message.error(res.message || '未知错误')
					}
				})
				.finally(() => {
					this.loading = false
					this.queryDTO.createBeginTime = this.timeRanger[0]
					this.queryDTO.createEndTime = this.timeRanger[1]
				})
		},
		// 日期选择器change时间
		datePickerChange(e) {
			if (this.distinction) {
				this.queryDTO.beginTime = parseInt(e[0] / 1000)
				this.queryDTO.endTime = parseInt((e[1] +this.deadline) / 1000)
				console.log(this.queryDTO.endTime);
			} else {
				this.queryDTO.createBeginTime = parseInt(e[0] / 1000)
				this.queryDTO.createEndTime = parseInt((e[1] + this.deadline) / 1000)
			}
		},
		// 每页有几条?
		handleSizeChange(val) {
			this.queryDTO.size = val
			this.getTableList()
		},
		// 当前是多少页？
		handleCurrentChange(val) {
			this.queryDTO.current = val
			this.getTableList()
		},
		// 重置按钮，需将重置的参数作为一个数组传进来，size && current 不用传
		resetQuery(arr) {
			this.queryDTO.size = 10
			this.queryDTO.current = 1
			this.timeRanger = []
			this.timeType = 0
			arr.forEach(item => {
				this.queryDTO[item] = undefined
			})
			this.getTableList()
		},
		// 路由跳转
		routerPush(path, query) {
			this.$router.push({ path, query })
		},
	},
}
</script>

<style scoped lang="scss">
$BgColor: #f5f5f7;

.el-form-item {
	padding: 5px 0;
}
pre {
	display: inline-block;
	margin: 0;
}
.el-table {
	::v-deep .el-table__expanded-cell {
		padding: 0;
	}

	::v-deep .promotion-table {
		background-color: $BgColor;
		border: 1px solid #ccc;

		> td {
			border-top: 1px solid #ccc;
		}

		td:nth-of-type(1) {
			border-left: 1px solid #ccc;
		}

		td:last-of-type {
			border-right: 1px solid #ccc;
		}
	}

	::v-deep .promotion-table:hover > td {
		background-color: #eff5ff !important;
	}
}

/* table */
.goodsdata-name {
	display: flex;
	align-items: center;
	.el-image {
		width: 40px;
		height: 40px;
		flex: 27%;
		max-width: 40px;
		i {
			font-size: 20px;
			color: #aaa;
		}
	}

	&-desc {
		padding: 10px 0;
		margin-left: 20px;
		div:nth-of-type(1) {
			font-weight: bold;
			display: -webkit-box;
			text-overflow: ellipsis;
			overflow: hidden;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2; //当属性值为3，表示超出3行隐藏
		}
	}
}
.tableShopName {
	font-size: 14px;
	font-weight: bold;
	color: #222323;
}
::v-deep .el-table--scrollable-x .el-table__body-wrapper :not(:last-child) {
	overflow: hidden;
}
.fixed-width {
	display: flex;
	flex-direction: column;
}

.table-sort {
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	right: 0;
	padding: 0 18px;
	color: white;
	font-size: 16px;
	top: 0;
	background-color: #fd7c25;
}
</style>

<style lang="scss" scoped>
.fastTime-st {
	padding-left: 20px;
	cursor: pointer;
}
.fastTime-st:hover{
	color: #1890ff;
}
.text-highlight{
	color: #1890ff;
}
</style>
