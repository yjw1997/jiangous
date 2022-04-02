<template>
  <el-dialog title="重置密码" :visible.sync="dialogVisible" width="30%">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="登录名称">
        <el-input v-model="form.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="输入密码">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleReset()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { resetPwd } from '@/api/system/user'
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      form: { username: '', password: '123456' },
      dialogVisible: false,
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    init(info) {
      Object.assign(this.form, info)
      console.log('%c [ form ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.form)
      this.dialogVisible = true
    },
    handleReset() {
      resetPwd(this.form).then((res) => {
        if (res.code === 0) {
          this.$message.success(res.msg || '操作成功')
          this.dialogVisible = false
        } else {
          this.$message.warning(res.msg || '服务器错误')
        }
      })
    },
  },
}
</script>

<style scoped lang="scss"></style>
