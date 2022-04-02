<template>
	<div class="dashboard-editor-container">
		<!-- 用户搜索 -->
		<div class="search-box" v-show="showSearch">
			<el-row :gutter="20">
				<el-form :model="pageEntity" ref="queryForm" label-width="68px" label-position="right">
					<el-col :span="12">
						<el-form-item label="搜索：" prop="searchWord">
							<el-input v-model="pageEntity.searchWord" clearable size="small" placeholder="评价关键词/买家昵称/店铺名称/订单号/商品名称" @keyup.enter.native="loadData(1)" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="评价时间：" prop="orderNo" label-width="100px">
							<el-date-picker
								v-model="timeRanger"
								type="daterange"
								range-separator="至"
								start-placeholder="开始日期"
								end-placeholder="结束日期"
								align="right"
								style="width:100%"
								value-format="timestamp"
								@change="dateChange"
							></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="19" style="display:flex">
						<el-form-item label-width="100px" label="评价类型：">
							<div class="btn_com" v-for="commentTypeItem in commentType" :key="commentTypeItem.name" @click="quickLook('commentLevel', commentTypeItem.value)">
								{{ commentTypeItem.name }}
							</div>
						</el-form-item>
						<el-form-item label-width="100px" label="投诉状态：">
							<div class="btn_com" v-for="complaintStatusItem in complaintStatus" :key="complaintStatusItem.name" @click="quickLook('status', complaintStatusItem.value)">
								{{ complaintStatusItem.name }}
							</div>
						</el-form-item>
					</el-col>
					<el-col :span="5">
						<el-form-item label-width="10px" style="text-align:right">
							<el-button type="primary" icon="el-icon-search" size="mini" @click="getData">查询</el-button>
							<el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
						</el-form-item>
					</el-col>
				</el-form>
			</el-row>
		</div>
		<div class="content-box">
			<right-toolbar :showSearch.sync="showSearch" @queryTable="getData"></right-toolbar>
			<el-table v-loading="loading" align="center" :data="tableList" default-expand-all :span-method="spanMethod" row-class-name="promotion-table">
				<el-table-column width="1"></el-table-column>
				<el-table-column type="expand">
					<template slot-scope="{ row }">
						<div class="tablecolumn-card">
							<el-table :data="[row]" tooltip-effect="dark" :show-header="false" style="width: 100%" default-expand-all border ref="table">
								<el-table-column prop="starCount" min-width="160" width="160">
									<template slot-scope="{ row }">
										<div class="score-values">
											<div class="score-values-text">{{row.starCount &lt;3?"差评": row.starCount>3? "好评":"中评"}}</div>
											<el-rate v-model="row.starCount" disabled text-color="#ff9900"></el-rate>
										</div>
									</template>
								</el-table-column>
								<el-table-column prop="content" min-width="150">
									<template slot-scope="{ row }">
										<div class="comment-content">
											<div class="comment-content-text">
												<el-tooltip :content="row.content" placement="top">
													<p>{{ row.content }}</p>
												</el-tooltip>
											</div>
											<div class="img-scroll">
												<template v-for="img in row.commentPics">
													<div class="comment-content-img" :key="img.picUrl">
														<div class="play-box" v-if="img.sourceType === 1"></div>
														<el-image class="video-play"  :src="pic" v-if="img.sourceType === 1" @click="picMouseover(img.picUrl)"></el-image>
														<el-image
															:src="img.sourceType === 1 ? img.coverPic : img.picUrl"
															fit="fill"
															:preview-src-list="img.sourceType === 1 ? [] : [img.picUrl]"
															style="maxWidth:58px;maxHeight:58px;cursor: pointer;width:58px;height:58px"
														>
															<div slot="error" class="image-slot">
																<img :src="logo" alt="图片加载失败" style="width:58px;height:58px" />
															</div>
														</el-image>
													</div>
												</template>
											</div>
											<p class="comment-content-hirt" v-if="row.status === 0">评论被投诉等待审核</p>
											<p class="comment-content-hirt comment-content-hirt-z" v-if="row.hiddenFlag === 1">评论存在违规问题已被隐藏</p>
											<p class="comment-content-hirt comment-content-hirt-z" v-if="row.shieldFlag === 1">评论存在违规问题已被屏蔽</p>
										</div>
									</template>
								</el-table-column>
								<el-table-column prop="goodsname" min-width="150">
									<template slot-scope="{ row }">
										<p class="product-name">
											{{ row.goodsName }}
										</p>
									</template>
								</el-table-column>
								<el-table-column min-width="120" align="center" class-name="small-padding">
									<template slot-scope="{ row }">
										<div class="fixed-width">
											<el-button size="mini" type="text" v-if="row.status !== null" @click="complaintOperation(row)" style="marginLeft:8px">投诉记录</el-button>
											<el-button size="mini" type="text" v-if="row.shieldFlag === 0" @click="maskingOperation(row, 1)">屏蔽评论</el-button>
											<el-button size="mini" type="text" v-if="row.shieldFlag === 1" @click="maskingOperation(row, 0)">取消屏蔽</el-button>
											<el-button size="mini" type="text" v-if="row.status === 0" @click="maskingOperation(row, 2)">驳回投诉</el-button>
										</div>
									</template>
								</el-table-column>
							</el-table>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="评分值" min-width="100" align="left" :show-overflow-tooltip="true" prop="shopName">
					<template #default="{row}">
						<el-row :gutter="20" justify="flex-start">
							<el-col :span="4">
								<div class="hidden">订单号：{{ row.orderNo }}</div>
							</el-col>
							<el-col :span="3">
								<div class="hidden">店铺：{{ row.shopName }}</div>
							</el-col>
							<el-col :span="4">
								<div class="hidden">评价时间：{{ parseSecondTime(row.commentTime) }}</div>
							</el-col>
							<el-col :span="4">
								<div class="hidden">买家昵称：{{ row.nickName }}</div>
							</el-col>
						</el-row>
					</template>
				</el-table-column>
				<el-table-column label="评价内容" prop="shopName" min-width="170" :show-overflow-tooltip="true" />
				<el-table-column label="商品名称" prop="phone" min-width="110" :show-overflow-tooltip="true" />
				<el-table-column label="操作" align="center" min-width="130"></el-table-column>
			</el-table>
			<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="pageEntity.current"
				:page-sizes="[10, 25, 50]"
				:page-size="10"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total"
				style="textAlign:right;paddingTop:20px"
			></el-pagination>
		</div>
		<el-dialog :visible.sync="centerDialogVisible" center id="vidia">
			<div style="display:flex;justify-content: center">
				<video :src="videoAddress" autoplay controls>
					浏览器不支持video
				</video>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { commentPageApi, updateShieldApi } from '@/api/order'
import pic from '@/assets/video_display/icon_comtp_play@2x.png'
import logo from '@/assets/video_display/icon_share_logo@2x.png'
export default {
	name: 'comment_list',
	props: ['activeName'],
	data() {
		return {
			centerDialogVisible: false,
			videoAddress: '',
			pic,
			logo,
			commentType: [
				{ name: '好评', value: 0 },
				{ name: '中评', value: 1 },
				{ name: '差评', value: 2 },
			],
			complaintStatus: [
				{ name: '投诉审核中', value: 0 },
				{ name: '投诉成立', value: 1 },
				{ name: '投诉不成立', value: 2 },
			],
			rowKey: 'commentNo',
			timeRanger: [],
			pageEntity: {
				beginTime: undefined,
				endTime: undefined,
				commentType: undefined,
				complainType: undefined,
				current: 1,
				searchWord: undefined,
				size: 10,
				status: undefined,
			},
			showSearch: true,
			tableList: [],
			total: 0,
			loading: false,
		}
	},
	computed: {},
	created() {},
	mounted() {},
	watch: {},
	activated() {
		this.pageEntity.commentType = this.activeName.replace('tab-', '')
		this.getData()
	},
	methods: {
		picMouseover(img) {
			// this.videoAddress = img.replace(/jpg/, 'mp4')
			this.videoAddress = img
			console.log(this.videoAddress)
			this.centerDialogVisible = true
		},
		init() {},
		getData() {
			this.loading = true
			console.log(this.pageEntity)
			commentPageApi(this.pageEntity)
				.then(res => {
					if (res.code === 0) {
						this.tableList = res.data.records
						this.total = res.data.total
					}
				})
				.finally(() => {
					this.loading = false
				})
		},
		dateChange(val) {
			this.pageEntity.beginTime = val[0] / 1000
			this.pageEntity.endTime = val[1] / 1000
		},
		resetQuery() {
			this.pageEntity = {
				beginTime: undefined,
				endTime: undefined,
				commentType: undefined,
				complainType: undefined,
				current: 1,
				searchWord: undefined,
				size: 10,
				status: undefined,
			}
			this.pageEntity.commentType = this.activeName.replace('tab-', '')
			this.getData()
		},
		quickLook(name, value) {
			let query = {
				current: 1,
				size: 10,
			}
			query[name] = value
			console.log(query)
			this.loading = true
			commentPageApi(query)
				.then(res => {
					console.log(res)
					if (res.code === 0) {
						this.tableList = res.data.records
						this.total = res.data.total
					}
				})
				.finally(() => {
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
		handleSizeChange(val) {
			console.log(`每页 ${val} 条`)
			this.pageEntity.size = val
			this.getData()
		},
		handleCurrentChange(val) {
			console.log(`当前页: ${val}`)
			this.pageEntity.current = val
			this.getData()
		},
		maskingOperation(row, flag) {
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
		complaintOperation(row) {
			this.$router.push({
				path: '/order/evaluation_management/review_info',
				query: { id: row.id },
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

		// td:nth-of-type(1) {
		// 	border-left: 1px solid #ccc;
		// }

		td:last-of-type {
			border-right: 1px solid #ccc;
		}
	}

	::v-deep .promotion-table:hover > td {
		background-color: #eff5ff !important;
	}
}
::v-deep .el-table--scrollable-x .el-table__body-wrapper :not(:last-child) {
	overflow: hidden;
}
.fixed-width {
	display: flex;
	flex-direction: column;
}
</style>

<style scoped lang="scss">
.img-scroll {
	min-width: 100%;
	overflow-x: auto;
	white-space: nowrap;
	overflow-y: hidden;
}
/* 设置滚动条的样式 */
.img-scroll::-webkit-scrollbar {
	width: 12px;
	height: 8px;
	cursor: pointer;
}
/* 滚动槽 */
.img-scroll::-webkit-scrollbar-track {
	box-shadow: inset006pxrgba(0, 0, 0, 0.3);
	-webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.3);
	border-radius: 10px;
}
/* 滚动条滑块 */
.img-scroll::-webkit-scrollbar-thumb {
	border-radius: 10px;
	background: rgba(0, 0, 0, 0.1);
	box-shadow: inset006pxrgba(0, 0, 0, 0.5);
	-webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5);
}
.img-scroll::-webkit-scrollbar-thumb:window-inactive {
	background: rgba(0, 0, 0, 0.4);
}
.comment-content-img {
	position: relative;
	display: inline-block;
	box-sizing: border-box;
	width: 58px;
	height: 58px;
	max-width: 58px;
	max-height: 58px;
	margin-right: 12px;
	.video-play {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		max-height: 40px;
		max-width: 40px;
		z-index: 8;
		cursor: pointer;
	}
	.play-box{
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		z-index: 7;
		width: 58px;
	height: 58px;
	max-width: 58px;
	max-height: 58px;
	background-color: rgba(0, 0, 0, 0.4);
	}
}
.btn_com {
	display: inline-block;
	background-color: rgba(249, 249, 249, 1);
	border: none;
	border-radius: 4px;
	font-family: 'Microsoft YaHei Regular', 'Microsoft YaHei';
	font-weight: 400;
	font-style: normal;
	font-size: 14px;
	color: #666666;
	text-align: center;
	margin-right: 5px;
	cursor: pointer;
	padding: 0 18px;
}
.btn_com:hover {
	color: #2290fe;
}
.score-values {
	text-align: center;
	font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
	font-weight: 700;
	font-style: normal;
}
.comment-content {
	.comment-content-text {
		font-family: 'Arial Normal', 'Arial';
		font-size: 14px;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
	}
	.comment-content-hirt {
		box-sizing: border-box;
		max-width: 322px;
		height: 32px;
		line-height: 32px;
		background-color: rgba(242, 242, 242, 1);
		box-sizing: border-box;
		border-width: 1px;
		border-style: solid;
		border-color: rgba(153, 153, 153, 1);
		border-radius: 4px;
		font-family: 'Microsoft YaHei Regular', 'Microsoft YaHei';
		font-size: 14px;
		color: rgba(0, 0, 0, 0.647058823529412);
		padding-left: 18px;
	}
	.comment-content-hirt-z {
		border-color: rgba(255, 163, 158, 1);
		background-color: rgba(255, 242, 241, 1);
	}
}
.product-name {
	font-family: 'PingFang SC 中等', 'PingFang SC';
	font-size: 14px;
	color: rgba(0, 0, 0, 0.447058823529412);
}
.hidden {
	overflow-x: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
