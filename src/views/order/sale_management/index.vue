<template>
	<div class="dashboard-editor-container" v-loading="loading">
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
						<el-steps :active="active" simple>
							<!--买家发起退款-->
							<template v-if="flag === 0">
								<el-step :title="item.title" :icon="item.icon" v-for="item in buyerOptions" :key="item.key" />
							</template>
							<!--卖家发起退款-->
							<template v-else-if="flag === 1">
								<el-step :title="item.title" :icon="item.icon" v-for="item in salerOptions" :key="item.key + '~'" />
							</template>
						</el-steps>
						<div class="t01 mt10">
							<el-form ref="ruleForm" :model="ruleForm" label-width="120px">
								<el-form-item label="拒绝原因:"  prop="rejectReason">
									<el-select v-model="ruleForm.rejectReason" placeholder="请选择拒绝原因">
										<el-option v-for="item in reasonOptions" :label="item.label" :value="item.value" :key="item.value" />
									</el-select>
								</el-form-item>
								<el-form-item label="拒绝说明:"  prop="rejectExplanation">
									<el-input :rows="7" v-model="ruleForm.rejectExplanation" placeholder="请输入拒绝说明理由，至少5个字"
                            type="textarea" maxlength="200" show-word-limit />
								</el-form-item>
								<el-form-item label="上传图片:" prop="pics">
									<image-upload-modal v-model="ruleForm.pics" :limit="3" />
								</el-form-item>
								<el-form-item label-width="250px">
									<el-button type="primary" @click="sendPrice('ruleForm')">拒绝申请</el-button>
									<el-button type="primary" @click="goBack">取消并返回</el-button>
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
							<img :src="queryParams.goodsPic" alt="" class="shop-img" />
							<p class="word">
								{{ queryParams.goodsName }}
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
							<el-descriptions-item label="商品状态">{{ dataSource.refundStatus }}</el-descriptions-item>
							<el-descriptions-item label="退款编号">{{ dataSource.orderRefundNo }}</el-descriptions-item>
							<el-descriptions-item label="退款金额">{{ dataSource.refundMoney }}</el-descriptions-item>
							<el-descriptions-item label="原因">{{ dataSource.refundReason }}</el-descriptions-item>
							<el-descriptions-item label="说     明">{{ dataSource.extExplanation }}</el-descriptions-item>
						</el-descriptions>
					</div>
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
import { ListMixin } from '@/mixins/wtrfyListMixin'
import { confirmRefund, getDetails } from '@/api/afterSale'

export default {
	mixins: [ListMixin],
	data() {
		return {
			disableMixinCreated: true,
			disabled: false,
      type:true,
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
			ruleForm: {},
			size: '',
			url: {
				list: '',
			},
			reasonOptions: [
				{
					value: '商品金额有问题',
					label: '商品金额有问题',
				},
				{
					value: '申请理由不充分',
					label: '申请理由不充分',
				},
				{
					value: '恶意退款不予同意',
					label: '恶意退款不予同意',
				},
				{
					value: '退款协商未达成一致',
					label: '退款协商未达成一致',
				},
				{
					value: '其他',
					label: '其他',
				},
			],
			dataSource: '',
			flag: 1,
			active: 2
		}
	},
	created() {
		let { id } = this.$route.query
    id = JSON.parse(id)
    this.ruleForm.id=id
		this.getData(id)
	},
	mounted() {
    let { applyType } = this.$route.query
    applyType = JSON.parse(applyType)
    this.flag = parseInt(applyType)
		this.flag === 0 ? (this.active = 2) : (this.active = 1)
	},
	methods: {
		getData(data) {
			getDetails({ id: data })
				.then(res => {
					this.dataSource = res.data
					// this.loading = false
				})
				.catch(err => {
					console.log('err', err)
				})
		},
		sendPrice(formName) {
			let { id: orderRefundId, rejectExplanation, rejectReason,pics} = this.ruleForm
      if(pics!==null){
        pics = pics.split(',')
      }
			const params = { optType: false, orderRefundId, rejectExplanation, rejectReason,pics }
      console.log('params',params)
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
		goBack() {
			this.$router.go(-1)
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