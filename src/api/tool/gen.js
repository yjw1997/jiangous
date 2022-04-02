import request from '@/utils/request'
import $C from '@/utils/config'
// 查询生成表数据
export function listTable (data) {
  return request({
    url: `${$C.identification}/generators/list`,
    method: 'post',
    data
  })
}
// 查询表详细信息
export function getGenTable (tableId) {
  return request({
    url: `${$C.identification}/generators/column/list`,
    method: 'post',
    data: { tableId: tableId }
  })
}
// 修改代码生成信息
export function updateGenTable (data) {
  return request({
    url: `${$C.identification}/generators/edit`,
    method: 'post',
    data
  })
}
// 删除表数据
export function delTable (data) {
  return request({
    url: `${$C.identification}/generators/remove`,
    method: 'post',
    params: data
  })
}
// 生成代码
export function genCode (params) {
  return request({
    url: `${$C.identification}/generators/genCode/${params.tableName}/${params.type}`,
    method: 'get',
    responseType: 'blob',
    params
  })
}
//  批量生成
export function batchGenCode (params) {
  return request({
    url: `${$C.identification}/generators/batchGenCode`,
    method: 'get',
    responseType: 'blob',
    params
  })
}
// 预览生成代码
export function previewTable (tableId) {
  return request({
    url: `${$C.identification}/generators/preview/${tableId}`,
    method: 'get'
  })
}

// 查询db数据库列表
export function listDbTable (data) {
  return request({
    url: `${$C.identification}/generators/db/list`,
    method: 'post',
    data
  })
}



// 导入表
export function importTable (data) {
  return request({
    url: `${$C.identification}/generators/importTable`,
    method: 'post',
    params: data
  })
}






