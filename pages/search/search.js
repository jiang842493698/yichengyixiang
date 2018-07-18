/*technician.js*/

//获取应用实例
var app = getApp()
var fileData = require('../../utils/data.js')
var util = require('../../utils/util')
var Api = require('../../utils/api.js');
let _this
let pageIndex = 1
let pageSize = 10
Page({
  // 页面初始数据
  data: {
    // nav 初始化
    // cas picker
    colors: ['red', 'orange', 'yellow', 'green'],
     list:[],
    casIndex: 0,
    // addr picker
    addrArray: util.replacePhone(fileData.userData().addrs, false),
    addrIndex: 0,
    skillData: fileData.getSkilledData(),
    curNavId: 1,
    curIndex: 0,

  },
  complete(){
    this.hideModal()
  },
  loadData:function(){
    var that = this
    wx.request({
      url: Api.getSearch(),
      method: 'post',
      data:{
          ordertype: that.data.curNavId,
          tags:that.data.tags,
          price:that.data.price,
          startdate:that.data.startdate,
          enddate:that.data.enddata,
          key: that.data.key,
          name: that.data.sousuo,
          pageIndex : pageIndex,
          pageSize : pageSize,
      },
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        res = res.data;
        //重组数据
        let list = that.data.list
        // list.push(res.datas)
        list = list.concat(res.datas)
        var features = list;
        if (that.data.curNavId == 1) {
          features = features
        }
        if (that.data.curNavId == 2){
          features.sort((a,b)=>b.peoples-a.peoples)
        }
        if (that.data.curNavId == 3) {
          let latitude = _this.data.latitude
          let longitude = _this.data.longitude
          for (let f of features){
            // console.log(f.name)
            let distance = _this.getDistance(Number(longitude), Number(latitude), Number(f.longitude), Number(f.latitude))
            f.distance = distance
          }
          features.sort((a, b) => a.distance - b.distance)
        }
        
        that.setData({
          list: features
        });
        // console.log(that.data.list)
      }
    })
  },
  viewSearchs(e){
    let value = e.detail.value
    _this = this

    _this.setData({

      sousuo: value
    })
  },
  viewSearch:function(){
    pageIndex = 1
    _this.setData({
      list:[]
    })
    _this.loadData()
  },
  onLoad: function (option) {
    _this = this
    
    pageIndex = 1
    _this.setData({
      list: []
    })
    this.bindTosearch();
    this.loadData();
  },
  
  // 跳转至详情页
  navigateDetail: function (e) {
    //根据当前数据类型切换相应数据：会议，餐饮，住宿，游玩，等
    var type = e.currentTarget.dataset.type;
    var url ="../technicain_ticket/technicain_ticket";
    // var url;
    // switch (type){
    //   case "住宿":
    //     url = '../technicain_hotel/technicain_hotel';
    //   break;
    //   case "票务":
    //     url = '../technicain_ticket/technicain_ticket';
    //     break;
    //   case "餐厅":
    //     url = '../technicain_ticket/technicain_ticket';
    //     break;
    //   default :   
    //     url ='../technicain_ticket/technicain_ticket';
    //     break;
    // }

    wx.navigateTo({
      url: url + '?id=' + e.currentTarget.dataset.id + "&name=" + e.currentTarget.dataset.name + "&description=" + e.currentTarget.dataset.description + "&img=" + e.currentTarget.dataset.img + "&type=" + type + "&spotId=" + e.currentTarget.dataset.spotId + "&price=" + e.currentTarget.dataset.price
    })
   
  },
  // 加载更多
  loadMore: function (e) {
    // console.log('加载更多')
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
    // console.log('Category picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      casIndex: e.detail.value
    })
  },
  /**
   * 获取使用者的地理位置
   */
  bindTosearch:function(e){
    
    // console.log("获取使用者的地理位置")
    wx.getLocation({
      success : function(res){
        // console.log(res)
        let latitude = res.latitude
        let longitude = res.longitude
        _this.setData({
          latitude,
          longitude
        })
      }
    })
  },
  Rad:function(e){
    return e * Math.PI / 180.0; 
  },
  getDistance: function (long1, lat1, long2, lat2){
    var radLat1 = this.Rad(lat1);
    var radLat2 = this.Rad(lat2);
    var a = radLat1 - radLat2;
    
    var b = this.Rad(long1) - this.Rad(long2);
    
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    // console.log("s"+s)
    s = s * 6378.137;// EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000; //输出为公里
    //s=s.toFixed(4);
    return s;
  },

  // 地址选择
  bindAddrPickerChange: function (e) {
    // console.log('Category picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      addrIndex: e.detail.value
    })
  },
  toBuyCard:function(e){
     wx.navigateTo({
       url:'../buycard/buycard'
    })
  },
  toBalance:function(e) {
    wx.navigateTo({
      url: '../balance/balance'
    })
  },
  //发布需求
  publishData:function(e){
    wx.navigateTo({
      url: '../book/book'
    })
  },
  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {
    // alert(111)
    //加载下页数据
    pageIndex = pageIndex+1
    this.loadData()

  },
  navTosearch:function(e){
    pageIndex = 1
    // console.log(e)
    this.setData({
      curNavId: parseInt(e.currentTarget.dataset.id)
    })
    this.setData({
      list :[]
    })
    this.loadData();
  },
  navToXuan: function (e) {
    this.setData({
      curNavId: parseInt(e.currentTarget.dataset.id)
    })
      this.showModal();
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
  },
  tiaozhuan(){
    let openid = wx.getStorageSync("openid")
    wx.request({
      url: Api.getUserOpenid(),
      method: "post",
      data: {
        openid
      },
      success : function(e){
        if (e.data.success) {
          let data = e.data.data
          if (data.length > 0) {
            wx.setStorageSync("userinfo", data[0])
            wx.setStorageSync("mobile", data[0].mobile)
            wx.setStorageSync("userid", data[0].id)
            if (data[0].mobile) {
              wx.navigateTo({
                url: '/pages/book/book'
              })
              return
            } else {
              wx.navigateTo({
                url: '/pages/registration/login?type=lijigoumai',
              })
              return
            }
          } else {
            wx.navigateTo({
              url: '/pages/registration/login?type=lijigoumai',
            })
            return
          }
        }else{
          wx.showToast({
            title: '请先登录',
          })
          return
        }
      }
    })
    
  }


})
