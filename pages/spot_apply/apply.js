var app = getApp()
var mydata = require('../../utils/data')
var util = require('../../utils/util')
var Api = require('../../utils/api.js');
let level = 1
let goodid
let spotid 
Page({
  data: {
    evaContent: "",
    date: '2016-10-14',
    time: '12:00',
    bookToastHidden: true,
    hotTag: [],
    urls: [],
    isAddress : true,
    level : 1
  },
  guanbi(e){
    let image = this.data.urls
    let id = e.currentTarget.dataset.id
    console.log(image)
    let urls = image.filter(e => e !=image[id])
    
    this.setData({
      urls
    })
  },
  onLoad: function (options) {
    // this.setData({
    //   artype:options.artype
    // })
    goodid = options.id
    spotid = options.spotid
    this.setData({
      original_name : "请输入景区地址"
    })
    let type   
    if (options.type == "场地管理"){
      type = "场地"
      wx.setNavigationBarTitle({
        title: "场地 发布",
      })
    } else if (options.type == "申请入驻"){
      type="景区"
      wx.setNavigationBarTitle({
        title: "申请 入驻",
      })
      
    }
    level =1
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
        let hotTag = res.datas
        for (let h of hotTag){
          h.isSelect = false
        }
        console.log(hotTag)
        that.setData({
          hotTag
        });
      }
    })
  },
  onShow(){
    // this.onAddress()
  },
  onAddress(){
    let _this = this
    wx.request({
      url: Api.selectAddress(),
      method: "POST",
      header: {
        'Accept': 'application/json'
      },
      data: {
        prov_name: _this.data.prov_name,
        city_name: _this.data.city_name,
        county_name: _this.data.county_name,
        town_name: _this.data.town_name,
        village_name: _this.data.village_name,
        level
      },
      success: function (e) {
        
        let data = e.data.data
        level = 1
        _this.setData({
          original_name: data[0].original_name,
          isAddress : true,
          level,
          prov_name: null,
          city_name: null,
          county_name: null,
          town_name: null,
          village_name: null,
        })
        
      }
    })
  },
  fanhui(){
    console.log("{{{{{{{{{{{{{{{{")
    let _this = this
    // let level = _this.data.level
    let prov_name = _this.data.prov_name
    let city_name= _this.data.city_name
    let county_name= _this.data.county_name
    let town_name= _this.data.town_name
    let village_name= _this.data.village_name
    // console.log(level)
    if(level==5){
      console.log("111111")
      console.log(village_name)
      if (village_name){
        village_name = null
        this.setData({
          village_name
        })
        _this.selectAllAddress()
        return
      }else{
        console.log("2222222222")
        console.log(level)
        console.log(town_name)
        town_name = null
        level = 4
        this.setData({
          town_name,
          level
        })
        _this.selectAllAddress()
        // console.log(level)
        return
      }
     
    }
    if (level == 4) {
      
      county_name = null
      level = 3
      this.setData({
        county_name,
        level
      })
      _this.selectAllAddress()
      return
    }
    if (level == 3) {
      city_name = null
      level = 2
      this.setData({
        city_name,
        level
      })
      _this.selectAllAddress()
      return
    }
    if (level == 2) {
      prov_name = null
      level = 1
      this.setData({
        prov_name,
        level
      })
      _this.selectAllAddress()
      return
    }
    if (level == 1){
      this.setData({
        isAddress: true
      })
      
    }
  },
  showModule(){
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
    // setTimeout(function () {
    //   animation.translateY(0).step()
    //   this.setData({
    //     animationData: animation.export()
    //   })
    // }.bind(this), 200)
  },
  // bindToastTap: function () {
  //   console.log('预定成功')
  //   this.setData({
  //     bookToastHidden: false
  //   })
  // },
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
 //获取goodId和spotId
  
  authority(name, content, address, urls, userid){
    
    // wx.request({
    //   url: Api.getUserSpot({ userid}),
    //   method : "post",
    //   data : {
    //     userid
    //   },
    //   success : function(res){
    //     console.log(res)
    //     let data = res.data.data[0]
    //     // let goodid = data.goodId
        
      
        wx.request({
          url: Api.postSite(),
          method : "post",
          data :{
            goodid : goodid,
            spotid :spotid,
            userId:userid,
            description:content,
            name,
            discount:address,
            price : address,
            goodimg: urls,
            
          },
          success : function(e){
            if(e.data.success==1){
              wx.showToast({
                title: '发布场地成功',
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
             
            }
          }

        })
        
    //   }
    // })
  },
   //提交事件
  evaSubmit: function (e) {
    // wx.showToast({
    //   title: e.detail.formId,
    //   icon: 'succes',
    //   duration: 1000,
    //   mask: true
    // })
    
    var that = this;
    let name = e.detail.value.name
    let address = e.detail.value.address
    let content = e.detail.value.evaContent
    let mobile_people=e.detail.value.mobile_people;
    let mobile_phone=e.detail.value.mobile_phone;
    let urls = this.data.urls
    let userid = wx.getStorageSync("userid")
    let hotTag = this.data.hotTag
    let lables = hotTag.filter(e=>e.isSelect == true)
    let original_name = this.data.original_name
    let addressInfo = e.detail.value.addressInfo
    if (name==null||name==""){
      wx.showModal({
        title : '警告',
        content : '名称不可以为空'
      })
      return
    }
    if (this.data.type=="景区"){
      if (original_name == "请输入景区地址") {
        wx.showModal({
          title: '警告',
          content: '景区地址不可以为空'
        })

        return
      }
    }else{
      if (address == null || address == "") {

        wx.showModal({
          title: '警告',
          content: '价格不可以为空'
        })

        return
      }
    }
   
    
    if (content == null || content == "") {
      wx.showModal({
        title: '警告',
        content: '内容不可以为空'
      })
      return
    }
    let labelArray = []
    for(let l of lables){
      labelArray.push(l.name)
    }
    let label = labelArray.join(",")
    var that = this;
    if (this.data.type == "场地") {
      this.authority(name, content, address, urls, userid);
      return
    }
    if (addressInfo == null || addressInfo == ""){
      wx.showModal({
        title: '警告',
        content: '内容不可以为空'
      })
      return
    }
    wx.request({
      url: Api.postApply(), /*: Api.postSite()*/
      method: 'post',
      data: {
        content,
        name,
        address :original_name,
        image: urls,
        label,
        userid,
        addressInfo,
        formid: e.detail.formId,
        admin:mobile_people,
        mobile:mobile_phone
      },
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        
        if (res.data.success==true) {
          //跳转到首页
          wx.showToast({
            title: '申请成功',
            icon: "success",
            complete : function(){
              setTimeout(function(){
                aaa()
              },3000)
            }
          })
          let aaa = function(){
            wx.navigateBack({
              delta: -1
            })
          }

        } else {
          wx.showToast({
            title : "提交失败",
            icon : "loading"
          })
        }
      }
    })
  },
  onPrice(e){
    console.log(e)
    let value = e.detail.value
    let values = /[^\d]/g
    console.log(values.test(value))
    if (values.test(value)){
      wx.showModal({
        title: '警告',
        content: '价格必须是数字',
      })
      return
    }
  },
  searchByTag: function (e) {
    let _this = this
    console.log(e.currentTarget.dataset.keyword)
    let keyword = e.currentTarget.dataset.keyword
    let hotTag = _this.data.hotTag
    for (let h of hotTag){
      if (h.name == keyword){
        h.isSelect = !h.isSelect
      }
    }
    this.setData({
      hotTag
    })
  },
  //选择地址
  selectAddress(){
    this.showModule()
    this.selectAllAddress()
    this.setData({
      isAddress : false
    })
  },
  isNotcity(e){
    let village_name = e.currentTarget.dataset.village
    this.setData({
      village_name
    })
  },
  istown(e){
    let town_name = e.currentTarget.dataset.town
    level = 5
    this.setData({
      level,
      town_name
    })
    this.selectAllAddress()
  },
  iscounty(e){
    let county_name = e.currentTarget.dataset.county
    level = 4
    this.setData({
      level,
      county_name
    })
    this.selectAllAddress()
  },
  iscity(e) {
    // console.log(e)
    let city_name = e.currentTarget.dataset.city
    level = 3
      this.setData({
        level,
        city_name
      })
    this.selectAllAddress()
  },
  isprov(e){
    let _this = this
    let prov_name = e.currentTarget.dataset.prov
    level = 2
    _this.setData({
      prov_name,
      level
    })
    _this.selectAllAddress()
  },
  isvillage(e){
    let _this = this
    let village_name = e.currentTarget.dataset.village
    console.log(village_name)
    _this.setData({
      village_name,
      level : 5
    })
    _this.onAddress()
  },
  selectAllAddress(){
    
    let _this = this
    wx.request({
      url: Api.selectAddress(),
      method: "POST",
      header: {
        'Accept': 'application/json'
      },
      data: {
        prov_name: _this.data.prov_name,
        city_name: _this.data.city_name,
        county_name: _this.data.county_name,
        town_name: _this.data.town_name,
        level
      },
      success : function(e){
        console.log(e.data.data)
        let data = e.data.data
        
        
          
          _this.setData({
            prov_nameArray: data,
            level: level
          })
        
        
       
      }
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