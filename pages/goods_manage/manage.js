// pages/goods_manage/manage.js
var Api = require('../../utils/api.js');
let _this
let roleid
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
    roleid = options.roleid
    
    _this.onSelect()
  },
  onSelect(){
    wx.request({
      url: Api.getSearch(),
      method : "post",
      data : {
        spotid: roleid
      },
      success : function(e){
        let data = e.data.datas
        // console.log(data)
        _this.setData({
          list: data
        })
      }
    })
  },
  navigateDetail(e){
    console.log(e.currentTarget.dataset.id)
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/feature_manage/manage?roleid=' + roleid+"&id="+id,
    })
  },
  navigatedelete(e){
    let id = e.currentTarget.dataset.id
    wx.showModal({
      title: '警告',
      content: '是否删除',
      success:function(e){
        if (e.confirm){
          _this.deletegoods(id,2)
        }
      }
    })
    
  },
  deletegoods(id,status){
    wx.request({
      url: Api.putgoods(),
      method: "post",
      data: {
        id,
        status
      },
      success: function (e) {
        if (e.data.success == true) {
          _this.onSelect()
        }
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
    _this.onSelect()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },
  publishData(){
    // console.log(roleid)
    wx.navigateTo({
      url: '/pages/goods/goods?spotid=' + roleid,
    })
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