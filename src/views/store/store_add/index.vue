<template>
	<div class="dashboard-editor-container">
		<div class="content-box">
			<el-form ref="form" :model="form" :rules="rules" label-width="150px" status-icon :disabled="disableSubmit">
				<el-collapse v-model="activeNames">
					<el-collapse-item name="1">
						<template slot="title">
							<h3>请选择会员</h3>
						</template>
						<el-row>
							<el-col :span="24">
								<el-form-item label="会员账号" prop="phone">
									<el-input v-model="form.phone" placeholder="请输入" style="width:200px"></el-input>
									<el-button type="text" @click="handleAdd">新增账号</el-button>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter="40">
							<el-col :xs="12" :sm="12" :lg="8">
								<el-form-item label="门店类型" prop="shopType">
									<el-radio-group v-model="form.shopType" size="small">
										<el-radio label="0">普通店铺</el-radio>
										<el-radio label="1">自营店铺</el-radio>
									</el-radio-group>
								</el-form-item>
							</el-col>
							<el-col :xs="12" :sm="12" :lg="8">
								<el-form-item label="店铺入驻类型" prop="businessType">
									<el-radio-group v-model="form.businessType" size="small">
										<el-radio label="1">公司入驻</el-radio>
										<el-radio label="0">个人入驻</el-radio>
									</el-radio-group>
								</el-form-item>
							</el-col>
						</el-row>
					</el-collapse-item>
					<el-collapse-item name="2">
						<template slot="title">
							<h3>店铺信息</h3>
						</template>
						<el-row>
							<el-col :xs="12" :sm="12" :lg="8">
								<el-form-item label="店铺名" prop="shopName">
									<el-input v-model="form.shopName" placeholder="请输入" maxlength="100" show-word-limit></el-input>
								</el-form-item>
							</el-col>
							<el-col :xs="12" :sm="12" :lg="8">
								<el-form-item label="客服联系电话" prop="hotLine">
									<el-input v-model="form.hotLine" placeholder="请输入" maxlength="10" show-word-limit></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :xs="12" :sm="12" :lg="8">
								<el-form-item label="经营范围" prop="goodsClassifyCode">
									<w-back-category v-model="form.goodsClassifyCode" :limit="true"></w-back-category>
								</el-form-item>
							</el-col>
						</el-row>
					</el-collapse-item>
					<el-collapse-item name="3" v-if="form.businessType === '1'">
						<template slot="title">
							<h3>公司信息</h3>
						</template>
						<el-row>
							<el-col :xs="12" :sm="12" :lg="8">
								<el-form-item label="公司名" prop="companyName">
									<el-input v-model="form.companyName" placeholder="请输入" show-word-limit maxlength="100"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :xs="12" :sm="12" :lg="8">
								<el-form-item label="商家税号(EIN)" prop="shopTaxNumber">
									<image-upload-modal v-model="form.shopTaxNumber" accept=".jpeg,.jpg,.png,.pdf" :limit="1"></image-upload-modal>
								</el-form-item>
							</el-col>
						</el-row>
					</el-collapse-item>
					<el-collapse-item name="4">
						<template slot="title">
							<h3>商家信息</h3>
						</template>
						<el-row :gutter="20">
							<el-col :xs="12" :sm="12" :lg="8">
								<el-row>
									<el-form-item label="联系人姓名" prop="linkName">
										<el-input v-model="form.linkName" placeholder="请输入" maxlength="40" show-word-limit></el-input>
									</el-form-item>
									<el-form-item label="职位" prop="jobTitle">
										<el-input v-model="form.jobTitle" placeholder="请输入" maxlength="20" show-word-limit></el-input>
									</el-form-item>
									<el-form-item label="微信" prop="wechatAccount">
										<el-input v-model="form.wechatAccount" placeholder="请输入"></el-input>
									</el-form-item>
									<el-form-item label="邮箱" prop="mail">
										<el-input v-model="form.mail" placeholder="请输入"></el-input>
									</el-form-item>
									<el-form-item label="联系人手机" prop="tel">
										<el-input v-model="form.tel" placeholder="请输入" maxlength="10" show-word-limit></el-input>
									</el-form-item>
								</el-row>
							</el-col>
							<el-col :xs="12" :sm="12" :lg="8">
								<el-row v-if="form.businessType === '1'">
									<el-form-item label="实体店" prop="businessType">
										<el-radio-group v-model="form.realFlag" size="small">
											<el-radio :label="false">无实体店</el-radio>
											<el-radio :label="true">有实体店</el-radio>
										</el-radio-group>
									</el-form-item>
									<el-form-item label="实体店门口招牌照片" prop="shopHeadPic" v-if="form.realFlag === true && form.businessType === '1'">
										<image-upload-modal v-model="form.shopHeadPic" :limit="1"></image-upload-modal>
									</el-form-item>
									<el-row>
										<el-col :span="20">
											<el-form-item label="门店地址" prop="shopAddress" v-if="form.realFlag === true && form.businessType === '1'">
												<el-input v-model="form.shopAddress" type="textarea" :rows="4" placeholder="请选择门店地址" maxlength="200" show-word-limit disabled></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="4" v-if="form.realFlag === true && form.businessType === '1'">
											<el-button @click="handleSelectMap">从地图选择</el-button>
										</el-col>
									</el-row>
								</el-row>
								<el-row v-if="form.businessType === '0'">
									<el-form-item label="有效政府颁发的ID正反面一份" prop="identityFront" label-width="210px">
										<image-upload-modal v-model="form.identityFront" :limit="1" tip="驾照/市民卡/绿卡/护照(正面)"></image-upload-modal>
										<image-upload-modal v-model="form.identityReverse" :limit="1" tip="驾照/市民卡/绿卡/护照(反面)"></image-upload-modal>
									</el-form-item>
								</el-row>
							</el-col>
						</el-row>
					</el-collapse-item>
					<el-collapse-item name="5">
						<template slot="title">
							<h3>收款账号</h3>
						</template>
						<el-row :gutter="20">
							<el-col :xs="12" :sm="12" :lg="8">
								<el-row>
									<el-form-item :label="form.businessType?'商家收款账号名称':'收款账号名称'" prop="bankName">
										<el-input v-model="form.bankName" placeholder="请输入" show-word-limit maxlength="100"></el-input>
									</el-form-item>
									<el-form-item label="收款人名称" prop="cardHolder">
										<el-input v-model="form.cardHolder" placeholder="请输入" show-word-limit maxlength="50"></el-input>
									</el-form-item>
									<el-form-item label="账户类型" prop="cardType" show-word-limit>
										<el-select v-model="form.cardType" placeholder="请选择">
											<el-option label="储蓄" value="0"></el-option>
											<el-option label="支票" value="1"></el-option>
										</el-select>
									</el-form-item>
									<el-form-item label="收款路线号码" prop="routingNumber" show-word-limit maxlength="100">
										<el-input v-model="form.routingNumber" placeholder="请输入" show-word-limit maxlength="100"></el-input>
									</el-form-item>
									<el-form-item label="账户号码" prop="cardNumber">
										<el-input v-model="form.cardNumber" placeholder="请输入" show-word-limit maxlength="50"></el-input>
									</el-form-item>
								</el-row>
							</el-col>
						</el-row>
					</el-collapse-item>
					<el-collapse-item name="6">
						<template slot="title">
							<h3>其他信息</h3>
						</template>
						<el-row :gutter="20">
							<el-col :xs="12" :sm="12" :lg="8">
								<el-row>
									<el-form-item label="佣金抽取率" prop="rakeRate">
										<div style="display:flex">
											<el-input v-model="form.rakeRate" placeholder="请输入" show-word-limit></el-input>
											<div style="paddingLeft:5px">%</div>
										</div>
									</el-form-item>
									<el-form-item label="是否缴纳押金" prop="payDepositFlag">
										<el-radio-group v-model="form.payDepositFlag" size="small">
											<el-radio :label="false">否</el-radio>
											<el-radio :label="true">是</el-radio>
										</el-radio-group>
									</el-form-item>
									<el-form-item label="缴纳金额" prop="depositMoney" v-if="form.payDepositFlag === true">
										<el-input v-model="form.depositMoney" placeholder="请输入" maxlength="9" show-word-limit></el-input>
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
								</el-row>
							</el-col>
						</el-row>
					</el-collapse-item>
					<el-collapse-item name="7">
						<div class="button">
							<el-button type="primary" @click="handleSubmit()" :loading="loading">{{ !loading ? '确 定' : '等待中' }}</el-button>
						</div>
					</el-collapse-item>
				</el-collapse>
			</el-form>
		</div>
		<resgister-modal ref="modalForm"></resgister-modal>
		<base-map-modal ref="baseMapModalRefs" @change="changeAddress"></base-map-modal>
	</div>
</template>

<script>
import { shopAuditAddShopApi } from '@/api/store'
import BaseMapModal from '@/components/BaseMap/baseMapModal'
import { isAmericaPhone, isPhone, isPosition, isMoney, is50Number, is100Number, isName, isWeChat, isEmail, validateNameForm, isDecimalFraction } from '@/utils/validate'
export default {
	name: 'store_add',
	components: { BaseMapModal },
	props: {},
	data() {
		return {
			loading: false,
			flag: 'add',
			disableSubmit: false,
			activeNames: ['1', '2', '3', '4', '5', '6', '7'],
			enrollTimePickerOptions: {
				disabledDate(time) {
					return time.getTime() < Date.now()
				},
			},
			form: {
				phone: undefined,
				shopType: '0',
				businessType: '0',
				shopName: undefined,
				hotLine: undefined,
				goodsClassifyCode: undefined,
				companyName: undefined,
				linkName: undefined,
				jobTitle: undefined,
				wechatAccount: undefined,
				mail: undefined,
				tel: undefined,
				realFlag: true,
				shopAddress: undefined,
				bankName: undefined,
				cardHolder: undefined,
				routingNumber: undefined,
				cardNumber: undefined,
				payDepositFlag: true,
				depositMoney: undefined,
				validDate: undefined,
				shopTaxNumber: undefined,
				shopHeadPic: undefined,
				identityFront: undefined,
				identityReverse: undefined,
				latitude: undefined,
				longitude: undefined,
				rakeRate: undefined, // 佣金抽取率
				cardType: undefined, //账户类型
			},
			rules: {
				phone: [{ required: true, message: '请输入正确格式会员账号', trigger: 'change' }],
				cardType: [{ required: true, message: '请选择账户类型', trigger: 'change' }],
				shopType: [{ required: true, message: '请选择门店类型', trigger: 'change' }],
				businessType: [{ required: true, message: '请选择店铺入驻类型', trigger: 'change' }],
				shopName: [{ required: true, message: '请输入店铺名称', trigger: 'change' }],
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
				wechatAccount: [
					{
						required: false,
						trigger: 'change',
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请输入正确格式微信号'))
								return
							}
							let res = isWeChat(value)

							res ? callback() : callback(new Error('请输入正确格式微信号'))
						},
					},
				],
				mail: [
					{
						required: false,
						trigger: 'change',
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请输入正确格式'))
								return
							}
							let res = isEmail(value)

							res ? callback() : callback(new Error('请输入正确格式'))
						},
					},
				],
				hotLine: [
					{
						required: true,
						trigger: 'change',
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请输入正确格式手机号'))
								return
							}
							let res = isAmericaPhone(value) || isPhone(value)	

							res ? callback() : callback(new Error('请输入正确格式手机号'))
						},
					},
				],
				goodsClassifyCode: [{ required: true, message: '请选择经营类目', trigger: 'change' }],
				companyName: [{ required: true, message: '请输入公司名称', trigger: 'change' }],
				shopTaxNumber: [{ required: true, message: '请上传商家税号图片', trigger: 'change' }],
				linkName: [{ required: true, message: '请输入联系人姓名', trigger: 'change' }],
				jobTitle: [
					{
						required: true,
						trigger: 'change',
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请输入正确格式职位名称'))
								return
							}
							let res = isPosition(value)
							res ? callback() : callback(new Error('请输入正确格式职位名称'))
						},
					},
				],
				tel: [
					{
						required: true,
						trigger: 'change',
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请输入正确格式手机号'))
								return
							}
							let res = isAmericaPhone(value) || isPhone(value)
							res ? callback() : callback(new Error('请输入正确格式手机号'))
						},
					},
				],
				realFlag: [{ required: true, message: '请选择有无实体店', trigger: 'change' }],
				shopHeadPic: [{ required: true, message: '请上传实体店门口招牌照片', trigger: 'change' }],
				shopAddress: [
					{ required: true, message: '请选择地址', trigger: 'change' },
					{
						validator: validateNameForm(2, 200),
					},
				],
				bankName: [{ required: true, message: '请输入正确格式银行名称', trigger: 'change' }],
				cardHolder: [
					{
						required: true,
						trigger: 'change',
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请输入正确格式收款人名称'))
								return
							}
							let res = isName(value)
							res ? callback() : callback(new Error('请输入正确格式收款人名称'))
						},
					},
				],
				routingNumber: [
					{
						required: true,
						trigger: 'change',
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请输入正确格式收款路线号码'))
								return
							}
							let res = is100Number(value)
							res ? callback() : callback(new Error('请输入正确格式收款路线号码'))
						},
					},
				],
				cardNumber: [
					{
						required: true,
						trigger: 'change',
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('请输入正确格式账户号码'))
								return
							}
							let res = is50Number(value)
							res ? callback() : callback(new Error('请输入正确格式'))
						},
					},
				],
				identityFront: [{ required: true, message: '未上传图片', trigger: 'change' }],
				identityReverse: [{ required: true, message: '未上传图片', trigger: 'change' }],
				payDepositFlag: [{ required: true, message: '请选择是否缴纳押金', trigger: 'change' }],
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
				validDate: [{ required: true, message: '请输入正确格式缴纳金额', trigger: 'change' }],
			},
		}
	},
	computed: {},
	watch: {},
	created() {},
	mounted() {},
	deactivated() {
		// this.form= {
		//     phone: undefined,
		//     shopType: '0',
		//     businessType: '0',
		//     shopName: undefined,
		//     hotLine: undefined,
		//     goodsClassifyCode: undefined,
		//     companyName: undefined,
		//     linkName: undefined,
		//     jobTitle: undefined,
		//     wechatAccount: undefined,
		//     mail: undefined,
		//     tel: undefined,
		//     realFlag: true,
		//     shopAddress: undefined,
		//     bankName: undefined,
		//     cardHolder: undefined,
		//     routingNumber: undefined,
		//     cardNumber: undefined,
		//     payDepositFlag: true,
		//     depositMoney: undefined,
		//     validDate: undefined,
		//     shopTaxNumber: undefined,
		//     shopHeadPic: undefined,
		//     identityFront: undefined,
		//     identityReverse: undefined,
		//     latitude: undefined,
		//     longitude: undefined,
		//   }
	},
	methods: {
		//  新增
		handleAdd: function() {
			this.$refs.modalForm.title = '新增'
			this.$refs.modalForm.disableSubmit = false
			this.$refs.modalForm.add()
		},
		//  从地图选择
		handleSelectMap() {
			this.$refs.baseMapModalRefs.mapDialogVisible = true
		},
		//  地图返回值
		changeAddress(value) {
			console.log('%c [ value ]', 'font-size:13px; background:pink; color:#bf2c9f;', value)
			if (Object.keys(value).length === 0) {
				this.$message.warning('选中失败请重新选择')
				this.formData.shopAddress = ''
				return
			}
			this.form.shopAddress = value.address
			this.form.latitude = value.locations.latitude
			this.form.longitude = value.locations.longitude
		},
		handleSubmit() {
			this.$refs['form'].validate(valid => {
				if (!valid) return
				let obj = this.cloneDeep(this.form)
				obj.validDate = obj.validDate / 1000
				shopAuditAddShopApi(obj).then(res => {
					this.$message.success(res.message || '操作成功')
					this.$router.push({ path: '/store/store_list' })
				})
			})
		},
	},
}
</script>

<style scoped lang="scss">
.button {
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
