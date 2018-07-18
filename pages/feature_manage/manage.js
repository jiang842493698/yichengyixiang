/*technician.js*/

//获取应用实例
var app = getApp()
var fileData = require('../../utils/data.js')
var util = require('../../utils/util')
var Api = require('../../utils/api.js');
let _this
let roleid
let goodid
Page({
  // 页面初始数据
  data: {
    startX: 0, //开始坐标
    startY: 0,
    items:[],
    casIndex: 0,
    addrIndex: 0,
    curNavId: 1,
    curIndex: 0,
    urls:[]
  },

  onLoad: function (option) {
    _this = this
    roleid = option.roleid
    goodid = option.id;
    // for (var i = 0; i < 10; i++) {
    //   this.data.items.push({
    //     content: i + " 向左滑动删除哦,向左滑动删除哦,向左滑动删除哦,向左滑动删除哦,向左滑动删除哦",
    //     isTouchMove: false //默认全隐藏删除
    //   })
    // }
    // this.setData({
    //   items: this.data.items
    // })
  },
  onShow(){
    this.onSelect()
  },
  onSelect(){
    // let userid = wx.getStorageSync("userid")

    var that = this
    wx.request({
      url: Api.getGoodsDetail({ spotid: roleid, id: goodid}),
      method: 'get',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        res = res.data;
        //重组数据13057519282
        var features = res.datas;
        // console.log(features)
       
        that.setData({
          items: features
        });
      }
    })
  },
  deletechangdi(e){
    console.log(e.currentTarget.dataset.id)
    let id = e.currentTarget.dataset.id
    let data = {
      id,
      status : 2
    }
    this.updatedeltar(data)
       

  },
  updatedeltar(dataJson){
   
    wx.request({
      url: Api.updatescenicdetil(),
      method : "post",
      data : {
        ...dataJson
      },
      success : function(e){
        console.log()
        let data = e.data
        if (data.success == true){
          _this.onShow()
        }else{
          wx.showModal({
            title: '警告',
            content: '删除失败',
          })
        }
        
        
      }
      
    })
  },
  bianji(e){
    let id = e.currentTarget.dataset.id
    
    wx.navigateTo({
      url: '/pages/putgoods/putgoods?id=' + id,
    }) 
  },
  // 跳转至详情页
  navigateDetail: function (e) {
    // wx.navigateTo({
    //   url: '../technicain_detail/technicain_detail?artype=' + e.currentTarget.dataset.arid
    // })

    wx.navigateTo({
      url: '../technicain_detail/technicain_detail?id=' + e.currentTarget.dataset.id + "&name=" + e.currentTarget.dataset.name + "&description=" + e.currentTarget.dataset.description + "&img=" + e.currentTarget.dataset.img
    })
  },
  nav_append:function(e){
    
    wx.navigateTo({
      url: '/pages/goods/detail/detail?id=' + goodid + "&spotid=" + roleid
    })
    // wx.navigateTo({
    //   url: '../feature_append/append?artype=' + e.currentTarget.dataset.arid
    // })
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
  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.items.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      items: this.data.items
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
      that.data.items.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      items: that.data.items
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  del: function (e) {
    this.data.items.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      items: this.data.items
    })
  }


})
