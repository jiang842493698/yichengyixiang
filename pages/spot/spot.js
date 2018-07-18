
var Api = require('../../utils/api.js');
// pages/spot.js
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
 
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },


  load_spot:function(){
    var that = this
    wx.request({
      url: Api.getSpotList(),
      method: 'get',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        res=res.data;
        //重组数据

        var spots=res.datas.rows1;

       for(var j=0;j<spots.length;j++){  
          spots[j].datas=[];
          for(var i=0;i<res.datas.rows2.length;i++){
            if (res.datas.rows2[i].spotid=spots[j].id){
              spots[j].datas.push(res.datas.rows2[i]);
          }

        }
        
      }
      for(let s of spots){
          s.spotimg = JSON.parse(s.spotimg)[0]
      }
     
       that.setData({
          list: spots
        });
      }
    })
  },
  navView:function(event){
    let spotid = event.currentTarget.dataset.spotid;
    wx.navigateTo({
      url: '/pages/searchs/search?spotid=' + spotid
    })
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.load_spot();
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
  changdi(){
    wx.navigateTo({
      url: '/pages/searchs/search'
    })
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