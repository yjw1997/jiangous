import request from '@/utils/request'
import $C from '@/utils/config'

//  ___________________________________________商品管理
// 后台类目管理

//list
export function goodsClassifyQueryGoodsClassify(data) {
    return request({
        url: `${$C.goods}${$C.version}${$C.identification}/goodsClassify/queryGoodsClassify`,
        method: 'post',
        data
    })
}

//  edit
export function goodsClassifyUpdateGoodsClassify(data) {
    return request({
        url: `${$C.goods}${$C.version}${$C.identification}/goodsClassify/updateClassifyDetail`,
        method: 'post',
        data
    })
}
// 前台分类上移-下移
export function updateSortGoodsClassifyFront(data) {
    return request({
        url: `${$C.goods}${$C.version}${$C.identification}/goodsClassifyFront/updateSort`,
        method: 'post',
        data
    })
}
//add
export function goodsClassifyAddGoodsClassify(data) {
    return request({
        url: `${$C.goods}${$C.version}${$C.identification}/goodsClassify/addGoodsClassify`,
        method: 'post',
        data
    })
}


//  detail
export function goodsClassifyQueryClassifyDetail(data) {
    return request({
        url: `${$C.goods}${$C.version}${$C.identification}/goodsClassify/queryClassifyDetail`,
        method: 'post',
        params: data
    })
}

// 后台分类上移-下移
export function updateSortGoodsClassify(data) {
    return request({
        url: `${$C.goods}${$C.version}${$C.identification}/goodsClassify/updateSort`,
        method: 'post',
        data
    })
}


// 启用-禁用后台分类

export function goodsClassifyUpdateClassifyStatus(data) {
    return request({
        url: `${$C.goods}${$C.version}${$C.identification}/goodsClassify/updateClassifyStatus?id=${data.id}`,
        method: 'post',
        data
    })
}

//销售规格

//list
export function querySpecificationPageList(data) {
    return request({
        url: `${$C.goods}${$C.version}${$C.identification}/specification/querySpecificationPageList`,
        method: 'post',
        data
    })
}

// delete
export function deleteSpecification(data) {
    return request({
        url: `${$C.goods}${$C.version}${$C.identification}/specification/deleteSpecification`,
        method: 'post',
        params: { id: data.id }
    })
}

//edit 
export function updateSpecification(data) {
    return request({
        url: `${$C.goods}${$C.version}${$C.identification}/specification/updateSpecification`,
        method: 'post',
        data
    })
}

//add 
export function addSpecification(data) {
    return request({
        url: `${$C.goods}${$C.version}${$C.identification}/specification/addSpecification`,
        method: 'post',
        data
    })
}
//detail
export function querySpecificationDetail(data) {
    return request({
        url: `${$C.goods}${$C.version}${$C.identification}/specification/querySpecificationDetail`,
        method: 'post',
        params: data
    })
}




//规格属性下拉框

export function querySpecificationDownBoxList(data) {
    return request({
        url: `${$C.goods}${$C.version}${$C.identification}/specification/querySpecificationDownBoxList`,
        method: 'post',
        params: data
    })
}

//  前台类目管理

//list
export function queryClassifyTree(data) {
    return request({
        url: `${$C.goods}${$C.version}${$C.identification}/goodsClassifyFront/queryClassifyTree`,
        method: 'post',
        data
    })
}


//  add
export function addGoodsClassify(data) {
    return request({
        url: `${$C.goods}${$C.version}${$C.identification}/goodsClassifyFront/addGoodsClassify`,
        method: 'post',
        data
    })
}

//  edit
export function updateFrontClassify(data) {
    return request({
        url: `${$C.goods}${$C.version}${$C.identification}/goodsClassifyFront/updateFrontClassify`,
        method: 'post',
        data
    })
}
//detele 
export function deleteFrontClassifyCode(data) {
    return request({
        url: `${$C.goods}${$C.version}${$C.identification}/goodsClassifyFront/deleteFrontClassifyCode`,
        method: 'post',
        params: data
    })
}
//启用-禁用
export function updateFrontClassifyStatus(data) {
    return request({
        url: `${$C.goods}${$C.version}${$C.identification}/goodsClassifyFront/updateFrontClassifyStatus?id=${data.id}`,
        method: 'post',
        data
    })
}

//  拷贝后台类目

export function copyBackClassifyCodeApi(data) {
    return request({
        url: `${$C.goods}${$C.version}${$C.identification}/goodsClassifyFront/copyBackClassifyCode`,
        method: 'post',
        params: data
    })
}

//  设置首页展示分类

export function updateIndexClassifyCodeApi(data) {
    return request({
        url: `${$C.goods}${$C.version}${$C.identification}/goodsClassifyFront/updateIndexClassifyCode`,
        method: 'get',
        params: data
    })
}

//  前后台添加一级分类时最大排序
export function getMaxSort4NullGoodsClassify(data) {
    return request({
        url: `${$C.goods}${$C.version}${$C.identification}/goodsClassify/getMaxSort4Null`,
        method: 'post',
        params: data
    })
}


//  商品管理

// list
export function queryGoodsPageList(data) {
    return request({
        url: `${$C.goods}${$C.version}${$C.identification}/goods/queryGoodsPageList`,
        method: 'post',
        data
    })
}

//  detail
export function goodsDetail(data) {
    return request({
        url: `${$C.goods}${$C.version}${$C.identification}/goods/goodsDetail`,
        method: 'post',
        params: data
    })
}

//  删除
export function deleteGoods(data) {
    return request({
        url: `${$C.goods}${$C.version}${$C.identification}/goods/deleteGoods`,
        method: 'post',
        params: { id: data.id }
    })
}

//核验商品
export function verifyGoods(data) {
    return request({
        url: `${$C.goods}${$C.version}${$C.identification}/goods/verifyGoods`,
        method: 'post',
        data
    })
}
//  上架商品
export function takeUpGoods(data) {
    return request({
        url: `${$C.goods}${$C.version}${$C.identification}/goods/takeUpGoods`,
        method: 'post',
        params: data
    })
}
//  下架商品

export function takeDownGoods(data) {
    return request({
        url: `${$C.goods}${$C.version}${$C.identification}/goods/takeDownGoods`,
        method: 'post',
        data
    })
}
//  审核商品

export function auditGoods(data) {
    return request({
        url: `${$C.goods}${$C.version}${$C.identification}/goods/auditGoods`,
        method: 'post',
        data
    })
}


// _____________________________________促销活动

//list 
export function queryActivitySchedulePage(data) {
    return request({
        url: `${$C.activity}${$C.version}${$C.identification}/activitySchedule/queryActivitySchedulePage`,
        method: 'post',
        data
    })
}


// edit

export function updateActivitySchedule(data) {
    return request({
        url: `${$C.activity}${$C.version}${$C.identification}/activitySchedule/update`,
        method: 'post',
        data
    })
}
// add

export function addActivitySchedule(data) {
    return request({
        url: `${$C.activity}${$C.version}${$C.identification}/activitySchedule/save`,
        method: 'post',
        data
    })
}
//detail

export function queryActivityScheduleDetail(data) {
    return request({
        url: `${$C.activity}${$C.version}${$C.identification}/activitySchedule/queryActivityScheduleDetail`,
        method: 'post',
        params: data
    })
}
//  修改状态(上线/下架)
export function updateStatusActivitySchedule(data) {
    return request({
        url: `${$C.activity}${$C.version}${$C.identification}/activitySchedule/updateStatus`,
        method: 'post',
        data: { id: data.id, online: data.online }
    })
}

//  查询审核商品数据
//list
export function queryactivityRushPurchaseAuditList(data) {
    return request({
        url: `${$C.activity}${$C.version}${$C.identification}/activityRushPurchaseAudit/queryactivityRushPurchaseAuditList`,
        method: 'post',
        data
    })
}
//  detail
export function queryActivityRushPurchaseGoodsDetail(data) {
    return request({
        url: `${$C.activity}${$C.version}${$C.identification}/activityRushPurchaseGoodsDetail/queryActivityRushPurchaseGoodsDetail`,
        method: 'post',
        data
    })
}

//  审核
export function activityRushPurchaseAuditSave(data) {
    return request({
        url: `${$C.activity}${$C.version}${$C.identification}/activityRushPurchaseAudit/save`,
        method: 'post',
        data
    })
}

//-查询抢购商品时段数据
export function queryAdminPurchaseScheduleList(data) {
    return request({
        url: `${$C.activity}${$C.version}${$C.identification}/activityRushPurchaseSchedule/queryAdminPurchaseScheduleList`,
        method: 'post',
        data
    })
}

//  根据id集合删除时间段
export function deleteActivityRushPurchaseScheduleByIds(data) {
    return request({
        url: `${$C.activity}${$C.version}${$C.identification}/activityRushPurchaseSchedule/deleteActivityRushPurchaseScheduleByIds`,
        method: 'post',
        params: data
    })
}

//  添加活动时间段
export function saveActivityRushPurchaseScheduleByIds(data) {
    return request({
        url: `${$C.activity}${$C.version}${$C.identification}/activityRushPurchaseSchedule/save`,
        method: 'post',
        data
    })
}

//  根据活动时段查询商品数据
export function queryRushGoodsByTime(data) {
    return request({
        url: `${$C.activity}${$C.version}${$C.identification}/activityRushGoods/queryAdminRushGoodsIdsByPage`,
        method: 'post',
        data
    })
}

//  根据id集合删除时间段商品数据
export function deleteGoodsByGoodsIds(data) {
    return request({
        url: `${$C.activity}${$C.version}${$C.identification}/activityRushGoods/deleteGoodsByGoodsIds`,
        method: 'post',
        params: data
    })
}

//  添加活动时间段商品

export function saveRushGoods(data) {
    return request({
        url: `${$C.activity}${$C.version}${$C.identification}/activityRushGoods/saveRushGoods`,
        method: 'post',
        data
    })
}

//  sort 活动时间段商品
export function updateRushGoodsSort(data) {
    return request({
        url: `${$C.activity}${$C.version}${$C.identification}/activityRushGoods/updateRushGoodsSort`,
        method: 'post',
        data
    })
}


//  下载新增商品模板zip文件
export function downZipGoodsTemplate(data) {
    return request({
        url: `${$C.goods}${$C.version}${$C.identification}/goods/downZip`,
        method: 'post',
        responseType: 'blob',
        data
    })
}
//批量发布商品商家下拉框
export function queryDownBoxShops(data) {
    return request({
        url: `${$C.userCenter}${$C.version}${$C.identification}/shop/queryDownBoxShops`,
        method: 'post',
        data
    })
}


//  批量发布商品
export function batchAddGoods(data) {
    return request({
        url: `${$C.goods}${$C.version}${$C.identification}/goods/batchAddGoods?id=${data.id}&shopName=${data.shopName}`,
        method: 'post',
        data: data.file,
        timeout: 60 * 10 * 1000
    })
}