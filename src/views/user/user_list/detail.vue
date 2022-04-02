<template>
  <el-drawer :visible.sync="dialogVisible" destroy-on-close :before-close="close" :append-to-body="true" size="50%">
    <el-collapse v-model="activeNames">
      <el-collapse-item name="1">
        <template slot="title">
          <h3>基本信息</h3>
        </template>
        <div class="detail-list">
          <el-row :gutter="25">
            <el-col :span="4">
              <el-avatar :size="60" :src="detail.headPortrait">
                <img src="@/assets/images/default_image.png" />
              </el-avatar>
            </el-col>
            <el-col :span="20">
              <div class="title">
                {{ detail.userName }}
                <div class="userType" v-if="detail.userType === 0">普通用户</div>
                <div class="userType" v-if="detail.userType === 1">商城卖家</div>
              </div>

              <el-row :gutter="40" class="panel-group" type="flex" justify="center">
                <el-col class="card-panel-col">
                  <div class="term">账号：</div>
                  <div class="content">{{ detail.phone || '-' }}</div>
                </el-col>
              </el-row>
              <el-row :gutter="40" class="panel-group" type="flex" justify="center">
                <el-col class="card-panel-col">
                  <div class="term">性别：</div>
                  <div class="content" v-if="detail.gender == 0">{{ '男' }}</div>
                  <div class="content" v-if="detail.gender == 1">{{ '女' }}</div>
                  <div class="content" v-if="detail.gender == 2">{{ '保密' }}</div>
                </el-col>
              </el-row>
              <el-row :gutter="40" class="panel-group" type="flex" justify="center">
                <el-col class="card-panel-col">
                  <div class="term">出生年月：</div>
                  <div class="content">{{ detail.birthday || '-' }}</div>
                </el-col>
              </el-row>
              <el-row :gutter="40" class="panel-group" type="flex" justify="center">
                <el-col class="card-panel-col">
                  <div class="term">注册时间：</div>
                  <div class="content">{{ parseTime(detail.createTime) || '-' }}</div>
                </el-col>
              </el-row>
              <el-row :gutter="40" class="panel-group" type="flex" justify="center">
                <el-col class="card-panel-col">
                  <div class="term">最后登录时间：</div>
                  <div class="content">{{ detail.lastLoginTime || '-' }}</div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <h3>地址管理</h3>
        </template>

        <el-table :data="addressList" :row-key="rowKey" align="center">
          <el-table-column label="收货人" prop="consigneeName" min-width="120" :show-overflow-tooltip="true" />
          <el-table-column label="地址" prop="address" min-width="120" :show-overflow-tooltip="true" />
          <el-table-column label="联系电话" prop="consigneePhone" min-width="120" :show-overflow-tooltip="true" />
          <el-table-column label="邮政编码" prop="postCode" min-width="120" :show-overflow-tooltip="true" />
        </el-table>
      </el-collapse-item>
      <el-collapse-item name="3">
        <template slot="title">
          <h3>全部订单</h3>
        </template>
        <el-link type="primary" @click="handlePushOrderList" style="float: right;"
          >查看更多 <el-icon class="el-icon-d-arrow-right"></el-icon
        ></el-link>
        <el-table :data="orderList" :row-key="rowKey" align="center">
          <el-table-column label="订单号" prop="orderNo" min-width="120" :show-overflow-tooltip="true" />
          <el-table-column label="商家名称" prop="shopName" min-width="120" :show-overflow-tooltip="true" />
          <el-table-column label="下单时间" prop="createTime" min-width="120" :show-overflow-tooltip="true" >
            <template slot-scope="{ row }">
            {{ parseTime(row.createTime * 1000) }}
          </template>
          </el-table-column>
          <el-table-column label="收货地址" prop="address" min-width="120" :show-overflow-tooltip="true" />
          <el-table-column label="总金额（$)" prop="payMoney" min-width="120" :show-overflow-tooltip="true" />
          <el-table-column label="订单状态" prop="orderStatus" min-width="120" :show-overflow-tooltip="true">
            <template slot-scope="{ row }">
              <el-tag>{{row.orderStatus | orderStatus}}</el-tag>
              
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </el-drawer>
</template>

<script>
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      detail: {},
      dialogVisible: false,
      disableSubmit: false,
      title: '',
      flag: '',
      activeNames: ['1', '2', '3'],
      addressList: [],
      orderList: [],
      rowKey: 'id',
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  filters:{
    orderStatus(status){
      switch(status){
        case "101":
          return "等待买家上传凭证"
          break
          case "102":
          return "付款驳回"
          break
          case "201":
          return "待商家确认收款"
          break
          case "301":
          return "待发货"
          break
          case "302":
          return "待取货"
          break
          case "401":
          return "已发货"
          break
          case "501":
          return "交易完成"
          break
          case "601":
          return "超时关闭"
          break
          case "602":
          return "商家关闭"
          break
          case "603":
          return "用户关闭"
          break
           case "604":
          return "平台关闭"
          break
          default:
            return "未知状态"
					break
      }
    }
  },
  methods: {
    edit(info) {
      Object.assign(this.detail, info)
      this.addressList = this.detail.addressList ? this.detail.addressList : []
      this.orderList = this.detail.orderList ? this.detail.orderList : []
      this.flag = 'edit'
      this.dialogVisible = true
    },
    handlePushOrderList() {
      let url = encodeURIComponent(JSON.stringify({ appUserPhone: this.detail.phone }))
      this.$router.push({
        path: '/order/order_list',
        query: { edit: url },
      })
    },

    close() {
      this.dialogVisible = false
      this.detail = {}
    },
  },
}
</script>

<style scoped lang="scss">
.detail-list .title {
  color: rgba(0, 0, 0, 0.85);
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
}
.detail-list .userType {
  font-size: 14px;
  display: inline-block;
  color: rgb(206, 168, 0);
  cursor: pointer;
}
.detail-list .term {
  color: rgba(0, 0, 0, 0.85);
  display: table-cell;
  line-height: 20px;
  margin-right: 8px;
  padding-bottom: 16px;
  white-space: nowrap;
}
.detail-list .content {
  color: rgba(0, 0, 0, 0.65);
  display: table-cell;
  line-height: 22px;
  padding-bottom: 16px;
  width: 100%;
}
.el-collapse {
  margin: 0 10px;
}
::v-deep .el-drawer__body {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  height: 100%;
  overflow-y: auto;
}
</style>
