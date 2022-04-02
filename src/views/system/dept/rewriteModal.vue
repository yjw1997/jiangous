<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="800px">
    <el-form ref="form" :model="form" label-width="120px" :rules="rules">
      <el-form-item label="上级部门：" prop="parentId">
        <el-cascader
          :options="this.$parent.dataSource"
          :show-all-levels="false"
          :props="props"
          v-model="form.parentId"
          clearable
        ></el-cascader>
      </el-form-item>
      <el-form-item label="部门名称：" prop="deptName">
        <el-input v-model="form.deptName"></el-input>
      </el-form-item>
      <el-form-item label="显示顺序：" prop="orderNum">
        <el-input v-model="form.orderNum"></el-input>
      </el-form-item>

      <el-form-item label="负责人：">
        <el-input v-model="form.leader"></el-input>
      </el-form-item>
      <el-form-item label="联系电话：">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="邮箱：">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item label="部门状态：">
        <el-radio-group v-model="form.status">
          <el-radio label="0">正常</el-radio>
          <el-radio label="1">停用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addDept, writeDept } from '@/api/system/dept'
import { isNumberStr } from '@/utils/validate'
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      form: { status: '0', parentId: '0' },
      dialogVisible: false,
      title: '',
      flag: 'add',
      props: { checkStrictly: true, label: 'deptName', value: 'deptId', emitPath: false },
      rules: {
        parentId: [{ required: true, message: '请选择上级部门', trigger: 'blur' }],
        deptName: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
        orderNum: [
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
        let action = this.flag === 'add' ? addDept : writeDept
        console.log('%c [ this.form ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.form)
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
