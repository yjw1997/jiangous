import request from '@/utils/request'
import $C from '@/utils/config'
// 获取角色数据
export function getRoleList (data) {
  return request({
    url: `${$C.identification}/role/select/list`,
    method: 'post',
    data
  })
}
//  删除角色
export function removeRole (data) {
  return request({
    url: `${$C.identification}/role/delete/-id`,
    method: 'get',
    params: data
  })
}


//  新增角色
export function addRole (data) {
  return request({
    url: `${$C.identification}/role/insert`,
    method: 'post',
    data
  })
}
//  修改角色
export function writeRole (data) {
  return request({
    url: `${$C.identification}/role/update/-id`,
    method: 'post',
    data
  })
}

//查询角色拥有的路由列表[roleCode]
export function getMenuCodes (params) {
  return request({
    url: `${$C.identification}/role/select/routes/-roleCode`,
    method: 'get',
    params
  })
}
//分配[路由]
export function routeAllocation (data) {
  return request({
    url: `${$C.identification}/role/allocation/route`,
    method: 'post',
    data
  })
}

// 查询角色拥有的用户列表[roleCode]

export function getUserListByRoleCode (params) {
  return request({
    url: `${$C.identification}/role/select/users/-roleCode`,
    method: 'get',
    params
  })
}



//  分配角色权限数据
export function authDataScope (data) {
  return request({
    url: `/system/role/authDataScope`,
    method: 'post',
    data
  })
}

//  取消授权
export function cancelAnthUser (data) {
  return request({
    url: `/system/role/authUser/cancel`,
    method: 'post',
    data
  })
}
//  批量取消授权
export function cancelAllAnthUser (data) {
  return request({
    url: `/system/role/authUser/cancelAll`,
    method: 'post',
    data
  })
}
//  为角色添加用户
export function userAllocation (data) {
  return request({
    url: `${$C.identification}/role/allocation/user`,
    method: 'post',
    data
  })
}