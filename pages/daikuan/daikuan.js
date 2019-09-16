//获取应用实例
const app = getApp();

Page({
  onShareAppMessage: function () {
    return {
      title: '先装修，后付款！',
      desc: '最高可以免息贷款20万！',
      path: '/page/daikuan/daikuan'
    }
  }
})