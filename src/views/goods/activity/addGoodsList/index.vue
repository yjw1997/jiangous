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
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery({ activityId: queryParams.activityId })"
              >重置</el-button
            >
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="content-box">
      <!-- 操作按钮 -->
      <el-row :gutter="10" class="mb8">
        <el-button type="primary" size="mini" @click="handleAdd()">新增时间段</el-button>

        <right-toolbar :showSearch.sync="showSearch" @queryTable="loadData"></right-toolbar>
      </el-row>
      <el-table v-loading="loading" align="center" :data="dataSource" :rowKey="rowKey" row-class-name="promotion-table">
        <el-table-column label="编号" prop="id" min-width="80" :show-overflow-tooltip="true" />
        <el-table-column label="秒杀时段名称" prop="timeName" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="每日开始时间段" prop="beginTime" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="每日结束时间段" prop="endTime" min-width="120" :show-overflow-tooltip="true" />

        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          fixed="right"
          min-width="120"
        >
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑商品</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-close"
              @click="handleDelete(scope.row.id, '删除', 'timeIds')"
              >删除</el-button
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
    <rewrite-modal ref="modalForm" @OK="modelOK()"></rewrite-modal>
  </div>
</template>

<script>
import { ListMixin } from '@/mixins/wtrfyListMixin'
import { queryAdminPurchaseScheduleList, deleteActivityRushPurchaseScheduleByIds } from '@/api/goods'
import rewriteModal from './rewriteModal.vue'
export default {
  mixins: [ListMixin],
  name: '',
  components: { rewriteModal },
  props: ['activeName'],

  data() {
    return {
      url: {
        list: queryAdminPurchaseScheduleList,
        delete: deleteActivityRushPurchaseScheduleByIds,
      },
      rowKey: 'id',
      disableMixinCreated: true,
      timeRanger: [],
      goodsClassifyCodeOption: [],
      closeBatchButtonDisabled: true,
      form: {},
      activityId: '',
    }
  },
  computed: {},
  created() {},
  mounted() {},
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (!vm.$route.query || !vm.$route.query.edit) {
        vm.$router.push({ path: '/goods/activity' })
      }
      vm.queryParams.activityId = JSON.parse(decodeURIComponent(vm.$route.query.edit)).id
      vm.loadData().catch(() => {
        vm.$router.push({ path: '/goods/activity' })
      })
    })
  },
  watch: {},
  methods: {
    init() {},
    //编辑
    handleEdit(row) {
      let url = encodeURIComponent(
        JSON.stringify({
          id: row.id,
          activityId: row.activityId,
          timeName: row.timeName,
        }),
      )
      this.$router.replace({
        path: '/goods/activity/addGoodsList/goodsList',
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
    margin-left: 20px;

    div:nth-of-type(1) {
      font-weight: bold;
    }
  }
}
</style>
