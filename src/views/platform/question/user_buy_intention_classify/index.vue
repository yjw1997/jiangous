<template>
  <div class="dashboard-editor-container">
    <!-- 用户搜索 -->
    <div class="search-box" v-show="showSearch">
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-min-width="68px">
        <el-form-item label="分类名称" prop="intentionClassifyName">
          <el-input
            v-model="queryParams.intentionClassifyName"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="loadData(1)"
          />
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
        <el-col :span="1.5">
          <el-button type="primary" :disabled="loading" plain icon="el-icon-plus" size="mini" @click="handleAdd"
            >新增分类</el-button
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
        <el-table-column label="编号" prop="id" min-width="60" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="分类名称" min-width="200px" :show-overflow-tooltip="true">
          <template slot-scope="{ row }">
            <template v-if="row.edit">
              <el-input
                v-model="row.intentionClassifyName"
                class="edit-input"
                size="small"
                maxlength="20"
                show-word-limit
              />
              <el-button class="cancel-btn" size="small" icon="el-icon-refresh" type="warning" @click="cancelEdit(row)">
                cancel
              </el-button>
            </template>
            <span v-else>{{ row.intentionClassifyName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          fixed="right"
          min-width="120"
        >
          <template slot-scope="{ row }">
            <el-button
              v-if="row.edit"
              type="success"
              size="small"
              icon="el-icon-circle-check-outline"
              @click="confirmEdit(row)"
            >
              Ok
            </el-button>
            <el-button v-else type="text" size="small" icon="el-icon-edit" @click="row.edit = !row.edit">
              修改名称
            </el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(row.id, '删除', 'id')"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        :ipagination="ipagination"
        @pagination="getUserBuyIntentionClassifyList"
      />
    </div>
    <rewrite-modal ref="modalForm" @OK="modelOK" :dataSource="dataSource"></rewrite-modal>
  </div>
</template>

<script>
import { ListMixin } from '@/mixins/wtrfyListMixin'
import rewriteModal from './rewriteModal.vue'
import {
  getUserBuyIntentionClassifyList,
  getUserBuyIntentionClassifyEdit,
  getUserBuyIntentionClassifyDetele,
} from '@/api/platform'
import { validateName } from '@/utils/validate.js'
export default {
  name: '',
  mixins: [ListMixin],
  components: { rewriteModal },
  props: {},
  data() {
    return {
      url: {
        list: getUserBuyIntentionClassifyList,
        delete: getUserBuyIntentionClassifyDetele,
      },
      rowKey: 'id',
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    getUserBuyIntentionClassifyList,
    //  分页查询
    loadData(arg) {
      if (!this.url || !this.url.list) {
        this.$message.error('请设置url.list属性!')
        return
      }
      let getAction = this.url.list
      // 加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1
      }
      var params = this.getQueryParams() // 查询条件
      this.loading = true
      return getAction(params).then((res) => {
        if (res.code === 0) {
          this.dataSource = res.data.records || res.data
          this.dataSource = this.dataSource.map((v) => {
            this.$set(v, 'edit', false)
            v.originalName = v.intentionClassifyName
            return v
          })
          this.queryParams.total = res.data.total
          this.loading = false
          this.ipagination.total = res.total || res.data.total || this.dataSource.length + 1
        }
        if (res.code !== 0) {
          this.$message.warning(res.message)
        }
        this.loading = false
      })
    },
    //  重置
    cancelEdit(row) {
      row.intentionClassifyName = row.originalName
      row.edit = false
      // this.$message({
      //   message: '名称已重置',
      //   type: 'warning',
      // })
    },
    // 编辑渠道名称
    confirmEdit(row) {
      let res = validateName(row.intentionClassifyName, 2, 40)
      if (!res) {
        this.$message.warning('请输入1-20个汉字(2-40字符).')
        return
      }

      //  分类名不重复
      let resName = this.dataSource.filter((item) => item.intentionClassifyName === row.intentionClassifyName)
      if (resName.length > 1) {
        this.$message.warning('请不要输入重复的分类名')
        return
      }
      row.edit = false
      if (row.intentionClassifyName === row.originalName) return
      row.originalName = row.intentionClassifyName
      getUserBuyIntentionClassifyEdit(row).then((res) => {
        const { code } = res
        if (code === 0) {
          this.$message({
            message: '分类名称修改成功',
            type: 'success',
          })
        } else {
          this.$message({
            message: '服务器错误',
            type: 'warning',
          })
        }
        this.loadData()
      })
    },
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
