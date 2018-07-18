//获取应用实例
var app = getApp()
var fileData = require('../../utils/data.js')
var util = require('../../utils/util')
var Api = require('../../utils/api.js');
let that;
let pageIndex = 1
let pageSize = 10
Page({
  // 页面初始数据
  data: {
    colors: ['red', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange'],
    list: ['', '待商家确认', '商家已确认', '已完成','订单取消'],
    casIndex: 0,
    curNavId: 1,
    curIndex: 0
  },
  navTosearch: function (e) {
    pageIndex = 1
    this.setData({
      curNavId: parseInt(e.currentTarget.dataset.id)
    })
    
    this.onSelect();
  },
  onLoad: function (option) {
    that = this;
    var typeid=option.id;
    if(typeid){
      this.setData({
        curNavId: typeid
      })

    }
    that.onSelect()
  },
  onSelect(){
    let userid = wx.getStorageSync("userid");
    
    wx.request({
      url: Api.getMyOrder(),
      method: 'post',
      data:{
        userid:userid,
        type: this.data.list[this.data.curNavId-1]
      },
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        res = res.data;

        //重组pay及exchange
        var pays=res.data.pays;
        var exchanges=res.data.exchanges;
        var manages=res.data.manages;
        for(var i=0;i<pays.length;i++){
            pays[i].exchanges=[];
            for(var j=0;j<exchanges.length;j++){
              if(pays[i].id==exchanges[j].payid){
                pays[i].exchanges.push(exchanges[j]);
              }
            }
    
            pays[i].createAt = util.formatTime(new Date(pays[i].createAt) ,1);
        }
        
        that.setData({
            orders:pays
        })
      
      }
    })
  },
  deleteOrders(e){
    
    let payid = e.currentTarget.dataset.id
    let userid = wx.getStorageSync("userid")
    wx.request({
      url: Api.updateOrderPay(),
      method : "post",
      data : {
        id: payid,
        userid
      },
      success : function(res){
        let ress = res.data.success
        if (ress){
          that.onSelect()
        }
      }
    })

  },
  goShopping(){
    wx.switchTab({
      url:"/pages/search/search"
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
  }
})
