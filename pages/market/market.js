// hotest.js
var Api = require('../../utils/api.js');
let util = require('../../utils/util.js');
Page({
  data: {
    title: '最热话题',
    hotest: [],
    hidden: false
  },
  // 事件处理函数
  redictDetail: function (e) {
    var id = e.currentTarget.id,
      url = '../node_detail/detail?id=' + id;

    wx.navigateTo({
      url: url
    })
  },
  fetchData: function () {
    var that = this;
    let userid = wx.getStorageSync("userid")
    wx.request({
      url: Api.getHotestTopic({userid}),
      method : "GET",
      success: function (res) {
       // console.log(res);
        
        // let hotest = res.data.datas
        // let hostArray = []
        // for (let h of hotest){
        //   let hot = JSON.parse(h.tags)
        //   if (Array.isArray(hot)){
        //     h.tags = h.tags.sub(1, h.tags.length-1)
        //   }
        // }
        // console.log(hotest)

        let hotest = res.data.datas
        console.log(hotest)
        for (let h of hotest){
          h.startTime = util.formatTime(new Date(h.startTime))
          h.endTime = util.formatTime(new Date(h.endTime))
          if (h.startTime == h.endTime){
            h.today = true
          }else{
            if (h.endTime=="NaN-NaN-NaN"){
              h.today = true
            }else{
              h.today = false
            }
            
          }
        }
        that.setData({
          hotest
        })
        setTimeout(function () {
          that.setData({
            hidden: true
          })
        }, 300)
      }
    })
  },
  onLoad: function (option) {
    
    this.setData({
      hidden: false
    })
    this.fetchData();
  },
  goShopping(){
    wx.navigateTo({
      url: '/pages/book/book',
    })
  }
})
