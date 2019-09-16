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
        senduser: "",
        sendtel: "",
        sendmsg: "",
        barTitle: "",
        pageConfig: {},
        loadingShow: true
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function onLoad(options) {
        this.setPageConfig();
    },
    imgLoad: function imgLoad() {
        this.setData({
            loadingShow: false
        });
    },
    setPageConfig: function setPageConfig() {
        var _this = this;
        app.http({
            url: app.apis.guestbook_config
        }).then(function(res) {
            _this.setData({
                pageConfig: res.set
            });
            if (!_this.data.pageConfig.thumb_post_url) _this.setData({
                loadingShow: false
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
        if (post_msg == null || post_msg == undefined || post_msg == "") {
            wx.showToast({
                title: "请输入留言内容",
                image: "/public/images/icon_err.png",
                duration: 2e3
            });
            return false;
        }
        app.http({
            url: app.apis.guestbook,
            data: {
                user: post_user,
                tel: post_tel,
                msg: post_msg,
                formid: post_formid
            }
        }).then(function(res) {
            console.log(res);
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
            console.log(res);
            wx.showToast({
                title: "提交失败",
                icon: "fail",
                duration: 2e3
            });
        });
    }
}));