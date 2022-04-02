import request from '@/utils/request'
// 获取部门数据
export function getTreeData (data) {
  return request({
    url: `/system/dept/treeData`,
    method: 'post',
    data
  })
}
//  删除部门
export function removeDept (data) {
  return request({
    url: `/system/dept/remove`,
    method: 'post',
    data
  })
}
//  新增部门
export function addDept (data) {
  return request({
    url: `/system/dept/add`,
    method: 'post',
    data
  })
}
//  修改部门
export function writeDept (data) {
  return request({
    url: `/system/dept/write`,
    method: 'post',
    data
  })
}