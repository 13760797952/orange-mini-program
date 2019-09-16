//获取应用实例
const app = getApp();

Page({
  onShareAppMessage: function () {
    return {
      title: '简单4步，轻松测出你家装修风格！',
      desc: '橙家装修风格在线测试！',
      path: '/page/styletest/styletest'
    }
  }
})