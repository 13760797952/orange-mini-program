var appload = {
    pushUser: function(o) {
        console.log("pushUser"), wx.login({
            success: function(a) {
                a.code ? wx.request({
                    url: o.siteInfo.siteroot + "?i=" + o.siteInfo.uniacid + "&c=entry&a=wxapp&do=smk_create_user&m=" + o.moduleName,
                    method: "POST",
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    data: {
                        code: a.code,
                        nicename: o.globalData.userInfo.nickName,
                        avatar: o.globalData.userInfo.avatarUrl,
                        province: o.globalData.userInfo.province,
                        city: o.globalData.userInfo.city,
                        gender: o.globalData.userInfo.gender
                    },
                    success: function(a) {
                        null != se.data.data ? (o.globalData.userInfo = se.data.data, wx.setStorage({
                            key: "appUserInfo",
                            data: se.data.data
                        }), null != se.data.data.id && (o.globalData.userInfo.uid = se.data.data.id)) : o.globalData.userInfo = void 0;
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
    getConfig: function(o) {
        null == o.sys && wx.request({
            url: o.siteInfo.siteroot + "?i=" + o.siteInfo.uniacid + "&c=entry&a=wxapp&do=smk_config&m=" + o.moduleName,
            success: function(a) {
                console.log("getConfig"), null !== a.data.data && void 0 !== a.data.data && "" !== a.data.data && (o.sys = a.data.data, 
                o.sys.info = o.info);
            },
            error: function(a) {
                wx.showModal({
                    content: "读取系统配置出错！",
                    showCancel: !1
                });
            }
        });
        wx.getStorage({
            key: "appUserInfo",
            success: function(a) {
                null != a.data ? (o.globalData.userInfo = a.data, wx.setStorage({
                    key: "appUserInfo",
                    data: a.data
                }), null != a.data.id && (o.globalData.userInfo.uid = a.data.id)) : o.globalData.userInfo = void 0;
            }
        });
    }
};

module.exports = appload;