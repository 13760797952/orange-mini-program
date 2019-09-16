var app = getApp();

Page({
    data: {
        syscfg: {},
        user: {},
        picType: 0,
        tabAttr: {
            curHdIndex: -1,
            curBdIndex: -1
        },
        picTagMulti: {},
        bakPTM: {},
        picTagSingle: {},
        bakPTS: {},
        picListMulti: {
            psLeft: [],
            psRight: []
        },
        picListSingle: {
            psLeft: [],
            psRight: []
        },
        nextPageMulti: 2,
        nextPageSingle: 2,
        isBottomMulti: !1,
        isBottomSingle: !1,
        picOrderMulti: 0,
        picOrderMultiTitle: "综合排序",
        picOrderSingle: 0,
        picOrderSingleTitle: "综合排序",
        optionSelectMulti: [],
        optionSelectSingle: [],
        optionSearchStrMulti: "",
        optionSearchStrSingle: "",
        getParentId: 0,
        getOptsId: 0,
        picListMultiNum: 0,
        picListSingleNum: 0
    },
    bindLinkClick: function(t) {
        app.sitefun.clickObjectLink(t, app);
    },
    bindCopyrightClick: function(t) {
        app.sitefun.clickCopyright(t, app);
    },
    suspendCloseClick: function() {
        "0" == app.sys.suspend.suspend_show ? this.setData({
            "syscfg.suspend.suspend_show": "1"
        }) : this.setData({
            "syscfg.suspend.suspend_show": "0"
        });
    },
    onLoad: function(t) {
        if (console.log("pic"), null != t.typeid && this.setData({
            picType: t.typeid,
            getParentId: t.pid,
            getOptsId: t.optsid
        }), null != t.typeid && "0" == t.typeid && this.setData({
            optionSearchStrMulti: t.optsid
        }), null != t.typeid && "1" == t.typeid && this.setData({
            optionSearchStrSingle: t.optsid
        }), null == app.globalData.userInfo || "undefined" == app.globalData.userInfo) {
            var a = app.sitefun.getCurrentPageUrlWithArgs();
            wx.redirectTo({
                url: "/pages/auth/auth?rb=" + encodeURIComponent(a)
            });
        } else wx.showNavigationBarLoading(), app.info.isLoadInterval = setInterval(this.checkInfo, 500);
    },
    checkInfo: function() {
        null != app.sys && (clearInterval(app.info.isLoadInterval), wx.hideNavigationBarLoading(), 
        this.setConfig(), this.setPicTag(), this.setPicList(), this.checkPop());
    },
    setConfig: function() {
        this.setData({
            syscfg: app.sys,
            user: app.globalData.userInfo
        }), app.sitefun.appConfig(app);
    },
    clickPicType: function() {
        var t = this;
        0 == t.data.picType ? t.setData({
            picType: 1
        }) : t.setData({
            picType: 0
        });
    },
    clickOrderPanel: function(t) {
        var a = this, i = t.currentTarget.dataset.index;
        a.data.tabAttr.curHdIndex == i ? a.setData({
            "tabAttr.curHdIndex": -1,
            "tabAttr.curBdIndex": -1
        }) : a.setData({
            "tabAttr.curHdIndex": i,
            "tabAttr.curBdIndex": i
        });
    },
    setPicTag: function() {
        var i = this, e = "", n = "";
        wx.request({
            url: app.siteInfo.siteroot + "?i=" + app.siteInfo.uniacid + "&c=entry&a=wxapp&do=smk_pic_tag&m=" + app.moduleName,
            header: {
                "content-type": "application/json"
            },
            data: {
                ptype: i.data.picType
            },
            success: function(t) {
                for (var a = 0; a < t.data.data.single.length; a++) 0 == t.data.data.single[a].parentid && (t.data.data.single[a].gl = 0);
                for (a = 0; a < t.data.data.multi.length; a++) 0 == t.data.data.multi[a].parentid && (t.data.data.multi[a].gl = 0);
                if (i.setData({
                    picTagMulti: t.data.data.multi,
                    bakPTM: t.data.data.multi,
                    picTagSingle: t.data.data.single,
                    bakPTS: t.data.data.single
                }), 0 < i.data.getOptsId && 0 == i.data.picType) {
                    for (a = 0; a < t.data.data.multi.length; a++) t.data.data.multi[a].id == i.data.getOptsId && (e = t.data.data.multi[a].name);
                    for (a = 0; a < t.data.data.multi.length; a++) if (t.data.data.multi[a].id == i.data.getParentId) {
                        i.data.picTagMulti[a].name = e, i.data.picTagMulti[a].gl = i.data.getOptsId, i.setData({
                            picTagMulti: i.data.picTagMulti
                        }), i.optionGetListMulti();
                        break;
                    }
                } else if (0 < i.data.getOptsId && 1 == i.data.picType) {
                    for (a = 0; a < t.data.data.single.length; a++) t.data.data.single[a].id == i.data.getOptsId && (n = t.data.data.single[a].name);
                    for (a = 0; a < t.data.data.single.length; a++) if (t.data.data.single[a].id == i.data.getParentId) {
                        i.data.picTagSingle[a].name = n, i.data.picTagSingle[a].gl = i.data.getOptsId, i.setData({
                            picTagSingle: i.data.picTagSingle
                        }), i.optionGetListSingle();
                        break;
                    }
                }
            },
            error: function(t) {
                wx.showToast({
                    title: t,
                    image: "/public/images/icon_error.png"
                });
            }
        });
    },
    setPicList: function() {
        var i = this;
        wx.request({
            url: app.siteInfo.siteroot + "?i=" + app.siteInfo.uniacid + "&c=entry&a=wxapp&do=smk_pic_list&m=" + app.moduleName,
            data: {
                uid: i.data.user.uid
            },
            header: {
                "content-type": "application/json"
            },
            success: function(t) {
                for (var a = 0; a < t.data.data.multi.length; a++) 0 == i.data.picListMultiNum ? (i.data.picListMulti.psLeft.push(t.data.data.multi[a]), 
                i.data.picListMultiNum = 1) : (i.data.picListMulti.psRight.push(t.data.data.multi[a]), 
                i.data.picListMultiNum = 0);
                for (a = 0; a < t.data.data.single.length; a++) 0 == i.data.picListSingleNum ? (i.data.picListSingle.psLeft.push(t.data.data.single[a]), 
                i.data.picListSingleNum = 1) : (i.data.picListSingle.psRight.push(t.data.data.single[a]), 
                i.data.picListSingleNum = 0);
                i.setData({
                    picListMulti: i.data.picListMulti,
                    picListSingle: i.data.picListSingle
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
    clickOptionOrderSingle: function(t) {
        var a = this, i = t.currentTarget.dataset.id, e = t.currentTarget.dataset.str;
        a.setData({
            picOrderSingleTitle: e,
            picOrderSingle: i
        }), a.setData({
            "tabAttr.curHdIndex": -1,
            "tabAttr.curBdIndex": -1
        }), a.optionGetListSingle();
    },
    clickOptionOtherSingle: function(t) {
        var a = this, i = [], e = t.currentTarget.dataset.id, n = t.currentTarget.dataset.str, s = t.currentTarget.dataset.parentIndex;
        0 == e ? (a.data.picTagSingle[s].name = a.data.bakPTS[s].name, a.data.picTagSingle[s].gl = 0) : (a.data.picTagSingle[s].name = n, 
        a.data.picTagSingle[s].gl = e), a.setData({
            picTagSingle: a.data.picTagSingle
        }), a.setData({
            "tabAttr.curHdIndex": -1,
            "tabAttr.curBdIndex": -1
        });
        for (var p = 0; p < a.data.picTagSingle.length; p++) 0 == a.data.picTagSingle[p].parentid && i.push(a.data.picTagSingle[p].gl);
        a.setData({
            optionSearchStrSingle: i.join(",")
        }), a.optionGetListSingle();
    },
    optionGetListSingle: function() {
        var i = this;
        wx.request({
            url: app.siteInfo.siteroot + "?i=" + app.siteInfo.uniacid + "&c=entry&a=wxapp&do=smk_pic_list_single_more&m=" + app.moduleName,
            header: {
                "content-type": "application/json"
            },
            data: {
                page: 1,
                odr: i.data.picOrderSingle,
                ops: i.data.optionSearchStrSingle
            },
            success: function(t) {
                i.setData({
                    isBottomSingle: !1
                }), i.data.picListSingleNum = 0, i.data.picListSingle.psLeft = [], i.data.picListSingle.psRight = [];
                for (var a = 0; a < t.data.data.length; a++) 0 == i.data.picListSingleNum ? (i.data.picListSingle.psLeft.push(t.data.data[a]), 
                i.data.picListSingleNum = 1) : (i.data.picListSingle.psRight.push(t.data.data[a]), 
                i.data.picListSingleNum = 0);
                i.setData({
                    picListSingle: i.data.picListSingle,
                    nextPageSingle: 2
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
    getPicSingleMore: function() {
        var i = this;
        i.data.isBottomSingle || wx.request({
            url: app.siteInfo.siteroot + "?i=" + app.siteInfo.uniacid + "&c=entry&a=wxapp&do=smk_pic_list_single_more&m=" + app.moduleName,
            header: {
                "content-type": "application/json"
            },
            data: {
                page: i.data.nextPageSingle,
                odr: i.data.picOrderSingle,
                ops: i.data.optionSearchStrSingle,
                uid: i.data.user.uid
            },
            success: function(t) {
                for (var a = 0; a < t.data.data.length; a++) 0 == i.data.picListSingleNum ? (i.data.picListSingle.psLeft.push(t.data.data[a]), 
                i.data.picListSingleNum = 1) : (i.data.picListSingle.psRight.push(t.data.data[a]), 
                i.data.picListSingleNum = 0);
                0 == t.data.data.length && i.setData({
                    isBottomSingle: !0
                }), i.setData({
                    picListSingle: i.data.picListSingle,
                    nextPageSingle: i.data.nextPageSingle + 1
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
    clickOptionOrderMulti: function(t) {
        var a = t.currentTarget.dataset.id, i = t.currentTarget.dataset.str;
        this.setData({
            picOrderMultiTitle: i,
            picOrderMulti: a
        }), this.setData({
            "tabAttr.curHdIndex": -1,
            "tabAttr.curBdIndex": -1
        }), this.optionGetListMulti();
    },
    clickOptionOtherMulti: function(t) {
        var a = this, i = [], e = t.currentTarget.dataset.id, n = t.currentTarget.dataset.str, s = t.currentTarget.dataset.parentIndex;
        0 == e ? (a.data.picTagMulti[s].name = a.data.bakPTM[s].name, a.data.picTagMulti[s].gl = 0) : (a.data.picTagMulti[s].name = n, 
        a.data.picTagMulti[s].gl = e), a.setData({
            picTagMulti: a.data.picTagMulti
        }), a.setData({
            "tabAttr.curHdIndex": -1,
            "tabAttr.curBdIndex": -1
        });
        for (var p = 0; p < a.data.picTagMulti.length; p++) 0 == a.data.picTagMulti[p].parentid && i.push(a.data.picTagMulti[p].gl);
        a.setData({
            optionSearchStrMulti: i.join(",")
        }), a.optionGetListMulti();
    },
    optionGetListMulti: function() {
        var i = this;
        wx.request({
            url: app.siteInfo.siteroot + "?i=" + app.siteInfo.uniacid + "&c=entry&a=wxapp&do=smk_pic_list_Multi_more&m=" + app.moduleName,
            header: {
                "content-type": "application/json"
            },
            data: {
                page: 1,
                odr: i.data.picOrderMulti,
                ops: i.data.optionSearchStrMulti
            },
            success: function(t) {
                i.setData({
                    isBottomMulti: !1
                }), i.data.picListMultiNum = 0, i.data.picListMulti.psLeft = [], i.data.picListMulti.psRight = [];
                for (var a = 0; a < t.data.data.length; a++) 0 == i.data.picListMultiNum ? (i.data.picListMulti.psLeft.push(t.data.data[a]), 
                i.data.picListMultiNum = 1) : (i.data.picListMulti.psRight.push(t.data.data[a]), 
                i.data.picListMultiNum = 0);
                i.setData({
                    picListMulti: i.data.picListMulti,
                    nextPageMulti: 2
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
    getPicMultiMore: function() {
        var i = this;
        i.data.isBottomMulti || wx.request({
            url: app.siteInfo.siteroot + "?i=" + app.siteInfo.uniacid + "&c=entry&a=wxapp&do=smk_pic_list_multi_more&m=" + app.moduleName,
            header: {
                "content-type": "application/json"
            },
            data: {
                page: i.data.nextPageMulti,
                odr: i.data.picOrderMulti,
                ops: i.data.optionSearchStrMulti,
                uid: i.data.user.uid
            },
            success: function(t) {
                for (var a = 0; a < t.data.data.length; a++) 0 == i.data.picListMultiNum ? (i.data.picListMulti.psLeft.push(t.data.data[a]), 
                i.data.picListMultiNum = 1) : (i.data.picListMulti.psRight.push(t.data.data[a]), 
                i.data.picListMultiNum = 0);
                0 == t.data.data.length && i.setData({
                    isBottomMulti: !0
                }), i.setData({
                    picListMulti: i.data.picListMulti,
                    nextPageMulti: i.data.nextPageMulti + 1
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
    checkPop: function() {
        var a = this;
        wx.request({
            url: app.siteInfo.siteroot + "?i=" + app.siteInfo.uniacid + "&c=entry&a=wxapp&do=smk_get_adpop&m=" + app.moduleName,
            data: {
                uid: app.globalData.userInfo.uid
            },
            header: {
                "content-type": "application/json"
            },
            success: function(t) {
                a.setData({
                    myadpop: t.data.data
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
    onReachBottom: function() {
        0 == this.data.picType ? this.getPicMultiMore() : 1 == this.data.picType && this.getPicSingleMore();
    },
    onShareAppMessage: function() {
        return {
            title: this.data.barTitle,
            success: function(t) {},
            fail: function(t) {}
        };
    }
});