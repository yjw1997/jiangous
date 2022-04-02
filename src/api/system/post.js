import request from '@/utils/request'
// 获取岗位列表
export function getPostList (data) {
  return request({
    url: `/system/post/list`,
    method: 'post',
    data
  })
}
//  删除岗位
export function removePost (data) {
  return request({
    url: `/system/post/remove`,
    method: 'post',
    data
  })
}
//  新增岗位
export function addPost (data) {
  return request({
    url: `/system/post/add`,
    method: 'post',
    data
  })
}
//  修改岗位
export function writePost (data) {
  return request({
    url: `/system/post/write`,
    method: 'post',
    data
  })
}