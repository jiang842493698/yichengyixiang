 //index.js
//获取应用实例
var app = getApp()
var fileData = require('../../utils/data.js')
var Api = require('../../utils/api.js');
Page({
  // 页面初始数据
  data: {
      colors:['red','orange','yellow','green','purple'],
      // banner 初始化
      // banner_url: fileData.getBannerData(),
      indicatorDots: true,
      vertical: false,
      autoplay: true,
      interval: 3000,
      duration: 1000,
      // nav 初始化
      navTopItems: fileData.getIndexNavData(),
      navSectionItems: fileData.getIndexNavSectionData(),
      curNavId: 1,
		  curIndex: 0
  },
  onShow:function(){
    let _this = this
    let userid = wx.getStorageSync("userid")
    
  },
  onLoad:function(){
    // app.getUserOpenid();
      var that = this
      that.isActive()
      
      wx.request({
        url: Api.getIndexData1(),
        method: 'post',
        header: { 
          'Accept': 'application/json'
        },
        data : {

        },
        success: function (res) {
          that.setData({
            list: res.data.datas
          }); 
        }
      })
      // app.getUserInfo();
      this.loadTags();
  },
  isActive(e){
    var that = this;
    wx.request({
      url: Api.getEventInfo(),
      method : "post",
      data : {

      },
      success: function (res) {
        let content = res.data.datas
        that.setData({
          banner_url: content
        })
      }
    })
  },
  viewSearch(e){
    let value = e.detail.value 
    
  },
  //标签切换
  switchTab: function(e) {
      let id = e.currentTarget.dataset.id,
      index = parseInt(e.currentTarget.dataset.index)
      this.curIndex = parseInt(e.currentTarget.dataset.index)
     
      var that = this
      this.setData({
        curNavId: id,
        curIndex: index,
      })
      
  },
  // 跳转至详情页
  navigateDetail: function(e){
    wx.navigateTo({
      url: '../technicain_ticket/technicain_ticket?id=' + e.currentTarget.dataset.id + "&name=" + e.currentTarget.dataset.name + "&description=" + e.currentTarget.dataset.description + "&img=" + e.currentTarget.dataset.img + "&price=" + e.currentTarget.dataset.price + "&type=" + e.currentTarget.dataset.type
    })
  },
  // 加载更多
  loadMore: function (e) {
 
    var curid = this.data.curIndex

    if (this.data.navSectionItems[curid].length === 0) return
    
    var that = this
    that.data.navSectionItems[curid] = that.data.navSectionItems[curid].concat(that.data.navSectionItems[curid])
    that.setData({
      list: that.data.navSectionItems,
    }) 
  },
  // book
  bookTap: function(e){
    wx.navigateTo({
      url:'../book/book?aid='+e.currentTarget.dataset.aid
    })
  },
  navTosearch:function(e){
    
    let navTopItems = this.data.navTopItems
    let id = e.currentTarget.dataset.id
    let navTopItem = navTopItems.filter(e => e.id == id)[0]
 
    wx.navigateTo({
      url: '/pages/searchs/search?type=' + navTopItem.title
    })
  },
  navToEvent:function(e){
    wx.navigateTo({
      url: '/pages/event/event?id='+e.currentTarget.dataset.eventid
    })
  },
  navToApply:function(){
    let openid = wx.getStorageSync("openid")
    wx.request({
      url: Api.getUserOpenid(),
      method: "post",
      data: {
        openid
      },
      success: function (e) {
 
        if (e.data.success) {
          let data = e.data.data
          if (data.length > 0){
            if(data[0].mobile){
              wx.navigateTo({
                url: '/pages/spot_apply/apply?type=申请入驻'
              })
              return
            }else{
              wx.navigateTo({
                url: '/pages/registration/login?type=lijigoumai',
              })
              return
            }
          }else{
            wx.navigateTo({
              url: '/pages/registration/login?type=lijigoumai',
            })
            return
          }
          
        } else {
          wx.showToast({
            title: '请先登录',
          })
          return
        }


      }
    })
 
  },
  loadTags:function(){
    var that = this
    wx.request({
      url: Api.getMarketTags(),
      method: 'get',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        res = res.data;
        that.setData({
          hotTag: res.datas
        });
      }
    })
  },
  shao:function(){
   
  }
  
})
