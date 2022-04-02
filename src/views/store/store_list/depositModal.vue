<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="800px" destroy-on-close :before-close="close">
    <el-form ref="form" :model="form" :rules="rules" label-width="120PX" :show-message="false" status-icon>
      <el-row :span="24">
        <el-form-item label="是否缴纳押金" prop="payDepositFlag">
          <el-radio-group v-model="form.payDepositFlag" size="small">
            <el-radio :label="false">否 </el-radio>
            <el-radio :label="true">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="缴纳金额" prop="depositMoney" v-if="form.payDepositFlag === true">
          <el-input v-model="form.depositMoney" placeholder="请输入" show-word-limit maxlength="9"> </el-input>
        </el-form-item>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="handleSubmit()" :loading="loading">{{
        !loading ? '确 定' : '等待中'
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { updateDepositMoney } from '@/api/store'
import { isMoney } from '@/utils/validate.js'
export default {
  name: '',
  props: {},
  data() {
    return {
      form: {
        payDepositFlag: true,
        depositMoney: undefined,
      },
      dialogVisible: false,
      title: '修改押金',
      flag: '',
      loading: false,
      // 表单校验
      rules: {
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
      console.log('%c [ info ]', 'font-size:13px; background:pink; color:#bf2c9f;', info)
      this.form.shopId = info.id
      this.form.payDepositFlag = info.payDepositFlag === 1 ? true : false
      this.form.depositMoney = info.depositMoney ?? false ? info.depositMoney : undefined
      console.log('%c [ this.form ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.form)
      this.flag = 'edit'
      this.dialogVisible = true
    },
    handleSubmit() {
      this.$refs['form'].validate(async (valid) => {
        if (!valid) return
        this.loading = true
        let action = updateDepositMoney
        let obj = this.cloneDeep(this.form)

        obj.auditStatus = 1
        obj.validDate = obj.validDate ?? false ? obj.validDate / 1000 : undefined
        await action(obj).then((res) => {
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
        payDepositFlag: true,
        depositMoney: undefined,
      }
    },
  },
}
</script>

<style scoped lang="scss"></style>
