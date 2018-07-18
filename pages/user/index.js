var app = getApp();
var Api = require('../../utils/api.js');
let _this;
var fileData = require('../../utils/data.js')
Page( {
  data: {
    userInfo: {},
    isCharacter:false,
    navTopItems: fileData.orderImgs()
  },
  bindViewTap(){
    let userid = wx.getStorageSync('userid')
    let mobile = wx.getStorageSync('mobile')
    
    if (userid&&mobile){
      wx.navigateTo({
        url: '/pages/myInformation/myInformation',
      })
    }
   
  },

  onLoad: function() {
   
    _this = this
    let userinfo = wx.getStorageSync("userinfo")
    wx.setStorageSync("mobile", userinfo.mobile)
    wx.setStorageSync("userid", userinfo.id)
    // console.log(userinfo)
    if (userinfo){
      _this.setData({
        list: userinfo,
        dengluannniu: true
      })
    }else{
      _this.isCharacter()
    }
  },
  /**
   * 查询当前用户所对应的景区
   */
  onSelect(userid){
    // wx.request({
    //   url: Api.getUserSpot(),
    //   method :"post",
    //   data : {
    //     userid
    //   },
    //   success : function(e){
    //     console.log(e)
    //     let data = e.data.data[0]
    //     _this.setData({
    //       roleid : data.spotid
    //     })
        
    //   }
    // })
  },
  tuichu(){
    
    wx.removeStorageSync("userid")
    wx.removeStorageSync("userinfo")
    wx.removeStorageSync("mobile")
    wx.removeStorageSync("userInfo")
    _this.setData({
      dengluannniu: false,
      userListInfo : []
    })
    _this.onShow()
  },
  /**用户登录触发 */
  wxlogins(e){

    let info = e.detail.userInfo
    
    _this.getUserOpenId(function (openid, unionid){
      wx.request({
        url: Api.getUserOpenid(),
        method: "post",
        data: {
          openid
        },
        success: function (res) {
          console.log(res)
          let data = res.data.data[0]
          if (res.data.data.length > 0) {
            let userid = data.id
            let userInfo = data
            let mobile = data.mobile
            
            wx.setStorageSync("userinfo", userInfo)
            wx.setStorageSync("userid", userid)
            wx.setStorageSync("mobile", mobile)

            _this.onShow()
          } else {
            wx.request({
              url: Api.saveUser(),
              method: "post",
              data: {
                // openid,
                unionid: unionid,
                headicon: info.avatarUrl,
                sex: info.gender,
                openid: openid,
                name: info.nickName,
              },
              success: function (e) {
                let data = e.data
                if (data.success) {
                  
                  let userid = data.data.id
                  wx.setStorageSync("userid", userid)
                  
                  let userinfo = wx.getStorageSync("userid")
                  
                  _this.isCharacter()
                }
              }
            })
          }
        }
      })
    })
   
  },
  getUserOpenId:function(callback){
   // wx.setStorageSync("openid", null)
    let openid = wx.getStorageSync("openid");
    let unionid = wx.getStorageSync("unionid");
   // openid='';
    if (openid == '' || openid == null||openid==undefined) {
      wx.login({
        success: function (e) {

          let code = e.code

          wx.request({
             url:"https://www.yicunyiwang.cn/login/wxlogin",
            //url: "http://localhost:81/login/wxlogin",

            data: { code },
            method: "post",
            header: {
              'content-type': 'application/json'
            },
            success: function (e) {

              let openid = e.data.data.openid;
              callback(openid, e.data.data.unionid);
            }
          })
        }
      })
    }else{
      callback(openid, unionid);
 
    }
  },
  onShow:function(){
    let that = this
    let userinfo = wx.getStorageSync("userinfo")
    
      _this.isCharacter()
 
  },
  isCharacter(){
    let _this = this
    let openid = wx.getStorageSync("openid")
    let userid = wx.getStorageSync("userid")
   
    if (userid == "" || userid == null){
      
      let list = {
        name : "未登录",
        description :"无个人资料",
        dengluannniu : false
      }
      _this.setData({
        list
      })
    }else{
      wx.request({
        url: Api.getUserOpenid(),
        method: 'post',
        data: 　{
          openid
        },
        success: function (e) {
          let data = e.data.data[0]
          if (e.data.success) {
            console.log(e)
            if (data.id) {

              // wx.setStorageSync("userid", data.id)
              wx.setStorageSync("mobile", data.mobile)
              wx.setStorageSync("userinfo", data)
              let mobile = wx.getStorageSync("mobile")
              if (mobile == "" || mobile==null){
                wx.navigateTo({
                  url: '/pages/registration/login',
                })
              }
              
              wx.request({
                url: Api.findUserAuthority(data.id),
                method: "get",
                success: function (res) {
                  let userListInfos = res.data.operators;
                  _this.setData({
                    userListInfo: userListInfos,
                    spotid:res.data.spotid
                  })
                }
              })
            }
            _this.setData({
              list: data,
              dengluannniu: true
            })
          }
         
        }
      })
    }
   
  },
  
  active_page:function(e){
    var that = this
    var name = e.currentTarget.dataset.name;
    let openid = wx.getStorageSync("openid")
    let userid = wx.getStorageSync("userid")
    let mobile = wx.getStorageSync("mobile")
    
    if(name=='场地管理'){
      wx.navigateTo({
        url: '/pages/goods_manage/manage?roleid=' + _this.data.spotid ,
      })
 
    }else
    if (name == '我的订单') {
      
      if (openid!=null && userid!=null && mobile!=null){
        wx.navigateTo({
          url: '/pages/myorder/myorder?userId=' + userid
        })
      }else{
          wx.navigateTo({
            url: '../registration/login'
          })
        }
    } else
    if (name == '我的积分') {
      if (openid != null && userid != null && mobile != null) {
        wx.navigateTo({
          url: '/pages/integral/integral?userid=' + userid
        })
      } else {
        wx.navigateTo({
          url: '../registration/login'
        })
      }   
    } else
    if(name == "我的需求"){
      if (openid != null && userid != null && mobile != null) {
        wx.navigateTo({
          url: '/pages/market/market'
        })
      }else{
        wx.navigateTo({
          url: '../registration/login'
        })
      }
    } else
    if (name == "客户管理") {
      wx.navigateTo({
        url: '/pages/management/management?roleid=' + _this.data.spotid
      })
    } else
    if (name == "订单管理") {
      wx.navigateTo({
        url: '/pages/orderManages/orderManages?roleid=' + _this.data.spotid
     
      })
    } else
    if (name == "入驻审核") {
      wx.navigateTo({
        url: '/pages/Review/Review'
      })
    }
    else
    if (name == "系统配置") {
      wx.navigateTo({
        url: '/pages/system/system'
      })
    } else
    if (name == '供应商审核'){
      wx.navigateTo({
        url: '/pages/userverify/userverify',
      })
    } else
    if (name =="我的用户认证"){
      wx.navigateTo({
        url: '/pages/certificationApply/certificationApply',
      })
    } else
    if (name =="我的景区认证"){
      wx.navigateTo({
        url: '/pages/myspot/myspot',
      })
    } else
    if(name=="需求管理"){
      wx.navigateTo({
        url: '/pages/demandManage/demandManage',
      })
    } else
    if (name == "活动管理") {
      wx.navigateTo({
        url: '/pages/activeManage/activeManage',
      })
    }
  },
  navToorder:function(e){
    var title = e.currentTarget.dataset.title;
    var id = e.currentTarget.dataset.id;
    let openid = wx.getStorageSync("openid")
    let userid = wx.getStorageSync("userid")
    let mobile = wx.getStorageSync("mobile")
    if (openid != null && userid != null && mobile != null) {
      wx.navigateTo({
        url: '/pages/myorder/myorder?id=' + id+'&title='+title
      })
    } else {
      wx.navigateTo({
        url: '../registration/login'
      })
    }

  }
})