// pages/registration/login.js
var app = getApp()
var mydata = require('../../utils/data')
var util = require('../../utils/util')
var Api = require('../../utils/api.js');
let data
let type
Page({
  data: {
    urls: []
  },
  onLoad: function (option) {
    type = option.type
    var that = this;
    console.log(option)
    that.setData({
      timeCountDownTop: '获取验证码',
      counting: true,
    })
    data = option.data
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    });
    let openid = wx.getStorageSync("openid")
    wx.request({
      url: Api.getUserOpenid(),
      method: 'post',
      data: {
        openid
      },
      success : function(e){
        if(e.data.data.length>0){
          that.setData({
            isSelect: true
          })
        }else{
          that.setData({
            isSelect : false
          })
        }
        
      }
    })


    
    let userInfo = wx.getStorageSync("userInfo")
    that.setData({
      userInfo
    })
    // that.getCode();


  },
  onShow(){
    
  },
  onPhone(e){
    var that = this;
    console.log(e.detail.value)
    let value = e.detail.value
    // var reg = /^1[34578][0-9]{9}$/;
    // return reg.test(value)
    
    // if(!reg.test(value)){
    //   wx.showModal({
    //     title: '警告',
    //     content: '手机号格式错误',
    //   })
    // }else{
      that.setData({
        phone : value
      })
    // }

  },
  onCode(e){
    let code = e.detail.value
    this.setData({
      code
    })
  },
  testCode(){
    let _this = this
    let code = _this.data.code
    let phone = _this.data.phone
    wx.request({
      url: Api.getCode(),
      method : "post",
      data : {
        phone,
        code
      },
      success : function(e){
        console.log(e)
      }
    })


  },
  getCode(e){
    var that = this;
    if (!that.data.phone){
      wx.showModal({
        title: '警告',
        content: '手机号格式错误',
      })
      return
    }
    let phone = that.data.phone
    wx.request({
      url: Api.getSms(),
      method : "post",
      data : {
        phone
      },
      success:function(e){
        console.log(e)
        if(!e.data.success){
          wx.showModal({
            title: '警告',
            content: e.data.data,
          })
        }
        let Countdown = 60
        that.countDown(that, Countdown)
      }
    })
  },
  countDown(that, count) {
     if(count == 0) {
       that.setData({
         timeCountDownTop: '获取验证码',
         counting: true,
       })
       return;
     }
    that.setData({
       counting: false,
       timeCountDownTop: count + '秒后重新获取',
     })
    setTimeout(function() {
       count--;
       that.countDown(that, count);
     }, 1000);
},
  wxlogins(e) {
    let that = this
    let info = e.detail.userInfo
    let code = that.data.code
    let phone = that.data.phone
    wx.request({
      url: Api.getCode(),
      method: "post",
      data: {
        phone,
        code
      },
      success: function (e) {
        let getCode = e.data.success
        if (getCode == false) {
          wx.showModal({
            title: '警告',
            content: e.data.data,
          })
          return
        }

        
        that.getUserOpenId(function (openid, unionid) {
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
                wx.navigateBack({
                  delta: 1
                })
               
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
                    mobile: phone
                  },
                  success: function (e) {
                    let data = e.data
                    if (data.success) {

                      let userid = data.data.id
                      wx.setStorageSync("userid", userid)

                      let userinfo = wx.getStorageSync("userid")
                      wx.navigateBack({
                        delta : 1
                      })
                      
                    }
                  }
                })
              }
            }
          })
        })

      },
    })

    

  },
  getUserOpenId: function (callback) {
    // wx.setStorageSync("openid", null)
    let openid = wx.getStorageSync("openid");
    let unionid = wx.getStorageSync("unionid");
    // openid='';
    if (openid == '' || openid == null || openid == undefined) {
      wx.login({
        success: function (e) {

          let code = e.code

          wx.request({
            url: "https://www.yicunyiwang.cn/login/wxlogin",
            //url: "http://localhost:81/login/wxlogin",

            data: { code },
            method: "post",
            header: {
              'content-type': 'application/json'
            },
            success: function (e) {
              console.log("openid为")
              console.log(e)
              let openid = e.data.data.openid;
              callback(openid, e.data.data.unionid);
            }
          })
        }
      })
    } else {
      callback(openid, unionid);
      //console.log(openid, unionid)
    }
  },
  
  formSubmit: function (e) {
    
    var that = this;
    // var iphone = e.detail.value.iphone;
    var invoice = e.detail.value.invoice;
    let invoiceInfo = e.detail.value.invoiceInfo;
    let code = that.data.code
    let phone = that.data.phone
      wx.request({
        url: Api.getCode(),
        method: "post",
        data: {
          phone,
          code
        },
        success: function (e) {
          let getCode = e.data.success
          if (getCode==false){
            wx.showModal({
              title: '警告',
              content: e.data.data,
            })
            return
          }
          
          let openid = wx.getStorageSync("openid")
          
            wx.request({
              url: Api.updateUser(),
              method: 'post',
              data: {
                mobile: phone,
                invoice: invoice,
                invoiceInfo,
                headicon: that.data.userInfo.avatarUrl,
                sex: that.data.userInfo.gender,
                openid: openid,
                name: that.data.userInfo.nickName,
                img: that.data.urls,                                                                  
              },
              header: {
                'Accept': 'application/json'
              },
              success: function (res) {
                if (res.data.data != {}) {
                  wx.setStorageSync("mobile", res.data.data.mobile)
                  
                  wx.request({
                    url: Api.getUserOpenid(),
                    method: 'post',
                    data: {
                      openid
                    },
                    success: function (e) {
                      let list = e.data.data[0]
                      console.log(list)
                      wx.setStorageSync("userinfo", list)
                      wx.setStorageSync("mobile", list.mobile)
                      wx.setStorageSync("userid", list.id)
                    }
                  })



                  wx.navigateBack({
                    delta :1
                  })
                  
                }
              }
            })
          // } else {
            // wx.request({
            //   url: Api.saveUser(),
            //   method: 'post',
            //   data: {
            //     mobile: iphone,
            //     invoice: invoice,
            //     invoiceInfo,
            //     headicon: that.data.userInfo.avatarUrl,
            //     sex: that.data.userInfo.gender,
            //     openid: openid,
            //     name: that.data.userInfo.nickName,
            //     img: that.data.urls[0],

            //   },
            //   header: {
            //     'Accept': 'application/json'
            //   },
            //   success: function (res) {
            //     if (res.data.success == 1) {
            //       wx.showToast({
            //         title: '提交成功',
            //         icon: 'succes',
            //         duration: 1000,
            //         mask: true
            //       })
                    
            //       wx.setStorageSync("userid", res.data.data.id)
            //       wx.switchTab({
            //         url: '/pages/index/index',
            //       })

            //       wx.navigateBack({ changed: true });
                  
            //     } else {
            //       wx.showToast({
            //         title: '提交失败',
            //         icon: 'succes',
            //         duration: 1000,
            //         mask: true
            //       })
            //     }
            //   }
            // })
          // }
          
        }
      })
  },
  //添加Banner  
  bindChooiceProduct: function () {
    var that = this;
    var urls = [];
    wx.chooseImage({
      count: 1,  //最多可以选择的图片总数  
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        var tempFilePaths = res.tempFilePaths;
        //启动上传等待中...  
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 10000
        })
        var uploadImgCount = 0;
        for (var i = 0, h = tempFilePaths.length; i < h; i++) {
          wx.uploadFile({
            url: Api.uploadFile(),
            filePath: tempFilePaths[i],
            name: 'uploadfile_ant',
            formData: {
              'imgIndex': i
            },
            header: {
              "Content-Type": "multipart/form-data"
            },
            success: function (res) {
              uploadImgCount++;
              var data = JSON.parse(res.data);
              that.data.urls.push(data.url);
              that.setData({
                urls: that.data.urls
              });
              //如果是最后一张,则隐藏等待中
              
              if (uploadImgCount == tempFilePaths.length) {
                wx.hideToast();
              }
            },
            fail: function (res) {
              wx.hideToast();
              wx.showModal({
                title: '错误提示',
                content: '上传图片失败',
                showCancel: false,
                success: function (res) { }
              })
            }
          })
        }
      }
    })  
  }
})  
