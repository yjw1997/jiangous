import Vue from 'vue'
//引入svg组件
import IconSvg from '@/components/IconSvg'

//全局注册icon-svg
Vue.component('svg-icon', IconSvg)

//使用到 webpack 的 require.context 自动导入
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)


