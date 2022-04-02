<template>
  <div class="dashboard-editor-container" v-loading="loading">
    <div class="content-box">
      <el-scrollbar wrap-class="scrollbar-wrapper" class="page-goodsrelease">
        <el-tabs v-model="activeName" style="background-color: #fff;" @tab-click="handleTabClick">
          <el-tab-pane label="基本信息" name="basic"> </el-tab-pane>
          <el-tab-pane label="销售信息" name="sale"> </el-tab-pane>
          <el-tab-pane label="描述信息" name="desc"></el-tab-pane>
          <el-tab-pane label="其他信息" name="others"></el-tab-pane>
        </el-tabs>
        <el-alert
          v-show="auditShow.flag"
          :title="auditShow.title"
          :type="auditShow.type"
          :description="auditShow.description"
          show-icon
        />
        <el-form label-width="80px" :model="goodsInfo" ref="goodsInfo" disabled>
          <div class="title" id="basic">
            基本信息
          </div>
          <div class="section">
            <el-form-item label="商家名称:" label-width="150px">
              <el-input v-model="goodsInfo.shopName" />
            </el-form-item>
            <el-form-item label="商品名称:" prop="goodsName" label-width="150px">
              <el-input v-model="goodsInfo.goodsName" placeholder="最多允许输入30个汉字（60字符）" />
            </el-form-item>
            <el-form-item label="商品类目:" prop="goodsClassifyCode" label-width="150px">
              <el-input v-model="goodsInfo.goodsClassifyName"></el-input>
            </el-form-item>
          </div>

          <div class="title" id="sale">
            销售信息
          </div>
          <div class="section speciflcation">
            <el-form-item label="规格设置:" label-width="150px">
              <el-form ref="specificationform" :model="{ skusTable }" v-if="specificationList.length > 0">
                <el-table :data="skusTable" max-height="550" style="width: 800px;" border stripe>
                  <template v-for="tableHead in skusTableHeader">
                    <el-table-column
                      v-if="tableHead === 'salePrice'"
                      :key="tableHead"
                      :prop="tableHead"
                      label="价格"
                      align="center"
                    />
                    <el-table-column
                      v-else-if="tableHead === 'stockNumber'"
                      :key="tableHead"
                      :prop="tableHead"
                      label="库存"
                      align="center"
                    />

                    <el-table-column v-else :key="tableHead" :prop="tableHead" :label="tableHead" align="center" />
                  </template>
                </el-table>
              </el-form>
            </el-form-item>
            <el-form-item label="价格:" prop="basePrice" label-width="150px" class="item-num">
              <el-input disabled v-model.trim="goodsInfo.basePrice">
                <template slot="prepend">$</template>
              </el-input>
              <span class="form-item-tips">展示商品最低价格</span>
            </el-form-item>

            <el-form-item label="总库存:" label-width="150px" class="item-num">
              <el-input disabled v-model="goodsInfo.totalStock"></el-input> 件
            </el-form-item>
          </div>

          <!-- 商品描述 -->
          <div class="title" id="desc">
            商品描述
          </div>
          <div class="section">
            <el-form-item label="商品图:" prop="" label-width="150px" class="item-num">
              <image-upload-modal v-model="goodsInfo.goodsPics" disabled :limit="0"></image-upload-modal>
              <div style="color: #aaa;">
                商品图片大小不能超过3MB；建议尺寸：800*800像素，最多上传6张，主图为必填项
              </div>
            </el-form-item>

            <el-form-item label="商品描述:" prop="description" label-width="150px" class="item-num">
              <div style="color: #aaa;">详细的商品描述可以提高商品的销量哦~</div>
              <div
                v-html="goodsInfo.description"
                class="el-textarea__inner"
                style="background-color: #F5F7FA;
    border-color: #E4E7ED;
    color: #C0C4CC;
    cursor: not-allowed;
    max-height:500px;
    max-width:100%;
    overflow-y: scroll;
    "
              ></div>
            </el-form-item>
          </div>

          <!-- 其他信息 -->
          <div class="title" id="others">
            其他信息
          </div>

          <div class="section">
            <el-form-item label="商品有效期:" prop="validDate" label-width="150px" class="item-num">
              <el-date-picker v-model="goodsInfo.validDate" type="datetime" placeholder="选择日期时间" />
            </el-form-item>
            <el-form-item label="限购设置:" prop="limitType" label-width="150px" class="item-num">
              <el-radio-group v-model="goodsInfo.limitType">
                <el-radio :label="0">不限制</el-radio>
                <el-radio :label="1">每单限购</el-radio>
                <el-radio :label="2">限制每个账号购买量</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="goodsInfo.limitType !== 0"
              label="限购量:"
              prop="limitNumber"
              label-width="150px"
              class="item-num"
            >
              <el-input v-model="goodsInfo.limitNumber" placeholder="请输入限购量"></el-input>
            </el-form-item>

            <el-form-item label="上架时间:" prop="publishStatus" label-width="150px" class="item-num">
              <el-radio-group v-model="goodsInfo.publishStatus">
                <div class="radio-vertical">
                  <el-radio :label="1">立即上架</el-radio>
                  <el-radio :label="2"
                    >定时上架
                    <div style="display: inline-block;">
                      <el-form-item
                        v-if="goodsInfo.publishStatus === 2"
                        prop="publishScheduleTime"
                        label-width="0"
                        class="item-num"
                      >
                        <el-date-picker
                          v-model="goodsInfo.publishScheduleTime"
                          type="datetime"
                          placeholder="请选择开售时间"
                        />
                      </el-form-item>
                    </div>
                  </el-radio>
                  <el-radio :label="0">放入仓库</el-radio>
                </div>
              </el-radio-group>
            </el-form-item>
          </div>
        </el-form>
        <!-- 发布商品按钮 -->
        <div class="btn-div">
          <!-- 立即上架 审核通过  且 核验通过 且 定时上架  或下架 -->
          <template v-if="goodsInfo.auditStatus === 1 && goodsInfo.verifyStatus === 1 && goodsInfo.publishStatus === 2">
            <el-button type="primary" @click="handlePutaway">立即上架</el-button>
          </template>

          <!-- 下架商品 审核通过  且 核验通过 且 上架 或定时上架 -->
          <template
            v-if="
              goodsInfo.auditStatus === 1 &&
                goodsInfo.verifyStatus === 1 &&
                (goodsInfo.publishStatus === 1 || goodsInfo.publishStatus === 2)
            "
          >
            <el-button type="primary" @click="handleSoldOut">下架商品</el-button>
          </template>

          <!--  核验, 审核通过   且 待核验 -->
          <template v-if="goodsInfo.auditStatus === 1 && goodsInfo.verifyStatus === 0">
            <el-button @click="handleVerificationClose">核验驳回</el-button>
            <el-button type="primary" @click="handleVerificationSubmit">核验通过</el-button>
          </template>
          <!-- 上架商品, 审核通过  且 核验通过且 下架 且不被平台下架 -->
          <tempalte
            v-if="
              goodsInfo.auditStatus === 1 &&
                goodsInfo.verifyStatus === 1 &&
                goodsInfo.publishStatus === 0 &&
                goodsInfo.downOperator !== 0
            "
          >
            <el-button type="primary" @click="handlePutaway">上架商品</el-button>
          </tempalte>

          <!-- 审核, 待审核 -->
          <template v-if="goodsInfo.auditStatus === 0">
            <el-button @click="handleAuditClose">审核驳回</el-button>
            <el-button type="primary" @click="handleAuditSubmit">审核通过</el-button>
          </template>

          <el-button @click="close">取 消</el-button>
          <!-- <el-button @click="handleDetele">删除</el-button> -->
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
// import Speciflcation from './components/Specification/index.vue'
import { validateName } from '@/utils/validate.js'
import {
  goodsClassifyQueryGoodsClassify as goodsClassify,
  goodsDetail,
  verifyGoods,
  takeUpGoods,
  takeDownGoods,
  auditGoods,
} from '@/api/goods'

export default {
  components: {},
  data() {
    return {
      activeName: 'basic',
      shopClassify: [], //商品类目
      form: {},
      loading: false,
      goodsInfo: {
        goodsName: '',
        goodsClassifyCode: null,
        totalStock: null,
        basePrice: null,
        description: '',
        validDate: '',
        picture: undefined,
        limitType: 0, //0不限制 1 每单限购 2 每个账号限制
        limitNumber: null,
        publishStatus: 1, // 0放入仓库 1上架 2 定时上架,可用
        publishScheduleTime: '',
      },
      specificationList: [],
      maxSpecificationValue: 3, //最大规格值
      maxSpecification: 3, //最大规格项目
      cartesianList: [], //笛卡尔积运算后的表格
      skusTable: [], //转化成表格格式
      skusTableHeader: [], //表格表头
      defaultAttr: {
        //默认属性
        salePrice: '',
        stockNumber: '',
      },
      auditShow: {
        flag: false,
        title: undefined,
        description: undefined,
        type: undefined,
      },
      remark: '',
      confirmParams: {},
      takeDownReason: undefined,
      // list: []
    }
  },
  computed: {
    // 吸顶高度
    stickyTop() {
      let top = 0
      if (this.$store.state.settings.fixedHeader) {
        top = 50
        this.$store.state.settings.tagsView && (top += 30)
      }
      return top
    },
  },
  watch: {
    specificationList: {
      handler(value) {
        if (!value.length) return
        // 转化成表格格式
        this.madeTable()
      },
      immediate: true,
      deep: true,
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      console.log('%c [ vm ]', 'font-size:13px; background:pink; color:#bf2c9f;', vm)
      if (!vm.$route.query || !vm.$route.query.edit) {
        vm.$router.push({ path: '/goods/goods_list' })
      }
      vm.form = JSON.parse(decodeURIComponent(vm.$route.query.edit))
      vm.init(vm.form.id)
    })
  },
  created() {},
  mounted() {
    this.getGoodsClassify()
  },
  methods: {
    // 切换tab
    handleTabClick(tab) {
      var anchor = this.$el.querySelector('#' + tab.name)
      document.getElementsByClassName('el-scrollbar__wrap')[3].scrollTop = anchor.offsetTop - 50
    },
    init(id) {
      this.loading = true
      this.getGoodsClassify()
      goodsDetail({ id }).then((res) => {
        this.loading = false
        this.goodsInfo = res.data
        this.goodsInfo.publishScheduleTime = res.data.publishScheduleTime * 1000
        this.goodsInfo.validDate = res.data.validDate * 1000
        this.goodsInfo.goodsPics = this.goodsInfo.goodsPics
          .filter((item) => item.picUrl)
          .map((item) => {
            return item.picUrl
          })

        this.specificationList = res.data.skus ?? []
        this.auditShowChange()
        console.log('%c [ goodsInfo ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.goodsInfo)
      })
      // .catch(() => {
      //   this.$router.push({ path: '/goods/goods_list' })
      // })
    },

    auditShowChange() {
      if (this.goodsInfo.auditStatus === 2) {
        this.auditShow = {
          title: '审核不通过',
          type: 'error',
          description: `原因${
            this.goodsInfo.auditRemark ?? false ? this.goodsInfo.auditRemark : '-----'
          }。如有问题，请联系审核人员或者拨打客服电话${
            this.goodsInfo.hotLine ?? false ? this.goodsInfo.hotLine : '-----'
          }。`,
          flag: true,
        }
      } else if (this.goodsInfo.downOperator === 0 && this.goodsInfo.publishStatus === 0) {
        this.auditShow = {
          title: '平台下架商品',
          type: 'error',
          description: `原因${
            this.goodsInfo.auditRemark ?? false ? this.goodsInfo.auditRemark : '-----'
          }。如有问题，请联系审核人员或者拨打客服电话${
            this.goodsInfo.hotLine ?? false ? this.goodsInfo.hotLine : '-----'
          }。`,
          flag: true,
        }
      } else if (this.goodsInfo.auditStatus === 0) {
        this.auditShow = {
          title: '待审核',
          type: 'warning',
          description: `请耐心等待审核,如有问题，请联系审核人员或者拨打客服电话${
            this.goodsInfo.hotLine ?? false ? this.goodsInfo.hotLine : '-----'
          }。`,
          flag: true,
        }
      } else if (this.goodsInfo.verifyStatus === 2) {
        this.auditShow = {
          title: '核验不通过',
          type: 'error',
          description: `原因${
            this.goodsInfo.auditRemark ?? false ? this.goodsInfo.auditRemark : '-----'
          }。如有问题，请联系审核人员或者拨打客服电话${
            this.goodsInfo.hotLine ?? false ? this.goodsInfo.hotLine : '-----'
          }。`,
          flag: true,
        }
      }
    },

    // 滚动切换tab页
    handleScrollSwitchTabs(e) {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      let tabKeys = Object.keys(this.$refs)
      //可视区的高度
      let windowHeight = document.documentElement.clientHeight || document.body.clientHeight
      //滚动条的总高度
      var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
      //滚动条到底部的条件
      if (scrollTop + windowHeight == scrollHeight) {
        // console.log("距顶部" + scrollTop + "可视区高度" + windowHeight + "滚动条总高度" + scrollHeight);
        this.activeName = tabKeys[tabKeys.length - 1]
      } else {
        tabKeys.forEach((item, index, arr) => {
          // console.log(index)
          // 最后一个描点元素不判断
          if (index < arr.length - 1) {
            if (scrollTop > this.$refs[item].offsetTop && scrollTop < this.$refs[arr[index + 1]].offsetTop) {
              this.activeName = item
            }
            // 滚动条超出所有锚点元素 且在锚点元素之上
            if (scrollTop < this.$refs[arr[0]].offsetTop) {
              this.activeName = arr[0]
            }
          }
        })
      }
    },
    // 获取类目信息
    getGoodsClassify() {
      const data = {
        allFlag: 1, //0 二级类目  1 所有类目
      }
      // 获取所有类目
      goodsClassify(data).then((res) => {
        this.shopClassify = this.handleTree(res.data, 'classifyCode', 'parentCode')
      })
    },

    // 转换成表格数据
    madeTable() {
      // let a = deepClone(this.skus)
      let table = []

      this.specificationList.forEach((item) => {
        console.log('%c [ item ]', 'font-size:13px; background:pink; color:#bf2c9f;', item)
        let attr = {}
        if (item.specificationMap === null || !item.specificationMap) return
        item.specificationMap.forEach((itemm) => {
          attr[Object.keys(itemm)] = itemm[Object.keys(itemm)]
        })
        Object.keys(this.defaultAttr).forEach((key) => {
          attr[key] = item[key]
        })
        table.push(attr)
      })
      this.skusTable = table
      console.log('%c [ table ]', 'font-size:13px; background:pink; color:#bf2c9f;', table)
      // 生成表头
      if (table.length) {
        this.skusTableHeader = Object.keys(table[0])
      }
    },

    // ___________________________________________________button

    handleActivityTypeCheck(title) {
      let obj = {
        title: '',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showInput: title === '下架' || title === '核验不通过' ? true : false,
      }
      // 0 与活动没有关联 1 已报名未审核通过 2已报名已审核通过 3已加入活动安排未到展示时间 4 已加入活动安排已到展示时间 5 已加入活动安排活动已开始
      switch (this.goodsInfo.activityType) {
        case 0:
          obj.title = `商品${title}请谨慎操作，确定${title}？`
          break
        case 1:
          obj.title = `该商品已报名限时活动抢购，${title}该商品将同时撤销活动报名是否继续操作？`
          obj.confirmButtonText = '坚持操作'
          obj.cancelButtonText = '再想想'
          break
        case 2:
          obj.title = `该商品已报名限时活动抢购且通过审核，${title}该商品将同时撤销活动报名是否继续操作？`
          obj.confirmButtonText = '坚持操作'
          obj.cancelButtonText = '再想想'
          break
        case 3:
        case 4:
          obj.title = `该商品已报名限时抢购活动且已在活动日程安排中不可${title}该商品，若有需要请先将商品从活动日程表中移除`
          obj.confirmButtonText = '知道了'
          obj.cancelButtonText = '关闭'
          obj.showInput = false
          break
        case 5:
          obj.title = `该商品已报名限时抢购活动且活动正在进行中，不可${title}该商品，若有需要请先将商品从活动日程表中移除`
          obj.confirmButtonText = '知道了'
          obj.cancelButtonText = '关闭'
          obj.showInput = false
          break
        default:
          obj.title = `商品${title}请谨慎操作，确定${title}？`
          break
      }
      return obj
    },
    // 取消发布
    close() {
      this.$store.dispatch('tagsView/delView', this.$route).then(() => {
        this.$router.push({ path: '/goods/goods_list' })
      })
    },
    // 下架商品
    handleSoldOut() {
      let obj = {
        takeDownReason: '',
        id: this.form.id,
      }
      const { title, confirmButtonText, cancelButtonText, showInput } = this.handleActivityTypeCheck('下架')
      this.$prompt(`${title}`, `下架商品`, {
        type: 'warning',
        confirmButtonText,
        cancelButtonText,
        showInput,
        inputType: 'textarea',
        rows: 10,
        // inputPattern: showInput ? /^.{1,500}$/ : false,
        inputValidator: showInput
          ? (value) => {
              return validateName(value, 1, 500)
            }
          : false,
        inputErrorMessage: '请输入下架理由,字符长度不能超过500',
        beforeClose: (action, instance, done) => {
          321
          obj.takeDownReason = instance.inputValue
          if (action === 'confirm') {
            if (
              this.goodsInfo.activityType === 3 ||
              this.goodsInfo.activityType === 4 ||
              this.goodsInfo.activityType === 5
            ) {
              done()
              return
            }
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            takeDownGoods(obj)
              .then((res) => {
                this.$message.success(res.message || '操作成功')
                instance.confirmButtonLoading = false
                instance.confirmButtonText = '确定'
                done()
                this.close()
              })
              .catch(() => {
                instance.confirmButtonLoading = false
                instance.confirmButtonText = '确定'
              })
          } else {
            done()
            instance.confirmButtonLoading = false
          }
        },
      })
        .then(() => {})
        .catch(() => {})
    },
    // 核验不通过
    handleVerificationClose() {
      let obj = {
        auditRemark: '',
        auditStatus: 2,
        id: this.form.id,
      }
      const { title, confirmButtonText, cancelButtonText, showInput } = this.handleActivityTypeCheck('核验不通过')
      this.$prompt(`${title}`, `核验商品`, {
        type: 'warning',
        confirmButtonText,
        cancelButtonText,
        showInput,
        inputType: 'textarea',
        rows: 10,
        // inputPattern: showInput ? /^.{1,500}$/ : false,
        inputValidator: showInput
          ? (value) => {
              return validateName(value, 1, 500)
            }
          : false,
        inputErrorMessage: '请输入核验不通过理由,字符长度不能超过500',
        beforeClose: (action, instance, done) => {
          obj.auditRemark = instance.inputValue
          if (action === 'confirm') {
            if (
              this.goodsInfo.activityType === 3 ||
              this.goodsInfo.activityType === 4 ||
              this.goodsInfo.activityType === 5
            ) {
              done()
              return
            }
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            verifyGoods(obj)
              .then((res) => {
                this.$message.success(res.message || '操作成功')
                instance.confirmButtonLoading = false
                instance.confirmButtonText = '确定'
                done()
                this.close()
              })
              .catch(() => {
                instance.confirmButtonLoading = false
                instance.confirmButtonText = '确定'
              })
          } else {
            done()
            instance.confirmButtonLoading = false
          }
        },
      })

        .then(() => {})
        .catch(() => {})
    },
    //核验通过
    handleVerificationSubmit() {
      let obj = {
        auditRemark: '',
        auditStatus: 1,
        id: this.form.id,
      }
      verifyGoods(obj)
        .then((res) => {
          this.$message.success(res.message || '操作成功')
          this.close()
        })
        .catch(() => {})
    },
    //上架商品,立即上架
    handlePutaway() {
      takeUpGoods({ id: this.form.id })
        .then((res) => {
          this.$message.success(res.message || '操作成功')
          this.close()
        })
        .catch(() => {})
    },
    // 审核通过
    handleAuditSubmit() {
      let obj = {
        auditRemark: '',
        auditStatus: 1,
        id: this.form.id,
      }
      auditGoods(obj)
        .then((res) => {
          this.$message.success(res.message || '操作成功')
          this.close()
        })
        .catch(() => {})
    },
    //审核驳回
    handleAuditClose() {
      let obj = {
        auditRemark: '',
        auditStatus: 2,
        id: this.form.id,
      }

      this.$prompt(`审核驳回`, {
        type: 'warning',
        showInput: true,
        inputType: 'textarea',
        rows: 10,
        // inputPattern: /^.{1,100}$/,
        inputValidator: (value) => {
          return validateName(value, 1, 100)
        },
        inputErrorMessage: '字符长度不能超过100',
        beforeClose: (action, instance, done) => {
          obj.auditRemark = instance.inputValue
          if (action === 'confirm') {
            if (
              this.goodsInfo.activityType === 3 ||
              this.goodsInfo.activityType === 4 ||
              this.goodsInfo.activityType === 5
            ) {
              done()
              return
            }
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            auditGoods(obj)
              .then((res) => {
                this.$message.success(res.message || '操作成功')
                instance.confirmButtonLoading = false
                instance.confirmButtonText = '确定'
                done()
                this.close()
              })
              .catch(() => {
                instance.confirmButtonLoading = false
                instance.confirmButtonText = '确定'
              })
          } else {
            done()
            instance.confirmButtonLoading = false
          }
        },
      })
        .then(() => {})
        .catch(() => {})
    },

    //  发布商品
    releaseGoods() {
      this.$refs['goodsInfo'].validate((valid) => {
        if (valid) {
          // 如果有设置规格
          if (this.specificationList.length > 0) {
            this.$refs['specification'].validate((valid2) => {
              if (valid2) {
                this.$refs['specification'].validate((valid3) => {
                  if (valid3) {
                    // 调用接口
                    alert('验证通过有设置规格')
                  }
                })
              }
            })
            // 没有设置规格值
          } else {
            // 调用接口
            alert('验证通过没有设置规格值')
          }
        }
      })
    },
  },
  destroyed() {
    window.onscroll = null
  },
}
</script>

<style lang="scss" scoped>
.hasTagsView {
  .page-goodsrelease {
    height: calc(100vh - 100px - 32px - 60px);
    overflow-x: hidden;
  }
}
.page-goodsrelease {
  height: calc(100vh - 50px - 32px);
  overflow-x: hidden;
}
::v-deep .el-scrollbar__wrap {
  overflow-x: hidden;
}
.el-tabs {
  position: sticky;
  background-color: #fff;
  top: 0;
  z-index: 3;
}

.title {
  margin: 20px 0;
}

.section {
  padding: 20px 0;
}

.input-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  &-title {
    width: 150px;
    text-align: right;
    margin-right: 10px;
    align-self: flex-start;
  }

  .el-button {
    margin-left: 10px;
  }

  .el-input,
  .el-cascader {
    flex: 1;
    margin-right: 10px;
  }
}

.basic-item {
  width: 600px;
}

.speciflcation {
}

.speciflcation-item {
  width: auto;

  .el-input {
    width: 200px;
    flex: none;
  }
}

// 商品swiper上传
.upload-box {
  display: flex;

  > div {
    margin: 10px 10px 10px 0;
  }
}

.editor {
  margin: 10px 0;
  width: 1000px;
}

.others-item {
  .el-input {
    width: 250px;
    flex: none;
  }

  .radio-vertical {
    .el-radio {
      display: block;
      font-size: 16px;
      margin-bottom: 20px;
    }

    .el-input {
      margin-left: 15px;
    }
  }
}

.btn-div {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  position: sticky;
  background-color: #fff;
  bottom: 0;
  height: 80px;
  z-index: 3;
  .el-button {
    margin-left: 30px;
  }
}

.el-form {
  ::v-deep .el-form-item__label {
    font-size: 16px;
    font-weight: normal;
  }

  .el-input {
    width: 500px;
  }

  .el-cascader {
    width: 500px;
  }

  .form-item-tips {
    margin-left: 20px;
    color: #bbb;
  }

  .item-num {
    width: 100%;
    min-width: 350px;

    .el-input {
      width: 300px;
    }
  }

  .radio-vertical {
    .el-radio {
      display: block;
      font-size: 16px;
      margin-bottom: 20px;
    }

    .el-input {
      margin-left: 15px;
    }
  }
}

// 规格
.boxes {
  display: flex;
  align-items: center;
}

.delete {
  margin-left: 10px;
}

.box {
  width: 800px;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
}

.item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  &-title {
    text-align: right;
    width: 80px;
    margin-right: 10px;
  }

  &-content {
    flex: 1;
  }

  .el-input,
  .el-cascader {
    width: 100%;
    margin: 10px;
  }
}

.specification-value {
  .item-title {
    // align-items: flex-start;
  }

  .item-content {
    align-items: flex-start;

    .el-form-item {
      display: inline-block;
    }
  }

  .el-input {
    width: 150px;
    margin: 10px;
  }
}

.button-div {
  margin: 10px;
}

.el-table {
  .el-input {
    width: 100%;
  }
}

// 规格 END
</style>
