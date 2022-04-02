<template>
	<div class="dashboard-editor-container" v-loading="loading">
		<div class="content-box">
			<el-tabs value="first">
				<el-tab-pane label="评论信息" name="first">
					<el-row :gutter="10">
						<el-col :span="16">
							<div class="comment-content">
								<h3>评论内容</h3>
								<div class="text-star">
									{{details.starCount &lt;3?"差评": details.starCount>3? "好评":"中评"}}
									<el-rate v-model="details.starCount" disabled text-color="#ff9900" class="star"></el-rate>
								</div>
								<p>
									{{ details.content }}
								</p>
								<el-button size="medium" v-if="details.shieldFlag === 1" @click="maskingOperation(0)">取消屏蔽</el-button>
								<el-button size="medium" v-if="details.shieldFlag === 0" @click="maskingOperation(1)">屏蔽评论</el-button>
								<el-button size="medium" v-if="details.status === 0" @click="maskingOperation(2)">驳回投诉</el-button>
							</div>
							<div class="complains-records">
								<div style="background:#f0f2f5;width:100%;heigth:20px"></div>
								<h3>投诉记录</h3>
								<div class="complains-records-content" v-for="item in details.orderCommentComplains" :key="item.complainContent">
									<div class="complains-records-l">
										<el-image :src="item.headPortrait" fit="cover" style="width: 47px; height: 47px">
											<div slot="error" class="image-slot">
												<i class="el-icon-picture-outline" />
											</div>
										</el-image>
										<div class="complains-records-lt">
											<span class="overflow-hidden">{{ item.personName }}</span>
											<span :class="item.userType ? 'complains-records-ltm' : 'complains-records-ltb'">{{ item.userType ? '卖家' : '买家' }}</span>
											<div class="complains-records-c">投诉原因：{{ item.complainContent }}</div>
										</div>
									</div>
									<span>评论时间：{{ parseSecondTime(item.complainTime) }}</span>
								</div>
							</div>
						</el-col>
						<el-col :span="8">
							<el-card class="order-info" shadow="hover">
								<h3>订单信息</h3>
								<div class="order-info-in">
									<el-image :src="details.goodsPic" fit="cover" style="width: 47px; height: 47px">
										<div slot="error" class="image-slot">
											<i class="el-icon-picture-outline" />
										</div>
									</el-image>
									<h4 class="order-info-insn">{{ details.goodsName }}</h4>
								</div>
								<div class="order-info-text">
									<p>订单号： {{ details.orderNo }}</p>
									<p>店铺： {{ details.shopName }}</p>
									<p>评价时间：{{ parseSecondTime(details.commentTime) }}</p>
									<p>买家昵称：{{ details.nickName }}</p>
								</div>
							</el-card>
						</el-col>
					</el-row>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script>
import { queryDetailApi, updateShieldApi } from '@/api/order'
export default {
	data() {
		return {
			loading: false,
			id: this.$route.query.id,
			details: {},
		}
	},
	created() {
		this.init()
	},
	mounted() {},
	methods: {
		init() {
			this.queryDetail()
		},
		queryDetail() {
			queryDetailApi({ id: this.id }).then(res => {
				if (res.code === 0) {
					this.details = res.data
				}
				console.log(res)
			})
		},
		maskingOperation(flag) {
			let query = {
				id: row.id,
				shieldFlag: flag,
				status: flag,
			}
			let content, message
			if (flag === 0) {
				content = '是否取消屏蔽该评论'
				message = '取消屏蔽该评论成功'
				delete query.status
			} else if (flag === 1) {
				content = '是否屏蔽该评论'
				message = '屏蔽该评论成功'
				delete query.status
			} else if (flag == 2) {
				content = '是否驳回该评论'
				message = '驳回该评论成功'
				delete query.shieldFlag
			}
			console.log(query)
			let that = this
			this.$confirm(content, `温馨提示`)
				.then(() => {
					updateShieldApi(query).then(res => {
						if (res.code === 0) {
							that.$message.success(res.message || message)
							that.getData()
						} else {
							that.$message.warning(res.message || '未知错误')
						}
					})
				})
				.catch(() => {})
		},
	},
}
</script>

<style lang="scss" scoped>
h3 {
	margin: 0;
	padding: 18px 0px;
}
.text-star {
	display: flex;
	font-size: 14px;
	font-weight: 700;
	.star {
		margin-left: 8px;
	}
}
.comment-content {
	background-color: #fff;
	width: 100%;
	padding-bottom: 44px;
}
.complains-records {
	background-color: #fff;
	width: 100%;
	.complains-records-content {
		display: flex;
		padding-bottom: 30px;
		padding-top: 12px;
		border-bottom: 1px solid #f2f2f2;
		width: 100%;
		margin-right: 38px;
		justify-content: space-between;
		.complains-records-l {
			display: flex;
			.complains-records-lt {
				margin-left: 16px;
			}
			.complains-records-ltb {
				padding: 1px 18px;
				color: #ff9933;
				background-color: rgba(255, 153, 51, 0.188235294117647);
				border-radius: 5px;
				margin: 0 8px;
			}
			.complains-records-ltm {
				padding: 1px 18px;
				color: #1890ff;
				background-color: rgba(230, 247, 255, 1);
				border-radius: 5px;
				margin: 0 8px;
			}
			.complains-records-c {
				padding-top: 8px;
			}
		}
	}
}
.order-info {
	.order-info-in {
		display: flex;
		align-items: center;
		.order-info-insn {
			padding: 0px 6px;
		}
	}
}
.overflow-hidden {
	width: 200px;
	display: inline-block;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
