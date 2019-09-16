var app = getApp();

Page({
    data: {
        syscfg: {},
        user: {},
        sysauth: {},
        ver: "",
        myadpop: {}
    },
    bindLinkClick: function(a) {
        app.sitefun.clickObjectLink(a, app);
    },
    bindCopyrightClick: function(a) {
        app.sitefun.clickCopyright(a, app);
    },
    suspendCloseClick: function() {
        "0" == app.sys.suspend.suspend_show ? this.setData({
            "syscfg.suspend.suspend_show": "1"
        }) : this.setData({
            "syscfg.suspend.suspend_show": "0"
        });
    },
    onLoad: function(a) {
        if (null == app.globalData.userInfo || "undefined" == app.globalData.userInfo) {
            var n = app.sitefun.getCurrentPageUrlWithArgs();
            wx.redirectTo({
                url: "/pages/auth/auth?rb=" + encodeURIComponent(n)
            });
        } else wx.showNavigationBarLoading(), app.info.isLoadInterval = setInterval(this.checkInfo, 500);
    },
    checkInfo: function() {
        null != app.sys && (clearInterval(app.info.isLoadInterval), wx.hideNavigationBarLoading(), 
        this.setConfig(), this.checkPop());
    },
    setConfig: function() {
        this.setData({
            syscfg: app.sys,
            user: app.globalData.userInfo
        }), app.sitefun.appConfig(app);
    },
    checkPop: function() {
        var n = this;
        wx.request({
            url: app.siteInfo.siteroot + "?i=" + app.siteInfo.uniacid + "&c=entry&a=wxapp&do=smk_get_adpop&m=" + app.moduleName,
            data: {
                uid: app.globalData.userInfo.uid
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                n.setData({
                    myadpop: a.data.data
                });
            },
            error: function(a) {
                wx.showToast({
                    title: a,
                    image: "/public/images/icon_error.png"
                });
            }
        });
    },
    adpopClose: function() {
        0 == this.data.myadpop.adpop_show ? this.setData({
            "myadpop.adpop_show": "1"
        }) : this.setData({
            "myadpop.adpop_show": "0"
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
    },
    onReachBottom: function() {},
    onShareAppMessage: function() {
        return {
            title: app.sys.appname,
            success: function(a) {},
            fail: function(a) {}
        };
    }
});