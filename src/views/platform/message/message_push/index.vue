<template>
  <div class="dashboard-editor-container">
    <div class="content-box" v-loading="loading">
      <div class="detail-list">
        <div class="titleFlag">
          <div class="title">买家消息</div>
          <div class="button">
            <el-button type="primary" size="mini" @click="handleSubmit">提交</el-button>
            <el-button type="primary" size="mini" @click="reset">重置</el-button>
          </div>
        </div>
        <el-row :gutter="40" class="panel-group">
          <el-col class="card-panel-col" v-for="item in buyer_message" :key="item.id">
            <div class="term">{{ item.title }}：</div>
            <div class="content">
              <el-checkbox v-model="item.applicationFlag" :disabled="item.applicationFlagDefault"
                >应用内通知</el-checkbox
              >
              <el-checkbox v-model="item.pushFlag" :disabled="item.pushFlagDefault">push通知</el-checkbox>
              <el-checkbox v-model="item.smsFlag" :disabled="item.smsFlagDefault">短信通知</el-checkbox>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="content-box" v-loading="loading">
      <div class="detail-list">
        <div class="title">卖家消息</div>
        <el-row :gutter="40" class="panel-group">
          <el-col class="card-panel-col" v-for="item in seller_message" :key="item.id">
            <div class="term">{{ item.title }}：</div>
            <div class="content">
              <el-checkbox v-model="item.applicationFlag" :disabled="item.applicationFlagDefault"
                >应用内通知</el-checkbox
              >
              <el-checkbox v-model="item.pushFlag" :disabled="item.pushFlagDefault">push通知</el-checkbox>
              <el-checkbox v-model="item.smsFlag" :disabled="item.smsFlagDefault">短信通知</el-checkbox>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { getMessagePushConfigQueryList, getMessagePushConfigUpdate } from '@/api/platform'
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      seller_message: {},
      buyer_message: {},
      loading: false,
      checkList: [{}],
    }
  },
  computed: {},
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      console.log('%c [ vm ]', 'font-size:13px; background:pink; color:#bf2c9f;', vm)
      vm.getQueryList()
    })
  },
  activated() {
    console.log('%c [ activated ]', 'font-size:13px; background:pink; color:#bf2c9f;', 'activated')
  },
  created() {},
  mounted() {},
  methods: {
    //  查看消息推送设置列表
    getQueryList() {
      this.loading = true
      getMessagePushConfigQueryList().then((res) => {
        console.log('%c [ res ]', 'font-size:13px; background:pink; color:#bf2c9f;', res)
        const { data, code } = res
        if (code === 0) {
          this.loading = false
          if (data && data.length) {
            this.seller_message = data.filter((item) => item.type === 1)
            this.buyer_message = data.filter((item) => item.type === 0)
          }
        }
      })
    },
    handleChangeSellerMessage(value) {
      console.log('%c [ value ]', 'font-size:13px; background:pink; color:#bf2c9f;', value)
    },
    //  点击提交按钮
    handleSubmit() {
      console.log('%c [ seller_message ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.seller_message)
      console.log('%c [ buyer_message ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.buyer_message)
      let arr_message = this.seller_message.concat(this.buyer_message)
      this.loading = true
      getMessagePushConfigUpdate(arr_message)
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
.titleFlag {
  display: flex;
  justify-content: space-between;
}
.detail-list .title {
  color: rgba(0, 0, 0, 0.85);
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
}
.detail-list .term {
  color: rgba(0, 0, 0, 0.85);
  line-height: 20px;
  margin-right: 8px;
  padding-bottom: 16px;
  white-space: nowrap;
  min-width: 250px;
  display: inline-block;
}
.detail-list .content {
  color: rgba(0, 0, 0, 0.65);
  line-height: 22px;
  padding-bottom: 16px;
  display: inline-block;
}
</style>
