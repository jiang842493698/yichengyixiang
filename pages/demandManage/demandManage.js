// pages/demandManage/demandManage.js
var Api = require('../../utils/api.js');
var util = require('../../utils/util.js');
let _this
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chuliId: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this
  },
  chuli(e){
    let id = e.currentTarget.dataset.id
    _this.setData({
      chuliId : id
    })
    _this.isSleect(id)
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
    _this.isSleect(1)
  },
  isSleect(process){
    wx.request({
      url: Api.getHotestTopic({process: process}),
      method :"get",
      success : function(e){
        
        let data = e.data.datas
        for (let d of data){
          d.createAt = util.formatTime(new Date(d.createAt))
          if (d.startTime == d.endTime){
            d.today = true
          }else{
            d.today = false
          }

          d.startTime = util.formatTime(new Date(d.startTime))
          d.endTime = util.formatTime(new Date(d.endTime))
        }
        console.log(data)
        _this.setData({
          hotest: data
        })
        
        
      }
    })
  },

  /**
   * 多选处理
   */
  onSelect(e){
    let id = e.currentTarget.dataset.id
    let list = _this.data.hotest
    wx.request({
      url: Api.updateSave(),
      method :"post",
      data : {
        id,
        process:2
      },
      success : function(e){
        if(e.data.success==1){
          wx.showToast({
            title: '处理完成',
            success : function(e){
              setTimeout(function(){
                aaa()
              },1000)
            }
          })
          let aaa = function(){
            _this.isSleect(1)
          }
          
        }
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