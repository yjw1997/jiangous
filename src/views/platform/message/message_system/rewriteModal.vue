<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="800px" destroy-on-close :before-close="close">
    <el-form ref="form" :model="form" :rules="rules" :disabled="disableSubmit" label-width="120PX" status-icon>
      <el-row :span="24">
        <el-col :span="24">
          <el-form-item label="通知标题" prop="titleTx">
            <el-input v-model="form.titleTx" placeholder="请输入" maxlength="50" show-word-limit />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="24">
        <el-col :span="24">
          <el-form-item label="内容摘要" prop="contentTxt">
            <el-input
              type="textarea"
              rows="2"
              v-model="form.contentTxt"
              show-word-limit
              maxlength="36"
              placeholder="通知消息摘要请认真填写"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :span="24">
        <el-col :span="24">
          <el-form-item label="通知内容" prop="contentTx">
            <Tinymce v-model="form.contentTx" ref="tinymce" :limit="5000" :upload="true"></Tinymce>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="24">
        <el-col :span="24">
          <el-form-item label="定时推送" prop="timingFlag">
            <el-radio-group v-model="form.timingFlag" size="small">
              <el-radio :label="false">否</el-radio>
              <el-radio :label="true">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="24" v-if="form.timingFlag === true">
        <el-col :span="24">
          <el-form-item label="推送时间" prop="startTime">
            <el-date-picker
              v-model="form.startTime"
              align="right"
              type="datetime"
              value-format="timestamp"
              placeholder="开始执行时间"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :span="24">
        <el-col :span="24">
          <el-form-item label="推送对象" prop="pushTarget">
            <el-checkbox-group v-model="form.pushTarget">
              <el-checkbox v-for="item in roleOptions" :key="item.code" :label="item.code">{{ item.name }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="推送渠道" prop="pushChannel">
            <el-checkbox-group v-model="form.pushChannel">
              <el-checkbox
                v-for="item in pushChannelOptions"
                :key="item.code"
                :disabled="item.disabled"
                :label="item.code"
                >{{ item.name }}</el-checkbox
              >
            </el-checkbox-group>
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
import { getUserMessageAdd, getUserMessageEdit } from '@/api/platform'
import Tinymce from '@/components/Tinymce'
export default {
  name: '',
  components: { Tinymce },
  props: {},
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 3600 * 1000 * 24
        },
      },
      form: {
        titleTx: undefined,
        contentTx: undefined,
        contentTxt: undefined,
        timingFlag: false,
        startTime: undefined,
        pushTarget: [],
        pushChannel: [],
        id: 0,
      },
      dialogVisible: false,
      disableSubmit: false,
      title: '',
      flag: '',
      loading: false,
      // 表单校验
      rules: {
        titleTx: [{ required: true, trigger: 'blur', message: '请输入' }],
        contentTx: [
          {
            required: true,
            trigger: 'change',
            message: '请输入通知内容且不超过5000个字',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('请输入问题描述且不超过5000个字'))
                return
              }
              let res = this.$refs.tinymce.messageShow
              !res ? callback() : callback(new Error('请输入通知内容且不超过5000个字'))
            },
          },
        ],
        contentTxt: [{ required: true, trigger: 'blur', message: '请输入' }],
        timingFlag: [{ required: true, trigger: 'blur', message: '请输入' }],
        startTime: [{ required: true, trigger: 'blur', message: '请输入' }],
        pushTarget: [{ required: true, trigger: 'blur', message: '请输入' }],
        pushChannel: [{ required: true, trigger: 'blur', message: '请输入' }],
      },
      roleOptions: [
        {
          code: '0',
          name: '用户',
        },
        {
          code: '1',
          name: '商家',
        },
      ],
      pushChannelOptions: [
        {
          code: '0',
          name: 'APP内推送',
          disabled: false,
        },
        {
          code: '1',
          name: 'push推送',
          disabled: false,
        },
      ],
    }
  },
  computed: {},
  watch: {
    'form.pushChannel'(val) {
      console.log('%c [ val ]', 'font-size:13px; background:pink; color:#bf2c9f;', val)
      if (!Array.isArray(val) || !val.join()) {
        return
      } else if (val.join() === '1') {
        this.form.pushChannel = ['0', '1']
        this.pushChannelOptions.filter((item) => item.code === '0')[0].disabled = true
      } else if (
        val.join() === '0' &&
        this.pushChannelOptions.filter((item) => item.code === '0')[0].disabled === true
      ) {
        this.pushChannelOptions.filter((item) => item.code === '0')[0].disabled = false
      }
    },
  },
  created() {},
  mounted() {},
  methods: {
    add() {
      this.flag = 'add'
      this.dialogVisible = true
    },
    edit(info) {
      Object.assign(this.form, info)
      this.form.pushChannel = this.form.pushChannel ? this.form.pushChannel.split(',') : []
      this.form.pushTarget = this.form.pushTarget ? this.form.pushTarget.split(',') : []
      this.form.startTime = this.form.startTime ? this.form.startTime * 1000 : undefined
      this.flag = 'edit'
      this.dialogVisible = true
    },
    handleSubmit() {
      this.$refs['form'].validate(async (valid) => {
        if (!valid) return
        this.loading = true
        let action = this.flag === 'add' ? getUserMessageAdd : getUserMessageEdit
        let obj = this.cloneDeep(this.form)
        obj.pushChannel = this.form.pushChannel ? this.form.pushChannel.join(',') : ''
        obj.pushTarget = this.form.pushTarget ? this.form.pushTarget.join(',') : ''

        obj.startTime = this.form.startTime ? this.form.startTime / 1000 : undefined

        await action(obj)
          .then((res) => {
            if (res.code === 0) {
              this.$message.success(res.msg || '操作成功')
              this.$emit('OK')
              this.close()
            } else {
              this.$message.warning(res.msg || '服务器错误')
              this.close()
            }
          })
          .finally(() => {
            this.loading = false
          })
      })
    },

    close() {
      this.dialogVisible = false
      this.loading = false
      this.form = {
        titleTx: undefined,
        contentTx: undefined,
        timingFlag: true,
        startTime: undefined,
        contentTxt: undefined,
        pushTarget: [],
        pushChannel: [],
        id: 0,
      }
      this.pushChannelOptions = [
        {
          code: '0',
          name: 'APP内推送',
          disabled: false,
        },
        {
          code: '1',
          name: 'push推送',
          disabled: false,
        },
      ]
    },
  },
}
</script>

<style scoped lang="scss"></style>
