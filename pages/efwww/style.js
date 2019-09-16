var app = getApp(), WxParse = require("../../public/wxParse/wxParse.js"), article = null;

Page({
    data: {
        syscfg: {},
        user: {},
        pageConfig: {},
        inputStatus: 0
    },
    bindLinkClick: function(t) {
        app.sitefun.clickObjectLink(t, app);
    },
    onLoad: function(t) {
        wx.showLoading({
            mask: !0,
            title: "加载中..."
        }), wx.showNavigationBarLoading(), app.isLoadInterval = setInterval(this.checkInfo, 500);
    },
    checkInfo: function() {
        null != app.sys && null != app.globalData.userInfo && (clearInterval(app.isLoadInterval), 
        wx.hideLoading(), wx.hideNavigationBarLoading(), this.setConfig(), this.setPageConfig());
    },
    setConfig: function() {
        this.setData({
            syscfg: app.sys,
            user: app.globalData.userInfo
        }), app.sitefun.appConfig(app);
    },
    imgLoadOver: function() {
        var t = this;
        wx.hideLoading(), wx.hideNavigationBarLoading(), setTimeout(function() {
            t.setData({
                inputStatus: "1"
            });
        }, 500);
    },
    setPageConfig: function() {
        var a = this;
        wx.request({
            url: app.siteInfo.siteroot + "?i=" + app.siteInfo.uniacid + "&c=entry&a=wxapp&do=smk_style_config&m=slwl_fitment",
            header: {
                "content-type": "application/json"
            },
            success: function(t) {
                a.setData({
                    pageConfig: t.data.data.set
                }), article = t.data.data.set.detail, WxParse.wxParse("article", "html", article, a);
            },
            error: function(t) {
                wx.showToast({
                    title: t,
                    image: "/public/images/icon_error.png"
                });
            }
        });
    },
    formSubmit: function(t) {
        var a = this, i = t.detail.value.user, n = t.detail.value.tel, e = t.detail.formId;
        return null == i || null == i || "" == i ? (wx.showToast({
            title: "姓名不能为空",
            icon: "fail",
            duration: 2e3
        }), !1) : null == n || null == n || "" == n ? (wx.showToast({
            title: "电话不能为空",
            icon: "fail",
            duration: 2e3
        }), !1) : void wx.request({
            url: app.siteInfo.siteroot + "?i=" + app.siteInfo.uniacid + "&c=entry&a=wxapp&do=smk_style_post&m=" + app.moduleName,
            data: {
                uid: app.globalData.userInfo.uid,
                user: i,
                tel: n,
                formid: e
            },
            success: function(t) {
                0 == parseInt(t.data.errno) ? (wx.showToast({
                    title: "提交成功",
                    icon: "success",
                    duration: 2e3
                }), a.setData({
                    senduser: "",
                    sendtel: ""
                })) : wx.showToast({
                    title: "提交失败",
                    icon: "fail",
                    duration: 2e3
                });
            },
            error: function(t) {
                wx.showToast({
                    title: t,
                    image: "/public/images/icon_error.png"
                });
            }
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
            success: function(t) {},
            fail: function(t) {}
        };
    }
});