/*technician.js*/

//获取应用实例
var app = getApp()
var fileData = require('../../utils/data.js')
var util = require('../../utils/util')
var Api = require('../../utils/api.js');
let _this
let type
let count
let endTime
let startTime
let id
Page({
  // 页面初始数据
  data: {
    total: 0,
    isHongbao: true
  },
  onLoad: function (option) {
    _this = this
    console.log("7777777777")
    console.log(option)
    type = option.type
    endTime = option.endTime
    count = option.count
    id = option.id
    startTime = option.startTime

    _this.setData({
      type
    })
  },
  onShow() {
    console.log(type)
    let userid = wx.getStorageSync("userid")
    wx.request({
      url: Api.getPay(),
      method: "post",
      data: {
        userid
      },
      success: function (e) {
        if (e.data.data.length == 0) {
          _this.setData({
            isNewPeople: true
          })
        } else {
          _this.setData({
            isNewPeople: false
          })
        }
        if (type) {
          _this.isPaySelect(id)
        } else {
          _this.isSelect()
        }
      }
    })


  },
  isPaySelect(id) {
    let sid = id
    let userid = wx.getStorageSync("userid")
    wx.request({
      url: Api.goodsInfo(),
      method: "post",
      data: {
        goodid: sid,
        userid
      },
      success: function (e) {
        console.log(e)
        let data = e.data.data
        let allPrice = 0
        let allCount = 0
        let allheji = 0
        //折扣初始值为0
        let alldiscount = 0
        let alljiage = 0
        let isNewPeople = _this.data.isNewPeople
        // let xinrenmanjian = 0
        //是新人的话判断满减额



        for (let f of data) {
          if (f.status != 0) {
            //判断满减额是否大于价格

            f.allPrice = (Number(f.price).toFixed(2)) * count


            allPrice += f.allPrice
            allheji = allPrice
            // f.discountPrice = (f.price * count * 1).toFixed(2) * (f.mydiscount == null || f.mydiscount == "" ? 100 : f.mydiscount)
            // alldiscount += f.discountPrice
            // f.all = Number(f.price).toFixed(2) * count * Number((f.percentage == "" || f.percentage == null ? 100 : f.percentage) / 100).toFixed(2) * Number((f.mydiscount == "" || f.mydiscount == null ? 100 : f.mydiscount) / 100).toFixed(2)
            // allheji += f.all
            f.count = Number(count)
            allCount += Number(f.count)
          }
        }
        //获取新人减少的价格
        // xinrenmanjian = (data[0].statusDecrease == null || data[0].statusDecrease == "") ? 0 : data[0].statusDecrease


        //总价格减少新人的价格   
        // allPrice = allPrice - xinrenmanjian
        //获取满减额度
        // let reductionFull=(data[0].reductionFull == null || data[0].reductionFull == "") ? 0 : data[0].reductionFull
        //设置减少的额度为0
        // let cutback =0
        //判断价格是够大于优惠券的限制条件
        // if (allPrice >= reductionFull){
        //   //如果是的话额度为0
        //   cutback = (data[0].cutback == null || data[0].cutback == "") ? 0 : data[0].cutback
        // }
        //价格减去额度
        // allPrice=allPrice - cutback
        //判断有没有使用红包
        let isHongbao = _this.data.isHongbao
        //设置红包的初始额度为0
        let hongbaoprice = 0
        //获取红包的额度
        //如果使用红包价格=红包的额度
        let hongbaoOffer = _this.data.hongbaoOffer
        if (hongbaoOffer != null) {
          hongbaoprice = hongbaoOffer.quota
        }



        //获取折扣
        alldiscount = (data[0].mydiscount == null || data[0].mydiscount == "") ? 100 : Number(data[0].mydiscount)
        //获取折扣价格
        let discount = allPrice * alldiscount / 100
        allPrice = allPrice * alldiscount / 100
        console.log(allPrice)
        //获取定金
        let percentagePrice = (data[0].percentage == null || data[0].percentage == "") ? 100 : Number(data[0].percentage)
        let percentage = allPrice * Number(percentagePrice) / 100
        allPrice = allPrice * Number(percentagePrice) / 100

        allPrice = allPrice - hongbaoprice
        console.log(allPrice)
        _this.setData({
          list: data,
          all: allPrice,
          count: allCount,
          allPrice: allheji.toFixed(2),
          discount,
          percentage
        })


      }
    })
    // wx.request({
    //   url: Api.getGoodsDetail({sid}),
    //   method : "get",
    //   success:function(e){
    //     let data = e.data.datas
    //     let zk = 1;
    //     let bl = 0.3;
    //     let allPrice = data[0].price*count
    //     for (let f of data) {
    //       if (f.status != 0) {
    //         let allPrices = (f.price * count * 1).toFixed(2)
    //         // all += parseFloat(f.price * count)
    //         f.allPrice = allPrices
    //       }
    //     }
    //     //获取当前商品的折扣



    //     console.log(data)
    //     _this.setData({
    //       list: data,
    //       all: allPrice * zk * bl,
    //       count,
    //       discount: (zk * 100) + "%",
    //       deposit: (bl * 100) + "%",
    //       allPrice
    //     })
    //   }
    // })
  },
  hongbao() {
    let userid = wx.getStorageSync("userid")
    wx.request({
      url: Api.getCard(),
      method: "post",
      data: {
        userid,
        currentDate: new Date(),
      },
      success: function (e) {
        let data = e.data.data
        console.log(data)
        for (let d of data) {
          d.startTime = util.formatTime(new Date(d.startTime))
          d.endTime = util.formatTime(new Date(d.endTime))
        }
        _this.setData({
          isHongbao: false,
          hongbaolist: data
        })

      }

    })

  },
  //红包优惠的值的json hongbaoOffer
  shiyonghongbao(e) {
    let hongbaolist = _this.data.hongbaolist
    console.log(e.currentTarget.dataset.id)
    let id = e.currentTarget.dataset.id
    let hongbaoOffer = hongbaolist.filter(e => e.id = id)[0]
    _this.setData({
      isHongbao: true,
      hongbaoOffer
    })
    _this.onShow();

  },
  isSelect() {
    let status = "1"
    let userid = wx.getStorageSync("userid")
    wx.request({

      url: Api.getCart(userid, status),
      method: "GET",
      header: {
        'Accept': 'application/json'
      },
      success: function (e) {
        let data = e.data.data
        // let allPrice = 0
        let allCount = 0
        let allheji = 0
        let alldiscount = 0
        let alljiage = 0
        for (let f of data) {
          if (f.status != 0) {
            // let allPrices = (f.price * count * 1).toFixed(2)
            // all += parseFloat(f.price * count)
            f.allPrice = Number(f.price).toFixed(2) * f.count
            alljiage += f.allPrice
            f.discountPrice = (f.price * f.count * 1).toFixed(2) * (f.mydiscount == null || f.mydiscount == "" ? 100 : f.mydiscount)
            alldiscount += f.discountPrice
            f.all = Number(f.price).toFixed(2) * f.count * Number((f.percentage == "" || f.percentage == null ? 100 : f.percentage) / 100).toFixed(2) * Number((f.mydiscount == "" || f.mydiscount == null ? 100 : f.mydiscount) / 100).toFixed(2)
            allheji += f.all

            allCount += Number(f.count)
          }
        }
        //折后价格
        let allPrice = alldiscount
        //是否新人
        // let isNewPeople = _this.data.isNewPeople
        // let xinrenmanjian = 0

        // xinrenmanjian = (data[0].statusDecrease == null || data[0].statusDecrease == "") ? 0 : data[0].statusDecrease


        //总价格减少新人的价格   
        // allPrice = allPrice - xinrenmanjian
        //获取满减额度
        // let reductionFull = (data[0].reductionFull == null || data[0].reductionFull == "") ? 0 : data[0].reductionFull
        //设置减少的额度为0
        // let cutback = 0
        //判断价格是够大于优惠券的限制条件
        // if (allPrice >= reductionFull) {
        //   //如果是的话额度为0
        //   cutback = (data[0].cutback == null || data[0].cutback == "") ? 0 : data[0].cutback
        // }
        //价格减去额度
        // allPrice = allPrice - cutback
        //判断有没有使用红包
        let isHongbao = _this.data.isHongbao
        //设置红包的初始额度为0
        let hongbaoprice = 0
        //获取红包的额度



        //如果使用红包价格=红包的额度
        let hongbaoOffer = _this.data.hongbaoOffer
        if (hongbaoOffer != null) {
          hongbaoprice = hongbaoOffer.quota
        }


        allPrice = allPrice - hongbaoprice

        alldiscount = (data[0].mydiscount == null || data[0].mydiscount == "") ? 100 : Number(data[0].mydiscount)
        let discounts = allPrice * alldiscount / 100
        allPrice = allPrice * alldiscount / 100


        _this.setData({
          list: data,
          all: allheji.toFixed(2),
          count: allCount,
          allPrice: alljiage.toFixed(2),


        })
        // let data = e.data.data
        // let all = 0
        // console.log(data)

        // for (let f of data) {
        //   if (f.status != 0) {
        //     let allPrices = (f.price * f.count * 1).toFixed(2)
        //     all += parseFloat(f.price * f.count)
        //     f.allPrice = allPrices
        //   }
        // }
        // let total = all
        // let zk = 1;
        // let bl = 0.3;
        // all = all * zk * bl

        // _this.setData({
        //   list: data,
        //   all:all.toFixed(2),
        //   count: data.length,
        //   discount: (zk * 100) + "%",
        //   deposit: (bl * 100) + "%",
        //   allPrice: (total).toFixed(2),
        // })
      },
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
  WeiXinPay: function (e) {
    //获取签证信息
    var that = this;
    //循环数据，app.cardDatas
    var specids = [];
    var counts = [];
    var goodsids = [];
    var prices = [];
    var freights = [];
    let list = that.data.list
    let spotid = []
    if (!type) {
      for (let l of list) {
        specids.push(l.goodsId);
        counts.push(1);
        goodsids.push(l.goodsId);
        prices.push(l.price);
        freights.push(0);
        spotid.push(l.spotid)
      }
    } else {
      for (let l of list) {
        specids.push(id);
        counts.push(count);
        goodsids.push(id);
        prices.push(l.price);
        freights.push(0);
        spotid.push(l.spotid)
      }
    }
    let userid = wx.getStorageSync("userid")
    let mobile = wx.getStorageSync("mobile")
    if (mobile == null || mobile == "") {
      wx.navigateTo({
        url: '/pages/registration/login',
      })
      return

    }

    let openid = wx.getStorageSync("openid")
    wx.request({
      url: Api.generate_exchange(),
      method: 'post',
      data: {
        userid: userid,
        openid: openid,
        specids: specids,
        // spotid : spotid,
        counts: counts,
        goodsids: goodsids,
        freights: freights,
        prices: prices,
        total: that.data.all,
        type: 1
      },
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        // that.setData({
        //   list: res.data.datas
        // });

        if (res.data.data) {
          var pay = res.data.data;
          that.weixin_onBridgeReady(pay);
        }
      }
    })


  },
  weixin_onBridgeReady: function (pay) {
    let userid = wx.getStorageSync("")
    wx.requestPayment({
      'timeStamp': pay.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
      'nonceStr': pay.nonceStr, // 支付签名随机串，不长于 32 位
      'package': pay.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
      'signType': pay.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
      'paySign': pay.paySign,
      'success': function (res) {
        // console.log("2222222222222")
        wx.showToast({
          title: '支付成功',
          icon: 'succes',
          duration: 1000,
          mask: true
        })
        //支付成功后判断是否是购物车支付，如果是的话则删除购物车信息
        if (!type) {
          //删除购物车中已选中商品的信息

        }
        //向pay_card表中添加一条数据
        //获取使用中的红包


        app.cardDatas = [];
        wx.switchTab({
          url: '/pages/search/search',
        })
        // wx.navigateBack({ delta:1});
      },
      'fail': function (res) {
        wx.showToast({
          title: '支付失败',
          icon: 'succes',
          duration: 1000,
          mask: true
        })
      }
    })
  }
})
