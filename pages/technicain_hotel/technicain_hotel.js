var app = getApp();
var Api = require('../../utils/api.js');
var Util = require('../../utils/util.js');
Page({
  data: {
  },
  onLoad: function (option) {
    var that = this
    wx.request({
      url: Api.getGoodsDetail({ id: option.id}),
      method: 'get',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        res = res.data;
        //重组数据
        var features = res.datas;
        that.setData({
          list: features,
          title: option.name,
          description: option.description,
          img: option.img,
          dates: Util.formatTime(new Date()), price: (features[0].price == features[features.length - 1].price) ? features[0].price : (features[features.length - 1].price + " ~ " + features[0].price),
          dates: Util.formatTime(new Date())
        });
      }
    })
  },
  //  点击日期组件确定事件  
  bindDateChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      dates: e.detail.value
    })
  },
  // 预定
  bookTap: function (e) {
    //添加数据
    // app.cardDatas.push({
    //   id: e.currentTarget.dataset.id,
    //   name: e.currentTarget.dataset.name,
    //   date: this.data.dates,
    //   price: e.currentTarget.dataset.price,
    //   img: e.currentTarget.dataset.img
    // });
    // wx.navigateTo({
    //   url:'../search/search'
    // })

    // wx.navigateBack({ changed: true });
  },
  // toBuyCard: function (e) {
  //   wx.switchTab({
  //     url: '../buycard/buycard'
  //   })
  // },
  // toBalance: function (e) {
  //   wx.navigateTo({
  //     url: '../balance/balance'
  //   })
  // },
    buyhotelding: function (e) {
      var name = e.currentTarget.dataset.name;
      var id = e.currentTarget.dataset.id;
      var price = e.currentTarget.dataset.price;
      var img = e.currentTarget.dataset.img;
      wx.navigateTo({
        url: '../technicain_ticket_buy/ticket_buy?id=' + id + '&name=' + name + "&price=" + price + "&img=" + img
      })
  }
})