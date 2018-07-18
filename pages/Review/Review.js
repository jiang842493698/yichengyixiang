// pages/Review/Review.js
var Api = require('../../utils/api.js');
var util = require('../../utils/util.js');
let _this
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chuliId : 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this
    _this.isSelect(1)
  },
  isSelect(applicationStatus){
    wx.request({
      url: Api.getSettle(),
      method : "post",
      data : {
        applicationStatus: applicationStatus
      },
      success : function(e){
        // console.log(e)
        let data = e.data.data
        for(let d of data){
          d.createAt = util.formatTime(new Date(d.createAt))
          d.image = JSON.parse(d.image)
        }
        _this.setData({
          list: data
        })
      }
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
  
  },
  /**
   * 处理
   */
  chuli(e){
    // console.log(e)
    let chuliId = e.currentTarget.dataset.id
    _this.setData({
      chuliId
    })
    _this.isSelect(chuliId)
  },
  formReset(e){
    //1为未处理，2为拒绝，3为同意
    let id = e.currentTarget.dataset.id
    _this.isEndSelect(id,2)
    
  },
  isEndSelect(id,applicationStatus){
    wx.request({
      url: Api.putSettel(),
      method: "post",
      data: {
        id,
        applicationStatus
      },
      success: function (e) {
        if (e.data.success==true){
          _this.isSelect(1)
          
        }
      }
    })
  },
  formSubmit(e){
    // console.log(e)
    //1为未处理，2为拒绝，3为同意
    let id = e.currentTarget.dataset.id
    _this.isEndSelect(id, 3)
    // _this.insertSpot(id)
    
  },
  insertSpot(id){
    let listArray = _this.data.list
    let list = listArray.filter(e=>e.id == id)[0]
    // console.log(list)
    wx.request({
      url: Api.insertSpot(),
      method:"post",
      data:{
        spotname: list.name,
        spotimg : list.image[0],
        spotdesc : list.content,
        admin : list.username,
        mobile: list.mobile,

      }
    })
  }
})