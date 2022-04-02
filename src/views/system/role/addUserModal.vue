<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="1000px">
    <div class="dashboard-editor-container">
      <!-- 用户搜索 -->
      <div class="search-box">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
          <el-form-item label="用户名称" prop="username">
            <el-input
              v-model="queryParams.username"
              placeholder="请输入用户名称"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="loadData"
            />
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input
              v-model="queryParams.mobile"
              placeholder="请输入手机号码"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="loadData"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="loadData">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="content-box">
        <el-table v-loading="loading" :data="dataSource" @select="handleSelectionChange" row-key="rowKey">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column
            label="登录名称"
            align="center"
            key="username"
            prop="username"
            :show-overflow-tooltip="true"
          />
          <!-- <el-table-column
            label="用户名称"
            align="center"
            key="userName"
            prop="userName"
            :show-overflow-tooltip="true"
          />

          <el-table-column label="邮箱" align="center" key="email" prop="dept.email" :show-overflow-tooltip="true" /> -->
          <el-table-column label="手机号码" align="center" key="mobile" prop="mobile" width="120" />
          <!-- <el-table-column label="状态" align="center" key="status"> 
          <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="0"
                inactive-value="1"
                @change="handleStatusChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column> -->
          <el-table-column label="创建时间" align="center" prop="createTime" width="160">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
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
    <span slot="footer" class="dialog-footer">
      <el-button @click="close()">取 消</el-button>
      <el-button type="primary" @click="handleSubmit()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { ListMixin } from '@/mixins/wtrfyListMixin'
import { getUserList } from '@/api/system/user'
import { userAllocation } from '@/api/system/role'
export default {
  name: '',
  mixins: [ListMixin],
  components: {},
  props: {},
  data() {
    return {
      url: {
        list: getUserList,
      },
      disableMixinCreated: false,
      title: '添加用户',
      dialogVisible: false,
      //  用户表格唯一标识
      rowKey: 'id',
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    init(code) {
      this.dialogVisible = true
      this.code = code
      console.log('%c [ code ]', 'font-size:13px; background:pink; color:#bf2c9f;', code)
    },
    handleSubmit() {
      if (!this.selectedRowKeys.toString()) {
        this.$message.info('请选择你要添加的用户')
        return
      }
      console.log(
        '%c [ this.selectedRowKeys ]',
        'font-size:13px; background:pink; color:#bf2c9f;',
        this.selectedRowKeys,
      )

      let jsonData = {
        allocationUserIdSet: this.selectedRowKeys,
        cancelUserIdSet: [],
        roleCode: this.$route.params.code,
      }
      userAllocation(jsonData)
        .then((res) => {
          this.$message.success(res.msg || '操作成功')
          this.close()
          this.$emit('OK')
        })
        .catch((res) => {
          this.$message.error(res.msg || '服务器错误')
          this.close()
        })
    },
    close() {
      //  表单重置
      this.onClearSelected()
      this.dialogVisible = false
    },
  },
}
</script>

<style scoped lang="scss">
.dialog-footer {
  text-align: center;
}
</style>
