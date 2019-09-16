var app = getApp();

Page({
    data: {
        syscfg: {},
        user: {},
        backUrl: ""
    },
    bindGetUserInfoClick: function(n) {
        var o = this;
        wx.login({
            success: function(a) {
                console.log(n), a.code ? wx.request({
                    url: app.siteInfo.siteroot + "?i=" + app.siteInfo.uniacid + "&c=entry&a=wxapp&do=smk_create_user&m=" + app.moduleName,
                    method: "POST",
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    data: {
                        code: a.code,
                        nicename: n.detail.userInfo.nickName,
                        avatar: n.detail.userInfo.avatarUrl,
                        province: n.detail.userInfo.province,
                        city: n.detail.userInfo.city,
                        gender: n.detail.userInfo.gender
                    },
                    success: function(a) {
                        null != a.data.data ? (app.globalData.userInfo = a.data.data, wx.setStorage({
                            key: "appUserInfo",
                            data: a.data.data
                        }), null != a.data.data.id && (app.globalData.userInfo.uid = a.data.data.id)) : app.globalData.userInfo = void 0, 
                        wx.redirectTo({
                            url: "/" + o.data.backUrl
                        });
                    },
                    error: function(a) {
                        wx.showModal({
                            content: "请求失败！",
                            showCancel: !1
                        });
                    }
                }) : wx.showModal({
                    content: "获取用户登录态失败！",
                    showCancel: !1
                });
            }
        });
    },
    bindCancelGetUserInfoClick: function() {
        wx.reLaunch({
            url: "/pages/default/default"
        });
    },
    bindLinkClick: function(a) {
        app.sitefun.clickObjectLink(a, app);
    },
    bindCopyrightClick: function(a) {
        app.sitefun.clickCopyright(a, app);
    },
    onLoad: function(a) {
        console.log("auth");
        var n = decodeURIComponent(a.rb);
        this.setData({
            backUrl: n
        }), console.log(n), null != app.globalData.userInfo ? wx.redirectTo({
            url: "/" + that.data.backUrl
        }) : (wx.showNavigationBarLoading(), app.info.isLoadInterval = setInterval(this.checkInfo, 500));
    },
    checkInfo: function() {
        null != app.sys && (clearInterval(app.info.isLoadInterval), wx.hideNavigationBarLoading(), 
        this.setConfig());
    },
    setConfig: function() {
        this.setData({
            syscfg: app.sys
        }), app.sitefun.appConfig(app);
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});