var _createPageSys = require("../createPageSys");

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
    allowShare: true,
    /**
     * 页面的初始数据
     */
    data: {
        mynav: {},
        navCurrId: 0,
        // 当前选中分类ID
        list: [],
        nextPage: 2,
        isBottom: false,
        loadingShow: true,
        isone: true
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function onLoad(options) {
        this.setData({
            navCurrId: options.id
        });
        this.setNav();
    },
    // nav
    setNav: function setNav() {
        var _this = this;
        app.http({
            url: app.apis.list_nav,
            data: {
                id: this.data.navCurrId
            }
        }).then(function(res) {
            _this.setData({
                mynav: res.nav,
                list: res.list
            });
            if (parseInt(_this.data.navCurrId) === 0) _this.setData({
                navCurrId: res.nav[0].id
            });
            _this.setData({
                loadingShow: false
            });
            setTimeout(function() {
                _this.setData({
                    isone: false
                });
            }, 100);
        }, function(err) {
            _this.setData({
                loadingShow: false
            });
        });
    },
    navClick: function navClick(_ref) {
        var _this2 = this;
        var detail = _ref.detail;
        this.setData({
            navCurrId: detail.value,
            nextPage: 2,
            isBottom: false
        });
        app.http({
            url: app.apis.list_list,
            data: {
                tid: this.data.navCurrId
            }
        }).then(function(res) {
            _this2.setData({
                list: res
            });
        }, function(err) {
            wx.showToast({
                title: err,
                image: "/public/images/icon_error.png"
            });
        });
    },
    // more
    getMore: function getMore() {
        var _this3 = this;
        if (!this.data.isBottom) {
            app.http({
                url: app.apis.list_list,
                data: {
                    tid: this.data.navCurrId,
                    page: this.data.nextPage
                }
            }).then(function(res) {
                for (var i = 0; i < res.length; i++) {
                    _this3.data.list.push(res[i]);
                }
                if (res.length == 0) _this3.setData({
                    isBottom: true
                });
                _this3.setData({
                    list: _this3.data.list,
                    nextPage: _this3.data.nextPage + 1
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
        this.getMore();
    }
}));