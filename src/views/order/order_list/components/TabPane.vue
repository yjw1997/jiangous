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
						<el-form-item label="买家账号" prop="appUserPhone">
							<el-input v-model="queryParams.appUserPhone" clearable size="small" placeholder="请输入" @keyup.enter.native="loadData(1)" />
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="商家名称" prop="shopName">
							<el-input v-model="queryParams.shopName" clearable size="small" placeholder="请输入" @keyup.enter.native="loadData(1)" />
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="打印状态" prop="printStatus">
							<el-select v-model="queryParams.printStatus" clearable style="width:100%">
								<el-option v-for="option in printOPtion" :key="option.key" :value="option.key" :label="option.label" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="配送类型" prop="deliverType">
							<el-select v-model="queryParams.deliverType" clearable style="width:100%">
								<el-option v-for="option in deliverTypeOPtion" :key="option.key" :value="option.key" :label="option.label" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="创建时间" prop="orderNo">
							<el-date-picker
								v-model="timeRanger"
								type="daterange"
								:picker-options="pickerOptions"
								range-separator="至"
								start-placeholder="开始日期"
								end-placeholder="结束日期"
								align="center"
								style="width:100%"
								value-format="timestamp"
							></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-row :gutter="5">
							<el-col :span="13">
								<el-form-item label="订单金额" prop="orderMoneyStart">
									<el-input v-model="queryParams.orderMoneyStart" clearable size="small" placeholder="最低" @keyup.enter.native="loadData(1)" />
								</el-form-item>
							</el-col>
							<el-col :span="11">
								<el-form-item label="至" prop="orderMoneyEnd" label-width="20px">
									<el-input v-model="queryParams.orderMoneyEnd" clearable size="small" placeholder="最高" @keyup.enter.native="loadData(1)" />
								</el-form-item>
							</el-col>
						</el-row>
					</el-col>
					<el-col :span="8">
						<el-form-item label="配送方式" prop="deliverMode">
							<el-select v-model="queryParams.deliverMode" clearable style="width:100%">
								<el-option v-for="option in deliverModeOPtion" :key="option.key" :value="option.key" :label="option.label" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="订单编号" prop="orderNo">
							<el-input v-model="queryParams.orderNo" clearable size="small" placeholder="请输入" @keyup.enter.native="loadData(1)" />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label-width="10px" style="text-align:right">
							<el-button type="primary" icon="el-icon-search" size="mini" @click="loadData(1)">搜索</el-button>
							<el-button icon="el-icon-refresh" size="mini" @click="resetQuery({ orderStatus: queryParams.orderStatus })">重置</el-button>
						</el-form-item>
					</el-col>
				</el-form>
			</el-row>
		</div>
		<div class="content-box">
			<!-- 操作按钮 -->
			<el-row :gutter="10" class="mb8">
				<el-col :span="1.5">
					<el-button type="primary" :disabled="loading || multiple" plain icon="el-icon-circle-plus-outline" size="mini" @click="handleRemark()">批量备注</el-button>
				</el-col>
				<el-col :span="1.5">
					<el-button type="primary" :disabled="loading || multiple" plain icon="el-icon-circle-plus-outline" size="mini" @click="handleOrderPrint()">批量打印订单</el-button>
				</el-col>
				<el-col :span="1.5">
					<el-button size="mini" type="primary" :disabled="loading || multiple || !closeBatchButtonDisabled" plain icon="el-icon-circle-close" @click="handleBatchClose()">
						批量关闭交易
					</el-button>
				</el-col>
				<el-col :span="1.5">
					<el-button
						size="mini"
						type="primary"
						:disabled="checkCodeDisabled()"
						plain
						icon="el-icon-c-scale-to-original"
						@click="handlecheckCode()"
						v-if="queryParams.orderStatus === '302'"
					>
						取货码核对
					</el-button>
				</el-col>
				<right-toolbar :showSearch.sync="showSearch" @queryTable="loadData"></right-toolbar>
			</el-row>
			<el-table
				v-loading="loading"
				align="center"
				:data="dataSource"
				default-expand-all
				:span-method="spanMethod"
				:rowKey="rowKey"
				row-class-name="promotion-table"
				@selection-change="handleSelectionChange"
			>
				<el-table-column type="selection" width="55"></el-table-column>
				<el-table-column type="expand">
					<template slot-scope="{ row }">
						<div class="tablecolumn-card">
							<el-table
								:data="row.orderGoodsDetailVOList"
								tooltip-effect="dark"
								:show-header="false"
								style="width: 100%"
								:span-method="objectSpanMethod"
								default-expand-all
								border
								ref="table"
								:show-summary="row.shopOrderRemark && row.shopOrderRemark !== null ? true : false"
								:sum-text="`订单备注:${row.shopOrderRemark}`"
							>
								<el-table-column prop="name" min-width="150">
									<template slot-scope="scope">
										<div class="goodsdata-name">
											<el-image :src="scope.row.goodsPic" fit="cover">
												<div slot="error" class="image-slot">
													<i class="el-icon-picture-outline" />
												</div>
											</el-image>
											<div class="goodsdata-name-desc">
												<el-tooltip :content="scope.row.goodsName" placement="top">
													<div>{{ scope.row.goodsName }}</div>
												</el-tooltip>
												<div class="goodsdata-name-specDetail">
													<span v-for="(item, index) in scope.row.specDetail" :key="index">
														{{ item.name + ':' + item.value }}
													</span>
												</div>
												<div>{{ `单价:${scope.row.realPrice.toFixed(2) || 0}* ${scope.row.goodsCount || 0}` }}</div>
											</div>
										</div>
									</template>
								</el-table-column>
								<el-table-column min-width="120" align="center">
									<template>
										<div class="tableShopName">{{ row.shopName }}</div>
									</template>
								</el-table-column>
								<el-table-column min-width="100" align="center">
									<template>
										<div v-if="row.deliverMode === 0">商品配送</div>
										<div v-if="row.deliverMode === 1">门店自提</div>
										<div v-if="row.deliverType !== 0 && row.deliverType !== 1">（/）</div>
										<div v-else-if="row.deliverType === 0">物流配送</div>
										<div v-else-if="row.deliverType === 1">商家配送</div>
									</template>
								</el-table-column>
								<el-table-column min-width="100" align="center">
									<template slot-scope="scope">
										<div>
											<span v-if="scope.row.refundStatus == 3 || scope.row.refundStatus ===null">/</span>
											<div v-else :style="{'color':scope.row.refundStatus ? '#999999':'#FF0000' }">
												<i class="el-icon-info" v-if="scope.row.applyType != null"></i>
												{{ scope.row.refundStatus | filAfterState }}
												<div>{{ scope.row.applyType | filAfterStateRank }}</div>
											</div>
											<!-- <span v-if="scope.row.applyType === null">/</span>
											<i class="el-icon-info" v-if="scope.row.applyType !== null"></i>
											{{ scope.row.refundStatus | filAfterState }}
											<div>{{ scope.row.applyType | filAfterStateRank }}</div> -->
										</div>
									</template>
								</el-table-column>
								<el-table-column min-width="100" align="center">
									<template>
										<div>{{ row.orderMoney.toFixed(2) || '__' }}</div>
										<!-- 无条件包邮,包邮(满足条件) ,未达包邮,不包邮-->
										{{ packageFeeChange(row) }}
									</template>
								</el-table-column>
								<el-table-column min-width="100" align="center">
									<template>
										<!-- <span v-if="row.orderStatus.startsWith('1')">
											等待买家上传凭证
											<div v-if="row.orderStatus === '102'">(商家驳回凭证)</div>
										</span>
										<span v-if="row.orderStatus.startsWith('2')">待商家确认收款</span>
										<span v-if="row.orderStatus === '301'">待发货</span>
										<span v-if="row.orderStatus === '302'">待取货</span>
										<span v-if="row.orderStatus.startsWith('4')">
											已发货
											<div v-if="row.delivered === true">(部分发货)</div>
										</span>
										<span v-if="row.orderStatus.startsWith('5')">交易完成</span>
										<span v-if="row.orderStatus.startsWith('6')">交易关闭</span>-->
										<span>
											{{ row.orderStatus | filTradingStatus }}
											<div v-if="row.delivered && row.orderStatus === '302'">(部分发货)</div>
										</span>
									</template>
								</el-table-column>
								<el-table-column min-width="80" align="center">
									<template>
										{{ row.printStatus === 0 ? '未打印' : '已打印' }}
									</template>
								</el-table-column>
								<el-table-column min-width="120" align="center" class-name="small-padding">
									<template>
										<div class="fixed-width">
											<el-button size="mini" type="text" icon="el-icon-document" @click="handleDetail(row)"><pre>详情&nbsp;&nbsp;&nbsp;&nbsp;</pre></el-button>
											<el-button size="mini" type="text" icon="el-icon-s-promotion" @click="handleLogistics(row)" v-if="showLogisticsButton(row)">
												<pre>查看物流&nbsp;&nbsp;</pre>
											</el-button>
											<el-button size="mini" type="text" icon="el-icon-document" @click="handleOrderPrint(row)">打印订单</el-button>
											<el-button size="mini" type="text" icon="el-icon-circle-plus-outline" @click="handleRemark(row)">订单备注</el-button>
											<el-button size="mini" type="text" icon="el-icon-c-scale-to-original" @click="handlecheckCode(row)" v-if="row.orderStatus === '302'">取货码核对</el-button>
											<!-- <el-button size="mini" type="text" icon="el-icon-s-operation" @click="handleReimburse(row)" v-if="row.orderGoodsDetailVOList[0].refundBtn !=3">{{row.orderGoodsDetailVOList[0].refundBtn ==0?"主动退款":"处理退款"}}</el-button> -->
											<el-button size="mini" type="text" icon="el-icon-s-operation" @click="handleReimburse(row)" v-if="handleReimburse(row, true)">处理退款</el-button>
											<el-button size="mini" type="text" icon="el-icon-circle-close" @click="handleClose(row)" v-if="showCloseButton(row)">关闭交易</el-button>
											<!-- <el-button size="mini" type="text" icon="el-icon-finished" @click="handleUserCertificateAudit(row)" v-if="row.orderStatus.startsWith('2')">
												审核交易凭证
											</el-button> -->
											<!-- v1.1.0  暂做隐藏处理 -->
											<!-- <el-button
												size="mini"
												type="text"
												icon="el-icon-circle-check"
												@click="handlesubmitCollection(row)"
												v-if="row.orderStatus.startsWith('1')"
												>确认收款
											</el-button> -->
											<el-button size="mini" type="text" icon="el-icon-s-promotion" @click="handleSendGoods(row)" v-if="showSendGoodsButton(row)">
												<pre>发货&nbsp;&nbsp;&nbsp;&nbsp;</pre>
											</el-button>
										</div>
									</template>
								</el-table-column>
							</el-table>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="商品名称" prop="goodsName" min-width="150" :show-overflow-tooltip="true">
					<template slot-scope="{ row }">
						<span>订单号：{{ row.orderNo }}</span>
						<span>买家昵称：{{ row.appNickName }}</span>
						<span>买家账号：{{ row.phone }}</span>
						<span>创建时间：{{ parseTime(row.createTime) }}</span>
						<div
							class="table-sort"
							v-show="showTableSort(row)"
							:style="{
								backgroundColor: row.orderStatus == '201' ? '#fd7c25' : row.orderStatus == '301' ? '#ff5e5e' : '',
							}"
						>
							{{ row.sort }}
						</div>
						<el-button type="text" icon="el-icon-refresh" style="float:right;fontSize:12px;height:18px;marginTop:-6px" v-show="row.orderStatus == 103" @click="handlePay(row)">
							刷新支付状态
						</el-button>
					</template>
				</el-table-column>
				<el-table-column label="商家名称" prop="shopName" min-width="120" :show-overflow-tooltip="true" />
				<el-table-column label="配送方式" prop="deliverType" min-width="100" :show-overflow-tooltip="true" />
				<el-table-column label="售后状态" prop="deliverType" min-width="100" :show-overflow-tooltip="true" />
				<el-table-column label="交易金额($)" prop="orderMoney" min-width="100" :show-overflow-tooltip="true" />
				<el-table-column label="交易状态" prop="phone" min-width="100" :show-overflow-tooltip="true" />
				<el-table-column label="打印订单" prop="phone" min-width="80" :show-overflow-tooltip="true" />
				<el-table-column label="操作" align="center" min-width="120"></el-table-column>
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
import { queryOrderPageList, orderBatchRemarkApi, refreshPayStatusApi } from '@/api/order'
import closeModal from './modal/closeModal.vue'
import checkPickModal from './modal/checkPickModal.vue'
import collectionModal from './modal/collectionModal.vue'
import certificateAuditModal from './modal/certificateAuditModal.vue'
import { validateName } from '@/utils/validate.js'
export default {
	mixins: [ListMixin],
	name: 'order_list',
	components: { closeModal, checkPickModal, collectionModal, certificateAuditModal },
	props: ['activeName'],
	data() {
		return {
			url: {
				list: queryOrderPageList,
			},
			rowKey: 'orderNo',
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

	filters: {
		//售后状态
		filAfterStateRank: function(value) {
			if (value === null) return ''
			let str = ''
			value = Number(value)
			switch (value) {
				case 0:
					str = '(买家发起退款)'
					break
				case 1:
					str = '(卖家发起退款)'
					break
				case 2:
					str = '(平台退款)'
					break
			}
			return str
		},
		filAfterState(value) {
			if (value === null) return ''
			let str = ''
			value = Number(value)
			switch (value) {
				case 0:
					str = '退款申请中'
					break
				case 1:
					str = '退款成功'
					break
				case 2:
					str = '已拒绝退款'
					break
				case 3:
					str = '退款关闭'
					break
			}
			return str
		},
		//交易状态
		filTradingStatus: function(value) {
			if (value.startsWith('6')) {
				return '交易关闭'
			}
			let status = Number(value)
			let str = ''
			switch (status) {
				case 103:
					str = '等待买家付款'
					break
				case 301:
					str = '待发货'
					break
				case 302:
					str = '待取货'
					break
				case 401:
					str = '已发货'
					break
				case 501:
					str = '交易完成'
					break
			}
			return str
		},
	},
	watch: {
		timeRanger: {
			handler(date) {
				if (!date || date === null) {
					this.queryParams.createStartTime = ''
					this.queryParams.createEndTime = ''
					return
				}
				this.queryParams.createStartTime = parseInt(date[0] / 1000)
				this.queryParams.createEndTime = parseInt(date[1] / 1000) + 24 * 60 * 60 - 1
			},
			immediate: true,
		},
	},

	activated() {
		this.queryParams.orderStatus = this.activeName.replace('tab-', '')
		if (this.$route.query && this.$route.query.edit) {
			this.queryParams.shopName = JSON.parse(decodeURIComponent(this.$route.query.edit)).shopName
			this.queryParams.appUserPhone = JSON.parse(decodeURIComponent(this.$route.query.edit)).appUserPhone
		}
		this.loadData()
	},
	methods: {
		init() {},
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
		objectSpanMethod({ columnIndex, rowIndex }) {
			this.$nextTick(() => {
				let current = this.$el.querySelectorAll('.el-table__footer')
				if (current.length > 0) {
					Array.prototype.forEach.call(current, element => {
						var cell = element.rows[0].cells
						cell[1].style.display = 'none'
						cell[0].colSpan = '10'
					})
				}
			})
			if (columnIndex === 0) {
				return [1, 1]
			} else if (columnIndex === 3) {
				return [1, 1]
			} else if (rowIndex === 6) {
				return [10, 1]
			} else {
				if (rowIndex === 0) {
					return [10, 1]
				} else {
					return [0, 0]
				}
			}
		},
		packageFeeChange(row) {
			let str = ''
			if (row.packageFlag) {
				// 无条件包邮
				str = '包邮'
			} else {
				if (!row.conditionFlag) {
					// 不包邮
					str = `不包邮(运费$${row.expressFee.toFixed(2)})`
				} else {
					if (row.orderMoney >= row.packageFee) {
						// 包邮(满足条件)
						str = `包邮(满${row.packageFee.toFixed(2)}免邮)`
					} else {
						// 未达包邮
						str = `含运费$${row.expressFee.toFixed(2)}(满${row.packageFee.toFixed(2)}免邮)`
					}
				}
			}
			return str
		},

		//  打印订单(单件)
		handleOrderPrint(row) {
			row = row
				? { orderPrintList: [{ orderNo: row.orderNo, sort: row.sort }] }
				: {
						orderPrintList: this.selectionRows.map(item => {
							return { orderNo: item.orderNo, sort: item.sort }
						}),
				  }
			let url = encodeURIComponent(JSON.stringify(row))
			this.$router.push({
				path: '/order/order_print',
				query: { edit: url },
			})
		},
		//  订单备注
		handleRemark(row) {
			let data = row ? [row.orderNo] : this.selectedRowKeys
			this.$prompt('订单备注信息仅自己可见', {
				type: 'info',
				title: '订单备注',
				inputType: 'textarea',
				inputValue: row ? row.shopOrderRemark : '',
				rows: 10,
				showWordLimit: true,
				maxlength: 100,
				inputPlaceholder: '订单备注',
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				// inputPattern: /^.{1,500}$/,
				inputValidator: value => {
					return validateName(value, 1, 200)
				},
				inputErrorMessage: '订单备注不能为空',
			})
				.then(({ value }) => {
					if (!value || value === null) {
						this.$message.info('请输入备注信息')
						return
					}
					let obj = {
						orderNos: data,
						shopOrderRemark: value,
					}
					return this.orderRemark(obj)
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '取消输入',
					})
				})
		},
		//  备注
		orderRemark(data) {
			console.log('%c [ data ]', 'font-size:13px; background:pink; color:#bf2c9f;', data)
			orderBatchRemarkApi(data)
				.then(res => {
					this.$message.success(res.message || '操作成功')
					this.loadData()
				})
				.catch(err => {
					this.$message.error(err.message || '服务器错误')
				})
		},
		//是否显示关闭按钮
		showCloseButton(row) {
			// if (row.orderStatus.startsWith('1') || row.orderStatus.startsWith('2') || row.orderStatus.startsWith('3')) {
			// 	return true
			// } else {
			// 	return false
			// }
			return row.orderStatus == 103
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
		//  关闭订单(单个)
		handleClose(row) {
			this.$refs.closeModal.show({ orderNos: [row.orderNo] })
			this.$refs.closeModal.title = '交易取消'
		},
		//  关闭订单(批量)
		handleBatchClose() {
			let obj = { orderNos: this.selectedRowKeys }
			this.$refs.closeModal.title = '交易取消'
			this.$refs.closeModal.flag = 'batch'
			this.$refs.closeModal.show(obj)
		},
		//  取货码按钮禁用
		checkCodeDisabled() {
			if (this.loading || this.single) {
				return true
			}
			return this.selectionRows.every(item => item.orderStatus != 302)
		},
		// 核对取货码
		handlecheckCode(row) {
			row = row ? { shopId: row.shopId } : { shopId: this.selectionRows[0].shopId }
			console.log('%c [ row ]', 'font-size:13px; background:pink; color:#bf2c9f;', row)
			this.$refs.pickModal.title = '取货码核对'
			this.$refs.pickModal.show(row)
		},
		//处理退款
		handleReimburse(row, flag) {
			if (flag) {
				let boolean
				row.orderGoodsDetailVOList.forEach(item => {
					if (item.refundBtn == 1 && item.refundStatus != 3) {
						boolean = true
					}
				})
				return boolean
			}
			let url = encodeURIComponent(JSON.stringify({ orderNo: row.orderNo, orderStatus: row.orderStatus, shopId: row.shopId, onEarth: true }))
			this.$router.push({
				path: '/order/order_list/order_detail',
				query: { edit: url },
			})
		},
		// 确认收款
		handlesubmitCollection(row) {
			this.$refs.collectionModal.title = '确认收款'
			this.$refs.collectionModal.flag = 'edit'
			let obj = {
				orderNo: row.orderNo,
				orderStatus: row.deliverMode == '0' ? 301 : 302,
				deliverMode: row.deliverMode,
				shopId: row.shopId,
			}
			this.$refs.collectionModal.show(obj)
		},
		//  审核交易凭证
		handleUserCertificateAudit(row) {
			this.$refs.certificateAuditModal.title = '审核交易凭证'
			this.$refs.certificateAuditModal.show(row)
		},
		handleDetail(row) {
			let url = encodeURIComponent(JSON.stringify({ orderNo: row.orderNo, orderStatus: row.orderStatus, shopId: row.shopId }))
			this.$router.push({
				path: '/order/order_list/order_detail',
				query: { edit: url },
			})
		},

		//  是否显示发货按钮
		showSendGoodsButton(row) {
			if (row.orderStatus == 301 || (row.orderStatus == 401 && row.delivered === true)) {
				return true
			}
			return false
		},
		//  发货
		handleSendGoods(row) {
			console.log('%c [ row ]', 'font-size:13px; background:pink; color:#bf2c9f;', row)
			let url = encodeURIComponent(JSON.stringify({ orderNos: row.orderNo, shopId: row.shopId }))
			this.$router.push({
				path: '/order/order_send_goods',
				query: { edit: url },
			})
		},
		//  是否显示右上角排序
		showTableSort(row) {
			if (row.sort && row.sort !== null && (row.orderStatus == 201 || row.orderStatus == 301)) {
				return true
			}
			return false
		},
		//  是否显示查看物流按钮
		showLogisticsButton(row) {
			if (row.deliverType !== 1 && row.deliverMode !== 1 && (row.orderStatus === '401' || row.orderStatus === '501')) {
				return true
			}
			return false
		},
		//  查看物流
		handleLogistics(row) {
			let url = encodeURIComponent(JSON.stringify({ orderNo: row.orderNo, orderStatus: row.orderStatus, shopId: row.shopId, orderTab: 'second' }))
			this.$router.push({
				path: '/order/order_list/order_detail',
				query: { edit: url },
			})
		},
		handlePay({ orderNo }) {
			refreshPayStatusApi({ orderNo }).then(res => {
				if (res.code === 0) {
					this.$message.success(res.message || '刷新支付状态成功')
					this.loadData()
				} else {
					this.$message.warning(res.message || '服务器错误')
				}
			})
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
