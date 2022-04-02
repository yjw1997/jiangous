
/**
 *
 *大量数据同时渲染时会导致卡死
 *分时函数目的就是为了使大量的数据可以分时分段渲染,这样,性能就会好一些
 * @export 分时函数
 * @param {*} array 需要处理的数据
 * @param {*} fn //处理数据的函数
 * @param {number} [step=1] // 单次处理数据的步长
 * @param {number} [interval=200] // 每个多长时间处理一次数据
 */
export function timeChunk (array, fn, step = 10, interval = 200) {
  let timer //  预存一个定时器
  function start () { //  每次激活只会处理step长度(如果数据剩余的数据量少于step可以以数组的剩余数据为准)的数据
    for (let i = 0; i < Math.min(step, array.length); i++) {
      fn(array.shift())
    }
  }
  return function () {
    timer = setInterval(() => {
      array.length === 0 ? clearInterval(timer) : start()
    }, interval)
  }
}