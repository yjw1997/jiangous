import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { baseUrl } from './config'
import Vue from 'vue'
import FingerprintJS from '@fingerprintjs/fingerprintjs'

import $C from '@/utils/config'

import { Decrypt, Encrypt } from './ase.js'
let unAse = false
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
// create an axios instance
const service = axios.create({
	// baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
	baseURL: baseUrl, // url = base url + request url

	// withCredentials: true, // send cookies when cross-domain requests
	timeout: 5000, // request timeout
})

let alignUrl = [$C.userCenter, $C.auth, $C.goods, $C.order, $C.activity, $C.other]
// let alignUrl = [$C.auth, $C.order,]
// request interceptor
service.interceptors.request.use(
	async function(config) {
		let serverName = config.url.split('/')[1]
		let searchIcon = alignUrl.indexOf('/' + serverName)
		if (searchIcon !== -1) {
			config.url = config.url.replace('/' + serverName, '')
			config.headers['X-Server-Name'] = serverName
		}
		//  字符串截取
		// 是否需要设置 token
		const isToken = (config.headers || {}).isToken === false
		if (getToken() && !isToken) {
			config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
		}
		//  添加浏览器指纹锁
		if (!Vue.$deviceCode) {
			const fp = await FingerprintJS.load()
			const result = await fp.get()
			Vue.$deviceCode = Vue.prototype.$deviceCode = result.visitorId
		}
		config.headers['X-Device-Code'] = Vue.$deviceCode
		config.headers['X-Application-Name'] = $C.applicationName
		config.headers['X-Source'] = 'pc'
		config.headers['X-Version'] = '1.0.0'
		// if (config.url.split('jin')[0] == "li") {
		//     config.baseURL = 'http://192.168.0.237:8091'
		//     config.url = config.url.split('lijin')[1]
		//     config.headers['X-Version'] = '1.1.0'
		// }
		if (config.version) {
			config.headers['X-Version'] = config.version
		}

		//  传入当前时区
		let date = 0 - new Date().getTimezoneOffset() / 60 > 0 ? '+' + (0 - new Date().getTimezoneOffset() / 60) : 0 - new Date().getTimezoneOffset() / 60
		config.headers['X-Timezone'] = 'GMT' + date
		unAse = config.headers.unAse ? config.headers.unAse : false
		if (config.data && unAse && !config.version) {
			let data = Encrypt(JSON.stringify(config.data))
			config.data = data
		} else if (config.data && unAse && config.version) {
			let data = Encrypt(JSON.stringify(config.data), 1111111111111111, 1111111111111111)
			config.data = data
		}
		// get请求映射params参数
		if (config.method === 'get' && config.params) {
			let url = config.url + '?'
			for (const propName of Object.keys(config.params)) {
				const value = config.params[propName]
				var part = encodeURIComponent(propName) + '='
				if (value !== null && typeof value !== 'undefined') {
					if (typeof value === 'object') {
						for (const key of Object.keys(value)) {
							const params = propName + '[' + key + ']'
							var subPart = encodeURIComponent(params) + '='
							url += subPart + encodeURIComponent(value[key]) + '&'
						}
					} else {
						url += part + encodeURIComponent(value) + '&'
					}
				}
			}
			url = url.slice(0, -1)
			config.params = {}
			config.url = url
		}
		//  编辑接口
		if (config.url.toLowerCase().indexOf('edit') !== -1) {
			console.log('%c [ config.url ]', 'font-size:13px; background:pink; color:#bf2c9f;', config.data)
			delete config.data.updateTime
			delete config.data.createTime
			delete config.data.deleteTheTime
			delete config.data.topEndTime
			delete config.data.topStartTime
			// delete config.data.publishEndTime
		}
		return config
	},
	error => {
		// do something with request error
		console.log(error) // for debug

		return Promise.reject(error)
	},
)

// response interceptor
service.interceptors.response.use(
	/**
	 * If you want to get http information such as headers or status
	 * Please return  response => response
	 */

	/**
	 * Determine the request status by custom code
	 * Here is just an example
	 * You can also judge the status by HTTP Status Code
	 */
	response => {
		const res = response.data
		//  返回文件流不用解析
		if (res instanceof Blob) {
			return res
		}
		// if the custom code is not 200, it is judged as an error.
		unAse = response.config.headers.unAse ? response.config.headers.unAse : false
		if (res.code === 0 && unAse && !response.config.version) {
			res.data = res.data || res.data !== null ? Decrypt(res.data) : res.data
			console.log('%c [ res ]', 'font-size:13px; background:pink; color:#bf2c9f;', res)
		} else if (res.code === 0 && unAse && response.config.version) {
			res.data = res.data || res.data !== null ? Decrypt(res.data, 1111111111111111, 1111111111111111) : res.data
			console.log('%c [ res ]', 'font-size:13px; background:pink; color:#bf2c9f;', res)
		}
		if (res.code !== 0) {
			// 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
			if (res.code === 1102 || res.code === 1101 || res.code === 1103) {
				// to re-login
				MessageBox.confirm('您已注销，您可以取消停留在此页面，或重新登录', '重新登录', {
					confirmButtonText: 'Re-Login',
					cancelButtonText: 'Cancel',
					type: 'warning',
				}).then(() => {
					store
						.dispatch('LogOut')
						.then(() => {
							location.reload()
						})
						.catch(() => {})
				})
			}
			switch (res.code) {
				case 1101:
					res.msg = '用户身份不明'
					break
				case 1102:
					res.msg = '用户身份过期'
					break
				case 1103:
					res.msg = '用户身份无效'
					break
				case 1104:
					res.msg = '用户权限不足'
					break
				case 1105:
					res.msg = '用户操作过于频繁'
					break
				case 2001:
					res.msg = '资源不存在'
					break
				case 5000:
					res.msg = '槽糕,服务器内部错误'
					break
				default:
					res.msg = '槽糕,服务器内部错误'
					break
			}
			Message({
				message: res.message || res.msg || 'Error',
				type: 'error',
				duration: 5 * 1000,
			})
			return Promise.reject(res)
		} else {
			return res
		}
	},
	error => {
		let err = error.response.data
		Message({
			message: err.message || err,
			type: 'error',
			duration: 5 * 1000,
		})
		return Promise.reject(err)
	},
)

export default service