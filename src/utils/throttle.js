/**
 *  节流函数
 * @param {*} fn 需要执行的业务函数
 * @param {*} interval 每次执行的间隔时间
 */
export function throttle (fn, interval) {
  let _self = fn //  保存待执行的业务函数,方便在函数内部调用
  let timer = null //预留变量储存定时器
  let isFirst = true //  判断是否第一次执行业务函数

  return function () { //返回待执行加工后的业务函数
    let _args = arguments //  储存加工后的函数实参
    let _me = this //  调用函数的对象
    if (isFirst) {
      _self.apply(_me, _args) //  当第一次执行业务函数时,立即执行,避免延迟
      return isFirst = false //  修改flag退出函数
    }
    if (timer) {//  如果timer存在直接退出
      return false
    }
    timer = setTimeout(function () {
      clearTimeout(timer)//  在500ms后清除定时器
      timer = null // 同时把值还原成null
      _self.apply(_me, _args) //  调用一次业务函数,下一次逻辑就是重新生成一个定时器
    }, interval || 500)
  }
}