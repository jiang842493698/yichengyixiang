var app = getApp()
var mydata = require('../../utils/data')
var util = require('../../utils/util')
var Api = require('../../utils/api.js');

Page( {
  data: {
    evaContent:"",
    date : '2016-10-14',
    time : '12:00',
    bookToastHidden: true,
     hotTag:[],
     isStartTime : false,
     istoDay : true
  },
  onLoad: function (options) {
    // this.setData({
    //   artype:options.artype
    // })   
    let startDate = new Date()
    let startDateTime = util.formatTime(startDate)

    let endDate = new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDate()+1)
    // console.log(endDate)
    let endDateTime = util.formatTime(endDate)
    console.log(endDateTime)
    this.setData({
      startDateTime,
      date: startDateTime,
      endDateTime
    })



    var that = this
    wx.request({
      url: Api.getMarketTags(),
      method: 'get',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        res = res.data;
        let data = res.datas
        for(let d of data){
          d.isSelect = false
        }
        that.setData({
          hotTag: data
        });
      }
    })
  },
  isStartActivity(e){
    let startTimeId = e.currentTarget.dataset.id
    let startTimeType = startTimeId == 1 ? "上午" :  "下午"
    this.setData({
      startTimeType,
      startTimeId
    })
  },
  isEndActivity(e){
    let endTimeId = e.currentTarget.dataset.id
    let endTimeType = endTimeId == 1 ? "上午" : "下午"
    this.setData({
      endTimeType,
      endTimeId
    })
  },
  bindToastTap:function(){
      console.log('预定成功')
      this.setData({
          bookToastHidden:false
      })
  },
  hideToast:function(){
    this.setData({
          bookToastHidden:true
      })
  },
  charChange(e){
    console.log(e.detail.value)
    let value = e.detail.value
    if (value.length>=12&&value.length<=500){
      this.setData({
        evaContent: value
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '活动需求描述为12-500字',
      })
    }
    
  },
  // 活动日期选择
  bindDateChange: function(e){
    console.log('date picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value,
      startDateTime: e.detail.value,
      endDateTime: e.detail.value,
    })
  },
  //开始日期选择
  bindStartChange(e){
    
    this.setData({
      startDateTime: e.detail.value,
      
    })
  },
  //结束日期选择
  bindEndChange(e){
    this.setData({
      endDateTime: e.detail.value,

    })
  },
  // 时间选择
  bindTimeChange: function(e){
    console.log('time picker发送选择改变，携带值为', e.detail.value)
    this.setData({
          time: e.detail.value
    })
  } //事件
 ,textBlur: function (e) {
    if (e.detail && e.detail.value.length > 0) {
      if (e.detail.value.length <= 0 || e.detail.value.length > 500) {
        //app.func.showToast('内容为12-500个字符','loading',1200);
      } else {
        this.setData({
          evaContent: e.detail.value
        });
      }
    } else {
      this.setData({
        evaContent: ''
      });
      evaData.evaContent = '';
      app.func.showToast('请输入', 'loading', 1200);
    }
  },

  //提交事件
  evaSubmit: function (eee) {
    var that = this;
    let userid = wx.getStorageSync("userid")
    let hotTag = this.data.hotTag
    let tag = hotTag.filter(e=>e.isSelect==true) 
    let tagsArray = []
    for (let t of tag){
      tagsArray.push(t.name)
    }
    let tags = tagsArray.join(",")
    console.log(tags)
    let content = this.data.evaContent == null ? null : this.data.evaContent
    // let data = this.data.date == null ? null : this.data.date
    let startDateTime = this.data.startDateTime == null ? this.data.date : this.data.startDateTime
    let endDateTime = this.data.endDateTime == null ? this.data.date : this.data.endDateTime
    let startTimeType = this.data.startTimeType == null ? null : this.data.startTimeType
    let endTimeType = this.data.endTimeType == null ? null : this.data.endTimeType
    // if (tags.length==0){
    //   wx.showModal({
    //     title: '警告',
    //     content: '请选择标签',
    //   })
    //   return
    // }
    if (!startTimeType) {
      wx.showModal({
        title: '警告',
        content: '请选择活动时长',
      })
      return
    }

    // if (!startTime){
    //   wx.showModal({
    //     title: '警告',
    //     content: '请选择时间',
    //   })
    //   return
    // }
    
    if (!content) {
      wx.showModal({
        title: '警告',
        content: '请输入需求描述',
      })
      return
    }
    let istoDay = this.data.istoDay
    if (istoDay){
      endDateTime = startDateTime
    }
    wx.request({
      url: Api.saveTopicInfo(),
      method: 'post',
      data:{
        content,
        startTime: startDateTime,
        endTime: endDateTime,
        userid: userid,
        tags,
        startTimeType,
        endTimeType
      },
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        wx.showToast({
          title: '发布成功',
          icon: "success",
          complete: function () {
            setTimeout(function () {
              aaa()
            }, 3000)
          }
        })
        let aaa = function () {
          wx.redirectTo({
            url: '../market/market'
          })
        }
        
          //  if (res.result == 1) {
          //     //跳转到首页
          //    wx.showToast({
          //      title: '提交成功',
          //      icon: 'succes',
          //      duration: 1000,
          //      mask: true
          //    })
          //   } else {
          //     wx.showToast({
          //       title: '提交失败',
          //       icon: 'succes',
          //       duration: 1000,
          //       mask: true
          //     })
          //   }
      }
    })
 },
  searchByTag:function(e){
    let _this = this
    
    let hotTag = _this.data.hotTag
    let keyword = e.currentTarget.dataset.keyword
    for (let f of hotTag){
      if (f.name == keyword){
        f.isSelect = !f.isSelect
      }
    }
    _this.setData({
      hotTag
    })
    //选择标签
  },
  //选择活动时间段
  isActivity(e){
    // console.log(e.currentTarget.dataset.id)
    let id = e.currentTarget.dataset.id
    console.log(id)
    let startTimeType = id == 1?"上午":id==2?"下午":id==3?"全天":"自定义"
    this.setData({
      startTimeType,
      endTimeType: startTimeType,
      id
    })
    if (startTimeType=="自定义"){
      this.setData({
        isStartTime:true,
        istoDay : false
      })
    }else{
      this.setData({
        
        isStartTime: false

      })
    }
  }
})