<template>
  <div class="dashboard-editor-container">
    <!-- 用户搜索 -->
    <div class="search-box" v-show="showSearch">
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-min-width="68px">
        <el-form-item label="通知标题" prop="title">
          <el-input
            v-model="queryParams.title"
            clearable
            size="small"
            style="width: 240px"
            show-word-limit
            maxlength="50"
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
            >新增通知</el-button
          >
          <el-button type="danger" :disabled="loading" plain icon="el-icon-close" size="mini" @click="batchDel()"
            >批量删除</el-button
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
        <el-table-column label="通知标题" prop="titleTx" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="推送对象" prop="title" min-width="100" :show-overflow-tooltip="true">
          <template slot-scope="{ row }">
            <el-tag v-if="row.pushTarget === '0'">用户</el-tag>
            <el-tag v-if="row.pushTarget === '1'">商家</el-tag>
            <span v-if="row.pushTarget == '0,1' || row.pushTarget == '1,0'">
              <el-tag>用户</el-tag>
              <el-tag>商家</el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="消息类型" prop="messageType" min-width="80" :show-overflow-tooltip="true">
          <template slot-scope="{ row }">
            <el-tag v-if="row.messageType == 0">交易物流</el-tag>
            <el-tag v-if="row.messageType == 1">系统消息</el-tag>
            <el-tag v-if="row.messageType == 2">订单通知</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="推送渠道" prop="pushChannel" min-width="100" :show-overflow-tooltip="true">
          <template slot-scope="{ row }">
            <el-tag v-if="row.pushChannel == 0">APP内推送</el-tag>
            <el-tag v-if="row.pushChannel == 1">push推送</el-tag>
            <span v-if="row.pushChannel == '0,1' || row.pushChannel == '1,0'">
              <el-tag>APP内推送</el-tag>
              <el-tag>push推送</el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="通知时间" prop="startTime" min-width="120" :show-overflow-tooltip="true">
          <template slot-scope="{ row }">
            {{ parseTime(row.startTime) }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="消息内容" prop="content" min-width="120" :show-overflow-tooltip="true" /> -->
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          fixed="right"
          min-width="120"
        >
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row.id, '删除', 'ids')"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        :ipagination="ipagination"
        @pagination="getUserMessageList"
      />
    </div>
    <rewrite-modal ref="modalForm" @OK="modelOK"></rewrite-modal>
  </div>
</template>

<script>
import { ListMixin } from '@/mixins/wtrfyListMixin'
import rewriteModal from './rewriteModal.vue'
import { getUserMessageList, getUserMessageDetele } from '@/api/platform'
export default {
  name: '',
  mixins: [ListMixin],
  components: { rewriteModal },
  props: {},
  data() {
    return {
      url: {
        list: getUserMessageList,
        delete: getUserMessageDetele,
        deleteBatch: getUserMessageDetele,
      },
      rowKey: 'id',
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  activated() {
    console.log('%c [ activated ]', 'font-size:13px; background:pink; color:#bf2c9f;', 'activated')
  },
  methods: {
    getUserMessageList,
  },
}
</script>

<style scoped lang="scss"></style>
