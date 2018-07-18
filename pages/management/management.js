// pages/management/management.js

var Api = require('../../utils/api.js');
let util = require('../../utils/util.js')
let roleid
let _this
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    roleid = options.roleid
    console.log(roleid)
    _this = this
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
    _this.setData({
      roleName: []
    })
   
    this.findUserAuthorityGoods(roleid)
  },
  kehuxiangqing(e){
    console.log(e.currentTarget.dataset.id)
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    let price = e.currentTarget.dataset.price
    wx.navigateTo({
      url: `/pages/management/manageinfo/manageinfo?id=${id}&name=${name}&price=${price}`,
    })
  },
  shezhizhekou(e){
    console.log(e)
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/management/manage_set/index?id=' + id + "&spotid=" + roleid,
    })
  },
  findUserAuthorityGoods(roleid) {
   
        wx.request({
          url: Api.myClient(),
          method : "post",
          data : {
            spotid: roleid
          },
          success : function(res){
            console.log(res)
            let datas = res.data.data
            for(let d of datas){
              let date = new Date(d.orderDate)
              d.orderDate = util.formatTime(date)
            }
            let rolecontent = datas.reduce((accu, curr)=>{
              const sameNameEle = accu.find(e => e.name === curr.name)
              if (sameNameEle) {
                sameNameEle.price = Number(sameNameEle.price)
                sameNameEle.price += Number(curr.price)
              } else {
                accu.push(curr)
              }
              return accu
            },[])
            for(let r of rolecontent){
              r.price = Number(r.price).toFixed(2)
            }
            console.log(rolecontent)
            _this.setData({
              rolecontent: rolecontent
            })

          }
        })
      // }
  //   })
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
  
  }
})