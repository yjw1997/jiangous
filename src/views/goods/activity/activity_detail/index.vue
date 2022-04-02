<template>
  <div class="dashboard-editor-container">
    <div class="content-box">
      <el-tabs v-model="activeName">
        <el-tab-pane label="基础信息" name="first">
          <el-row :gutter="20">
            <el-col :span="23">
              <el-form ref="form1" :model="form" :rules="rules" label-width="120px" status-icon>
                <el-form-item label="活动名称" prop="activityName">
                  <el-input
                    v-model="form.activityName"
                    placeholder="最多允许输入30个汉字（60字符）"
                    maxlength="30"
                    show-word-limit
                  ></el-input>
                </el-form-item>
                <el-form-item label="活动封面" prop="activityPic">
                  <image-upload-modal v-model="form.activityPic" :limit="1" :limitSize="3"></image-upload-modal>
                </el-form-item>
                <el-form-item label="报名时间" prop="enrollBeginTime">
                  <el-date-picker
                    :disabled="comDisabled"
                    v-model="enrollTimeRange"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="timestamp"
                    :picker-options="enrollTimePickerOptions"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="活动时间" prop="activityBeginTime">
                  <el-date-picker
                    v-model="activityTimeRange"
                    :disabled="comDisabled"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="timestamp"
                    :picker-options="activityTimePickerOptions"
                  >
                  </el-date-picker>
                </el-form-item>

                <el-form-item label="限购设置" prop="limitType">
                  <el-radio-group v-model="form.limitType" size="small">
                    <el-radio :label="0">不限购</el-radio>
                    <el-radio :label="1">每单限购</el-radio>
                    <el-radio :label="2">限制每个账号购买量</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="限购量" prop="limitNumber" v-if="this.form.limitType !== 0">
                  <el-input-number v-model="form.limitNumber" :min="1" :max="99999999999" />
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="活动详情" name="second">
          <el-row :gutter="20">
            <el-col :span="23">
              <el-form ref="form2" :model="form" :rules="rules" label-width="120px" status-icon>
                <el-form-item label="活动描述" prop="description">
                  <Tinymce v-model="form.description" :limit="5000" ref="tinymce" upload></Tinymce>
                </el-form-item>
                <el-form-item label="活动协议名称" prop="activityAgreementName">
                  <el-input v-model="form.activityAgreementName" show-word-limit maxlength="30"></el-input>
                </el-form-item>
                <el-form-item label="上传协议" prop="activityAgreementUrl">
                  <image-upload-modal
                    v-model="form.activityAgreementUrl"
                    accept=".doc,.docx,.pdf"
                    prefix="/others"
                    listType="text"
                    :limit="1"
                    tip="支持.doc,.docx,.pdf格式"
                  ></image-upload-modal>
                </el-form-item>
                <el-form-item label="上线/下架" prop="online">
                  <el-radio-group v-model="form.online" size="small">
                    <el-radio :label="1">上线</el-radio>
                    <el-radio :label="0">下架</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div class="content-box" style="textAlign:center">
      <el-button @click="close"> 取消</el-button>
      <el-button type="primary" @click="activeChange"> {{ activeName === 'first' ? '下一步' : '上一步' }}</el-button>
      <el-button type="primary" @click="handleSubmit"> {{ this.flag === 'add' ? '发布' : '确定修改' }}</el-button>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Tinymce from '@/components/Tinymce'
import { queryActivityScheduleDetail, updateActivitySchedule, addActivitySchedule } from '@/api/goods'
export default {
  name: 'activity_detail',
  components: { Tinymce },
  props: {},
  data() {
    return {
      activeName: 'first',
      form: {
        activityName: undefined,
        activityPic: undefined,
        activityBeginTime: undefined,
        activityEndTime: undefined,
        enrollBeginTime: undefined,
        enrollEndTime: undefined,
        limitType: 0,
        limitNumber: 1,
        description: undefined,
        activityAgreementName: undefined,
        activityAgreementUrl: undefined,
        online: 1,
      },
      activityTimeRange: [],
      enrollTimeRange: [],
      flag: '',
      enrollTimePickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 3600 * 24 * 1000
        },
      },
      rules: {
        activityName: [{ required: true, trigger: 'blur', message: '请输入' }],
        activityPic: [{ required: true, trigger: 'blur', message: '请输入' }],
        activityBeginTime: [{ required: true, trigger: 'blur', message: '请输入' }],
        enrollBeginTime: [{ required: true, trigger: 'blur', message: '请输入' }],
        limitType: [{ required: true, trigger: 'blur', message: '请输入' }],
        limitNumber: [{ required: true, trigger: 'blur', message: '请输入' }],
        description: [
          {
            required: true,
            trigger: 'change',
            message: '请输入活动描述且不超过5000个字',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('内容不能为空'))
                return
              }
              let res = this.$refs.tinymce.messageShow
              !res ? callback() : callback(new Error('请输入活动描述且不超过5000个字'))
            },
          },
        ],
        activityAgreementName: [{ required: true, trigger: 'blur', message: '请输入' }],
        activityAgreementUrl: [{ required: true, trigger: 'blur', message: '请输入' }],
        online: [{ required: true, trigger: 'blur', message: '请输入' }],
      },
    }
  },
  computed: {
    activityTimePickerOptions() {
      let _this = this
      return {
        disabledDate(time) {
          console.log(
            '%c [ _this.form.enrollEndTime ]',
            'font-size:13px; background:pink; color:#bf2c9f;',
            _this.form.enrollEndTime,
          )
          if (_this.form.enrollEndTime ?? false) {
            if(_this.flag=== 'edit'){
              return time.getTime() < new Date(_this.form.enrollEndTime).getTime()
            }
            return time.getTime() < new Date(_this.form.enrollEndTime).getTime() + 3600 * 24 * 1000
          }
          return time.getTime() < Date.now()
        },
      }
    },
    comDisabled() {
      if (this.flag === 'edit' && (this.form.status === 4 || this.form.status === 5)) {
        return true
      }
      return false
    },
  },
  beforeRouteEnter(to, from, next) {
    console.log('%c [ beforeRouteEnter ]', 'font-size:13px; background:pink; color:#bf2c9f;', 'beforeRouteEnter')
    next((vm) => {
      vm.show()
    })
  },
  watch: {
    activityTimeRange(value) {
      if (!value || value === null) {
        this.form.activityBeginTime = undefined
        this.form.activityEndTime = undefined
        return
      }
      this.form.activityBeginTime = value[0]
      this.form.activityEndTime = value[1]
    },
    enrollTimeRange(value) {
      if (!value || value === null) {
        this.form.enrollBeginTime = undefined
        this.form.enrollEndTime = undefined
        return
      }
      this.form.enrollBeginTime = value[0]
      this.form.enrollEndTime = value[1]
    },
  },
  created() {},
  mounted() {},
  methods: {
    show() {
      if (!this.$route.query || !this.$route.query.edit) {
        this.flag = 'add'
        this.form = Object.assign({}, this.form)
        return
      }
      this.flag = 'edit'
      this.form = JSON.parse(decodeURIComponent(this.$route.query.edit))
      this.init(this.form.id)
    },
    init(id) {
      queryActivityScheduleDetail({ activityId: id })
        .then((res) => {
          this.form = res.data
          this.activityTimeRange = [
            moment(this.form.activityBeginTime * 1000),
            moment(this.form.activityEndTime * 1000),
          ]
          this.enrollTimeRange = [moment(this.form.enrollBeginTime * 1000), moment(this.form.enrollEndTime * 1000)]
        })
        .catch(() => {
          this.$message.error('服务器错误')
          this.$router.push({ path: '/goods/activity' })
        })
    },
    close() {
      this.form = {
        activityName: undefined,
        activityPic: undefined,
        activityBeginTime: undefined,
        activityEndTime: undefined,
        enrollBeginTime: undefined,
        enrollEndTime: undefined,
        limitType: 0,
        limitNumber: 1,
        description: undefined,
        activityAgreementName: undefined,
        activityAgreementUrl: undefined,
        online: 1,
      }
      let view = this.$route
      this.$store.dispatch('tagsView/delView', view).then(() => {
        this.$router.push({ path: '/goods/activity' })
      })
    },
    activeChange() {
      if (this.activeName === 'first') {
        this.$refs['form1'].validate((valid) => {
          if (!valid) return
          this.activeName = this.activeName === 'first' ? 'second' : 'first'
        })
      } else if (this.activeName === 'second') {
        this.$refs['form2'].validate((valid) => {
          if (!valid) return
          this.activeName = this.activeName === 'first' ? 'second' : 'first'
        })
      }
    },
    handleSubmit() {
      let p1 = new Promise((resolve, reject) => {
        this.$refs['form1'].validate((valid) => {
          if (!valid) {
            reject()
          }
          resolve()
        })
      })
      let p2 = new Promise((resolve, reject) => {
        this.$refs['form2'].validate((valid) => {
          if (!valid) {
            reject()
          }
          resolve()
        })
      })
      Promise.all([p1, p2]).then(() => {
        let action = this.flag === 'add' ? addActivitySchedule : updateActivitySchedule
        let obj = Object.assign({}, this.form)
        obj.activityBeginTime = obj.activityBeginTime / 1000
        obj.activityEndTime = obj.activityEndTime / 1000
        obj.enrollBeginTime = obj.enrollBeginTime / 1000
        obj.enrollEndTime = obj.enrollEndTime / 1000
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
  },
}
</script>

<style scoped lang="scss"></style>
