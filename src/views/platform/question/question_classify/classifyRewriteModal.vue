<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="800px" destroy-on-close :before-close="close">
    <el-form ref="form" :model="form" :rules="rules" :disabled="disableSubmit" label-width="120PX" status-icon center>
      <el-row :span="24">
        <el-col>
          <el-form-item label="归属平台" prop="platformType">
            <el-radio-group v-model="form.platformType" size="small">
              <el-radio :label="true">商家端</el-radio>
              <el-radio :label="false">用户端</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="分类名称" prop="questionClassifyName">
            <el-input v-model="form.questionClassifyName" placeholder="请输入" maxlength="6" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="分类图标" prop="questionClassifyPic">
            <image-upload-modal
              v-model="form.questionClassifyPic"
              tip="仅支持：png、jpg格式"
              :limit="1"
              accept=".png,.jpg"
            ></image-upload-modal>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="是否显示">
            <el-switch v-model="form.status" :active-value="true" :inactive-value="false"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer" v-if="!disableSubmit">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="handleSubmit()" :loading="loading">{{
        !loading ? '确 定' : '等待中'
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { queryQuestionClassifyAdd, queryQuestionClassifyEdit } from '@/api/platform'
import { isChineseNum } from '@/utils/validate'
export default {
  components: {},
  name: '',
  props: {},
  data() {
    return {
      form: {
        questionClassifyName: undefined,
        questionClassifyPic: undefined,
        platformType: true,
        status: true,
      },
      dialogVisible: false,
      disableSubmit: false,
      title: '',
      flag: '',
      loading: false,
      // 表单校验
      rules: {
        questionClassifyName: [
          {
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('请输入1-6位汉字'))
                return
              }
              isChineseNum(value,1,6) ? callback() : callback(new Error('请输入1-6位汉字'))
            },
          },
        ],
        questionClassifyPic: [{ required: true,  message: '请上传分类图标',trigger: 'blur' }],
        platformType: [{ required: true, trigger: 'blur' }],
        status: [{ required: true, trigger: 'blur' }],
      },
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
      Object.assign(this.form, info)

      this.flag = 'edit'
      this.dialogVisible = true
    },
    handleSubmit() {
      this.$refs['form'].validate(async (valid) => {
        if (!valid) return
        this.loading = true
        let action = this.flag === 'add' ? queryQuestionClassifyAdd : queryQuestionClassifyEdit
        await action(this.form).then((res) => {
          if (res.code === 0) {
            this.$message.success(res.msg || '操作成功')
            this.$emit('OK')
            this.close()
          } else {
            this.$message.warning(res.msg || '服务器错误')
            this.close()
          }
        })
      })
    },

    close() {
      this.dialogVisible = false
      this.loading = false
      this.form = {
        questionClassifyName: undefined,
        questionClassifyPic: undefined,
        platformType: true,
        status: true,
      }
    },
  },
}
</script>

<style scoped lang="scss"></style>
