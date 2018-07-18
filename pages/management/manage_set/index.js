// pages/management/manage_set/index.js

var Api = require('../../../utils/api.js');
// let util = require('../../utils/util.js')
let spotid
let id
let _this
let zhekou 
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
    id = options.id
    spotid = options.spotid
    _this = this
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  zhekoushezhi(e){
    console.log(e.detail.value)
    zhekou = e.detail.value
  },
  //提交status=1设置折扣通用接口
  submit(e){
    wx.request({
      url: Api.setDisCount(),
      method :"post",
      data:{
        userid : id,
        spotid : spotid,
        createAt : new Date(),
        discount:zhekou,
        status : 1
      },
      success : function(e){
        if(e.data.success==true){
          wx.showToast({
            title: '已完成设置',
            success: function () {
              setTimeout(function () {
                aaa()
              }, 3000)
            }
          })
          let aaa = function(){
            wx.navigateBack({
              delta : 1
            })
          }
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    _this.isSelect()
  },
  isSelect(){
    wx.request({
      url: Api.getDisCount(),
      method : "post",
      data : {
        userid: id,
        spotid: spotid,
      },
      success : function(e){
        console.log(e)
        let list = e.data.data
        if (list.length>0){
          _this.setData({
            discount : list[0].discount
          })
        }else{
          _this.setData({
            discount : "当前用户没有设置任何折扣"
          })
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