var _createPageSys = require("../createPageSys");

var _createPageSys2 = _interopRequireDefault(_createPageSys);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

// 深蓝网络 Copyright (c) www.zhshenlan.com
var app = getApp();

// 获取应用实例
Page((0, _createPageSys2.default)({
    allowShare: true,
    /**
     * 页面的初始数据
     */
    data: {
        mydate: "2018-01-01",
        loadingShow: true
    },
    bindDateChange: function bindDateChange(e) {
        // console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            mydate: e.detail.value
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function onLoad(options) {
        this.setPageConfig();
        //获取当前日期
                var md = new Date();
        var mydate = md.toLocaleDateString();
        this.setData({
            mydate: mydate
        });
    },
    imgLoad: function imgLoad() {
        this.setData({
            loadingShow: false
        });
    },
    setPageConfig: function setPageConfig() {
        var that = this;
        app.http({
            url: app.apis.reserve_config
        }).then(function(res) {
            that.setData({
                pageConfig: res.set
            });
            if (!that.data.pageConfig.thumb_post_url) {
                that.setData({
                    loadingShow: false
                });
            }
        }, function(err) {
            wx.showToast({
                title: err,
                image: "/public/images/icon_error.png"
            });
        });
    },
    addReserveOne: function addReserveOne(e) {
        var that = this;
        var post_user = e.detail.value.user;
        var post_tel = e.detail.value.tel;
        var post_msg = e.detail.value.msg;
        var post_formid = e.detail.formId;
        if (post_user == null || post_user == undefined || post_user == "") {
            wx.showToast({
                title: "姓名不能为空",
                image: "/public/images/icon_err.png",
                duration: 2e3
            });
            return false;
        }
        if (post_tel == null || post_tel == undefined || post_tel == "") {
            wx.showToast({
                title: "电话不能为空",
                image: "/public/images/icon_err.png",
                duration: 2e3
            });
            return false;
        }
        app.http({
            url: app.apis.reserve_one,
            data: {
                uid: app.globalData.userInfo.id,
                user: post_user,
                tel: post_tel,
                msg: post_msg,
                mydate: that.data.mydate,
                formid: post_formid
            }
        }).then(function(res) {
            wx.showToast({
                title: "提交成功",
                icon: "success",
                duration: 2e3
            });
            that.setData({
                senduser: "",
                sendtel: "",
                sendmsg: ""
            });
        }, function(err) {
            wx.showToast({
                title: err,
                image: "/public/images/icon_error.png",
                duration: 2e3
            });
        });
    },
    reserveOne: function reserveOne(user, tel, msg, formid) {
        var _this = this;
        app.http({
            url: app.apis.reserve_one,
            data: {
                uid: app.globalData.userInfo.id,
                user: user,
                tel: tel,
                msg: msg,
                mydate: this.data.mydate,
                formid: formid
            }
        }).then(function(res) {
            wx.showToast({
                title: "提交成功",
                icon: "success",
                duration: 2e3
            });
            _this.setData({
                senduser: "",
                sendtel: "",
                sendmsg: ""
            });
        }, function(err) {
            wx.showToast({
                title: err,
                image: "/public/images/icon_error.png"
            });
        });
    },
    formSubmit: function formSubmit(e) {
        var that = this;
        var post_user = e.detail.value.user;
        var post_tel = e.detail.value.tel;
        var post_msg = e.detail.value.msg;
        var post_formid = e.detail.formId;
        if (post_user == null || post_user == undefined || post_user == "") {
            wx.showToast({
                title: "请输入姓名",
                image: "/public/images/icon_err.png",
                duration: 2e3
            });
            return false;
        }
        if (post_tel == null || post_tel == undefined || post_tel == "") {
            wx.showToast({
                title: "请输入电话号码",
                image: "/public/images/icon_err.png",
                duration: 2e3
            });
            return false;
        }
        if (post_msg == null || post_msg == undefined || post_msg == "") {
            wx.showToast({
                title: "请输入预约内容",
                image: "/public/images/icon_err.png",
                duration: 2e3
            });
            return false;
        }
        if (that.data.pageConfig.reserve_money_format > 0) {
            wx.login({
                success: function success(res) {
                    if (res.code) {
                        app.http({
                            url: app.apis.reserve_pay,
                            method: "POST",
                            contentType: 1,
                            data: {
                                code: res.code
                            }
                        }).then(function(rst) {
                            wx.requestPayment({
                                timeStamp: rst.timeStamp,
                                nonceStr: rst.nonceStr,
                                package: rst.package,
                                signType: "MD5",
                                paySign: rst.paySign,
                                success: function success(response) {
                                    this.reserveOne(post_user, post_tel, post_msg, post_formid);
                                }
                            });
                        });
                    } else {
                        wx.showToast({
                            title: "获取用户登录态失败！" + res.errMsg,
                            image: "/public/images/icon_err.png",
                            duration: 2e3
                        });
                    }
                }
            });
        } else {
            this.reserveOne(post_user, post_tel, post_msg, post_formid);
        }
    }
}));