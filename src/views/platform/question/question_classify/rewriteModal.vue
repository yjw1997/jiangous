<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="800px" destroy-on-close :before-close="close">
    <el-form ref="form" :model="form" :rules="rules" :disabled="disableSubmit" center show-message label-width="120px">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="标题" prop="title">
            <el-input v-model="form.title" placeholder="请输入" show-word-limit :maxlength="16" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="问题详情" prop="detail">
            <Tinymce v-model="form.detail" ref="tinymce" :limit="5000" upload></Tinymce>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="是否显示">
            <el-switch v-model="form.status" :active-value="true" :inactive-value="false"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="排序" prop="sort">
            <el-input oninput ="value=value.replace(/[^0-9.]/g,'')" v-model="form.sort" maxlength="3" show-word-limit></el-input>
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
import { queryQuestionAdd, queryQuestionEdit } from '@/api/platform'
import { isNumberStr, validateNameForm } from '@/utils/validate'
import Tinymce from '@/components/Tinymce'
export default {
  components: { Tinymce },
  name: '',
  props: {},
  data() {
    return {
      form: {
        title: undefined,
        detail: undefined,
        status: true,
        sort: undefined,
      },
      dialogVisible: false,
      disableSubmit: false,
      title: '',
      flag: '',
      loading: false,
      // 表单校验
      rules: {
        title: [
          {
            required: true,
            trigger: 'change',
            validator: validateNameForm(2, 32),
            message: '请输入',
          },
        ],
        detail: [
          {
            required: true,
            trigger: 'change',
            message: '请输入问题描述且不超过5000个字',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('请输入问题描述且不超过5000个字'))
                return
              }
              let res = this.$refs.tinymce.messageShow
              !res ? callback() : callback(new Error('请输入问题描述且不超过5000个字'))
            },
          },
        ],
        status: [{ required: true, trigger: 'blur', message: '请输入' }],
        sort: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('请输入正确格式'))
                return
              }
              let res = isNumberStr(value)
              res ? callback() : callback(new Error('请输入正确格式'))
            },
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
    add(info) {
      Object.assign(this.form, info)

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
        let action = this.flag === 'add' ? queryQuestionAdd : queryQuestionEdit
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
          .finally(() => {
            this.loading = false
          })
      })
    },
    close() {
      this.dialogVisible = false
      this.loading = false
      this.form = {
        title: undefined,
        detail: undefined,
        status: true,
        sort: undefined,
      }
    },
  },
}
</script>

