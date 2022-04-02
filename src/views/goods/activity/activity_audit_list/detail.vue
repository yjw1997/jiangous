e<template>
  <div class="dashboard-editor-container" v-loading="loading">
    <div class="content-box">
      <el-row :gutter="20">
        <el-col :span="18">
          <div class="el-descriptions__title el-descriptions__header">{{ dataSource.activityName }}</div>
          <div class="el-descriptions-item ">
            {{
              `报名时间: ${this.parseSecondTime(this.dataSource.enrollBeginTime)}~${this.parseSecondTime(
                this.dataSource.enrollEndTime,
              )}`
            }}
          </div>
          <div class="el-descriptions-item ">
            {{
              `活动时间: ${this.parseSecondTime(this.dataSource.activityBeginTime)}~${this.parseSecondTime(
                this.dataSource.activityEndTime,
              )}`
            }}
          </div>
          <el-divider></el-divider>
          <div class="goodsdata-name">
            <el-image :src="dataSource.picUrl">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
            <div class="goodsdata-name-desc">
              <div>{{ dataSource.goodTitle }}</div>
              <div>店铺价格:{{ dataSource.enrollPriceRange }}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div style="text-align:center">
            <svg-icon
              :icon-class="dataSource.auditStatus == '0' ? 'dsh' : dataSource.auditStatus == '1' ? 'shtg' : 'btg'"
              style="height: 30px;font-size: 80px; width:100px;height:100px"
            />
            <el-button type="primary" size="small" v-if="dataSource.auditStatus == '2'" @click="handleDismissTheReason"
              >查看驳回原因</el-button
            >
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="content-box">
      <el-tabs v-model="activeName">
        <el-tab-pane label="报名信息" name="first">
          <el-descriptions title="商品报名信息" :column="1">
            <el-descriptions-item label="商品活动名称">{{ dataSource.goodsName }}</el-descriptions-item>
            <el-descriptions-item label="商品ID">{{ dataSource.goodsId }}</el-descriptions-item>
            <el-descriptions-item label="商品类目">{{
              dataSource.goodsDetail && dataSource.goodsDetail !== null
                ? JSON.parse(dataSource.goodsDetail).goodsClassifyStr
                : '-'
            }}</el-descriptions-item>
            <!-- <el-descriptions-item label="活动价格">{{ dataSource.enrollPriceRange }}</el-descriptions-item>
            <el-descriptions-item label="总库存">{{ dataSource.saleStock }}</el-descriptions-item> -->
          </el-descriptions>
          <el-descriptions title="活动报名信息" :column="1">
            <el-descriptions-item label="联系人">{{ dataSource.contacts }}</el-descriptions-item>
            <el-descriptions-item label="报名规格"> </el-descriptions-item>
          </el-descriptions>
          <el-table :data="skusTable" align="center">
            <template v-for="tableHead in skusTableHeader">
              <!-- 自定义规格项 -->
              <el-table-column
                v-if="tableHead === 'enrollPrice'"
                :key="tableHead"
                :prop="tableHead"
                label="价格（$)"
                align="center"
              />
              <el-table-column
                v-else-if="tableHead === 'discount'"
                :key="tableHead"
                :prop="tableHead"
                label="折扣率"
                align="center"
              />
              <el-table-column v-else :key="tableHead" :prop="tableHead" :label="tableHead" align="center" />
            </template>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="content-box" style="text-align:center">
      <el-button @click="close">取消</el-button>

      <template v-if="dataSource.auditStatus === 0">
        <el-button @click="handleAuditCancel">审核驳回</el-button>
        <el-button @click="handleAuditSubmit" type="primary">审核通过</el-button>
      </template>

      <el-button @click="handlePush" type="primary">查看商品实时价格和库存</el-button>
    </div>
  </div>
</template>

<script>
import { queryActivityRushPurchaseGoodsDetail, activityRushPurchaseAuditSave } from '@/api/goods'
import { validateName } from '@/utils/validate.js'
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      dataSource: {},
      form: {},
      loading: false,
      activeName: 'first',
      tableList: [],
      skusTable: [],
      skusTableHeader: [],
      defaultAttr: {
        discount: '',
        enrollPrice: '',
      },
    }
  },
  computed: {},
  watch: {
    tableList() {
      this.madeTable()
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (!vm.$route.query || !vm.$route.query.edit) {
        vm.$router.push({ path: '/goods/activity' })
      }
      vm.form = JSON.parse(decodeURIComponent(vm.$route.query.edit))
      vm.init()
    })
  },
  created() {},
  mounted() {},
  methods: {
    init() {
      this.loading = true
      queryActivityRushPurchaseGoodsDetail(this.form)
        .then((res) => {
          this.dataSource = res.data
          this.tableList =
            this.dataSource.skuList.goodsSkus || this.dataSource.skuList.goodsSkus !== null
              ? this.dataSource.skuList.goodsSkus
              : []

          this.loading = false
        })
        .catch(() => {
          this.$message.error('服务器错误')
          this.$router.push({ path: '/goods/activity' })
        })
    },

    // 转换成表格数据
    madeTable() {
      // let a = deepClone(this.skus)
      let table = []
      this.tableList.forEach((item) => {
        let attr = {}
        if (item.specification === null || !item.specification) return
        item.enrollPrice =
          item.enrollPrice && item.enrollPrice !== null ? parseFloat(item.enrollPrice / 100).toFixed(2) : undefined
        item.discount =
          item.discount && item.discount !== null ? parseFloat(item.discount * 100).toFixed(2) + '%' : undefined
        item.specification.forEach((itemm) => {
          attr[itemm.name] = itemm.value
        })
        Object.keys(this.defaultAttr).forEach((key) => {
          attr[key] = item[key]
        })
        table.push(attr)
      })
      this.skusTable = table
      // 生成表头
      if (table.length) {
        this.skusTableHeader = Object.keys(table[0])
      }
    },

    //  审核驳回
    handleAuditCancel() {
      console.log('%c [ this.$prompt ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.$prompt)
      this.$prompt(`审核驳回`, {
        type: 'warning',
        showInput: true,
        inputType: 'textarea',
        rows: 10,
        // inputPattern: /^.{1,100}$/,
        inputValidator: (value) => {
          return validateName(value, 1, 500)
        },
        inputErrorMessage: '字符长度不能超过500',
      }).then(({ value }) => {
        this.handleactivityRushPurchaseAuditSave(2, value)
      })
    },
    //审核通过
    handleAuditSubmit() {
      this.handleactivityRushPurchaseAuditSave(1)
    },
    handleactivityRushPurchaseAuditSave(auditStatus, auditRemark = undefined) {
      let obj = {
        activityRushPurchaseAuditId: this.dataSource.activityRushPurchaseAuditId,
        auditStatus: auditStatus,
        auditRemark: auditRemark,
      }
      return activityRushPurchaseAuditSave(obj)
        .then((res) => {
          this.$message.success(res.message || '操作成功')
          this.close()
        })
        .catch((err) => {
          this.$message.warning(err.message || '服务器错误')
        })
    },
    //  查看驳回原因
    handleDismissTheReason() {
      const h = this.$createElement
      this.$msgbox({
        title: '驳回原因',
        message: h('div', { attrs: { class: 'el-textarea' } }, [
          h('el-input', {
            attrs: {
              rows: 6,
              disabled: true,
              type: 'textarea',
              value: this.dataSource.auditRemark,
            },
          }),
        ]),
      })
        .then(() => {})
        .catch(() => {})
    },
    //取消
    close() {
      let url = encodeURIComponent(JSON.stringify({ id: this.dataSource.activityId }))

      this.$store.dispatch('tagsView/delView', this.$route).then(() => {
        this.$router.push({
          path: '/goods/activity/activity_audit_list',
          query: { edit: url },
        })
      })
    },
    handlePush() {
      let url = encodeURIComponent(JSON.stringify({ id: this.dataSource.goodsId }))
      this.$router.push({
        path: '/goods/goods_detail',
        query: { edit: url },
      })
    },
  },
}
</script>

<style scoped lang="scss">
.el-descriptions {
  font-size: 16px;
}
.button {
  display: flex;
  flex-direction: column;
  button {
    margin: 10px 0;
  }
}
::v-deep .el-descriptions__title {
  font-size: 20px;
}
.goodsdata-name {
  display: flex;
  align-items: center;

  .el-image {
    width: 40px;
    height: 40px;
    i {
      font-size: 20px;
      color: #aaa;
    }
  }

  &-desc {
    margin-left: 50px;
    position: absolute;
    div:nth-of-type(1) {
      font-weight: bold;
      display: -webkit-box;
      text-overflow: ellipsis;
      overflow: hidden;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1; //当属性值为3，表示超出3行隐藏
    }
  }
}
.el-textarea ::v-deep .el-textarea__inner {
  height: 100px !important;
}
textarea {
  min-height: 100px !important;
}
</style>
