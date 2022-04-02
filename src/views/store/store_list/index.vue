<template>
  <div class="dashboard-editor-container">
    <!-- 用户搜索 -->
    <div class="search-box" v-show="showSearch">
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-min-width="68px">
        <el-form-item label="店铺名称" prop="shopName">
          <el-input
            v-model="queryParams.shopName"
            clearable
            size="small"
            style="width: 240px"
            placeholder="请输入"
            @keyup.enter.native="loadData(1)"
          />
        </el-form-item>
        <el-form-item label="店铺类型" prop="businessType">
          <w-dict-select-tag dictCode="businessType" v-model="queryParams.businessType" />
        </el-form-item>
        <el-form-item label="主营类目" prop="goodsClassifyCode">
          <w-back-category v-model="queryParams.goodsClassifyCode"></w-back-category>
        </el-form-item>
        <el-form-item label="自营/商家店铺" prop="shopType">
          <w-dict-select-tag dictCode="ownType" v-model="queryParams.shopType" />
        </el-form-item>
        <el-form-item label="店铺状态" prop="shopStatus" v-if="active === '0'">
          <w-dict-select-tag dictCode="shopStatus" v-model="queryParams.shopStatus" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="loadData(1)">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery({ searchType: '0' })">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-box">
      <!-- 操作按钮 -->
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button-group>
            <el-button :type="active === '0' ? 'primary' : ''" size="mini" @click="handleQuery('0')"
              >已入驻店铺</el-button
            >
            <el-button :type="active === '1' ? 'primary' : ''" size="mini" @click="handleQuery('1')"
              >入驻待审核</el-button
            >
            <el-button :type="active === '2' ? 'primary' : ''" size="mini" @click="handleQuery('2')"
              >入驻信息更正审核</el-button
            >
            <el-button :type="active === '3' ? 'primary' : ''" size="mini" @click="handleQuery('3')"
              >审核驳回</el-button
            >
          </el-button-group>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="loadData"></right-toolbar>
      </el-row>
      <el-table v-loading="loading" :data="dataSource" align="center" @selection-change="handleSelectionChange">
        <el-table-column label="编号" prop="id" min-width="60" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="店铺名称" prop="shopName" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="店铺类型" prop="shopType" min-width="120" :show-overflow-tooltip="true">
          <template slot-scope="{ row }">
            <el-tag v-if="row.businessType == 0" type="primary">个体</el-tag>
            <el-tag v-if="row.businessType == 1" type="primary">公司</el-tag>
            <el-tag type="warning" v-if="row.shopType == 1">(自营店铺)</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="主营类目" prop="goodsClassifyCode" min-width="80" :show-overflow-tooltip="true" />
        <el-table-column
          label="入驻状态"
          prop="auditStatus"
          min-width="80"
          :show-overflow-tooltip="true"
          align="center"
        >
          <template slot-scope="{ row }">
            <el-tag v-if="row.auditStatus == 0" type="primary">待审核 </el-tag>
            <el-tag v-if="row.auditStatus == 1" type="primary">审核通过</el-tag>
            <el-tag v-if="row.auditStatus == 2" type="primary">审核拒绝</el-tag>
            <el-tag v-if="row.auditStatus == 3" type="primary">入驻信息更正</el-tag>
            <div v-if="row.isUpdate" class="isUpdateClass">（入驻信息更正中）</div>
          </template>
        </el-table-column>

        <el-table-column
          label="申请时间"
          prop="createTime"
          min-width="120"
          :show-overflow-tooltip="true"
          v-if="queryParams.searchType == '1' || queryParams.searchType == '3'"
        >
          <template slot-scope="{ row }">
            {{ parseTime(row.createTime * 1000, '{y}-{m}-{d}') }}
          </template>
        </el-table-column>
        <el-table-column
          label="店铺状态"
          prop="shopStatus"
          min-width="80"
          :show-overflow-tooltip="true"
          v-if="queryParams.searchType == '0' || queryParams.searchType == '2'"
        >
          <template slot-scope="{ row }" v-if="queryParams.searchType == '0' || queryParams.searchType == '2'">
            <el-tag v-if="row.shopStatus === 2" type="primary">已过期</el-tag>
            <el-tag v-if="row.shopStatus === 1" type="primary">营业中</el-tag>
            <el-tag v-if="row.shopStatus === 0" type="primary">已停用</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="入驻时间"
          prop="enterTime"
          min-width="120"
          :show-overflow-tooltip="true"
          v-if="queryParams.searchType == '0' || queryParams.searchType == '2'"
        >
          <template slot-scope="{ row }">
            {{ parseTime(row.enterTime * 1000, '{y}-{m}-{d}') }}
          </template>
        </el-table-column>
        <el-table-column
          label="有效期"
          prop="validDate"
          min-width="120"
          :show-overflow-tooltip="true"
          v-if="queryParams.searchType == '0' || queryParams.searchType == '2'"
        >
          <template slot-scope="{ row }">
            {{ parseTime(row.validDate * 1000, '{y}-{m}-{d}') }}
          </template>
        </el-table-column>
        <el-table-column
          label="押金"
          prop="payDepositFlag"
          min-width="100"
          :show-overflow-tooltip="true"
          v-if="queryParams.searchType == '0'"
        >
          <template slot-scope="{ row }">
            <el-tag v-if="row.payDepositFlag == 0" type="primary">待缴纳</el-tag>
            <el-tag v-if="row.payDepositFlag == 1" type="primary">已缴纳</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="佣金抽取率"
          prop="rakeRate"
          min-width="80"
          :show-overflow-tooltip="true"
          v-if="queryParams.searchType == '0'"
          align="center"
        >
          <template slot-scope="{ row }">
            <template>
                {{row.rakeRate}}%
            </template>
          </template>
        </el-table-column>
        <!-- <el-table-column
          label="状态"
          prop="shopStatus"
          min-width="80"
          :show-overflow-tooltip="true"
          v-if="queryParams.searchType == '0'"
        >
          <template slot-scope="{ row }">
            <el-switch
              v-model="row.shopStatus"
              :active-value="1"
              :inactive-value="0"
              @change="
                handleStatusChangeNumber(row, 'shopStatus', 'shopStatus', updateShopStatusShop, 'shopId', row.id)
              "
            ></el-switch>
          </template>
        </el-table-column> -->
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          fixed="right"
          :min-width="queryParams.searchType === '0' ? 200 : 80"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              v-if="queryParams.searchType === '0'"
              type="text"
              icon="el-icon-document"
              @click="handleDetail(scope.row)"
              >店铺信息</el-button
            >
            <el-button
              size="mini"
              v-if="queryParams.searchType === '0' && scope.row.shopStatus !== 0"
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
              >修改有效期</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              v-if="queryParams.searchType === '0'"
              @click="handledeposit(scope.row,'depositForm')"
              >修改押金</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              v-if="queryParams.searchType === '0'"
              @click="handledeposit(scope.row,'rakeRateForm')"
              >修改佣金</el-button
            >
            <el-button size="mini" type="text" icon="el-icon-document-copy" @click="handleEnterDetail(scope.row)">{{
              queryParams.searchType === '0'
                ? '入驻信息'
                : queryParams.searchType === '1' || queryParams.searchType === '2'
                ? '审核'
                : '查看'
            }}</el-button>
            <el-button
              size="mini"
              v-if="queryParams.searchType == '0'"
              type="text"
              @click="handleStatusChange(scope.row)"
              >{{ scope.row.shopStatus === 0 ? '启用' : '停用' }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        :ipagination="ipagination"
        @pagination="queryShopPageList"
      />
    </div>
    <rewrite-modal ref="modalForm" @OK="modelOK" @upload="changeShopStatusUp"></rewrite-modal>
    <deposit-modal ref="depositForm" @OK="modelOK"></deposit-modal>
    <rake-rate-modal ref="rakeRateForm" @OK="modelOK"></rake-rate-modal>
  </div>
</template>

<script>
import { ListMixin } from '@/mixins/wtrfyListMixin'
import rewriteModal from './rewriteModal.vue'
import depositModal from './depositModal.vue'
import rakeRateModal from './rakeRateModal.vue'
import { queryShopPageList, updateShopStatusShop } from '@/api/store'
import { validateName } from '@/utils/validate.js'
export default {
  name: 'store_list',
  mixins: [ListMixin],
  components: { rewriteModal, depositModal,rakeRateModal },
  props: {},
  data() {
    return {
      url: {
        list: queryShopPageList,
      },

      active: '0',
      queryParams: {
        searchType: '0',
      },
      params: {},
      disableMixinCreated: true,
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (vm.$route.query && vm.$route.query.edit) {
        vm.handleQuery(JSON.parse(decodeURIComponent(vm.$route.query.edit)).active)
      } else {
        vm.loadData()
      }
    })
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    queryShopPageList,
    handleQuery(active) {
      this.active = active
      this.queryParams.searchType = this.active
      this.loadData(1)
    },
    resetQuery(obj = {}) {
      this.active = '0'
      this.queryParams = obj
      /* 分页参数 */
      this.ipagination = {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '25', '50'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
      }
      this.loadData(1)
    },
    //  店铺详情
    handleDetail(row) {
      let url = encodeURIComponent(
        JSON.stringify({ id: row.id, shopAuditId: row.shopAuditId, isActivityShop: row.isActivityShop }),
      )
      this.$router.push({
        path: '/store/store_list/store_detail',
        query: { edit: url },
      })
    },
    //入驻信息
    handleEnterDetail(row) {
      console.log('%c [ row ]-293', 'font-size:13px; background:pink; color:#bf2c9f;', row)
      let url = encodeURIComponent(
        JSON.stringify({ id: row.id, shopAuditId: row.shopAuditId, searchType: this.queryParams.searchType }),
      )

      this.$router.push({
        path: '/store/store_list/store_enter_detail',
        query: { edit: url },
      })
    },
    //  停用/启用
    handleStatusChange(row) {
      console.log('%c [ row ]', 'font-size:13px; background:pink; color:#bf2c9f;', row)
      this.params = {
        shopId: row.id,
        shopStatus: row.shopStatus === 0 ? 1 : 0,
      }
      if (row.shopStatus === 1 || row.shopStatus === 2) {
        //店铺中存在有参与限时活动商品
        if (row.isActivityShop === true) {
          this.$prompt(
            '该商店存在已报名限时活动抢购且通过审核商品，停用该店铺将同时将商品从活动中移出，是否继续操作？',
            '提示',
            {
              type: 'warning',
              cancelButtonText: '再想想',
              confirmButtonText: '坚持停用',
              showInput: true,
              inputPlaceholder: '停用原因',
              rows: 6,
              // inputPattern: /^.{1,100}$/,
              inputValidator: (value) => {
                return validateName(value, 1, 500)
              },
              inputErrorMessage: '字符长度不能超过500',
              inputType: 'textarea',
            },
          )
            .then(({ value }) => {
              this.params.stopRemark = value
              this.handleUpdateShopStatusShop()
            })
            .catch(() => {})
        } else {
          this.$prompt('停用店铺', {
            inputPlaceholder: '停用原因',
            showInput: true,
            type: 'warning',
            rows: 6,
            // inputPattern: /^.{1,100}$/,
            inputValidator: (value) => {
              return validateName(value, 1, 500)
            },
            inputType: 'textarea',

            inputErrorMessage: '字符长度不能超过500',
          })
            .then(({ value }) => {
              this.params.stopRemark = value
              return this.handleUpdateShopStatusShop()
            })
            .then((res) => {
              this.$message.success(res.messgae || '操作成功')
              this.close()
            })
            .catch(() => {})
        }
      } else {
        this.$refs.modalForm.title = '启用店铺'
        this.$refs.modalForm.sendUpload = true
        this.$refs.modalForm.disableSubmit = false
        this.$refs.modalForm.edit(row)
      }
    },

    changeShopStatusUp(row) {
      this.loading = true
      this.params.validDate = parseInt(row.validDate / 1000)
      this.handleUpdateShopStatusShop()
    },
    handleUpdateShopStatusShop() {
      this.loading = true
      updateShopStatusShop(this.params)
        .then((res) => {
          this.$message.success(res.message || '操作成功')
          this.loading = false
          this.loadData()
        })
        .catch(() => {
          this.loadData()
          this.loading = false
        })
    },
    // 修改押金
    handledeposit(row,name) {
      if(name==="depositForm"){
        this.$refs[name].title = '修改押金'
      }else{
         this.$refs[name].title = '修改佣金率'
      }
      this.$refs[name].show(row)
    },
  },
}
</script>

<style scoped lang="scss">
.isUpdateClass {
  color: #ff9933a5;
  font-size: 12px;
}
</style>