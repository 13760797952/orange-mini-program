// pages/loading/loading.js
var app = getApp(); //获取应用实例

Page({

    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function onLoad(options) {
        var _this = this;

        // console.log('page-loading');

        wx.showLoading({
            mask: true,
            title: '加载中'
        });

        if (app.globalData.userInfo) {
            // 推送用户
            this.pushUser();
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: function success(res) {
                    app.globalData.userInfo = res.userInfo;

                    // 推送用户
                    _this.pushUser();
                }
            });
        }
    },

    pushUser: function pushUser() {
        var that = this;

        wx.login({
            success: function success(res) {
                if (res.code) {
                    wx.request({
                        url: app.siteInfo.siteroot + '?i=' + app.siteInfo.uniacid + '&c=entry&a=wxapp&do=smk_create_user&m=slwl_fitment',
                        method: 'POST',
                        header: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        data: {
                            code: res.code,
                            nicename: app.globalData.userInfo.nickName,
                            avatar: app.globalData.userInfo.avatarUrl,
                            province: app.globalData.userInfo.province,
                            city: app.globalData.userInfo.city,
                            gender: app.globalData.userInfo.gender
                        },
                        success: function success(e) {
                            app.globalData.userInfo = e.data.data;
                            app.globalData.userInfo.uid = e.data.data.id;
                            wx.redirectTo({
                                url: '/pages/default/default'
                            });
                        },
                        error: function error(e) {
                            wx.showToast({
                                title: '请求失败！',
                                image: '/public/images/icon_err.png',
                                duration: 2000
                            });
                        }
                    });
                } else {
                    wx.showToast({
                        title: '获取用户登录态失败！',
                        image: '/public/images/icon_err.png',
                        duration: 2000
                    });
                }
            }
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function onReady() {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function onShow() {},

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function onHide() {},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function onUnload() {},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function onPullDownRefresh() {},

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function onReachBottom() {},

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function onShareAppMessage() {}
});