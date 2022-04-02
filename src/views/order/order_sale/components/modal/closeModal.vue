<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="800px" destroy-on-close :before-close="close">
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
          <el-alert title="请您在与买家达成一致后，再使用关闭交易这个功能" type="success" show-icon> </el-alert>
        </el-col>
        <el-col :span="24">
          <el-form-item label="请选择关闭原因" prop="cancelDicId">
            <w-dict-select-tag dictCode="orderCloseReason" ref="dictSelectTag" v-model="form.cancelDicId" />
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="form.cancelDicId === '5'">
          <el-form-item prop="cancelRemark">
            <el-input type="textarea" v-model="form.cancelRemark" maxlength="200" show-word-limit :rows="4"></el-input>
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
import { orderGoodsBatchClose } from '@/api/order'
export default {
  name: '',
  props: {},
  data() {
    return {
      form: {
        cancelDicId: undefined,
        cancelRemark: undefined,
      },
      dialogVisible: false,
      disableSubmit: false,
      title: '',
      flag: '',
      loading: false,
      // 表单校验
      rules: {
        cancelDicId: [{ required: true, trigger: 'blur' }],
        cancelRemark: [{ required: true, trigger: 'blur' }],
      },
    }
  },
  computed: {},
  watch: {
    'form.cancelDicId'(val) {
      if (!val) {
        this.form.cancelRemark = ''
      } else {
        this.form.cancelRemark = this.$refs.dictSelectTag.dictOptions.filter(
          (item) => item.dicKey === this.form.cancelDicId,
        )[0].dicValue
      }
    },
  },
  created() {},
  mounted() {},
  methods: {
    show(info) {
      this.form.orderNos = info.orderNos
      this.dialogVisible = true
    },
    handleSubmit() {
      this.$refs['form'].validate(async (valid) => {
        if (!valid) return
        this.loading = true
        let action = orderGoodsBatchClose
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
        cancelDicId: undefined,
        cancelRemark: undefined,
      }
    },
  },
}
</script>

<style scoped lang="scss"></style>
