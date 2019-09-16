var _createPageSys = require("../../createPageSys");

var _createPageSys2 = _interopRequireDefault(_createPageSys);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

// 深蓝网络 Copyright (c) www.zhshenlan.com
var app = getApp();

//获取应用实例
Page((0, _createPageSys2.default)({
    /**
     * 页面的初始数据
     */
    data: {
        myadpop: {},
        authShow: false,
        siteVersion: "",
        menusEnabled: "0",
        logo_url: "",
        hasAuth: true,
        tabShow: true,
        loadingColor: app.maincolor ? app.maincolor : "#2fbd80",
        reList: [],
        nextPage: 2,
        // 下一页
        isBottom: false
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function onLoad(options) {
        this.setReList();
        this.title = "我的预约";
    },
    // 列表
    setReList: function setReList() {
        var that = this;
        app.http({
            url: app.apis.relist,
            data: {
                uid: that.data.user.id
            }
        }).then(function(res) {
            that.setData({
                reList: res
            });
        }, function(err) {
            wx.showToast({
                title: err,
                image: "/public/images/icon_error.png"
            });
        });
    },
    // 列表，获取更多
    setReListMore: function setReListMore() {
        var that = this;
        if (!that.data.isBottom) {
            app.http({
                url: app.apis.relist,
                data: {
                    uid: that.data.user.id,
                    page: that.data.nextPage
                }
            }).then(function(res) {
                for (var i = 0; i < res.length; i++) {
                    that.data.reList.push(res[i]);
                }
                if (res.length == 0) that.setData({
                    isBottom: true
                });
                that.setData({
                    reList: that.data.reList,
                    nextPage: that.data.nextPage + 1
                });
            }, function(err) {
                wx.showToast({
                    title: err,
                    image: "/public/images/icon_error.png"
                });
            });
        }
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function onReachBottom() {
        this.setReListMore();
    }
}));