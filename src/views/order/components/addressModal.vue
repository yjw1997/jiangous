<template>
	<div>
		<el-dialog @closed="closed" title="修改地址" :visible.sync="isShow" width="800px" :close-on-click-modal="false" destroy-on-close>
			<div class="item">
				<span class="title">
					交易订单编号:
					<span>{{ orderNo }}</span>
				</span>
			</div>
			<div class="item">
				<div class="title">原收货地址</div>
				<div class="label">
					收货人:
					<span>{{ consigneeName }}</span>
				</div>
				<div class="label">
					收货电话:
					<span>{{ consigneePhone }}</span>
				</div>
				<div class="label">
					收货地址:
					<span>{{ userAddressStr }}</span>
				</div>
			</div>
			<div class="title">现收货地址:</div>
			<div>
				<el-form :model="pickForm" :rules="pickFormRules" ref="pickForm">
					<div class="form-item">
						<el-form-item label="收货人" prop="consigneeName">
							<el-button
								type="text"
								@click="
									consigneeNameDisabled = !consigneeNameDisabled
									if (consigneeNameDisabled === true) {
										pickForm.consigneeName = consigneeName
									}
								"
							>
								{{ consigneeNameDisabled ? '修改' : '放弃修改' }}
							</el-button>
							<el-input v-model="pickForm.consigneeName" :disabled="consigneeNameDisabled" placeholder="请输入新收货人" show-word-limit></el-input>
						</el-form-item>
					</div>
					<div class="form-item">
						<el-form-item label="收货电话" prop="consigneePhone">
							<el-button
								type="text"
								@click="
									consigneePhoneDisabled = !consigneePhoneDisabled
									if (consigneePhoneDisabled === true) {
										pickForm.consigneePhone = consigneePhone
									}
								"
							>
								{{ consigneePhoneDisabled ? '修改' : '放弃修改' }}
							</el-button>
							<el-input v-model="pickForm.consigneePhone" :disabled="consigneePhoneDisabled" maxlength="10" show-word-limit placeholder="请输入新收货电话">
								<span slot="prefix">+1</span>
							</el-input>
						</el-form-item>
					</div>

					<div>
						<span class="title">收货地址</span>
						<el-button type="text" @click="changeAddressSwitch">
							{{ addressDisabled ? '修改' : '放弃修改' }}
						</el-button>
					</div>
					<div class="form-item">
						<el-form-item label="是否有店铺">
							<div class="el-input">
								<el-radio-group v-model="isWithStore" size="small" :disabled="addressDisabled" @change="groupChange">
									<el-radio :label="false">否</el-radio>
									<el-radio :label="true">是</el-radio>
								</el-radio-group>
							</div>
						</el-form-item>
					</div>
					<div class="form-item" v-show="isWithStore">
						<el-form-item label="店铺名称" prop="addressShopName">
							<el-input v-model="pickForm.addressShopName" :disabled="addressDisabled" show-word-limit></el-input>
						</el-form-item>
					</div>
					<div class="form-item">
						<el-form-item label="州" prop="stateCode">
							<el-select v-model="pickForm.stateCode" placeholder="请选择州" :disabled="addressDisabled">
								<el-option v-for="item in usaStatesData" :key="item.stateCode" :label="item.stateNameCh" :value="item.stateCode">
									<span style="float: left">{{ item.stateNameCh }}</span>
									<span style="float: right; color: #8492a6; font-size: 13px">{{ item.stateName }}</span>
								</el-option>
							</el-select>
						</el-form-item>
					</div>
					<div class="form-item">
						<el-form-item label="城市" prop="city">
							<el-input v-model="pickForm.city" :disabled="addressDisabled" show-word-limit placeholder="请输入城市名"></el-input>
						</el-form-item>
					</div>
					<!-- <el-form-item label="详细地址" prop="address">
            <el-input
              type="textarea"
              :rows="6"
              placeholder="请输入详细地址"
              v-model="pickForm.address"
              :show-word-limit="true"
              resize="none"
              :disabled="addressDisabled"
            ></el-input>
          </el-form-item> -->
					<div class="form-item">
						<el-form-item label="公寓号/房间号/单元号/楼层号等" prop="houseNumber">
							<el-input placeholder="请输入" v-model="pickForm.houseNumber" show-word-limit :maxlength="100" :disabled="addressDisabled"></el-input>
						</el-form-item>
					</div>

					<div class="form-item">
						<el-form-item label="街道地址" prop="street">
							<el-input placeholder="请输入" v-model="pickForm.street" show-word-limit :disabled="addressDisabled"></el-input>
						</el-form-item>
					</div>
					<div class="form-item">
						<el-form-item label="邮编" prop="postCode">
							<el-input placeholder="请输入" v-model="pickForm.postCode" show-word-limit :disabled="addressDisabled"></el-input>
						</el-form-item>
					</div>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="closeModal">取 消</el-button>
				<el-button type="primary" @click="submitChangeAdderss">确认提交</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { validateNameForm, isEngLishName, isAmericaAddress, validateName } from '@/utils/validate.js'
import { updateUserAddress } from '@/api/order'

import { usaStatesDataAPI } from '@/api/api'

export default {
	name: 'ChangeAddressModal',
	props: {},
	data() {
		return {
			isWithStore: false, //是否有店铺
			orderNo: '',
			consigneeName: '',
			consigneePhone: '',
			userAddressStr: '',
			city: '',
			stateCode: '',
			pickForm: {
				consigneeName: '',
				consigneePhone: '',
				city: '',
				stateCode: '',
				houseNumber: '',
				street: '',
				postCode: '',
			},
			consigneeNameDisabled: true,
			consigneePhoneDisabled: true,
			addressDisabled: true,
			isShow: false,
			pickFormRules: {
				consigneeName: [
					{
						required: true,
						message: '请输入新收货人',
					},
					{
						validator: validateNameForm(1, 30),
					},
				],
				consigneePhone: [
					{
						required: true,
						message: '请输入新收货电话',
					},
					{
						len: 10,
						message: '请输入10位电话号码',
					},
					{
						pattern: /^[0-9]*$/,
						message: '请输入数字',
					},
				],
				stateCode: [
					{
						required: true,
						message: '请选择州',
					},
				],
				city: [
					{
						required: true,
						message: '请输入城市名',
					},
					{
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('最多输入30字符且只能输入英文'))
								return
							}
							isEngLishName(value) ? callback() : callback(new Error('最多输入30字符且只能输入英文'))
						},
					},
				],
				houseNumber: [
					{
						required: true,
						message: '请输入',
					},
					{
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('限制不能输入中文,可输入数字和英文,最多输入100字符'))
								return
							}
							!isAmericaAddress(value) && validateName(value, 1, 100) ? callback() : callback(new Error('限制不能输入中文,可输入数字和英文,最多输入100字符'))
						},
					},
				],
				street: [
					{
						required: true,
						message: '请输入',
					},
					{
						validator: (rule, value, callback) => {
							if (!value) {
								callback(new Error('限制不能输入中文,可输入数字和英文,最多输入100字符'))
								return
							}
							!isAmericaAddress(value) && validateName(value, 1, 100) ? callback() : callback(new Error('限制不能输入中文,可输入数字和英文,最多输入100字符'))
						},
					},
				],
				postCode: [
					{
						required: true,
						message: '请输入',
					},
					{
						pattern: /^[0-9]*$/,
						message: '请输入数字',
					},
				],
			},
			usaStatesData: [],
		}
	},
	created() {},
	mounted() {
		// 获取州数据
		this.getUsaStatesData()
	},
	computed: {},
	watch: {
		isShow(value) {
			if (value) {
				this.consigneeNameDisabled = true
				this.consigneePhoneDisabled = true
				this.addressDisabled = true
			}
		},
	},
	methods: {
		// 是否有店铺
		groupChange(w) {
			if (!w) {
				this.isWithStore = false
				this.pickForm.addressShopName = null
			}
		},
		// 获取州数据
		getUsaStatesData() {
			usaStatesDataAPI().then(res => {
				this.usaStatesData = res.data
				// console.log(this.usaStatesData)
			})
		},
		// 提交地址变更
		submitChangeAdderss() {
			this.$refs['pickForm'].validate(valid => {
				if (valid) {
					let data = this.pickForm
					let state = this.usaStatesData.find(item => item.stateCode === this.pickForm.stateCode).stateName
					data = {
						...data,
						state,
						orderNo: this.orderNo,
					}

					updateUserAddress(data).then(res => {
						this.$message.success(res.message)
						this.isShow = false
						this.$emit('complete')
					})
				}
			})
		},
		changeAddressSwitch() {
			this.addressDisabled = !this.addressDisabled
			if (this.addressDisabled === true) {
				this.pickForm.address = this.userAddress.address
				this.pickForm.city = this.userAddress.city
				this.pickForm.stateCode = this.userAddress.stateCode
				this.pickForm.houseNumber = this.userAddress.houseNumber
				this.pickForm.street = this.userAddress.street
				this.pickForm.postCode = this.userAddress.postCode
				if (this.userAddress.addressShopName) {
					this.isWithStore = true
				}else{
          this.isWithStore = false
          this.pickForm.addressShopName = null
        }
			}
		},
		openModal(data) {
			this.orderNo = data.orderNo
			this.consigneeName = data.consigneeName
			this.consigneePhone = data.consigneePhone
			this.userAddressStr = data.userAddressStr
			this.userAddress = data.userAddress
			this.pickForm = {
				consigneeName: data.consigneeName,
				consigneePhone: data.consigneePhone,
				city: data.userAddress.city,
				stateCode: data.userAddress.stateCode,
				houseNumber: data.userAddress.houseNumber,
				street: data.userAddress.street,
				postCode: data.userAddress.postCode,
				addressShopName: data.userAddress.addressShopName,
			}
			if (data.userAddress.addressShopName) {
				this.isWithStore = true
			}
			this.isShow = true
		},
		closeModal() {
			this.isShow = false
		},
		closed() {
			this.$emit('closed')
		},
	},
}
</script>

<style lang="scss" scoped>
.item {
	margin: 15px 0;
}

.title {
	font-weight: bold;
	margin-right: 10px;
}

.label {
	margin: 10px 0;
}

.form-item {
	display: inline-block;
	width: 50%;
	padding-right: 20px;
}

.el-select {
	width: 100%;
}
</style>
