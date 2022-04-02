<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="800px">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户名称" prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名称" />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="归属部门" prop="deptId">
            <el-cascader
              :options="depTreeOptions"
              :show-all-levels="false"
              :props="props"
              v-model="form.deptId"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-col> -->
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="form.mobile" placeholder="请输入手机号码" maxlength="11" />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
          </el-form-item>
        </el-col>-->
      </el-row>
      <el-row>
        <!-- <el-col :span="12">
          <el-form-item label="登录名称" prop="username">
            <el-input v-model="form.username" placeholder="请输入登录名称" :disabled="form.userId !== undefined" />
          </el-form-item>
        </el-col> -->
        <el-col :span="12">
          <el-form-item v-if="form.userId == undefined" label="登录密码" prop="password">
            <el-input v-model="form.password" placeholder="请输入登录密码" type="password" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <!-- <el-col :span="12">
          <el-form-item label="用户性别">
            <el-select v-model="form.sex" placeholder="请选择">
              <el-option
                v-for="dict in sexOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
        <!-- <el-col :span="12">
          <el-form-item label="状态">
            <el-radio-group v-model="form.status">
              <el-radio v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictValue">{{
                dict.dictLabel
              }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col> -->
      </el-row>
      <el-row>
        <!-- <el-col :span="24">
          <el-form-item label="岗位">
            <el-checkbox-group v-model="form.postIds">
              <el-checkbox :label="item.postId" v-for="item in postOptions" :key="item.postId">{{
                item.postName
              }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col> -->
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="角色">
            <el-checkbox-group v-model="form.roleIds">
              <el-checkbox v-for="item in roleOptions" :key="item.code" :label="item.code">{{ item.name }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addUser, writeUser, getRoleId, roleAllocation } from '@/api/system/user'
import { isNumberStr, isPhone, isEmail, isAmericaPhone } from '@/utils/validate'
// import { getTreeData } from '@/api/system/dept'
// import { getPostList } from '@/api/system/post'
import { getRoleList } from '@/api/system/role'
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      form: { status: '0', mobile: '0', roleIds: [], sex: '0', username: '', password: '', remark: '', id: '0' },
      dialogVisible: false,
      title: '',
      flag: 'add',
      depTreeOptions: [],
      postOptions: [],
      roleOptions: [],
      /**全部角色数组 */
      role: [],
      /***初始化用户拥有的角色 */
      roleIds: [],
      // 性别状态字典
      sexOptions: [
        {
          dictLabel: '男',
          dictValue: '0',
        },
        {
          dictLabel: '女',
          dictValue: '1',
        },
      ],
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
      props: { checkStrictly: true, label: 'deptName', value: 'deptId', emitPath: false },
      rules: {
        username: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
        deptId: [{ required: true, message: '请选择归属部门', trigger: 'blur' }],
        mobile: [
          {
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('请输入正确格式手机号'))
                return
              }
              let res = isAmericaPhone(value) || isPhone(value)
              res ? callback() : callback(new Error('请输入正确格式手机号'))
            },
          },
        ],
        email: [
          {
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              isEmail(value) ? callback() : callback(new Error('请正确格式邮箱'))
            },
          },
        ],

        password: [{ required: true, message: '请输入登录密码', trigger: 'blur' }],
      },
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async gettTree() {
      // this.depTreeOptions = (await getTreeData()).data
      // this.postOptions = (await getPostList()).rows
      this.form.roleIds = []
      this.roleIds = []
      this.roleOptions = (await getRoleList({ pageSizes: 99999 })).data
      if (this.flag === 'edit' && this.form.id) {
        this.role = (await getRoleId({ userId: this.form.id })).data
        console.log('%c [ this.role  ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.role)
      }
      this.dialogVisible = true
    },
    async add() {
      this.flag = 'add'
      await this.gettTree()

      this.form = { status: '0', mobile: '', roleIds: [], sex: '0', username: '', password: '', remark: '', id: '0' }
    },
    async edit(info) {
      this.flag = 'edit'
      this.form = Object.assign(this.form, info)
      await this.gettTree().then(() => {
        this.role.forEach((item) => {
          this.form.roleIds.push(item.code)
          this.roleIds.push(item.code)
        })
        console.log('%c [ roleIds ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.roleIds)
      })
    },
    handleSubmit() {
      this.$refs['form'].validate((valid) => {
        if (!valid) return
        let action = this.flag === 'add' ? addUser : writeUser
        // this.form.roleIds = this.form.roleIds && this.form.roleIds.length !== 0 ? this.form.roleIds.join(',') : ''
        console.log('%c [ this.form ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.form)
        action(this.form)
          .then((res) => {
            if (res.code === 0) {
              this.$message.success(res.msg || '修改用户信息成功')

              // this.close()
              return res.data
            } else {
              this.$message.warning(res.msg || '服务器错误')
            }
          })
          .then((res) => {
            console.log(this.roleIds, this.form.roleIds)
            let allocationRoleCodeSet = this.form.roleIds.filter(
              (item) => !this.roleIds.some((itemB) => itemB === item),
            )
            let cancelRoleCodeSet = this.roleIds.filter((item) => !this.form.roleIds.some((itemB) => itemB === item))
            let data = {
              allocationRoleCodeSet,
              cancelRoleCodeSet,
              userId: this.flag === 'add' ? res.id : this.form.id,
            }
            console.log('%c [ data ]', 'font-size:13px; background:pink; color:#bf2c9f;', data)
            roleAllocation(data).then((res) => {
              if (res.code === 0) {
                this.$message.success(res.msg || '修改角色成功')
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
      this.form = { status: '0', mobile: '0', roleIds: [], sex: '0', username: '', password: '', remark: '', id: '0' }
      this.$emit('OK')
    },
  },
}
</script>

<style scoped lang="scss"></style>
