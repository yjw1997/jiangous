<template>
	<el-dialog :title="title" :visible.sync="dialogVisible" width="800px" destroy-on-close :before-close="close">
		<el-form ref="form" :model="form" :rules="rules" :disabled="disableSubmit" label-width="120PX" :show-message="false" status-icon>
			<el-form-item label="佣金抽取率" prop="rakeRate">
				<div style="display:flex">
					<el-input v-model="form.rakeRate" placeholder="请输入" show-word-limit></el-input>
					<div style="paddingLeft:5px">%</div>
				</div>
			</el-form-item>
			<el-row :span="24">
				<el-form-item label="是否缴纳押金" prop="payDepositFlag">
					<el-radio-group v-model="form.payDepositFlag" size="small">
						<el-radio :label="false">否</el-radio>
						<el-radio :label="true">是</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="缴纳金额" prop="depositMoney" v-if="form.payDepositFlag === true">
					<el-input v-model="form.depositMoney" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="入驻有效期" prop="validDate">
					<el-date-picker
						v-model="form.validDate"
						align="right"
						value-format="timestamp"
						type="date"
						placeholder="选择日期"
						:picker-options="enrollTimePickerOptions"
					></el-date-picker>
				</el-form-item>
				<el-form-item label="审核通过理由" prop="auditRemark">
					<el-input v-model="form.auditRemark" placeholder="请输入" type="textarea" :rows="2"></el-input>
				</el-form-item>
			</el-row>
		</el-form>
		<span slot="footer" class="dialog-footer" v-if="!disableSubmit">
			<el-button @click="close">取 消</el-button>
			<el-button type="primary" @click="handleSubmit()" :loading="loading">{{ !loading ? '确 定' : '等待中' }}</el-button>
		</span>
	</el-dialog>
</template>

<script>
import { shopAuditAuditShop } from '@/api/store'
import { isMoney,isDecimalFraction } from '@/utils/validate.js'
export default {
	name: '',
	props: {},
	data() {
		return {
			form: {
				payDepositFlag: true,
				depositMoney: undefined,
				validDate: undefined,
				auditRemark: undefined,
				rakeRate:undefined
			},
			dialogVisible: false,
			disableSubmit: false,
			title: '审核通过',
			flag: '',
			loading: false,
			enrollTimePickerOptions: {
				disabledDate(time) {
					return time.getTime() < Date.now()
				},
			},
			// 表单校验
			rules: {
				rakeRate: [
					{
						required: true,
						trigger: 'change',
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请输入佣金抽取率'))
								return
							}
							let res = isDecimalFraction(value)

							res ? callback() : callback(new Error('请输入正确格式的佣金抽取率'))
						},
					},
				],
				validDate: [{ required: true, trigger: 'blur' }],
				depositMoney: [
					{
						required: true,
						trigger: 'change',
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请输入1-9位数字'))
								return
							}
							let res = isMoney(value)
							res ? callback() : callback(new Error('请输入1-9位数字'))
						},
					},
				],
				payDepositFlag: [{ required: true, trigger: 'blur' }],
			},
		}
	},
	computed: {},
	watch: {},
	created() {},
	mounted() {},
	methods: {
		show(info) {
			Object.assign(this.form, info)
			this.flag = 'edit'
			this.dialogVisible = true
		},
		handleSubmit() {
			this.$refs['form'].validate(async valid => {
				if (!valid) return
				this.loading = true
				let action = shopAuditAuditShop
				let obj = this.cloneDeep(this.form)

				obj.auditStatus = 1
				obj.validDate = obj.validDate ?? false ? obj.validDate / 1000 : undefined
				await action(obj).then(res => {
					if (res.code === 0) {
						this.$message.success(res.msg || '操作成功')
						this.$emit('OK')
						this.close()
					} else {
						this.$message.warning(res.msg || '服务器错误')
						this.close()
					}
				})
			})
		},
		close() {
			this.dialogVisible = false
			this.loading = false
			this.form = {
				payDepositFlag: undefined,
				depositMoney: undefined,
				validDate: undefined,
				auditRemark: undefined,
			}
		},
	},
}
</script>

<style scoped lang="scss"></style>
