//获取应用实例
const app = getApp();

Page({
  onShareAppMessage: function () {
    return {
      title: '橙家装修最新活动信息！！',
      desc: '点击马上领取装修大礼包！',
      path: '/page/huodong/huodong'
    }
  }
})