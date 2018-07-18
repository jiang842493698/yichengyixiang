var app = getApp()
var mydata = require('../../utils/data')
var util = require('../../utils/util')
var Api = require('../../utils/api.js');

Page({
  data: {
    evaContent: "",
    name:"",
    price: '',
    bookToastHidden: true,
    hotTag: [],
    urls:[]
  },
  onLoad: function (options) {
    // this.setData({
    //   artype:options.artype
    // })   

    var that = this
    wx.request({
      url: Api.getMarketTags(),
      method: 'get',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        res = res.data;
        that.setData({
          hotTag: res.datas
        });
      }
    })
  },

  bindToastTap: function () {
    console.log('预定成功')
    this.setData({
      bookToastHidden: false
    })
  },
  hideToast: function () {
    this.setData({
      bookToastHidden: true
    })
  },
  // 日期选择
  bindDateChange: function (e) {
    console.log('date picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  // 时间选择
  bindTimeChange: function (e) {
    console.log('time picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  } //事件
  , textBlur: function (e) {
    if (e.detail && e.detail.value.length > 0) {
      if (e.detail.value.length < 12 || e.detail.value.length > 500) {
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
  evaSubmit: function (e) {
    var that = this;
    //   //提交(自定义的get方法)
    //   app.func.req('http://localhost:1111/ffeva/complaint?content=''+this.data.evaContent),get,function(res){
    //     console.log(res);
    //   if (res.result === '1') {
    //     //跳转到首页
    //     app.func.showToast('提交成功', 'loading', 1200);
    //   } else {
    //     app.func.showToast('提交失败', 'loading', 1200);
    //   }
    // });

    // var that = this;
    // wx.request({
    //   url: Api.saveTopicInfo(),
    //   method: 'post',
    //   data: {
    //     content: this.data.evaContent,
    //     date: this.data.date + " " + this.data.time,
    //     openid: app.globalData.userInfo.openid
    //   },
    //   header: {
    //     'Accept': 'application/json'
    //   },
    //   success: function (res) {
    //     if (res.result === '1') {
    //       //跳转到首页
    //       app.func.showToast('提交成功', 'loading', 1200);
    //     } else {
    //       app.func.showToast('提交失败', 'loading', 1200);
    //     }
    //   }
    // })

    var that = this;
    wx.request({
      url: Api.saveFeature(),
      method: 'post',
      data: {
        content: e.detail.value.evaContent,
        name: e.detail.value.name,
        price: e.detail.value.price,
        images: this.data.urls,
        spotid: 'AT016'
      },
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res.data.success == 1) {
          //跳转到首页
          // app.func.showToast('提交成功', 'loading', 1200);
          // this.setData({
          //   bookToastHidden: false
          // })

          wx.showToast({
            title: '提交成功',
            icon: 'succes',
            duration: 1000,
            mask: true
          })

          wx.navigateBack({ changed: true });

        } else {
           
          wx.showToast({
            title: '提交失败',
            icon: 'succes',
            duration: 1000,
            mask: true
          })
        }
      }
    })
  },
  searchByTag: function () {

    //选择标签
  },
   
  //添加Banner  
  bindChooiceProduct: function () {
    var that = this;
    var urls=[];
    wx.chooseImage({
      count: 3,  //最多可以选择的图片总数  
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        var tempFilePaths = res.tempFilePaths;
        //启动上传等待中...  
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 10000
        })
        var uploadImgCount = 0;
        for (var i = 0, h = tempFilePaths.length; i < h; i++) {
          wx.uploadFile({
            url: Api.uploadFile(),
            filePath: tempFilePaths[i],
            name: 'uploadfile_ant',
            formData: {
              'imgIndex': i
            },
            header: {
              "Content-Type": "multipart/form-data"
            },
            success: function (res) {
              uploadImgCount++;
              var data = JSON.parse(res.data);
              //服务器返回格式: { "Catalog": "testFolder", "FileName": "1.jpg", "Url": "https://test.com/1.jpg" }  
              //var productInfo = that.data.url;
              // if (productInfo.bannerInfo == null) {
              //   productInfo.bannerInfo = [];
              // }
              // productInfo.bannerInfo.push({
              //   "catalog": data.Catalog,
              //   "fileName": data.FileName,
              //   "url": data.Url
              // });
              that.data.urls.push(data.url);
              that.setData({
                urls: that.data.urls
              });
             
              //如果是最后一张,则隐藏等待中  
              if (uploadImgCount == tempFilePaths.length) {
                wx.hideToast();
              }
            },
            fail: function (res) {
              wx.hideToast();
              wx.showModal({
                title: '错误提示',
                content: '上传图片失败',
                showCancel: false,
                success: function (res) { }
              })
            }
          });
        }
      }
    });  
  }
})