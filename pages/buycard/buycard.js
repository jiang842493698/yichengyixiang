/*technician.js*/

//获取应用实例
var app = getApp()
var fileData = require('../../utils/data.js')
var util = require('../../utils/util')
var Api = require('../../utils/api.js');
Page({
  // 页面初始数据
  data: {
    onAllSelect : false
  },

  onLoad: function (option) {
    // this.setData({
    //   list: app.cardDatas
    // });
    let type = option.type
    let payid = option.payid
    if(type){
      this.setData({
        payid
      })
    }
  },
  onShow: function (option) {
    let userid = wx.getStorageSync("userid")
    if (!userid){
      userid =""
    }
    this.isSelect(userid)
    
  },
  bindMinus(e){
    // console.log(e.currentTarget.dataset.id)
    let id = e.currentTarget.dataset.id
    let count = e.currentTarget.dataset.count
    
    if (count==1){
      return
    }else{
      --count

      var dts = this.data.list;
      for (var i = 0; i < dts.length;i++)
      {
        if (dts[i].id==id){
          dts[i].count=count;
          break;
        }
      }

      this.setData({list:dts});
      this.updateCart(id, count)
      // this.onShow()
    }
    
  },
  bindPlus(e){
    let id = e.currentTarget.dataset.id
    let count = e.currentTarget.dataset.count
    ++count;

    var dts = this.data.list;
    for (var i = 0; i < dts.length; i++) {
      if (dts[i].id == id) {
        dts[i].count = count;
        break;
      }
    }

    this.setData({ list: dts });
    this.updateCart(id, count)
    // this.onShow()
  },
  updateCart(id,count){
    var that=this;
    wx.request({
      url: Api.updateCart(),
      method: "post",
      data: {
        id,
        count
      },
      success : function(res){
        // console.log(res.data.data)
        that.restartComput();
      }
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
  isSelect(userid){
    let _this = this 
    wx.request({
      url: Api.getCart(userid),
      method: "GET",
      header: {
        'Accept': 'application/json'
      },
      success:function(e){
        let data = e.data.data
        let all = 0
        let allSelect = true
        
        for (let f of data){
          if(f.status!=0){
            all += parseFloat(f.price).toFixed(2) * f.count
          }
        }
        for(let d of data){
          if (d.status == 0) {
            allSelect = false
            break
          }
        }
        
        _this.setData({
          list: data,
          all:all.toFixed(2),
          onAllSelect: allSelect
        })
        // console.log(_this.data.all)
      },
    })
  },
  restartComput:function(){
      var data=this.data.list;
      var all=0;
      for (let f of data) {
        if (f.status != 0) {
          all += parseFloat(f.price).toFixed(2) * f.count
        }
      }
      // for (let d of data) {
      //   if (d.status == 0) {
      //     allSelect = false
      //     break
      //   }
      // }

      this.setData({
        // list: data,
        all: all.toFixed(2)
      })

  },
  onUnload: function (option) {
    console.log("离开了")
  },
  onHide:function(e){
    //保存购物车信息



    // console.log("离开了1")
  },
  onSelect(e){
    let _this = this
    // console.log(e.currentTarget.dataset.id)
    let id = e.currentTarget.dataset.id
    let list = this.data.list
    let listFilter = list.filter(r=>r.id == id)[0]
    let status = "" 
    if (listFilter.status==1){
      status =0;
    }
    if (listFilter.status == 0){
      status = 1;
    }

    var dts = this.data.list;
    for (var i = 0; i < dts.length; i++) {
      if (dts[i].id == id) {
        dts[i].status = status;
        break;
      }
    }
    this.setData({ list: dts });
    this.deleteCart(id, status);
  },
  deleteCart(id, status){
    let _this = this
    wx.request({
      url: Api.updateCart(),
      method: "POST",
      header: {
        'Accept': 'application/json'
      },
      data: {
        id: id,
        status
      },
      success: function (e) {
        // _this.onShow()
       _this.restartComput();
      }
    })
  },
  toBalance: function (e) {
    let list = this.data.list
    let lists = list.filter(e=>e.status==1)
    if (lists.length==0){
      wx.showToast({
        icon : 'loading',
        title: '请选择商品',
      })
      return
    }
    let openid = wx.getStorageSync("openid")
    wx.request({
      url: Api.getUserOpenid(),
      method: "post",
      data: {
        openid
      },
      success: function (e) {
        if (e.data.success) {
          let data = e.data.data[0]
          if (data.mobile) {
            wx.navigateTo({
              url: '../balance/balance'
            })
            wx.setStorageSync("userinfo", data)
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


      }
    })
    // let mobile = wx.getStorageSync("mobile")
    // if (mobile == null || mobile == "") {
    //   wx.navigateTo({
    //     url: '/pages/registration/login?type=shopjiesuan',
    //   })
    //   return
    // }
    
  },
  onAllSelect(e){
    let _this = this
    let status = ""
    if (_this.data.onAllSelect==true) {
      status = "0";
      var dts = this.data.list;
      for (var i = 0; i < dts.length; i++) {
        dts[i].status = 0;
      }
    
      this.setData({ list: dts });
      this.deleteCart(null, status)
      _this.setData({
        onAllSelect: false
      })
      return
    }
    if (_this.data.onAllSelect==false) {
      status = "1";
      var dts = this.data.list;
      for (var i = 0; i < dts.length; i++) {
          dts[i].status = 1;
      }
     
      this.setData({ list: dts });
      this.deleteCart(null, status)
      _this.setData({
        onAllSelect : true
      })
      return
    }
    
  },
  navigateDetail:function(e){
    let id = e.currentTarget.dataset.id
    let _this = this
    wx.showModal({
      title: '提示',
      content: '是否删除本条数据',
      success : function(res){
        console.log(res)

        if (res.confirm){
          let status = 2
          _this.deleteCart(id,status)
        }
      }
    })
  }
})
