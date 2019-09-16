var app = getApp();

Page({
    data: {
        syscfg: {},
        user: {}
    },
    openlink: function(e) {
        wx.navigateToMiniProgram({
            appId: "wx17bab76ab9d1afbd",
            path: "pages/index/index"
        });
    },
    bindGetUserInfoClick: function(e) {
        app.sitefun.clickPushUser(e, app);
    },
    bindCancelGetUserInfoClick: function() {
        this.setData({
            "syscfg.authShow": 0
        });
    },
    bindLinkClick: function(e) {
        var a = e.currentTarget.dataset.ctype, t = e.currentTarget.dataset.url, n = e.currentTarget.dataset.index, s = e.currentTarget.dataset.appid, o = e.currentTarget.dataset.page;
        "footerNav" == a && (this.setData({
            "syscfg.fnavHover": n
        }), app.sys.fnavHover = n), "default" == t ? wx.reLaunch({
            url: "/pages/default/default"
        }) : "wxapp" == t ? wx.navigateToMiniProgram({
            appId: s,
            path: o
        }) : "pic" == t ? wx.redirectTo({
            url: "/pages/pic/pic"
        }) : "ucenter" == t ? wx.redirectTo({
            url: "/pages/ucenter/ucenter"
        }) : "stylist" == t ? wx.redirectTo({
            url: "/pages/stylist/stylist"
        }) : "tel" == t ? wx.makePhoneCall({
            phoneNumber: app.sys.tel
        }) : "location" == t ? wx.openLocation({
            name: app.sys.name,
            address: app.sys.address,
            latitude: parseFloat(app.sys.lat),
            longitude: parseFloat(app.sys.lng),
            scale: 14
        }) : 0 <= t.indexOf("http") ? wx.navigateTo({
            url: "/pages/web/web?url=" + encodeURIComponent(t)
        }) : wx.navigateTo({
            url: t
        });
    },
    onLoad: function(e) {
        console.log(this), console.log(this.route), app.info.isLoadInterval = setInterval(this.checkInfo, 500);
    },
    checkInfo: function() {
        null != app.sys && "" != app.sys && (clearInterval(app.info.isLoadInterval), this.setConfig());
    },
    setConfig: function() {
        this.setData({
            syscfg: app.sys,
            user: app.globalData.userInfo
        }), app.sitefun.appConfig(app);
    },
    formSubmit: function(e) {
        var a = this, t = e.detail.value.user, n = e.detail.value.tel, s = e.detail.formId;
        return null == t || null == t || "" == t ? (wx.showToast({
            title: "姓名不能为空",
            image: "/public/images/icon_err.png",
            duration: 2e3
        }), !1) : null == n || null == n || "" == n ? (wx.showToast({
            title: "电话不能为空",
            image: "/public/images/icon_err.png",
            duration: 2e3
        }), !1) : void wx.request({
            url: app.siteInfo.siteroot + "?i=" + app.siteInfo.uniacid + "&c=entry&a=wxapp&do=smk_tt&m=" + app.moduleName,
            data: {
                uid: app.globalData.userInfo.uid,
                user: t,
                tel: n,
                formid: s
            },
            success: function(e) {
                0 == parseInt(e.data.errno) ? (wx.showToast({
                    title: "提交成功",
                    icon: "success",
                    duration: 2e3
                }), a.setData({
                    senduser: "",
                    sendtel: "",
                    sendmsg: ""
                })) : wx.showToast({
                    title: "提交失败",
                    image: "/public/images/icon_err.png",
                    duration: 2e3
                });
            },
            error: function(e) {
                wx.showToast({
                    title: e,
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
    onShareAppMessage: function() {}
});