import request from '@/utils/request'
import $C from '@/utils/config'
// 获取用户列表
export function getUserList (data) {
  return request({
    url: `${$C.identification}/user/select/list`,
    method: 'post',
    data
  })
}
//  删除用户
export function removeUser (params) {
  return request({
    url: `${$C.identification}/user/delete/-id`,
    method: 'get',
    params
  })
}
//  新增用户
export function addUser (data) {
  return request({
    url: `${$C.identification}/user/insert`,
    method: 'post',
    data
  })
}
//  修改用户
export function writeUser (data) {
  return request({
    url: `${$C.identification}/user/update/-id`,
    method: 'post',
    data
  })
}
//  重置密码
export function resetPwd (data) {
  return request({
    url: `/system/user/resetPwd`,
    method: 'post',
    data
  })
}
//  根据用户获取对应角色
export function getRoleId (params) {
  return request({
    url: `${$C.identification}/user/select/roles/-userId`,
    method: 'get',
    params
  })
}
//  为用户分配角色
export function roleAllocation (data) {
  return request({
    url: `${$C.identification}/user/allocation/role`,
    method: 'post',
    data
  })
}
