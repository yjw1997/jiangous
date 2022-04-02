<template>
  <div class="dashboard-editor-container">
    <!-- 用户搜索 -->
    <div class="search-box" v-show="showSearch">
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-min-width="68px">
        <el-form-item label="广告名称" prop="name">
          <el-input
            v-model="queryParams.name"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="loadData(1)"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="loadData(1)">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery({ bannerType: 1 })">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-box">
      <!-- 操作按钮 -->
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" :disabled="loading" plain icon="el-icon-plus" size="mini" @click="handleAdd"
            >新增广告</el-button
          >
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="loadData"></right-toolbar>
      </el-row>
      <el-table
        v-loading="loading"
        :data="dataSource"
        :row-key="rowKey"
        align="center"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="编号" prop="id" min-width="60" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="图片" prop="bannerPic" min-width="80" :show-overflow-tooltip="true">
          <template slot-scope="{ row }">
            <image-upload-modal v-model="row.bannerPic" :limit="1" disabled v-if="row.bannerPic"></image-upload-modal>
          </template>
        </el-table-column>
        <el-table-column label="广告名称" prop="name" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="所属分类" prop="goodsClassifyName" min-width="120" :show-overflow-tooltip="true">
          <template slot-scope="{ row }">
            <div v-if="row.classifyDelFlag === 1">
              <div style="color: #FD7C25">该分类已删除</div>
              <div><el-button type="text" @click="handleResetSelcet(row)">重新选择</el-button></div>
            </div>
            <div v-else-if="row.classifyDelFlag === 2">
              <div>{{ row.goodsClassifyName }}</div>
              <div style="color: #FD7C25">该分类已停用</div>
            </div>
            <div v-else>{{ row.goodsClassifyName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="展示时间段" prop="showTime" min-width="200" :show-overflow-tooltip="true">
          <template slot-scope="{ row }">
            {{ `${parseTime(row.showBeginTime)} ~  ${parseTime(row.showEndTime)}` }}
          </template>
        </el-table-column>
        <el-table-column label="是否展示" align="center" prop="showFlag">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.showFlag"
              :active-value="true"
              :inactive-value="false"
              @change="handleStatusBoolenChange(scope.row, 'showFlag', 'showFlag', getBannerUpdate)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          fixed="right"
          min-width="225"
        >
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-top" @click="handleUp(scope.row)">上移</el-button>
            <el-button size="mini" type="text" icon="el-icon-bottom" @click="handleDown(scope.row)">下移</el-button>
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
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
        @pagination="loadData"
      />
    </div>
    <home-rewrite-modal ref="modalForm" @OK="modelOK" :bannerType="queryParams.bannerType"></home-rewrite-modal>
  </div>
</template>

<script>
import { ListMixin } from '@/mixins/wtrfyListMixin'
import { getBannerGetPageList, getBannerUpdate, getBannerSortBanner, getBannerDetele } from '@/api/platform'
import homeRewriteModal from './homeRewriteModal.vue'
export default {
  name: '',
  mixins: [ListMixin],
  components: { homeRewriteModal },
  props: {
    activeName: {
      type: String,
      require: true,
      default: 'tab-0',
    },
  },
  data() {
    return {
      url: {
        list: getBannerGetPageList,
        delete: getBannerDetele,
      },
      rowKey: 'id',
      disableMixinCreated: true,
    }
  },
  computed: {},
  watch: {
    activeName() {
      if (this.activeName === 'tab-1') {
        this.queryParams.bannerType = Number(this.activeName.replace('tab-', ''))
        this.loadData()
      }
    },
  },
  created() {},
  mounted() {},
  methods: {
    getBannerUpdate,
    //  上移
    handleUp(row) {
      row.upDown = '1'
      getBannerSortBanner(row)
        .then((res) => {
          const { code, message } = res
          if (code === 0) {
            this.$message.success(message || '操作成功')

            this.loadData()
          }
        })
        .catch((err) => {
          this.$message.error(err.message || '服务器错误')
        })
    },
    // 下移
    handleDown(row) {
      row.upDown = '2'
      getBannerSortBanner(row)
        .then((res) => {
          const { code, message } = res
          if (code === 0) {
            this.$message.success(message || '操作成功')

            this.loadData()
          }
        })
        .catch((err) => {
          this.$message.error(err.message || '服务器错误')
        })
    },
    //  重新选择
    handleResetSelcet(row) {
      this.handleEdit(row)
    },
  },
}
</script>

<style scoped lang="scss">
::v-deep .cell .el-upload-list__item {
  width: 55px !important;
  height: 55px !important;
}
</style>
