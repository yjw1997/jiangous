<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="800px" destroy-on-close :before-close="close">
    <el-form ref="form" :model="form" :rules="rules" :disabled="disableSubmit" label-width="120PX" status-icon>
      <el-row :span="24">
        <el-col :span="24">
          <el-form-item label="轮播标题" prop="name">
            <el-input v-model="form.name" placeholder="请输入" maxlength="10" show-word-limit />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="24">
        <el-col :span="12">
          <el-form-item label="是否展示" prop="showFlag">
            <el-switch v-model="form.showFlag" :active-value="true" :inactive-value="false"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.bannerType === 1">
          <el-form-item label="所属分类" prop="goodsClassifyCode">
            <el-select v-model="form.goodsClassifyCode" placeholder="选择分类" clearable size="small" @change="selChange" class="repStyle">
              <el-option
                v-for="dict in activityOptions"
                :key="dict.classifyCode"
                :label="dict.classifyName"
                :value="dict.classifyCode"
              />
            </el-select>
          </el-form-item>
          <div v-show="codeIsRedo" :style="{fontSize:'12px',color:'#fd7c25',marginTop:'-20px',marginLeft:'125px'}">该分类已添加对应广告不可重复添加</div>
          <!-- <div v-show="codeIsRedo" :style="{fontSize:'12px',color:'#fd7c25',marginTop:'-20px'}">该分类已添加对应广告若再次创建将替换该分类下原设置广告</div> -->
        </el-col>
      </el-row>
      <el-row :span="24">
        <el-col :span="12">
          <el-form-item label="展示开始时间" prop="showBeginTime">
            <el-date-picker
              v-model="form.showBeginTime"
              align="right"
              :picker-options="pickerOptions"
              type="datetime"
              placeholder="展示开始时间"
              value-format="timestamp"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="展示结束时间" prop="showEndTime">
            <el-date-picker
              v-model="form.showEndTime"
              align="right"
              type="datetime"
              :picker-options="pickerOptionEnd"
              placeholder="展示结束时间"
              value-format="timestamp"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="轮播图" prop="bannerPic">
            <image-upload-modal v-model="form.bannerPic" :limit="1"></image-upload-modal>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="链接类型" prop="linkType">
            <el-radio-group v-model="form.linkType" size="small">
              <el-radio label="0">无</el-radio>
              <el-radio label="1">站内链接</el-radio>
              <el-radio label="2">站外链接</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 站外链接 -->
          <el-form-item label="网站连接" prop="linkUrl" v-if="form.linkType === '2'">
            <el-input v-model="form.linkUrl" placeholder="请输入" />
          </el-form-item>
          <!-- 站内链接 -->
          <el-form-item label="站内连接" prop="linkPageType" v-else-if="form.linkType === '1'">
            <w-dict-select-tag dictCode="inboundLinks" v-model="form.linkPageType" ></w-dict-select-tag>
          </el-form-item>

          <!-- 产品 -->
          <el-form-item label="选择产品" prop="inLinkGoodsId" v-if="form.linkPageType === '1' && form.linkType === '1'">
            <el-button @click="showGoodsList" v-if="!form.inLinkGoodsId">请选择</el-button>
            <el-button @click="showGoodsList" v-else>{{ form.goodsName }}</el-button>
          </el-form-item>

          <!-- 促销活动 -->
          <el-form-item
            label="选择活动"
            prop="inLinkActivityId"
            v-if="form.linkPageType === '2' && form.linkType === '1'"
          >
            <el-select v-model="form.inLinkActivityId" placeholder="选择活动" clearable size="small">
              <el-option
                v-for="dict in goodsClassifyCodeOptions"
                :key="dict.id"
                :label="dict.activityName"
                :value="dict.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer" v-if="!disableSubmit">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="handleSubmit()" :loading="loading" :disabled="codeIsRedo">{{
        !loading ? '确 定' : '等待中'
      }}</el-button>
    </span>
    <w-sell-goods-list ref="goodsListModal" @change="currentRowChange"></w-sell-goods-list>
  </el-dialog>
</template>

<script>
import { getBannerAdd, getBannerUpdate, selectAboutOfBeginActivity,classifyIsRef } from '@/api/platform'
import { queryClassifyTree } from '@/api/goods'
export default {
  name: '',
  components: {},
  props: {
    bannerType: {
      type: Number,
      require: true,
      default: 0,
    },
  },
  data() {
    return {
      form: {
        name: undefined,
        showFlag: true,
        showBeginTime: undefined,
        showEndTime: undefined,
        bannerPic: undefined,
        linkType: '0',
        linkUrl: undefined,
        linkPageType: undefined,
        inLinkGoodsId: undefined,
        inLinkActivityId: undefined,
        goodsClassifyCode: undefined,
        bannerType: undefined,
        id: 0,
      },
      dialogVisible: false,
      disableSubmit: false,
      title: '',
      flag: '',
      loading: false,
      activityOptions: [],
      goodsClassifyCodeOptions: [],

      // 表单校验
      rules: {
        name: [{ required: true, trigger: 'blur', message: '请输入' }],
        showFlag: [{ required: true, trigger: 'blur', message: '请输入' }],
        showBeginTime: [{ required: true, trigger: 'blur', message: '请输入' }],
        showEndTime: [{ required: true, trigger: 'blur', message: '请输入' }],
        bannerPic: [{ required: true, trigger: 'blur', message: '请输入' }],
        linkType: [{ required: true, trigger: 'blur', message: '请输入' }],
        linkUrl: [{ required: true, trigger: 'blur', message: '请输入' }],
        linkPageType: [{ required: true, trigger: 'blur', message: '请输入' }],
        inLinkGoodsId: [{ required: true, trigger: 'blur', message: '请输入' }],
        inLinkActivityId: [{ required: true, trigger: 'blur', message: '请输入' }],
        goodsClassifyCode: [{ required: true, trigger: 'blur', message: '请输入' }],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 3600 * 24 * 1000
        },
      },
      codeIsRedo:false,
      goodsClassifyCode:null
    }
  },
  computed: {
    pickerOptionEnd() {
      let _this = this
      return {
        disabledDate(time) {
          if (_this.form.showBeginTime ?? false) {
            return time.getTime() < new Date(_this.form.showBeginTime).getTime()
          }
          return time.getTime() < Date.now()
        },
      }
    },
  },
  watch: {
    'form.linkPageType'(value) {
      if (value === '2') {
        selectAboutOfBeginActivity().then((res) => {
          this.goodsClassifyCodeOptions = res.data
          if(!this.form.inLinkActivityId) return
          let arr = this.goodsClassifyCodeOptions.filter(item=>{
            return item.id === this.form.inLinkActivityId
          })  || []  
          if( arr.length===0)  this.form.inLinkActivityId =  ""
        })
      }
    }
  },
  created() {

  },
  mounted() {},
  methods: {
    selChange(id){
      console.log(id);
      classifyIsRef({code:id}).then((res)=>{
        this.codeIsRedo = res.data
        if(this.goodsClassifyCode!=null&&this.goodsClassifyCode==id){
          this.codeIsRedo = false
        }
      })
    },
    add() {
      this.edit({})
      this.flag = 'add'
    },
    edit(info) {
      this.form = Object.assign(this.form, info)
      this.form.bannerType = this.bannerType
      this.form.showBeginTime = this.form.showBeginTime ? this.form.showBeginTime * 1000 : undefined
      this.form.showEndTime = this.form.showEndTime ? this.form.showEndTime * 1000 : undefined
      this.form.goodsClassifyCode =
        this.form.classifyDelFlag === 1 || this.form.classifyDelFlag === 2 ? undefined : this.form.goodsClassifyCode
      if (this.form.inboundLinkId) {
        if (this.form.linkPageType === '1' && this.form.linkType === '1') {
          this.form.inLinkGoodsId = this.form.inboundLinkId
        } else if (this.form.linkPageType === '2' && this.form.linkType === '1') {
           this.form.inLinkActivityId = this.form.inboundLinkId
        }
      }

      if (this.bannerType === 1) {
        queryClassifyTree().then((res) => {
          this.activityOptions = res.data.filter((item) => item.level === 1 && item.status === 1)
        })
      }
      this.goodsClassifyCode = this.form.goodsClassifyCode
      
      console.log('%c [ this.form ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.form)
      this.flag = 'edit'
      this.dialogVisible = true
    },
    showGoodsList() {
      this.$refs.goodsListModal.init()
    },
    currentRowChange(row) {
      console.log('%c [ row ]', 'font-size:13px; background:pink; color:#bf2c9f;', row)
      this.form.inLinkGoodsId = row.goodsId
      this.form.goodsName = row.goodsName
    },
    handleSubmit() {
      this.$refs['form'].validate(async (valid) => {
        if (!valid) return
        this.loading = true
        if(this.form.linkType=="2") this.form.linkPageType = null
        let action = this.flag === 'add' ? getBannerAdd : getBannerUpdate
        let obj = Object.assign({}, this.form)
        obj.showBeginTime = obj.showBeginTime / 1000
        obj.showEndTime = obj.showEndTime / 1000
        obj.classifyDelFlag = 0
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
          .catch(() => {
            this.loading = false
          })
      })
    },

    close() {
      this.dialogVisible = false
      this.loading = false
      this.codeIsRedo = false
      this.form = {
        name: undefined,
        showFlag: true,
        showBeginTime: undefined,
        showEndTime: undefined,
        bannerPic: undefined,
        linkType: '0',
        linkUrl: undefined,
        linkPageType: undefined,
        inLinkGoodsId: undefined,
        inLinkActivityId: undefined,
        goodsClassifyCode: undefined,
        bannerType: undefined,
        id: 0,
      }
    },
  },
}
</script>

<style scoped lang="scss">

</style>
