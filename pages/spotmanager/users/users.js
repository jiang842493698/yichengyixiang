// pages/spotmanager/users/users.js

var Api = require('../../../utils/api.js');
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
      var spotid=options.id;
      //查询当前景区下的所有管理员
      var that = this;
      wx.request({
        url: Api.getSpotManagerUserList(spotid),
        method: "get",
        success: function (res) {
          that.setData({ datalist: res.data.data, spotid: spotid});
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
  submit:function(e){
      wx.navigateTo({
        url: '/pages/spotmanager/append/append?id=' + this.data.spotid
      })

  },
  delManager:function(e){
    var that=this;
    var userid = e.currentTarget.dataset.userid;
    wx.request({
      url: Api.delSpotManager(userid, that.data.spotid),
      method: "get",
      success: function (res) {
        that.onLoad({ id: that.data.spotid})
      }
    })
  }
})