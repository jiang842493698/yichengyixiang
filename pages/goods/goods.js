// pages/goods/goods.js
var util = require('../../utils/util')
var Api = require('../../utils/api.js');
let _this
let spotid
Page({

  /**
   * 页面的初始数据
   */
  data: {
    urls : []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this
    spotid = options.spotid
    
    wx.request({
      url: Api.getMarketTags(),
      method: 'get',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        res = res.data;
        let hotTag = res.datas
        for (let h of hotTag) {
          h.isSelect = false
        }
       
        _this.setData({
          hotTag
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  charChange(){
    
  },
  bindChooiceProduct: function () {
    
    var urls = [];
    wx.chooseImage({
      count: 9,  //最多可以选择的图片总数  
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
              _this.data.urls.push(data.url);
              _this.setData({
                urls: _this.data.urls
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
  },
  evaSubmit: function (e) {
    // wx.showToast({
    //   title: e.detail.formId,
    //   icon: 'succes',
    //   duration: 1000,
    //   mask: true
    // })
    console.log(e.detail.formId)
   
    let name = e.detail.value.name
    let price = e.detail.value.price
    let description = e.detail.value.evaContent
    let urls = this.data.urls
    let keyword = this.data.keyword
    // let hotTag = this.data.hotTag
    // let type = hotTag.filter(e => e.isSelect == true)

    if (name == null || name == "") {
      wx.showModal({
        title: '警告',
        content: '名称不可以为空'
      })
      return
    }
   
    if (price == null || price == "") {
      wx.showModal({
        title: '警告',
        content: '价格不可以为空'
      })
      return
    }
    if (description == null || description == "") {
      wx.showModal({
        title: '警告',
        content: '描述内容不可以为空'
      })
      return
    }
    let labelArray = []
    
    wx.request({
      url: Api.postgoods(), 
      method: 'post',
      data: {
        description,
        name,
        price,
        img: urls[0],
        type: keyword,
        spotid,
      },
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {

        if (res.data.success == true) {
          //跳转到首页
          wx.showToast({
            title: '添加场地成功',
            icon: "success",
            complete: function () {
              setTimeout(function () {
                aaa()
              }, 3000)
            }
          })
          let aaa = function () {
            wx.navigateBack({
              delta: -1
            })
          }

        } else {
          wx.showToast({
            title: "提交失败",
            icon: "loading"
          })
        }
      }
    })
  },


  searchByTag: function (e) {
    let keyword = e.currentTarget.dataset.keyword
    let hotTag = _this.data.hotTag
    for (let h of hotTag) {
      if (h.name == keyword) {
        h.isSelect = !h.isSelect
      }else{
        h.isSelect = false
      }
    }
    _this.setData({
      hotTag, keyword
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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