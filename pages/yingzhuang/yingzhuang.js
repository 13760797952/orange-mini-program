//获取应用实例
const app = getApp();

Page({
  onShareAppMessage: function () {
    return {
      title: '装修要花多少钱？马上在线算一算！',
      desc: '橙家家居，让装修从未如此简单！',
      path: '/page/yingzhuang/yingzhuang'
    }
  }
})