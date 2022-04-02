<template>
  <el-drawer :title="title" :visible.sync="dialogVisible" size="50%" :before-close="close" append-to-body>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" :show-message="false" status-icon>
      <el-form-item label="规格名称" prop="name">
        <el-input v-model="form.name" placeholder="规格名称" maxlength="20" show-word-limit />
      </el-form-item>

      <el-form-item label="是否启用" prop="status">
        <el-radio-group v-model="form.status" size="small">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="规格值">
        <el-button @click="addSpecifcationList">添加</el-button>
      </el-form-item>

      <el-form-item>
        <draggable v-model="specificationValList">
          <div v-for="(item, index) in specificationValList" :key="item.index" class="item">
            <el-input v-model="item.value" style="width:200px" maxlength="50" show-word-limit></el-input>
            <el-button type="text" size="small" @click="specificationListDetele(index)"> 删除</el-button>
          </div>
        </draggable>
      </el-form-item>
    </el-form>
    <div class="demo-drawer__footer">
      <el-button type="primary" @click="handleSubmit()" :loading="loading">{{
        !loading ? '确 定' : '等待中'
      }}</el-button>
      <el-button @click="close">取 消</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { addSpecification, updateSpecification, querySpecificationDetail } from '@/api/goods'
import draggable from 'vuedraggable'
export default {
  name: '',
  components: { draggable },
  props: {
    dataList: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      title: '',
      form: { name: undefined, status: 1 },
      rules: { name: [{ required: true, trigger: 'blur' }] },
      specificationValList: [],
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    getDetail(id) {
      return querySpecificationDetail({ id: id })
    },
    add() {
      Object.assign(this.form, {})
      this.dialogVisible = true
      this.flag = 'add'
    },
    edit(info) {
      Object.assign(this.form, info)
      this.getDetail(info.id).then((res) => {
        this.form = res.data
        this.specificationValList = res.data.specificationValList
        this.flag = 'edit'
        this.dialogVisible = true
      })
    },
    handleSubmit() {
      this.$refs['form'].validate((valid) => {
        if (!valid) return
        if (!this.specificationValList.length) {
          this.$message.warning('请添加规格值')
          return
        }
        let check = this.specificationValList.every((item) => {
          delete item.id
          return item.value
        })
        console.log('%c [ check ]', 'font-size:13px; background:pink; color:#bf2c9f;', check)

        if (!check) {
          this.$message.warning('规格值不能为空')
          return
        }
        let action = this.flag === 'add' ? addSpecification : updateSpecification
        this.specificationValList.map((item, index) => {
          this.specificationValList[index].sort = index + 1
        })
        this.form.specificationValList = this.specificationValList
        console.log('%c [ this.form ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.form)
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
    //  添加规格值
    addSpecifcationList() {
      this.specificationValList.splice(this.specificationValList.length, 0, {
        value: '',
        sort: this.specificationValList.length
          ? this.specificationValList[this.specificationValList.length - 1].sort + 1
          : 1,
      })
    },

    //  删除规格值
    specificationListDetele(index) {
      this.specificationValList.splice(index, 1)
    },

    close() {
      this.form = { name: undefined, status: 1 }
      this.dialogVisible = false
      this.specificationValList = []
    },
  },
}
</script>

<style scoped lang="scss">
::v-deep .el-drawer__body {
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.el-form {
  flex: 1;
}
.item {
  padding: 10px 10px;
  margin: 10px 0 10px 10px;
  display: flex;
}
.demo-drawer__footer {
  text-align: center;
}
</style>
