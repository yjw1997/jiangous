<template>
  <div>
    <el-dialog title="历史记录" :visible.sync="dialogTableVisible" width="1000px">
      <el-table :data="dataSource">
        <el-table-column property="createTime" label="提交时间" min-width="120">
          <template slot-scope="{ row }">
            {{ parseTime(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column property="auditStatus" label="审核状态" min-width="120">
          <template slot-scope="{ row }">
            <!-- 0：待审核 1：审核通过 2：审核拒绝 3：取消审核 -->
            <el-tag v-if="row.auditStatus === 0">待审核</el-tag>
            <el-tag type="success" v-else-if="row.auditStatus === 1">审核通过</el-tag>
            <el-tag type="danger" v-else-if="row.auditStatus === 2">审核拒绝</el-tag>
            <el-tag type="info" v-else-if="row.auditStatus === 3">取消审核</el-tag>
          </template>
        </el-table-column>
        <el-table-column property="auditTime" label="审核时间" min-width="120">
          <template slot-scope="{ row }">
            {{ parseTime(row.auditTime) }}
          </template>
        </el-table-column>
        <el-table-column property="auditRemark" label="审核备注" min-width="120">
          <template slot-scope="{ row }">
            {{ row.auditRemark || '/' }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          fixed="right"
          min-width="120"
        >
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleDetail(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        :ipagination="ipagination"
        @pagination="loadData"
      />
    </el-dialog>
    <el-dialog title="入驻信息" :visible.sync="enterVisible" width="1000px">
      <div class="dialog-box">
        <strore_enter_detail_modal ref="storeEnterDetail" :form="form" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryHistoryPage } from '@/api/store'
import { ListMixin } from '@/mixins/wtrfyListMixin'
import strore_enter_detail_modal from './strore_enter_detail_modal'

import { queryShopAuditDetail } from '@/api/store'

export default {
  name: '',
  mixins: [ListMixin],
  props: {},
  components: { strore_enter_detail_modal },
  data() {
    return {
      dialogTableVisible: false,
      enterVisible: false,
      form: {},
      url: {
        list: queryHistoryPage,
      },
      disableMixinCreated: true,
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    show(info) {
      this.queryParams.shopId = info.shopId
      this.loadData(1).then(() => {
        this.dialogTableVisible = true
      })
    },
    handleDetail(row) {
      queryShopAuditDetail({ shopAuditId: row.shopAuditId })
        .then((res) => {
          this.form = Object.assign(this.form, res.data)
          this.enterVisible = true
        })
        .catch(() => {
          // this.enterVisible = false
        })
      // this.$refs.storeEnterDetail.init(row.shopAuditId)
    },
  },
}
</script>

<style scoped lang="scss">
.dialog-box {
  height: 500px;
  overflow-y: scroll;
}
</style>
