var app = getApp()
 
var util = require('../../../utils/util')
var Api = require('../../../utils/api.js');
let level = 1
let goodid
let spotid
Page({
  data: {
    array:[],
    urls:[]
  },
  guanbi(e) {
    let image = this.data.urls
    let id = e.currentTarget.dataset.id
 
    let urls = image.filter(e => e != image[id])

    this.setData({
      urls
    })
  },
  onLoad: function (options) {
 
    goodid = options.id
    spotid = options.spotid
    this.setData({
      original_name: "请输入景区地址"
    })
    let type
    type = "场地"
    wx.setNavigationBarTitle({
      title: "场地 发布",
    })
 
    level = 1
    this.setData({
      type
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
        // let hotTag = res.datas;
        // var arr=[];
        // for (let h of hotTag) {
        //   h.isSelect = false;
        //   arr.push(h.name)
        // }
 
        // that.setData({
        //   array:arr
        // });

        let hotTag = res.datas
        for (let h of hotTag) {
          h.isSelect = false
        }

        that.setData({
          hotTag
        });
      }
    })
  },
  onShow() {
    // this.onAddress()
  },
  showModule() {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
  },
  hideToast: function () {
    this.setData({
      bookToastHidden: true
    })
  },
  // 日期选择
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  // 时间选择
  bindTimeChange: function (e) {
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
  //获取goodId和spotId
  saveGoods(e) {

    var that = this;
    let name = e.detail.value.name
    let content = e.detail.value.evaContent
    let urls = this.data.urls
    let userid = wx.getStorageSync("userid")
    let stock = e.detail.value.stock;//库存
    let price = e.detail.value.price;
    let type = this.data.array[this.data.index];
    let hotTag = this.data.hotTag
    let lables = hotTag.filter(e => e.isSelect == true)

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
    
    let labelArray = []
    for (let l of lables) {
      labelArray.push(l.name)
    }
    let label = labelArray.join(",")

    if (content == null || content == "") {
      wx.showModal({
        title: '警告',
        content: '内容不可以为空'
      })
      return
    }
    if (!type&&type==""){
      wx.showModal({
        title: '警告',
        content: '商品类型未选择不可以为空'
      })
      return
    }
    wx.request({
      url: Api.postSite(),
      method: "post",
      data: {
        goodid: goodid,
        spotid: spotid,
        userId: userid,
        description: content,
        name:name,
        stock:stock,
        price: price,
        goodimg: urls,

      },
      success: function (e) {
        if (e.data.success == 1) {
          wx.showToast({
            title: '发布场地成功',
            icon: "success",
            complete: function () {
              setTimeout(function () {
                wx.navigateBack({
                  delta: -1
                })
              }, 1000)
            }
          })
          
        }
      }

    })
 
  },
  onPrice(e) {
   
    let value = e.detail.value
    var req =/^[0-9]+(.[0-9]{2})?$/ ;
    // let values = /[^\d]/g
 
    if (!req.test(value)) {
      wx.showModal({
        title: '警告',
        content: '价格必须是数字',
      })
      return
    }
  },
  searchByTag: function (e) {
    let _this = this
 
    let keyword = e.currentTarget.dataset.keyword
    let hotTag = _this.data.hotTag
    for (let h of hotTag) {
      if (h.name == keyword) {
        h.isSelect = !h.isSelect
      }
    }
    this.setData({
      hotTag
    })
  },
  
  //添加Banner  
  bindChooiceProduct: function () {
    var that = this;
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
  }, bindPickerChang: function (e) {
    console.log("picker发生概念，携带的值是：", e.detail.value)
    this.setData({
      index: e.detail.value
    })
  }
})