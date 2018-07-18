//获取应用实例
var app = getApp()
var fileData = require('../../utils/data.js')
var util = require('../../utils/util')
var Api = require('../../utils/api.js');
Page({
  // 页面初始数据
  data: {
    casIndex: 0,
    addrArray: util.replacePhone(fileData.userData().addrs, false),
    addrIndex: 0,
    skillData: fileData.getSkilledData(),
    curNavId: 1,
    curIndex: 0
  },
  onLoad: function (option) {
    let _this = this
    //调用应用实例的方法获取全局数据
    // app.getUserInfo(function (userInfo) {
    //   //更新数据
    //   that.setData({
    //     userInfo: userInfo
    //   })
    // })
    let userid = wx.getStorageSync("userid")
    let userInfo = wx.getStorageSync("userinfo")
    _this.setData({
      userInfo
    })
    wx.request({
      url: Api.getIntegral(),
      method: 'post',
      header: {
        'Accept': 'application/json'
      },
      data : {
        userid
      },
      success: function (res) {
        res = res.data;

        for(var i=0;i<res.data.data.length;i++){
          res.data.data[i].createAt = util.formatTime(new Date(res.data.data[i].createAt),1)
        }
        
        _this.setData({
          list: res.data.data,
          total: res.data.total[0].cc
        });
      }
    })
  },
  // 加载更多
  loadMore: function (e) {
    if (this.data.skillData.length === 0) return
    var that = this
    // 由于是模拟数据，加载更多时候，数据重复加载
    that.data.skillData = that.data.skillData.concat(that.data.skillData)
    that.setData({
      list: that.data.skillData,
    })
  },
  nav_append() {
    wx.switchTab({
      url: "/pages/search/search"
    })
  },
  
})
