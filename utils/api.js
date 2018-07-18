'use strict';
 
 
var HOST_URI = 'https://www.yicunyiwang.cn/';
// var HOST_URI = 'http://localhost:81/';
 
function _obj2uri(obj){
	return Object.keys(obj).map(function(k) {
		return encodeURIComponent(k) + "=" + encodeURIComponent(obj[k]);
  }).join('&'); swiper
  } 

 
function _getHotestTopic(userid) {
  return HOST_URI + 'market/list?userid=' + userid;
}

function _postgoods(){
  return HOST_URI + 'scenicspot/postgoods'
}

function _putgoods() {
  return HOST_URI + 'scenicspot/putgoods'
}

function _getHotestTopic(condition) {
  let str =""
  if (condition.userid){
    str+='userid=' + condition.userid+"&"
  }
  if (condition.pageIndex && condition.pageSize) {
    str +='pageIndex=' + condition.pageIndex + "&pageSize=" + condition.pageSize+"&"
  }
  if (condition.process){
    str +='process=' + condition.process
  }
  return HOST_URI + 'market/list?' + str;
 
}
 
function _myClient(){
  
  return HOST_URI + 'mine/myClient'
}

function _orderClient(){
  return HOST_URI + 'mine/orderClient'
}

function _getIndexData1(){
  return HOST_URI +"scenicspot/recommend";
}

function _getGoodTypeList(){
  return HOST_URI + "scenicspot/getgoodtypes";
}

function _getSpotList(){
  return HOST_URI +"scenicspot/sceniclist";
}
function _putgoodsdetil() {
  return HOST_URI + "scenicspot/putgoodsdetil";
}

function _touristsLogin(){
  return HOST_URI +"login/touristsLogin"
}
/**
 * 月售票务
 */
function _getMonthlySave() {
  return HOST_URI + "scenicspot/monthlySave";
}

function _getSearch(){
  return HOST_URI+"scenicspot/shoplist";
}

function _getgoodsdetil(){
  return HOST_URI + "scenicspot/getgoodsdetil";
}

//获取短信
function _getSms() {
  return HOST_URI + "sms/getSms";
}
function _postSms(){
  return HOST_URI + "sms/postSms";
}
function _getGoodsDetail(condition){
  let str = ""
  if (condition.id){
    str += "id=" + condition.id + "&date="+condition.dt;
  }
  if (condition.roleid){
    str += "role=" + condition.roleid + "&"
  }
  if (condition.sid){
    str += "sid=" + condition.sid + "&"
  }
  if (condition.userid){
    str += "userId=" + condition.userid + "&"
  }
  if (condition.spotid){
    str += "spotid=" + condition.spotid+"&"
  }
  return HOST_URI + "scenicspot/scenicdetil?"+str;
}
function _getPayByid(){
  return HOST_URI + "pay/getPayByid"
}
function _getTopicInfo(id){
  return HOST_URI + "market/detail?id=" + id;
}

function _getMarketTags(){
  return HOST_URI + "market/tags";
}

function _saveTopicInfo(){
  return HOST_URI + "market/save";
}

function _getListBySpot(id){
  return HOST_URI + "scenicspot/shoplist?sid="+id;
}
/**
 * 添加商品
 */
function _postSite() {
  return HOST_URI + "scenicspot/addticketlist"
}
function _uploadFile(){
  return HOST_URI + "data/upload";
}
/**
 * 获取和用户相关联的goodId
 */
function _getAuthority() {
  return HOST_URI + "scenicspot/getAuthority";
}
function _saveFeature(){
  return HOST_URI + "scenicspot/addsceniclist";
}

function _getUserWxLogin(){
  return HOST_URI + "login/wxlogin";
}

function _getUserAuth() {
  return HOST_URI + "login/auth";
}

function _getMyOrder(condition){
  return HOST_URI + "mine/mineorder";
}

function _getSpotOrderList(spotid){
  return HOST_URI + "mine/spotorder?spotid=" + spotid;
}

function _generate_exchange(){
  return HOST_URI + "pay/generate_exchange";
}

function _updatePayById() {
  return HOST_URI + "pay/updatePayById";
}


function _saveUser() {
  return HOST_URI + "login/saveUser";
}
function _getUserOpenid(){
  
  return HOST_URI + "login/findUserOpenid";
}
//设置折扣
function _setDisCount(){
  return HOST_URI + "active/setDisCount";
}
//获取折扣
function _getDisCount(){
  return HOST_URI + "active/getDisCount";
}

//查询是否拥有权限
function _findUserAuthority(id) {
  return HOST_URI + "login/findUserAuthority?userid=" + id;
}

function _getEventInfo(id){
  return HOST_URI + "market/findEvent?id=" + id;
}

function _updateUser(){
  return HOST_URI + "login/updateUser";
}

/**活动详情 */
function _getReplies(){
  return HOST_URI + "active/getActive";
}
/**
 * 申请操作入驻
 */
function _postApply() {
  return HOST_URI + "apply/applySettle";
}
/**
 * 查询申请信息
 */
function _getSettle(){
  return HOST_URI + "apply/getSettle";
}

/**
 * 新增购物车
 */
function _postCart(){
  return HOST_URI + "cart/addToShoppingcart";
}
/**
 * 修改购物车
 */
function _updateCard(){
  return HOST_URI + "cart/uodateToShoppingcart";
}

/**
 * 查询购物车
 */
function _getCart(userid, status){
  let str = ""
  if (status!=null){
    str += "&status=" + status
  }
  if (userid == '' || userid==null){
    userid = null
  }
  return HOST_URI + "cart/shoppingcart?userid=" + userid+""+str
}
/**
 * 修改购物车
 */
function _updateCart() {
  return HOST_URI + "cart/updateShoppingcart"
}

/**员工消费详情 */
function _postClient(){
  return HOST_URI + "mine/postClient"
}

function _putSettel(){
  return HOST_URI + "apply/putSettel"
}
/**
 * 新增景区
 */
function _insertSpot(){
  return HOST_URI + "apply/insertSpot"
}

/**
 * 活动详情
 */
function _eventInfo() {
  return HOST_URI + "active/eventInfo"
}
/**
 * 查询关联景点
 */
function _findUserRole(roleid){
  return HOST_URI + "login/findUserRole?roleid=" + roleid
}

function _getCode(){
  return HOST_URI + "login/getCode"
}

/**
 * 订单管理
 */
function _orderManage(userid){
  return HOST_URI + "login/orderManage?roleid=" + userid
}

/**
 * 查询地址
 */
function _selectAddress(){
  return HOST_URI + "address/getAddress"
}
function _activeDate(){
  return HOST_URI + "active/getActiveDate"
}
function _updateOrderPay(){
  return HOST_URI + "mine/deleteorder"
}
function _getIntegral(){
  return HOST_URI + "mine/getIntegral"
}
function _updatescenicdetil(){
  return HOST_URI + "scenicspot/updatescenicdetil"
}
/**用户对应的景区 */
function _getUserSpot(){
  return HOST_URI + "mine/getUserSpot"
}
/**获取商品信息+userid+折扣+票务 */
function _goodsInfo(){
  return HOST_URI + "scenicspot/getGoodsUser"
}
 
 
/**
 * 审核渠道商信息
 */
function _applicationUser(){
  return HOST_URI + "apply/applyAuthenticate"
}
/**
 * 审核渠道商信息
 */
function _setAuthenticate(){
  return HOST_URI +"apply/setAuthenticate"
}
/**
 * 添加认证
 */
function _postAuthenticate(){
  return HOST_URI + "apply/postAuthenticate"
}
/**
 * 处理需求
 */
function _updateSave(){
  return HOST_URI + "market/updateSave"
}
/**
 * 查询活动类型
 */
function _getActiveType(){
  return HOST_URI +"active/getActiveType"
}
/**
 * 设置景区活动
 */
function _postEvent(){
  return HOST_URI + "active/postEvent"
} 
/**
 * 设置满减活动
 */
function _postReductionFull() {
  return HOST_URI + "active/postReductionFull"
}
/**
 * 设置立减活动
 */
function _postDecrease() {
  return HOST_URI + "active/postDecrease"
}
/**
 * 获取红包信息
 */
function _getCard(){
  return HOST_URI + "active/getCard"
}
/**
 * 查看是否是新人
 */
function _getPay() {
  return HOST_URI + "pay/getPay"
}
/**
 * 
 */

function _getexchangeById() {
  return HOST_URI + "pay/getexchangeById"
}

function _getSpotManagerUserList(spotid){
  return HOST_URI + "scenicspot/getspotmanagerusers?spotid=" + spotid
}

function _delSpotManager(userid,spotid){
  return HOST_URI + "user/delSpotManager?spotid=" + spotid+"&userid="+userid
}

function _findWeiXinUserList(){
  return HOST_URI + "user/findWeiXinUserList"
}

function _findEyouOpenid(unionid){
  return HOST_URI + "user/findEyouOpenid?unionid=" + unionid
}

function _setEyouUseropenid(){
  return HOST_URI + "user/setEyouUseropenid"
}

function _setDiscount(){
  return HOST_URI + "user/setDiscount";
}

//商家确认订单状态 
function _confirmOrderData(){
  return HOST_URI + "mine/confirmOrderData";
}

function _getThisDateByDtid(id,date,num){
  return HOST_URI + "scenicspot/getDetailByDate?id="+id+"&date="+date+"&num="+num;
}

module.exports = {
   getThisDateByDtid: _getThisDateByDtid,
   confirmOrderData: _confirmOrderData,
   setDiscount: _setDiscount,
   getSpotOrderList:_getSpotOrderList,
   delSpotManager: _delSpotManager,
  	getHotestTopic: _getHotestTopic,
    getGoodsDetail:_getGoodsDetail,
    getIndexData1: _getIndexData1,
    getSpotList:_getSpotList,
    getSearch:_getSearch,
    getTopicInfo: _getTopicInfo,
    getMarketTags: _getMarketTags,
    saveTopicInfo: _saveTopicInfo,
    getListBySpot:_getListBySpot,
    uploadFile: _uploadFile,
    saveFeature:_saveFeature,
    getUserWxLogin:_getUserWxLogin,
    getMyOrder: _getMyOrder,
    generate_exchange: _generate_exchange,
    saveUser:_saveUser,
    getUserOpenid: _getUserOpenid,
    getEventInfo: _getEventInfo,
    /**
     * 月售票务
     */
    getMonthlySave :_getMonthlySave,
    getUserAuth : _getUserAuth,
    updateUser: _updateUser,
    /**
     * 新增购物车
     */
    postCart: _postCart,
    getCart: _getCart,
    updateCart:_updateCart,
    /**
     * 申请操作
     */
    postApply:_postApply,
    /**
     * 活动详情
     */
    getReplies : _getReplies,
    eventInfo: _eventInfo,
    /**
     * 添加商品
     */
    postSite: _postSite,
    /**
     * 查询地址
     */
    selectAddress : _selectAddress,
    getAuthority :_getAuthority,
    activeDate: _activeDate,
    /**
     * 修改商品
     */
    updateCard:_updateCard,
    /**
     * 查询权限
     */
    findUserAuthority: _findUserAuthority,
    /**
     * 
     */
    findUserRole:_findUserRole,
    /**
     * 我的员工
     */
    myClient:_myClient,
    /**
     * 总金额
     */
    orderClient : _orderClient,
    /**
     * 员工消费详情
     */
    postClient: _postClient,
    /**
     * 获取短信
     */
    getSms:_getSms,
    /**
     *  验证短信信息
     */
    getCode : _getCode,
    /**
     * 游客登录
     */
    touristsLogin:_touristsLogin,
    postSms: _postSms,
    /**
     * 审核申请
     */
    getSettle:_getSettle,
    putSettel : _putSettel,
    /**
     * 新增景区
     */
    insertSpot:_insertSpot,
    /**
     * 删除订单
     */
    updateOrderPay: _updateOrderPay,
    /**
     * 查询积分
     */
    getIntegral:_getIntegral,
    /**
     * 修改场地信息
     */
    updatescenicdetil: _updatescenicdetil,
    /**
     * 订单管理
     */
    orderManage: _orderManage,
    /**
     * 用户对应的景区
     */
    getUserSpot: _getUserSpot,
    /**
 
     * 查询商品类型列表
     * 
     */
    getGoodTypeList: _getGoodTypeList,
    /*
     * 设置折扣
     */
    setDisCount:_setDisCount,
    /**获取折扣 */
    getDisCount : _getDisCount,
    /**
     * 获取用户商品详情
     */
 
    goodsInfo: _goodsInfo,
    /**
     * 渠道商审核查询
     */
    applicationUser: _applicationUser,
    /**
     * 渠道商审核
     */
    setAuthenticate:_setAuthenticate,
    //添加认证
    postAuthenticate : _postAuthenticate,
    //处理需求
    updateSave: _updateSave,
    getActiveType: _getActiveType,
    postEvent: _postEvent,
    postReductionFull:_postReductionFull,
    postDecrease: _postDecrease,
    getCard : _getCard,
    //查看是否是新人
    getPay: _getPay,
    getSpotManagerUserList: _getSpotManagerUserList,
    findWeiXinUserList: _findWeiXinUserList,
    findEyouOpenid: _findEyouOpenid,
    setEyouUseropenid: _setEyouUseropenid,
    postgoods: _postgoods,
    putgoods: _putgoods,
    getgoodsdetil: _getgoodsdetil,
    putgoodsdetil: _putgoodsdetil,
    getPayByid: _getPayByid,
    getexchangeById: _getexchangeById,
    updatePayById: _updatePayById
};