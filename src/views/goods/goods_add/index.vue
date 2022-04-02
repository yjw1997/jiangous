<template>
  <div class="dashboard-editor-container">
    <div class="content-box">
      <el-form ref="form" label-width="80px">
        <el-form-item label="批量导入">
          <div>
            <el-button icon="el-icon-upload2" @click="handleImport">导入商品</el-button>
          </div>
          <div>
            为保证产品信息正常识别，请按照模板格式整理产品信息
            <el-button type="text" @click="handleDownTemplate">下载模板 </el-button>
          </div>
        </el-form-item>
        <el-form-item label="备注说明">
          <div>批量上传仅支持上传同一商家</div>
          <div>（1）填写商品图片时</div>
          <div>请填写该商品相关联的图片文件夹名称，对应文件夹需要存放在pics文件夹下</div>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="500px" :before-close="handleClose" destroy-on-close>
      <el-form ref="form" :model="form" :rules="rules" label-width="120PX" status-icon>
        <el-row :span="24">
          <el-col :span="24">
            <el-form-item label="所属商家" prop="id">
              <el-select v-model="form.id" placeholder="所属商家" clearable size="small">
                <el-option v-for="dict in shopsOptions" :key="dict.id" :label="`${dict.shopName}`" :value="dict.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="上传压缩包" prop="file">
              <el-upload
                class="upload-demo"
                ref="upload"
                :auto-upload="false"
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-change="handleChange"
                accept=".zip"
                :file-list="fileList"
                :on-remove="handleRemove"
              >
                <el-button slot="trigger" icon="el-icon-upload2" size="small" type="primary">上传文件</el-button>
                <div slot="tip" class="el-upload__tip">
                  为保证产品信息正常识别，请按照模板格式整理产品信息(只能上传zip格式)
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">{{
          loading ? '等待中...' : '确 定'
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { downZipGoodsTemplate, queryDownBoxShops, batchAddGoods } from '@/api/goods'
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      dialogVisible: false,
      loading: false,
      form: {
        id: undefined,
        shopName: undefined,
        file: undefined,
      },
      rules: {
        id: [{ required: true, trigger: 'blur', message: '请选择商户' }],
        file: [{ required: true, trigger: 'blur', message: '请上传文件' }],
      },
      shopsOptions: [],
      fileList: [],
    }
  },
  computed: {},
  watch: {
    'form.id'(value) {
      if (!value || value === null) {
        this.form.shopName = undefined
        return
      }
      this.form.shopName = this.shopsOptions.filter((item) => item.id === value)[0].shopName
    },
  },
  created() {
    this.getSelectData()
  },
  mounted() {},
  methods: {
    //获取商家下拉数据
    getSelectData() {
      queryDownBoxShops({}).then((res) => {
        this.shopsOptions = res.data
      })
    },
    handleDownTemplate() {
      downZipGoodsTemplate({}).then((res) => {
        const a = document.createElement('a')
        a.download = `批量发布商品模板.zip`
        a.style.display = 'none'
        let blob = new Blob([res], { type: 'application/zip' })
        a.href = URL.createObjectURL(blob)
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      })
    },
    handleImport() {
      this.dialogVisible = true
    },

    handleChange(file, fileList) {
      this.fileList = fileList.slice(-1)

      this.form.file = this.fileList[0].raw
    },
    handleRemove() {
      this.fileList = []
      this.form.file = undefined
    },
    handleSubmit() {
      this.$refs['form'].validate((valid) => {
        if (!valid) return
        if (this.fileList < 1) {
          this.$message.warning('请上传压缩包')
          return
        }
        const formData = new FormData()
        formData.append('file', this.fileList[0].raw)
        this.form.file = formData
        this.loading = true
        batchAddGoods(this.form)
          .then((res) => {
            if (res.code === 0) {
              this.$message.success(res.msg || '操作成功')
              this.handleClose()
            }
          })
          .catch((err) => {
            this.handleClose()
          })
      })
    },
    handleClose() {
      this.dialogVisible = false
      this.loading = false

      this.fileList = []
      this.form = {
        id: undefined,
        shopName: undefined,
        file: undefined,
      }
    },
  },
}
</script>

<style scoped lang="scss">
.content-box {
  display: flex;
  align-items: center;
  justify-items: center;
  flex-direction: column;
  min-height: 900px;
  .excel-upload-input {
    display: none;
    z-index: -9999;
  }
  .drop {
    border: 2px dashed #bbb;
    width: 600px;
    height: 160px;
    line-height: 160px;
    margin: 0 auto;
    font-size: 24px;
    border-radius: 5px;
    text-align: center;
    color: #bbb;
    position: relative;
  }
}
</style>
