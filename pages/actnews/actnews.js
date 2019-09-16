var app = getApp(), WxParse = require("../../public/wxParse/wxParse.js"), article = null;

Page({
    data: {
        syscfg: {},
        user: {},
        actid: null,
        actdata: null,
        setcont: "0",
        barTitle: ""
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
        if (this.setData({
            actid: a.id
        }), null == app.globalData.userInfo || "undefined" == app.globalData.userInfo) {
            var t = app.sitefun.getCurrentPageUrlWithArgs();
            wx.redirectTo({
                url: "/pages/auth/auth?rb=" + encodeURIComponent(t)
            });
        } else wx.showNavigationBarLoading(), app.info.isLoadInterval = setInterval(this.checkInfo, 500);
    },
    checkInfo: function() {
        null != app.sys && (clearInterval(app.info.isLoadInterval), wx.hideNavigationBarLoading(), 
        this.setConfig(), this.setActContent(), this.checkPop());
    },
    setConfig: function() {
        this.setData({
            syscfg: app.sys,
            user: app.globalData.userInfo
        }), app.sitefun.appConfig(app);
    },
    setActContent: function() {
        var t = this, a = t.data.actid;
        wx.request({
            url: app.siteInfo.siteroot + "?i=" + app.siteInfo.uniacid + "&c=entry&a=wxapp&do=smk_actnews_one&m=" + app.moduleName,
            data: {
                aid: a
            },
            success: function(a) {
                t.setData({
                    actdata: a.data.data.one,
                    barTitle: a.data.data.one.newsname
                }), wx.setNavigationBarTitle({
                    title: a.data.data.one.newsname
                }), article = a.data.data.one.detail, WxParse.wxParse("article", "html", article, t);
            },
            error: function(a) {
                wx.showToast({
                    title: a,
                    image: "/public/images/icon_error.png"
                });
            }
        });
    },
    checkPop: function() {
        var t = this;
        wx.request({
            url: app.siteInfo.siteroot + "?i=" + app.siteInfo.uniacid + "&c=entry&a=wxapp&do=smk_get_adpop&m=" + app.moduleName,
            data: {
                uid: app.globalData.userInfo.uid
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                t.setData({
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
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {
        return {
            title: app.sys.appname,
            success: function(a) {},
            fail: function(a) {}
        };
    }
});