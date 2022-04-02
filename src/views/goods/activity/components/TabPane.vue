<template>
  <div class="dashboard-editor-container">
    <!-- 用户搜索 -->
    <div class="search-box" v-show="showSearch">
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-min-width="68px">
        <el-row :gutter="20">
          <el-form-item label="活动名称" prop="activityName">
            <el-input
              v-model="queryParams.activityName"
              clearable
              size="small"
              style="width: 240px"
              placeholder="请输入"
              @keyup.enter.native="loadData(1)"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="loadData(1)">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery({ status: queryParams.status })"
              >重置</el-button
            >
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="content-box">
      <!-- 操作按钮 -->
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" size="mini" @click="handleAdd()">新增活动</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="loadData"></right-toolbar>
      </el-row>
      <el-table v-loading="loading" align="center" :data="dataSource" :rowKey="rowKey" row-class-name="promotion-table">
        <el-table-column prop="shopName" label="活动名称" min-width="200">
          <template slot-scope="scope">
            <div class="goodsdata-name">
              <el-image :src="scope.row.activityPic" fit="cover">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline" />
                </div>
              </el-image>
              <div class="goodsdata-name-desc">
                <div>{{ scope.row.activityName }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="报名时间" min-width="200" :show-overflow-tooltip="true">
          <template slot-scope="{ row }">
            {{ parseTime(row.enrollBeginTime * 1000, '{y}-{m}-{d}') }}-
            {{ parseTime(row.enrollEndTime * 1000, '{y}-{m}-{d}') }}
          </template>
        </el-table-column>
        <el-table-column label="活动时间" min-width="200" :show-overflow-tooltip="true">
          <template slot-scope="{ row }">
            {{ parseTime(row.activityBeginTime * 1000, '{y}-{m}-{d}') }}-
            {{ parseTime(row.activityEndTime * 1000, '{y}-{m}-{d}') }}
          </template>
        </el-table-column>
        <el-table-column label="上线/下架" prop="online" min-width="80" :show-overflow-tooltip="true">
          <template slot-scope="{ row }">
            <el-switch
              v-model="row.online"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChangeNumber(row, 'online', 'online', updateStatusActivitySchedule)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="活动状态" prop="status" min-width="100" :show-overflow-tooltip="true">
          <template slot-scope="{ row }">
            <span v-if="row.status == 0">报名未开始</span>
            <span v-if="row.status == 1">报名进行中</span>
            <span v-if="row.status == 2">报名未结束活动已开始</span>
            <span v-if="row.status == 3">活动准备中</span>
            <span v-if="row.status == 4">活动进行中</span>
            <span v-if="row.status == 5">活动已结束</span>
          </template>
        </el-table-column>
        <el-table-column label="报名人数" prop="auditNum" min-width="80" :show-overflow-tooltip="true" />
        <el-table-column label="审核通过" prop="passNum" min-width="80" :show-overflow-tooltip="true" />
        <el-table-column label="待审核" prop="waitNum" min-width="80" :show-overflow-tooltip="true" />

        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          fixed="right"
          min-width="120"
        >
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" icon="el-icon-refrigerato" @click="handleAudit(scope.row)"
              >审核</el-button
            >
            <el-button size="mini" type="text" icon="el-icon-plus" @click="handleAddGoods(scope.row)"
              >添加商品</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        :ipagination="ipagination"
        @pagination="loadData"
      />
    </div>
  </div>
</template>

<script>
import { ListMixin } from '@/mixins/wtrfyListMixin'
import { queryActivitySchedulePage, updateStatusActivitySchedule } from '@/api/goods'
export default {
  mixins: [ListMixin],
  name: '',
  components: {},
  props: ['activeName'],
  data() {
    return {
      url: {
        list: queryActivitySchedulePage,
      },
      rowKey: 'id',
      disableMixinCreated: true,
      timeRanger: [],
      goodsClassifyCodeOption: [],
      closeBatchButtonDisabled: true,
      // pushId: '',
    }
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  activated() {
    this.queryParams.status = this.activeName === 'tab-' ? undefined : Number(this.activeName.replace('tab-', ''))

    this.loadData()
  },
  methods: {
    updateStatusActivitySchedule,
    init() {},
    //新增
    handleAdd() {
      this.$router.push({
        path: '/goods/activity/activity_detail',
      })
    },
    //编辑
    handleEdit(row) {
      let url = encodeURIComponent(JSON.stringify({ id: row.id }))
      this.$router.push({
        path: '/goods/activity/activity_detail',
        query: { edit: url },
      })
    },

    //  前往商品审核列表
    handleAudit(row) {
      let url = encodeURIComponent(JSON.stringify({ id: row.id }))
      this.$router.push({
        path: '/goods/activity/activity_audit_list',
        query: { edit: url },
      })
    },
    //  新增商品
    handleAddGoods(row) {
      let url = encodeURIComponent(JSON.stringify({ id: row.id }))
      this.$router.push({
        path: '/goods/activity/addGoodsList',
        query: { edit: url },
      })
    },
  },
}
</script>

<style scoped lang="scss">
/* table */
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
      -webkit-line-clamp: 2; //当属性值为3，表示超出3行隐藏
    }
  }
}
</style>
