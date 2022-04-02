<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="450px" destroy-on-close :before-close="close">
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <div class="dialog-box">
        <el-steps direction="vertical" :active="1" v-if="dataSource && dataSource.list && dataSource.list.length > 0">
          <el-step
            :title="item.auditStatus === 0 ? '凭证提交时间' : item.auditStatus === 1 ? '审核通过' : '商家审核驳回'"
            :status="item.auditStatus === 0 ? '' : item.auditStatus === 1 ? 'success' : 'error'"
            v-for="item in dataSource.list"
            :key="item.id"
          >
            <div slot="description">
              <div v-if="item.auditStatus === 0">
                <div>{{ parseSecondTime(item.commitTime) }}</div>
                <image-upload-modal v-model="item.certificateUrl" :limit="0" disabled></image-upload-modal>
              </div>
              <div v-else-if="item.auditStatus === 1">
                <div>{{ parseSecondTime(item.auditTimeStamp) }}</div>
                <!-- 收款来源:
            <span v-if="item.moneyChannel === 0">银行卡</span>
            <span v-if="item.moneyChannel === 1">pay_pal</span>
            <span v-if="item.moneyChannel === 2">zelle</span>
            <span v-if="item.moneyChannel === 3">微信支付</span>
            <span v-if="item.moneyChannel === 4">支付宝</span> -->
              </div>
              <div v-else-if="item.auditStatus === 2">
                <div>{{ parseSecondTime(item.auditTimeStamp) }}</div>

                驳回理由：
                <div>{{ item.auditRemark }}</div>
              </div>
            </div>
          </el-step>
        </el-steps>
      </div>
    </el-scrollbar>

    <span slot="footer" class="dialog-footer" v-if="!disableSubmit">
      <el-button @click="handleCancal">驳回交易凭证</el-button>
      <el-button type="primary" @click="handleSubmit()" :loading="loading">{{
        !loading ? '确定收款' : '等待中'
      }}</el-button>
    </span>
    <collection-modal ref="collectionModal" @OK="modelOK"></collection-modal>
    <cancel-modal ref="cancelModal" @OK="modelOK"></cancel-modal>
  </el-dialog>
</template>

<script>
import { queryUserCertificateAudit } from '@/api/order'
import collectionModal from './collectionModal.vue'
import cancelModal from './cancelModal.vue'
export default {
  name: '',
  props: {},
  components: { collectionModal, cancelModal },
  data() {
    return {
      form: {},
      dialogVisible: false,
      disableSubmit: false,
      title: '',
      flag: '',
      loading: false,
      dataSource: {},
      params: {},
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    show(info) {
      Object.assign(this.form, info)
      queryUserCertificateAudit({ orderNo: info.orderNo })
        .then((res) => {
          this.dataSource = res.data
          if (this.dataSource === null || !this.dataSource) {
            this.$message.warning('没有交易凭证记录')
            return
          }
          console.log('%c [ this.dataSource ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.dataSource)
          let map = new Map()

          this.dataSource.list.forEach((item) => {
            //审核驳回情况下拆成两条,审核通过情况下只有一条,拆开成两条
            if (item.auditStatus === 2 || (item.auditStatus === 1 && item.commitTime !== null)) {
              map.set(item, {
                auditStatus: 0,
                commitTime: item.commitTime,
                certificateUrl: item.certificateUrl,
              })
            }
          })
          map.forEach((item, key) => {
            let index = this.dataSource.list.indexOf(key)
            this.dataSource.list.splice(index, 0, item)
          })

          this.dialogVisible = true
          this.params = {
            id: this.dataSource.list[this.dataSource.list.length - 1].id || '',
            orderNo: this.form.orderNo,
            deliverMode: this.form.deliverMode,
          }
        })
        .catch(() => {
          this.close()
        })
    },
    //  确认收款
    handleSubmit() {
      this.params = {
        id: this.dataSource.list[this.dataSource.list.length - 1].id,
        orderNo: this.form.orderNo,
        deliverMode: this.form.deliverMode,
        shopId: this.form.shopId,
        appUserId: this.dataSource.appUserId,
      }
      this.$refs.collectionModal.title = '确认收款'
      this.$refs.collectionModal.show(this.params)
    },
    //  驳回交易凭证
    handleCancal() {
      this.params = {
        id: this.dataSource.list[this.dataSource.list.length - 1].id,
        orderNo: this.form.orderNo,
        appUserId: this.dataSource.appUserId,
      }
      this.$refs.cancelModal.title = '驳回理由'
      this.$refs.cancelModal.show(this.params)
    },
    close() {
      this.dialogVisible = false
      this.loading = false
      this.form = {
        orderCloseReason: undefined,
        orderReason: undefined,
      }
    },
    modelOK() {
      this.$emit('OK')
      this.close()
    },
  },
}
</script>

<style scoped lang="scss">
.dialog-box {
  max-height: 450px;
  padding: 10px 0;
}
</style>
