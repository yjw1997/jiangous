<template>
  <div class="upload">
    <el-upload
      name="file"
      :listType="listType"
      :multiple="isMultiple"
      action="https://httpbin.org/post"
      :headers="headers"
      :data="data"
      :fileList="fileList"
      :beforeUpload="beforeUpload"
      :disabled="disabled"
      :isMultiple="isMultiple"
      showFileList
      :onPreview="handlePreview"
      :limit="limit"
      :class="{ hide: hideUpload }"
      :onChange="handleChange"
      :on-remove="handleRemove"
      :auto-upload="autoUpload"
      :accept="accept"
    >
      <!-- :onChange="handleChange"

             :onPreview="handlePreview" -->
      <!-- <img v-if=" picUrl"
           :src="getAvatarView()"
           style="height:104px;max-width:300px"> -->
      <div>
        <el-icon v-if="uploadImage" class="el-icon-plus" />
        <div v-else class="ant-upload-text">
          <el-button type="primary" size="small" :disabled="hideUpload">点击上传</el-button>
        </div>
      </div>
      <div slot="tip" v-if="tip" class="el-upload__tip">{{ tip }}</div>
    </el-upload>
    <!-- //  预览弹窗 -->
    <!-- <el-dialog :visible="previewVisible" :footer="null" :modal="false" @close="handleCancel()">
      <img alt="example" style="width: 100%" :src="previewImage" />

    </el-dialog> -->
    <el-image-viewer
      v-if="previewVisible"
      :z-index="viewerZIndex()"
      :on-close="handleCancel"
      :url-list="[previewImage]"
    ></el-image-viewer>
  </div>
</template>

<script>
import { getFileAccessHttpUrl } from '@/api/manage'
import $C from '@/utils/config'
import { minioUrl, uploadMinIo } from './minio'
import { PopupManager } from 'element-ui/lib/utils/popup'
const uidGenerator = () => {
  return '-' + parseInt(Math.random() * 100000000 + 1, 10)
}
const getFileName = (path) => {
  if (path.lastIndexOf('\\') >= 0) {
    let reg = new RegExp('\\\\', 'g')
    path = path.replace(reg, '/')
  }
  return path.substring(path.lastIndexOf('/') + 1)
}
export default {
  name: 'JImageUpload',
  data() {
    return {
      uploadAction: $C.WINDOW_CONFIG_UPLOAD_Image(),
      urlView: minioUrl,
      uploadImage: false,
      picUrl: false,
      headers: {},
      fileList: [],
      // 上传达到个数限制隐藏弹窗
      hideUpload: false,
      previewImage: '',
      previewVisible: false,
      data: {},
    }
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    text: {
      type: String,
      required: false,
      default: '上传',
    },
    /*这个属性用于控制文件上传的业务路径*/
    bizPath: {
      type: String,
      required: false,
      default: 'temp',
    },
    //  文件上传列表双向绑定
    value: {
      type: [String, Array],
      required: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    isMultiple: {
      type: Boolean,
      required: false,
      default: false,
    },
    limit: {
      type: Number,
      required: false,
      default: 5,
    },
    tip: {
      type: String,
      required: false,
      default: '',
    },
    autoUpload: {
      type: Boolean,
      required: false,
      default: false,
    },
    limitSize: {
      type: Number,
      require: false,
      default: 1000,
    },
    accept: {
      type: String,
      require: false,
      default: 'image/*',
    },
    listType: {
      type: String,
      require: false,
      default: 'picture-card',
    },
    //  储存桶内文件名文件名称
    prefix: {
      type: String,
      require: false,
      default: '/images',
    },
    zIndex: {
      type: Number,
      default: 2000,
    },
  },
  watch: {
    value: {
      handler: function(val) {
        if (val instanceof Array) {
          this.initFileList(val.join(','))
        } else {
          this.initFileList(val)
        }
      },
      immediate: true,
      deep: true,
    },
    listType: {
      handler: function(val) {
        if (val === 'picture-card') {
          this.uploadImage = true
        } else {
          this.uploadImage = false
        }
      },
      immediate: true,
    },
  },
  created() {},
  components: {
    'el-image-viewer': () => import('element-ui/packages/image/src/image-viewer'),
  },
  methods: {
    initFileList(paths) {
      if (!paths || paths.length == 0 || paths === null) {
        this.fileList = []
        this.hideUpload = this.fileList.length >= this.limit
        return
      }
      this.picUrl = true
      let fileList = []
      let arr = paths.split(',')
      for (var a = 0; a < arr.length; a++) {
        let url = getFileAccessHttpUrl(arr[a], this.urlView, 'http')
        fileList.push({
          uid: uidGenerator(),
          name: getFileName(arr[a]),
          status: 'done',
          url: url,
          response: {
            status: 'history',
            hash: arr[a],
          },
        })
      }
      this.fileList = fileList
      this.hideUpload = fileList.length >= this.limit
    },
    beforeUpload: function(file) {
      console.log('%c [ file ]', 'font-size:13px; background:pink; color:#bf2c9f;', file)
      //  重新获取toekn
      var fileType = file.type ?? file.raw.type
      var fileName = file.name ?? file.raw.name
      const isLtSize = file.size / 1024 / 1024 < this.limitSize

      if (this.accept === 'image/*') {
        if (fileType.indexOf('image') < 0) {
          this.$message.warning('请上传图片')
          return false
        }
      } else {
        //  格式限制
        let arr = this.accept.split(',')
        let res = arr.filter((item) => fileName.endsWith(item))
        if (res.length === 0) {
          this.$message.warning(`请上传已${this.accept}格式结尾的文件`)
          return false
        }
      }

      if (!isLtSize) {
        this.$message.error(`上传文件大小不能超过${this.limitSize}M`)
        return false
      }
      return true
    },
    async handleChange(file, fileList) {
      let limit = this.beforeUpload(file)
      if (!limit) {
        fileList.pop()
        return
      }
      this.picUrl = false
      this.hideUpload = fileList.length >= this.limit

      if (file.status === 'ready') {
        try {
          let res = await uploadMinIo(file, this.prefix)
          console.log('%c [ res ]', 'font-size:13px; background:pink; color:#bf2c9f;', res)
        } catch {
          this.$message.warning('上传失败')
          fileList.pop()
          this.hideUpload = fileList.length >= this.limit
        }
      } else if (file.status === 'success') {
        this.picUrl = true
        fileList = fileList.map((file) => {
          if (file.response && file.response.status !== 'history') {
            file.url = file.response.hash
          }
          return file
        })
        this.$message.success(`${file.name} 上传成功!`)
      } else if (file.status === 'error') {
        this.$message.error(`${file.name} 上传失败.`)
      } else if (file.status === 'removed') {
        this.handleRemove(file)
      }
      this.fileList = fileList
      console.log('%c [ fileList ]', 'font-size:13px; background:pink; color:#bf2c9f;', fileList)
      if (file.status === 'done' || file.status === 'success') {
        this.handlePathChange()
      }
    },
    // 预览
    handlePreview(file) {
      if (this.uploadImage) {
        this.previewImage = file.url || file.thumbUrl
        this.previewVisible = true
      }
    },
    getAvatarView() {
      if (this.fileList.length > 0) {
        let url = this.fileList[0].url
        return getFileAccessHttpUrl(url, this.urlView, 'http')
      }
    },
    handlePathChange() {
      let uploadFiles = this.fileList
      let path = ''
      if (!uploadFiles || uploadFiles.length == 0) {
        path = ''
      }
      let arr = []
      for (var a = 0; a < uploadFiles.length; a++) {
        this.fileList[a].url = getFileAccessHttpUrl(uploadFiles[a].response.hash, this.urlView, 'http')
        arr.push(getFileAccessHttpUrl(uploadFiles[a].response.hash, this.urlView, 'http'))
      }
      if (arr.length > 0) {
        path = arr.join(',')
      }
      console.log('%c [ path ]', 'font-size:13px; background:pink; color:#bf2c9f;', path)
      this.$emit('change', path)
    },
    handleDelete(file) {
      //如有需要新增 删除逻辑
    },
    handleCancel() {
      this.close()
      this.previewVisible = false
    },
    //  删除的回调
    handleRemove(file, fileList) {
      this.fileList = fileList
      this.hideUpload = fileList.length >= this.limitCount
      this.handlePathChange()
    },
    // //  上传成功的回调
    // handleSuccess(response, file, fileList) {
    //   console.log(response, file, fileList)
    //   //  上传达到个数限制隐藏弹窗
    //   this.hideUpload = fileList.length >= this.limit
    //   //  回传的数据
    //   let str = ''
    //   fileList.forEach((element) => {
    //     str += element.url + ','
    //   })
    //   this.$emit('uploadChange', str)
    // },
    close() {},
    change() {},
    viewerZIndex() {
      const nextZIndex = PopupManager.nextZIndex()
      return this.zIndex > nextZIndex ? this.zIndex : nextZIndex
    },
  },
}
</script>

<style scoped lang="scss">
.hide ::v-deep .el-upload--picture-card {
  display: none;
}
.hide ::v-deep .el-upload--text {
  display: none;
}

.el-upload__tip {
  display: block;
}
</style>