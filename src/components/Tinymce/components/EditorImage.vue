<template>
  <div class="upload-container">
    <el-button
      :style="{ background: color, borderColor: color }"
      icon="el-icon-upload"
      size="mini"
      type="primary"
      @click="dialogVisible = true"
    >
      上传
    </el-button>
    <el-dialog :visible.sync="dialogVisible" center append-to-body>
      <image-upload-modal :limit="10" v-model="imageList"></image-upload-modal>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" :disabled="loading" @click="handleSubmit">
          确定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { getToken } from 'api/qiniu'

export default {
  name: 'EditorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff',
    },
  },
  computed: {
    loading: {
      get() {
        return !this.imageList.length
      },
    },
  },
  data() {
    return {
      dialogVisible: false,
      imageList: '',
    }
  },
  methods: {
    handleSubmit() {
      const arr = this.imageList.split(',')
      this.$emit('successCBK', arr)
      this.imageList = ''
      this.dialogVisible = false
    },
  },
}
</script>

<style lang="scss" scoped></style>
