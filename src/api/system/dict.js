import request from '@/utils/request'
import $C from '@/utils/config'
// 获取字典数据
export function getDictList (data) {
  return request({
    url: `${$C.identification}/dict/select/list`,
    method: 'post',
    data
  })
}

//  删除字典
export function removeDict (data) {
  return request({
    url: `${$C.identification}/dict/delete/-id`,
    method: 'get',
    params: data
  })
}
//  新增字典
export function addDict (data) {
  return request({
    url: `${$C.identification}/dict/insert`,
    method: 'post',
    data
  })
}
//  修改字典
export function writeDict (data) {
  return request({
    url: `${$C.identification}/dict/update/-id`,
    method: 'post',
    data
  })
}
