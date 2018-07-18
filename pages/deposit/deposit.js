
// pages/deposit/deposit.js
var app = getApp();
var Api = require('../../utils/api.js');
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
    //查询所有类型列表
    let _this = this
    wx.request({
      url: Api.getGoodTypeList(),
      method: "get",
      success: function (res) {
        let data = res.data.datas
        _this.setData({
          datalist: data
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
  
  },
  renzheng(){
    let userid = wx.getStorageSync("userid")
    
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
  submit:function(){
    // console.log(this.data.datalist)
    var datas = this.data.datalist;
    var types=[];
    var values=[];

    for(var i=0;i<datas.length;i++){
      types.push(datas[i].goodid);
      values.push(datas[i].percentage);
    }
    wx.request({
      url: Api.setDiscount(),
      method: 'post',
      header: {
        'Accept': 'application/json'
      },
      data: {
        types: types,
        values: values
      },
      success: function (res) {
        res = res.data;
        wx.showToast({
          title: '设置成功',
          icon: 'succes',
          duration: 1000,
          mask: true
        })
      }
    })
  },
  //获取用户输入的用户名
  onphone: function (e) {
    var id = e.currentTarget.dataset.id;
    // console.log(e.detail.value)
    var datas =this.data.datalist;

    for(var i=0;i<datas.length;i++){
        if(datas[i].id==id){
          datas[i].percentage = e.detail.value;
        }
    }

    this.setData({ datalist: datas})
  },
})