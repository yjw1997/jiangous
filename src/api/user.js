import request from '@/utils/request'
import $C from '@/utils/config'

//  ___________________________________________用户管理
// list

export function getAppUserPageList (data) {
  return request({
    url: `${$C.userCenter}${$C.version}${$C.identification}/appUser/getAppUserPageList`,
    method: 'post',
    data
  })
}
// detail

export function getAppUserDetail (data) {
  return request({
    url: `${$C.userCenter}${$C.version}${$C.identification}/appUser/getAppUserDetail`,
    method: 'post',
    params: data
  })
}
// 删除

export function deleteAppUser (data) {
  return request({
    url: `${$C.userCenter}${$C.version}${$C.identification}/appUser/deleteAppUser`,
    method: 'post',
    params: data
  })
}
// 重置

export function resetAppUserPwd (data) {
  return request({
    url: `${$C.userCenter}${$C.version}${$C.identification}/appUser/resetAppUserPwd`,
    method: 'post',
    params: data
  })
}
//  注册

export function registerAppUser (data) {
  return request({
    url: `${$C.userCenter}${$C.version}${$C.identification}/appUser/registerAppUser`,
    method: 'post',
    data
  })
}

//  获取验证码
export function sendVerificationCode (data) {

  return request({
    headers: {
      unAse: true
    },
    url: `${$C.auth}${$C.version}/captcha/message`,
    method: 'post',
    data
  })
}