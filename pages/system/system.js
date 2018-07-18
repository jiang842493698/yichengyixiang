// pages/system/system.js

 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userListInfo:[
      {
        icon: '../../images/ruzhu.png',
        text: '订金配置',
        isunread: true,
        unreadNum: 1
      },
      {
        icon: '../../images/ruzhu.png',
        text: '景区管理员配置',
        isunread: true,
        unreadNum: 1
      } 
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
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
  active_page:function(e){
    var name = e.currentTarget.dataset.name;
    if (name == "订金配置") {
      wx.navigateTo({
        url: '/pages/deposit/deposit'
      })
    }

    if (name == "景区管理员配置") {
      wx.navigateTo({
        url: '/pages/spotmanager/spotmanager'
      })
    }
  }
})