var _createPageSys = require("../createPageSys");

var _createPageSys2 = _interopRequireDefault(_createPageSys);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

var app = getApp();

// pages/auth/auth.js
Page((0, _createPageSys2.default)({
    data: {
        loading: true,
        url: "@index"
    },
    onLoad: function onLoad(options) {
        var _this = this;
        if (options.url) this.data.url = decodeURIComponent(options.url);
        if (app.globalData.userInfo) {
            this.enter();
        } else {
            app.getConfig().then(function() {
                _this.setData({
                    syscfg: app.sys
                });
                _this.setData({
                    loading: false
                });
            });
        }
    },
    notTouch: function notTouch() {},
    bindGetUserInfoClick: function bindGetUserInfoClick(e) {
        var _this2 = this;
        wx.login({
            success: function success(res) {
                if (res.code) {
                    app.http({
                        url: app.apis.create_user,
                        method: "POST",
                        contentType: 1,
                        data: {
                            code: res.code,
                            nicename: e.detail.userInfo.nickName,
                            avatar: e.detail.userInfo.avatarUrl,
                            province: e.detail.userInfo.province,
                            city: e.detail.userInfo.city,
                            gender: e.detail.userInfo.gender
                        }
                    }).then(function(res) {
                        if (res != undefined) {
                            app.globalData.userInfo = res;
                            _this2.setData({
                                user: res
                            });
                            app.setUserData(res);
                            wx.setStorageSync("appUserInfo", res);
                            if (res.id != undefined) {
                                app.globalData.userInfo.id = res.id;
                            }
                            _this2.enter();
                        } else {
                            app.globalData.userInfo = undefined;
                            wx.showModal({
                                content: "获取用户信息失败",
                                showCancel: false
                            });
                        }
                    }, function(err) {
                        wx.showModal({
                            content: "请求失败！",
                            showCancel: false
                        });
                    });
                } else {
                    wx.showModal({
                        content: "获取用户登录态失败！",
                        showCancel: false
                    });
                }
            }
        });
    },
    onShow: function onShow() {
        if (this._isTo) app.smartTo({
            url: "@index"
        });
    },
    enter: function enter() {
        var _this3 = this;
        this.setData({
            loading: true
        });
        app.getConfig().then(function() {
            app.smartTo({
                url: _this3.data.url
            });
            _this3._isTo = true;
        });
    }
}));