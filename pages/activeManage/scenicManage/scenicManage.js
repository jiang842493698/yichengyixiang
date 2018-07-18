// pages/activeManage/scenicManage/scenicManage.js
var util = require('../../../utils/util')
var Api = require('../../../utils/api.js');
let _this
let id
let spotid
let type
Page({

  /**
   * 页面的初始数据
   */
  data: {
    urls : [],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this
    id = options.id
    spotid = options.spotid
    type = options.type
    // console.log(type)
    _this.setData({
      type
    })
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
  tianjia() {
    _this.setData({
      urls: []
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
  manjian(e){
    let value = e.detail.value
    _this.setData({
      reductionFull: value
    })
  },
  jianshao(e){
    let value = e.detail.value
    _this.setData({
      cutback: value
    })
    
  },
  lijianstart(e){
    let value = e.detail.value
    _this.setData({
      startDecrease: value
    })
  },
  lijianend(e) {
    let value = e.detail.value
    _this.setData({
      endDecrease: value
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
  tianjiahuodong(){
    let activeTitle = this.data.activeTitle
    let activeInfo = this.data.activeInfo
    if ((!activeTitle) || activeTitle == "") {
      wx.showModal({
        title: '警告',
        content: '标题不能为空',
      })
      return
    }
    if ((!activeInfo) || activeInfo == "") {
      wx.showModal({
        title: '警告',
        content: '活动详情不能为空',
      })
      return
    }
    if(type==1){
      let urls = this.data.urls[0]
      if (!urls) {
        wx.showModal({
          title: '警告',
          content: '图片不能为空',
        })
        return
      }
      
      _this.activePost(urls, activeTitle, activeInfo)
    }
    if(type==2){
      let reductionFull = _this.data.reductionFull
      let cutback = _this.data.cutback
      if (!reductionFull){
        wx.showModal({
          title: '警告',
          content: '请输入满减额',
        })
      }
      if (!cutback) {
        wx.showModal({
          title: '警告',
          content: '请输入满减额',
        })
      }
      _this.manjianactive(activeTitle, activeInfo, reductionFull, cutback)
    }
    if (type == 3){
      let startDecrease = _this.data.startDecrease
      // let endDecrease = _this.data.endDecrease
      _this.lijian(activeTitle, activeInfo, startDecrease, endDecrease)
    }
   
  },
  //景区活动
  activePost(urls, activeTitle, activeInfo){
    

    wx.request({
      url: Api.postEvent(),
      method: "post",
      data: {
        icon: urls,
        spotid: spotid,
        title: activeTitle,
        content: activeInfo
      },
      success: function (e) {
        wx.navigateBack({
          delta:1
        })
      }
    })
  },
  //满减活动
  manjianactive(activeTitle, activeInfo, reductionFull, cutback){
    wx.request({
      url: Api.postReductionFull(),
      method: "post",
      data: {
        reductionFull,
        cutback,
        spotid: spotid,
        title: activeTitle,
        content: activeInfo
      },
      success: function (e) {
        wx.navigateBack({
          delta: 1
        })
      }
    })
    
  },
  //立减活动
  lijian(activeTitle, activeInfo, startDecrease, endDecrease){
    wx.request({
      url: Api.postDecrease(),
      method: "post",
      data: {
        startDecrease,
        endDecrease,
        spotid: spotid,
        title: activeTitle,
        content: activeInfo
      },
      success: function (e) {
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },

  //活动标题
  activeTitle(e){
    console.log(e.detail.value)
    let value = e.detail.value
    _this.setData({
      activeTitle: value
    })
  },
  //活动详情
  activeInfo(e){
    let value = e.detail.value
    _this.setData({
      activeInfo: value
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})