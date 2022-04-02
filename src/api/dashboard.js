import request from '@/utils/request'
import $C from '@/utils/config'
//  首页统计接口
export function getSystemAdsList (params) {
  return request({
    url: `${$C.userCenter}${$C.version}${$C.identification}/platform/index`,
    method: 'get',
    params
  })
}


