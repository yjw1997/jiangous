<template>
  <el-drawer :title="title" :visible.sync="dialogVisible" size="50%" :before-close="close">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" :show-message="false" status-icon>
      <el-row>
        <el-form-item label="类目名称" prop="classifyName">
          <el-input v-model="form.classifyName" placeholder="类目名称" maxlength="6" show-word-limit />
        </el-form-item>
        <el-form-item label="上级类目" prop="parentCode">
          <el-cascader
            v-model="form.parentCode"
            :options="dataList"
            filterable
            :show-all-levels="false"
            clearable
            placeholder="顶级目录"
            @change="handleParentCodeChange"
            :disabled="this.flag === 'edit'"
            :props="{
              expandTrigger: 'hover',
              label: 'classifyName',
              value: 'classifyCode',
              emitPath: false,
              checkStrictly: true,
            }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <el-radio-group v-model="form.status" size="small">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" :max="999"></el-input-number>
        </el-form-item>
        <el-form-item label="销售规格">
          <el-button @click="handleAdd" type="primary">添加</el-button>
        </el-form-item>
      </el-row>
    </el-form>

    <el-table :data="specificationList">
      <el-table-column property="name" label="规格名称" min-width="120"></el-table-column>
      <el-table-column prop="specificationValues" label="规格值" :show-overflow-tooltip="true" min-width="160" />
      <el-table-column label="是否启用" prop="status" min-width="80" :show-overflow-tooltip="true">
        <template slot-scope="{ row }">
          <el-tag v-if="row.status === 0">否</el-tag>
          <el-tag v-if="row.status === 1">是</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope.row, scope.$index)"
            >编辑</el-button
          >
          <el-button size="mini" type="text" icon="el-icon-close" @click="handleDelete(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="demo-drawer__footer">
      <el-button type="primary" @click="handleSubmit()" :loading="loading">{{
        !loading ? '确 定' : '等待中'
      }}</el-button>
      <el-button @click="close">取 消</el-button>
    </div>

    <add-modal ref="modalForm" @add="addList" @edit="editList"></add-modal>
  </el-drawer>
</template>

<script>
import {
  goodsClassifyAddGoodsClassify,
  goodsClassifyUpdateGoodsClassify,
  goodsClassifyQueryClassifyDetail,
  getMaxSort4NullGoodsClassify,
} from '@/api/goods'
import addModal from './addspecilication.vue'
export default {
  name: '',
  components: { addModal },
  props: {
    dataList: {
      type: Array,
      default: () => {
        return []
      },
    },
    dataSource: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {
      dialogVisible: false,
      title: '',
      specificationList: [],
      loading: false,
      dataListLevelTwo: [],
      flag: '',
      form: { classifyName: undefined, parentCode: undefined, sort: 0, status: 1 },
      rules: { modulesAdCategoryId: [{ required: true, trigger: 'blur' }] },
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    getDetail(id) {
      return goodsClassifyQueryClassifyDetail({ id: id })
    },
    //添加一级分类时最大排序
    getMaxSort() {
      getMaxSort4NullGoodsClassify({ type: 0 })
        .then((res, reject) => {
          if (res.code === 0) {
            this.form.sort = res.data || 0
          } else {
            reject()
          }
        })
        .catch(() => {
          this.form.sort = 0
        })
    },
    add() {
      Object.assign(this.form, {})
      this.flag = 'add'
      this.dialogVisible = true
      this.getMaxSort()
    },
    edit(info) {
      Object.assign(this.form, info)
      this.getDetail(info.id).then((res) => {
        this.specificationList = res.data.specificationList
        this.form.sort = typeof res.data.sort === 'string' ? Number(res.data.sort) : res.data.sort
        this.flag = 'edit'
        this.dialogVisible = true
      })
    },
    handleParentCodeChange(code) {
      if (!code || code === null) {
        this.getMaxSort()
        return
      }
      let arr = this.dataSource.filter((item) => item.classifyCode === code)
      if (arr.length > 0) {
        this.form.sort = arr[0].maxSort || 0
      }
    },
    handleSubmit() {
      this.$refs['form'].validate((valid) => {
        if (!valid) return
        let action = this.flag === 'add' ? goodsClassifyAddGoodsClassify : goodsClassifyUpdateGoodsClassify

        // if (!this.specificationList.length) {
        //   this.$message.warning('销售规格不能为空')
        //   return
        // }
        this.specificationList.forEach((item, i) => {
          if (item.index || item.index === 0) {
            delete this.specificationList[i].index
          }
          if (item.sort || item.index === 0) {
            delete this.specificationList[i].sort
          }
        })
        if (typeof this.form.parentCode === 'string') {
          this.form.parentCode = Number(this.form.parentCode)
        }
        if (typeof this.form.classifyCode === 'string') {
          this.form.classifyCode = Number(this.form.classifyCode)
        }

        let obj = {
          classifyName: this.form.classifyName,
          parentCode: this.form.parentCode,
          classifyCode: this.form.classifyCode,
          sort: this.form.sort,
          status: this.form.status,
          id: this.form.id,
          specificationList: this.specificationList,
        }
        console.log('%c [ obj ]', 'font-size:13px; background:pink; color:#bf2c9f;', obj)

        action(obj).then((res) => {
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

    //  编辑
    handleEdit: function(record, index) {
      console.log('%c [ record ]', 'font-size:13px; background:pink; color:#bf2c9f;', record)
      this.$refs.modalForm.title = '编辑'
      this.$refs.modalForm.disableSubmit = false
      record.index = index
      this.$refs.modalForm.edit(record)
    },
    //  新增
    handleAdd: function() {
      this.$refs.modalForm.title = '新增'
      this.$refs.modalForm.add()
    },
    //  删除
    handleDelete: function(index) {
      console.log('%c [ index ]', 'font-size:13px; background:pink; color:#bf2c9f;', index)
      this.$confirm(`是否删除选中数据?`, `确认删除`)
        .then(() => {
          this.specificationList.splice(index, 1)
        })
        .catch(() => {})
    },
    //  新增销售规格
    addList(value) {
      console.log('%c [ value ]', 'font-size:13px; background:pink; color:#bf2c9f;', value)
      this.specificationList.push(value)
    },
    //  修改销售规格
    editList(value) {
      console.log('%c [ value ]', 'font-size:13px; background:pink; color:#bf2c9f;', value)
      this.specificationList.splice(value.index, 1, value)
    },

    close() {
      this.form = { classifyName: undefined, parentCode: undefined, sort: 0, status: 1 }
      this.specificationList = []
      this.dialogVisible = false
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
.demo-drawer__footer {
  text-align: center;
}
</style>
