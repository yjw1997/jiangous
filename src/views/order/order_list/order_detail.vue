<template>
	<div class="dashboard-editor-container" v-loading="loading">
		<div class="content-box">
			<el-tabs value="first">
				<el-tab-pane label="订单进度" name="first">
					<div class="steps" v-if="this.dataSource.orderStatus && !this.dataSource.orderStatus.startsWith('6')">
						<el-steps :active="active" align-center finish-status="success">
							<el-step :title="getstepName(item.orderStatus)" v-for="(item, index) in dataSource.orderStatusInfos" :key="index">
								<div slot="description">
									<div v-if="item.orderTime">{{ parseTime(item.orderTime * 1000) }}</div>
									<div v-if="item.orderMsg">{{ item.orderMsg }}</div>
								</div>
							</el-step>
						</el-steps>
					</div>
					<div class="reimburse-hint" v-for="orderRefundInfo in dataSource.orderRefundInfo" :key="orderRefundInfo.goodsId" v-show="orderRefundInfo.refundStatus!=3">
						{{ filterText(orderRefundInfo) }}
						<span style="color:#1890ff;cursor: pointer;" @click="handleView(orderRefundInfo)">{{ filterText(orderRefundInfo, true) }}</span>
					</div>
					<div class="card">
						<el-card class="box-card" shadow="hover">
							<el-row :gutter="40">
								<el-col :span="12">
									<div class="left">
										<div class="status">当前状态: {{ getStatusName(this.dataSource.orderStatus) }}</div>
										<div class="status" v-if="this.dataSource.orderStatus == '401'">
											{{ `配送方式:${dataSource.deliverType === 1 ? '商家配送' : '物流配送'}` }}
										</div>
										<div class="status" v-if="this.dataSource.orderStatus && this.dataSource.orderStatus.startsWith('6')">
											{{ `取消原因:${this.dataSource.cancelRemark}` }}
										</div>
										<div class="remark" v-if="dataSource.orderStatus == '103'">
											交易自动关闭时间剩余：
											<FlipDown :endDate="new Date(new Date().getTime() + dataSource.closeTime * 1000)" @timeUp="timeOut" :theme="2" />
										</div>
										<div class="button">
											<el-row :gutter="10" class="mb8">
												<el-col :span="1.5">
													<!-- <el-button type="text" plain v-if="showRemindButton()" @click="handleUserMessageRemind()">提醒买家提交凭证</el-button> -->
													<el-button type="text" plain v-if="showRemindButton()" @click="handleUserMessageRemind()">提醒买家付款</el-button>
												</el-col>
												<!-- <el-col :span="1.5">
													<el-button type="text" icon="el-icon-circle-check" @click="handlesubmitCollection()" v-if="showRemindButton()">确认收款</el-button>
												</el-col> -->
												<el-col :span="1.5">
													<el-button type="text" icon="el-icon-circle-close" @click="handleClose()" v-if="showCloseButton()">关闭交易</el-button>
												</el-col>

												<!-- <el-col :span="1.5">
													<el-button type="text" icon="el-icon-finished" @click="handleUserCertificateAudit()" v-if="showAuditButton()" v-show="false">审核交易凭证</el-button>
												</el-col> -->
												<!-- <el-col :span="1.5">
													<el-button type="text" icon="el-icon-finished" @click="handleCheckAudit()" v-if="showCheckAuditButton()">查看交易凭证</el-button>
												</el-col> -->
												<el-col :span="1.5">
													<el-button type="text" icon="el-icon-s-promotion" @click="handleSendGoods()" v-if="showSendGoodsButton()">
														发货
														<span v-if="this.dataSource.delivered === true">(部分发货)</span>
													</el-button>
												</el-col>
												<el-col :span="1.5">
													<el-button type="text" plain icon="el-icon-c-scale-to-original" @click="handlecheckCode()" v-if="showCheckCodeButton()">取货码核对</el-button>
												</el-col>

												<el-col :span="1.5">
													<el-button type="text" icon="el-icon-document" @click="handleOrderPrint()">打印订单</el-button>
												</el-col>
											</el-row>
										</div>
									</div>
								</el-col>
								<el-col :span="12">
									<div class="right">
										<div class="title">
											<div>
												订单备注
												<div class="remark">(订单备注信息仅自己可见)</div>
											</div>
											<el-button icon="el-icon-edit" type="text" @click="handleRemark()">订单备注</el-button>
										</div>
										<div>
											<el-input type="textarea" :rows="2" v-model="dataSource.shopOrderRemark" disabled></el-input>
										</div>
									</div>
								</el-col>
							</el-row>
						</el-card>
					</div>
				</el-tab-pane>
			</el-tabs>
			<el-tabs v-model="orderTab">
				<el-tab-pane label="订单信息" name="first">
					<el-descriptions title="买家信息">
						<el-descriptions-item label="买家昵称">{{ dataSource.appNickName }}</el-descriptions-item>
						<el-descriptions-item label="联系电话">{{ dataSource.appUserPhone }}</el-descriptions-item>
					</el-descriptions>
					<el-descriptions title="订单信息">
						<template v-if="this.dataSource.orderStatus == '302'">
							<el-descriptions-item label="取货人">{{ dataSource.consigneeName }}</el-descriptions-item>
							<el-descriptions-item label="联系电话">{{ dataSource.consigneePhone }}</el-descriptions-item>
						</template>
						<el-descriptions-item label="订单编号">{{ dataSource.orderNo }}</el-descriptions-item>
						<el-descriptions-item label="创建时间">{{ parseTime(dataSource.createTime * 1000) }}</el-descriptions-item>
						<el-descriptions-item label="支付交易号" v-if="dataSource.tradeNo !== null">{{ dataSource.tradeNo }}</el-descriptions-item>
						<el-descriptions-item label="付款时间" v-if="dataSource.payTime !== null">{{ parseTime(dataSource.payTime) }}</el-descriptions-item>
						<!-- <template v-if="this.dataSource.orderStatus && !(this.dataSource.orderStatus.startsWith('1') || this.dataSource.orderStatus.startsWith('6'))">
							<el-descriptions-item label="凭证上传">{{ parseTime(dataSource.uploadTime) }}</el-descriptions-item>
						</template> -->
						<!-- <template
							v-if="
								this.dataSource.orderStatus &&
									!(this.dataSource.orderStatus.startsWith('1') || this.dataSource.orderStatus.startsWith('2') || this.dataSource.orderStatus.startsWith('6'))
							"
						>
							<el-descriptions-item label="确认收款">{{ parseTime(dataSource.submitTime) }}</el-descriptions-item>
						</template> -->

						<template v-if="this.dataSource.orderStatus && (this.dataSource.orderStatus.startsWith('4') || this.dataSource.orderStatus.startsWith('5'))">
							<el-descriptions-item label="发货时间">{{ parseTime(dataSource.deliveryTime) }}</el-descriptions-item>
						</template>
						<template v-if="this.dataSource.orderStatus == '302'"></template>
						<template v-if="this.dataSource.orderStatus && this.dataSource.orderStatus.startsWith('4')"></template>
						<template v-if="this.dataSource.orderStatus && this.dataSource.orderStatus.startsWith('5')">
							<el-descriptions-item label="成立时间" v-if="dataSource.consigneeTime">{{ parseTime(dataSource.consigneeTime) }}</el-descriptions-item>
						</template>
						<template v-if="this.dataSource.orderStatus && this.dataSource.orderStatus.startsWith('6')">
							<el-descriptions-item label="关闭时间">{{ parseTime(dataSource.cancelTime) }}</el-descriptions-item>
						</template>
					</el-descriptions>
					<div class="table">
						<div class="el-descriptions__title">订单信息</div>
						<el-table :data="this.dataSource.goodsDetails" tooltip-effect="dark" style="width: 100%" border :span-method="objectSpanMethod" id="onEarth">
							<el-table-column prop="goodsName" min-width="200" label="商品名称">
								<template slot-scope="scope">
									<div class="goodsdata-name">
										<el-image :src="scope.row.goodsPic">
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
											<div>{{ `单价:${scope.row.oldPrice || 0}* ${scope.row.goodsCount || 0}` }}</div>
										</div>
									</div>
								</template>
							</el-table-column>
							<el-table-column min-width="80" align="center" prop="realPrice" label="单价($)" />
							<el-table-column min-width="80" align="center" prop="goodsCount" label="数量" />
							<el-table-column min-width="100" align="center" prop="goodsCount" label="小计($)">
								<template slot-scope="{ row }">
									{{ row.realPrice * row.goodsCount }}
								</template>
							</el-table-column>
							<el-table-column min-width="100" align="center" label="售后">
								<template slot-scope="{ row }">
									<span v-if="row.refundStatus == 3 || row.refundStatus ===null">/</span>
									<div v-else  :style="{'color':row.refundStatus ? '#999999':'#FF0000' }">
										<i class="el-icon-info" v-if="row.applyType != null"></i>
										{{ row.refundStatus | filAfterState }}
										<div>{{ row.applyType | filAfterStateRank }}</div>
									</div>
								</template>
							</el-table-column>
							<el-table-column min-width="100" align="center" label="退款操作">
								<template slot-scope="{ row }">
									<el-button type="text" size="medium" @click="handleJump(row)" v-if="handleJump(row, true)">{{ row.refundBtn === 0 ? '主动退款' : '处理退款' }}</el-button>
									<span v-else>/</span>
								</template>
							</el-table-column>
							<el-table-column min-width="100" align="center" prop="realPrice" label="配送方式">
								<template>
									<!-- <div>{{ `${this.dataSource.deliverType === 1 ? '商家配送' : '物流配送'}` }}</div> -->
									<template>
										<div v-if="dataSource.deliverMode === 0">商品配送</div>
										<div v-if="dataSource.deliverMode === 1">门店自提</div>
										<div v-if="dataSource.deliverType !== 0 && dataSource.deliverType !== 1">（/）</div>
										<div v-else-if="dataSource.deliverType === 0">物流配送</div>
										<div v-else-if="dataSource.deliverType === 1">商家配送</div>
									</template>
								</template>
							</el-table-column>
							<el-table-column min-width="100" align="center" label="合计($)">
								<template>
									<div>{{ this.dataSource.totalAmount || '__' }}</div>
									<!-- 包邮 -->
									<div>{{ this.dataSource.packageMsg }}</div>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</el-tab-pane>
				<el-tab-pane label="收货和物流信息" name="second" v-if="this.dataSource.orderStatus != '302' && this.dataSource.deliverMode !== 1">
					<el-descriptions title="物流信息" :column="1" :colon="false">
						<template v-if="this.dataSource.orderStatus < 401">
							<el-descriptions-item label="收货地址">
								{{ dataSource.consigneeName }},{{ dataSource.consigneePhone }},{{ dataSource.userAddressStr }}
								<el-button
									type="text"
									@click="
										handleChangeAddress({
											orderNo: dataSource.orderNo,
											consigneeName: dataSource.consigneeName,
											consigneePhone: dataSource.consigneePhone,
											userAddressStr: dataSource.userAddressStr,
											userAddress: dataSource.userAddress,
										})
									"
									icon="el-icon-edit-outline"
								>
									修改收货地址
								</el-button>
							</el-descriptions-item>
							<el-descriptions-item label="运送方式">----</el-descriptions-item>
						</template>
						<template v-else-if="dataSource.deliverType === 1">
							<el-descriptions-item label="收货地址">{{ dataSource.consigneeName }},{{ dataSource.consigneePhone }},{{ dataSource.userAddressStr }}</el-descriptions-item>
							<el-descriptions-item label="运送方式">{{ dataSource.deliverType === 1 ? '商家配送' : '物流配送' }}</el-descriptions-item>
							<el-descriptions-item label="配送人">{{ dataSource.deliverName }}</el-descriptions-item>
							<el-descriptions-item label="联系方式">{{ dataSource.deliverLink }}</el-descriptions-item>
							<el-descriptions-item label="预计送达时间">{{ parseTime(dataSource.predictDeliverTime) }}</el-descriptions-item>
						</template>
						<template v-else>
							<el-descriptions-item label="收货地址">{{ dataSource.consigneeName }},{{ dataSource.consigneePhone }},{{ dataSource.userAddressStr }}</el-descriptions-item>
							<el-descriptions-item label="运送方式">{{ dataSource.deliverType === 1 ? '商家配送' : '物流配送' }}</el-descriptions-item>

							<template v-if="dataSource.orderExpresses !== null && dataSource.orderExpresses">
								<el-descriptions-item>
									<el-button-group>
										<el-button
											:type="activeExpresses === index ? 'primary' : ''"
											v-for="(item, index) in dataSource.orderExpresses"
											:key="index"
											@click="getLogisticsDynamic(index)"
										>
											{{ `包裹${index + 1}` }}
										</el-button>
									</el-button-group>
								</el-descriptions-item>
								<el-descriptions-item label="物流公司" v-if="dataSource.orderExpresses[activeExpresses]">
									{{ dataSource.orderExpresses[activeExpresses].expressCompanyName }}
								</el-descriptions-item>

								<el-descriptions-item label="运单号" v-if="dataSource.orderExpresses[activeExpresses]">
									{{ dataSource.orderExpresses[activeExpresses].expressNo }}
								</el-descriptions-item>
								<el-descriptions-item label="包裹中商品" v-if="dataSource.orderExpresses[activeExpresses]">
									<div class="goodsdata-name" v-for="(goodItem, index) in dataSource.orderExpresses[activeExpresses].goodsDetails" :key="index">
										<el-image :src="goodItem.goodsPic">
											<div slot="error" class="image-slot">
												<i class="el-icon-picture-outline" />
											</div>
										</el-image>
										<div class="goodsdata-name-desc">
											<div>{{ goodItem.goodsName }}</div>
											<div class="goodsdata-name-specDetail">
												<span v-for="(item, index) in goodItem.specDetail" :key="index">
													{{ item.name + ':' + item.value }}
												</span>
											</div>
											<div>{{ `单价:${goodItem.oldPrice || 0}* ${goodItem.goodsCount || 0}` }}</div>
										</div>
									</div>
								</el-descriptions-item>
								<el-descriptions-item label="物流动态" v-if="dataSource.orderExpresses[0].expressCompanyId">
									<el-link type="primary" :underline="false" :href="href" target="_blank">查看物流详情</el-link>
									<div v-if="trackDetail && trackDetail.length && trackDetail !== null">
										<el-steps direction="vertical">
											<el-step :title="item" status="success" v-for="(item, index) in trackDetail" :key="index"></el-step>
										</el-steps>
									</div>
									<div v-else>
										暂无物流信息
									</div>
								</el-descriptions-item>
							</template>
						</template>
					</el-descriptions>
				</el-tab-pane>
			</el-tabs>
		</div>
		<close-modal ref="closeModal" @OK="modelOK"></close-modal>
		<check-pick-modal ref="pickModal" @OK="modelOK"></check-pick-modal>
		<certificateAudit-modal ref="certificateAuditModal" @OK="modelOK"></certificateAudit-modal>
		<collection-modal ref="collectionModal" @OK="modelOK"></collection-modal>
		<address-modal ref="addressModal" @complete="init"></address-modal>
	</div>
</template>

<script>
import FlipDown from 'vue-flip-down'
import { getOrderDetail, orderBatchRemarkApi, queryTrackInfo, userMessageRemind } from '@/api/order'
import closeModal from './components/modal/closeModal.vue'
import checkPickModal from './components/modal/checkPickModal.vue'
import certificateAuditModal from './components/modal/certificateAuditModal.vue'
import collectionModal from './components/modal/collectionModal.vue'
import addressModal from '../components/addressModal.vue'
import { validateName } from '@/utils/validate.js'
export default {
	name: '',
	components: { FlipDown, closeModal, checkPickModal, certificateAuditModal, collectionModal, addressModal },
	props: {},
	data() {
		return {
			dataSource: { orderStatus: undefined, orderExpresses: [{}, {}], orderRefundInfo: [] },
			form: { orderStatus: '' },
			active: 0,
			loading: false,
			activeExpresses: 0,
			trackDetail: '',
			orderTab: 'first',
			isTakes: false, // 是否有302
		}
	},
	filters: {
		//售后状态
		filAfterStateRank: function(value) {
			if (value === null) return ''
			let str = ''
			switch (+value) {
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
			switch (+value) {
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
	},
	computed: {
		href() {
			let str = ''
			if (Object.keys(this.dataSource.orderExpresses[this.activeExpresses]).length === 0) {
				return str
			} else {
				str = this.dataSource.orderExpresses[this.activeExpresses].expressCompanyUrl + this.dataSource.orderExpresses[this.activeExpresses].expressNo
			}
			return str
		},
	},
	watch: {
		activeExpresses: {
			handler(value) {
				this.dataSource.orderExpresses[value].expressNo
			},
			immediate: true,
		},
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			if (!vm.$route.query || !vm.$route.query.edit) {
				vm.close()
			}
			vm.form = JSON.parse(decodeURIComponent(vm.$route.query.edit))
			vm.orderTab = vm.form.orderTab || 'first'
			vm.init(vm.form.orderNo)
		})
	},
	created() {},
	mounted() {
		this.$nextTick(() => {
			this.onEarthC()
		})
	},
	methods: {
		handleView(row) {
			row.id = row.orderRefundId
			this.$router.push({
				path: '/order/sale_detail',
				query: {
					row: JSON.stringify(row),
				},
			})
		},
		handleJump(row, flag) {
			if (flag) {
				return row.refundBtn != 2 && this.dataSource.orderStatus != 103 && !this.dataSource.orderStatus.startsWith('6')
			}
			if (row.refundBtn === 0) {
				this.$router.push({
					path: '/order/sale_management/plate_refund',
					query: {
						data: JSON.stringify(row),
						order_details: JSON.stringify(this.dataSource),
					},
				})
			} else {
				row.id = row.orderRefundId
				this.$router.push({
					path: '/order/sale_detail',
					query: {
						row: JSON.stringify(row),
					},
				})
			}
		},
		filterText({ applyType, platformAuditStatus, goodsName, refundStatus, appNickName, shopAuditStatus, status }, flag) {
			if (flag) {
				if (shopAuditStatus == 1 && platformAuditStatus == 0) {
					return '退款处理'
				}
				if (applyType == 0) {
					if (shopAuditStatus == 0 && platformAuditStatus == 0) return '查看申请进度'
				} else if (applyType == 1) {
					if (shopAuditStatus == 1 && platformAuditStatus == 1 && refundStatus == 0) return '查看申请进度'
				}
				return '查看退款详情'
			}
			let role, productName, result
			if (goodsName.length > 10) {
				productName = '【' + goodsName.slice(0, 10) + '...' + '】'
			} else {
				productName = '【' + goodsName + '】'
			}
			if (applyType == 0) {
				role = `买家(${appNickName})`
			} else if (applyType == 1) {
				role = `卖家`
			} else if (applyType == 2) {
				role = `平台`
				result = `商品${productName}${role}已经进行退款处理`
				return result
			}
			if (status) {
				result = `${role}对${productName}重新发起退款申请`
				return result
			}
			if (shopAuditStatus == 2) {
				result = `${role}对${productName}的退款申请已被卖家驳回`
			} else if (shopAuditStatus == 0) {
				result = `${role}已经对${productName}申请了退款`
			} else if (shopAuditStatus == 1) {
				if (platformAuditStatus == 0) {
					result = `${role}对${productName}的退款申请待平台审核中`
					if (applyType == 1) result = `${role}已经对${productName}进行了退款`
				} else if (platformAuditStatus == 2) {
					result = `${role}对${productName}的退款申请已被平台驳回`
				} else if (platformAuditStatus == 1) {
					if (refundStatus == 1) {
						result = `${role}对${productName}的退款已通过`
					} else if (refundStatus == 0) {
						result = `${role}对${productName}的退款请求已通过平台审核`
					} else if (refundStatus == 3) {
						result = `${role}对${productName}的退款申请已成功退款`
					}
				}
			}
			return result
			// if(shopAuditStatus == 0 && refundStatus == 0){
			// 	result =  `${role}已经对${productName}申请了退款`
			// }else if ( shopAuditStatus == 1 && platformAuditStatus == 0 && applyType == 0){
			// 	result = `${role}对${productName}的退款申请待平台审核中`
			// }else if ( shopAuditStatus == 1 && platformAuditStatus == 1 && refundStatus == 1){
			// 	result = `${role}对${productName}的退款已通过`
			// }else if (shopAuditStatus == 1 && platformAuditStatus == 1 && refundStatus == 3){
			// 	result = `${role}对${productName}的退款申请已成功退款`
			// }else if(shopAuditStatus == 2){
			// 	result = `${role}对${productName}的退款申请已被卖家驳回`
			// }else if(shopAuditStatus == 1 && platformAuditStatus == 2){
			// 	result = `${role}对${productName}的退款申请已被平台驳回`
			// }else if(shopAuditStatus == 1 && platformAuditStatus == 0 && applyType == 1){
			// 	result = `${role}已经对${productName}进行了退款`
			// }else if (shopAuditStatus == 1 && platformAuditStatus == 1 && applyType == 1) {
			// 	result =  `${role}已经对${productName}的退款已通过平台审核`
			// }else if(shopAuditStatus == 1 && platformAuditStatus == 1 && refundStatus == 3 && applyType == 1){
			// 	result = `${role}对${productName}的退款申请已成功退款`
			// }else if(shopAuditStatus == 1 && platformAuditStatus == 2&& applyType == 1){
			// 	result = `${role}对${productName}的退款申请已被平台驳回`
			// }
		},
		onEarthC() {
			let query = JSON.parse(decodeURIComponent(this.$route.query.edit))
			if (query.onEarth) {
				this.$nextTick(() => {
					let container = document.getElementById('onEarth')
					window.scrollTo(0, container.scrollHeight)
				})
			}
		},
		init(orderNo) {
			orderNo = orderNo || this.form.orderNo
			this.loading = true
			getOrderDetail({ orderNo: orderNo })
				.then(res => {
					res.data.orderStatusInfos.map(item => {
						item.orderStatus = item.orderStatus + ''
					})
					res.data.orderStatus = res.data.orderStatus + ''
					this.isTakes = res.data.orderStatusInfos.some(item => item.orderStatus == '302')
					// if (this.isTakes) {
					// 	res.data.orderStatusInfos.splice(2, 1)
					// }
					res.data.orderStatusInfos.forEach(item => {
						if (item.orderStatus.startsWith('1')) {
							res.data.uploadTime = item.orderTime
						}
						if (item.orderStatus.startsWith('2')) {
							res.data.submitTime = item.orderTime
						}
						if (item.orderStatus.startsWith('3')) {
							res.data.deliveryTime = item.orderTime
						}
						if (item.orderStatus.startsWith('5')) {
							res.data.consigneeTime = item.orderTime
						}
						//  当前状态为102驳回交易凭证,隐藏配注信息
						if (item.orderStatus === '101' && res.data.orderStatus === '102') {
							item.orderMsg = ''
						}
					})
					this.dataSource = res.data
					// this.dataSource.orderStatusInfos.unshift({
					// 	orderStatus: '0',
					// 	orderMsg: '',
					// 	orderTime: this.dataSource.createTime,
					// })
					this.stepActive()
					this.getstepName(Number(this.dataSource.orderStatus))
					if (this.dataSource.orderStatus != '302' && this.dataSource.deliverMode !== 1) {
						this.getLogisticsDynamic()
					}
					// 公寓号，街道，城市，州，邮编
					this.dataSource.userAddressStr = `${this.dataSource.userAddress.houseNumber ?? '--'},${this.dataSource.userAddress.street ?? '--'},${this.dataSource.userAddress.city ??
						'--'},${this.dataSource.userAddress.state ?? '--'},${this.dataSource.userAddress.postCode ?? '--'}`
					this.loading = false
					console.log('%c [ 订单详情 ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.dataSource)
				})
				.catch(err => {
					console.log('%c [ err ]', 'font-size:13px; background:pink; color:#bf2c9f;', err)
					this.$message.error('服务器错误')
					this.close()
				})
		},
		//  获取订单状态
		getstepName(name) {
			// name = name + ''
			// if (name.startsWith('0')) {
			//   return '买家下单'
			// } else if (name.startsWith('1')) {
			//   return '等待买家上传凭证'
			// } else if (name.startsWith('2')) {
			//   return '待商家确认收款'
			// } else if (name === '301') {
			//   return '待发货'
			// } else if (name === '302') {
			//   return '待取货'
			// } else if (name.startsWith('4')) {
			//   if (this.dataSource.delivered === true) {
			//     return '已发货(部分发货)'
			//   } else {
			//     return '发货'
			//   }
			// } else if (name.startsWith('5')) {
			//   return '交易完成'
			// } else if (name.startsWith('6')) {
			//   return '交易关闭'
			// }
			if (name == '103') {
				return '买家下单'
			} else if (name == '301' || name == '302') {
				return '买家付款'
			} else if (name == '401') {
				return '发货'
			} else if (name == '501') {
				if (this.isTakes) {
					return '取货'
				}
				return '买家确认收货'
			} else if (name == '502') {
				return '评价'
			}
		},
		getStatusName(name) {
			name = name + ''
			if (name == '103') {
				return '等待买家付款'
			} else if (name == '301' || name == '302') {
				if (this.isTakes) return '等待买家上门取货'
				return '买家已付款,等待发货'
			} else if (name == '401') {
				return '商家已发货,等待买家确认收货'
			} else if (name == '501') {
				return '恭喜您,交易已完成'
			} else if (name == '502') {
				return '等待买家对商品进行评价'
			} else if (name.startsWith('6')) {
				return '交易取消'
			}
			// if (name.startsWith('1')) {
			// 	if (name === '102') {
			// 		return '等待买家上传凭证(用户提交凭证审核被驳回)'
			// 	}
			// 	return '等待买家上传支付凭证'
			// } else if (name.startsWith('2')) {
			// 	return '等待确认交易凭证'
			// } else if (name === '301') {
			// 	return '交易支付凭证审核已通过，等待发货'
			// } else if (name === '302') {
			// 	return '等待买家上门取货'
			// } else if (name.startsWith('4')) {
			// 	if (this.dataSource.deliverType === 1) {
			// 		return '商家准备配送中，等待买家确认收货'
			// 	} else {
			// 		if (this.dataSource.delivered) {
			// 			return '商家部分发货'
			// 		} else {
			// 			return '商家已发货，等待买家确认收货'
			// 		}
			// 	}
			// } else if (name.startsWith('5')) {
			// 	return '恭喜您，当前交易已完成'
			// } else if (name.startsWith('6')) {
			// 	return '交易取消'
			// }
		},
		objectSpanMethod({ rowIndex, columnIndex }) {
			if (columnIndex === 6) {
				if (rowIndex === 0) {
					return [10, 1]
				} else {
					return [0, 0]
				}
			}
			if (columnIndex === 7) {
				if (rowIndex === 0) {
					return [10, 1]
				} else {
					return [0, 0]
				}
			}
		},

		//  获取步骤条完成状态
		stepActive() {
			// this.dataSource.orderStatusInfos.forEach((element, i) => {
			// 	if (element.orderStatus == this.dataSource.orderStatus || (this.dataSource.orderStatus === '102' && element.orderStatus === '101')) {
			// 		this.active = i
			// 	}
			// 	if (this.dataSource.orderStatus == '401' && element.orderStatus == '301') {
			// 		this.active = i + 1
			// 	}
			// 	if (this.dataSource.orderStatus == '501') {
			// 		this.active = i + 1
			// 	}
			// })
			this.dataSource.orderStatusInfos.forEach((item, index) => {
				if (item.orderStatus == this.dataSource.orderStatus) this.active = index + 1
			})
			if(this.dataSource.orderStatus=="501") this.active+=1
		},
		//  倒计时时间结束触发事件
		timeOut() {},
		//  修改订单地址
		handleChangeAddress(data) {
			this.$refs['addressModal'].openModal(data)
		},
		//  获取物流动态
		getLogisticsDynamic(index = 0) {
			this.activeExpresses = index
			if (
				this.dataSource.orderStatus < 401 ||
				this.dataSource.deliverType === 1 ||
				!this.dataSource.orderExpresses ||
				!this.dataSource.orderExpresses[this.activeExpresses].expressNo ||
				!this.dataSource.orderExpresses[this.activeExpresses].expressCompanyId
			)
				return
			console.log('%c [ this.dataSource ]-509', 'font-size:13px; background:pink; color:#bf2c9f;', this.dataSource)
			let obj = {
				trackNum: this.dataSource.orderExpresses[this.activeExpresses].expressNo,
				shippingType: this.dataSource.orderExpresses[this.activeExpresses].expressCompanyId,
			}
			queryTrackInfo(obj).then(res => {
				if (res.code === 0) {
					if (!res.data.trackDetail || res.data.trackDetail === null) {
						this.trackDetail = []
					} else {
						this.trackDetail = res.data.trackDetail.filter(item => item && item !== null)
						// .reduce((prev, next) => {
						//   return prev + '<br></br>' + next
						// }, '')
					}
				}
			})
		},

		// ________________按钮显示与隐藏
		//  提醒买家提交凭证/确认收款
		showRemindButton() {
			// if (this.dataSource.orderStatus == '101' || this.dataSource.orderStatus == '102') {
			// 	return true
			// }
			// return false
			return this.dataSource.orderStatus == '103'
		},
		//  审核交易凭证
		showAuditButton() {
			if (this.dataSource.orderStatus == '201') {
				return true
			}
			return false
		},
		//  查看交易凭证
		showCheckAuditButton() {
			if (this.dataSource.orderStatus == '102' || this.dataSource.orderStatus >= 301) {
				return true
			}
			return false
		},
		//  发货
		showSendGoodsButton() {
			if (this.dataSource.orderStatus == 301 || (this.dataSource.orderStatus == 401 && this.dataSource.delivered === true)) {
				return true
			}
			return false
		},

		//  取货码核对
		showCheckCodeButton() {
			if (this.dataSource.orderStatus == '302') {
				return true
			}
			return false
		},
		//  关闭交易
		showCloseButton() {
			// if (
			// 	this.dataSource.orderStatus == '101' ||
			// 	this.dataSource.orderStatus == '102' ||
			// 	this.dataSource.orderStatus == '201' ||
			// 	this.dataSource.orderStatus == '301' ||
			// 	this.dataSource.orderStatus == '302'
			// ) {
			// 	return true
			// }
			// return false
			// return ['103', '301', '302'].includes(this.dataSource.orderStatus)
			return this.dataSource.orderStatus == 103
		},

		// __________________按钮事件_________________________________
		//  提醒买家提交凭证
		handleUserMessageRemind(row) {
			row = { appUserId: this.dataSource.appUserId, shopId: this.form.shopId, orderNo: this.dataSource.orderNo }
			userMessageRemind(row).then(res => {
				this.$message.success(res.message || '操作成功')
				this.init(this.form.orderNo)
			})
		},
		//  订单备注
		handleRemark(row) {
			row = [this.dataSource.orderNo]
			this.$prompt('订单备注信息仅自己可见', {
				type: 'info',
				title: '订单备注',
				inputType: 'textarea',
				inputValue: this.dataSource.shopOrderRemark,
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
						orderNos: row,
						shopOrderRemark: value,
					}
					orderBatchRemarkApi(obj)
						.then(res => {
							this.$message.success(res.message || '操作成功')
							this.init(this.form.orderNo)
						})
						.catch(err => {
							this.$message.error(err.message || '服务器错误')
						})
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '取消输入',
					})
				})
		},
		//  打印订单(单件)
		handleOrderPrint(row) {
			row = { orderPrintList: [{ orderNo: this.dataSource.orderNo, sort: this.dataSource.sort }] }
			let url = encodeURIComponent(JSON.stringify(row))
			this.$router.push({
				path: '/order/order_print',
				query: { edit: url },
			})
		},
		//  关闭订单(单个)
		handleClose() {
			this.$refs.closeModal.show({ orderNos: [this.dataSource.orderNo] })
			this.$refs.closeModal.title = '交易取消'
		},
		// 核对取货码
		handlecheckCode(row) {
			row = { shopId: this.form.shopId }
			this.$refs.pickModal.title = '取货码核对'
			this.$refs.pickModal.show(row)
		},
		//  发货
		handleSendGoods(row) {
			row = { orderNos: this.dataSource.orderNo, shopId: this.form.shopId }
			let url = encodeURIComponent(JSON.stringify({ orderNos: row.orderNos, shopId: row.shopId }))
			this.$router.push({
				path: '/order/order_send_goods',
				query: { edit: url },
			})
		},
		//  审核交易凭证
		handleUserCertificateAudit(row) {
			row = {
				orderNo: this.dataSource.orderNo,
				deliverMode: this.dataSource.deliverMode,
				shopId: this.form.shopId,
			}
			this.$refs.certificateAuditModal.title = '审核交易凭证'
			this.$refs.certificateAuditModal.show(row)
		},
		//  查看交易凭证
		handleCheckAudit(row) {
			row = { orderNo: this.dataSource.orderNo }
			this.$refs.certificateAuditModal.title = '查看交易凭证'
			this.$refs.certificateAuditModal.disableSubmit = true
			this.$refs.certificateAuditModal.show(row)
		},
		// 确认收款
		handlesubmitCollection(row) {
			row = { orderNo: this.dataSource.orderNo }
			this.$refs.collectionModal.title = '确认收款'
			this.$refs.collectionModal.flag = 'edit'
			let obj = {
				orderNo: row.orderNo,
				orderStatus: this.dataSource.deliverMode == '0' ? 301 : 302,
				deliverMode: row.deliverMode,
				shopId: this.form.shopId,
			}
			this.$refs.collectionModal.show(obj)
		},
		modelOK() {
			this.init(this.dataSource.orderNo)
		},
		close() {
			this.$store.dispatch('tagsView/delView', this.$route).then(() => {
				this.$router.push({ path: '/order/order_list' })
			})
		},
	},
}
</script>

<style scoped lang="scss">
.steps {
	padding: 20px;
}
.card {
	padding: 20px 40px;
	font-size: 18px;

	.left {
		div {
			padding: 10px 0;
		}
		.remark {
			display: flex;
			align-items: center;
		}
	}
	.right {
		.title {
			font-size: 18px;
			font-weight: 700;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.remark {
				display: inline-block;
				color: #aeaeae;
				font-size: 16px;
				font-weight: normal;
			}
		}
		div {
			padding: 5px 0;
		}
		.remark {
			display: flex;
			align-items: center;
		}
	}
}
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
</style>
<style lang="scss" scoped>
.reimburse-hint {
	box-sizing: border-box;
	height: 26px;
	line-height: 26px;
	font-size: 12px;
	border-left: 1px solid rgba(255, 51, 153, 1);
	padding-left: 6px;
	margin-left: 80px;
	font-family: 'Arial Normal', 'Arial';
	margin-bottom: 4px;
}
</style>
