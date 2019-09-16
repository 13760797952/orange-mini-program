var _createPageSys = require("../createPageSys");

var _createPageSys2 = _interopRequireDefault(_createPageSys);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
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
        mynav: [],
        navCurrId: 0,
        // 当前选中分类ID
        list: [],
        nextPages: {},
        isBottoms: {},
        navIndex: 0,
        banner: [],
        swiperHeight: 0
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function onLoad(options) {
        this.setNav();
    },
    bindLinkClick: function bindLinkClick(e) {
        app.sitefun.clickObjectLink(e, app);
    },
    // nav
    setNav: function setNav() {
        var _this = this;
        app.http({
            url: app.apis.act_list_nav,
            data: {
                id: this.data.navCurrId
            }
        }).then(function(res) {
            _this.setData({
                mynav: res.nav,
                banner: res.banner,
                navCurrId: res.nav[0].id
            });
            _this.initListData();
            if (res.nav != undefined) {
                _this.data.navCurrId = res.nav[0].id;
            }
        }, function(err) {
            wx.showToast({
                title: err,
                image: "/public/images/icon_error.png"
            });
        });
    },
    setSwithHeight: function setSwithHeight() {
        var _this2 = this;
        var query = wx.createSelectorQuery();
        setTimeout(function() {
            query.select(".list-data-" + _this2.data.navCurrId).boundingClientRect(function(_ref) {
                var height = _ref.height;
                _this2.setData({
                    swiperHeight: height
                });
            }).exec();
        }, 200);
    },
    initListData: function initListData() {
        var _this3 = this;
        var datas = [];
        var bottoms = {};
        var nextPages = {};
        for (var i = 0; i < this.data.mynav.length; i++) {
            bottoms[this.data.mynav[i].id] = false;
            nextPages[this.data.mynav[i].id] = 2;
            if (!app.actlist2_list_list) {
                datas[i] = new Promise(function(resolve, reject) {
                    wx.request({
                        url: app.apis.act_list_list,
                        data: {
                            tid: _this3.data.mynav[i].id
                        },
                        success: function success(res) {
                            if (res.data != "" && res.data.data.length > 0) {
                                resolve(res.data.data);
                            } else {
                                resolve({});
                            }
                        },
                        error: function error(err) {
                            reject("erreo");
                        }
                    });
                });
            }
        }
        this.setData({
            isBottoms: bottoms,
            nextPages: nextPages
        });
        if (!app.actlist2_list_list) {
            Promise.all(datas).then(function(result) {
                _this3.setData({
                    list: result
                });
                app.actlist2_list_list = result;
                _this3.setSwithHeight();
            }).catch(function(error) {
                console.log(error);
            });
        } else {
            this.setData({
                list: app.actlist2_list_list
            });
            this.setSwithHeight();
        }
    },
    bindChange: function bindChange(e) {
        console.log(e);
    },
    navClick: function navClick(_ref2) {
        var detail = _ref2.detail;
        this.setData({
            navCurrId: detail.value
        });
        this.setSwithHeight();
    },
    listChange: function listChange(e) {
        this.setData({
            navCurrId: this.data.list[e.detail.current][0].termid
        });
        this.setSwithHeight();
    },
    getMore: function getMore() {
        var _this4 = this;
        if (!this.data.isBottoms[this.data.navCurrId]) {
            app.http({
                url: app.apis.smk_act_list_list,
                data: {
                    tid: this.data.navCurrId,
                    page: this.data.nextPages[this.data.navCurrId]
                }
            }).then(function(res) {
                var list = _this4.data.list;
                if (res.length == 0) _this4.setData(_defineProperty({}, "isBottoms." + _this4.data.navCurrId, true)); else {
                    for (var i = 0; i < list.length; i++) {
                        if (list[i][0].termid == _this4.data.navCurrId) {
                            list[i] = list[i].concat(res);
                            break;
                        }
                    }
                }
                _this4.setData(_defineProperty({
                    list: list
                }, "nextPages." + _this4.data.navCurrId, _this4.data.nextPages[_this4.data.navCurrId] + 1));
                _this4.setSwithHeight();
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