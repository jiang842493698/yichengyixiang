// pages/certificationApply/certificationApply.js
var Api = require('../../utils/api.js');
let _this
Page({

  /**
   * 页面的初始数据
   */
  data: {
    urls : [],
    billingInfos : "请输入纳税人识别号",
    companyNames : "请输入公司名称"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this
    let userInfo = wx.getStorageSync("userinfo")
    _this.setData({
      headicon: userInfo.headicon,
      name: userInfo.name,
      companyNames: userInfo.companyName == null ? "请输入公司名称" : userInfo.companyName,
      billingInfos: userInfo.invoiceInfo == null ? "请输入纳税人识别号" : userInfo.invoiceInfo,
      urls: JSON.parse(userInfo.img) == null ? [] : JSON.parse(userInfo.img),
    })
   
    _this.isSelect()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },
  isSelect(){
    let openid = wx.getStorageSync("openid")
    wx.request({
      url: Api.applicationUser(),
      method :"post",
      data : {
        openid
      },
      success : function(e){
        let data = e.data.data
        for(let d of data){
          d.businesslicenseurl = JSON.parse(d.businesslicenseurl)
        }
        
        _this.setData({
          list :data[0],
          urls: data[0].businesslicenseurl
        })
      }
    })
  },
  //输入公司名称
  companyName(e){
    console.log(e.detail.value)
    let companyName = e.detail.value
    _this.setData({
      companyName
    })
  },
  //输入纳税人识别号
  billingInfo(e){
    let billingInfo = e.detail.value
    _this.setData({
      billingInfo
    })
  },
  /**
   * 添加图片
   */
  tianjia() {
    
    _this.setData({
      urls: []
    })
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
              var datas = JSON.parse(res.data);

              console.log(_this.data.urls)
              _this.data.urls.push(datas.url);
              _this.setData({
                urls: _this.data.urls
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
  },
  /**
   * 长按图片删除
   */
  deleteImage(e) {
    _this.setData({
      urls : []
    })

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },
  /**
   * 认证
   */
  renzheng(){
    let userid = wx.getStorageSync("userid")
    let companyName = _this.data.companyName
    if (!companyName){
      wx.showModal({
        title: '警告',
        content: '公司名称不可以为空',

      })
      return
    } 
    let urls= _this.data.urls
    if (urls.length==0){
      wx.showModal({
        title: '警告',
        content: '营业执照不可以为空',
      })
      return
    }
    let billingInfo = _this.data.billingInfo
    // console.log(billingInfo)
    var reg = /^[0-9a-zA-Z]+$/;
    if (!billingInfo || !reg.test(billingInfo) || (billingInfo.length < 15 || billingInfo.length >20)){
      wx.showModal({
        title: '警告',
        content: '纳税人识别号格式不正确！',
      })
      return
    }
    wx.request({
      url: Api.postAuthenticate(),
      method : "post",
      data : {
        companyName: companyName,
        userid: userid,
        businesslicenseurl : urls,
        applicationStatus : 1,
        status : 1,
        billingInfo: billingInfo
      },
      success : function(e){
        if(e.data.success==true){
          wx.showToast({
            title: '认证已发送',
            success : function(e){
              setTimeout(function(){
                aaa()
              },3000)
            }
          })
          let aaa = function(){
            wx.navigateBack({
              delta: 1
            })
          }
         
        }
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})