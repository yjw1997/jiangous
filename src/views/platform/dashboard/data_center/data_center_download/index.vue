<template>
	<div class="dashboard-editor-container">
		<div class="search-box">
			<el-row :gutter="40" class="download-d">
				<el-col class="boxTitle">
					<div class="titleTime">
						<div class="dashboardTitle">
							前十五渠道下载统计
						</div>
					</div>
					<lineChart :chart-data="fifteenCountData" />
				</el-col>
			</el-row>
		</div>
		<div class="content-box">
			<el-row :gutter="20">
				<el-col :span="18">
					<el-form :inline="true" label-min-width="68px">
						<el-form-item label="渠道名称">
							<el-input clearable size="small" v-model="frontChannelStatistics.channelName" style="width: 240px" />
						</el-form-item>
						<el-form-item label="统计时间">
							<el-date-picker
								v-model="timeRanger"
								type="daterange"
								value-format="yyyy-MM-dd"
								range-separator="至"
								start-placeholder="开始日期"
								end-placeholder="结束日期"
								@change="dateChange"
							></el-date-picker>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" icon="el-icon-search" size="mini" @click="inquire()">查询</el-button>
							<el-button icon="el-icon-refresh" size="mini" @click="reset">重置</el-button>
						</el-form-item>
					</el-form>
				</el-col>
				<el-col :span="6">
					<div style="text-align:right">
						<el-button type="primary" icon="el-icon-search" size="mini" @click="createdCode">创建下载码</el-button>
					</div>
				</el-col>
				<el-table v-loading="loading" :data="tableList" :row-key="rowKey">
					<el-table-column align="center" label="顺序" prop="id" min-width="32" :show-overflow-tooltip="true">
						<template slot-scope="scope">
							{{ scope.$index + 1 }}
						</template>
					</el-table-column>
					<el-table-column align="center" label="渠道名称" prop="channelName" min-width="70" :show-overflow-tooltip="true" />
					<el-table-column align="center" label="Type" prop="type" min-width="70" :show-overflow-tooltip="true" />
					<el-table-column align="center" label="下载链接" prop="link" min-width="260" />
					<el-table-column align="center" label="二维码" min-width="70">
						<template slot-scope="{ row }">
							<el-image style="width: 65px; height: 56px" :src="row.qrCode" :preview-src-list="[row.qrCode]"></el-image>
						</template>
					</el-table-column>
					<el-table-column align="center" label="下载量" prop="downloadCount" min-width="60" :show-overflow-tooltip="true" />
					<el-table-column align="center" label="操作" prop="number" min-width="180">
						<template slot-scope="{ row }">
							<el-button type="text" size="mini" @click="skipTo(row)">统计详情</el-button>
							<el-button type="text" size="mini" @click="editName(row)">修改名称</el-button>
							<el-button type="text" size="mini" @click="download(row)">下载二维码</el-button>
							<el-button type="text" size="mini" @click="remove(row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="frontChannelStatistics.current"
					:page-sizes="[10, 25, 50]"
					:page-size="10"
					layout="total, sizes, prev, pager, next, jumper"
					:total="total"
					style="textAlign:right;paddingTop:20px"
				></el-pagination>
			</el-row>
		</div>
		<el-dialog :title="title" :visible.sync="dialogVisible" width="30%" :before-close="handleClose" destroy-on-close>
			<el-form v-if="title == '修改名称'" ref="editForm" :model="editForm" label-width="68px" :rules="editRules">
				<el-form-item label="渠道名称" prop="channelName" label-width="80px" label-position="right">
					<el-input v-model="editForm.channelName" clearable size="small" placeholder="请输入" />
				</el-form-item>
			</el-form>

			<div v-else>
				<el-alert title="输入渠道名称后，生成对应的下载链接&二维码，系统会收集该地址对应的下载量" type="info" show-icon :closable="false" style="marginBottom:10px"></el-alert>
				<el-form ref="setForm" :model="setForm" label-width="68px" :rules="setRules">
					<el-form-item label="渠道名称" prop="channelName" label-width="80px" label-position="right">
						<el-input v-model="setForm.channelName" clearable size="small" placeholder="请输入" />
					</el-form-item>
					<el-form-item label="Type" prop="type" label-width="80px" label-position="right">
						<el-input v-model="setForm.type" clearable size="small" placeholder="type建议用渠道英文简称命名，用于区别统计" />
					</el-form-item>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="handleClose">取 消</el-button>
				<el-button type="primary" @click="submit(title)">确 定</el-button>
			</span>
		</el-dialog>
		<a id="aDownload" v-show="false"></a>
		<canvas id="canvas" v-show="false"></canvas>
	</div>
</template>

<script>
import { fifteenCountApi, frontChannelStatisticsList, frontChannelStatisticsRemove, frontChannelStatisticsSaveName, frontChannelStatisticsSaveCode } from '@/api/platform'
import lineChart from './components/LineChart.vue'
export default {
	components: {
		lineChart,
	},
	data() {
		return {
			timeRanger: [],
			editForm: {
				channelName: '',
			},
			editRules: {
				channelName: [{ required: true, message: '请输入渠道名称', trigger: 'blur' }],
			},
			setForm: {
				type: '',
				channelName: '',
			},
			setRules: {
				channelName: [{ required: true, message: '请输入渠道名称', trigger: 'blur' }],
				type: [{ required: true, message: '请输入type', trigger: 'blur' }],
			},
			title: '',
			dialogVisible: false,
			downloadOR: undefined,
			loading: false,
			rowKey: 'id',
			fifteenCountData: {},
			frontChannelStatistics: {
				channelName: '',
				current: 1,
				endDate: '',
				orderItemList: [
					{
						asc: true,
						column: '',
					},
				],
				size: 10,
				startDate: '',
			},
			tableList: [],
			total: 0,
		}
	},
	mounted() {
		this.init()
	},
	methods: {
		init() {
			this.fifteenCount()
			this.getFrontChannelStatisticsList()
		},
		fifteenCount() {
			fifteenCountApi().then(res => {
				let xAxisData = res.data.channelNames.split(',')
				let threeData = res.data.counts.split(',')
				if (xAxisData.length > 15) {
					xAxisData = xAxisData.slice(0, 15)
					threeData = threeData.slice(0, 15)
				}
				this.fifteenCountData = {
					xAxisData,
					threeData,
					layout: ['前十五渠道下载统计'],
				}
			})
		},
		getFrontChannelStatisticsList() {
			let that = this
			that.loading = true
			frontChannelStatisticsList(this.frontChannelStatistics)
				.then(res => {
					this.total = res.data.total
					this.tableList = res.data.records
				})
				.finally(() => {
					that.loading = false
				})
		},
		async download(row) {
			
			try {
				const res = await this.getBase64(row.qrCode)
				this.downloadOR = res
				this.nDownload = row.channelName + '二维码'
				const aLink = document.getElementById('aDownload')
				aLink.download = row.channelName + '二维码'
				aLink.href = res
				aLink.click()
			} catch (err) {
				this.$message.warning('图片下载失败')
			}
		},
		getBase64(url) {
			return new Promise((resolve, reject) => {
				let Img = new Image()
				let dataURL = ''
				Img.setAttribute('crossOrigin', 'Anonymous')
				Img.src = url + '?v=' + Math.random()
				Img.onload = function() {
					// 要先确保图片完整获取到，这是个异步事件
					let canvas = document.getElementById('canvas') // 创建canvas元素
					let width = Img.width // 确保canvas的尺寸和图片一样
					let height = Img.height
					canvas.width = width
					canvas.height = height
					canvas.getContext('2d').drawImage(Img, 0, 0, width, height) // 将图片绘制到canvas中
					dataURL = canvas.toDataURL('image/jpeg') // 转换图片为dataURL
					resolve(dataURL)
				}
			})
		},
		remove(row) {
			this.$confirm(`是否选中数据?`, `温馨提示`)
				.then(() => {
					frontChannelStatisticsRemove({ ids: row.id }).then(res => {
						if (res.code === 0) {
							that.$message.success(res.msg || '删除成功')
							that.getFrontChannelStatisticsList()
						} else {
							that.$message.warning(res.msg || '未知错误')
						}
					})
				})
				.catch(() => {})
		},
		handleSizeChange(val) {
			console.log(`每页 ${val} 条`)
			this.frontChannelStatistics.size = val
			this.getFrontChannelStatisticsList()
		},
		handleCurrentChange(val) {
			console.log(`当前页: ${val}`)
			this.frontChannelStatistics.current = val
			this.getFrontChannelStatisticsList()
		},
		handleClose() {
			this.dialogVisible = false
			this.editForm = {
				channelName: '',
			}
			this.setForm = {
				channelName: '',
				type: '',
			}
		},
		editName(row) {
			this.title = '修改名称'
			this.dialogVisible = true
			this.editForm = {
				channelName: '',
				id: row.id,
			}
		},
		createdCode() {
			this.title = '创建渠道下载码'
			this.dialogVisible = true
		},
		submit(title) {
			let formName = title == '修改名称' ? 'editForm' : 'setForm'
			this.$refs[formName].validate(valid => {
				if (!valid) {
					return false
				}
				if (title == '修改名称') {
					frontChannelStatisticsSaveName(this.editForm).then(res => {
						if (res.code === 0) {
							this.$message.success(res.msg || '修改名称成功')
							this.tableList.forEach(item => {
								if (item.id === this.editForm.id) item.channelName = this.editForm.channelName
							})
							this.handleClose()
						} else {
							this.$message.warning(res.msg || '未知错误')
						}
					})
				} else {
					frontChannelStatisticsSaveCode(this.setForm).then(res => {
						if (res.code === 0) {
							this.$message.success(res.msg || '创建渠道下载码成功')
							this.getFrontChannelStatisticsList()
							this.handleClose()
						} else {
							this.$message.warning(res.msg || '未知错误')
						}
					})
				}
			})
		},
		dateChange(value) {
			console.log(value)
			this.frontChannelStatistics.startDate = value[0]
			this.frontChannelStatistics.endDate = value[1]
		},
		inquire() {
			this.frontChannelStatistics.current = 1
			this.frontChannelStatistics.size = 10
			this.getFrontChannelStatisticsList()
		},
		reset() {
			this.frontChannelStatistics = {
				channelName: '',
				current: 1,
				endDate: '',
				orderItemList: [
					{
						asc: true,
						column: '',
					},
				],
				size: 10,
				startDate: '',
			}
			this.getFrontChannelStatisticsList()
		},
		skipTo(row) {
			this.$router.push({
				path: '/platform/dashboard/data_center/data_center_download/statistical_details',
				query: { id: row.id },
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.download-d {
	margin-top: 18px;
}
</style>
