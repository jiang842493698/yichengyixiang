// pages/technicain_ticket/technicain_ticket.js
var app = getApp();
var Api = require('../../utils/api.js');
var Util = require('../../utils/util.js');
let that
let name
let description
let img
let type
let id
let price
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    mengShow: false,//蒙层的显示与否
    aniStyle: true,    //动画效果，默认slideup  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    that = this
    name = option.name
    description = option.description
    img = option.img
    type = option.type
    id = option.id
    price = option.price
    wx.setNavigationBarTitle({
      title: type + "详情"
    })
    that.onMonthlySave()
    // console.log("9999999999999999999")
    var dt = Util.formatTime(new Date());
    that.onSelect(dt)
    that.onDate()
  },
  /**
   * 月售记录
   */
  onMonthlySave() {
    /**
     * 获取上个月的记录
     */
    let date = new Date();
    let startTime = new Date(date.getFullYear(), date.getMonth() - 1, 1)
    let endTime = new Date(date.getFullYear(), date.getMonth(), 1 - 1)
    wx.request({
      url: Api.getMonthlySave(),
      method: "post",
      header: {
        'Accept': 'application/json'
      },
      data: {
        id: id,
        startTime,
        endTime
      },
      success: function (e) {
        let res = e.data;
        //重组数据
        let features = res.datas;
        
        that.setData({
          monthlySave: features[0]
        })
      }
    })
  },
  bindDateChange: function (e) {
   

    //查询是否在当前日期向后三个月
    var s1=new Date();
    var s2 = new Date(e.detail.value);
    var days = s2.getTime() - s1.getTime();
    var time = parseInt(days / (1000 * 60 * 60 * 24));
    if (time<=90&&time>=0)
    {
      this.setData({
        dates: e.detail.value
      })
      this.onSelect(e.detail.value);
    }else{
      wx.showToast({
        title: '只能预定90天内',
        icon: "success"})
    }
  
    
  },
  onDate(){
    let startDate = new Date();
    let startDateTime = Util.formatTime(startDate)
    that.setData({
      startDateTime
    })
  },
  onSelect(dt) {
    wx.request({
      url: Api.getGoodsDetail({id:id,dt:dt}),
      method: 'get',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        res = res.data;
        //重组数据
        var features = res.datas;
        // console.log(features)

        var spot=res.spot;
        // var iimages = spot.spotimg.replace("[", "").replace("]", "").replace(/"/g,'').split(",");
        that.setData({
          spot: spot,
          // iimages: iimages,
          list: features,
          title: name,
          description: description,
          img: img,
          type: type,
          price: (features[0].price == features[features.length - 1].price) ? features[0].price : (features[features.length - 1].price + " ~ " + features[0].price),
          dates: dt
        });
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
  buyticketinfo:function(){
    this.showModal();
  },
  buyticketding:function(e){
    var id = e.currentTarget.dataset.id;
    let spotid = e.currentTarget.dataset.spotid;
    wx.request({
      url: Api.postSms(),
      method : "post",
      data : {

      },
      success : function(e){
        console.log(e)
      }

    })
    wx.navigateTo({
      url: '../technicain_ticket_buy/ticket_buy?id=' + id + '&date='+that.data.dates
    })
  },
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  }


})