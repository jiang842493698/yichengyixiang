var Api = require('../../../utils/api.js');
// pages/spotmanager/append/append.js
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
      this.setData({spotid:options.id})
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
  viewSearchs:function(e){
    let value = e.detail.value
    var _this = this

    _this.setData({
      sousuo: value
    })
  },
  viewSearch:function(e){
    var that=this;
    wx.request({
      url: Api.findWeiXinUserList(),
      method: "post",
      data:{
        k:that.data.sousuo
      },
      success: function (res) {
        if(res.data.data.length>0)
        that.setData({ datalist: res.data.data});
        else{
          wx.showToast({
            title: '未查询到',
            icon: 'succes',
            duration: 1000,
            mask: true
          })
        }
      }
    })
  },
  configData:function(e){
     var userid = e.currentTarget.dataset.userid;
     var unionid = e.currentTarget.dataset.unionid;
     var that=this;
     //是否能查询到公众号openid
     wx.request({
       url: Api.findEyouOpenid(unionid),
       method: "get",
       success: function (res) {
         if (res.data && res.data.data.length>0 && res.data.data[0].openid){
            //存在 
            wx.request({
              url: Api.setEyouUseropenid(),
              method: "post",
              data: {
                userid: userid,
                eyouopenid: res.data.data[0].openid,
                spotid:that.data.spotid
              },
              success: function (res) {
                    wx.showToast({
                      title: '设置成功',
                      icon: 'succes',
                      duration: 1000,
                      mask: true
                    })
              }
            })

         }else{
            //不存在 
            wx.showModal({
              title: '提示',
              content: '未查询到公众号用户',
              success: function (res) {
                if (res.confirm) {
                  // console.log('用户点击确定')
                } else {
                  // console.log('用户点击取消')
                }

              }
            })
         }
       }
     })
  }
})