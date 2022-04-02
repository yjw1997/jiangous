<template>
  <div class="box" :class="showTree ? 'hasTree' : ''">
    <div class="left-dep">
      <!--问题分类-->
      <div class="head-container">
        <div>问题分类</div>
        <div class="tooltip">
          <el-tooltip class="item" effect="dark" content="修改" placement="bottom">
            <i class="el-icon-edit-outline" @click="handleClassifyEdit"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
            <i class="el-icon-delete" @click="handleClassifyDelete"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="新增" placement="bottom">
            <i class="el-icon-circle-plus-outline" @click="handleClassifyAdd"></i>
          </el-tooltip>
        </div>
      </div>
      <div class="classifyList">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <div class="title"><i class="el-icon-collection-tag"></i>用户端</div>
          <draggable v-model="userClassifyList" draggable=".item" @end="handleClassifyChange(userClassifyList)">
            <div
              v-for="item in userClassifyList"
              @click.stop="changeQueryId(item.id)"
              :class="active === item.id ? 'active' : ''"
              :key="item.id"
              class="item"
            >
              <div class="content"><i class="el-icon-price-tag" /> {{ item.questionClassifyName }}</div>
              <div>
                <el-switch
                  v-model="item.status"
                  :active-value="true"
                  :inactive-value="false"
                  @change="handleStatusBoolenChange(item, 'status', 'status', queryQuestionClassifyEdit)"
                ></el-switch>
              </div>
            </div>
          </draggable>
          <el-divider />
          <div class="title"><i class="el-icon-collection-tag"></i>商家端</div>
          <draggable v-model="shopsClassifyList" draggable=".item" @end="handleClassifyChange(shopsClassifyList)">
            <div
              v-for="item in shopsClassifyList"
              @click.stop="changeQueryId(item.id)"
              :class="active === item.id ? 'active' : ''"
              :key="item.id"
              class="item"
            >
              <div><i class="el-icon-price-tag" /> {{ item.questionClassifyName }}</div>
              <div>
                <el-switch
                  v-model="item.status"
                  :active-value="true"
                  :inactive-value="false"
                  @change="handleStatusBoolenChange(item, 'status', 'status', queryQuestionClassifyEdit)"
                ></el-switch>
              </div>
            </div>
          </draggable>
        </el-scrollbar>
      </div>
      <div class="button" @click="showTree = !showTree">
        <i :class="showTree ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left'"></i>
      </div>
    </div>
    <!--用户数据-->
    <div class=" right-user  dashboard-editor-container">
      <div class="search-box" v-show="showSearch">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
          <el-form-item label="问题标题" prop="title">
            <el-input
              v-model="queryParams.title"
              placeholder="请输入问题标题"
              clearable
              size="small"
              style="width: 300px"
              maxlength="16"
              show-word-limit
              @keyup.enter.native="loadData"
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="loadData">搜索</el-button>
            <el-button
              icon="el-icon-refresh"
              size="mini"
              @click="resetQuery({ questionClassifyId: queryParams.questionClassifyId })"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <div class="content-box">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
          </el-col>

          <right-toolbar :showSearch.sync="showSearch" @queryTable="loadData"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="dataSource" @select="handleSelectionChange" row-key="rowKey">
          <el-table-column label="编号" prop="id" min-width="60" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="标题" align="center" key="title" prop="title" :show-overflow-tooltip="true" />
          <el-table-column
            label="问题分类"
            align="center"
            key="questionClassifyName"
            prop="questionClassifyName"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="是否显示" align="center" prop="showFlag">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                :active-value="true"
                :inactive-value="false"
                @change="handleStatusBoolenChange(scope.row, 'status', 'status', queryQuestionEdit)"
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
              <el-button size="mini" type="text" icon="el-icon-top" @click="handleUp(scope.row, '1')">上移</el-button>
              <el-button size="mini" type="text" icon="el-icon-bottom" @click="handleDown(scope.row, '2')"
                >下移</el-button
              >
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row.id, '删除', 'id')"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <rewrite-modal ref="modalForm" @OK="modelOK"></rewrite-modal>
    <classify-rewrite-modal ref="classifyModalForm" @OK="classifyModelOK"></classify-rewrite-modal>
  </div>
</template>

<script>
import { ListMixin } from '@/mixins/wtrfyListMixin'
import {
  getQuestionClassifyList,
  queryQuestionList,
  queryQuestionEdit,
  queryQuestionClassifyEdit,
  queryQuestionDelete,
  queryQuestionSortQuestion,
  queryQuestionClassifySort,
  queryQuestionClassifyDetele,
} from '@/api/platform'
import rewriteModal from './rewriteModal.vue'
import classifyRewriteModal from './classifyRewriteModal.vue'
import draggable from 'vuedraggable'
export default {
  name: '',
  mixins: [ListMixin],
  props: {},
  components: { draggable, rewriteModal, classifyRewriteModal },
  data() {
    return {
      url: {
        list: queryQuestionList,
        delete: queryQuestionDelete,
      },
      classifyOptions: [],
      treeLoading: false,
      showTree: false,
      dateRange: [],
      disableMixinCreated: true,
      active: '',
      //  用户表格唯一标识
      rowKey: 'userId',
      userClassifyList: [],
      shopsClassifyList: [],
    }
  },
  computed: {
    activeList() {
      return this.classifyOptions.filter((item) => item.id === this.active)[0]
    },
  },
  watch: {
    expandAll(val) {
      this.setAllExpand(val)
    },
    dateRange(val) {
      if (!val || val === null) {
        this.queryParams.beginTime = ''
        this.queryParams.endTime = ''
        return
      }
      this.queryParams.beginTime = val[0]
      this.queryParams.endTime = val[1]
    },
  },
  created() {},
  mounted() {
    this.getTree().then(() => {
      this.checkDefault()
    })
  },
  methods: {
    queryQuestionEdit,
    queryQuestionClassifyEdit,
    checkDefault() {
      //  默认选中第一个
      if (this.userClassifyList.length > 0) {
        this.active = this.userClassifyList[0].id
        this.queryParams.questionClassifyId = this.userClassifyList[0].id
      } else if (this.shopsClassifyList.length > 0) {
        this.active = this.shopsClassifyList[0].id
        this.queryParams.questionClassifyId = this.shopsClassifyList[0].id
      }
      this.loadData(1)
    },
    //  获取部门数据
    getTree() {
      this.classifyOptions = []
      this.treeLoading = true
      return getQuestionClassifyList({}).then((res) => {
        this.treeLoading = false
        this.expandAll = true
        const { data } = res
        this.classifyOptions = data
        this.userClassifyList = this.classifyOptions
          .filter((item) => !item.platformType)
          .sort((a, b) => {
            return a.sort - b.sort
          })
        this.shopsClassifyList = this.classifyOptions
          .filter((item) => item.platformType)
          .sort((a, b) => {
            return a.sort - b.sort
          })
      })
    },
    changeQueryId(id) {
      this.active = id
      this.queryParams.questionClassifyId = id
      this.loadData()
    },

    //  上移
    handleUp(row) {
      row.upDown = '1'
      queryQuestionSortQuestion(row).then((res) => {
        const { code, message } = res
        if (code === 0) {
          this.$message.success(message || '操作成功')

          this.loadData()
        }
      })
    },
    // 下移
    handleDown(row) {
      row.upDown = '2'
      queryQuestionSortQuestion(row).then((res) => {
        const { code, message } = res
        if (code === 0) {
          this.$message.success(message || '操作成功')
          this.loadData()
        }
      })
    },
    //  拖拽分类
    handleClassifyChange(item) {
      queryQuestionClassifySort(item).then(() => {
        this.getTree()
      })
    },
    //修改分类
    handleClassifyEdit() {
      if (this.activeList === null || !this.activeList) return
      this.$refs.classifyModalForm.title = '编辑'
      this.$refs.classifyModalForm.disableSubmit = false
      this.$refs.classifyModalForm.edit(this.activeList)
    },

    //  删除分类
    handleClassifyDelete() {
      if (this.activeList === null || !this.activeList) return
      this.$confirm(`是否删除选中数据?`, `确认删除`)
        .then(() => {
          queryQuestionClassifyDetele(this.activeList)
            .then((res) => {
              if (res.code === 0) {
                this.$message.success(res.msg || '删除成功')
                this.getTree().then(() => {
                  this.checkDefault()
                })
              } else {
                this.$message.warning(res.msg || res.message || '未知错误')
              }
            })
            .finally(() => {
              this.loading = false
            })
        })
        .catch(() => {})
    },
    classifyModelOK() {
      this.getTree()
    },
    //  列表新增
    handleAdd: function() {
      this.$refs.modalForm.title = '新增'
      this.$refs.modalForm.disableSubmit = false
      this.$refs.modalForm.add({ questionClassifyId: this.active })
    },
    //分类新增
    handleClassifyAdd() {
      this.$refs.classifyModalForm.title = '新增'
      this.$refs.classifyModalForm.disableSubmit = false
      this.$refs.classifyModalForm.add()
    },

    //  获取查询条件
    getQueryParams() {
      let param = Object.assign({}, this.queryParams)
      return param
    },
  },
}
</script>

<style scoped lang="scss">
.box {
  width: 100%;
  height: 100%;
  display: flex;
  .left-dep {
    width: 300px;
    transition: width 0.28s;
    background-color: #fff;
    padding-top: 10px;
    position: relative;
    .head-container {
      display: flex;
      justify-content: space-between;
      padding: 10px 20px;
      .tooltip {
        i {
          margin-left: 8px;
        }
      }
      border-bottom: 1px solid #eee;
    }
    .el-tree {
      padding: 0 10px;
    }
    .button {
      position: absolute;
      right: -16px;
      top: 200px;
      margin-top: 20px;
      z-index: 3;
      height: 40px;
      background-color: #fff;
      line-height: 40px;
      &:hover {
        background-color: rgba(0, 0, 0, 0.025);
      }
    }
  }
  .right-user {
    width: calc(100% - 220px);
  }
}

.hasTree {
  .left-dep {
    width: 0;
    transition: width 0.28s;
    .head-container,
    .classifyList {
      display: none;
    }
  }

  .right-user {
    width: 100%;
  }
}
.classifyList {
  width: 100%;
  padding: 20px;
  font-size: 16px;
  .title {
    font-size: 18px;
  }
  .item {
    padding: 10px 10px;
    margin: 10px 0 10px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .content {
    white-space: nowrap;
  }
  .active {
    font-size: 16px;
    background-color: #eff5ff;
    border-radius: 10px;
    overflow: hidden;
  }
}
</style>
