import request from '@/utils/request'


// 获取表格数据 50000条
export function getTableList (data) {
  return request({
    url: '/vue-element-admin/table/tableList',
    method: 'get',
    params: data
  })
}