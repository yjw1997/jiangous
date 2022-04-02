<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="800px">
    <el-form ref="form" :model="form" label-width="120px" :rules="rules">
      <el-row>
        <el-col :span="24">
          <el-form-item label="上级菜单">
            <el-cascader
              :options="menuOptions"
              :show-all-levels="false"
              :props="props"
              v-model="form.parentCode"
              clearable
              ref="menu"
            ></el-cascader>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="菜单编码" prop="code">
            <el-input v-model="form.code" placeholder="请输入菜单编码" :disabled="flag === 'edit'" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单类型" prop="type">
            <el-radio-group v-model="form.type">
              <el-radio label="1">目录</el-radio>
              <el-radio label="2">菜单</el-radio>
              <el-radio label="3">按钮</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item v-if="form.type != '3'" label="菜单图标">
            <el-popover placement="bottom-start" width="460" trigger="click" @show="$refs['iconSelect'].reset()">
              <IconSelect ref="iconSelect" @selected="selected" />
              <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>
                <svg-icon
                  v-if="form.icon"
                  slot="prefix"
                  :icon-class="form.icon"
                  class="el-input__icon"
                  style="height: 32px;width: 16px;"
                />
                <i v-else slot="prefix" class="el-icon-search el-input__icon" />
              </el-input>
            </el-popover>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入菜单名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示排序" prop="sort">
            <el-input-number v-model="form.sort" controls-position="right" :min="0" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="打开方式">
            <el-radio-group v-model="form.mode">
              <el-radio label="1"> 新窗口</el-radio>
              <el-radio label="2">页签</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="请求地址" prop="path">
            <el-input v-model="form.route" placeholder="请输入路由地址" :disabled="form.type == '1'" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="权限标识">
            <el-input v-model="form.authorityCode" placeholder="请权限标识" maxlength="50" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单状态">
            <el-radio-group v-model="form.hidden">
              <el-radio v-for="dict in hiddenOptions" :key="dict.dictValue" :label="dict.dictValue">{{
                dict.dictLabel
              }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item v-if="form.type == '1'" label="是否缓存">
            <el-radio-group v-model="form.isCache">
              <el-radio label="0">缓存</el-radio>
              <el-radio label="1">不缓存</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col> -->
      </el-row>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addMenu, writeMenu } from '@/api/system/menu'
import IconSelect from '@/components/IconSelect'
export default {
  name: '',
  components: { IconSelect },
  props: {
    dataSource: {
      type: Array,
    },
  },
  data() {
    return {
      form: {
        id: 0,
        hidden: false,
        icon: '',
        parentCode: 'NONE',
        type: '1',
        name: '',
        authorityCode: '',
        sort: 1,
        mode: '1',
        route: '',
        code: '',
      },
      dialogVisible: false,
      title: '',
      flag: 'add',
      props: {
        checkStrictly: true,
        label: 'name',
        value: 'code',
        emitPath: false,
        children: 'children',
      },
      rules: {
        type: [{ required: true, message: '请选择菜单类型', trigger: 'blur' }],
        code: [{ required: true, message: '请输入菜单编码', trigger: 'blur' }],
        name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
      },
      // 状态数据字典
      hiddenOptions: [
        {
          dictLabel: '显示',
          dictValue: false,
        },
        {
          dictLabel: '隐藏',
          dictValue: true,
        },
      ],
      menuOptions: [],
    }
  },
  computed: {},
  watch: {
    // 'form.type': {
    //   handler(val) {
    //     if (val == 1) {
    //       this.form.route = '#'
    //     }
    //   },
    //   immediate: true,
    // },
  },
  created() {},
  mounted() {},
  methods: {
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      this.menuOptions = []
      const menu = { code: 'NONE', name: '主类目', children: [], parentCodes: 'NONE' }
      menu.children = this.$parent.dataList
      this.menuOptions.push(menu)
    },
    // 选择图标
    selected(name) {
      this.form.icon = name
    },
    add() {
      this.dialogVisible = true
      this.flag = 'add'
      this.getTreeselect()
      this.form = {
        hidden: false,
        id: 0,
        icon: '',
        parentCode: 'NONE',
        parentCodes: 'NONE',
        type: '1',
        name: '',
        authorityCode: '',
        sort: 1,
        mode: '1',
        route: '#',
        code: '',
      }
    },
    edit(info) {
      this.getTreeselect()
      Object.assign(this.form, info)
      this.flag = 'edit'
      console.log('%c [ this.form ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.form)
      this.form.mode = this.form.mode ? this.form.mode.toString() : '1'
      this.form.type = this.form.type ? this.form.type.toString() : '1'
      this.dialogVisible = true
    },
    handleSubmit() {
      this.$refs['form'].validate((valid) => {
        if (!valid) return
        let action = this.flag === 'add' ? addMenu : writeMenu
        console.log('%c [ this.form ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.form)
        this.findParentCode()
        action(this.form).then((res) => {
          if (res.code === 0) {
            this.$message.success(res.msg || '操作成功')
            this.close()
          } else {
            this.$message.warning(res.msg || '服务器错误')
          }
        })
      })
    },
    close() {
      this.dialogVisible = false
      this.form = {
        hidden: false,
        icon: '',
        parentCode: 'NONE',
        type: '1',
        name: '',
        authorityCode: '',
        sort: 1,
        mode: '1',
        route: '#',
        code: '',
      }
      this.$emit('OK')
    },
  },
}
</script>

<style scoped lang="scss"></style>
