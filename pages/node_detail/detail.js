// detail.js
var Util = require('../../utils/util.js');
var Api = require('../../utils/api.js');

Page({
  data: {
    title: '话题详情',
    detail: {},
    replies: [],
    hidden: false
  },
  fetchDetail: function(id) {
    var that = this;
    wx.request({
      url: Api.getTopicInfo(id),
      success: function(res) {
        that.setData({
          hidden: true
        })
        res.data.datas[0].createAt = Util.formatTime(new Date(res.data.datas[0].createAt));
        res.data.datas[0].startTime = Util.formatTime(new Date(res.data.datas[0].startTime));
        res.data.datas[0].endTime = Util.formatTime(new Date(res.data.datas[0].endTime));

        that.setData({
          detail: res.data.datas[0]
        })
      }
    })
   // that.fetchReplies(id);
  },
  fetchReplies: function(id) {
    var that = this;
    wx.request({
      url: Api.getReplies({
        topic_id: id
      }),
      success: function(res) {
        res.data.forEach(function(item) {
          item.created = Util.formatTime(Util.transLocalTime(item.created));
        })
        that.setData({
          replies: res.data
        })
        setTimeout(function() {
          that.setData({
            hidden: true
          })
        }, 300)
      }
    })
  },
  onLoad: function (options) {
    this.setData({
      hidden: false
    })
    this.fetchDetail(options.id);
  }
})
