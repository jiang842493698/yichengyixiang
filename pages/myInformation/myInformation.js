// pages/myInformation/myInformation.js
var app = getApp();
var Api = require('../../utils/api.js');
let _this
let company = null
let description = null
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this
    _this.setData({
      urls:[]
    })
    console.log(_this.data.urls)
    _this.isCharacter()
  },
  companyName(e){
    console.log(e.detail.value)
    company = e.detail.value
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  description(e){
    description = e.detail.value
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },
  bindconfirm(){},
  submit(){
    let openid = wx.getStorageSync("openid")
    wx.request({
      url: Api.updateUser(),
      method: 'post',
      data: {
        companyName: company,
        description: description,
        openid,
        img : _this.data.urls
      },
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        let data = res.data.data
        wx.navigateBack({
          delta:1
        })

      }
    })
  },
  isCharacter() {
    
    let openid = wx.getStorageSync("openid")
    wx.request({
      url: Api.getUserOpenid(),
      method: 'post',
      data:{
        openid
      },
      success: function (e) {
        let data = e.data.data[0]
        console.log(data)
        let image = JSON.parse(data.img)
        
        if (data.headicon==null){
          _this.setData({
            isAuthorized : false
          })
        }else{
          _this.setData({
            isAuthorized: true
          })
        }
        
        let name = data.name
        let headicon = data.headicon
        if (e.data.success) {
          _this.setData({
            list: data,
            urls: image == null ? [] : image,
            name,
            headicon,
            companyName: data.companyName
          })
        }
      }
    })
  },
  tianjia() {
    console.log(_this.data.urls)
    // var that = this;
    // var urls = [];
    _this.setData({
      urls : []
    })
    wx.chooseImage({
      count: 9,  //最多可以选择的图片总数  
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
  deleteImage(e){
    console.log(e.currentTarget.dataset.item)
    let item = e.currentTarget.dataset.item
    let urls = _this.data.urls
    let aaa = urls.filter(e=>e==item)
    console.log(aaa)

  },
  wxchatImage(e){
    
    let info = e.detail.userInfo

    console.log(info)
    console.log(e.detail)
    let openid = wx.getStorageSync("openid")
    wx.request({
      url: Api.updateUser(),
      method: 'post',
      data: {
        headicon: info.avatarUrl,
        sex: info.gender,
        openid: openid,
        name: info.nickName,
      },
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        let data = res.data.data
        _this.setData({
          headicon: data.headicon,
          name: data.name,
          isAuthorized : true
        })

      }
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