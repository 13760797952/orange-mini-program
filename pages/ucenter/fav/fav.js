var _createPageSys = require("../../createPageSys");

var _createPageSys2 = _interopRequireDefault(_createPageSys);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

// pages/ucenter/fav/fav.js
var app = getApp();

//获取应用实例
Page((0, _createPageSys2.default)({
    /**
     * 页面的初始数据
     */
    data: {
        picType: 0,
        // 套图=0 or 单图=1
        picListMulti: {},
        // 套图列表内容
        picListSingle: {},
        // 单图列表内容
        nextPageMulti: 2,
        // 下一页,套图
        nextPageSingle: 2,
        // 下一页,单图
        isBottomMulti: false,
        // 是否已到底线，套图
        isBottomSingle: false,
        // 是否已到底线，单图
        loadingShow: true
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function onLoad(options) {
        this.setPicListFav();
        this.title = "图片收藏";
    },
    // 套图 或 单图，切换
    clickPicType: function clickPicType() {
        var that = this;
        if (that.data.picType == 0) {
            that.setData({
                picType: 1
            });
        } else {
            that.setData({
                picType: 0
            });
        }
    },
    // 单图 或 套图，列表内容
    setPicListFav: function setPicListFav() {
        var _this = this;
        app.http({
            url: app.apis.pic_list_fav,
            data: {
                uid: app.globalData.userInfo.id
            }
        }).then(function(res) {
            _this.setData({
                picListMulti: res.multi,
                picListSingle: res.single,
                loadingShow: false
            });
        }, function(err) {
            wx.showToast({
                title: err,
                image: "/public/images/icon_error.png"
            });
        });
    },
    // ------------------------------------
    // 单图 more
    getPicSingleMore: function getPicSingleMore() {
        var that = this;
        if (!that.data.isBottomSingle) {
            app.http({
                url: app.apis.pic_list_fav_single_more,
                data: {
                    page: that.data.nextPageSingle,
                    uid: app.globalData.userInfo.id
                }
            }).then(function(res) {
                for (var i = 0; i < res.length; i++) {
                    that.data.picListSingle.push(res[i]);
                }
                if (res.length == 0) {
                    that.setData({
                        isBottomSingle: true
                    });
                }
                that.setData({
                    picListSingle: that.data.picListSingle,
                    nextPageSingle: that.data.nextPageSingle + 1
                });
            }, function(err) {
                wx.showToast({
                    title: err,
                    image: "/public/images/icon_error.png"
                });
            });
        }
    },
    // ------------------------------------
    // 套图 more
    getPicMultiMore: function getPicMultiMore() {
        var that = this;
        if (!that.data.isBottomMulti) {
            app.http({
                url: app.apis.pic_list_fav_multi_more,
                data: {
                    page: that.data.nextPageMulti,
                    uid: app.globalData.userInfo.id
                }
            }).then(function(res) {
                for (var i = 0; i < res.length; i++) {
                    that.data.picListMulti.push(res[i]);
                }
                if (res.length == 0) that.setData({
                    isBottomMulti: true
                });
                that.setData({
                    picListMulti: that.data.picListMulti,
                    nextPageMulti: that.data.nextPageMulti + 1
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
        if (this.data.picType == 0) {
            this.getPicMultiMore();
        } else if (this.data.picType == 1) {
            this.getPicSingleMore();
        }
    }
}));