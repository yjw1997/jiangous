/**
 * @export获取浏览器窗口和设定body高度百分比缩放,可能与页面缩放百分比相冲突
 * @return {*}
 */
import {Message} from 'element-ui'

export function getTransform() {
	const availHeight = document.documentElement.clientHeight
	const availWidth = document.documentElement.clientWidth
	const documHeight = document.body.clientHeight
	const documWidth = document.body.clientWidth
	const xScale = availWidth / documWidth
	const yScale = availHeight / documHeight
	document.getElementsByTagName('body')[0].setAttribute('style', 'transform: scale(' + xScale + ', ' + yScale + ')')
	return {
		xScale,
		yScale,
	}
}

//  获取近30天日期
export function getMonthTime() {
	var lastMonth = []
	for (var i = 0; i < 30; i++) {
		lastMonth.unshift(new Date(new Date().setDate(new Date().getDate() - i - 1)).toLocaleDateString())
	}
	return lastMonth
}
//  获取近一年月份
export function getYearTIme() {
	var dataArr = []
	var data = new Date()
	var year = data.getFullYear()
	data.setMonth(data.getMonth() + 1) //获取到当前月份,设置月份
	for (var i = 0; i < 12; i++) {
		data.setMonth(data.getMonth() - 1) //每次循环一次 月份值减1
		dataArr.push(data.getFullYear() + '-' + data.getMonth())
	}
	return dataArr.reverse()
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
	return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}
/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
	if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
	if (hasClass(ele, cls)) {
		const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
		ele.className = ele.className.replace(reg, ' ')
	}
}

// 日期格式化
export function parseTime(time, pattern) {
	if (arguments.length === 0 || !time) {
		return null
	}
	const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
	let date
	if (typeof time === 'object') {
		date = time
	} else {
		if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
			time = parseInt(time)
		} else if (typeof time === 'string') {
			time = time.replace(new RegExp(/-/gm), '/')
		}
		if (typeof time === 'number' && time.toString().length === 10) {
			time = time * 1000
		}
		date = new Date(time)
	}
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay(),
	}
	const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
		let value = formatObj[key]
		// Note: getDay() returns 0 on Sunday
		if (key === 'a') {
			return ['日', '一', '二', '三', '四', '五', '六'][value]
		}
		if (result.length > 0 && value < 10) {
			value = '0' + value
		}
		return value || 0
	})
	return time_str
}
//  秒数时间搓转换
export function parseSecondTime(time, format = true) {
	if (time && time !== null) {
		const date = new Date(time * 1000)
		const year = date.getFullYear()
		const month = date.getMonth() + 1
		const day = date.getDate()
		const hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
		const minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
		const second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
		const ms = `${year}/${month}/${day} ${hour}:${minute}:${second}`
		return format ? ms : new Date(time * 1000)
	}
	return ''
}

//  秒数转换为时间
export function formatSeconds(value) {
	var theTime = parseInt(value) // 秒
	var theTime1 = 0 // 分
	var theTime2 = 0 // 小时
	// alert(theTime);
	if (theTime > 60) {
		theTime1 = parseInt(theTime / 60)
		theTime = parseInt(theTime % 60)
		// alert(theTime1+"-"+theTime);
		if (theTime1 > 60) {
			theTime2 = parseInt(theTime1 / 60)
			theTime1 = parseInt(theTime1 % 60)
		}
	}
	var result = '' + parseInt(theTime) + '秒'
	if (theTime1 > 0) {
		result = '' + parseInt(theTime1) + '分' + result
	}
	if (theTime2 > 0) {
		result = '' + parseInt(theTime2) + '小时' + result
	}
	return result
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 */
export function handleTree(data, id, parentId, children) {
	let config = {
		id: id || 'id',
		parentId: parentId || 'parentId',
		childrenList: children || 'children',
	}

	var childrenListMap = {}
	var nodeIds = {}
	var tree = []

	for (let d of data) {
		let parentId = d[config.parentId]
		if (childrenListMap[parentId] == null) {
			childrenListMap[parentId] = []
		}
		nodeIds[d[config.id]] = d
		childrenListMap[parentId].push(d)
	}
	for (let d of data) {
		let parentId = d[config.parentId]
		if (nodeIds[parentId] == null) {
			tree.push(d)
		}
	}
	for (let t of tree) {
		adaptToChildrenList(t)
	}

	function adaptToChildrenList(o) {
		if (childrenListMap[o[config.id]] !== null) {
			o[config.childrenList] = childrenListMap[o[config.id]]
		}
		if (o[config.childrenList]) {
			for (let c of o[config.childrenList]) {
				adaptToChildrenList(c)
			}
		}
	}
	return tree
}

//  深拷贝只考虑object和array类型
export function cloneDeep(target, map = new WeakMap()) {
	if (typeof target === 'object' && target !== null) {
		let cloneTarget = Array.isArray(target) ? [] : {}

		if (map.get(target)) {
			return target
		}
		map.set(target, cloneTarget)
		for (const key in target) {
			cloneTarget[key] = cloneDeep(target[key], map)
		}
		return cloneTarget
	} else {
		return target
	}
}

//  查找tree数据的parentCodes
export function findParentCode() {
	console.log('%c [ this.form ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.form)
	if (this.form.parentCode === 'NONE' || !this.form.parentCode) {
		this.form.parentCodes = 'NONE'
		this.form.parentCode = 'NONE'
	} else {
		let data = this.$parent.dataSource.filter(item => item.code === this.form.parentCode)
		if (data.length === 1) {
			let code = data[0].code === 'NONE' ? '' : data[0].code
			let parentCode = data[0].parentCode === 'NONE' ? '' : data[0].parentCode + ','
			this.form.parentCodes = parentCode + code === ',' ? 'NONE' : parentCode + code
		}
	}
}
//  非空判断
export function isEmpty(str) {
	if (str !== null && str.trim().length > 0) {
		return true
	}
	return false
}

//base64转blob
export function toBlob(base64Data) {
	let byteString = base64Data
	if (base64Data.split(',')[0].indexOf('base64') >= 0) {
		byteString = atob(base64Data.split(',')[1]) // base64 解码
	} else {
		byteString = unescape(base64Data.split(',')[1])
	}
	// 获取文件类型
	let mimeString = base64Data.split(';')[0].split(':')[1] // mime类型

	// ArrayBuffer 对象用来表示通用的、固定长度的原始二进制数据缓冲区
	// let arrayBuffer = new ArrayBuffer(byteString.length) // 创建缓冲数组
	// let uintArr = new Uint8Array(arrayBuffer) // 创建视图

	let uintArr = new Uint8Array(byteString.length) // 创建视图

	for (let i = 0; i < byteString.length; i++) {
		uintArr[i] = byteString.charCodeAt(i)
	}
	// 生成blob
	const blob = new Blob([uintArr], {
		type: mimeString,
	})
	// 使用 Blob 创建一个指向类型化数组的URL, URL.createObjectURL是new Blob文件的方法,可以生成一个普通的url,可以直接使用,比如用在img.src上
	return blob
}
//  判断是否是正整数
export function positiveInteger(number) {
	if (((number - 0) | 0) !== number - 0) {
		return false
	}
	return true
}

//	复制内容
export function copyToClipboard(text){
	navigator.clipboard.writeText(text);
	Message.success('复制成功')
}

//	保留数字后两位,不足补零
export function getFloat(number, n) {
	n = n ? parseInt(n) : 0;
	if(n <= 0) {
		return Math.round(number);
	}
	number = Math.round(number * Math.pow(10, n)) / Math.pow(10, n); //四舍五入
	number = Number(number).toFixed(n); //补足位数
	return number;
}

/*
 	cutDownTime:秒级时间戳
	methods:展示倒计时
*/
export function totalDownTime(cutDownTime) {
	const diff = cutDownTime - Date.parse(new Date()) / 1000
	if (diff > 0) {
		const days = parseInt(diff / 86400)
		const hours = parseInt(diff / 3600) - 24 * days
		const minutes = parseInt((diff % 3600) / 60)
		return `${days}天${hours}小时${minutes}分钟`
	}
	return `0天0小时0分钟`
}