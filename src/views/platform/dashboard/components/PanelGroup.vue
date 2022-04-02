<template>
	<el-row :gutter="40" class="panel-group">
		<el-col class="boxTitle">
			<div class="dashboardTitle">代办事项</div>
		</el-col>
		<el-col :xs="12" :sm="12" :lg="5" class="card-panel-col">
			<div class="card-panel" @click="handlePushStoreToAudit('1')">
				<div class="card-panel-icon-wrapper icon-people">
					<svg-icon icon-class="rzsqsh" class-name="card-panel-icon" />
				</div>
				<div class="card-panel-description">
					<div class="card-panel-text">
						入驻申请审核
					</div>
					<count-to :start-val="0" :end-val="backlog.enterApplyNum" :duration="2600" class="card-panel-num" />
				</div>
			</div>
		</el-col>
		<el-col :xs="12" :sm="12" :lg="5" class="card-panel-col">
			<div class="card-panel" @click="handlePushStoreToAudit('2')">
				<div class="card-panel-icon-wrapper icon-message">
					<svg-icon icon-class="rzxxgzsh" class-name="card-panel-icon" />
				</div>
				<div class="card-panel-description">
					<div class="card-panel-text">
						入驻信息更正审核
					</div>
					<count-to :start-val="0" :end-val="backlog.enterUpdateNum" :duration="3000" class="card-panel-num" />
				</div>
			</div>
		</el-col>
		<el-col :xs="12" :sm="12" :lg="5" class="card-panel-col">
			<div class="card-panel" @click="handlePushGoodsToAudit('tab-4')">
				<div class="card-panel-icon-wrapper icon-money">
					<svg-icon icon-class="hwxchspsh" class-name="card-panel-icon" />
				</div>
				<div class="card-panel-description">
					<div class="card-panel-text">
						待审核
						<div class="card-panel-text-remark">(有危险词汇商品)</div>
					</div>
					<count-to :start-val="0" :end-val="backlog.dangerGoodsAuditNum" :duration="3200" class="card-panel-num" />
				</div>
			</div>
		</el-col>
		<el-col :xs="12" :sm="12" :lg="5" class="card-panel-col">
			<div class="card-panel" @click="handlePushGoodsToAudit('tab-3')">
				<div class="card-panel-icon-wrapper icon-shopping">
					<svg-icon icon-class="hkychspjc" class-name="card-panel-icon" />
				</div>
				<div class="card-panel-description">
					<div class="card-panel-text">
						待核验
						<div class="card-panel-text-remark">(可疑词汇商品)</div>
					</div>

					<count-to :start-val="0" :end-val="backlog.doubtGoodsAuditNum" :duration="3600" class="card-panel-num" />
				</div>
			</div>
		</el-col>
		<el-col :xs="12" :sm="12" :lg="5" class="card-panel-col">
			<div class="card-panel" @click="hangdleJump(HOMEPAGE_JUMP.PROMOTION)">
				<div class="card-panel-icon-wrapper icon-audit">
					<svg-icon icon-class="cxhdcysh" class-name="card-panel-icon" />
				</div>
				<div class="card-panel-description">
					<div class="card-panel-text">
						促销活动参与审核
					</div>
					<count-to :start-val="0" :end-val="backlog.activityAuditNum" :duration="3600" class="card-panel-num" />
				</div>
			</div>
		</el-col>
		<el-col :xs="12" :sm="12" :lg="5" class="card-panel-col">
			<div class="card-panel" @click="hangdleJump(HOMEPAGE_JUMP.AFTER_SALE)">
				<div class="card-panel-icon-wrapper icon-after-sale">
					<svg-icon icon-class="shtksqcl" class-name="card-panel-icon" />
				</div>
				<div class="card-panel-description">
					<div class="card-panel-text">
						售后退款申请处理
					</div>
					<count-to :start-val="0" :end-val="backlog.refundAuditNum" :duration="3600" class="card-panel-num" />
				</div>
			</div>
		</el-col>
		<el-col :xs="12" :sm="12" :lg="5" class="card-panel-col">
			<div class="card-panel" @click="hangdleJump(HOMEPAGE_JUMP.COMMENT)">
				<div class="card-panel-icon-wrapper icon-comment">
					<svg-icon icon-class="pltscl" class-name="card-panel-icon" />
				</div>
				<div class="card-panel-description">
					<div class="card-panel-text">
						评论投诉处理
					</div>
					<count-to :start-val="0" :end-val="backlog.commentNum" :duration="3600" class="card-panel-num" />
				</div>
			</div>
		</el-col>
	</el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import { HOMEPAGE_JUMP } from '@/utils/variable'
export default {
	props: {
		backlog: {
			type: Object,
			require: true,
			default: () => {},
		},
	},
	data() {
		return {
			HOMEPAGE_JUMP,
		}
	},
	components: {
		CountTo,
	},
	methods: {
		handlePushStoreToAudit(active) {
			let url = encodeURIComponent(JSON.stringify({ active: active }))
			this.$router.push({ path: 'store/store_list', query: { edit: url } })
		},
		handlePushGoodsToAudit(active) {
			let url = encodeURIComponent(JSON.stringify({ active: active }))
			this.$router.push({ path: '/goods/goods_list', query: { edit: url } })
		},
		hangdleJump(data) {
			switch (data) {
				case 'AFTER_SALE':
					this.$router.push({ path: '/order/order_sale' })
					break
				case 'COMMENT':
					this.$router.push({ path: '/order/evaluation_management' })
					break
				case 'PROMOTION':
					this.$router.push({ path: 'goods/activity' })
					break
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.panel-group {
	margin-top: 18px;

	.card-panel-col {
		margin-bottom: 32px;
	}

	.card-panel {
		height: 108px;
		cursor: pointer;
		font-size: 12px;
		position: relative;
		overflow: hidden;
		color: #666;
		background: #fff;
		box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
		border-color: rgba(0, 0, 0, 0.05);
		display: flex;
		justify-content: space-around;
		align-items: center;
		&:hover {
			.card-panel-icon-wrapper {
				color: #fff;
			}

			.icon-people {
				background: #40c9c6;
			}

			.icon-message {
				background: #36a3f7;
			}

			.icon-money {
				background: #f4516c;
			}

			.icon-shopping {
				background: #34bfa3;
			}
			.icon-audit {
				background: #8034bf;
			}
			.icon-comment {
				background: #2172f0;
			}
			.icon-after-sale {
				background: #2172f0;
			}
		}

		.icon-people {
			color: #40c9c6;
		}

		.icon-message {
			color: #36a3f7;
		}

		.icon-money {
			color: #f4516c;
		}

		.icon-shopping {
			color: #34bfa3;
		}
		.icon-audit {
			color: #8034bf;
		}
		.icon-comment {
			color: #2172f0;
		}
		.icon-after-sale {
			color: #2172f0;
		}
		.card-panel-icon-wrapper {
			padding: 16px;
			transition: all 0.38s ease-out;
			border-radius: 6px;
		}

		.card-panel-icon {
			float: left;
			font-size: 48px;
		}

		.card-panel-description {
			font-weight: bold;
			margin: 26px;
			margin-left: 0px;

			.card-panel-text {
				line-height: 18px;
				color: rgba(0, 0, 0, 0.45);
				font-size: 16px;
				margin-bottom: 12px;
				white-space: nowrap;
				&-remark {
					font-size: 14px;
				}
			}

			.card-panel-num {
				font-size: 20px;
			}
		}
	}
}
.boxTitle {
	display: flex;
	justify-content: space-between;
	color: #949494;
}
@media screen and (min-width: 1200px) and (max-width: 1800px) {
	.card-panel-icon-wrapper {
		display: none;
	}
	.card-panel-text {
		font-size: 14px !important;
		white-space: nowrap;
		&-remark {
			font-size: 12px !important;
		}
	}
	.card-panel-description {
		margin-left: 20px !important;
	}
}

@media (max-width: 880px) {
	.card-panel-description {
		display: none;
	}

	.card-panel-icon-wrapper {
		float: none !important;
		width: 100%;
		height: 100%;
		margin: 0 !important;

		.svg-icon {
			display: block;
			margin: 14px auto !important;
			float: none !important;
		}
	}
}
</style>