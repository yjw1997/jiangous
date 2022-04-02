<template>
  <el-form ref="form" :model="form" label-width="150px" :show-message="false" status-icon :disabled="disableSubmit">
    <el-collapse v-model="activeNames">
      <el-collapse-item name="1" v-if="form.searchType === '3'">
        <template slot="title">
          <h3>驳回理由</h3>
        </template>
        <el-row>
          <el-input v-model="form.auditRemark" type="textarea" :rows="4"></el-input>
        </el-row>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <h3>店铺信息</h3>
        </template>
        <el-row>
          <el-col :xs="12" :sm="12" :lg="8">
            <el-form-item label="店铺入驻类型" prop="businessType">
              <el-radio-group v-model="form.businessType" size="small">
                <el-radio :label="1">公司入驻 </el-radio>
                <el-radio :label="0">个人入驻</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="8">
            <el-form-item label="店铺名" prop="shopName">
              <el-input v-model="form.shopName" placeholder="请输入"> </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="12" :sm="12" :lg="8">
            <el-form-item label="客服联系电话" prop="hotLine">
              <el-input v-model="form.hotLine" placeholder="请输入" maxlength="10" show-word-limit> </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="8">
            <el-form-item label="经营范围" prop="goodsClassifyCode">
              <w-back-category v-model="form.goodsClassifyCode"></w-back-category>
            </el-form-item>
          </el-col>
        </el-row>
      </el-collapse-item>
      <el-collapse-item name="3" v-if="form.businessType === 1">
        <template slot="title">
          <h3>公司信息</h3>
        </template>
        <el-row>
          <el-col :xs="12" :sm="12" :lg="8">
            <el-form-item label="公司名" prop="companyName">
              <el-input v-model="form.companyName" placeholder="请输入" show-word-limit maxlength="100"> </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="12" :sm="12" :lg="8">
            <el-form-item label="商家税号(EIN)" prop="shopTaxNumber">
              <image-upload-modal
                v-model="form.shopTaxNumber"
                accept=".jpeg,.jpg,.png,.pdf"
                :limit="1"
              ></image-upload-modal>
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
                <el-input v-model="form.linkName" placeholder="请输入"> </el-input>
              </el-form-item>
              <el-form-item label="职位" prop="jobTitle">
                <el-input v-model="form.jobTitle" placeholder="请输入"> </el-input>
              </el-form-item>
              <el-form-item label="微信" prop="wechatAccount">
                <el-input v-model="form.wechatAccount" placeholder="请输入"> </el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="mail">
                <el-input v-model="form.mail" placeholder="请输入"> </el-input>
              </el-form-item>
              <el-form-item label="联系人手机" prop="tel">
                <el-input v-model="form.tel" placeholder="请输入" maxlength="10" show-word-limit> </el-input>
              </el-form-item>
            </el-row>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="8">
            <el-row v-if="form.businessType === 1">
              <el-form-item label="实体店" prop="businessType">
                <el-radio-group v-model="form.realFlag" size="small">
                  <el-radio :label="0">无实体店</el-radio>
                  <el-radio :label="1">有实体店</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="实体店门口招牌照片" prop="shopHeadPic" v-if="form.realFlag === 1">
                <image-upload-modal v-model="form.shopHeadPic" :limit="1"></image-upload-modal>
              </el-form-item>
              <el-form-item label="门店地址" prop="shopAddress" v-if="form.realFlag === 1">
                <el-input v-model="form.shopAddress" placeholder="请输入" show-word-limit maxlength="200"> </el-input>
              </el-form-item>
            </el-row>
            <el-row v-if="form.businessType === 0">
              <el-form-item label="有效政府颁发的ID正反面一份" prop="shopHeadPic" label-width="210px">
                <image-upload-modal
                  v-model="form.identityFront"
                  :limit="1"
                  tip="驾照/市民卡/绿卡/护照(正面)"
                ></image-upload-modal>
                <image-upload-modal
                  v-model="form.identityReverse"
                  :limit="1"
                  tip="驾照/市民卡/绿卡/护照(反面)"
                ></image-upload-modal>
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
                <el-input v-model="form.bankName" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="收款人名称" prop="cardHolder">
                <el-input v-model="form.cardHolder" placeholder="请输入"> </el-input>
              </el-form-item>
              <el-form-item label="账户类型" prop="cardType" show-word-limit>
										<el-select v-model="form.cardType" placeholder="请选择">
											<el-option label="储蓄" value="0"></el-option>
											<el-option label="支票" value="1"></el-option>
										</el-select>
									</el-form-item>
              <el-form-item label="收款路线号码" prop="routingNumber">
                <el-input v-model="form.routingNumber" placeholder="请输入"> </el-input>
              </el-form-item>
              <el-form-item label="账户号码" prop="cardNumber">
                <el-input v-model="form.cardNumber" placeholder="请输入"> </el-input>
              </el-form-item>
            </el-row>
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>
  </el-form>
</template>

<script>
export default {
  name: '',
  components: {},
  props: {
    form: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      disableSubmit: true,
      activeNames: ['1', '2', '3', '4', '5'],
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style scoped lang="scss"></style>
