import request from '@/utils/request'
import $C from '@/utils/config'


// 登录方法
export function login (data) {
  return request({
    headers: {
      unAse: true
    },
    url: `${$C.auth}${$C.version}/auth/password`,
    method: 'post',
    data: data
  })
}
// 获取用户详细信息
export function getInfo () {
  return request({
    url: `/wf-admin/user/select/-my`,
    method: 'get',
  })
}


// 获取验证码
export function getCodeImg (data) {
  return request({
    url: `/captcha/generate-login-image-captcha`,
    method: 'post',
    data
  })
}
// 获取路由
export const getRouters = () => {
  return request({
    url: `${$C.userCenter}${$C.version}${$C.identification}/appUser/getMenusByRole`,
    // url: '/vue-element-admin/route/select/list/-my',
    method: 'get',
  })
}

