<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" :before-close="close" append-to-body>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" :show-message="false" status-icon>
      <el-row>
        <el-form-item label="请选择规格" prop="specificationId">
          <el-select
            v-model="form.specificationId"
            clearable
            filterable
            default-first-option
            size="small"
            :disabled="flag === 'edit'"
            @change="checkedClassify"
          >
            <el-option v-for="dict in selectDataList" :key="dict.id" :label="dict.name" :value="dict.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <el-radio-group v-model="form.status" size="small">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="销售规格">
          <el-button @click="addValueList" type="primary">添加</el-button>
        </el-form-item>

        <el-checkbox-group v-model="checkBoxValues">
          <el-checkbox v-for="item in specificationList" :key="item" :label="item"></el-checkbox>
        </el-checkbox-group>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
      <el-button @click="close">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { querySpecificationDownBoxList } from '@/api/goods'
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      dialogVisible: false,
      title: '',
      flag: '',
      specificationList: [],
      selectDataList: [],
      checkBoxValues: [],
      form: { specificationId: undefined, status: 1, specificationValues: '', mustFlag: 0, name: undefined },
      rules: { specificationId: [{ required: true, trigger: 'change' }] },
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    getSelectList() {
      return querySpecificationDownBoxList()
    },
    add() {
      this.getSelectList().then((res) => {
        this.selectDataList = res.data.filter((item) => item.status === 1)
        Object.assign(this.form, {})
        this.flag = 'add'
        this.dialogVisible = true
      })
    },
    edit(info) {
      this.getSelectList().then((res) => {
        this.selectDataList = res.data
        Object.assign(this.form, info)
        console.log('%c [ this.form ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.form)
        this.checkBoxValues =
          this.form.specificationValues && this.form.specificationValues !== null
            ? this.form.specificationValues.split(',')
            : []
        this.flag = 'edit'
        this.checkedClassify(this.form.specificationId)
        this.dialogVisible = true
      })
    },
    checkedClassify(id) {
      console.log('%c [ id ]', 'font-size:13px; background:pink; color:#bf2c9f;', id)
      let obj = this.selectDataList.filter((item) => item.id === id)[0]
      this.checkBoxValues = []
      //  新增规格项时为空
      if (obj) {
        this.specificationList = [...new Set(this.checkBoxValues.concat(obj.valueList))]
        this.form.name = obj.name
      } else {
        this.specificationList = [...new Set(this.checkBoxValues)]
      }
    },

    addValueList() {
      if (!this.form.specificationId) {
        this.$message.warning('请先选择规格')
        return
      }
      this.$confirm(`新增`, { showInput: true })
        .then(({ value }) => {
          this.specificationList.push(value)
        })
        .catch(() => {})
    },
    handleSubmit() {
      this.$refs['form'].validate((valid) => {
        if (!valid) return
        if (!this.checkBoxValues.join()) {
          this.$message.warning('至少勾选一种规格值')
          return
        }
        this.form.specificationValues = this.checkBoxValues.join()
        console.log(
          '%c [ this.checkBoxValues ]',
          'font-size:13px; background:pink; color:#bf2c9f;',
          this.checkBoxValues,
        )
        console.log('%c [ this.form ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.form)
        this.$emit(this.flag, this.form)
        this.close()
      })
    },
    close() {
      this.form = {
        name: undefined,
        status: 1,
        specificationId: undefined,
        specificationValues: '',
        mustFlag: 0,
      }
      this.specificationList = []
      this.checkBoxValues = []
      this.dialogVisible = false
    },
  },
}
</script>

<style scoped lang="scss">
::v-deep .el-drawer__body {
  padding: 20px 30px;
}
</style>
