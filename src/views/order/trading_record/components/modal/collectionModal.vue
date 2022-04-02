<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="500px"
    destroy-on-close
    :before-close="close"
    append-to-body
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      :disabled="disableSubmit"
      label-width="100px"
      :show-message="false"
      status-icon
    >
      <el-row :span="24">
        <el-col :span="24">
          <el-form-item label="备注收款来源" prop=" moneyChannel">
            <!-- <w-dict-select-tag dictCode="moneyChannel" v-model="form.moneyChannel" /> -->
            <el-select v-model="form.moneyChannel" placeholder="收款来源" clearable size="small">
              <el-option v-for="dict in moneyChannelOptions" :key="dict.id" :label="dict.label" :value="dict.type" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer" v-if="!disableSubmit">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="handleSubmit()" :loading="loading">{{
        !loading ? '确 定' : '等待中'
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { userCertificateAuditConfirmPayment, orderGoodsUpdate, listTypeShopAccount } from '@/api/order'
export default {
  name: '',
  props: {},
  data() {
    return {
      form: {
        moneyChannel: undefined,
      },
      dialogVisible: false,
      disableSubmit: false,
      title: '',
      flag: '',
      loading: false,
      moneyChannelOptions: [],
      // 表单校验
      rules: {
        moneyChannel: [{ required: false, trigger: 'blur' }],
      },
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    show(info) {
      listTypeShopAccount({ shopId: info.shopId }).then((res) => {
        this.moneyChannelOptions = res.data
        Object.assign(this.form, info)
        console.log('%c [ this.form ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.form)
        this.dialogVisible = true
      })
    },
    handleSubmit() {
      this.$refs['form'].validate(async (valid) => {
        if (!valid) return
        this.loading = true
        let action = this.flag === 'edit' ? orderGoodsUpdate : userCertificateAuditConfirmPayment
        await action(this.form)
          .then((res) => {
            if (res.code === 0) {
              this.$message.success(res.msg || '操作成功')
              this.$emit('OK')
              this.close()
            } else {
              this.$message.warning(res.msg || '服务器错误')
              this.close()
            }
          })
          .catch(() => {
            this.close()
          })
      })
    },
    close() {
      this.dialogVisible = false
      this.loading = false
      this.form = {
        moneyChannel: undefined,
      }
    },
  },
}
</script>

<style scoped lang="scss"></style>
