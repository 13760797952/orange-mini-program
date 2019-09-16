// pages/appointed/appointed.js
Page({
  data: {
    picUrl: '//static.o-home.com/v2/image/wap/page/baojiaex/tbt_baojia',
    others: {
      rengong: "",
      cailiao: "",
      sheji: "",
      jianli: "",
      zaxiang: "",
      zongji: ""
    },
    our: {
      rengong: "",
      cailiao: "",
      zongji: ""
    },
    chajia: ""
  },
  onLoad: function (options) {
    var area = options.area;
    area = area<80 ? 80:area;
    var others_combo = 1230;
    var our_combo = 788;
    this.setData({
      others: {
        rengong: 350*area,
        cailiao: 600 * area,
        sheji: 30 * area,
        jianli: 50 * area,
        zaxiang: 200 * area,
        zongji: others_combo * area,
      },
      our: {
        rengong: 258 * area,
        cailiao: 530 * area,
        zongji: our_combo * area,
      },
      chajia: others_combo * area - our_combo * area
    })
  },
  /**
   * 用户点击右上角分享
   */
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
  }
})