import { login, getInfo } from '@/api/login'
import { removeToken, removeUserInfo, removeRefreshToken, } from '@/utils/auth'
import Vue from 'vue'
import FingerprintJS from '@fingerprintjs/fingerprintjs';
const user = {
  state: {
    accessToken: '',
    refreshToken: '',
    authToken: '',
    userInfo: {},
    permissions: []
  },

  mutations: {
    SET_ACCESS_TOKEN: (state, token) => {
      state.accessToken = token
    },
    SET_REFRESH_TOKEN: (state, token) => {
      state.refreshToken = token
    },
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo
    },
    SET_USER_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    }
  },

  actions: {
    // 登录
    async Login ({ commit }, userInfo) {
      if (!Vue.$deviceCode) {
        const fp = await FingerprintJS.load()
        const result = await fp.get()
        Vue.$deviceCode = Vue.prototype.$deviceCode = result.visitorId
      }
      userInfo.deviceId = Vue.$deviceCode
      return new Promise((resolve, reject) => {
        login(userInfo).then(res => {
          console.log('%c [ res ]', 'font-size:13px; background:pink; color:#bf2c9f;', res)
          // 设置上传的请求头部
          commit('SET_ACCESS_TOKEN', res.data.accessToken)
          commit('SET_REFRESH_TOKEN', res.data.refreshToken)
          const user = res.data.userDetails || {}
          user.avatar = user.avatar == "" || !user.avatar || user.avatar !== null ? require("@/assets/images/default_head_02.png") : user.avatar;
          commit('SET_USER_INFO', user)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          console.log('%c [ res ]', 'font-size:13px; background:pink; color:#bf2c9f;', res)
          const user = res.data
          user.avatar = user.avatar == "" ? require("@/assets/images/default_head_02.png") : user.avatar;
          commit('SET_USER_INFO', user)
          resolve(user)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    LogOut () {
      return new Promise((resolve) => {
        removeToken()
        removeUserInfo()
        removeRefreshToken()
        resolve()
      })
    },
  }
}

export default user
