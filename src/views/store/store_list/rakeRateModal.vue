<template>
	<el-dialog :title="title" :visible.sync="dialogVisible" width="800px" destroy-on-close :before-close="close">
		<el-form ref="form" :model="form" :rules="rules" label-width="120PX" status-icon>
			<el-row :span="24">
				<el-alert title="佣金率修改后将会在下个结算日的时候应用" type="info" show-icon :closable="false" style="marginBottom:10px"></el-alert>
				<el-form-item label="当前抽取佣金率">&nbsp;{{ form.depositMoney }}%</el-form-item>
				<el-form-item label="佣金抽取率" prop="rakeRate">
					<el-input v-model="form.rakeRate" placeholder="请输入" show-word-limit style="maxWidth:20%"></el-input> %
				</el-form-item>
			</el-row>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button @click="close">取 消</el-button>
			<el-button type="primary" @click="handleSubmit()" :loading="loading">{{ !loading ? '确 定' : '等待中' }}</el-button>
		</span>
	</el-dialog>
</template>

<script>
import { updateRakeRate } from '@/api/store'
import { isDecimalFraction } from '@/utils/validate.js'
export default {
	name: '',
	props: {},
	data() {
		return {
			form: {
				rakeRate: '',
				depositMoney: undefined,
			},
			dialogVisible: false,
			title: '修改佣金率',
			flag: '',
			loading: false,
			// 表单校验
			rules: {
				rakeRate: [
					{
						required: true,
						trigger: 'change',
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请输入佣金率'))
								return
							}
							let res = isDecimalFraction(value)
							res ? callback() : callback(new Error('请输入正确格式佣金率'))
						},
					},
				],
			},
		}
	},
	computed: {},
	watch: {},
	created() {},
	mounted() {},
	methods: {
		show(info) {
			console.log('%c [ info ]', 'font-size:13px; background:pink; color:#bf2c9f;', info)
			this.form.shopId = info.id
            this.form.depositMoney = info.rakeRate
			console.log('%c [ this.form ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.form)
			this.flag = 'edit'
			this.dialogVisible = true
		},
		handleSubmit() {
			this.$refs['form'].validate(async valid => {
				if (!valid) return
				this.loading = true
				let action = updateRakeRate
				this.form.rakeRate = Number(this.form.rakeRate)
				let obj = this.cloneDeep(this.form)
				let query = {
					shopId:this.form.shopId,
					rakeRate:this.form.rakeRate
				}
				obj.auditStatus = 1
				obj.validDate = obj.validDate ?? false ? obj.validDate / 1000 : undefined
				await action(query).then(res => {
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
				rakeRate: '',
				depositMoney: undefined,
			}
		},
	},
}
</script>

<style scoped lang="scss">
::v-deep .el-alert--info.is-light {
    background-color: #e6f7ff !important;
    color: #909399;
    border: 1px solid #97d7ff !important;
}
</style>
