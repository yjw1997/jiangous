<template>
  <el-dialog
    :title="form.appUserName"
    :visible.sync="dialogVisible"
    width="800px"
    destroy-on-close
    :before-close="close"
  >
    <div class="detail-list">
      <el-row :gutter="40" class="panel-group">
        <el-col class="card-panel-col">
          <div class="term">账号：</div>
          <div class="content">{{ form.appUserNumber || '-' }}</div>
        </el-col>
        <el-col class="card-panel-col">
          <div class="term">反馈时间：</div>
          <div class="content">{{ form.createTime || '-' }}</div>
        </el-col>
        <el-col class="card-panel-col">
          <div class="term">联系方式：</div>
          <div class="content">{{ form.phone || '-' }}</div>
        </el-col>
        <el-col class="card-panel-col">
          <div class="term">意见反馈：</div>
          <div class="content">{{ form.opinionDescription || '-' }}</div>
        </el-col>
        <el-col class="card-panel-col">
          <div class="term">意见反馈图片：</div>
          <div class="content">
            <image-upload-modal v-if="form.picUrl" :limit="0" disabled v-model="form.picUrl"></image-upload-modal>
          </div>
        </el-col>
      </el-row>
      <div class="icon" :style="{ color: form.status === 0 ? 'red' : 'blue' }">
        <transition name="el-zoom-in-top">
          <svg-icon :icon-class="form.status === 0 ? 'dcl' : 'ycl'" class-name="card-panel-icon" v-if="dialogVisible" />
        </transition>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="handleSubmit()" :loading="loading" v-if="form.status === 0">{{
        !loading ? '处理' : '等待中'
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { disposeUserOpinionDetele } from '@/api/platform'
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      form: {},
      dialogVisible: false,
      disableSubmit: false,
      flag: '',
      loading: false,
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    add() {
      this.flag = 'add'
      this.dialogVisible = true
    },
    edit(info) {
      info.picUrl =
        !info.picUrl || info.picUrl === null
          ? null
          : info.picUrl.filter((item) => item.picUrl).map((item) => item.picUrl)
      this.form = Object.assign(this.form, info)

      this.flag = 'edit'
      this.dialogVisible = true
    },
    handleSubmit() {
      disposeUserOpinionDetele({ id: this.form.id })
        .then((res) => {
          console.log('%c [ res ]', 'font-size:13px; background:pink; color:#bf2c9f;', res.code)
          if (res.code === 0) {
            this.$message.success(res.message || '操作成功')
            this.close()
            this.$emit('OK')
          } else {
            this.$message.warning(res.message || '服务器错误')
            this.loading = false
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    close() {
      this.dialogVisible = false
      this.loading = false
    },
  },
}
</script>

<style scoped lang="scss">
.detail-list .title {
  color: rgba(0, 0, 0, 0.85);
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
}
.detail-list .term {
  color: rgba(0, 0, 0, 0.85);
  display: table-cell;
  line-height: 20px;
  margin-right: 8px;
  padding-bottom: 16px;
  white-space: nowrap;
}
.detail-list .icon {
  width: 50px;
  height: 50px;
  position: absolute;
  right: 80px;
  top: 80px;
}
.detail-list .card-panel-icon {
  font-size: 80px;
}

.detail-list .content {
  color: rgba(0, 0, 0, 0.65);
  display: table-cell;
  line-height: 22px;
  padding-bottom: 16px;
  width: 100%;
}
</style>
