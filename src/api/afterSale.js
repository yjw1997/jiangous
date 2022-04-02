import request from '@/utils/request'
import $C from '@/utils/config'
export function querySalePageList(data) {
	return request({
		url: `${$C.order}${$C.identification}/orderRefund/queryPage`,
		method: 'post',
		data,
		version: '1.1.0',
	})
}
export function getDetails(data) {
	return request({
		url: `${$C.order}${$C.identification}/orderRefund/queryDetail`,
		method: 'post',
		data,
		version: '1.1.0',
	})
}
export function confirmRefund(data) {
	return request({
		url: `${$C.order}${$C.identification}/orderRefund/auditRefund`,
		method: 'post',
		data,
		version: '1.1.0',
	})
}
//平台发起退款
export function pushRefund(data) {
	return request({
		url: `${$C.order}${$C.identification}/orderRefund/applyRefund`,
		method: 'post',
		data,
		version: '1.1.0',
	})
}
export function obtainFunds(data) {
	return request({
		url: `${$C.order}${$C.identification}/platTradeSettle/shopFunds`,
		method: 'post',
		headers: {
			unAse: true,
		},
		data,
		version: '1.1.0',
	})
}
export function shopTotal(data) {
	return request({
		url: `${$C.order}${$C.identification}/platTradeSettle/queryAllSettlePage`,
		method: 'post',
		data,
		version: '1.1.0',
	})
}
// 结算账单明细
export function getBillDetails(data) {
	return request({
		url: `${$C.order}${$C.identification}/platTradeSettle/pageByBillTime`,
		method: 'post',
		data,
		version: '1.1.0',
	})
}
// 店铺结算统计-查看详情
export function getList(data) {
	return request({
		url: `${$C.order}${$C.identification}/platTradeSettle/page`,
		method: 'post',
		headers: {
			unAse: true,
		},
		data,
		version: '1.1.0',
	})
}
// 结算账单明细汇款
export function sureRemit(data) {
	return request({
		url: `${$C.order}${$C.identification}/platTradeSettle/remittanceByBillTime`,
		method: 'post',
		data,
		version: '1.1.0',
	})
}
// 结算账单明细-------账单明细汇款
export function getIdRemit(data) {
	return request({
		url: `${$C.order}${$C.identification}/platTradeSettle/remittanceById`,
		method: 'post',
		data,
		version: '1.1.0',
	})
}
// 结算账单明细---账单明细
export function remitList(data) {
	return request({
		url: `${$C.order}${$C.identification}/platTradeSettle/pageStat`,
		method: 'post',
		headers: {
			unAse: true,
		},
		data,
		version: '1.1.0',
	})
}
// 账单明细列表
export function getOrderList(data) {
	return request({
		url: `${$C.order}${$C.merchantIdentification}/platTradeSettleDetail/queryShopInfoAndDetail`,
		method: 'post',
		headers: {
			unAse: true,
		},
		data,
		version: '1.1.0',
	})
}
//	账单明细-订单明细
export function initList(data) {
	return request({
		url: `${$C.order}${$C.merchantIdentification}/platTradeSettleDetail/page`,
		method: 'post',
		headers: {
			unAse: true,
		},
		data,
		version: '1.1.0',
	})
}
//	结算账单明细列表-导出账单
export function initExcel(data) {
	return request({
		url: `${$C.order}${$C.merchantIdentification}/platTradeSettleDetail/downloadExcel`,
		method: 'post',
		headers: {
			unAse: true,
		},
		data,
		version: '1.1.0',
	})
}
//申请退款的商品详情
export function initDetail(data) {
	return request({
		url: `${$C.order}${$C.merchantIdentification}/orderRefund/goodsDetail`,
		method: 'post',
		headers: {
			unAse: true,
		},
		data,
		version: '1.1.0',
	})
}
//已线下处理退款
export function resolveRefund(data) {
	return request({
		url: `${$C.order}${$C.identification}/orderRefund/handleFialRefund`,
		method: 'post',
		data,
		version: '1.1.0',
	})
}