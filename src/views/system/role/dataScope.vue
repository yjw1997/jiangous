<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="500px" append-to-body>
    <el-form :model="form" ref="form" label-width="80px">
      <el-form-item label="角色名称">
        <el-input v-model="form.roleName" :disabled="true" />
      </el-form-item>
      <el-form-item label="权限字符">
        <el-input v-model="form.roleKey" :disabled="true" />
      </el-form-item>
      <el-form-item label="权限范围">
        <el-select v-model="form.dataScope" @change="dataScopeSelectChange">
          <el-option
            v-for="item in dataScopeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据权限" v-show="form.dataScope == 2">
        <el-checkbox v-model="deptExpand" @change="handleCheckedTreeExpand($event)">展开/折叠</el-checkbox>
        <el-checkbox v-model="deptNodeAll" @change="handleCheckedTreeNodeAll($event)">全选/全不选</el-checkbox>
        <el-checkbox v-model="form.deptCheckStrictly" @change="handleCheckedTreeConnect($event)">父子联动</el-checkbox>
        <el-tree
          class="tree-border"
          :data="deptOptions"
          show-checkbox
          default-expand-all
          ref="dept"
          node-key="deptId"
          :check-strictly="!form.deptCheckStrictly"
          empty-text="加载中，请稍后"
          :props="defaultProps"
        ></el-tree>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
      <el-button @click="close">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getTreeData } from '@/api/system/dept'
import { authDataScope } from '@/api/system/role'
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      title: '',
      form: { dataScope: '0' },
      dialogVisible: false,
      deptExpand: true,
      deptNodeAll: false,
      deptOptions: [],
      // 数据范围选项
      dataScopeOptions: [
        {
          value: '1',
          label: '全部数据权限',
        },
        {
          value: '2',
          label: '自定数据权限',
        },
        {
          value: '3',
          label: '本部门数据权限',
        },
        {
          value: '4',
          label: '本部门及以下数据权限',
        },
        {
          value: '5',
          label: '仅本人数据权限',
        },
      ],
      defaultProps: {
        children: 'children',
        label: 'deptName',
      },
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    close() {
      this.dialogVisible = false
      this.form = {}
      this.$emit('OK')
    },
    init(info) {
      this.getTree().then(() => {
        this.form = { dataScope: '0' }
        Object.assign(this.form, info)
        console.log('%c [ this.form ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.form)
        if (this.form.dataScope === '2') {
          this.setCheckedKeys(this.form.deptIds)
        }
      })
    },
    getTree() {
      return getTreeData().then((res) => {
        this.deptOptions = res.data
        this.dialogVisible = true
      })
    },
    /** 选择角色权限范围触发 */
    dataScopeSelectChange(value) {
      if (value !== '2') {
        this.$refs.dept.setCheckedKeys([])
      }
    },
    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value) {
      let treeList = this.deptOptions
      for (let i = 0; i < treeList.length; i++) {
        this.$refs.dept.store.nodesMap[treeList[i].deptId].expanded = value
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value) {
      this.$refs.dept.setCheckedNodes(value ? this.deptOptions : [])
    },
    // 树权限（父子联动）
    handleCheckedTreeConnect(value) {
      this.form.deptCheckStrictly = value ? true : false
    },
    handleSubmit() {
      this.$refs['form'].validate((valid) => {
        if (!valid) return
        this.form.deptIds = this.getCheckedNodes()
        console.log('%c [ this.form ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.form)
        authDataScope(this.form).then((res) => {
          if (res.code === 0) {
            this.$message.success(res.msg || '操作成功')
            this.close()
          } else {
            this.$message.warning(res.msg || '服务器错误')
          }
        })
      })
    },
    //获取所有选中的菜单权限
    getCheckedNodes() {
      let nodeKey = this.$refs.dept.getCheckedKeys()
      return nodeKey.join(',')
    },
    //  设置菜单选中权限
    setCheckedKeys(keys) {
      keys = keys.split(',') || []
      this.$refs.dept.setCheckedKeys(keys)
    },
  },
}
</script>

<style scoped lang="scss"></style>
