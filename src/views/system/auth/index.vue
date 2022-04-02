<template>
  <div class="dashboard-editor-container">
    <!-- 用户搜索 -->
    <div class="search-box" v-show="showSearch">
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
        <el-form-item label="权限名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入权限名称"
            clearable
            size="small"
            @keyup.enter.native="loadData"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="权限状态" clearable size="small">
            <el-option
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="loadData">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-box">
      <!-- 操作按钮 -->
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" :disabled="loading"
            >新增</el-button
          >
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="loadData"></right-toolbar>
      </el-row>
      <el-table
        v-loading="loading"
        :data="dataList"
        :row-key="rowKey"
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        ref="tree"
      >
        <el-table-column prop="name" label="权限名称" :show-overflow-tooltip="true" width="160"></el-table-column>
        <el-table-column prop="sort" label="排序" width="60"></el-table-column>
        <el-table-column prop="url" label="请求地址"></el-table-column>
        <el-table-column prop="type" label="类型">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type == '1'">目录</el-tag>
            <el-tag v-else-if="scope.row.type == '2'" type="success">权限</el-tag>
            <el-tag v-else type="warning">按钮</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="hidden" label="可见">
          <template slot-scope="scope">
            <el-tag v-if="!scope.row.hidden">显示</el-tag>
            <el-tag v-else type="danger">隐藏</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="authorityCode" label="权限标识">
          <template slot-scope="scope">
            <span v-if="scope.row.authorityCode">{{ scope.row.authorityCode }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope" v-if="scope.row.parentId !== '0'">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row.id, 'id')"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <rewrite-modal ref="modalForm" @OK="modelOK" :dataSource="dataSource"></rewrite-modal>
  </div>
</template>

<script>
// function normalizer(tree) {
//   tree.forEach((item) => {
//     console.log('%c [ item ]', 'font-size:13px; background:pink; color:#bf2c9f;', item)
//     if (item.children && !item.children.length) {
//       delete item.children
//     }
//     if (item.children && item.children.length) {
//       item.children.forEach((child) => {
//         let code = item.code === 'NONE' ? '' : item.code
//         let parentCode = item.parentCode === 'NONE' ? '' : item.parentCode + ','

//         child.parentCode = parentCode + code === ',' ? 'NONE' : parentCode + code
//       })
//       normalizer(item.children)
//     }
//   })
//   return tree
// }
import { ListMixin } from '@/mixins/wtrfyListMixin'
import { getTreeData, removeMenu } from '@/api/system/auth'
import rewriteModal from './rewriteModal.vue'
export default {
  mixins: [ListMixin],
  name: '',

  components: { rewriteModal },
  props: {},
  data() {
    return {
      url: {
        list: getTreeData,
        delete: removeMenu,
      },
      // 状态数据字典
      statusOptions: [
        {
          dictLabel: '所有',
          dictValue: undefined,
        },
        {
          dictLabel: '隐藏',
          dictValue: '0',
        },
        {
          dictLabel: '显示',
          dictValue: '1',
        },
      ],
      rowKey: 'id',
    }
  },
  computed: {},
  watch: {},
  created() {},

  methods: {},
}
</script>

<style scoped lang="scss"></style>
