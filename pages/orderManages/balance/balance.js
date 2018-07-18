// pages/orderManages/balance/balance.js
var Api = require('../../../utils/api.js');
var util = require('../../../utils/util')
let _this
let id 
let beizhu
let daizhifu
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maskFlag:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this
    id = options.id
    console.log(id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    _this.isSelect()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  isSelect(){
    wx.request({
      url: Api.getPayByid(),
      method : "post",
      data : {
        id
      },
      success: function(e){
        let payData = e.data.data[0]
        wx.request({
          url: Api.getexchangeById(),
          method: "post",
          data: {
            id
          },
          success :function(res){
            let exdata = res.data.data
            payData.orderdata = exdata
            payData.daizhifu = Number(payData.allprice) - Number(payData.money)
            payData.createAt = util.formatTime(new Date(payData.createAt),1)
            _this.setData({
              payData
            })
          }
        })

      }
      
    })
  },
  textbeizhu(e){
    console.log(e.detail.value)
    beizhu = e.detail.value
  },
  toBalance(){


    let note = beizhu
    let payData = _this.data.payData
    let amountBilled = (daizhifu == null || daizhifu == "") ? payData.daizhifu : daizhifu;
    this.setData({maskFlag: false, oilchooseFlag: true})
    wx.request({
      url: Api.updatePayById(),
      method : "post",
      data : {
        id,
        note,
        amountBilled
      },
      success(e){
        if(e.data.success==true){
          wx.showToast({
            title: '结算成功',
            icon: 'succes',
            duration: 1000,
            mask: true
          })
          wx.navigateBack({
            delta:1
          })
        }else{
          wx.showToast({
            title: '结算失败',
            icon: 'succes',
            duration: 1000,
            mask: true
          })
        }

        this.setData({maskFlag: true,oilchooseFlag: true})
      }
    })
  },
  daizhifu(e){
    let payData = e.data.payData
    daizhifu = e.detail.value
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let payData = e.data.payData
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