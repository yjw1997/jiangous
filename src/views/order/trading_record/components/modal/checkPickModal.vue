<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="500px" destroy-on-close :before-close="close">
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
          <el-form-item label="取货码核对" prop="pickCode">
            <el-col :span="18">
              <el-input v-model="form.pickCode" maxlength="20" show-word-limit></el-input>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" @click="handleSubmit()" :loading="loading" style="margin-left:10px">{{
                !loading ? '核对' : '等待中'
              }}</el-button>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col v-if="showAlertMsg">
          <el-alert :type="alertMsg.type" :title="alertMsg.title" show-icon> </el-alert>
        </el-col>
        <el-col v-if="alertMsg.type === 'success'">
          <div>取货商品:</div>
          <div v-for="str in alertContent" :key="str.goodsId">{{ str.goodsCountStr }}</div>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer" v-if="!disableSubmit">
      <el-button @click="close">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { checkPickCodeApi } from '@/api/order'
export default {
  name: '',
  props: {},
  data() {
    return {
      form: {
        pickCode: undefined,
        shopId: undefined,
      },
      dialogVisible: false,
      disableSubmit: false,
      title: '',
      flag: '',
      loading: false,
      // 表单校验
      rules: {
        pickCode: [{ required: true, trigger: 'blur' }],
      },
      alertMsg: {
        title: '',
        type: '',
      },
      showAlertMsg: false,
      alertContent: [],
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    show(info) {
      Object.assign(this.form, info)
      console.log('%c [ this.form ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.form)
      this.dialogVisible = true
    },
    handleSubmit() {
      this.$refs['form'].validate(async (valid) => {
        if (!valid) return
        this.loading = true
        let action = checkPickCodeApi
        await action(this.form)
          .then((res) => {
            if (res.code === 0) {
              this.alertMsg = { type: 'success', title: res.message }
              this.alertContent = res.data
              this.$emit('OK')
            }
          })
          .catch((err) => {
            this.alertMsg = { type: 'warning', title: err.message }
          })
          .finally(() => {
            this.showAlertMsg = true
            this.loading = false
          })
      })
    },
    close() {
      this.dialogVisible = false
      this.loading = false
      this.form = {
        pickCode: undefined,
        shopId: undefined,
      }
      this.alertMsg = {
        title: '',
        type: '',
      }
      this.showAlertMsg = false
      this.alertContent = ''
    },
  },
}
</script>

<style scoped lang="scss"></style>
