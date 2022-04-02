export default store => {
  // 用户默认配置
  // 初始化时从LocalStore获取数据 
  let setting = JSON.parse(localStorage.getItem('layout-setting'))
  if (setting !== null) {
    Object.keys(setting).forEach(key => {
      store.dispatch('settings/changeSetting', {
        key,
        value: setting[key],
      })
    })
  }
}