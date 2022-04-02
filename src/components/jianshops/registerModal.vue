<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="500px"
    destroy-on-close
    :before-close="close"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      :disabled="disableSubmit"
      status-icon
    >
      <el-row :span="24">
        <el-col :span="24">
          <el-form-item prop="phone">
            <el-input
              v-model="form.phone"
              type="text"
              auto-complete="off"
              placeholder="请输入注册手机号码"
            >
              <svg-icon
                slot="prefix"
                icon-class="phone"
                class="el-input__icon input-icon"
              />
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="validateCode">
            <el-input
              v-model="form.validateCode"
              auto-complete="off"
              placeholder="验证码"
              style="width: 63%"
              @keyup.enter.native="handleLogin"
            >
              <svg-icon
                slot="prefix"
                icon-class="yzm"
                class="el-input__icon input-icon"
              />
            </el-input>
            <div style="width:34%;display: inline-block;margin-left:10px">
              <el-button
                type="primary"
                :loading="loadingVerificationCode"
                @click="sendVerification"
                :disabled="isDisabled"
                >{{ buttonName }}</el-button
              >
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item>
            密码默认：admin666
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer" v-if="!disableSubmit">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="handleSubmit()" :loading="loading">{{
        !loading ? "确 定" : "等待中"
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { registerAppUser, sendVerificationCode } from "@/api/user";
import { isAmericaPhone, isPhone } from "@/utils/validate";
import $C from "@/utils/config.js";
export default {
  name: "",
  components: {},
  props: {},
  data() {
    return {
      form: {
        phone: undefined,
        validateCode: undefined,
      },
      buttonName: "发送验证码",
      isDisabled: false,
      time: 60,
      dialogVisible: false,
      disableSubmit: false,
      title: "",
      flag: "",
      loading: false,
      loadingVerificationCode: false,
      timer:undefined,
      // 表单校验
      rules: {
        phone: [
          {
            required: true,
            trigger: "change",
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("请输入正确格式手机号"));
                return;
              }
              let res = isAmericaPhone(value) || isPhone(value);
              res ? callback() : callback(new Error("请输入正确格式手机号"));
            },
          },
        ],
        validateCode: [
          { required: true, message: "请输入验证码", trigger: "blur" },
        ],
      },
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    add() {
      this.flag = "add";
      this.dialogVisible = true;
    },
    edit(info) {
      Object.assign(this.form, info);
      this.flag = "edit";
      this.dialogVisible = true;
    },
    handleSubmit() {
      this.$refs["form"].validate((valid) => {
        if (!valid) return;
        this.loading = true;
        let action = registerAppUser;
        action(this.form)
          .then((res) => {
            if (res.code === 0) {
              this.$message.success(res.msg || "操作成功");
              this.$emit("OK");
              this.close();
            } else {
              this.$message.warning(res.msg || "服务器错误");
              this.close();
            }
          })
          .catch((err) => {
            const { message } = err;
            this.$message.danger(message || "手机号有误或者后台错误");
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    sendVerification() {
      if (!this.form.phone) {
        this.$message.warning("请输入手机号");
        return;
      }
      let date =
        "GMT" + (0 - new Date().getTimezoneOffset() / 60) > 0
          ? "+" + (0 - new Date().getTimezoneOffset() / 60)
          : 0 - new Date().getTimezoneOffset() / 60;

      let obj = {
        areaCode: date === "GMT+8" ? "+86" : "+1",
        target: this.form.phone,
        code: $C.smsTemplateCode,
      };
      this.loadingVerificationCode = true;
      sendVerificationCode(obj)
        .then((res) => {
          const { code } = res;
          if (code === 0) {
            this.countDown();

            this.$message.success("发送验证码成功,请注意查收");
          }
        })
        .catch((err) => {
          this.$message.error(err.message || "服务器错误");
        })
        .finally(() => {
          this.loadingVerificationCode = false;
        });
    },
    countDown() {
      let _this = this;
      _this.isDisabled = true;
      this.timer = window.setInterval(() => {
        _this.buttonName = `(${_this.time}秒)后重新发送`;
        --_this.time;
        if (_this.time < 0) {
          _this.buttonName = "重新发送验证码";
          _this.time = 60;
          _this.isDisabled = false;
          window.clearInterval(this.timer);
        }
      }, 1000);
    },
    close() {
      this.dialogVisible = false;
      this.loading = false;
      this.buttonName = "发送验证码"; 
      this.time = 60;
      this.isDisabled = false;
      window.clearInterval(this.timer);
      this.form = {
        phone: undefined,
        validateCode: undefined,
      };
    },
  },
};
</script>

<style scoped lang="scss"></style>
