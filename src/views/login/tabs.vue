<template>
  <div class="user-layout-login">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <!-- <el-form-item prop="captcha">
        <el-input
          v-model="loginForm.captcha"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img" />
        </div>
      </el-form-item> -->
      <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getCodeImg } from '@/api/login'
import Cookies from 'js-cookie'
import $C from '@/utils/config'
export default {
  name: 'Login',
  data() {
    return {
      codeUrl: '',
      cookiePassword: '',
      loginForm: {
        accountType: $C.applicationName,
        imageVerificationCode: '1233',
        username: '',
        password: '',
        rememberMe: true,
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
        password: [{ required: true, trigger: 'blur', message: '密码不能为空' }],
        // captcha: [{ required: true, trigger: 'change', message: '验证码不能为空' }],
      },
      loading: false,
      redirect: undefined,
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true,
    },
  },
  created() {
    this.getCookie()
    this.removeCookie()
  },
  methods: {
    handleTabClick(tab) {
      this.customActiveKey = tab.paneName
      // this.form.resetFields()
    },

    getCode() {
      getCodeImg({ username: this.loginForm.username }).then((res) => {
        console.log('%c [ res ]', 'font-size:13px; background:pink; color:#bf2c9f;', res)
        this.codeUrl = res.data
      })
    },
    getCookie() {
      const username = Cookies.get('username')
      const password = Cookies.get('password')
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm.username = username === undefined ? this.loginForm.username : username
      this.loginForm.password = password === undefined ? this.loginForm.password : password
      this.loginForm.rememberMe = rememberMe === undefined ? false : Boolean(rememberMe)
    },
    removeCookie() {
      this.$store.dispatch('LogOut')
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.loginForm.rememberMe) {
            Cookies.set('username', this.loginForm.username, { expires: 30 })
            Cookies.set('password', this.loginForm.password, {
              expires: 30,
            })
            Cookies.set('rememberMe', this.loginForm.rememberMe, {
              expires: 30,
            })
          } else {
            Cookies.remove('username')
            Cookies.remove('password')
            Cookies.remove('rememberMe')
          }
          this.$store
            .dispatch('Login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/' }).catch(() => {})
            })
            .catch(() => {
              this.loading = false
              // this.getCode()
            })
        }
      })
    },
  },
}
</script>

<style rel="stylesheet/scss" lang="scss">
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
<style>
.valid-error .ant-select-selection__placeholder {
  color: #f5222d;
}
</style>
