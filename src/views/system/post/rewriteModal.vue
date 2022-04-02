<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="800px">
    <el-form ref="form" :model="form" label-width="120px" :rules="rules">
      <el-form-item label="岗位名称：" prop="postName">
        <el-input v-model="form.postName"></el-input>
      </el-form-item>
      <el-form-item label="岗位编码：" prop="postCode">
        <el-input v-model="form.postCode"></el-input>
      </el-form-item>
      <el-form-item label="显示顺序：" prop="postSort">
        <el-input v-model="form.postSort"></el-input>
      </el-form-item>

      <el-form-item label="岗位状态：">
        <el-radio-group v-model="form.status">
          <el-radio label="0">正常</el-radio>
          <el-radio label="1">停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input v-model="form.remark" type="textarea" :rows="2"></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addPost, writePost } from '@/api/system/post'
import { isNumberStr } from '@/utils/validate'
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      form: { status: '0' },
      dialogVisible: false,
      title: '新增岗位',
      flag: 'add',
      rules: {
        postName: [{ required: true, message: '请输入岗位名称', trigger: 'blur' }],
        postCode: [{ required: true, message: '请输入岗位编码', trigger: 'blur' }],
        postSort: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              isNumberStr(value) ? callback() : callback(new Error('请输入数字'))
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
    add() {
      this.dialogVisible = true
      this.flag = 'add'
      this.form = { status: '0' }
    },
    edit(info) {
      Object.assign(this.form, info)
      this.flag = 'edit'
      console.log('%c [ form ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.form)
      this.dialogVisible = true
    },
    handleSubmit() {
      this.$refs['form'].validate((valid) => {
        if (!valid) return
        let action = this.flag === 'add' ? addPost : writePost
        action(this.form).then((res) => {
          if (res.code === 0) {
            this.$message.success(res.msg || '操作成功')
            this.close()
          } else {
            this.$message.warning(res.msg || '服务器错误')
          }
        })
      })
    },
    close() {
      this.dialogVisible = false
      this.form = { status: '0' }
      this.$emit('OK')
    },
  },
}
</script>

<style scoped lang="scss"></style>
