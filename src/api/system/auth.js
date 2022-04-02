import request from '@/utils/request'
import $C from '@/utils/config'
// 获取菜单数据
export function getTreeData (data) {
  return request({
    url: `${$C.identification}/route/select/list`,
    method: 'post',
    data
  })
}
//  删除菜单
export function removeMenu (data) {
  return request({
    url: `${$C.identification}/route/delete/-id`,
    method: 'get',
    params: data
  })
}
//  新增菜单
export function addMenu (data) {
  return request({
    url: `${$C.identification}/route/insert`,
    method: 'post',
    data
  })
}
//  修改菜单
export function writeMenu (data) {
  return request({
    url: `${$C.identification}/route/update/-id`,
    method: 'post',
    data
  })
}