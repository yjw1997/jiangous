<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="800px" destroy-on-close :before-close="close">
    <el-form ref="form" :model="form" :rules="rules" :disabled="disableSubmit" label-width="120PX" status-icon>
      <el-row :span="24">
        <el-col :span="24">
          <el-form-item label="敏感词" prop="keyWord">
            <el-input v-model="form.keyWord" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="词汇等级" prop="level">
            <w-dict-select-tag v-model="form.level" :undefinedNo="false" dictCode="wordLevel"></w-dict-select-tag>
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
import { getSensitiveWordAdd, getSensitiveWordEdit } from '@/api/platform'
import { validateNameForm } from '@/utils/validate.js'
export default {
  name: '',
  props: {},
  data() {
    return {
      form: {
        keyWord: undefined,
        level: undefined,
      },
      dialogVisible: false,
      disableSubmit: false,
      title: '',
      flag: '',
      loading: false,
      // 表单校验
      rules: {
        keyWord: [{ required: true, message: '请输入正确格式',trigger: 'change' }, { validator: validateNameForm(2, 20) }],
        level: [{ required: true, message: '请选择词汇等级',trigger: 'change' }],
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
        this.loading = true
        let action = this.flag === 'edit' ? getSensitiveWordEdit : getSensitiveWordAdd
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
            this.loading = false
          })
      })
    },

    close() {
      this.dialogVisible = false
      this.loading = false
      this.form = {
        keyWord: undefined,
        level: undefined,
      }
    },
  },
}
</script>

<style scoped lang="scss"></style>
