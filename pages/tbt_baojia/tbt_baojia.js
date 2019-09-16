//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    picUrl: '//static.o-home.com/v2/image/wap/page/baojiaex/tbt_baojia',
    pricePics: ["price1.png", "price2.png", "price3.png", "price4.png", "price5.png", "price6.png", "price7.png", "price8.png", "price9.png"],
    showIndex: 0,
    // way: "新房装修",
    // area: '',
    // phone: ''
  },
  onLoad: function (options) {
    // 计算器图片切换
    var showIndex = -1;
    var that = this;
    setInterval(() => {
      showIndex++;
      if(showIndex>=9){
        showIndex=0;
      }
      that.setData({
        showIndex: showIndex
      });
    },350)
  },
  // getWay: function(e){
  //   this.setData({
  //     way: e.detail.value
  //   })
  // },
  // getArea: function(e){
  //   this.setData({
  //     area: e.detail.value
  //   })
  // },
  // getPhone: function(e){
  //   this.setData({
  //     phone: e.detail.value
  //   })
  // },
  pushFormSubmit: function (e) {
    if (e.detail.target.id =="xstBtn"){
      return false;
    }
    var values = e.detail.value;
    var that = this;
    var way = values.way;
    var area = values.area;
    var phone = values.phone;
    if (!/^[1-9]\d*(\.\d+)?$/.exec(area)) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的面积！',
        showCancel: false
      })
      return false;
    }
    if(parseInt(area)<=50||parseInt(area)>=200){
      wx.showModal({
        title: '提示',
        content: '暂不支持该面积报价！',
        showCancel: false
      })
      return false;
    }
    if (phone=="") {
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
      Data_Type: 'XCXBJ',
      //来源
      comefrom: 'WX',
      //为1的话可以不用用户名
      mark: 1,
      //1为抢单,0为派单
      is_rob: 0,
      //面积
      mianji: area,
      //是否发短信1为发送
      send: 0,
      //备注
      remark: "小程序/报价："+way,
      //员工编号
      // salesCode: salesCode,
      // storeCode: storeCode,
      //智能客服类型
      KefuType: 1
    };
    var swoopNum = that.GetStorageSync("swoopNum");
    if(swoopNum>4){
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
            url: '/pages/appointed/appointed?area='+area,
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
