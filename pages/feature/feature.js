/*technician.js*/

//获取应用实例
var app = getApp()
var fileData = require('../../utils/data.js')
var util = require('../../utils/util')
var Api = require('../../utils/api.js');
Page({
  // 页面初始数据
  data: {
    // nav 初始化
    // cas picker
     
    casIndex: 0,
    // addr picker
    addrArray: util.replacePhone(fileData.userData().addrs, false),
    addrIndex: 0,
    skillData: fileData.getSkilledData(),
    curNavId: 1,
    curIndex: 0
  },

  onLoad: function (option) {
    var that = this
    wx.request({
      url: Api.getListBySpot(option.spotid),
      method: 'get',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        res = res.data;
        //重组数据
        var features = res.datas;
        that.setData({
          list: features
        });
      }
    })
  },
  // 跳转至详情页
  navigateDetail: function (e) {
    wx.navigateTo({
      url: '../technicain_detail/technicain_detail?artype=' + e.currentTarget.dataset.arid
    })
  },
  // 加载更多
  loadMore: function (e) {
    console.log('加载更多')
    if (this.data.skillData.length === 0) return
    var that = this
    // 由于是模拟数据，加载更多时候，数据重复加载
    that.data.skillData = that.data.skillData.concat(that.data.skillData)
    that.setData({
      list: that.data.skillData,
    })
  },
  // 类别选择
  bindCasPickerChange: function (e) {
    console.log('Category picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      casIndex: e.detail.value
    })
  },
  // 地址选择
  bindAddrPickerChange: function (e) {
    console.log('Category picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      addrIndex: e.detail.value
    })
  }


})
