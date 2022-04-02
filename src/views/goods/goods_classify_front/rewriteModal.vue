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
            :disabled="flag === 'edit'"
            :options="dataList"
            filterable
            :show-all-levels="false"
            clearable
            placeholder="顶级目录"
            @change="levelChange"
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
        <el-form-item label="关联类目" prop="linkGoodsClassifyCode" v-if="levelShow">
          <el-cascader
            v-model="form.linkGoodsClassifyCode"
            :options="linkGoodsClassifyOption"
            filterable
            :show-all-levels="false"
            :props="{
              expandTrigger: 'hover',
              label: 'classifyName',
              value: 'classifyCode',
              emitPath: false,
              checkStrictly: true,
              multiple: true,
            }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="类目图片" prop="classifyPic">
          <image-upload-modal v-model="form.classifyPic" :limit="1"></image-upload-modal>
        </el-form-item>
      </el-row>
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
import {
  addGoodsClassify,
  updateFrontClassify,
  goodsClassifyQueryGoodsClassify,
  getMaxSort4NullGoodsClassify,
} from '@/api/goods'

export default {
  name: '',
  components: {},
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
      loading: false,
      linkGoodsClassifyOption: [],
      levelShow: false,
      flag: '',
      form: {
        classifyName: undefined,
        parentCode: undefined,
        sort: 0,
        status: 1,
        classifyPic: undefined,
        linkGoodsClassifyCode: undefined,
      },
      rules: {
        classifyName: [{ required: true, trigger: 'change' }],
        status: [{ required: true, trigger: 'change' }],
        sort: [{ required: true, trigger: 'change' }],
        linkGoodsClassifyCode: [{ required: true, trigger: 'change' }],
      },
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    //添加一级分类时最大排序
    getMaxSort() {
      getMaxSort4NullGoodsClassify({ type: 1 })
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
    async add() {
      goodsClassifyQueryGoodsClassify({}).then((res) => {
        let arr = this.cloneDeep(res.data).filter((item) => item.status === 1)
        this.linkGoodsClassifyOption = this.handleTree(arr, 'classifyCode', 'parentCode')
        this.form = Object.assign(this.form, {})
        this.flag = 'add'
        this.dialogVisible = true
        this.getMaxSort()
      })
    },
    edit(info) {
      goodsClassifyQueryGoodsClassify({}).then((res) => {
        // let arr = this.cloneDeep(res.data).filter((item) => item.status === 1)
        let arr = this.cloneDeep(res.data).filter((item) => item)
        this.linkGoodsClassifyOption = this.handleTree(arr, 'classifyCode', 'parentCode')
        this.form = Object.assign(this.form, info)
        this.form.linkGoodsClassifyCode =
          this.form.linkGoodsClassifyCode && this.form.linkGoodsClassifyCode !== null
            ? this.form.linkGoodsClassifyCode.split(',')
            : undefined
        this.levelShow = info.level === 3 ? true : false
        this.form.sort = typeof this.form.sort === 'string' ? Number(this.form.sort) : this.form.sort
        console.log('%c [ this.form ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.form)
        this.flag = 'edit'
        this.dialogVisible = true
      })
    },
    levelChange(code) {
      if (!code) {
        this.levelShow = false
        this.form.linkGoodsClassifyCode = undefined
        this.getMaxSort()
        return
      }
      let obj = this.dataSource.filter((item) => item.classifyCode === code)[0]
      this.form.sort = obj.maxSort || 0
      if (obj.level === 2) {
        this.levelShow = true
      } else {
        this.levelShow = false
      }
    },
    handleSubmit() {
      this.$refs['form'].validate((valid) => {
        if (!valid) return
        let action = this.flag === 'add' ? addGoodsClassify : updateFrontClassify
        let obj = null
        obj =
          this.flag === 'add'
            ? {
                classifyName: this.form.classifyName,
                classifyPic: this.form.classifyPic,
                linkGoodsClassifyCode: this.form.linkGoodsClassifyCode
                  ? this.form.linkGoodsClassifyCode.join()
                  : undefined,
                parentCode: this.form.parentCode,
                sort: this.form.sort,
                status: this.form.status,
              }
            : {
                classifyName: this.form.classifyName,
                classifyPic: this.form.classifyPic,
                id: this.form.id,
                linkGoodsClassifyCode: this.form.linkGoodsClassifyCode
                  ? this.form.linkGoodsClassifyCode.join()
                  : undefined,
                sort: this.form.sort,
                status: this.form.status,
              }

        console.log('%c [ this.form ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.form)

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

    close() {
      this.form = {
        classifyName: undefined,
        parentCode: undefined,
        sort: 0,
        status: 1,
        classifyPic: undefined,
        linkGoodsClassifyCode: undefined,
      }
      console.log('%c [ this.form ]-220', 'font-size:13px; background:pink; color:#bf2c9f;', this.form)
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
