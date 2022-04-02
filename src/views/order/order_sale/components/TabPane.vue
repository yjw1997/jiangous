<template>
	<div class="dashboard-editor-container">
		<!-- 用户搜索 -->
		<div class="search-box" v-show="showSearch">
			<el-row :gutter="20">
				<el-form :model="queryParams" ref="queryForm" label-width="68px" label-position="left">
					<el-col :span="8">
						<el-form-item label="商品名称" prop="goodsName">
							<el-input v-model="queryParams.goodsName" clearable size="small" placeholder="请输入" @keyup.enter.native="loadData(1)" />
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="买家账号" prop="appNickName">
							<el-input v-model="queryParams.appNickName" clearable size="small" placeholder="请输入" @keyup.enter.native="loadData(1)" />
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="订单编号" prop="orderNo">
							<el-input v-model="queryParams.orderNo" clearable size="small" placeholder="请输入" @keyup.enter.native="loadData(1)" />
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="申请时间" prop="orderNo">
							<el-date-picker
								v-model="timeRanger"
								type="daterange"
								:picker-options="pickerOptions"
								range-separator="至"
								start-placeholder="开始日期"
								end-placeholder="结束日期"
								align="right"
								style="width:100%"
								value-format="timestamp"
							></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="退款状态" prop="refundStatus ">
							<w-dict-select-tag dictCode="refundStatus " v-model="queryParams.refundStatus" />
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="退款原因" prop="refundId">
							<w-dict-select-tag dictCode="orderRefundReasonType" v-model="queryParams.refundId" />
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="退款编号" prop="orderRefundNo">
							<el-input v-model="queryParams.orderRefundNo" placeholder="请输入" />
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-row :gutter="5">
							<el-col :span="13">
								<el-form-item label="退款金额" prop="refundMoneyMin">
									<el-input v-model="queryParams.refundMoneyMin" clearable size="small" placeholder="最低" @keyup.enter.native="loadData(1)" />
								</el-form-item>
							</el-col>
							<el-col :span="11">
								<el-form-item label="至" prop="refundMoneyMax" label-width="20px">
									<el-input v-model="queryParams.refundMoneyMax" clearable size="small" placeholder="最高" @keyup.enter.native="loadData(1)" />
								</el-form-item>
							</el-col>
						</el-row>
					</el-col>
					<el-col :span="24">
						<el-form-item label-width="10px" style="text-align:right">
							<el-button type="primary" icon="el-icon-search" size="mini" @click="loadData(1)">搜索</el-button>
							<el-button icon="el-icon-refresh" size="mini" @click="resetQuery()">重置</el-button>
						</el-form-item>
					</el-col>
				</el-form>
			</el-row>
		</div>
		<div class="content-box">
			<el-table
				v-loading="loading"
				:data="dataSource"
				default-expand-all
				:span-method="spanMethod"
				:rowKey="rowKey"
				row-class-name="promotion-table"
				@selection-change="handleSelectionChange"
			>
				<el-table-column width="20"></el-table-column>
				<el-table-column type="expand">
					<template #default="{ row }">
						<div class="tablecolumn-card card01">
							<div class="">
								<el-row justify="space-between">
									<el-col :span="5">
										<div class="goodsdata-name">
											<el-image :src="row.goodsPic" fit="cover">
												<div slot="error" class="image-slot">
													<i class="el-icon-picture-outline" />
												</div>
											</el-image>
											<div class="goodsdata-name-desc">
												<el-tooltip :content="row.goodsName" placement="top">
													<div>{{ row.goodsName }}</div>
												</el-tooltip>
												<div class="goodsdata-name-specDetail">
													<span v-for="(item, index) in row.specDetail" :key="index">颜色分类:{{ item.name }}&nbsp;尺码:{{ item.value }}</span>
												</div>
												<div class="text-muted">{{ `单价:${parseInt(row.refundMoney).toFixed(2) || 0}* ${row.refundCount || 0}` }}</div>
												<!--                        <div class="text-muted">{{row.valueId}}</div>-->
											</div>
										</div>
									</el-col>
									<el-col :span="4">
										<div class="mt30 text-muted word">{{ row.refundReason }}</div>
									</el-col>
									<el-col :span="3">
										<div class="mt30 text-muted">
											<div :class="row.refundStatus === 0 ? 'red' : ''">
												{{ stateFormatter(row) }}
											</div>
											<div v-if="row.refundStatus !== 3 && row.refundStatus !== 1" :class="row.refundStatus === 0 ? 'red' : ''">{{ transformation(row) }}</div>
										</div>
									</el-col>
									<el-col :span="3">
										<div class="mt30 text-muted">{{ getFloat(row.tradeMoney, 2) }}</div>
									</el-col>
									<el-col :span="3">
										<div class="mt30 red">{{ getFloat(row.refundMoney, 2) }}</div>
									</el-col>
									<el-col :span="3">
										<div class="mt30 text-muted">{{ formatter(row.goodsDeliverStatus) }}</div>
									</el-col>
									<el-col :span="3">
										<div class="mt20">
											<el-button type="text" @click="pirvateDetail(row)">
												{{ activeName === 'tab-3' ? '退款处理' : '查看详情' }}
											</el-button>
										</div>
									</el-col>
								</el-row>
							</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="商品名称" prop="goodsName" min-width="175" :show-overflow-tooltip="true">
					<template #default="{ row }">
						<div class="info-title">
							<div class="title-left">
								<el-row>
									<el-col :span="6">
										<div class="hidden">退款编号：{{ row.orderRefundNo }}</div>
									</el-col>
									<el-col :span="6">
										<div class="hidden">订单编号：{{ row.orderNo }}</div>
									</el-col>
									<el-col :span="4">
										<div class="hidden">
											买家昵称：
											<span class="blue">{{ row.appNickName }}</span>
										</div>
									</el-col>
									<el-col :span="7">
										<div class="hidden">申请时间：{{ parseTime(row.createTime) }}</div>
									</el-col>
								</el-row>
							</div>
							<div v-if="row.cutDownTime !== null" :class="row.applyUser === 1 ? 'red' : ''">
								{{ getWordAnaly(row.applyUser) }}
								{{ totalDownTime(row.cutDownTime) }}
							</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="原因" prop="shopName" min-width="155" :show-overflow-tooltip="true" />
				<el-table-column label="退款状态" prop="deliverType" min-width="110" :show-overflow-tooltip="true" />
				<el-table-column label="交易金额($)" prop="orderMoney" min-width="120" :show-overflow-tooltip="true" />
				<el-table-column label="退款金额($)" prop="phone" min-width="120" :show-overflow-tooltip="true" />
				<el-table-column label="商品状态" prop="phone" min-width="110" :show-overflow-tooltip="true" />
				<el-table-column label="操作" align="center" width="120"></el-table-column>
				<el-table-column width="120"></el-table-column>
			</el-table>
			<pagination :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" :ipagination="ipagination" @pagination="loadData" />
		</div>
		<close-modal ref="closeModal" @OK="modelOK"></close-modal>
		<check-pick-modal ref="pickModal" @OK="modelOK"></check-pick-modal>
		<collection-modal ref="collectionModal" @OK="modelOK"></collection-modal>
		<certificateAudit-modal ref="certificateAuditModal" @OK="modelOK"></certificateAudit-modal>
	</div>
</template>

<script>
import { ListMixin } from '@/mixins/wtrfyListMixin'
import closeModal from './modal/closeModal.vue'
import checkPickModal from './modal/checkPickModal.vue'
import collectionModal from './modal/collectionModal.vue'
import certificateAuditModal from './modal/certificateAuditModal.vue'
import { querySalePageList } from '@/api/afterSale.js'

export default {
	mixins: [ListMixin],
	name: 'order_list',
	components: { closeModal, checkPickModal, collectionModal, certificateAuditModal },
	props: ['activeName'],
	data() {
		return {
			url: {
				list: querySalePageList,
			},
			queryParams: {
				searchType: 0,
			},
			rowKey: 'id',
			disableMixinCreated: true,
			timeRanger: [],
			pickerOptions: {
				shortcuts: [
					{
						text: '今日订单',
						onClick(picker) {
							const end = new Date()
							const start = new Date()
							end.setTime(start.getTime() + 3600 * 1000 * 24 * 1)
							picker.$emit('pick', [start, end])
						},
					},
					{
						text: '最近一周',
						onClick(picker) {
							const end = new Date()
							const start = new Date()
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
							picker.$emit('pick', [start, end])
						},
					},
					{
						text: '最近一个月',
						onClick(picker) {
							const end = new Date()
							const start = new Date()
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
							picker.$emit('pick', [start, end])
						},
					},
				],
			},
			closeBatchButtonDisabled: true,
			printOPtion: [
				{
					key: 0,
					label: '未打印',
				},
				{
					key: 1,
					label: '已打印',
				},
			],
			deliverTypeOPtion: [
				{
					key: 0,
					label: '物流配送',
				},
				{
					key: 1,
					label: '商家配送',
				},
			],
			deliverModeOPtion: [
				{
					key: 0,
					label: '商品配送',
				},
				{
					key: 1,
					label: '门店自提',
				},
			],
		}
	},
	computed: {},
	created() {},
	mounted() {},

	watch: {
		timeRanger: {
			handler(date) {
				if (!date) {
					this.queryParams.createBeginTime = ''
					this.queryParams.createEndTime = ''
					return
				}
				this.queryParams.createBeginTime = parseInt(date[0] / 1000)
				this.queryParams.createEndTime = parseInt(date[1] / 1000) + 24 * 60 * 60 - 1
			},
			immediate: true,
		},
	},

	activated() {
		this.queryParams.searchType = +this.activeName.replace('tab-', '')
		this.loadData()
	},
	methods: {
		resetQuery(obj = {}) {
			this.queryParams = obj
			/* 分页参数 */
			this.ipagination = {
				current: 1,
				pageSize: 10,
				pageSizeOptions: ['10', '25', '50'],
				showTotal: (total, range) => {
					return range[0] + '-' + range[1] + ' 共' + total + '条'
				},
				layout: 'total, sizes, prev, pager, next, jumper',
				total: 0,
			}
			this.timeRanger = []
			this.loadData(1)
		},
		getWordAnaly(applyUser) {
			switch (applyUser) {
				case 0:
					return '等待买家响应时间:'
				case 1:
					return '剩余处理时间:'
			}
		},
		totalDownTime(cutDownTime) {
			const diff = cutDownTime - Date.parse(new Date()) / 1000
			if (diff > 0) {
				const days = parseInt(diff / 86400)
				const hours = parseInt(diff / 3600) - 24 * days
				const minutes = parseInt((diff % 3600) / 60)
				const seconds = parseInt(diff % 60)
				return `${days}天${hours}小时${minutes}分钟${seconds}秒`
			}
			return `0天0小时0分钟0秒`
		},
		pirvateDetail(row) {
			this.$router.push({
				path: '/order/sale_detail',
				query: {
					row: JSON.stringify(row),
				},
			})
		},
		stateFormatter({ finalRefundStatus, refundStatus }) {
			if (finalRefundStatus === 601) {
				return '平台退款失败'
			}
			switch (refundStatus) {
				case 0:
					return '退款待处理'
				case 1:
					return '退款成功'
				case 2:
					return '已拒绝退款'
				case 3:
					return '退款关闭'
			}
		},
		transformation({ rejectStatus, refundStatus, finalRefundStatus }) {
			switch (finalRefundStatus) {
				case 101:
					return '(待商家处理)'
				case 102:
					return '(平台拒绝)'
				case 201:
					return '(商家拒绝)'
				case 202:
					return '(平台拒绝)'
				case 301:
					return '(待商家处理)'
				default:
					return ''
			}
		},
		formatter(data) {
			switch (data) {
				case 0:
					return '待发货'
				case 1:
					return '待取货'
				case 2:
					return '已发货'
				case 3:
					return '已取货'
				case 4:
					return '查看详情'
			}
		},
		//  分页查询
		loadData(arg) {
			if (!this.url || !this.url.list) {
				this.$message.error('请设置url.list属性!')
				return
			}
			let getAction = this.url.list
			// 加载数据 若传入参数1则加载第一页的内容
			if (arg === 1) {
				this.ipagination.current = 1
			}
			var params = this.getQueryParams() // 查询条件
			this.loading = true
			return getAction(params).then(res => {
				if (res.code === 0) {
					this.dataSource = res.data.records || res.data
					this.dataSource.forEach(item => {
						if (typeof item.orderStatus === 'number') {
							item.orderStatus = item.orderStatus.toString()
						}
					})
					this.ipagination.total = res.total || res.data.total || this.dataSource.length + 1
				}
				if (res.code !== 0) {
					this.$message.warning(res.message)
				}
				this.loading = false
			})
		},
		spanMethod({ columnIndex }) {
			if (columnIndex === 2) {
				return [1, 9]
			} else if (columnIndex === 0) {
				return [1, 1]
			} else {
				return [0, 0]
			}
		},
		// 多选框选中数据
		handleSelectionChange(selectionRows) {
			this.selectionRows = selectionRows
			this.selectedRowKeys = selectionRows.map(item => {
				return item[this.rowKey]
			})
			this.closeBatchButtonDisabled = selectionRows.every(row => {
				return row.orderStatus.startsWith('1') || row.orderStatus.startsWith('2') || row.orderStatus.startsWith('3')
			})
			this.single = selectionRows.length != 1
			this.multiple = !selectionRows.length
		},
		//  是否显示右上角排序
		showTableSort(row) {
			if (row.sort && row.sort !== null && (row.orderStatus == 201 || row.orderStatus == 301)) {
				return true
			}
			return false
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
.card01 {
	padding: 30px;
}
.hidden {
	overflow-x: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.info-title {
	display: flex;
	justify-content: space-between;
}
::v-deep .cell.el-tooltip {
	width: 100% !important;
}
.title-left {
	width: 55vw;
}
.word {
	padding-left: 10px;
}
</style>