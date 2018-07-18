// pages/myspot/myspot.js
var Api = require('../../utils/api.js');
var util = require('../../utils/util')
let _this
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
    _this.isSelect()
  },
  isSelect(){
    let userid = wx.getStorageSync("userid")
    wx.request({
      url: Api.getSettle(),
      method :"post",
      data : {
        userid
      },
      success : function(e){
        
        let list = e.data.data
        for(let l of list){
          l.createAt = util.formatTime(new Date(l.createAt))
        }
        _this.setData({
          list
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
  
  }
})