<template>
  <div class="dashboard-editor-container">
    <!-- 用户搜索 -->
    <div class="search-box" v-show="showSearch">
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-min-width="68px">
        <el-form-item label="用户昵称" prop="appUserName">
          <el-input
            v-model="queryParams.appUserName"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="loadData(1)"
          />
        </el-form-item>
        <el-form-item label="账号" prop="appUserNum">
          <el-input
            v-model="queryParams.appUserNum"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="loadData(1)"
          />
        </el-form-item>
        <el-form-item label="分类" prop="intentionClassifyId">
          <w-user-buy-classify v-model="queryParams.intentionClassifyId"></w-user-buy-classify>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="loadData(1)">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-box">
      <!-- 操作按钮 -->
      <el-row :gutter="10" class="mb8">
        <right-toolbar :showSearch.sync="showSearch" @queryTable="loadData"></right-toolbar>
      </el-row>
      <el-table
        v-loading="loading"
        :data="dataSource"
        :row-key="rowKey"
        align="center"
        @selection-change="handleSelectionChange"
      >
        <el-table-column label="编号" prop="id" min-width="60" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="用户昵称" prop="appUserName" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="账号" prop="appUserNum" min-width="100" :show-overflow-tooltip="true" />
        <el-table-column
          label="购买意向分类"
          prop="intentionClassifyName"
          min-width="100"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="留言" prop="content" min-width="200" :show-overflow-tooltip="true" />
        <el-table-column label="联系方式" prop="phone" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="反馈时间" prop="createTime" min-width="120" :show-overflow-tooltip="true">
          <template slot-scope="{ row }">
            {{ row.createTime }}
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" min-width="100" :show-overflow-tooltip="true">
          <template slot-scope="{ row }">
            <el-tag v-if="row.status == 0" type="danger">待处理</el-tag>
            <el-tag v-if="row.status == 1" type="primary">已处理</el-tag>
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
            <el-button size="mini" type="text" icon="el-icon-document" @click="handleDetail(scope.row)">详情</el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row.id, '删除', 'id')"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        :ipagination="ipagination"
        @pagination="getUserBuyIntentionList"
      />
    </div>
    <rewrite-modal ref="modalForm" @OK="modelOK"></rewrite-modal>
  </div>
</template>

<script>
import { ListMixin } from '@/mixins/wtrfyListMixin'
import rewriteModal from './rewriteModal.vue'
import { getUserBuyIntentionList, getUserBuyIntentionDetele } from '@/api/platform'
export default {
  name: '',
  mixins: [ListMixin],
  components: { rewriteModal },
  props: {},
  data() {
    return {
      url: {
        list: getUserBuyIntentionList,
        delete: getUserBuyIntentionDetele,
      },
      rowKey: 'id',
      statusOptions: [
        {
          label: '待处理',
          value: '0',
        },
        {
          label: '已处理',
          value: '1',
        },
      ],
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    getUserBuyIntentionList,
  },
}
</script>

<style scoped lang="scss">
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
