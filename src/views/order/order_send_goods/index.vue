<template>
  <div class="dashboard-editor-container" v-loading="loading">
    <div class="content-box">
      <el-tabs v-model="activeName">
        <el-tab-pane label="配送方式" name="first">
          <el-form :model="form" :rules="rules">
            <el-row>
              <el-col :span="24">
                <el-form-item prop="phone">
                  <el-radio-group v-model="form.deliverType" :disabled="deliverTypeDis" size="small">
                    <el-radio label="0">物流配送</el-radio>
                    <el-radio label="1">商家配送</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-row v-if="form.deliverType === '1'">
            <el-form ref="eForm1" :model="form" :rules="rules" label-width="120px">
              <el-row>
                <el-col>
                  <el-alert title="请确认是否自己配送订单" type="info" show-icon> </el-alert>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item prop="deliverName" label="送货人">
                    <el-input v-model="form.deliverName" placeholder="送货人" maxlength="30" show-word-limit />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="deliverLink" label="联系方式">
                    <el-input v-model="form.deliverLink" placeholder="联系方式" maxlength="10" show-word-limit />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="predictDeliverTime" label="预计送达时间">
                    <el-date-picker
                      v-model="form.predictDeliverTime"
                      align="right"
                      type="datetime"
                      value-format="timestamp"
                      placeholder="预计送达时间"
                      :picker-options="pickerOptions"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div>
      <div class="content-box">
        <el-tabs v-model="activeName">
          <el-tab-pane label="请确认商品信息以及收货信息" name="first">
            <el-alert
              title="支持一个订单下多个商品拆开分多次发货"
              type="success"
              show-icon
              v-if="form.deliverType === '0'"
            >
            </el-alert>
            <div class="table" v-for="goodsItem in dataSource" :key="goodsItem.orderId">
              <!-- table-header -->
              <div class="table-header">
                <el-row :gutter="20">
                  <el-col :span="16">
                    <el-row :gutter="10" type="flex" justify="space-between">
                      <el-col :span="8">
                        {{ `订单号：${goodsItem.orderNo}` }}
                      </el-col>
                      <el-col :span="8">
                        {{ `已支付：${goodsItem.paidHour}` }}
                      </el-col>
                      <el-col :span="8">
                        {{ `支付时间：${parseTime(goodsItem.payTime)}` }}
                      </el-col>
                    </el-row>
                  </el-col>
                  <el-col :span="8"> 订单备注 </el-col>
                </el-row>
              </div>
              <!-- table-body  -->
              <el-table
                show-header
                :data="goodsItem.goodsDetails"
                :span-method="spanMethod"
                @selection-change="handleSelectionChange"
                :row-key="rowKey"
                ref="dataTable"
              >
                <el-table-column type="selection" width="55" v-if="form.deliverType === '0'" :selectable="row=>row.refundStatus!==0"/>
                <el-table-column prop="name">
                  <template slot-scope="scope">
                    <div class="goodsdata-name">
                      <el-image :src="scope.row.goodsPic">
                        <div slot="error" class="image-slot">
                          <i class="el-icon-picture-outline" />
                        </div>
                      </el-image>
                      <div class="goodsdata-name-desc">
                        <el-tooltip :content="scope.row.goodsName" placement="top">
                          <div>{{ scope.row.goodsName }}</div>
                        </el-tooltip>
                        <div class="goodsdata-name-specDetail">
                          <span v-for="(item, index) in scope.row.specDetail" :key="index">
                            {{ item.name + ':' + item.value }}
                          </span>
                        </div>
                        <div>
                          {{ `单价:${scope.row.realPrice.toFixed(2) || 0}* ${scope.row.goodsCount || 0}` }}
                        </div>
                      </div>
                    </div>
                  </template>
                </el-table-column>

                <el-table-column align="center">
                  <template slot-scope="{ row }">
                    {{ `小计：$${(row.realPrice * row.goodsCount).toFixed(2)}` }}
                  </template>
                </el-table-column>
                <el-table-column>
                  <template>
                    <el-input type="textarea" :rows="2" v-model="goodsItem.shopOrderRemark" disabled></el-input>
                  </template>
                </el-table-column>
              </el-table>
              <!-- table-end  -->
              <div class="table-end">
                <el-row>
                  <el-col
                    >{{ `收货地址:${goodsItem.consigneeName},${goodsItem.consigneePhone},${goodsItem.userAddressStr}`
                    }}<el-button
                      type="text"
                      @click="
                        handleChangeAddress({
                          orderNo: goodsItem.orderNo,
                          consigneeName: goodsItem.consigneeName,
                          consigneePhone: goodsItem.consigneePhone,
                          userAddressStr: goodsItem.userAddressStr,
                          userAddress: goodsItem.userAddress,
                        })
                      "
                      icon="el-icon-edit-outline"
                      >修改收货地址</el-button
                    ></el-col
                  >
                </el-row>
                <el-row v-if="form.deliverType === '0'">
                  <el-form ref="eForm2" :model="form" :rules="rules">
                    <el-col :span="8">
                      <el-form-item prop="expressCompany" label="快递公司">
                        <el-select
                          v-model="form.expressCompany"
                          placeholder="快递公司"
                          clearable
                          size="small"
                          filterable
                          allow-create
                          v-el-select-input
                        >
                          <el-option
                            v-for="dict in expressOptions"
                            :key="dict.companyCode"
                            :label="`${dict.companyName}`"
                            :value="dict.companyCode"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item prop="expressNo" label="运单号码">
                        <el-input
                          v-model="form.expressNo"
                          placeholder="运单号码"
                          style="width: 250px"
                          show-word-limit
                          maxlength="20"
                        />
                      </el-form-item>
                    </el-col>
                  </el-form>
                </el-row>

                <div class="button">
                  <el-button type="primary" @click="handleSubmit" :loading="loading">{{
                    loading ? '等待中' : '确认并发货'
                  }}</el-button>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <address-modal ref="addressModal" @complete="init"></address-modal>
  </div>
</template>

<script>
import { batchDeliverDetail, expressCompanyList, canBatchDeliver, batchDeliver } from '@/api/order'
import { isAmericaPhone, isPhone, isName, validateNameForm } from '@/utils/validate'
import addressModal from '../components/addressModal.vue'
export default {
  name: '',
  components: { addressModal },
  props: {},
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 3600 * 24 * 1000
        },
      },
      activeName: 'first',
      routeData: {},
      expressOptions: [],
      loading: false,
      form: {
        deliverType: '0',
        deliverName: undefined,
        predictDeliverTime: undefined,
        deliverLink: undefined,
        expressCompanyId: undefined,
        expressCompany: undefined,
        expressNo: undefined,
        expressCompanyName: undefined,
      },
      rules: {
        // deliverName: [
        //   {
        //     required: true,
        //     trigger: 'change',
        //     validator: validateNameForm(1, 30),
        //   },
        // ],
        predictDeliverTime: [{ required: true, trigger: 'blur', message: '请输入送达时间' }],
        expressCompany: [{ required: true, trigger: 'blur', message: '请选择或输入快递公司' }],
        expressNo: [
          {
            required: true,
            trigger: 'change',
            validator: validateNameForm(4, 20),
          },
        ],
        deliverLink: [
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
      },
      dataSource: [],
      loading: false,
      selectionRows: [], //选中的数据
      rowKey: 'goodsId',
    }
  },
  directives: {
    elSelectInput: {
     bind: function (el, _, { context }) {
        if (el.tagName.toLowerCase() !== "input") {
          el = el.getElementsByTagName("input")[0];
        }
        var a, b;

        el.addEventListener("input", () => {
            a = el.value.trim().match(/[^x00-xff]/g)?el.value.trim().match(/[^x00-xff]/g).length:0;
            b = el.value.trim().length || 0;
            console.log(a,b);
              el.setAttribute("maxlength", 30-a);
        });
        el.addEventListener("blur", () => {
          if (el.value.trim().length > 0 && a + b <= 30) {
            if (
              !context.expressOptions.some(
                (item) => item.companyName == el.value.trim()
              )
            )
              context.expressOptions.push({
                companyName: el.value,
                companyCode: undefined,
              });
            context.form.expressCompany = el.value;
          }
        });
      },
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (!vm.$route.query || !vm.$route.query.edit) {
        vm.close()
      }
      vm.routeData = JSON.parse(decodeURIComponent(vm.$route.query.edit))
      vm.init()
    })
  },
  computed: {
    deliverTypeDis() {
      return this.dataSource.some((item) => item.delivered === true)
    },
  },
  watch: {
    'form.expressCompany': function(value) {
      if (!value || value === null) {
        this.form.expressCompanyName = undefined
        this.form.expressCompanyId = undefined
        this.form.expressCompany = undefined
        return
      }
      let arr = this.expressOptions.filter((item) => item.companyCode === value || item.companyName === value)
      if (arr.length === 0) {
        this.form.expressCompanyName = value
        this.form.expressCompanyId = undefined
      } else {
        this.form.expressCompanyName = arr[0].companyName
        this.form.expressCompanyId = arr[0].companyCode
      }
      console.log('%c [ this.form ]-319', 'font-size:13px; background:pink; color:#bf2c9f;', this.form)
    },
  },
  created() {},
  mounted() {
    expressCompanyList().then((res) => {
      this.expressOptions = res.data
    })
  },
  methods: {
    checkSelectable(row){
      return row.refundStatus !==0
    },
    spanMethod({ columnIndex, rowIndex }) {
      if (columnIndex !== 2) {
        return [1, 1]
      } else {
        if (rowIndex === 0) {
          return [10, 1]
        } else {
          return [0, 0]
        }
      }
    },
    init() {
      this.loading = true
      batchDeliverDetail({ orderNos: [this.routeData.orderNos] })
        .then((res) => {
          this.dataSource = res.data
          // 公寓号，街道，城市，州，邮编
          this.dataSource.forEach((data) => {
            data.userAddressStr = `${data.userAddress.houseNumber ?? '--'},${data.userAddress.street ?? '--'},${data
              .userAddress.city ?? '--'},${data.userAddress.state ?? '--'},${data.userAddress.postCode ?? '--'}`
          })
          //  默认复选框全部选中
          this.$nextTick(() => {
            this.dataSource.forEach((data, index) => {
              data.shopId = this.routeData.shopId
              //  默认全部勾选
              data.goodsDetails.forEach((row) => {
                if(row.refundStatus!=0) this.$refs.dataTable[index].toggleRowSelection(row, true)
              })
            })
          })

          this.loading = false
        })
        .catch(() => {
          this.close()
        })
    },
    //  修改订单地址
    handleChangeAddress(data) {
      this.$refs['addressModal'].openModal(data)
    },
    // 多选框选中数据
    handleSelectionChange(selectionRows) {
      this.selectionRows = selectionRows
    },
    handleSubmit() {
      let p1 = undefined
      let p2 = undefined
      console.log(
        '%c [ this.$refs["eForm1"] ]-349',
        'font-size:13px; background:pink; color:#bf2c9f;',
        this.$refs['eForm1'],
      )
      if (this.$refs['eForm1']) {
        p1 = new Promise((resolve, reject) => {
          this.$refs['eForm1'].validate((valid) => {
            if (valid) resolve()
            reject()
          })
        })
      }

      if (this.$refs['eForm2'] && this.$refs['eForm2'].length > 0) {
        p2 = new Promise((resolve, reject) => {
          this.$refs['eForm2'][0].validate((valid) => {
            if (valid) resolve()
            reject()
          })
        })
      }

      Promise.all([p1, p2]).then(() => {
        if (this.selectionRows.length === 0 && this.form.deliverType === '0') {
          this.$message.warning('请勾选发货商品')
          return
        }
        //  判断是否可以批量发货
        this.loading = true
        canBatchDeliver({ orderNos: [this.routeData.orderNos] })
          .then((res) => {
            console.log('%c [ 判断是否可以批量发货 ]', 'font-size:13px; background:pink; color:#bf2c9f;', res)
            if (res.data === true) {
              let arr = this.cloneDeep(this.dataSource)

              arr.forEach((item, index) => {
                arr[index] = Object.assign(item, this.form)
                arr[index].predictDeliverTime = arr[index].predictDeliverTime / 1000
                arr[index].goodsDetails = this.form.deliverType === '0' ? this.selectionRows : arr[index].goodsDetails
              })
              batchDeliver(arr).then((res) => {
                if (res.code === 0) {
                  this.$message.success(res.messgae || '操作成功')

                  this.close()
                } else {
                  this.$message.warning(res.messgae || '服务器错误')
                  this.loading = false
                }
              })
            } else {
              this.$message.warning(res.messgae || '不支持批量发货')
              this.loading = false
            }
          })
          .catch(() => {
            this.loading = false
          })
      })
    },
    close() {
      this.$store.dispatch('tagsView/delView', this.$route).then(() => {
        this.$router.push({ path: '/order/order_list' })
      })
    },
  },
}
</script>

<style scoped lang="scss">
/* table */
::v-deep .el-table__header-wrapper {
  height: 0;
  display: none;
}
.goodsdata-name {
  display: flex;
  align-items: center;
  max-width: 450px;
  .el-image {
    width: 40px;
    height: 40px;
    i {
      font-size: 20px;
      color: #aaa;
    }
  }

  &-desc {
    margin-left: 20px;

    div:nth-of-type(1) {
      font-weight: bold;
      display: -webkit-box;
      text-overflow: ellipsis;
      overflow: hidden;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2; //当属性值为3，表示超出3行隐藏
    }
  }
}
.table-header {
  padding: 20px 10px;
  background-color: #fafafa;
  border-radius: 3px;
}
.table-end {
  padding: 20px 10px;
  border-radius: 3px;
  border: 1px solid #e9e9e9;
}
.button {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
