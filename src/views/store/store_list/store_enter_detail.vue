<template>
  <div class="dashboard-editor-container">
    <div class="content-box">
      <div style="textAlign:right" v-if="this.routeData.id">
        <el-button type="text" :disabled="false" @click="handleHistoricalSubmissionRecord">查看历史提交记录</el-button>
      </div>
      <strore_enter_detail_modal ref="stroreEnterDetailModal" :form="form" />

      <div class="button" v-if="form.searchType === '1' || form.searchType === '2'">
        <el-button @click="close()">取消</el-button>
        <el-button type="warning" @click="handleCancel()">{{ '审核驳回' }}</el-button>
        <el-button type="primary" @click="handleSubmit()" :loading="loading">{{
          loading ? '等待中' : '审核通过'
        }}</el-button>
      </div>
    </div>
    <audit-modal ref="auditModal" @OK="close"></audit-modal>
    <history-modal ref="historyModal" @OK="close"></history-modal>
  </div>
</template>

<script>
import { queryShopAuditDetail, shopAuditAuditShop } from '@/api/store'
import strore_enter_detail_modal from './strore_enter_detail_modal'
import auditModal from './auditModal'
import historyModal from './historicalSubmissionRecordModal.vue'
import { validateName } from '@/utils/validate.js'
export default {
  name: 'StoreEnterDetail',
  components: { auditModal, historyModal, strore_enter_detail_modal },
  props: {},
  data() {
    return {
      loading: false,
      flag: 'add',
      disableSubmit: true,
      activeNames: ['1', '2', '3', '4', '5'],
      form: {
        phone: undefined,
        searchType: undefined,
        businessType: 0,
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
        shopTaxNumber: '321321',
        shopHeadPic: '321321',
        identityFront: '321321321',
        identityReverse: '321321321',
      },
      routeData: {},
      dialogTableVisible: false,
    }
  },
  computed: {},
  watch: {},
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (!vm.$route.query || !vm.$route.query.edit) {
        vm.$router.push({ path: '/store/store_list' })
      }
      vm.routeData = JSON.parse(decodeURIComponent(vm.$route.query.edit))
      console.log('%c [ vm.routeData ]-221', 'font-size:13px; background:pink; color:#bf2c9f;', vm.routeData)
      vm.init(vm.routeData.shopAuditId)
    })
  },
  created() {},
  mounted() {},
  methods: {
    init(shopAuditId) {
      queryShopAuditDetail({ shopAuditId: shopAuditId })
        .then((res) => {
          this.form = Object.assign(this.form, res.data, { searchType: this.routeData.searchType })
          console.log('%c [ this.form ]-87', 'font-size:13px; background:pink; color:#bf2c9f;', this.form)
        })
        .catch(() => {
          this.$message.error('服务器错误')
          this.$router.push({ path: '/store/store_list' })
        })
    },
    handleSubmit() {
      console.log('%c [ this.form ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.form)
      let obj = Object.assign(this.form, {
        auditStatus: '1',
        auditRemark: undefined,
        shopAuditId: this.routeData.shopAuditId,
      })
      if (this.form.searchType === '2') {
        this.$confirm('请确认是否对该店铺进行审核通过处理', '操作确认', {
          cancelButtonText: '再想想',
          confirmButtonText: '确认通过',
        })
          .then(() => {
            this.loading = true
            return shopAuditAuditShop(obj)
          })
          .then((res) => {
            this.$message.success(res.messgae || '操作成功')
            this.loading = false
            this.close()
          })
          .catch(() => {
            this.loading = false
          })
      } else if (this.form.searchType === '1') {
        this.$refs.auditModal.show(obj)
      }
    },
    handleCancel() {
      this.$prompt('审核驳回', {
        inputPlaceholder: '驳回原因',
        showInput: true,
        type: 'warning',
        inputType: 'textarea',
        rows: 10,
        // inputPattern: /^.{1,100}$/,
        inputValidator: (value) => {
          return validateName(value, 1, 100)
        },
        inputErrorMessage: '字符长度请在1~100之间',
      })
        .then(({ value }) => {
          console.log('%c [ value ]', 'font-size:13px; background:pink; color:#bf2c9f;', value)
          let obj = { shopAuditId: this.routeData.shopAuditId, auditStatus: '2', auditRemark: value }
          return shopAuditAuditShop(obj)
        })
        .then((res) => {
          this.$message.success(res.messgae || '操作成功')
          this.close()
        })
        .catch((err) => {
          console.log('%c [ err ]', 'font-size:13px; background:pink; color:#bf2c9f;', err)
        })
    },
    //  查看历史提交记录
    handleHistoricalSubmissionRecord() {
      this.routeData.id && this.$refs.historyModal.show({ shopId: this.routeData.id })
    },
    close() {
      let view = this.$route
      this.$store.dispatch('tagsView/delView', view).then(() => {
        this.$router.push({ path: '/store/store_list' })
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
  padding: 20px;
}
</style>
