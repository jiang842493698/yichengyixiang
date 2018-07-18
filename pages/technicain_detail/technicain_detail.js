var app = getApp();
var Api = require('../../utils/api.js');
var Util = require('../../utils/util.js');
let that
let name
let description
let img
let type
let id
let spotId
Page( {
  data: {
  },
  onLoad: function (option) {
    that = this
    name = option.name
    description = option.description
    img = option.img
    type = option.type
    id = option.id
    spotId = option.spotId
    wx.setNavigationBarTitle({
      title: type + "详情"
    })
    that.onMonthlySave()
    that.onSelect()
  },
  onMonthlySave(){
    console.log("11111111111111")
    wx.request({
      url: Api.getMonthlySave(),
      method :"post",
      header: {
        'Accept': 'application/json'
      },
      data : {
        id : id
      },
      success :function(e){
        let res = e.data;
        //重组数据
        let features = res.datas;
        console.log("aaaaaaaaaaa")
        console.log(features)
      }
    })
  },
  onSelect(){
    console.log(name)
    console.log(description)
    console.log(img)
    console.log(type)
    wx.request({
      url: Api.getGoodsDetail({id}),
      method: 'get',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        res = res.data;
        //重组数据
        var features = res.datas;
        console.log(features)
        that.setData({
          list: features,
          title: name,
          description: description,
          img: img,
          type : type,
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
  bookTap:function(e){
    //添加数据
    // app.cardDatas.push({
    //   id: e.currentTarget.dataset.id,
    //   name: e.currentTarget.dataset.name,
    //   date: this.data.dates,
    //   price: e.currentTarget.dataset.price,
    //   img: e.currentTarget.dataset.img
    // });
    var img = e.currentTarget.dataset.img;
    var name = e.currentTarget.dataset.name;
    var id = e.currentTarget.dataset.id;
    var price = e.currentTarget.dataset.price;
    wx.navigateTo({
      url: '../technicain_ticket_buy/ticket_buy?id=' + id + '&name=' + name + "&price=" + price+"&img="+img
    })
    // wx.navigateTo({
    //   url:'../search/search'
    // })

    //wx.navigateBack({ changed: true });  
  },
  toBuyCard: function (e) {
    wx.switchTab({
      url: '../buycard/buycard'
    })
  },
  toBalance: function (e) {
    wx.navigateTo({
      url: '../balance/balance'
    })
  }
})