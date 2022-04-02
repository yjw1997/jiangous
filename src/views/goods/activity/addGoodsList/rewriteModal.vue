<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="800px">
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-form-item label="秒杀时间段名称" prop="timeName">
        <el-input v-model="form.timeName" placeholder="请输入名称" show-word-limit maxlength="60" />
      </el-form-item>
      <el-form-item label="时间段设置" prop="time">
        <el-time-picker
          v-model="form.beginTime"
          placeholder="起始时间"
          value-format="HH:mm:ss"
          :picker-options="beginTimePickOptions"
        >
        </el-time-picker
        >至
        <el-time-picker
          v-model="form.endTime"
          placeholder="结束时间"
          :picker-options="endTimePickOptions"
          value-format="HH:mm:ss"
        >
        </el-time-picker>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { saveActivityRushPurchaseScheduleByIds } from '@/api/goods'
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      form: {
        timeName: undefined,
        beginTime: undefined,
        endTime: undefined,
      },
      dialogVisible: false,
      title: '',
      flag: 'add',
      rules: {
        timeName: [{ required: true, trigger: 'blur', message: '请输入秒杀时间段名称' }],
        time: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!this.form.beginTime || this.form.beginTime === null) {
                callback(new Error('请输入开始时间'))
                return
              }
              if (!this.form.endTime || this.form.endTime === null) {
                callback(new Error('请输入结束时间'))
                return
              }
              callback()
            },
          },
        ],
      },
    }
  },
  computed: {
    beginTimePickOptions() {
      let _this = this
      if (_this.form.endTime) {
        return { selectableRange: '00:00:00 - ' + _this.form.endTime }
      }
      return { selectableRange: '00:00:00 - 23:59:59' }
    },
    endTimePickOptions() {
      let _this = this
      if (_this.form.beginTime) {
        return { selectableRange: _this.form.beginTime + '- 23:59:59' }
      }
      return { selectableRange: '00:00:00 - 23:59:59' }
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    add() {
      this.flag = 'add'
      this.dialogVisible = true
    },
    async edit(info) {
      this.flag = 'edit'
      this.form = Object.assign(this.form, info)
      this.form.this.dialogVisible = true
    },
    handleSubmit() {
      this.$refs['form'].validate((valid) => {
        if (!valid) return
        let action = saveActivityRushPurchaseScheduleByIds
        this.form.activityId = JSON.parse(decodeURIComponent(this.$route.query.edit)).id
        action(this.form)
          .then((res) => {
            if (res.code === 0) {
              this.$message.success(res.msg || '操作成功')
              this.close()
              this.$emit('OK')
            } else {
              this.$message.warning(res.msg || '服务器错误')
            }
          })
          .then((res) => {})
      })
    },
    close() {
      this.dialogVisible = false
      this.form = { timeName: undefined, beginTime: undefined, endTime: undefined }
    },
  },
}
</script>

<style scoped lang="scss"></style>
