import request from '@/utils/request'
import $C from '@/utils/config'

//  ___________________________________________系统通知
// list

export function getUserMessageList(data) {
    return request({
        url: `${$C.userCenter}${$C.version}${$C.identification}/userMessage/getPageList`,
        method: 'post',
        data
    })
}

// add

export function getUserMessageAdd(data) {
    return request({
        url: `${$C.userCenter}${$C.version}${$C.identification}/userMessage/add`,
        method: 'post',
        data
    })
}

// edit

export function getUserMessageEdit(data) {
    return request({
        url: `${$C.userCenter}${$C.version}${$C.identification}/userMessage/edit`,
        method: 'post',
        data
    })
}

// detele

export function getUserMessageDetele(data) {
    return request({
        url: `${$C.userCenter}${$C.version}${$C.identification}/userMessage/delete`,
        method: 'post',
        params: { ids: data.ids }
    })
}

//  ___________________________________________消息推送设置
// list

export function getMessagePushConfigQueryList(data) {
    return request({
        url: `${$C.userCenter}${$C.version}${$C.identification}/messagePushConfig/queryList`,
        method: 'post',
        data
    })
}

// upload

export function getMessagePushConfigUpdate(data) {
    return request({
        url: `${$C.userCenter}${$C.version}${$C.identification}/messagePushConfig/update`,
        method: 'post',
        data
    })
}

//  ___________________________________________问题反馈

// 意见反馈

//list
export function getUserOpinionGetPageList(data) {
    return request({
        url: `${$C.userCenter}${$C.version}${$C.identification}/userOpinion/getPageList`,
        method: 'post',
        data
    })
}
// detele
export function getUserOpinionDetele(data) {
    return request({
        url: `${$C.userCenter}${$C.version}${$C.identification}/userOpinion/delete`,
        method: 'post',
        params: { id: data.id }
    })
}

//  处理用户反馈意见
export function disposeUserOpinionDetele(data) {
    return request({
        url: `${$C.userCenter}${$C.version}${$C.identification}/userOpinion/dispose`,
        method: 'post',
        params: { id: data.id }
    })
}



//  购买意向分类
// list

export function getUserBuyIntentionClassifyList(data) {
    return request({
        url: `${$C.userCenter}${$C.version}${$C.identification}/userBuyIntentionClassify/getPageList`,
        method: 'post',
        data
    })
}

// add

export function getUserBuyIntentionClassifyAdd(data) {
    return request({
        url: `${$C.userCenter}${$C.version}${$C.identification}/userBuyIntentionClassify/add`,
        method: 'post',
        data
    })
}

// edit

export function getUserBuyIntentionClassifyEdit(data) {
    return request({
        url: `${$C.userCenter}${$C.version}${$C.identification}/userBuyIntentionClassify/edit`,
        method: 'post',
        data
    })
}

// detele

export function getUserBuyIntentionClassifyDetele(data) {
    return request({
        url: `${$C.userCenter}${$C.version}${$C.identification}/userBuyIntentionClassify/remove`,
        method: 'post',
        params: { id: data.id }
    })
}

//  购买意向
// list

export function getUserBuyIntentionList(data) {
    return request({
        url: `${$C.userCenter}${$C.version}${$C.identification}/userBuyIntention/getPageList`,
        method: 'post',
        data
    })
}
// detele

export function getUserBuyIntentionDetele(data) {
    return request({
        url: `${$C.userCenter}${$C.version}${$C.identification}/userBuyIntention/remove`,
        method: 'post',
        params: { id: data.id }
    })
}

//  处理够买意向
export function disposeUserBuyIntention(data) {
    return request({
        url: `${$C.userCenter}${$C.version}${$C.identification}/userBuyIntention/dispose`,
        method: 'post',
        params: { id: data.id }
    })
}

// 问题分类
//list
export function getQuestionClassifyList(data) {
    return request({
        url: `${$C.other}${$C.version}${$C.identification}/questionClassify/queryList`,
        method: 'post',
        data
    })
}
//edit
export function queryQuestionClassifyEdit(data) {
    return request({
        url: `${$C.other}${$C.version}${$C.identification}/questionClassify/edit`,
        method: 'post',
        data
    })
}
//sort
export function queryQuestionClassifySort(data) {
    return request({
        url: `${$C.other}${$C.version}${$C.identification}/questionClassify/sort`,
        method: 'post',
        data
    })
}
// detele
export function queryQuestionClassifyDetele(data) {
    return request({
        url: `${$C.other}${$C.version}${$C.identification}/questionClassify/delete`,
        method: 'post',
        params: { id: data.id }
    })
}
//add
export function queryQuestionClassifyAdd(data) {
    return request({
        url: `${$C.other}${$C.version}${$C.identification}/questionClassify/add`,
        method: 'post',
        data
    })
}
//  问题列表
//list
export function queryQuestionList(data) {
    return request({
        url: `${$C.other}${$C.version}${$C.identification}/question/queryQuestionList`,
        method: 'post',
        data
    })
}
//edit
export function queryQuestionEdit(data) {
    return request({
        url: `${$C.other}${$C.version}${$C.identification}/question/edit`,
        method: 'post',
        data
    })
}
// detele

export function queryQuestionDelete(data) {
    return request({
        url: `${$C.other}${$C.version}${$C.identification}/question/delete`,
        method: 'post',
        params: { id: data.id }
    })
}
//add
export function queryQuestionAdd(data) {
    return request({
        url: `${$C.other}${$C.version}${$C.identification}/question/add`,
        method: 'post',
        data
    })
}
//上下排序
export function queryQuestionSortQuestion(data) {
    return request({
        url: `${$C.other}${$C.version}${$C.identification}/question/sortQuestion`,
        method: 'post',
        data
    })
}

//  ___________________________________________敏感词管理

//list
export function getSensitiveWordList(data) {
    return request({
        url: `${$C.other}${$C.version}${$C.identification}/sensitiveWord/getPageList`,
        method: 'post',
        data
    })
}

//add
export function getSensitiveWordAdd(data) {
    return request({
        url: `${$C.other}${$C.version}${$C.identification}/sensitiveWord/add`,
        method: 'post',
        data
    })
}

// detele

export function getSensitiveWordDetele(data) {
    return request({
        url: `${$C.other}${$C.version}${$C.identification}/sensitiveWord/remove`,
        method: 'post',
        params: { id: data.id }
    })
}
//edit
export function getSensitiveWordEdit(data) {
    return request({
        url: `${$C.other}${$C.version}${$C.identification}/sensitiveWord/edit`,
        method: 'post',
        data
    })
}

//_________________________________________________基础设置

//list
export function getBaseConfigQueryList(data) {
    return request({
        url: `${$C.other}${$C.version}${$C.identification}/baseConfig/queryList`,
        method: 'post',
        data
    })
}

//save
export function getBaseConfigSaveBaseConfig(data) {
    return request({
        url: `${$C.other}${$C.version}${$C.identification}/baseConfig/saveBaseConfig`,
        method: 'post',
        data
    })
}

// __________________________________运营管理

// 首页轮播
//list
export function getBannerGetPageList(data) {
    return request({
        url: `${$C.other}${$C.version}${$C.identification}/banner/getPageList`,
        method: 'post',
        data
    })
}
//edit
export function getBannerUpdate(data) {
    return request({
        url: `${$C.other}${$C.version}${$C.identification}/banner/update`,
        method: 'post',
        data
    })
}
//add
export function getBannerAdd(data) {
    return request({
        url: `${$C.other}${$C.version}${$C.identification}/banner/add`,
        method: 'post',
        data
    })
}
//sort(上移下移)
export function getBannerSortBanner(data) {
    return request({
        url: `${$C.other}${$C.version}${$C.identification}/banner/sortBanner`,
        method: 'post',
        data
    })
}
// detele

export function getBannerDetele(data) {
    return request({
        url: `${$C.other}${$C.version}${$C.identification}/banner/remove`,
        method: 'post',
        params: { id: data.id }
    })
}

//  获取促销活动具体开始时间24小时以内的
export function selectAboutOfBeginActivity(data) {
    return request({
        url: `${$C.activity}${$C.version}${$C.identification}/activitySchedule/selectAboutOfBeginActivity`,
        method: 'post',
        data
    })
}


// __________________________________数据中心
// 商家数据

//list

export function getShopStatisticsQueryPageList(data) {
    return request({
        url: `${$C.userCenter}${$C.version}${$C.identification}/shopStatistics/queryPageList`,
        method: 'post',
        data
    })
}

//  店铺数据中心详情

//detail
export function getShopStatisticsDataDetail(data) {
    return request({
        url: `${$C.userCenter}${$C.version}${$C.identification}/shopStatistics/dataDetail`,
        method: 'post',
        params: { id: data.id }
    })
}

// 销售统计
export function getBusinessOrderSaleTotal(data) {
    return request({
        url: `${$C.userCenter}${$C.version}${$C.identification}/shopStatistics/saleTotal`,
        method: 'post',
        data
    })
}
//  用户数据

//user query
export function getStatisticsQueryUserStatistics(data) {
    return request({
        url: `${$C.userCenter}${$C.version}${$C.identification}/statistics/queryUserStatistics`,
        method: 'post',
        data
    })
}
//shop query
export function getStatisticsQueryShopStatistics(data) {
    return request({
        url: `${$C.userCenter}${$C.version}${$C.identification}/statistics/queryShopStatistics`,
        method: 'post',
        data
    })
}

//  数据概览
export function getPlatformStatistics(data) {
    return request({
        url: `${$C.userCenter}${$C.version}${$C.identification}/platform/statistics`,
        method: 'get',
        data
    })
}
//  数据概览统计图
export function getPlatformStatisticalGraph(data) {
    return request({
        url: `${$C.userCenter}${$C.version}${$C.identification}/platform/statisticalGraph`,
        method: 'post',
        data
    })
}

//  _______________版本管理

//list
export function getPageListAppVersion(data) {
    return request({
        url: `${$C.other}${$C.version}${$C.identification}/appVersion/getPageList`,
        method: 'post',
        data
    })
}

//delete
export function deleteAppVersion(data) {
    return request({
        url: `${$C.other}${$C.version}${$C.identification}/appVersion/delete`,
        method: 'post',
        params: { id: data.id }
    })
}

// add
export function addAppVersion(data) {
    return request({
        url: `${$C.other}${$C.version}${$C.identification}/appVersion/add`,
        method: 'post',
        data
    })
}

// edit
export function updateAppVersion(data) {
    return request({
        url: `${$C.other}${$C.version}${$C.identification}/appVersion/update`,
        method: 'post',
        data
    })
}

//查询分类广告所属分类是否重复
export function classifyIsRef(data) {
    return request({
        url: `${$C.other}${$C.version}${$C.identification}/banner/queryRepetition`,
        method: 'post',
        params: { code: data.code }
    })
}

// 下载前十五统计接口
export function fifteenCountApi(data) {
    return request({
        url: `${$C.other}${$C.version}${$C.identification}/frontChannelStatistics/fifteenCount`,
        method: 'post',
        data,
        version: "1.1.0"
    })
}

// 查询渠道记录列表
export function frontChannelStatisticsList(data) {
    return request({
        url: `${$C.other}${$C.version}${$C.identification}/frontChannelStatistics/list`,
        method: 'post',
        data,
        version: "1.1.0"
    })
}

// 删除渠道
export function frontChannelStatisticsRemove(data) {
    return request({
        url: `${$C.other}${$C.version}${$C.identification}/frontChannelStatistics/remove`,
        method: 'post',
        params: { ids: data.ids },
        version: "1.1.0"
    })
}

// 创建渠道码
export function frontChannelStatisticsSaveCode(data) {
    return request({
        url: `${$C.other}${$C.version}${$C.identification}/frontChannelStatistics/saveCode`,
        method: 'post',
        data,
        version: "1.1.0"
    })
}

// 修改渠道名
export function frontChannelStatisticsSaveName(data) {
    return request({
        url: `${$C.other}${$C.version}${$C.identification}/frontChannelStatistics/saveName`,
        method: 'post',
        data,
        version: "1.1.0"
    })
}

//查看统计接口
export function frontChannelStatisticsSearchCount(data) {
    return request({
        url: `${$C.other}${$C.version}${$C.identification}/frontChannelStatistics/searchCount`,
        method: 'post',
        params: { id: data.id },
        version: "1.1.0"
    })
}

//根据日期查看统计接口
export function frontChannelStatisticsSearchCountSingle(data) {
    return request({
        url: `${$C.other}${$C.version}${$C.identification}/frontChannelStatistics/searchCountSingle`,
        method: 'post',
        data,
        version: "1.1.0"
    })
}