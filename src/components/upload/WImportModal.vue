<template>
  <el-dialog title="导入EXCEL" width="600" :visible="visible" :confirmLoading="uploading" @cancel="handleClose">
    <el-upload
      ref="uploadfile"
      accept=".xls,.xlsx"
      :fileList="fileList"
      :auto-upload="false"
      action="https://jsonplaceholder.typicode.com/posts/"
      :limit="limit"
      :onChange="handleChange"
      :on-exceed="handleExceed"
      :on-remove="handleRemove"
    >
      <el-button type="primary">
        <el-icon type="upload" />
        选择导入文件
      </el-button>
      <div class="el-upload__tip" slot="tip">
        <div style="color:red">
          提示：仅允许导入“xls”或“xlsx”格式文件！
        </div>
        <div style="margin-top:20px">
          <el-button type="danger" @click="handleImportTemplate" v-if="temp" size="small">下载模板</el-button>
        </div>
      </div>
    </el-upload>

    <template slot="footer">
      <el-button @click="handleClose">关闭</el-button>
      <el-button type="primary" @click="handleImport" :disabled="fileList.length === 0" :loading="uploading">
        {{ uploading ? '上传中...' : '开始上传' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
import $C from '@/utils/config'
export default {
  name: 'WImportModal',
  props: {
    biz: {
      type: String,
      default: '',
      required: false,
    },
    postAction: {
      type: Function,
      required: true,
      default: () => {
        return {}
      },
    },
    temp: {
      type: Boolean,
      required: false,
      default: false,
    },
    limit: {
      type: Number,
      required: false,
      default: 1,
    },
    importTemplate: {
      type: Function,
      required: false,
      default: () => {
        return undefined
      },
    },
  },
  data() {
    return {
      visible: false,
      uploading: false,
      fileList: [],
      uploadAction: '',
    }
  },
  watch: {
    postAction(val) {
      console.log('%c [ val ]', 'font-size:13px; background:pink; color:#bf2c9f;', val)
    },
  },
  created() {},

  methods: {
    handleClose() {
      this.visible = false
    },
    show() {
      this.fileList = []
      this.uploading = false
      this.visible = true
    },
    handleChange(files, fileList) {
      console.log('%c [ files, fileList ]', 'font-size:13px; background:pink; color:#bf2c9f;', files, fileList)
      this.fileList = fileList
    },
    handleExceed(files, fileList) {
      this.$set(fileList[0], 'raw', files[0])
      this.$set(fileList[0], 'name', files[0].name)
      this.$refs['uploadfile'].clearFiles() //清除文件
      this.$refs['uploadfile'].handleStart(files[0]) //选择文件后的赋值方法
      this.fileList = fileList
    },
    handleRemove() {
      this.fileList = []
    },
    handleImport() {
      const { fileList } = this
      console.log('%c [ fileList ]', 'font-size:13px; background:pink; color:#bf2c9f;', fileList)
      const formData = new FormData()
      formData.append('file', fileList[0].raw)
      this.uploading = true
      this.postAction(formData).then((res) => {
        this.uploading = false
        if (res.code === 0) {
          this.$message.success(res.message)
          this.visible = false
          this.$emit('OK')
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    handleImportTemplate() {
      console.log(
        '%c [ importTemplate ]',
        'font-size:13px; background:pink; color:#bf2c9f;',
        Object.keys(this.importTemplate),
      )
      this.importTemplate().then((res) => {
        console.log('%c [ res ]', 'font-size:13px; background:pink; color:#bf2c9f;', res)
        if (res.code === 0 && res.data && res.data !== null) {
          window.open($C.base + '/' + res.data.clazz)
          console.log(
            '%c [ $C.base + / + res.data ]',
            'font-size:13px; background:pink; color:#bf2c9f;',
            $C.base + '/' + res.data.clazz,
          )
        } else {
          this.$message.warning(res.message)
        }
      })
    },
  },
}
</script>

<style scoped></style>
