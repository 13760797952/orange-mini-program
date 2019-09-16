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
        myDesingerList: [],
        // 设计师列表
        nextPage: 2,
        // 下一页
        isBottom: false,
        // 是否已到底线
        loadingShow: true
    },
    clickRedirectToDesigner: function clickRedirectToDesigner(e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/pages/opus/opus?id=" + id
        });
    },
    clickStylistCallMe: function clickStylistCallMe(e) {
        var tel = e.currentTarget.dataset.tel;
        wx.makePhoneCall({
            phoneNumber: tel
        });
    },
    /**
  * 生命周期函数--监听页面加载
  */
    onLoad: function onLoad(options) {
        var _this = this;
        app.getConfig().then(function() {
            _this.setPageConfig();
            // 设计师列表
                        _this.setDesignerList();
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
            url: app.apis.stylist_config
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
    /*
  * 设计师列表
  */
    setDesignerList: function setDesignerList() {
        var that = this;
        app.http({
            url: app.apis.designer_list
        }).then(function(res) {
            that.setData({
                myDesingerList: res
            });
        }, function(err) {
            wx.showToast({
                title: err,
                image: "/public/images/icon_error.png"
            });
        });
    },
    // 列表，获取更多
    setDesignerListMore: function setDesignerListMore() {
        var that = this;
        if (!that.data.isBottom) {
            app.http({
                url: app.apis.designer_list,
                data: {
                    uid: app.globalData.userInfo.id,
                    page: that.data.nextPage
                }
            }).then(function(res) {
                for (var i = 0; i < res.length; i++) {
                    that.data.myDesingerList.push(res[i]);
                }
                if (res.length == 0) {
                    that.setData({
                        isBottom: true
                    });
                }
                that.setData({
                    myDesingerList: that.data.myDesingerList,
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
        this.setDesignerListMore();
    }
}));