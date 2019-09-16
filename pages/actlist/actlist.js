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
        news: [],
        tid: 0,
        page: 2,
        setcont: "0",
        barTitle: "",
        loadingShow: true
    },
    bindLinkClick: function bindLinkClick(e) {
        app.sitefun.clickObjectLink(e, app);
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function onLoad(options) {
        this.setData({
            tid: options.tid
        });
        this.setNews();
    },
    /*
     * News
     */
    setNews: function setNews() {
        var _this = this;
        app.http({
            url: app.apis.act_news2,
            data: {
                tid: this.data.tid
            }
        }).then(function(res) {
            _this.setData({
                news: res
            });
            _this.setData({
                loadingShow: false
            });
        }, function(err) {
            console.log(err);
        });
    },
    /*
     * more
     */
    getMore: function getMore() {
        var _this2 = this;
        if (!this.data.isBottom) {
            app.http({
                url: app.apis.act_news2,
                data: {
                    tid: this.data.tid,
                    page: this.data.page
                }
            }).then(function(res) {
                for (var i = 0; i < res.list.length; i++) {
                    _this2.data.news.list.push(res.list[i]);
                }
                if (res.list.length == 0) {
                    _this2.setData({
                        isBottom: true
                    });
                }
                _this2.setData({
                    "news.list": _this2.data.news.list,
                    page: _this2.data.page + 1
                });
            }, function(err) {
                console.log(err);
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