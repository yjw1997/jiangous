import Vue from 'vue'
import Cookies from 'js-cookie'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui'
import '@/assets/styles/element-variables.scss'
import Pagination from '@/components/Pagination'
import RightToolbar from '@/components/RightToolbar'
import ImageUploadModal from '@/components/upload/ImageUploadModal/index'
import WImportModal from '@/components/upload/WImportModal'
import MessageBox from '@/packages/message-box/index'
import Print from 'vue-print-nb'

Vue.use(Print)

import WtrfyComponents from '@/components/jianshops/index'

import {copyToClipboard, getMonthTime, getYearTIme, hasClass, addClass, removeClass, parseTime, handleTree, findParentCode, cloneDeep, parseSecondTime, getFloat, totalDownTime} from '@/utils/index'

// import 'normalize.css/normalize.css' // a modern alternative to CSS resets

// 全局方法挂载
Vue.prototype.parseTime = parseTime
Vue.prototype.getMonthTime = getMonthTime
Vue.prototype.getYearTIme = getYearTIme
Vue.prototype.hasClass = hasClass
Vue.prototype.addClass = addClass
Vue.prototype.removeClass = removeClass
Vue.prototype.handleTree = handleTree
Vue.prototype.findParentCode = findParentCode
Vue.prototype.cloneDeep = cloneDeep
Vue.prototype.parseSecondTime = parseSecondTime
Vue.prototype.copyToClipboard = copyToClipboard
Vue.prototype.getFloat = getFloat
Vue.prototype.totalDownTime = totalDownTime

import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css

import './permission' // 路由守卫控制

import './icons' // icon
Vue.config.productionTip = false
// 全局组件挂载
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)
Vue.component('ImageUploadModal', ImageUploadModal)
Vue.component('WImportModal', WImportModal)

//  全局插件

import wtrDataList from '@/components/dataList/index.js'
import WDictSelectTag from '@/components/dict/index'

Vue.use(wtrDataList)
Vue.use(WDictSelectTag)
Vue.use(WtrfyComponents)

Vue.use(Element, {
	size: Cookies.get('size') || 'medium', // set element-ui default size
})

Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt

//  获取浏览器指纹id
import FingerprintJS from '@fingerprintjs/fingerprintjs'
;(async () => {
	const fp = await FingerprintJS.load()

	const result = await fp.get()
	Vue.$deviceCode = Vue.prototype.$deviceCode = result.visitorId
})()

new Vue({
	el: '#app',
	router,
	store,
	render: h => h(App),
})