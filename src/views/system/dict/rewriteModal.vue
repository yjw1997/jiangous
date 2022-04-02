<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="800px">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="上级字典">
        <el-cascader
          :options="menuOptions"
          :show-all-levels="false"
          :props="props"
          v-model="form.parentCode"
          clearable
          ref="menu"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="字典名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入字典名称" />
      </el-form-item>
      <el-form-item label="字典值" prop="value">
        <el-input v-model="form.value" placeholder="请输入字典值" />
      </el-form-item>
      <el-form-item label="字典主鍵" prop="code">
        <el-input v-model="form.code" placeholder="请输入字典主鍵" />
      </el-form-item>
      <el-form-item label="是否隐藏">
        <el-switch v-model="form.hidden" :active-value="true" :inactive-value="false"></el-switch>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addDict, writeDict } from '@/api/system/dict'
export default {
  name: '',
  components: {},
  data() {
    return {
      form: { parentCode: 'NONE', hidden: false, name: '', value: '', code: '', remark: '', id: 0 },
      dialogVisible: false,
      title: '',
      flag: 'add',
      props: { checkStrictly: true, label: 'name', value: 'code', emitPath: false },
      menuOptions: [],
      rules: {
        code: [{ required: true, message: '请输入字典主鍵', trigger: 'blur' }],
        name: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
        value: [{ required: true, message: '请输入字典值', trigger: 'blur' }],
      },
    }
  },

  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      this.menuOptions = []
      const menu = { code: 'NONE', name: '主类目', children: [], parentCodes: 'NONE' }
      menu.children = this.$parent.dataList
      this.menuOptions.push(menu)
    },
    add() {
      this.getTreeselect()
      this.dialogVisible = true
      this.flag = 'add'
      this.form = { parentCode: 'NONE', hidden: false, name: '', value: '', code: '', remark: '', id: 0 }
    },
    edit(info) {
      this.getTreeselect()
      Object.assign(this.form, info)
      console.log('%c [ this.form ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.form)
      this.flag = 'edit'
      this.dialogVisible = true
    },
    handleSubmit() {
      this.$refs['form'].validate((valid) => {
        if (!valid) return
        let action = this.flag === 'add' ? addDict : writeDict
        console.log('%c [ this.form ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.form)
        this.findParentCode()
        action(this.form).then((res) => {
          if (res.code === 0) {
            this.$message.success(res.msg || '操作成功')
            this.close()
            this.$emit('OK')
          } else {
            this.$message.warning(res.msg || '服务器错误')
          }
        })
      })
    },
    close() {
      this.dialogVisible = false
      this.form = { parentCode: 'NONE', hidden: false, name: '', value: '', code: '', remark: '' }
    },
  },
}
</script>

<style scoped lang="scss">
::v-deep .el-upload-list__item {
  width: 148px !important;
  height: 148px !important;
}
</style>
