<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="800px" destroy-on-close :before-close="close">
    <el-form ref="form" :model="form" :rules="rules" :disabled="disableSubmit" label-width="120PX" status-icon center>
      <el-row :span="24">
        <el-col :span="24">
          <el-form-item label="分类名称" prop="intentionClassifyName">
            <el-input v-model="form.intentionClassifyName" placeholder="请输入" maxlength="20" show-word-limit />
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
import { getUserBuyIntentionClassifyAdd } from '@/api/platform'
import { validateNameForm } from '@/utils/validate.js'
export default {
  name: '',
  props: ['dataSource'],
  data() {
    return {
      form: {
        intentionClassifyName: undefined,
      },
      dialogVisible: false,
      disableSubmit: false,
      title: '',
      flag: '',
      loading: false,
      // 表单校验
      rules: {
        intentionClassifyName: [
          { required: true, trigger: 'blur',message: '请输入正确格式', },
          {
            validator: validateNameForm(2, 40),
          },
        ],
      },
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    add() {
      this.flag = 'add'
      this.dialogVisible = true
    },
    edit(info) {
      Object.assign(this.form, info)
      this.flag = 'edit'
      this.dialogVisible = true
    },
    handleSubmit() {
      this.$refs['form'].validate(async (valid) => {
        if (!valid) return
        let resName = this.dataSource.filter((item) => item.intentionClassifyName === this.form.intentionClassifyName)
        if (resName.length > 0) {
          this.$message.warning('请不要输入重复的分类名')
          return
        }
        this.loading = true
        let action = getUserBuyIntentionClassifyAdd
        await action(this.form).then((res) => {
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
        intentionClassifyName: undefined,
      }
    },
  },
}
</script>

<style scoped lang="scss"></style>
