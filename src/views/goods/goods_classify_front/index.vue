<template>
  <div class="dashboard-editor-container">
    <div class="content-box">
      <!-- 操作按钮 -->
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="copyBackClassifyCode"
            :disabled="loading"
            >拷贝后台类目</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            :disabled="loading"
            @click="updateIndexClassifyCodeApi"
            >设置首页展示分类</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" :disabled="loading"
            >新增</el-button
          >
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" :showSearchButton="false" @queryTable="loadData"></right-toolbar>
      </el-row>
      <el-table
        v-loading="loading"
        :data="dataList"
        :row-key="rowKey"
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        ref="tree"
      >
        <el-table-column prop="classifyName" label="类目名称" :show-overflow-tooltip="true" min-wihit="160" />
        <el-table-column label="是否启用" prop="status" min-width="80" :show-overflow-tooltip="true">
          <template slot-scope="{ row }">
            <el-switch
              v-model="row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChangeNumber(row, 'status', 'status', updateFrontClassifyStatus)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" :show-overflow-tooltip="true" min-width="160">
          <template slot-scope="{ row }">
            {{ parseTime(row.createTime) }}
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-top"
              @click="handleUp(scope.row)"
              :disabled="scope.$index === 0"
              >上移</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-bottom"
              @click="handleDown(scope.row)"
              :disabled="scope.$index === ipagination.total - 2"
              >下移</el-button
            >
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">设置</el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <rewrite-modal ref="modalForm" @OK="modelOK" :dataList="dataListLevelTwo" :dataSource="dataSource"></rewrite-modal>

    <el-dialog title="首页展示分类" :visible.sync="dialogVisible" width="30%" :before-close="beforeClose">
      <div class="checkBox">
        <el-checkbox-group v-model="checkList" :max="4">
          <el-checkbox :label="item.classifyCode" v-for="item in dataListLevelOne" :key="item.id">{{
            item.classifyName
          }}</el-checkbox>
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { ListMixin } from '@/mixins/wtrfyListMixin'
import {
  queryClassifyTree,
  deleteFrontClassifyCode,
  updateSortGoodsClassifyFront,
  copyBackClassifyCodeApi,
  updateIndexClassifyCodeApi,
  updateFrontClassifyStatus,
} from '@/api/goods'
import rewriteModal from './rewriteModal.vue'
export default {
  mixins: [ListMixin],
  name: '',

  components: { rewriteModal },
  props: {},
  data() {
    return {
      url: {
        list: queryClassifyTree,
        delete: deleteFrontClassifyCode,
      },
      dataListLevelTwo: [],
      dataListLevelOne: [],
      dialogVisible: false,
      checkList: [],

      rowKey: 'id',
      treeData: {
        code: 'classifyCode',
        parentCode: 'parentCode',
      },
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    updateSortGoodsClassifyFront,
    updateFrontClassifyStatus,
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
          let obj = this.cloneDeep(this.dataSource)
          this.dataSource.sort((a, b) => {
            return a.sort - b.sort
          })
          console.log('%c [ this.dataSource ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.dataSource)
          this.dataList = this.handleTree(this.dataSource, this.treeData.code, this.treeData.parentCode)

          let aa = obj.filter((item) => item.level !== 3)
          this.dataListLevelTwo = this.handleTree(aa, this.treeData.code, this.treeData.parentCode)
          this.ipagination.total = res.total || res.data.total || this.dataSource.length + 1
          this.dataListLevelOne = this.cloneDeep(
            this.dataSource.filter((item) => item.level === 1 && item.status === 1),
          )
          // 设置首页展示分类
          let bb = this.dataListLevelOne.filter((item) => item.indexFlag)
          if (bb.length > 0) {
            this.checkList = bb.map((item) => {
              return item.classifyCode
            })
          }
        }
        if (res.code !== 0) {
          this.$message.warning(res.message)
        }
        this.loading = false
      })
    },
    //  拷贝后台类目
    copyBackClassifyCode() {
      this.$confirm(`该操作将导致原设置的前台类目被覆盖，覆盖后无法撤回`, `请确认你的操作行为，你还要继续吗？`, {
        type: 'warning',
      })
        .then(() => {
          copyBackClassifyCodeApi({}).then((res) => {
            this.$message.success(res.messgae || '操作成功')
            this.loadData()
            if(res.code===0) this.checkList =[]
          })
        })
        .catch(() => {})
    },
    //  设置首页分类
    updateIndexClassifyCodeApi() {
      this.dialogVisible = true
    },
    beforeClose() {
      this.dialogVisible = false
      this.checkList = []
    },
    handleSubmit() {
      console.log('%c [ checkList ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.checkList)
      if (this.checkList.length === 0) {
        this.$message.warning('请选择首页展示分类')
        return
      }

      updateIndexClassifyCodeApi({ goodsClassifyCodes: this.checkList.join() }).then((res) => {
        this.$message.success(res.message || '操作成功')
        this.beforeClose()
        this.loadData()
      })
    },
    //  上移
    handleUp(row) {
      row.type = 0
      updateSortGoodsClassifyFront(row).then((res) => {
        const { code, message } = res
        if (code === 0) {
          this.$message.success(message || '操作成功')

          this.loadData()
        }
      })
    },
    // 下移
    handleDown(row) {
      row.type = 1
      updateSortGoodsClassifyFront(row).then((res) => {
        const { code, message } = res
        if (code === 0) {
          this.$message.success(message || '操作成功')

          this.loadData()
        }
      })
    },
  },
}
</script>

<style scoped lang="scss"></style>
