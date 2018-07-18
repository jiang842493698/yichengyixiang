// pages/orderManages/orderManages.js
var fileData = require('../../utils/data.js')
var util = require('../../utils/util')
var Api = require('../../utils/api.js');
let that
let roleid
Page({

  /**
   * 页面的初始数据
   */
  data: {
    issub:true,
    maskFlag: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    roleid = options.roleid
    that.onSelect()
  },
  onSelect() {
    wx.request({
      url: Api.getSpotOrderList(roleid),
      method: 'get',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        res = res.data;

        //重组pay及exchange
        var pays = res.data.pays;
        var exchanges = res.data.exchanges;

        for (var i = 0; i < pays.length; i++) {
          pays[i].exchanges = [];
          for (var j = 0; j < exchanges.length; j++) {
            if (pays[i].id == exchanges[j].payid) {
              pays[i].exchanges.push(exchanges[j]);
            }
          }

          pays[i].createAt = util.formatTime(new Date(pays[i].createAt), 1);
        }
        console.log(pays)
        that.setData({
          orders: pays
        })

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
    this.setData({ maskFlag: true})
    that.onSelect();
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
  confirmData:function(e){
    var process = e.currentTarget.dataset.process;
    var dataid = e.currentTarget.dataset.id;
    let userid = wx.getStorageSync("userid")
    this.setData({ maskFlag: true, oilchooseFlag: true })
  if(this.data.issub)
  {

    this.setData({issub:false});
      wx.request({
        url: Api.confirmOrderData(),
        method: "post",
        header: {
          'Accept': 'application/json'
        },
        data: {
          process: process,
          dataid: dataid,
          userid: userid
        },
        success: function (res) {
          // wx.showModal({
          //   title: '提示',
          //   content: res.data.data.msg,
          //   success: function (res) {
          //     if (res.confirm) {
          //       // console.log('用户点击确定')
          //     } else {
          //       // console.log('用户点击取消')
          //     }

          //   }
          // })

          wx.showToast({
            title: res.data.data.msg,
            icon: 'succes',
            duration: 1000,
            mask: true
          })

          that.setData({ issub: true });
          that.onSelect();

          this.setData({ maskFlag: false, oilchooseFlag: true })
        }
      })
   }
   
  },
  endBanlace:function(e){
    var dataid = e.currentTarget.dataset.id;
    
    wx.navigateTo({
      url: '/pages/orderManages/balance/balance?id=' + dataid
    })
  }
})