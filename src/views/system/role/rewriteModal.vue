<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="800px">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入角色名称" />
      </el-form-item>
      <el-form-item label="权限字符" prop="code">
        <el-input v-model="form.code" placeholder="请输入权限字符" :disabled="flag === 'edit'" />
      </el-form-item>
      <!-- <el-form-item label="角色顺序" prop="roleSort">
        <el-input-number v-model="form.roleSort" controls-position="right" :min="0" />
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="form.status">
          <el-radio v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictValue">{{
            dict.dictLabel
          }}</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item label="菜单权限">
        <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event)">展开/折叠</el-checkbox>
        <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event)">全选/全不选</el-checkbox>
        <el-checkbox v-model="form.menuCheckStrictly" @change="handleCheckedTreeConnect($event)">父子联动</el-checkbox>
        <el-tree
          class="tree-border"
          :data="menuOptions"
          show-checkbox
          ref="menu"
          node-key="code"
          :check-strictly="!form.menuCheckStrictly"
          empty-text="加载中，请稍后"
          :props="defaultProps"
        ></el-tree>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addRole, writeRole, getMenuCodes, routeAllocation } from '@/api/system/role'
import { getTreeData } from '@/api/system/auth'
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      form: { name: '', code: '', status: '0', remark: undefined, menuCheckStrictly: true, id: '0', menuIds: [] },
      dialogVisible: false,
      title: '',
      flag: 'add',
      menuExpand: false,
      menuNodeAll: false,
      props: { checkStrictly: true, label: 'deptName', value: 'deptId', emitPath: false },
      // 表单校验
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限字符不能为空', trigger: 'blur' }],
      },
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      /**初始化用户选中的数据权限 */
      nodeKey: [],
      // 菜单列表
      menuOptions: [],
      // 状态数据字典
      statusOptions: [
        {
          dictLabel: '正常',
          dictValue: '0',
        },
        {
          dictLabel: '停用',
          dictValue: '1',
        },
      ],
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async init(data) {
      //  获取菜单列表
      let res = await getTreeData(data)
      this.form.menuIds = []
      this.nodeKey = []
      this.menuOptions = this.handleTree(res.data, 'code', 'parentCode')
      if (this.flag === 'edit') {
        //  初始化获取用户选中的菜单权限
        let nodeKey = (await getMenuCodes({ roleCode: this.form.code })).data
        nodeKey.forEach((item) => {
          this.form.menuIds.push(item.code)
          this.nodeKey.push(item.code)
        })

        console.log(
          '%c [ 初始化获取用户选中的菜单权限 ]',
          'font-size:13px; background:pink; color:#bf2c9f;',
          this.form.menuIds,
        )
      }
      this.dialogVisible = true
    },
    add() {
      this.flag = 'add'
      this.form = { name: '', code: '', status: '0', remark: undefined, menuCheckStrictly: true, id: '0' }
      this.init({ id: 111 }).then(() => {})
    },
    async edit(info) {
      this.flag = 'edit'
      Object.assign(this.form, info)
      await this.init({ id: 111 }).then(() => {
        console.log('%c [ this.form ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.form)
        var _this = this
        this.$nextTick(() => {
          _this.setCheckedKeys(this.form.menuIds || [])
        })
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.roleId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    handleSubmit() {
      this.$refs['form'].validate((valid) => {
        if (!valid) return
        let action = this.flag === 'add' ? addRole : writeRole
        console.log('%c [ this.form ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.form)
        this.form.menuIds = this.getCheckedNodes()
        action(this.form)
          .then((res) => {
            if (res.code === 0) {
              this.$message.success(res.msg || '操作成功')
            } else {
              this.$message.warning(res.msg || '服务器错误')
            }
          })
          .then((res) => {
            console.log('%c [ res ]', 'font-size:13px; background:pink; color:#bf2c9f;', res)
            console.log(this.nodeKey, this.form.menuIds)
            let allocationRouteCodeSet = this.form.menuIds.filter(
              (item) => !this.nodeKey.some((itemB) => itemB === item),
            )
            let cancelRouteCodeSet = this.nodeKey.filter((item) => !this.form.menuIds.some((itemB) => itemB === item))
            let data = {
              allocationRouteCodeSet,
              cancelRouteCodeSet,
              roleCode: this.flag === 'add' ? res.code : this.form.code,
            }
            console.log('%c [ data ]', 'font-size:13px; background:pink; color:#bf2c9f;', data)
            routeAllocation(data).then((res) => {
              if (res.code === 0) {
                this.$message.success(res.msg || '分配菜单成功')
                this.close()
              } else {
                this.$message.warning(res.msg || '服务器错误')
              }
            })
          })
      })
    },
    close() {
      this.dialogVisible = false
      this.form = { name: '', code: '', status: '0', remark: undefined, menuCheckStrictly: true, id: '0' }
      this.$emit('OK')
    },
    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value) {
      let treeList = this.menuOptions
      for (let i = 0; i < treeList.length; i++) {
        this.$refs.menu.store.nodesMap[treeList[i].code].expanded = value
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value) {
      this.$refs.menu.setCheckedNodes(value ? this.menuOptions : [])
    },
    // 树权限（父子联动）
    handleCheckedTreeConnect(value) {
      this.form.menuCheckStrictly = value ? true : false
    },
    //获取所有选中的菜单权限
    getCheckedNodes() {
      this.form.menuIds = this.$refs.menu.getCheckedKeys()
      return this.form.menuIds
    },
    //  设置菜单选中权限
    setCheckedKeys(keys) {
      console.log('%c [ keys ]', 'font-size:13px; background:pink; color:#bf2c9f;', keys)
      if (!keys || keys.length === 0) return
      console.log('%c [ this.$refs.menu ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.$refs.menu)
      this.$refs.menu.setCheckedKeys(keys)
    },
  },
}
</script>

<style scoped lang="scss"></style>
