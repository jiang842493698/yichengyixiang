// pages/management/manageinfo/manageinfo.js
var Api = require('../../../utils/api.js');
let util = require('../../../utils/util.js')
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
    this.setData({
      id: options.id,
      name : options.name,
      price: options.price
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
    wx.request({
      url: Api.postClient(),
      method : "post",
      data :{
        userid : _this.data.userid
      },
      success : function(e){
        let data = e.data.data
        for(let d of data){
          d.dateTime = util.formatTime(new Date(d.dateTime),true)
        }
        console.log(e.data)
        _this.setData({
          list: data
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