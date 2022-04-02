<template>
  <el-drawer :title="title" :visible.sync="dialogVisible" size="50%" :before-close="close">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" status-icon>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="版本名称" maxlength="50" show-word-limit />
      </el-form-item>
      <el-form-item label="选择APP" prop="platform">
        <w-dict-select-tag dictCode="appSource" v-model="form.platform"></w-dict-select-tag>
      </el-form-item>
      <el-form-item label="版本号" prop="version">
        <el-input v-model="form.version" placeholder="版本号" maxlength="20" show-word-limit />
      </el-form-item>
      <el-form-item label="下载地址" prop="downloadUrl">
        <el-input v-model="form.downloadUrl" placeholder="下载地址" maxlength="200" show-word-limit />
      </el-form-item>
      <el-form-item label="强制更新" prop="forceFlag">
        <el-radio-group v-model="form.forceFlag" size="small">
          <el-radio :label="false">否</el-radio>
          <el-radio :label="true">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="系统" prop="systems">
        <w-dict-select-tag dictCode="applicationType" v-model="form.systems"></w-dict-select-tag>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input
          v-model="form.description"
          placeholder="描述"
          type="textarea"
          maxlength="100"
          show-word-limit
          :rows="8"
        />
      </el-form-item>
      <!-- <el-form-item label="推送至">
        <el-checkbox v-model="form.appFlag" :disabled="flag === 'edit'">APP内推送</el-checkbox>
        <el-checkbox v-model="form.pushFlag" :disabled="flag === 'edit'">push推送</el-checkbox>
      </el-form-item> -->
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
import { addAppVersion, updateAppVersion } from '@/api/platform'
import { isExternal } from '@/utils/validate'
export default {
  name: '',
  components: {},
  data() {
    return {
      dialogVisible: false,
      loading: false,
      title: '',
      flag: 'add',
      form: {
        name: undefined,
        platform: '0',
        version: undefined,
        downloadUrl: undefined,
        forceFlag: true,
        systems: '0',
        description: undefined,
        // appFlag: false,
        // pushFlag: false,
      },

      rules: {
        name: [{ required: true, trigger: 'change', message: '请输入正确格式名称' }],
        platform: [{ required: true, trigger: 'change' }],
        version: [{ required: true, trigger: 'change', message: '请输入正确格式版本号' }],
        downloadUrl: [
          {
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('请输入正确url'))
                return
              }
              let res = isExternal(value)
              res ? callback() : callback(new Error('请输入正确url'))
            },
          },
        ],
        forceFlag: [{ required: true, trigger: 'change' }],
        systems: [{ required: true, trigger: 'change' }],
        description: [{ required: true, trigger: 'change', message: '请输入正确格式' }],
      },
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    add() {
      Object.assign(this.form, {})
      this.dialogVisible = true
      this.flag = 'add'
    },
    edit(info) {
      Object.assign(this.form, info)
      this.flag = 'edit'
      this.dialogVisible = true
    },
    handleSubmit() {
      this.$refs['form'].validate((valid) => {
        if (!valid) return
        let action = this.flag === 'add' ? addAppVersion : updateAppVersion
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
    close() {
      this.form = {
        name: undefined,
        platform: '0',
        version: undefined,
        downloadUrl: undefined,
        forceFlag: true,
        systems: '0',
        description: undefined,
        // appFlag: false,
        // pushFlag: false,
      }
      this.dialogVisible = false
      this.$refs['form'].resetFields()
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
