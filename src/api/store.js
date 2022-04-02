import request from '@/utils/request'
import $C from '@/utils/config'

//  ___________________________________________店铺管理
// 新增店铺

export function shopAuditAddShopApi(data) {
    return request({
        url: `${$C.userCenter}${$C.version}${$C.identification}/shopAudit/addShop`,
        method: 'post',
        data
    })
}

//  店铺列表
export function queryShopPageList(data) {
    return request({
        url: `${$C.userCenter}${$C.version}${$C.identification}/shop/queryShopPageList`,
        method: 'post',
        data
    })
}

//启用-停用店铺
export function updateShopStatusShop(data) {
    return request({
        url: `${$C.userCenter}${$C.version}${$C.identification}/shop/updateShopStatus`,
        method: 'post',
        data
    })
}

//查看已入驻店铺详情
export function queryEnterShopDetail(data) {
    return request({
        url: `${$C.userCenter}${$C.version}${$C.identification}/shop/queryEnterShopDetail`,
        method: 'post',
        params: data
    })
}

// 查看审核详情(入驻信息)
export function queryShopAuditDetail(data) {
    return request({
        url: `${$C.userCenter}${$C.version}${$C.identification}/shopAudit/queryShopAuditDetail`,
        method: 'get',
        params: data
    })
}

// 批量更改有效期
export function updateShopValidTime(data) {
    return request({
        url: `${$C.userCenter}${$C.version}${$C.identification}/shop/updateShopValidTime`,
        method: 'post',
        data
    })
}

//  审核店铺
export function shopAuditAuditShop(data) {
    return request({
        url: `${$C.userCenter}${$C.version}${$C.identification}/shopAudit/auditShop`,
        method: 'post',
        data
    })
}
//  查看历史记录
export function queryHistoryPage(data) {
    return request({
        url: `${$C.userCenter}${$C.version}${$C.identification}/shopAudit/queryHistoryPage`,
        method: 'post',
        data
    })
}
//  修改押金

export function updateDepositMoney(data) {
    return request({
        url: `${$C.userCenter}${$C.version}${$C.identification}/shop/updateDepositMoney`,
        method: 'post',
        data
    })
}

//  修改佣金
export function updateRakeRate(data) {
    return request({
        url: `${$C.userCenter}${$C.version}${$C.identification}/shop/updateRakeRate`,
        method: 'post',
        data
    })
}