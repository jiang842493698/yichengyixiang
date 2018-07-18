// pages/userverify/userverify.js
var Api = require('../../utils/api.js');
var util = require('../../utils/util.js');
let _this
Page({

  /**
   * 页面的初始数据
   */
  data: {
    levelArray:[1,2,3,4,5,6,7,8,9]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this
    _this.isSelect(1)
    _this.setData({
      chuliId:1
    }) 
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  //查询
  isSelect(chuliId){
    wx.request({
      url: Api.applicationUser(),
      method :"post",
      data :{
        applicationStatus: chuliId
      },
      success : function(e){
        // console.log(e)
        let list = e.data.data
        for(let l of list){
          l.createAt = util.formatTime(new Date(l.createAt))
          l.businesslicenseurl = JSON.parse(l.businesslicenseurl)
        }
        _this.setData({
          list
        })
      }
    })
  },
  //点击待处理和已处理状态
  chuli(e) {
    // console.log(e)
    let chuliId = e.currentTarget.dataset.id
    _this.setData({
      chuliId
    })
    _this.isSelect(chuliId)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    _this.isSelect(1)
    _this.setData({
      chuliId: 1
    }) 
  },
  //驳回
  cancel(e){
    // let level = _this.data.level
   
    // let list = this.data.list

    let id = e.currentTarget.dataset.id
    // let lists =  list.filter(e=>e.id == id)
    // if (!lists.level) {
    //   wx.showLoading({
    //     title: '请设置等级',
    //   })
    //   return
    // } 
    _this.isEndSelect(id, 2)
  },
  //通过
  concur(e){
    // let level = _this.data.level
    // if (!level){
    //   wx.showModal({
    //     title: '警告',
    //     content: '请设置等级',
    //   })
    //   return
    // } 
    let level = _this.data.level

    let list = this.data.list

    let id = e.currentTarget.dataset.id
    let lists = list.filter(e => e.id == id)[0]
    // console.log(lists)
    if (!lists.level) {
      wx.showLoading({
        title: '请设置等级',
        success : function(e){
          setTimeout(function(){
            hide()
          },1000)
        }
      })
      let hide=function(){
        wx.hideLoading()
      }
      return
    } 
    _this.isEndSelect(id, 3)
    //已通过
    _this.updateUser(id,lists.level)
    
  },
  //修改user表中的状态
  updateUser(id, level){
    let list = _this.data.list
    let listjson = list.filter(e=>e.id==id)[0]
    console.log()
    wx.request({
      url: Api.updateUser(),
      method : "post",
      data : {
        id: listjson.userid,
        companyName: listjson.companyName,
        img: listjson.businesslicenseurl,
        invoiceInfo:listjson.billingInfo,
        level: "" + level
      },
      success : function(e){
        // console.log(e)
      }
    })
  },
  // isOnSelect(id){

  // },
  selectLevel(e){
    console.log(e)
    let id = e.currentTarget.dataset.id
    let list = _this.data.list
    let value = e.detail.value
    let levelArray = _this.data.levelArray
    let level = levelArray[value]
    for(let l of list){
      if(l.id == id){
        l.level = level
      }
    }

   
    // console.log(value)
    _this.setData({
      list
    })
  },

  //处理审核的接口
  isEndSelect(id, applicationStatus){
    wx.request({
      url: Api.setAuthenticate(),
      method : "post",
      data : {
        id,
        applicationStatus 
      },
      success : function(res){
        if (applicationStatus==2){
          wx.showToast({
            title: '驳回成功',
            success : function(e){
              aaa()
            }
          })
          let aaa = function(){
            _this.isSelect(1)
          }
        }
        if (applicationStatus == 3) {
          wx.showToast({
            title: '通过审核',
            success: function (e) {
              aaa()
            }
          })
          let aaa = function () {
            _this.isSelect(1)
          }
        }
       
      }
    })
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