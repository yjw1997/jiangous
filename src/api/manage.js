import request from '@/utils/request'
import $C from '@/utils/config'

//post
export function postAction (url, parameter) {
  return request({
    url: url,
    method: 'post',
    data: parameter
  })
}
//get
export function getAction (url, parameter) {
  return request({
    url: url,
    method: 'get',
    params: parameter
  })
}



/**
 * 获取文件访问路径
 * @param avatar
 * @param imgerver
 * @param str
 * @returns {*}
 */
export function getFileAccessHttpUrl (avatar, imgerver, subStr) {
  if (avatar && avatar.indexOf(subStr) !== -1) {
    return avatar
  } else {
    return imgerver + '/' + avatar
  }
}
