// detail.js
var Util = require('../../utils/util.js');
var Api = require('../../utils/api.js');

Page({
  data: {
    title: '活动详情',
    detail: {},
    replies: [],
    hidden: false,
    nodes : {
      name:"<br/>",

    }
  },
  fetchDetail: function (id) {
    var that = this;
    wx.request({
      url: Api.getEventInfo(),
      method : "post",
      data : {
        id
      },
      success: function (res) {
        that.setData({
          hidden: true
        })
        res.data.datas[0].createAt = Util.formatTime(new Date(res.data.datas[0].createAt));
        let detail = res.data.datas[0]
        
        // console.log(content)
        let contents = "" 
        let content = []
        if (detail.content){
          contents = detail.content
          let str = contents.replace(/\\n/g,"|-&")
          console.log(str)
          content = str.split("|-&")
          if (content[0]){
            content = content
          }else{
            content = contents
          }
        }
        console.log(content)
        that.setData({
          detail,
          content
        })
      }
    })
    // that.fetchReplies(id);
  },
  fetchReplies: function (id) {
    var that = this;
    wx.request({
      url: Api.getReplies(),
      method : "POST",
      data:{
        activeId: id
      },
      success: function (res) {
        console.log("ggggggggggggggg")
        console.log(res.data.data)
        let data = res.data.data
        if (res.data.success){
          let activeDate = data[0].activeDate
          wx.request({
            url: Api.activeDate(),
            method:"POST",
            data:{
              id: activeDate
            },
            success:function(ress){
              let datas = ress.data.data
              console.log(datas)
              that.setData({
                data,
                activeDate: datas[0]
                // activeDate: data[0].activeDate,
                // priceInfo : data[0].priceInfo
              })
            }
            
          })
          
        

        }
        
      }
    })
  },
  detailInfo : function(id){
    let _this = this
    wx.request({
      url: Api.eventInfo(),
      method : "POST",
      data: {
        activeId: '002'
      },
      success: function (res) {
        let data = res.data.data
        _this.setData({
          eventInfo: data
        })
      }
    })
  },
  onLoad: function (options) {
    console.log("yyyyyyyyyyyy")
    console.log(options.id)
    this.setData({
      hidden: false
    })
    this.fetchDetail(options.id);
    this.fetchReplies(options.id);
    this.detailInfo()
  }
})
