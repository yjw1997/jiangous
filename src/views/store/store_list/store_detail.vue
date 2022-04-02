<template>
  <div class="dashboard-editor-container">
    <div class="content-box">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-descriptions title="店铺信息" :column="2" direction="vertical" :colon="false" border>
            <el-descriptions-item label="注册账号" :span="2">{{ dataSource.phone || '---' }}</el-descriptions-item>
            <el-descriptions-item label="店铺名称" :span="2">{{ dataSource.shopName || '---' }}</el-descriptions-item>
            <el-descriptions-item label="经营类目">{{ dataSource.goodsClassifyCode || '---' }}</el-descriptions-item>
            <el-descriptions-item label="客服联系方式">{{ dataSource.hotLine || '---' }}</el-descriptions-item>
            <el-descriptions-item label="店铺状态"
              >{{ dataSource.shopStatus === 0 ? '已停用' : dataSource.shopStatus === 1 ? '营业中' : '已过期' }}
            </el-descriptions-item>
            <el-descriptions-item label="店铺类型">{{
              dataSource.shopType === 0 ? '普通店铺' : '自营店铺'
            }}</el-descriptions-item>
            <el-descriptions-item label="入驻日期">{{
              parseTime(dataSource.enterTime, '{y}-{m}-{d}') || '---'
            }}</el-descriptions-item>
            <el-descriptions-item label="有效期">{{
              parseTime(dataSource.validTime, '{y}-{m}-{d}') || '---'
            }}</el-descriptions-item>
            <el-descriptions-item label="店铺简介">{{ dataSource.shopDescription || '---' }}</el-descriptions-item>
          </el-descriptions>
        </el-col>
        <el-col :span="6">
          <el-descriptions>
            <el-descriptions-item label="店铺logo" :span="2">
              <image-upload-modal v-model="dataSource.shopLogo" :limit="1" disabled></image-upload-modal>
            </el-descriptions-item>
          </el-descriptions>
        </el-col>
        <el-col :span="6">
          <el-descriptions>
            <template slot="extra">
              <div class="button">
                <el-button type="primary" size="small" @click="handleEnterDetail()">入驻信息</el-button>
                <el-button type="primary" size="small" @click="handleEdit()" v-if="dataSource.shopStatus !== 0"
                  >修改有效期</el-button
                >
                <el-button type="primary" size="small" @click="handlePushgoodsList()">店铺商品</el-button>
                <el-button type="primary" size="small" @click="handlePushorderList()">店铺订单</el-button>
                <el-button
                  :type="dataSource.shopStatus === 0 ? 'success' : 'warning'"
                  size="small"
                  @click="handleUpdateShopStatus(dataSource.shopStatus)"
                  >{{ dataSource.shopStatus === 0 ? '启用店铺' : '停用店铺' }}</el-button
                >
              </div>
            </template>
          </el-descriptions>
        </el-col>
      </el-row>
    </div>
    <rewrite-modal ref="modalForm" @OK="modelOK" @upload="changeShopStatusUp"></rewrite-modal>
  </div>
</template>

<script>
import { queryEnterShopDetail, updateShopStatusShop } from '@/api/store'
import rewriteModal from './rewriteModal.vue'
import { validateName } from '@/utils/validate.js'
export default {
  name: '',
  components: { rewriteModal },
  props: {},
  data() {
    return {
      dataSource: {},
      form: {},
    }
  },
  computed: {},
  watch: {},
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (!vm.$route.query || !vm.$route.query.edit) {
        vm.$router.push({ path: '/store/store_list' })
      }
      vm.form = JSON.parse(decodeURIComponent(vm.$route.query.edit))
      vm.init(vm.form.id)
    })
  },
  created() {},
  mounted() {},
  methods: {
    init(id) {
      queryEnterShopDetail({ shopId: id })
        .then((res) => {
          this.dataSource = res.data
        })
        .catch(() => {
          this.$message.error('服务器错误')
          this.$router.push({ path: '/store/store_list' })
        })
    },

    //入驻信息
    handleEnterDetail() {
      console.log('%c [ this.form ]-101', 'font-size:13px; background:pink; color:#bf2c9f;', this.form)
      let url = encodeURIComponent(
        JSON.stringify({ id: this.form.id, shopAuditId: this.form.shopAuditId, searchType: '0' }),
      )
      this.$router.push({
        path: '/store/store_list/store_enter_detail',
        query: { edit: url },
      })
    },
    //  修改有效期
    handleEdit: function() {
      let record = null
      record = Object.assign(this.dataSource, { id: this.form.id })
      this.$refs.modalForm.title = '编辑'
      this.$refs.modalForm.disableSubmit = false
      this.$refs.modalForm.edit(record)
    },
    //  停用/启用店铺
    handleUpdateShopStatus(flag) {
      if (flag === 1 || flag === 2) {
        //店铺中存在有参与限时活动商品
        if (this.form.isActivityShop === true) {
          this.$prompt(
            '该商店存在已报名限时活动抢购且通过审核商品，停用该店铺将同时将商品从活动中移出，是否继续操作？',
            '提示',
            {
              type: 'warning',
              cancelButtonText: '再想想',
              confirmButtonText: '坚持停用',
              showInput: true,
              inputPlaceholder: '停用原因',
              // inputPattern: /^.{1,500}$/,
              inputValidator: (value) => {
                return validateName(value, 1, 500)
              },
              inputErrorMessage: '字符长度不能超过500',
              inputType: 'textarea',
            },
          )
            .then(({ value }) => {
              this.changeShopStatus(value)
            })
            .catch((err) => {
              console.log('%c [ err ]', 'font-size:13px; background:pink; color:#bf2c9f;', err)
            })
        } else {
          this.$prompt('停用店铺', {
            inputPlaceholder: '停用原因',
            showInput: true,
            type: 'warning',
            // inputPattern: /^.{1,500}$/,
            rows: 6,
            inputValidator: (value) => {
              return validateName(value, 1, 500)
            },
            inputType: 'textarea',
            inputErrorMessage: '字符长度不能超过500',
          })
            .then(({ value }) => {
              return this.changeShopStatus(value)
            })
            .then((res) => {
              this.$message.success(res.messgae || '操作成功')
              this.close()
            })
            .catch((err) => {
              console.log('%c [ err ]', 'font-size:13px; background:pink; color:#bf2c9f;', err)
            })
        }
      } else {
        this.dataSource.id = this.form.id
        this.$refs.modalForm.title = '启用店铺'
        this.$refs.modalForm.sendUpload = true
        this.$refs.modalForm.disableSubmit = false
        this.$refs.modalForm.edit(this.dataSource)
      }
    },
    changeShopStatus(remark) {
      updateShopStatusShop({
        shopId: this.form.id,
        shopStatus: this.dataSource.shopStatus === 0 ? 1 : 0,
        stopRemark: remark,
      })
        .then((res) => {
          this.$message.success(res.message || '操作成功')
          this.init(this.form.id)
        })
        .catch(() => {
          this.modelOK()
        })
    },
    changeShopStatusUp(row) {
      console.log('%c [ row ]', 'font-size:13px; background:pink; color:#bf2c9f;', row)
      updateShopStatusShop({
        shopId: this.form.id,
        shopStatus: this.dataSource.shopStatus === 0 ? 1 : 0,
        validDate: parseInt(row.validDate / 1000),
      })
        .then((res) => {
          this.$message.success(res.message || '操作成功')
          this.init(this.form.id)
        })
        .catch(() => {
          this.modelOK()
        })
    },
    modelOK() {
      this.init(this.form.id)
    },
    handlePushgoodsList() {
      let url = encodeURIComponent(JSON.stringify({ shopName: this.dataSource.shopName }))
      this.$router.push({
        path: '/goods/goods_list',
        query: { edit: url },
      })
    },
    handlePushorderList() {
      let url = encodeURIComponent(JSON.stringify({ shopName: this.dataSource.shopName }))
      this.$router.push({
        path: '/order/order_list',
        query: { edit: url },
      })
    },
  },
}
</script>

<style scoped lang="scss">
.el-descriptions {
  font-size: 16px;
}
.button {
  display: flex;
  flex-direction: column;
  button {
    margin: 10px 0;
  }
}
::v-deep .el-descriptions__title {
  font-size: 20px;
}
</style>
