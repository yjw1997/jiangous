<template>
	<div class="dashboard-editor-container">
		<div class="search-box">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>商品管理</el-breadcrumb-item>
				<el-breadcrumb-item>促销活动</el-breadcrumb-item>
				<el-breadcrumb-item>限时抢购活动</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="content-box">
			<div class="header">
				<strong class="s05">售后处理</strong>
			</div>
			<el-row>
				<el-col :span="16">
					<div class="box-l01">
						<template v-if="refundType">
							<div class="box">
								<!--买家发起退款-->
								<template v-if="dataSource.applyType === 0 && dataSource.finalRefundStatus !== 501">
									<el-steps :active="active" simple>
										<el-step :title="item.title" :icon="item.icon" v-for="item in buyerOptions" :key="item.key" />
									</el-steps>
								</template>
								<!--卖家发起退款-->
								<template v-else-if="dataSource.applyType === 1 && dataSource.finalRefundStatus !== 502">
									<el-steps :active="active" simple>
										<el-step :title="item.title" :icon="item.icon" v-for="item in salerOptions" :key="item.key + '~'" />
									</el-steps>
								</template>
								<!--平台发起退款-->
								<template v-else-if="dataSource.applyType === 2">
									<el-steps :active="active" simple>
										<el-step :title="item.title" :icon="item.icon" v-for="item in platformOptions" :key="item.key + '~'" />
									</el-steps>
								</template>
								<div class="mt30" v-if="dataSource.finalRefundStatus === 101">
									<p>
										<strong>等待卖家处理中</strong>
									</p>
									<p class="text-muted">卖家正在处理退款申请中，请耐心等待</p>
									<p>
										<el-button type="text" @click="viewSaleStatus">查看卖家财务状况</el-button>
									</p>
								</div>
								<div class="mt30" v-else-if="dataSource.finalRefundStatus === 201">
									<p>
										<strong>商家驳回申请等待买家响应</strong>
										<strong class="text-success ml0">
											<i class="el-icon-timer"></i>
											还剩{{ totalDownTime(dataSource.cutDownTime) }}
										</strong>
									</p>
									<p class="text-muted">买家修改退款申请后，需要您重新处理</p>
									<p class="text-muted">如果买家超时未响应，退款申请将自动关闭</p>
									<p>
										<el-button type="text" @click="viewSaleStatus">查看卖家财务状况</el-button>
									</p>
								</div>
								<div class="mt30" v-else-if="dataSource.finalRefundStatus === 102 || dataSource.finalRefundStatus === 202">
									<p>
										<strong>平台驳回申请等待买家响应</strong>
										<strong class="text-success ml0">
											<i class="el-icon-timer"></i>
											还剩{{ totalDownTime(dataSource.cutDownTime) }}
										</strong>
									</p>
									<p class="text-muted">买家修改退款申请后，需要您重新处理</p>
									<p class="text-muted">如果买家超时未响应，退款申请将自动关闭</p>
									<p>
										<el-button type="text" @click="viewSaleStatus">查看卖家财务状况</el-button>
									</p>
								</div>
								<div class="mt30" v-else-if="dataSource.finalRefundStatus === 301 || dataSource.finalRefundStatus === 302">
									<p>
										<strong>请处理退款申请</strong>
									</p>
									<p class="text-muted">请及时联系买家协商退款问题</p>
									<p>如果您同意，将进入平台审核处理退款页面</p>
									<p>如果您拒绝，买家与您协商后可以再次发起（最多3次）申请诉求</p>
									<p>
										<el-button type="text" @click="viewSaleStatus">查看卖家财务状况</el-button>
									</p>
									<p>
										<el-button type="primary" @click="handleGree">同意退款</el-button>
										<el-button plain @click="hangdleRefuse">拒绝退款</el-button>
									</p>
								</div>
<!--								<div class="mt30" v-else-if="dataSource.finalRefundStatus === 401 || dataSource.finalRefundStatus === 402">-->
<!--									<p>-->
<!--										<strong>退款申请审核通过</strong>-->
<!--									</p>-->
<!--									<p class="text-muted">平台已同意退款申请</p>-->
<!--									<p class="text-muted">等待处理退款中</p>-->
<!--									<p>-->
<!--										<el-button type="text" @click="viewSaleStatus">查看卖家财务状况</el-button>-->
<!--									</p>-->
<!--								</div>-->
								<div class="mt30" v-else-if="dataSource.finalRefundStatus === 501 && dataSource.rejectReason === 0">
									<p>
										<strong>退款关闭</strong>
									</p>
									<p class="text-muted">完结时间：{{ parseTime(dataSource.finishTime) }}</p>
									<p class="text-muted">买家已主动撤销本次退款申请</p>
									<p>
										<el-button type="text" @click="viewSaleStatus">查看卖家财务状况</el-button>
									</p>
								</div>
								<div class="mt30" v-else-if="dataSource.finalRefundStatus === 502 && dataSource.rejectReason === 1">
									<strong>退款关闭</strong>
									<p class="text-muted">完结时间：{{ parseTime(dataSource.finishTime) }}</p>
									<p>卖家已主动撤销本次退款申请</p>
									<p>
										<el-button type="text" @click="viewSaleStatus">查看卖家财务状况</el-button>
									</p>
								</div>
								<div class="mt30" v-else-if="dataSource.finalRefundStatus === 401 || dataSource.finalRefundStatus ===
								 402||dataSource.finalRefundStatus === 403 || (dataSource.finalRefundStatus
								=== 501&&dataSource.rejectReason!==0) ||
								(dataSource.finalRefundStatus === 502&&dataSource.rejectReason!==1)">
									<strong>退款成功</strong>
									<p class="text-muted">退款成功时间：{{ dataSource.finishTime }}</p>
									<p class="text-muted">退款金额：${{ dataSource.refundMoney }}</p>
									<p>
										<el-button type="text" @click="viewSaleStatus">查看卖家财务状况</el-button>
									</p>
								</div>
								<div class="mt30" v-else-if="dataSource.finalRefundStatus === 601">
									<strong>退款成功</strong>
									<p class="text-muted">第三方支付平台无法完成退款处理</p>
									<p>
										<el-button type="primary" @click="refundError">已线下处理退款</el-button>
									</p>
								</div>
							</div>
						</template>
						<template v-else>
							<div class="content-box">
								<el-form ref="ruleForm" :model="ruleForm" label-width="120px" :rules="rules">
									<el-form-item label="拒绝原因:" prop="rejectReason">
										<el-select v-model="ruleForm.rejectReason" placeholder="请选择拒绝原因">
											<el-option v-for="item in reasonOptions" :label="item.label" :value="item.value" :key="item.value" />
										</el-select>
									</el-form-item>
									<el-form-item label="拒绝说明:" prop="rejectExplanation">
										<el-input :rows="7" v-model="ruleForm.rejectExplanation" placeholder="请输入拒绝说明理由，至少5个字" type="textarea" maxlength="200" show-word-limit />
									</el-form-item>
									<el-form-item label="上传图片:" prop="pics">
										<image-upload-modal v-model="ruleForm.pics" :limit="3" />
									</el-form-item>
									<el-form-item label-width="250px">
										<el-button type="primary" @click="sendPrice('ruleForm')">拒绝申请</el-button>
										<el-button type="primary" @click="refundType = true">取消并返回</el-button>
									</el-form-item>
								</el-form>
							</div>
						</template>
					</div>
					<!--            协商历史-->
					<div class="l05">
						<div class="histroy">
							<strong>协商历史</strong>
							<div :class="{ 'goods-item': true, goods: index === 0 }" v-for="(item, index) in dataSource.talkList" :key="index">
								<div class="his01">
									<img class="el-image" :src="item.headPortrait" alt="" />
									<div class="desc m20">
										<div class="title">{{ item.talkerName }}</div>
										<template v-if="item.talkContent.type === 101">
											<div class="scrit">买家{{ item.talkerName }}发起了退款申请</div>
											<div class="scrit">货物状态：{{ item.talkContent.goodsStatus === 0 ? '未收货' : '已收货' }}</div>
											<div class="scrit">退款金额：{{ item.talkContent.refundMoney }}</div>
											<div class="scrit">退款原因：{{ item.talkContent.refundReason }}</div>
											<div class="scrit">退款描述：{{ item.talkContent.refundExplanation || '暂无描述' }}</div>
											<div class="mt10" v-if="!item.pics">
												<img class="el-image" :src="src" alt="" v-for="(src, index) in item.pics" :key="index" />
											</div>
										</template>
										<template v-else-if="item.talkContent.type === 102 || item.talkContent.type === 103">
											<div class="scrit">发起了退款申请，商品状态：{{ formatter(item.talkContent.goodsDeliverStatus) }}，金额：${{
                          item.talkContent.refundMoney }}</div>
											<div class="scrit">退款理由：{{ item.talkContent.refundReason }}</div>
											<div class="scrit">退款说明：{{ item.talkContent.refundExplanation }}</div>
											<div class="mt10" v-if="!item.pics">
												<img class="el-image" :src="src" alt="" v-for="(src, index) in item.pics" :key="index" />
											</div>
										</template>
										<template v-else-if="item.talkContent.type === 201">
											<div class="scrit">商家同意了本次退款申请</div>
										</template>
										<template v-else-if="item.talkContent.type === 202">
											<div class="scrit">平台同意了本次退款申请</div>
										</template>
										<template v-else-if="item.talkContent.type === 301">
											<div class="scrit">商家拒绝了本次退款申请</div>
                      <div class="scrit">拒绝原因：{{ item.talkContent.rejectReason }}</div>
                      <div class="scrit">拒绝说明：{{ item.talkContent.rejectExplanation }}</div>
											<div class="mt10" v-if="!item.pics">
												<img class="el-image" :src="src" alt="" v-for="(src, index) in item.talkContent.pics"
                             :key="index" />
											</div>
										</template>
										<!--平台拒绝退款申请-->
										<template v-else-if="item.talkContent.type === 302">
											<div class="scrit">平台拒绝了本次退款申请</div>
											<div class="scrit">拒绝原因：{{ item.talkContent.rejectReason }}</div>
											<div>拒绝说明：{{ item.talkContent.rejectExplanation }}</div>
										</template>

										<template v-else-if="item.talkContent.type === 401">
											<div class="scrit">平台退款给买家{{ item.refundMoney }}元</div>
										</template>
										<template v-else-if="item.talkContent.type === 501 || item.talkContent.type === 502">
											<div class="scrit">修改退款申请，商品状态：{{ formatter(item.talkContent.goodsDeliverStatus) }}，金额：{{ item.talkContent.refundMoney }}</div>
											<div class="scrit">退款理由：{{ item.talkContent.refundReason }}</div>
											<div class="scrit">退款说明：{{ item.talkContent.refundExplanation }}</div>
											<div class="mt10" v-if="!item.pics && item.talkContent.type === 501">
												<img class="el-image" :src="src" alt="" v-for="(src, index) in item.talkContent.pics" :key="index" />
											</div>
										</template>
										<template v-else-if="item.talkContent.type === 604 || item.talkContent.type === 603">
											<div class="scrit">商家取消退款申请</div>
										</template>
										<template v-else-if="item.talkContent.type === 605">
											<div class="scrit">平台退款给买家{{item.talkContent.refundMoney}}元</div>
										</template>
									</div>
								</div>
								<div class="text-muted">{{ parseTime(item.talkerTime) }}</div>
							</div>
						</div>
					</div>
				</el-col>
				<el-col :span="8">
					<div class="box-r01">
						<strong>
							退款详情
						</strong>
						<div class="title">
							<img :src="routeParams.goodsPic" alt="" class="shop-img" />
							<p class="word">
								{{ routeParams.goodsName }}
							</p>
						</div>
						<el-descriptions class="margin-top" :column="1" :size="size">
							<el-descriptions-item class="label-class-name" label="买家昵称">
								{{ dataSource.appNickName }}
							</el-descriptions-item>
							<el-descriptions-item label="订单编号">
								<span class="link-type" @click="handleDetail(dataSource)">{{ dataSource.orderNo }}</span>
							</el-descriptions-item>
							<el-descriptions-item label="成交时间">{{ dataSource.payTime }}</el-descriptions-item>
							<el-descriptions-item label="单价">${{ dataSource.unitPrice }}</el-descriptions-item>
							<el-descriptions-item label="数量">{{ dataSource.refundCount }}</el-descriptions-item>
							<el-descriptions-item label="运费">{{ dataSource.expressFee }}</el-descriptions-item>
							<el-descriptions-item label="商品总价">{{ dataSource.totalMoney }}</el-descriptions-item>
							<el-descriptions-item label="商品状态">
                {{ wordTransform(dataSource.refundStatus) }}</el-descriptions-item>
							<el-descriptions-item label="退款编号">{{ dataSource.orderRefundNo }}</el-descriptions-item>
							<el-descriptions-item label="退款金额">{{ dataSource.refundMoney }}</el-descriptions-item>
							<el-descriptions-item label="原因">{{ dataSource.refundReason }}</el-descriptions-item>
							<el-descriptions-item label="说     明">{{ dataSource.extExplanation || '暂无说明' }}</el-descriptions-item>
						</el-descriptions>
					</div>
				</el-col>
			</el-row>
		</div>
		<el-dialog title="卖家财务状况" :visible.sync="dialogTableVisible">
			<el-table :data="tableSource">
				<el-table-column property="shopName" label="店铺名称" />
				<el-table-column property="remitedMoney" label="已汇款金额（美元）" />
				<el-table-column property="waitRemitMoney" label="待汇款金额（美元）" />
				<el-table-column property="waitRemitMoney" label="待结算金额（美元）" />
				<el-table-column property="freezeMoney" label="冻结金额（美元）" />
				<el-table-column property="platformSettledMoney" label="平台已结算佣金（美元）" />
				<el-table-column property="platformWaitSettledMoney" label="平台待结算佣金（美元）" />
			</el-table>
			<pagination :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" :ipagination="ipagination" @pagination="loadData" />
		</el-dialog>
	</div>
</template>

<script>
import { ListMixin } from '@/mixins/wtrfyListMixin'
import { getDetails, confirmRefund, shopTotal, resolveRefund } from '@/api/afterSale.js'
import { parseTime } from '@/utils'

export default {
	mixins: [ListMixin],
	data() {
		return {
			ruleForm: {},
			dialogTableVisible: false,
			disableMixinCreated: true,
			routeParams: {},
			current: 'saler',
			active: 1,
			loading: false,
			refundType: true,
			size: '',
			dataSource: '',
			url: {
				list: shopTotal,
			},
			form: {},
			buyerOptions: [
				{
					key: 1,
					title: '买家申请退款',
					icon: 'el-icon-s-custom',
				},
				{
					key: 2,
					title: '卖家处理退款申请',
					icon: 'el-icon-s-custom',
				},
				{
					key: 3,
					title: '平台处理退款申请',
					icon: 'el-icon-s-custom',
				},
				{
					key: 4,
					title: '退款完毕',
					icon: 'el-icon-s-custom',
				},
			],
			salerOptions: [
				{
					key: 1,
					title: '卖家发起退款',
					icon: 'el-icon-s-custom',
				},
				{
					key: 2,
					title: '平台处理退款申请',
					icon: 'el-icon-s-custom',
				},
				{
					key: 3,
					title: '退款完毕',
					icon: 'el-icon-s-custom',
				},
			],
			platformOptions: [
				{
					key: 1,
					title: '平台发起退款',
					icon: 'el-icon-s-custom',
				},
				{
					key: 2,
					title: '退款完毕',
					icon: 'el-icon-s-custom',
				},
			],
			disabled: false,
			reasonOptions: [
				{
					value:  '买家不想要了',
					label: '买家不想要了',
				},
				{
					value: '没有货了',
					label: '没有货了',
				},
				{
					value: '质量问题',
					label: '质量问题',
				},
				{
					value: '协商退差价给买家',
					label: '协商退差价给买家',
				},
				{
					value: '破损缺件',
					label: '破损缺件',
				},
				{
					value: '买错/多买',
					label: '买错/多买',
				},
				{
					value: '其他',
					label: '其他',
				},
			],
			rules: {
				rejectReason: [{ required: true, message: '请选择拒绝原因', trigger: 'change' }],
				rejectExplanation: [{ required: true, min: 5, max: 200, message: '请输入拒绝说明理由，至少5个字', trigger: 'blur' }],
			},
			refund_tion: '',
			flag: 'buy8',
			tableSource: [],
		}
	},
	created() {
		let { row } = this.$route.query
		row = JSON.parse(row)
		if (row !== undefined) {
			this.routeParams = row
			this.getData(row)
		} else {
			this.$message.error('退款详情丢失,请重新查看详情')
			this.$router.push({
				path: '/order/order_sale',
			})
		}
	},
	watch: {},
	computed: {
		// surplusTime(arriveTime){
		//   const current_time = Date.now()
		//   const timer = arriveTime - current_time
		//   console.log({arriveTime,current_time})
		//   return parseTime(timer,'{年}-{月}-{天} {时}-{分}')
		// }
	},
	methods: {
		refundError() {
			resolveRefund({ id: this.dataSource.id })
				.then(res => {
					this.$message.success('处理退款成功')
					this.$router.push({
						path: '/order/order_sale',
					})
				})
				.catch(e => {
					console.log(e)
				})
		},
		handleGree() {
			this.$confirm('同意退款后不可撤回\n' + '\n' + '请谨慎操作\n' + '\n' + '退款流程将进入平台审核流程', '', {
				confirmButtonText: '同意退款',
				cancelButtonText: '再想想',
				type: 'warning',
			})
				.then(() => {
					// 同意退款
					const { id: orderRefundId } = this.routeParams
					confirmRefund({ orderRefundId, optType: true, rejectExplanation: '' }).then(() => {
						this.$router.push({
							path: '/order/order_sale',
						})
					})
				})
				.catch(() => {
					// 拒绝退款
					this.$message({
						type: 'info',
						message: '好好想想',
					})
				})
		},
		sendPrice(formName) {
			if (this.ruleForm.pics) {
				this.ruleForm.pics = this.ruleForm.pics.split(',')
			}
			const params = {
				optType: false,
				orderRefundId: this.dataSource.id,
				rejectExplanation: this.ruleForm.rejectExplanation,
				rejectReason: this.ruleForm.rejectReason,
				pics: this.ruleForm.pics,
			}
			this.$refs[formName].validate(valid => {
				if (valid) {
					confirmRefund(params)
						.then(res => {
							if (res.code === 0) {
								this.$router.push({ path: '/order/order_sale' })
							}
						})
						.catch(e => {
							console.log(e)
						})
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
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
					this.tableSource = res.data.records || res.data
					this.ipagination.total = res.total || res.data.total || this.dataSource.length
				}
				if (res.code !== 0) {
					this.$message.warning(res.message)
				}
				this.loading = false
			})
		},
		hangdleRefuse() {
			this.refundType = false
			// this.$router.push({
			// 	path: '/order/sale_management/index',
			// 	query: {
			// 		id: JSON.stringify(this.routeParams.id),
			// 		applyType: JSON.stringify(this.dataSource.applyType),
			// 	},
			// })
		},
		viewSaleStatus() {
			this.queryParams.shopInfo = this.dataSource.orderRefundNo
			console.log(' this.queryParams.shopId', this.queryParams.shopId)
			this.loadData()
			this.dialogTableVisible = true
		},
		handleDetail({ orderNo }) {
			const url = encodeURIComponent(JSON.stringify({ orderNo }))
			this.$router.push({
				path: '/order/order_list/order_detail',
				query: {
					edit: url,
				},
			})
		},
		getData({ id }) {
			getDetails({ id })
				.then(res => {
					this.dataSource = res.data
					const { rejectReason, finalRefundStatus, applyType } = this.dataSource
					// switch (finalRefundStatus) {
					// 	case 101:
					// 		this.active = 1
					// 		break
					// 	case 102:
					// 		this.active = 2
					// 		break
					// 	case 201:
					// 		this.active = 2
					// 		break
					// 	case 202:
					// 		this.active = 2
					// 		break
					// 	case 301:
					// 		this.active = 1
					// 		break
					// 	case 302:
					// 		this.active = 1
					// 		break
					// 	case 401:
					// 		this.active = 1
					// 		break
					// 	case 402:
					// 		this.active = 1
					// 		break
					// 	case 403:
					// 		this.active = 1
					// 		break
					// 	case 501:
					// 		this.active = 1
					// 		break
					// 	case 502:
					// 		this.active = 1
					// 		break
					// 	case 601:
					// 		this.active = 2
					// 		break
					// }
					// switch (rejectReason) {
					// 	case 0:
					// 		this.active = 4
					// 		break
					// 	case 1:
					// 		this.active = 3
					// 		break
					// }

					if (finalRefundStatus === 101) {
						this.active = 1
					} else if (
						finalRefundStatus === 102 ||
						finalRefundStatus === 201 ||
						finalRefundStatus === 301 ||
						finalRefundStatus === 302 ||
						finalRefundStatus === 403 ||
						(finalRefundStatus === 601 && applyType === 1)
					) {
						this.active = 2
					} else if (finalRefundStatus === 402 || finalRefundStatus === 202 || (finalRefundStatus === 601 &&
              applyType === 0) || finalRefundStatus === 502) {
						this.active = 3
					} else if (finalRefundStatus === 401 ||finalRefundStatus === 501 && rejectReason === 0) {
						this.active = 4
					}
				})
				.catch(err => {
					console.log('err', err)
				})
		},
		goBack() {
			this.$router.go(-1)
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
			}
		},
		wordTransform(data) {
			switch (data) {
				case 0:
					return '买家申请退款'
				case 1:
					return '卖家处理退款申请'
				case 2:
					return '平台处理退款申请'
				case 3:
					return '退款完毕'
				case 4:
					return '退款关闭'
				case 5:
					return '平台发起退款'
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.content-box {
	//padding: 0;
	.header {
		padding-bottom: 20px;
		padding-left: 30px;
		border-bottom: 1px solid #dcdcdc;
	}

	.box-l01 {
		border-right: 1px solid #dcdcdc;
		height: 100%;
	}

	.box-r01 {
		padding-right: 30px;
		padding-left: 30px;

		.title {
			display: flex;
			align-items: center;

			.shop-img {
				width: 40px;
				height: 40px;
			}

			.word {
				margin-left: 30px;
				width: 300px;
			}
		}
	}

	.box-r01 {
		padding-top: 30px;
	}
}

::v-deep .el-row {
	height: 100%;

	.el-col {
		height: 100%;
	}
}

::v-deep .el-descriptions-item__label {
	width: 60px;
}

.histroy {
	padding: 30px;
	// border-top: 1px solid #dcdcdc;
	.goods-item {
		padding: 20px 0;
		border-top: 1px solid #dcdcdc;
		margin-top: 20px;
		display: flex;
		justify-content: space-between;

		.el-image {
			width: 40px;
			height: 40px;
			// flex: 27%;
			max-width: 40px;
		}
	}
}

.l05 {
	border-top: 1px solid #dcdcdc;
	border-right: 1px solid #dcdcdc;
}
.his01 {
	display: flex;
}
.scrit {
	padding: 5px 0;
}

.box {
	padding: 30px;
}

.histroy {
	.goods {
		border: none;
	}
}
</style>