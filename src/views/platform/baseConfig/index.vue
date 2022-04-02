<template>
  <div class="dashboard-editor-container">
    <div class="content-box" v-loading="loading">
      <div class="button">
        <el-button type="primary" size="mini" @click="handleSubmit">提交</el-button>
        <el-button type="primary" size="mini" @click="reset">重置</el-button>
      </div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="通用设置" name="first">
          <el-form ref="form" :model="form" label-width="120px" :rules="rules">
            <el-row :span="24">
              <el-col :span="24">
                <el-form-item label="购物车上限" prop="shopCarLimit">
                  <el-input-number
                    v-model="form.shopCarLimit"
                    :step="1"
                    step-strictly
                    :min="1"
                    :max="200"
                    label="请输入数量"
                  ></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :span="24">
              <el-col :span="24">
                <div class="el-descriptions__title">联系客服</div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :md="12" :lg="10">
                <el-form-item label="电话联系" prop="relationPhone">
                  <el-input
                    v-model="form.relationPhone"
                    placeholder="请输入"
                    style="width:300px"
                    show-word-limit
                    maxlength="10"
                  />
                </el-form-item>
              </el-col>
              <el-col :md="12" :lg="12">
                <el-form-item label="在线时间" prop="phoneOnLineTime">
                  <el-time-picker
                    v-model="form.phoneOnLineTimeArr"
                    align="right"
                    is-range
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    value-format="HH:mm:ss"
                  >
                  </el-time-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :md="12" :lg="10">
                <el-form-item label="微信联系" prop="relationWechat">
                  <el-input
                    v-model="form.relationWechat"
                    placeholder="请输入"
                    style="width:300px"
                    maxlength="20"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
              <el-col :md="12" :lg="12">
                <el-form-item label="在线时间" prop="wechatOnLineTime">
                  <el-time-picker
                    v-model="form.wechatOnLineTimeArr"
                    align="right"
                    placeholder="在线时间"
                    is-range
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    value-format="HH:mm:ss"
                  >
                  </el-time-picker>
                </el-form-item>
              </el-col>
              <el-col :md="24" :lg="24">
                <el-form-item label="微信二维码" prop="wechatQrCode">
                  <image-upload-modal v-model="form.wechatQrCode" :limit="1"></image-upload-modal>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :md="12" :lg="6">
                <el-form-item label="商家入驻协议" prop="shopEnterAgreement">
                  <image-upload-modal
                    prefix="/others"
                    v-model="form.shopEnterAgreement"
                    accept=".docx,.pdf"
                    listType="text"
                    tip="支持.docx,.pdf格式"
                    :limit="1"
                  ></image-upload-modal>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :md="12" :lg="6">
                <el-form-item label="用户隐私协议" prop="userPrivacyAgreement">
                  <image-upload-modal
                    v-model="form.userPrivacyAgreement"
                    accept=".docx,.pdf"
                    listType="text"
                    prefix="/others"
                    tip="支持.docx,.pdf格式"
                    :limit="1"
                  ></image-upload-modal>
                </el-form-item>
              </el-col>
            </el-row>
             <el-row>
              <el-col :md="12" :lg="6">
                <el-form-item label="用户支付协议" prop="userPayAgreement">
                  <image-upload-modal
                    v-model="form.userPayAgreement"
                    accept=".docx,.pdf"
                    listType="text"
                    prefix="/others"
                    tip="支持.docx,.pdf格式"
                    :limit="1"
                  ></image-upload-modal>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { getBaseConfigQueryList, getBaseConfigSaveBaseConfig } from '@/api/platform'
import { isAmericaPhone, isPhone } from '@/utils/validate'
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      loading: false,
      activeName: 'first',
      form: {
        shopCarLimit: 0,
        relationPhone: undefined,
        phoneOnLineTimeArr: ['', ''],
        relationWechat: undefined,
        wechatOnLineTimeArr: ['', ''],
        wechatQrCode: undefined,
        shopEnterAgreement: undefined,
        userPrivacyAgreement: undefined,
        userPayAgreement: undefined, //用户支付协议
      },
      rules: {
        shopCarLimit: [{ required: true, trigger: 'change' }],
        relationPhone: [
          {
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('请输入正确格式手机号'))
                return
              }
              let res = isAmericaPhone(value) || isPhone(value)
              res ? callback() : callback(new Error('请输入正确格式手机号'))
            },
          },
        ],
        phoneOnLineTimeArr: [{ required: true, message: '请选择时间', trigger: 'change' }],
        relationWechat: [{ required: true, message: '请输入正确格式微信号', trigger: 'change' }],
        wechatOnLineTimeArr: [{ required: true, message: '请选择时间', trigger: 'change' }],
        wechatQrCode: [{ required: true, message: '未上传', trigger: 'change' }],
        shopEnterAgreement: [{ required: true, message: '未上传', trigger: 'change' }],
        userPrivacyAgreement: [{ required: true, message: '未上传', trigger: 'change' }],
        userPayAgreement: [{ required: true, message: '未上传', trigger: 'change' }],
        // phone: [
        //   {
        //     required: true,
        //     trigger: 'change',
        //     validator: (rule, value, callback) => {
        //       if (!value) {
        //         callback(new Error('请输入正确格式手机号'))
        //         return
        //       }
        //       let res = value.split(',').every((item) => {
        //         return isAmericaPhone(item) || isPhone(item)
        //       })
        //       res ? callback() : callback(new Error('请输入正确格式手机号'))
        //     },
        //   },
        // ],
      },
    }
  },
  computed: {},
  watch: {
    'form.phoneOnLineTimeArr': function(value) {
      console.log('%c [ value ]-188', 'font-size:13px; background:pink; color:#bf2c9f;', value)
      if (value && value !== null && value.length === 2) {
        this.form.phoneOnLineTime = this.form.phoneOnLineTimeArr.join(',')
      } else {
        this.form.phoneOnLineTime = ''
        this.form.phoneOnLineTimeArr = ['', '']
      }
    },
    'form.wechatOnLineTimeArr': function(value) {
      console.log('%c [ value ]-196', 'font-size:13px; background:pink; color:#bf2c9f;', value)
      if (value && value !== null && value.length === 2) {
        this.form.wechatOnLineTime = this.form.wechatOnLineTimeArr.join(',')
      } else {
        this.form.wechatOnLineTime = ''
        this.form.wechatOnLineTimeArr = ['', '']
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.getQueryList()
    })
  },
  created() {},
  mounted() {},
  methods: {
    //  查看消息推送设置列表
    getQueryList() {
      this.loading = true
      getBaseConfigQueryList().then((res) => {
        const { data, code } = res
        console.log('%c [ res ]-217', 'font-size:13px; background:pink; color:#bf2c9f;', res)
        data.phoneOnLineTime && (data.phoneOnLineTimeArr = data.phoneOnLineTime.split(','))
        data.wechatOnLineTime && (data.wechatOnLineTimeArr = data.wechatOnLineTime.split(','))
        if (code === 0) {
          this.loading = false
          this.form = data
        }
      })
    },
    //  点击提交按钮
    handleSubmit() {
      this.loading = true
      getBaseConfigSaveBaseConfig(this.form)
        .then((res) => {
          console.log('%c [ res ]', 'font-size:13px; background:pink; color:#bf2c9f;', res)
          const { code, message } = res
          if (code === 0) {
            this.loading = false
            this.$message.success(message)
          } else {
            this.$message.console.error(message || '服务器错误')
          }
        })
        .finally(() => {
          this.getQueryList()
        })
    },
    // 重置
    reset() {
      this.$store.dispatch('tagsView/delCachedView', this.$route).then(() => {
        const { fullPath } = this.$route
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath,
          })
        })
      })
    },
  },
}
</script>

<style scoped lang="scss">
.button {
  position: absolute;
  right: 38px;
  top: 35px;
  z-index: 9999;
}
.el-descriptions__title {
  margin-left: 40px;
  padding: 20px 0;
  font-size: 18px;
}
</style>
