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
var WxParse = require("../../public/wxParse/wxParse.js");

var article = null;

Page((0, _createPageSys2.default)({
    allowShare: true,
    /**
     * 页面的初始数据
     */
    data: {
        pageConfig: {},
        inputStatus: 0,
        loadingShow: true
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function onLoad(options) {
        this.setPageConfig();
    },
    imgLoadOver: function imgLoadOver() {
        var that = this;
        wx.hideNavigationBarLoading();
        //在标题栏中隐藏加载
                that.setData({
            inputStatus: 1,
            loadingShow: false
        });
    },
    setPageConfig: function setPageConfig() {
        var _this = this;
        var that = this;
        app.http({
            url: app.apis.style_config
        }).then(function(res) {
            that.setData({
                pageConfig: res.set
            });
            article = res.set.detail;
            WxParse.wxParse("article", "html", article, that);
            that.setData({
                loadingShow: false
            });
        }, function(err) {
            wx.showToast({
                title: err,
                image: "/public/images/icon_error.png"
            });
            _this.setData({
                loadingShow: false
            });
        });
    },
    formSubmit: function formSubmit(e) {
        var that = this;
        var post_user = e.detail.value.user;
        var post_tel = e.detail.value.tel;
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
            url: app.apis.style_post,
            data: {
                uid: app.globalData.userInfo.id,
                user: post_user,
                tel: post_tel,
                formid: post_formid
            }
        }).then(function(res) {
            if (parseInt(res.data.errno) == 0) {
                wx.showToast({
                    title: "提交成功",
                    icon: "success",
                    duration: 2e3
                });
                that.setData({
                    senduser: "",
                    sendtel: ""
                });
            } else {
                wx.showToast({
                    title: "提交失败",
                    image: "/public/images/icon_err.png",
                    duration: 2e3
                });
            }
        }, function(err) {
            wx.showToast({
                title: err,
                image: "/public/images/icon_error.png"
            });
        });
    }
}));