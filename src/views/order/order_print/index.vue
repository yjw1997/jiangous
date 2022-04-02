<template>
  <div class="dashboard-editor-container">
    <div class="content-box">
      <div id="print">
        <div class="print-box" v-for="(item, index) in dataSource" :key="index">
          <div class="title">商品购物清单</div>
          <el-descriptions>
            <template slot="title"> {{ `买家:${item.appNickName}     ${item.appUserPhone}` }} </template>
            <el-descriptions-item label="订单号">{{ item.orderNo }}</el-descriptions-item>
            <el-descriptions-item label="确认付款时间">{{ parseTime(item.payTime) }}</el-descriptions-item>
            <el-descriptions-item label="打印单生成时间">{{ parseTime(item.printTime) }}</el-descriptions-item>
            <el-descriptions-item label="收货人"> {{ item.consigneeName }}</el-descriptions-item>
            <el-descriptions-item label="收货电话">{{ item.consigneePhone }}</el-descriptions-item>
            <el-descriptions-item label="收货地址" v-if="item.deliverMode !== 1">
              {{ item.userAddressStr }}</el-descriptions-item
            >
          </el-descriptions>
          <el-descriptions
            direction="vertical"
            :column="6"
            border
            contentClassName="contentClassName"
            labelClassName="labelClassName"
            class="descriptions"
          >
            <template v-for="(printGoodsItem, key) in item.goodsDetails">
              <el-descriptions-item label="商品编号( ID )" :key="key">
                <div class="table-conent">{{ printGoodsItem.goodsId }}</div>
              </el-descriptions-item>
              <el-descriptions-item label="商品名称" :key="key">
                <div class="table-conent">{{ printGoodsItem.goodsName }}</div>
              </el-descriptions-item>
              <el-descriptions-item label="商品规格" :key="key">
                <div class="table-conent">{{ specDetailCom(printGoodsItem.specDetail) }}</div>
              </el-descriptions-item>
              <el-descriptions-item label="数量" :key="key">
                <div class="table-conent">{{ printGoodsItem.goodsCount }}</div>
              </el-descriptions-item>
              <el-descriptions-item label="单价" :key="key">
                <div class="table-conent">{{ printGoodsItem.realPrice.toFixed(2) }}</div>
              </el-descriptions-item>
              <el-descriptions-item label="小计" :key="key">
                <div class="table-conent">{{ (printGoodsItem.goodsCount * printGoodsItem.realPrice).toFixed(2) }}</div>
              </el-descriptions-item>
            </template>

            <!-- total -->
          </el-descriptions>
          <div class="descriptions-item-totle">
            <span style="margin: 0 10px">总数量: {{ item.totalGoodsCount }}</span>
            <span style="margin: 0 10px"> 商品总金额:${{ item.totalGoodsAmount.toFixed(2) }}</span>
          </div>
          <div class="totle">
            {{
              `商品总金额: ${item.totalGoodsAmount.toFixed(2)}+ 运费: $ ${item.expressFee.toFixed(
                2,
              )} = 订单总金额: $ ${item.totalPayAmount.toFixed(2)}`
            }}
          </div>
          <div class="textarea">
            <el-input type="textarea" v-model="item.shopOrderRemark" placeholder="订单备注"></el-input>
          </div>
          <div class="status">
            <span v-if="item.orderStatus.startsWith('1')">待上传凭证</span>
            <span v-if="item.orderStatus.startsWith('2')">待确认 </span>
            <span v-if="item.orderStatus === '301'">待发货</span>
            <span v-if="item.orderStatus === '302'">待取货</span>
            <span v-if="item.orderStatus.startsWith('4')">已发货</span>
            <span v-if="item.orderStatus.startsWith('5')">已完成</span>
            <span v-if="item.orderStatus.startsWith('6')">已关闭</span>
          </div>
          <div
            class="table-sort"
            v-if="showTableSort(item)"
            :style="{
              borderColor:
                item.orderStatus == 201 || item.orderStatus == 2
                  ? '#fd7c25'
                  : item.orderStatus == 301 || item.orderStatus == 3
                  ? '#ff5e5e'
                  : '',
            }"
          >
            {{ item.sort }}
          </div>
        </div>
      </div>

      <div class="button">
        <el-button type="primary" v-print="printObj">确认打印</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { ordersPrintDetailApi, ordersPrintApi } from '@/api/order'

export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      routeData: {},
      dataSource: [],
      printObj: {
        id: 'print',
        openCallback(vue) {
          vue.ordersPrint()
        },
      },
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (!vm.$route.query || !vm.$route.query.edit) {
        this.$store.dispatch('tagsView/delView', this.$route).then(() => {
          vm.$router.push({ path: '/order/order_list' })
        })
      }
      vm.routeData = JSON.parse(decodeURIComponent(vm.$route.query.edit))
      vm.init()
    })
  },
  methods: {
    init() {
      ordersPrintDetailApi(this.routeData.orderPrintList)
        .then((res) => {
          res.data.forEach((item) => {
            item.orderStatus = item.orderStatus.toString()
            item.userAddressStr = `${item.userAddress.houseNumber ?? '--'},${item.userAddress.street ?? '--'},${item
              .userAddress.city ?? '--'},${item.userAddress.state ?? '--'},${item.userAddress.postCode ?? '--'}`
          })
          this.dataSource = res.data
        })
        .catch(() => {
          this.$router.push({ path: '/order/order_list' })
        })
    },
    ordersPrint() {
      console.log(
        '%c [ this.routeData.orderPrintList ]-140',
        'font-size:13px; background:pink; color:#bf2c9f;',
        this.routeData.orderPrintList,
      )

      let arr = this.routeData.orderPrintList.map((item) => item.orderNo)
      ordersPrintApi({ orderNos: arr })
        .then((res) => {})
        .catch(() => {})
    },
    specDetailCom(list) {
      if (!list || list == null || list.length === 0) {
        return ''
      }
      let aa = list.map((item) => {
        return item.name + ':' + item.value
      })
      return aa
    },
    //  是否显示左上角排序
    showTableSort(row) {
      if (
        row.sort &&
        row.sort !== null &&
        (row.orderStatus == 201 || row.orderStatus == 301 || row.orderStatus == 2 || row.orderStatus == 3)
      ) {
        return true
      }
      return false
    },
  },
}
</script>

<style scoped lang="scss">
.print-box {
  border: 1px solid #cccccc;
  padding: 20px;
  margin: 10px;
  position: relative;
  .title {
    font-size: 18px;
    padding: 10px 0;
    text-align: center;
    font-weight: 700;
    font-style: normal;
  }
  .totle {
    text-align: right;
    padding: 20px 0;
  }
}
.button {
  text-align: center;
  margin: 20px 0;
}
.status {
  padding: 20px;
  border: 3px solid #ff0000;
  display: inline-block;
  border-radius: 6px;
  font-size: 18px;
  color: #ff0000;
  position: absolute;
  top: 20px;
  right: 20px;
}
.table-conent {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
.table-sort {
  display: inline-block;
  position: absolute;
  left: 0;
  top: 0;
  padding: 10px 18px;
  font-size: 16px;
  border: 3px solid #fd7c25;
}
.descriptions-item-totle {
  text-align: right;
  padding: 10px;
  box-sizing: border-box;
  font-weight: 400;
  line-height: 1.5;
  color: #606266;
  background-color: #fff;
  font-size: 14px;
  border: 1px solid #ebeef5;
}
.contentClassName {
  display: none;
}
.descriptions ::v-deep .el-descriptions__body {
  tbody:not(:first-child) {
    tr:first-child {
      display: none;
    }
  }
}
</style>
