<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="800px" destroy-on-close :before-close="close">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      :disabled="disableSubmit"
      label-width="120PX"
      :show-message="false"
      status-icon
    >
      <el-row :span="24">
        <el-col :span="24">
          <el-form-item label="入驻时间" prop="enterTime">
            <el-input v-model="form.enterTime" disabled style="width:220px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="有效日期" prop="validDate">
            <el-date-picker
              v-model="form.validDate"
              align="right"
              type="date"
              value-format="timestamp"
              placeholder="有效日期"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
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
import { updateShopValidTime } from '@/api/store'
export default {
  name: '',
  props: {},
  data() {
    return {
      form: {
        enterTime: undefined,
        validDate: undefined,
      },
      dialogVisible: false,
      disableSubmit: false,
      title: '',
      flag: '',
      loading: false,
      sendUpload: false,
      // 表单校验
      rules: {
        validDate: [{ required: true, trigger: 'change' }],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        },
      },
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    edit(info) {
      info.validDate = info.validDate ?? info.validTime
      this.form = Object.assign(this.form, info)
      this.form.validDate = this.form.validDate ?? false ? this.form.validDate * 1000 : this.form.enterTime
      this.form.enterTime =
        this.form.enterTime ?? false ? this.parseTime(this.form.enterTime * 1000, '{y}-{m}-{d}') : this.form.enterTime
      this.flag = 'edit'
      console.log('%c [ this.form ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.form)
      this.dialogVisible = true
    },
    handleSubmit() {
      this.$refs['form'].validate(async (valid) => {
        if (!valid) return
        if (this.form.validDate < Date.now()) {
          this.$message.warning('有效日期必须大于当前时间')
          return
        }

        if (this.sendUpload) {
          this.$emit('upload', this.form)
          this.close()
          return
        }
        this.loading = true
        let action = updateShopValidTime

        let obj = {
          ids: [this.form.id],
          validTime: parseInt(this.form.validDate / 1000),
        }
        await action(obj)
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
        enterTime: undefined,
        validDate: undefined,
      }
      this.sendUpload = false
    },
  },
}
</script>

<style scoped lang="scss"></style>
