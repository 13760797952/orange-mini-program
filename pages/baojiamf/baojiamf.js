//index.js
var util = require('../../utils/util.js')
//获取应用实例
const app = getApp()

Page({
  data: {
    picUrl: '//static.o-home.com/v3/views/wap/page/baojiamf8/img',
    waylist: [
      {
        img: "001_187c5ac.jpg",
        text: "新房装修"
      }, {
        img: "002_90b44e3.jpg",
        text: "旧房翻新"
      }
    ],
    typelist: [
      {
        img: "01_d48b66d.jpg",
        text: "一室",
        stext: "(60m²以下)",
        value: 60
      }, {
        img: "02_911927f.jpg",
        text: "二室",
        stext: "(60-80m²)",
        value: 80
      }, {
        img: "03_047a3f4.jpg",
        text: "三室",
        stext: "(80-100m²)",
        value: 100
      }, {
        img: "04_40b33a7.jpg",
        text: "四室",
        stext: "(100m²以上)",
        value: 120
      }
    ],
    stylelist: [
      {
        img: "05_d7ce921.jpg",
        text: "北欧风格"
      }, {
        img: "06_4faa771.jpg",
        text: "现代简约"
      }, {
        img: "07_c227b60.jpg",
        text: "中式风格"
      }, {
        img: "08_404e0ea.jpg",
        text: "美式风格"
      },
    ],
    currentData: 0,
    need: 0,
    housetype: 0,
    style: 0,
    user_action_set_id:'',//数据源id
    click_id:'',
    action_type:'RESERVATION'
  },
  onLoad: function (options) {
    // url参数中可以获取到gdt_vid、weixinadinfo参数值 
    let _this = this
    _this.click_id = options.gdt_vid //获取gdt_vid（click_id）
    let weixinadinfo = options.weixinadinfo
    // 获取广告id
    let aid = 0
    if (weixinadinfo) {
      let weixinadinfoArr = weixinadinfo.split('.')
      aid = weixinadinfoArr[0]
    }
    //获取access_token
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx43d9b59ddd3a094e&secret=48507453414535efc1ac573de425f9d2',
      success(res){
        console.log(res.data.access_token,'<--access_token')
        _this.getUserAction(res.data.access_token)
      }
    })
  },
  getUserAction(access_token){
    let _this = this
    // 获取数据源
    wx.request({
      url: 'https://api.weixin.qq.com/marketing/user_action_sets/add?version=v1.0&access_token='+access_token,
      method:'POST',
      data:{
        "type":"WEB",
        "name":"xcxbj",//推广提供
        "description":"算算你家装修要花多少钱"//推广提供
      },
      success(res){
        console.log(res.data,'--click_id')
        _this.user_action_set_id = res.data.user_action_set_id
        _this.uploadData(access_token)
      }
    })
  },
  uploadData: function (access_token){
    //数据回传
    let _this = this
    wx.request({
      url: 'https://api.weixin.qq.com/marketing/user_actions/add?version=v1.0&access_token=' + access_token,
      method: 'POST',
      data:{
        "user_action_set_id": _this.user_action_set_id,
        "url":"http://www.qq.com",
        "action_time": util.formatTime(new Date()),
        "action_type": _this.action_type,
        "trace":{
          "click_id": _this.click_id
        }
      },
      success(res){
        console.log(res,'数据回传')
      }
    })
  },
  nextPage: function (e) {
    const that = this;
    var n = parseInt(e.target.dataset.current);
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {
      n++;
      that.setData({
        currentData: n
      })
    }
  },
  bindchange: function (e) {
    const that = this;
    that.setData({
      currentData: e.detail.current
    })
  },
  pushFormSubmit: function (e) {
    var type = e.detail.target.dataset.btntype;
    if (type == "radio") {
      var name = e.detail.target.dataset.name;
      var index = e.detail.target.dataset.index;
      if (name == "need") {
        this.setData({
          need: index
        })
      } else if (name == "housetype") {
        this.setData({
          housetype: index
        })
      } else if (name == "style") {
        this.setData({
          style: index
        })
      }
    }
    if (type != "appoint") {
      return false;
    }
    var values = e.detail.value;
    console.log(values)
    var that = this;
    var wayIndex = this.data.need;
    var housetypeIndex = this.data.housetype;
    var styleIndex = this.data.style;
    var phone = values.phone;
    if (phone == "") {
      wx.showModal({
        title: '提示',
        content: '请输入您的手机号码！',
        showCancel: false
      })
      return;
    }
    if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(phone)) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的手机号码！',
        showCancel: false
      })
      return;
    }
    var data = {
      //用户名必填
      Nickname: "",
      //电话号码
      Phone_Number: phone,
      //地区
      Location: '',
      //标记
      Data_Type: 'XCXBJ2',
      //来源
      comefrom: 'WX',
      //为1的话可以不用用户名
      mark: 1,
      //1为抢单,0为派单
      is_rob: 0,
      //面积
      mianji: that.data.typelist[housetypeIndex].value,
      //是否发短信1为发送
      send: 0,
      //备注
      remark: "小程序报价页2：" + that.data.waylist[wayIndex].text + "；" + that.data.typelist[housetypeIndex].text + "；" + that.data.stylelist[styleIndex].text,
      //员工编号
      // salesCode: salesCode,
      // storeCode: storeCode,
      //智能客服类型
      KefuType: 1
    };
    var swoopNum = that.GetStorageSync("swoopNum");
    if (swoopNum > 4) {
      wx.showModal({
        title: '提示',
        content: "今天的名额已经用完啦！",
        showCancel: false
      });
      return false;
    }
    wx.request({
      url: 'https://www.o-home.com/wap/swoop/saveSwoop',//相应的域名链接
      data: data,
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log(res)
        if (res.data.error || !res.data.code) {
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel: false
          })
        } else {
          if (!swoopNum) {
            that.SetStorageSync("swoopNum", 1);
          } else {
            that.SetStorageSync("swoopNum", parseInt(swoopNum) + 1);
          }
          wx.navigateTo({
            url: '/pages/appointed/appointed?area=' + that.data.typelist[housetypeIndex].value,
          })
        }
      }
    })
  },
  SetStorageSync: function (key, value) {
    wx.setStorageSync(key, value)
    var timestamp = new Date().getTime()
    // 设置24小时后过期
    var remove_time = 3600000 * 24 + timestamp
    wx.setStorageSync(key + 'remove', remove_time)
  },
  GetStorageSync: function (key, value) {
    var remove_time = wx.getStorageSync(key + 'remove')
    var timestamp = new Date().getTime()
    var res = ''
    if (timestamp > remove_time) {
      // 过期
      wx.removeStorageSync(key)
    } else {
      res = wx.getStorageSync(key)
    }
    return res
  },
  onShareAppMessage: function () {
    return {
      title: '',
      path: '',
      success: function (res) {
        // 转发成功
        console.log('转发成功')
      },
      fail: function (res) {
        // 转发失败
        console.log('转发失败')
      }
    }
  },
})
