<template>
	<div class="dashboard-editor-container">
		<div class="search-box">
			<div class="mb20">
				<div class="flex">
					<div>
						<div class="flex">
							<strong>{{ parseTime(info.billTime, '{y}年{m}月{d}日') }} 账单明细</strong>
							<el-tag class="ml0" :type="info.settleStatus === 1 ? 'success' : 'warning'">{{ getWord(info) }}</el-tag>
						</div>
					</div>

					<div>
						<span class="text-muted">
							<i class="el-icon-upload"></i>
							导出
						</span>
					</div>
				</div>
				<p class="text-muted">结算时间：{{ parseTime(info.settleBeginTime, '{y}/{m}/{d}') }}-{{ parseTime(info.settleEndTime, '{y}/{m}/{d}') }}</p>
			</div>
			<div class="mb20">
				<el-row :gutter="10">
					<el-form :model="queryParams" ref="queryForm" :inline="true" label-min-width="80px">
						<el-col :span="6">
							<el-form-item label="结算单号：" prop="id">
								<el-input v-model="queryParams.id" placeholder="请输入" @keyup.enter.native="loadData(1)" />
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="商家信息：" prop="shopInfo">
								<el-input v-model="queryParams.shopInfo" placeholder="店铺ID/店铺名称" @keyup.enter.native="loadData(1)" />
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="收款信息：" prop="cardInfo">
								<el-input v-model="queryParams.cardInfo" placeholder="收款人/银行/账号/收款线路号" @keyup.enter.native="loadData(1)" />
							</el-form-item>
						</el-col>
						<el-col :span="1.5">
							<el-form-item>
								<el-button type="primary" @click="loadData">查询</el-button>
							</el-form-item>
						</el-col>
						<el-col :span="1.5">
							<el-form-item>
								<el-button plain @click="resetQuery">重置</el-button>
							</el-form-item>
						</el-col>
					</el-form>
				</el-row>
			</div>
			<el-table v-loading="loading" :data="dataSource" width="100%" align="center">
				<el-table-column label="结算单号" prop="id" width="150" :show-overflow-tooltip="true" />
				<el-table-column label="店铺ID" prop="shopId" width="180" :show-overflow-tooltip="true" />
				<el-table-column label="店铺名称" prop="shopName" :show-overflow-tooltip="true" />
				<el-table-column label="订单金额（美元）" prop="orderTotalAmount" :show-overflow-tooltip="true" />
				<el-table-column label="结算金额（美元）" prop="settleAmount" :show-overflow-tooltip="true" />
				<el-table-column label="平台抽佣率" prop="rakeRate" :show-overflow-tooltip="true" />
				<el-table-column label="收款人" prop="cardHolder" :show-overflow-tooltip="true" />
				<el-table-column label="收款账户" width="150" :show-overflow-tooltip="true">
					<template #default="{row}">
						<div>{{ row.bankName }}</div>
						<div class="link-type">
							{{ row.cardNumber }}
							<i class="el-icon-document-copy" @click="copyToClipboard(row.cardNumber)" />
						</div>
					</template>
				</el-table-column>
				<el-table-column label="收款线路号" prop="routingNumber" :show-overflow-tooltip="true" />
				<el-table-column label="状态" prop="e" :show-overflow-tooltip="true">
					<template #default="{row}">
						<el-tag :type="row.settleStatus === 1 ? 'success' : 'warning'">
							{{ getWord(row) }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="180">
					<template #default="{row}">
						<el-row :gutter="10">
							<el-col :span="12">
								<el-button type="text" @click="handleSearch(row)">订单明细</el-button>
							</el-col>
							<el-col :span="12">
								<el-button type="text" @click="handleRemit(row)" v-if="row.settleStatus !== 1">汇款</el-button>
							</el-col>
						</el-row>
					</template>
				</el-table-column>
			</el-table>
			<pagination :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" :ipagination="ipagination" @pagination="loadData" />
		</div>
		<el-dialog :visible.sync="centerDialogVisible" width="30%" :show-close="false" center>
			<strong class="desc">请确认该店铺已汇款完成</strong>
			<p class="text-muted desc">
				确认后该操作不可撤回，请确认无误后再进行操作
			</p>
			<span slot="footer" class="dialog-footer">
				<el-button @click="centerDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="configRemit">确认汇款</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { ListMixin } from '@/mixins/wtrfyListMixin'
import { getIdRemit, remitList } from '@/api/afterSale'
import { Message } from 'element-ui'
import { parseTime } from '@/utils'
export default {
	name: 'shop_detail',
	mixins: [ListMixin],
	data() {
		return {
			centerDialogVisible: false,
			disableMixinCreated: true,
			flag: '',
			time: '',
			url: {
				list: remitList,
			},
			rowInfo: {},
			dataSource: [
				{
					id: 1,
				},
			],
			info: '',
		}
	},
	created() {
		if (this.$route.query) {
			let { row } = this.$route.query
			row = JSON.parse(row)
			if (row.id) {
				this.queryParams.id = row.id
			}
			if (row.billTime) {
				this.queryParams.billTime = row.billTime
			}
			this.info = row
			this.loadData()
		}
	},
	methods: {
		getWord({ settleStatus }) {
			switch (settleStatus) {
				case 0:
					return '待汇款'
				case 1:
					return '已汇款'
				case 2:
					return '部分汇款'
			}
		},
		handleSearch(row) {
			let { billTime, settleBeginTime, settleEndTime } = this.info
      let { shopId } = row
      let data = { shopId, billTime, settleBeginTime, settleEndTime }
      // return   console.log(7777, data)
      this.$router.push({
				path: '/order/buy_record/common/order_list',
				query: {
					row: JSON.stringify(data),
				},
			})
    },
		handleRemit(row) {
			this.centerDialogVisible = true
			this.rowInfo = row
			this.time = parseTime(row.billTime, '{y}年{m}月{d}日')
		},
		configRemit() {
			getIdRemit({ id: this.rowInfo.id })
				.then(res => {
					Message.success('汇款成功')
					this.centerDialogVisible = false
					this.loadData()
				})
				.catch(e => {
					console.log(e)
				})
		},
	},
}
</script>

<style lang="scss" scoped>
.flex {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
</style>