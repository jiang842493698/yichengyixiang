var Api = require('utils/api.js');

//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    
    // wx.setStorageSync('logs', logs)
    wx.login({
      success:function(e){
        
        let code = e.code
        
        wx.request({
          url:"https://www.yicunyiwang.cn/login/wxlogin",
          // url:"http://localhost:81/login/wxlogin",

          data: {code},
          method:"post",
          header: {
            'content-type': 'application/json'
          },
          success : function(e){
            //console.log(e.data)
            let openid = e.data.data.openid
            wx.setStorageSync("openid", openid);
            wx.setStorageSync("unionid", e.data.data.unionid);
            // wx.request({
            //   url: Api.saveUser(),
            //   method: "post",
            //   data: {
            //     // openid,
            //     unionid: e.data.data.unionid,
                
            //     openid: openid,
               
            //   },
            //   success: function (e) {
            //     let data = e.data
            //     if (data.success) {

            //       let userid = data.data.id
            //       wx.setStorageSync("userid", userid)

            //       let userinfo = wx.getStorageSync("userid")

                  
            //     }
            //   }
            // })
              // wx.request({
              //   url: Api.getUserOpenid(openid),
              //   method: 'get',
              //   success : function(e){
              //     let data = e.data.data
              //     if (data.length==0){
              //       wx.request({
              //         url: Api.touristsLogin(),
              //         method : 'post',
              //         data :{
              //           openid
              //         },
              //         success : function(e){
                        
              //         }
              //       })
              //     }
              //   }
              // })
            
            // wx.request({
            //   url: Api.getUserOpenid(openid),
            //   method: 'get',
            //   header: {
            //     'Accept': 'application/json'
            //   },
            //   success: function (res) {
            
            //     if (res.data.data.length != 0) {
            //       // wx.setStorageSync("userid", id)
            //       let data = res.data.data
            //       wx.setStorageSync("userid", data[0].id)
            //       if (!data[0].mobile || data[0].mobile==""){
            //         wx.navigateTo({
            //           // url: '/pages/registration/login?data=mobileisnull',
            //           url: 'pages/login/index'
            //         })
            //       }else{
            //         wx.setStorageSync("mobile", data[0].mobile)
            //       }
            //     }
            //     else{

            //       wx.navigateTo({
            //         // url: '/pages/registration/login?data=codeisnull',
            //         url: '/pages/login/index'
            //       })
            //     }
            //   }
            // })
          }
        })
      }
    })
  }, 
  
  // getUserInfo:function(cb){
  //   var that = this;
  //   if(this.globalData.userInfo){
  //     typeof cb == "function" && cb(this.globalData.userInfo)
  //   }else{
  //     //调用登录接口
  //     wx.login({
  //       success: function () { 
  //         wx.getUserInfo({
  //           success: function (res) {
  //             that.globalData.userInfo = res.userInfo;
  //             that.getUserOpenid();
  //             typeof cb == "function" && cb(that.globalData.userInfo)
  //           }
  //         })
  //       }
  //     })
  //   }
  // },
  globalData:{
    userInfo:null
  },
  cardDatas:[],
  // getUserOpenid:function(){
  //   var that=this;
    
  //   wx.login({
  //     //获取code
  //     success: function (res) {
        
  //       var code = res.code //返回code
        
  //       wx.request({
  //         url:"https://www.yicunyiwang.cn/login/wxlogin",
  //         // url:"http://localhost:81/login/wxlogin",

  //         data: {code},
  //         method:"post",
  //         header: {
  //           'content-type': 'application/json'
  //         },
  //         success: function (res) {
  //             var openid = res.data.data.openid //返回openid
  //             that.globalData.userInfo.openid = openid;
  //             wx.setStorageSync("openid", openid)
  //             //登录用户判断
  //             wx.request({
  //               url: Api.getUserOpenid(that.globalData.userInfo.openid),
  //               method: 'get',
  //               header: {
  //                 'Accept': 'application/json'
  //               },
  //               success: function (res) {
  //                 if (res.data.data.length != 0) {
  //                   // wx.setStorageSync("userid", id)
                   
  //                   let data = res.data.data
  //                   wx.setStorageSync("userid", data[0].id)
  //                   if (!data[0].mobile || data[0].mobile==""){
  //                     wx.navigateTo({
  //                       url: '/pages/registration/login?data=mobileisnull',
  //                     })
  //                   }else{
  //                     wx.setStorageSync("mobile", data[0].mobile)
  //                   }
  //                 }
  //                 else{
                    
  //                   wx.navigateTo({
  //                     url: '/pages/registration/login?data=codeisnull',
  //                   })
  //                 }
  //               }
  //             })
  //           }
            
          
  //       })
  //     }
  //   })
  // }
})