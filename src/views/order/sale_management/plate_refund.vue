<template>
	<div class="dashboard-editor-container">
		<div class="search-box">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>商品管理</el-breadcrumb-item>
				<el-breadcrumb-item>促销活动</el-breadcrumb-item>
				<el-breadcrumb-item>限时抢购活动</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="search-box">
			<strong>
				售后处理
			</strong>
		</div>
		<div class="content-box">
			<el-row>
				<el-col :span="16">
					<div class="box-l01">
						<div class="t01 ">
							<el-form ref="ruleForm" :rules="rules" :model="ruleForm" label-width="120px">
								<el-form-item label="退款理由:" required prop="rejectReason">
									<el-select v-model="ruleForm.rejectReason" placeholder="请选择退款理由" style="width: 100%;">
										<el-option v-for="item in reasonOptions" :label="item.label" :value="item.value" :key="item.value" />
									</el-select>
								</el-form-item>
								<el-form-item label="退款金额:" required prop="refundMoney">
									<el-row>
										<el-col :span="22">
											<el-input v-model="ruleForm.refundMoney" :disabled="disabled" placeholder="请输入退款金额" oninput="value=value.replace(/[^0-9.]/g,'')" />
										</el-col>
										<el-col :span="2"><span class="ml0">美元</span></el-col>
									</el-row>
								</el-form-item>
								<el-form-item label="退款说明:" required prop="extExplanation">
									<el-input v-model="ruleForm.extExplanation" :rows="7" placeholder="请输入退款说明,至少5个字符" type="textarea"
                            maxlength="200" show-word-limit />
								</el-form-item>
								<el-form-item label="上传图片:" prop="pics">
									<image-upload-modal v-model="ruleForm.pics" :limit="3" />
								</el-form-item>
								<el-form-item label-width="250px">
									<el-button type="primary" @click="sendPrice('ruleForm')">发起退款</el-button>
									<el-button type="primary" @click="$router.back(-1)">取消并返回</el-button>
								</el-form-item>
							</el-form>
						</div>
					</div>
				</el-col>
				<el-col :span="8">
					<div class="box-r01">
						<strong>
							退款详情
						</strong>
						<div class="title">
							<img :src="dataList.goodsDetail.goodsPic" alt="" class="shop-img" />
							<p class="word">
								{{ dataList.goodsDetail.goodsName }}
							</p>
						</div>
						<el-descriptions class="margin-top" :column="1" :size="size">
							<el-descriptions-item class="label-class-name" label="买家昵称">
								{{ dataList.appNickName }}
							</el-descriptions-item>
							<el-descriptions-item label="订单编号">
								<span class="link-type" @click="handleDetail(dataList)">{{ queryObj.orderNo }}</span>
							</el-descriptions-item>
							<el-descriptions-item label="成交时间">{{ parseTime(dataList.payTime) }}</el-descriptions-item>
							<el-descriptions-item label="单价">${{ dataList.goodsDetail.goodsPrice }}</el-descriptions-item>
							<el-descriptions-item label="数量">{{ dataList.goodsDetail.goodsCount }}</el-descriptions-item>
							<el-descriptions-item label="运费">{{ dataList.expressFee }}</el-descriptions-item>
							<el-descriptions-item label="商品总价">{{ dataList.goodsDetail.goodsTotalAmount }}</el-descriptions-item>
							<el-descriptions-item label="商品状态">{{ stateFormatter(dataList.goodsStatus) }}</el-descriptions-item>
						</el-descriptions>
					</div>
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
import { initDetail, pushRefund } from '@/api/afterSale'
import { Message } from 'element-ui'

export default {
	data() {
		return {
			disableMixinCreated: true,
			disabled: false,
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
			ruleForm: {
				refundMoney: '',
			},
			size: '',
			reasonOptions: [
				{
					value: 0,
					label: '商品金额有问题',
				},
				{
					value: 1,
					label: '申请理由不充分',
				},
				{
					value: 2,
					label: '恶意退款不予同意',
				},
				{
					value: 3,
					label: '退款协商未达成一致',
				},
				{
					value: 4,
					label: '其他',
				},
			],
			dataSource: '',
			rules: {
				rejectReason: [{ required: true, message: '请选择退款理由', trigger: 'change' }],
				refundMoney: [{ required: true, message: '请输入退款金额', trigger: 'blur' }],
        extExplanation: [{ required: true, min: 5,max:200, message: '请输入退款说明,至少5个字符', trigger: 'blur' }],
			},
			flag: 1,
			active: '2',
			queryObj: '',
			dataList: {},
		}
	},
	watch: {
		'ruleForm.refundMoney': {
			handler: function(newVal) {
				if (newVal > this.queryObj.totalAmount) {
					Message.error('退款金额不得高于订单成交金额,请重新输入')
					this.ruleForm.refundMoney = ''
				}
			},
			deep: true,
		},
	},
	created() {
		if (this.$route.query) {
			let { data, order_details } = this.$route.query
      data = JSON.parse(data)
      order_details = JSON.parse(order_details)
			this.dataSource = data
			this.queryObj = order_details
      console.log({
        goodsId: data.goodsId,
        orderNo: order_details.orderNo,
        skuId: data.skuId,
      })
			this.init({
				goodsId: data.goodsId,
				orderNo: order_details.orderNo,
				skuId: data.skuId,
			})
		}
	},
	methods: {
		init(data) {
			initDetail(data)
				.then(res => {
					this.dataList = res.data
					const status = this.queryObj.orderStatus
					if (status === '301') {
						this.disabled = true
						this.ruleForm.refundMoney = this.dataList.canRefundAmount
					} else if (status === '401') {
						this.disabled = false
					}
				})
				.catch(e => {
					console.log(e)
				})
		},
		stateFormatter(data) {
			switch (data) {
				case 0:
					return '待发货'
				case 1:
					return '已发货'
				case 2:
					return '待取货'
				case 3:
					return '已取货'
			}
		},
		handleDetail({ orderNo }) {
			let url = encodeURIComponent(JSON.stringify({ orderNo }))
			this.$router.push({
				path: '/order/order_list/order_detail',
				query: { edit: url },
			})
			//
			// this.$router.push({
			//   path:'',
			//   row:JSON.stringify(orderNo)
			// })
		},
		sendPrice(formName) {
			let { rejectReason: reasonId, refundMoney, extExplanation, pics } = this.ruleForm
      if(pics){
        pics=pics.split(',')
      }
			let refundReason
			this.reasonOptions.map(item => {
				if (item.value === reasonId) {
					refundReason = item.label
				}
			})
			const params = {
				reasonId,
				refundMoney,
				refundReason,
				skuId: this.dataSource.skuId,
				//退款说明
				extExplanation,
				//商品id
				goodsId: this.dataList.goodsDetail.goodsId,
				//商品名称
				goodsName: this.dataList.goodsDetail.goodsName,
				//orderNo
				orderNo: this.dataList.orderNo,
				pics,
			}
			// return console.log({params})
			this.$refs[formName].validate(valid => {
				if (valid) {
					// 发起退款请求
					pushRefund(params)
						.then(res => {
							if (res.code === 0) {
                this.$message.success('处理退款成功')
								this.$router.go(-1)
								// this.$message.success(res.message)
								// this.$router.push({ path: '/order/order_sale' })
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
	},
}
</script>

<style lang="scss" scoped>
.content-box {
	.box-l01 {
		border-right: 1px solid #dcdcdc;
		height: 100%;
		padding-right: 50px;
		.t01 {
			//border-bottom: 1px solid #dcdcdc;
		}
		.t02 {
			.time {
				white-space: nowrap;
				font-size: 14px;
				color: gray;
			}
		}
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
	.box-l01,
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
</style>