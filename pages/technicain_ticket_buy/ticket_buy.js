// pages/technicain_ticket_buy/ticket_buy.js

import initCalendar from '../../template/calendar/index';
var Api = require('../../utils/api.js');
var Util = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // input默认是1  
    num: 1,
    // 使用data数据对象设置样式名  
    minusStatus: 'disabled'
  },
  /* 点击减号 */
  bindMinus: function () {
    var num = this.data.num;
    
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      money:this.data.money - this.data.singe,
      num: num,
      minusStatus: minusStatus
    });
  },
  getUserOpenId: function (callback) {
    let openid = wx.getStorageSync("openid")

    if (openid == '' || openid == null) {
      wx.login({
        success: function (e) {

          let code = e.code

          wx.request({
            url: "https://www.yicunyiwang.cn/login/wxlogin",
            //url: "http://localhost:81/login/wxlogin",

            data: { code },
            method: "post",
            header: {
              'content-type': 'application/json'
            },
            success: function (e) {
              // console.log("openid为")
              // console.log(e.data.data.openid)
              let openid = e.data.data.openid;
              callback(openid);
            }
          })
        }
      })
    } else {
      callback(openid);
      // console.log(openid)
    }
  },
  wxlogins(e) {
    let info = e.detail.userInfo
    // let openid = wx.getStorageSync("openid")
    this.getUserOpenId(function (openid) {
      wx.request({
        url: Api.getUserOpenid(),
        method: "post",
        data: {
          openid
        },
        success: function (res) {
          let data = res.data.data[0]
          if (res.data.data.length > 0) {
            let userid = data.id
            let userInfo = data
            let mobile = data.mobile
            // console.log()
            wx.setStorageSync("userinfo", userInfo)
            wx.setStorageSync("userid", userid)
            wx.setStorageSync("mobile", mobile)

            // _this.onShow()
          } else {
            wx.request({
              url: Api.saveUser(),
              method: "post",
              data: {
                // openid,
                headicon: info.avatarUrl,
                sex: info.gender,
                openid: openid,
                name: info.nickName,
              },
              success: function (e) {
                let data = e.data
                if (data.success) {
                  // console.log(data)
                  let userid = data.data.id
                  wx.setStorageSync("userid", userid)
                  // wx.setStorageSync("userid", data.data.id)
                  let userinfo = wx.getStorageSync("userid")
                  
                }
              }
            })
          }
        }
      })
    })

  },
 
  /* 点击加号 */
  bindPlus: function () {
    var num = this.data.num;

    if (this.data.stock-(num+1)<0){
      wx.showToast({
        title: '库存不足'})
      return;
    }
    // 不作过多考虑自增1  
    num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  

    this.setData({
      money: this.data.money + this.data.singe,
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 输入框事件 */
  bindManual: function (e) {
    var num = e.detail.value;
    // 将数值与状态写回  
    this.setData({
      num: num
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)

    //从数据库中加载当前日期的数据
      this.loadThisData(options.id,options.date,1);
      let userid = wx.getStorageSync('userid')
      if (userid == null){
        this.setData({
          isWxlogin:  true 
        })
      }else{
        this.setData({
          isWxlogin: false
        })
      }
  },
  loadThisData:function(id,date,num){//根据编号及时间查询当前商品信息
    var that=this;
    wx.request({
      url: Api.getThisDateByDtid(id,date,num),
      method: "get",
      header: {
        'Accept': 'application/json'
      },
      success: function (e) {
        let res = e.data;
        //重组数据
        let detail = res.datas;

        that.setData({
          isDay: detail.isDay,
          name: detail.name,
          type: detail.type,
          id: detail.id,
          singe: parseFloat(detail.price),
          money: parseFloat(detail.price),
          img: detail.img,
          spotid: detail.spotid,
          stock: detail.stock - (detail.ecnum > 0 ? detail.ecnum : 0)
        })
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
    //1.传入价格信息
    //2.传入是否单选
    initCalendar(true,40,this);
    
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
  onSelectDay(e){
    // console.log(e)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  toBuyCard: function (e) {
    let _this = this
    
    let mobile = wx.getStorageSync("mobile")
    let userid = wx.getStorageSync("userid")
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
            // console.log(_this.data.calendar.curYear)
            let curYear = _this.data.calendar.curYear
            let curMonth = _this.data.calendar.curMonth
            let days = _this.data.calendar.days
            let day = days.filter(e => e.choosed)[0].day
            let startTime = new Date(curYear, curMonth - 1, day)
            let endTime = new Date(curYear, curMonth - 1, day + 1)
            wx.request({
              url: Api.postCart(),
              method: "POST",
              header: {
                'Accept': 'application/json'
              },
              data: {
                userid,
                spotid: _this.data.spotid,
                name: _this.data.name,
                goodsId: _this.data.id,
                price: _this.data.money.toFixed(2),
                starttime: startTime,
                endtime: endTime,
                type: _this.data.type,
                count: _this.data.num,
                status: "0",
                goodimg: _this.data.img
              }
            })


            wx.switchTab({
              url: '../buycard/buycard'
            })
            // wx.setStorageSync(userinfo, data)
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

    
   
  },
  toBalance: function (e) {
    let _this = this
    let that = this
    let curYear = this.data.calendar.curYear
    let curMonth = this.data.calendar.curMonth
    let days = this.data.calendar.days
    
    let day = days.filter(e => e.choosed)[0]
    // console.log(day)
    let startTime
    let endTime
    
    if (day){
      
      
      startTime = new Date(curYear, curMonth - 1, day.day)
      endTime = new Date(curYear, curMonth - 1, day.day + 1)
    }else{
      wx.showModal({
        title: '警告',
        content: '请选择具体时间',
      })
      return
    }
    
    let openid = wx.getStorageSync("openid")
    wx.request({
      url: Api.getUserOpenid(),
      method : "post",
      data : {
        openid
      },
      success : function(e){
        if(e.data.success){
          let data = e.data.data[0]
          if (data.mobile){
            wx.navigateTo({
              url: `../balance/balance?type=zhifu&id=${that.data.id}&count=${that.data.num}&startTime=${startTime}&endTime=${endTime}`
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
      }
    })
  }
})