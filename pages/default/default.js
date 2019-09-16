var app = getApp();

Page({
    data: {
        syscfg: {},
        user: {},
        mybanner: {},
        myadsp: {},
        mylist: {},
        myListChild: {},
        mynav: {},
        adgroup: {},
        adgroupStyle: "",
        myDefaultPcl: {},
        myDefaultPclChild: {},
        titledf1: "",
        titledf2: "",
        titledf3: "",
        titlemore: "",
        titleactnews2: "",
        tabPclId: 0,
        tabId: 0,
        scrollLeft: 0,
        scrollDf2Left: 0,
        mySeekDesinger: {}
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
        console.log("default-onLoad"), wx.showLoading({
            mask: !0,
            title: "加载中..."
        }), wx.showNavigationBarLoading(), app.info.isLoadInterval = setInterval(this.checkInfo, 500);
    },
    checkInfo: function() {
        null != app.sys && (clearInterval(app.info.isLoadInterval), wx.hideLoading(), wx.hideNavigationBarLoading(), 
        this.setConfig(), this.setPageData());
    },
    setConfig: function() {
        this.setData({
            syscfg: app.sys
        }), app.sitefun.appConfig(app);
    },
    setPageData: function() {
        var t = this;
        wx.request({
            url: app.siteInfo.siteroot + "?i=" + app.siteInfo.uniacid + "&c=entry&a=wxapp&do=smk_indexdata&m=" + app.moduleName,
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                t.setData({
                    mybanner: a.data.data.adv,
                    mynav: a.data.data.nav,
                    adgroup: a.data.data.adgroup,
                    myadsp: a.data.data.adsp,
                    mySeekDesinger: a.data.data.seekdesinger,
                    myDefaultPcl: a.data.data.pcl,
                    mylist: a.data.data.actlist,
                    mynewslist1: a.data.data.newslist1,
                    mynewslist2: a.data.data.newslist2
                }), "" != a.data.data.adgroup && 1 == a.data.data.adgroup.length && t.setData({
                    adgroupStyle: ""
                }), "" != a.data.data.adgroup && 2 == a.data.data.adgroup.length && t.setData({
                    adgroupStyle: "pic-2"
                }), "" != a.data.data.adgroup && 3 == a.data.data.adgroup.length && t.setData({
                    adgroupStyle: "pic-3"
                }), 0 < t.data.myDefaultPcl.length && t.setData({
                    myDefaultPclChild: t.data.myDefaultPcl[0].ones
                }), 0 < t.data.mylist.length && t.setData({
                    myListChild: t.splitArray(t.data.mylist[0].ones, 8)
                });
            },
            error: function(a) {
                wx.showModal({
                    content: a,
                    showCancel: !1
                });
            }
        });
    },
    clickSeekDesignerMore: function() {
        wx.navigateTo({
            url: "/pages/stylist/stylist"
        });
    },
    pclClick: function(a) {
        var t = this, e = a.currentTarget.dataset.id, i = a.currentTarget.dataset.typeId;
        t.setData({
            tabPclId: a.currentTarget.dataset.index,
            scrollLeft: 0
        }), wx.request({
            url: app.siteInfo.siteroot + "?i=" + app.siteInfo.uniacid + "&c=entry&a=wxapp&do=smk_default_pcl_child&m=" + app.moduleName,
            data: {
                tid: e,
                typeid: i
            },
            success: function(a) {
                "" != a.data && 0 < a.data.data.length ? t.setData({
                    myDefaultPclChild: a.data.data
                }) : t.setData({
                    myDefaultPclChild: {}
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
    clickPclListMore: function() {
        wx.navigateTo({
            url: "/pages/pic/pic"
        });
    },
    splitArray: function(a, t) {
        for (var e = [], i = parseInt(a.length / t), s = 0, n = 1; n <= i; n++) {
            var d = (n - 1) * t;
            e[s++] = a.slice(d, d + t);
        }
        return 0 < a.length - i * t && (e[s++] = a.slice(i * t)), e;
    },
    navClick: function(a) {
        var t = this, e = a.currentTarget.dataset.id;
        t.setData({
            tabId: a.currentTarget.dataset.index,
            scrollDf2Left: 0
        }), wx.request({
            url: app.siteInfo.siteroot + "?i=" + app.siteInfo.uniacid + "&c=entry&a=wxapp&do=smk_term_child&m=" + app.moduleName,
            data: {
                tid: e
            },
            success: function(a) {
                "" != a.data && 0 < a.data.data.length ? t.setData({
                    myListChild: t.splitArray(a.data.data, 8)
                }) : t.setData({
                    myListChild: {}
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
    clickListMore: function() {
        if (0 < this.data.myListChild.length) {
            var a = this.data.myListChild[0][0].id;
            wx.navigateTo({
                url: "/pages/list/list?id=" + a
            });
        }
    },
    moreClick: function(a) {
        var t = a.currentTarget.dataset.itemid;
        wx.navigateTo({
            url: "../actlist/actlist?tid=" + t
        });
    },
    moreClick2: function(a) {
        var t = a.currentTarget.dataset.itemid;
        wx.navigateTo({
            url: "../actlist2/actlist2?tid=" + t
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        wx.showNavigationBarLoading(), this.onLoad(), this.setData({
            tabId: 0
        }), wx.stopPullDownRefresh();
    },
    onReachBottom: function() {},
    onShareAppMessage: function() {
        return {
            title: app.sys.appname,
            path: "/pages/default/default",
            success: function(a) {},
            fail: function(a) {}
        };
    }
});