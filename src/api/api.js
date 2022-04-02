import { getAction, postAction } from '@/api/manage'
import $C from '@/utils/config'
//  前端用户管理
const getUserList = (params) => postAction(`${$C.identification}${$C.version}/frontUser/list`, params);

//请求七牛图片服务器token



const getQiniuToken = (data) => getAction(`${$C.identification}/qiniu/token`, data);

//  文件上传
const filesUpload = (data) => postAction(`${$C.auth}${$C.version}/file/upload`, data);



//  查询模块列表
const getAppmodulesSelectModulesList = (data) => getAction(`${$C.identification}${$C.version}/appmodules/appmodulesSelectModulesList/${data.modulesCode}`, data);

//  获取字典组件下拉数据
const getSelectDictDataList = (data) => getAction(`${$C.other}${$C.identification}/sysDict/queryByTip`, data);

// 查找积分明细信息
const getSystemDetailList = (data) => postAction(`${$C.identification}${$C.version}/system/detail/list`, data)
// 查找设备登陆信息
const getFrontUserLoginPhoneList = (data) => postAction(`${$C.identification}${$C.version}/frontUser/loginPhoneList`, data)
// 封禁设备
const getFrontUserSavePhoneBanned = (data) => postAction(`${$C.identification}${$C.version}/frontUser/savePhoneBanned`, data)

//  投诉处理获取数据
const getFrontComplaintAccountBanned = (data) => postAction(`${$C.identification}${$C.version}/front/complaint/accountBanned/${data.id}`, data)

//  帮助中心分类管理
const getSystemHelpCategoryList = (data) => postAction(`${$C.identification}${$C.version}/system/helpCategory/list`, data)

//内链信息
const getAppmodulesInLinkList = (data) => postAction(`${$C.identification}${$C.version}/appmodules/inLinkList`, data)


//  pc广告管理获取对应下拉信息
const getAppmodulesSelectModulesListtwo = (data) => postAction(`${$C.identification}${$C.version}/appmodules/selectModulesListtwo/${data.page}`, data)


//  优惠券选择列表信息
const getSystemDistributeCouponList = (data) => postAction(`${$C.identification}${$C.version}/system/distribute/couponList`, data)


//  购买意向分类接口
const getClassifyList = (data) => postAction(`${$C.userCenter}${$C.version}${$C.identification}/userBuyIntention/getClassifyList`, data)


//  后台类目管理tree
const getBackgroundClassifyList = (params) => postAction(`${$C.goods}${$C.version}${$C.identification}/goodsClassify/queryClassify4LevelTwo`, params);

const getGoodsList = (params) => postAction(`${$C.activity}${$C.version}${$C.identification}/activityRushGoods/queryRushGoodsTimeList`, params);
const usaStatesDataAPI = (params) => getAction(`${$C.other}${$C.version}${$C.identification}/usStates/statesData`, params);


export {
  getUserList,
  getQiniuToken,
  getAppmodulesSelectModulesList,
  getSelectDictDataList,
  getSystemDetailList,
  getFrontUserLoginPhoneList,
  getFrontUserSavePhoneBanned,
  getFrontComplaintAccountBanned,
  getSystemHelpCategoryList,
  getAppmodulesInLinkList,
  getAppmodulesSelectModulesListtwo,
  getSystemDistributeCouponList,
  getClassifyList,
  getBackgroundClassifyList,
  getGoodsList,
  filesUpload,
  usaStatesDataAPI
}