
var Api = require('../../utils/api.js');
// pages/spotmanager/spotmanager.js
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
    var that=this;
    wx.request({
      url: Api.getSpotList(),
      method: "get",
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        let rows1 = res.data.datas.rows1
        for (let r of rows1){
          r.spotimg = JSON.parse(r.spotimg)[0]
        }
        that.setData({ spots:res.data.datas.rows1});
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
  active_page: function (e) {
    var spotid = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '/pages/spotmanager/users/users?id='+spotid
    })
   
  }
})