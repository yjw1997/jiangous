<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="500px"
    destroy-on-close
    append-to-body
    :before-close="close"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      :disabled="disableSubmit"
      label-width="150px"
      :show-message="false"
      status-icon
    >
      <el-row :span="24">
        <el-col :span="24">
          <el-form-item label="驳回原因" prop=" reasonType">
            <el-radio-group v-model="form.reasonType" size="small">
              <el-radio label="0">金额少付</el-radio>
              <el-radio label="1">其他原因</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="24" v-if="form.reasonType === '0'">
          <el-form-item prop="auditRemark">
            <el-input type="textarea" v-model="form.auditRemark"  size="medium" maxlength="200"  :rows="10" show-word-limit placeholder="请输入您的驳回理由"></el-input>
          </el-form-item>
        </el-col> -->
        <el-col :span="24">
          <el-form-item prop="auditRemark">
            <el-input type="textarea" v-model="form.auditRemark"  size="medium" maxlength="200"  :rows="10" show-word-limit placeholder="请输入您的驳回理由"></el-input>
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
import { userCertificateAuditReject } from '@/api/order'
export default {
  name: '',
  props: {},
  data() {
    return {
      form: {
        reasonType: '0',
        auditRemark: undefined,
      },
      dialogVisible: false,
      disableSubmit: false,
      title: '',
      flag: '',
      loading: false,
      // 表单校验
      rules: {
        reasonType: [{ required: true, trigger: 'blur' }],
        auditRemark: [{ required: true, trigger: 'blur' }],
      },
      // auditRemarkOne:undefined,
      // auditRemarkTwoP:undefined
    }
  },
  computed: {},
  watch: {
    'form.reasonType':{
      handler(newVal,oldVal){
        //  之后绑定两个值就好
        // if(oldVal==="0"){
        //    this.auditRemarkTwo == this.form.auditRemark ? "" : this.auditRemarkTwo = this.form.auditRemark
        //    this.form.auditRemark=this.auditRemarkOne
        // }else if(oldVal==="1"){
        //    this.auditRemarkOne == this.form.auditRemark ? "" : this.auditRemarkOne = this.form.auditRemark
        //    this.form.auditRemark=this.auditRemarkTwo
        // }
        this.form.auditRemark = undefined
      },
      deep: true
    }
  },
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
        let action = userCertificateAuditReject
        console.log('%c [ this.form ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.form)
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
        reasonType: '0',
        auditRemark: undefined,
      }
    },
  },
}
</script>

<style scoped lang="scss"></style>
