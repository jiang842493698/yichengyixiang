// pages/activeManage/activeManage.js
var util = require('../../utils/util')
var Api = require('../../utils/api.js');
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
  },
  isSelect(){
    wx.request({
      url: Api.getActiveType(),
      method : "post",
      data : {},
      success : function(e){

        // console.log(e)
        let data = e.data.data
        _this.setData({
          activeData: data
        })

      }
    })
  },
  //选择活动
  selectActive(e){
    let type = e.currentTarget.dataset.type
    //景区活动
    // console.log(type)
    if (type==1){
      // console.log("景区活动")
      wx.navigateTo({
        url: "/pages/activeManage/scenicManage/scenicManage?type=" + type,
      })
    }else{
      wx.navigateTo({
        url: "/pages/activeManage/scenicSelect/scenicSelect?type=" + type,
      })
    }
    
    
    // if (type=="1"){
    //   wx.navigateTo({
    //     url: "/pages/activeManage/scenicManage/scenicManage",
    //   })
    // }
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
    _this.isSelect()
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