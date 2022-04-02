import request from '@/utils/request'
import $C from '@/utils/config'

//列表是海健其他都是志明
//  ___________________________________________ 订单管理
// list
export function queryOrderPageList(data) {
    return request({
        headers: {
            unAse: true
        },
        url: `${$C.order}${$C.version}${$C.identification}/order/queryOrderPageList`,
        // url: `${$C.order}${$C.version}${$C.merchantIdentification}/order/page`,
        method: 'post',
        data
    })
}

//  订单打印详情(多件)
export function ordersPrintDetailApi(data) {
    return request({
        headers: {
            unAse: true
        },
        url: `${$C.order}${$C.version}${$C.merchantIdentification}/order/batchPrintOrderDetail`,
        method: 'post',
        data
    })
}

//  订单打印
export function ordersPrintApi(data) {
    return request({
        headers: {
            unAse: true
        },
        url: `${$C.order}${$C.version}${$C.merchantIdentification}/order/batchPrintOrder`,
        method: 'post',
        data
    })
}

//  订单备注
export function orderBatchRemarkApi(data) {
    return request({
        headers: {
            unAse: true
        },
        url: `${$C.order}${$C.version}${$C.identification}/order/batchRemark`,
        method: 'post',
        data
    })
}

//  关闭订单
export function orderGoodsBatchClose(data) {
    return request({
        headers: {
            unAse: true
        },
        url: `${$C.order}${$C.version}${$C.merchantIdentification}/orderGoods/batchClose`,
        method: 'post',
        data
    })
}



// 核对取货码
export function checkPickCodeApi(data) {
    return request({
        headers: {
            unAse: true
        },
        url: `${$C.order}${$C.version}${$C.merchantIdentification}/orderGoods/checkPickCode4Admin`,
        method: 'post',
        data
    })
}

//  订单详情

export function getOrderDetail(data) {
    return request({
        headers: {
            unAse: true
        },
        url: `${$C.order}${$C.version}${$C.merchantIdentification}/orderGoods/detail`,
        method: 'post',
        data
    })
}

//  查看交易凭证
export function queryUserCertificateAudit(data) {
    return request({
        headers: {
            unAse: true
        },
        url: `${$C.userCenter}${$C.version}${$C.merchantIdentification}/userCertificateAudit/query`,
        method: 'post',
        data
    })
}

//  配注收款下拉
export function listTypeShopAccount(data) {

    return request({
        headers: {
            unAse: true
        },
        url: `${$C.userCenter}${$C.version}${$C.merchantIdentification}/shopAccount/listType`,
        method: 'post',
        data
    })
}




//驳回支付凭证

export function userCertificateAuditReject(data) {
    return request({
        headers: {
            unAse: true
        },
        url: `${$C.userCenter}${$C.version}${$C.merchantIdentification}/userCertificateAudit/reject`,
        method: 'post',
        data
    })
}

//  修改订单状态(确认收款)
export function orderGoodsUpdate(data) {
    return request({
        headers: {
            unAse: true
        },
        url: `${$C.order}${$C.version}${$C.merchantIdentification}/orderGoods/update`,
        method: 'post',
        data
    })
}

//  确认收款

export function userCertificateAuditConfirmPayment(data) {
    return request({
        headers: {
            unAse: true
        },
        url: `${$C.userCenter}${$C.version}${$C.merchantIdentification}/userCertificateAudit/confirmPayment`,
        method: 'post',
        data
    })
}

//查看批量发货详情
export function batchDeliverDetail(data) {
    return request({
        headers: {
            unAse: true
        },
        url: `${$C.order}${$C.version}${$C.merchantIdentification}/orderGoods/batchDeliverDetail`,
        method: 'post',
        data
    })
}
//获取包裹物流信息

export function queryTrackInfo(data) {
    return request({
        url: `${$C.order}${$C.version}${$C.identification}/shippingInfo/queryTrackInfo`,
        method: 'post',
        data
    })
}

//  获取快递公司下拉
export function expressCompanyList(data) {
    return request({
        headers: {
            unAse: true
        },
        url: `${$C.order}${$C.version}${$C.merchantIdentification}/expressCompany/list`,
        method: 'post',
        data
    })
}
//  是否可以批量发货
export function canBatchDeliver(data) {
    return request({
        headers: {
            unAse: true
        },
        url: `${$C.order}${$C.version}${$C.merchantIdentification}/orderGoods/canBatchDeliver`,
        method: 'post',
        data
    })
}

//  批量发货
export function batchDeliver(data) {
    return request({
        headers: {
            unAse: true
        },
        url: `${$C.order}${$C.version}${$C.merchantIdentification}/orderGoods/batchDeliver`,
        method: 'post',
        data
    })
}
//获取不同订单状态的订单数量
export function listOrderCount(data) {
    return request({
        headers: {
            unAse: true
        },
        url: `${$C.order}${$C.version}${$C.identification}/order/listOrderCount`,
        method: 'post',
        data
    })
}

// 修改收货地址

export function updateUserAddress(data) {
    return request({
        headers: {
            unAse: true
        },
        url: `${$C.order}${$C.version}${$C.merchantIdentification}/order/updateUserAddress`,
        method: 'post',
        data
    })
}

//订单提醒待上传凭证
export function userMessageRemind(data) {
    return request({
        headers: {
            unAse: true
        },
        url: `${$C.order}${$C.version}${$C.merchantIdentification}/orderGoods/pushWaitUploadMsg4Admin`,
        method: 'post',
        data
    })
}

// 店铺评论分页
export function commentPageApi(data) {
    return request({
        headers: {
            unAse: true
        },
        url: `${$C.order}${$C.version}${$C.identification}/orderComment/page`,
        method: 'post',
        data,
        version: '1.1.0'
    })
}

//    修改评论屏蔽状态
export function updateShieldApi(data) {
    return request({
        headers: {
            unAse: true
        },
        url: `${$C.order}${$C.version}${$C.identification}/orderComment/updateShield`,
        method: 'post',
        data,
        version: '1.1.0'
    })
}

//查看评论信息
export function queryDetailApi(data) {
    return request({
        headers: {
            unAse: true
        },
        url: `${$C.order}${$C.version}${$C.identification}/orderComment/queryDetail`,
        method: 'post',
        data,
        version: '1.1.0'
    })
}

//交易流水列表(加密)

export function queryTradePageApi(data) {
    return request({
        headers: {
            unAse: true
        },
        url: `${$C.order}${$C.version}${$C.identification}/orderTradeRecord/queryTradePage`,
        method: 'post',
        data,
        version: '1.1.0'
    })
}

// 退款流水列表（加密）
export function queryRefundPageApi(data) {
    return request({
        headers: {
            unAse: true
        },
        url: `${$C.order}${$C.version}${$C.identification}/orderRefundRecord/queryRefundPage`,
        method: 'post',
        data,
        version: '1.1.0'
    })
}
// 刷新订单支付状态
export function refreshPayStatusApi(data) {
    return request({
        url: `${$C.order}${$C.version}${$C.identification}/order/refreshPayStatus`,
        method: 'post',
        data,
    })
}