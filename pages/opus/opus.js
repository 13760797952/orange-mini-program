var _createPageSys = require("../createPageSys");

var _createPageSys2 = _interopRequireDefault(_createPageSys);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

// pages/opus/opus.js
var app = getApp();

// 获取应用实例
Page((0, _createPageSys2.default)({
    allowShare: true,
    /**
     * 页面的初始数据
     */
    data: {
        opusid: null,
        opusdata: null,
        listCount: 0,
        opList: [],
        nextPage: 2,
        // 下一页
        isBottom: false,
        // 是否已到底线
        loadingShow: true
    },
    clickOpusCallMe: function clickOpusCallMe(e) {
        var tel = e.currentTarget.dataset.tel;
        wx.makePhoneCall({
            phoneNumber: tel
        });
    },
    clickOpusGuestbook: function clickOpusGuestbook(e) {
        wx.redirectTo({
            url: "/pages/guestbook/guestbook"
        });
    },
    clickPic: function clickPic(e) {
        var ptype = e.currentTarget.dataset.ptype;
        var id = e.currentTarget.dataset.id;
        var that = this;
        if (ptype == "0") {
            wx.navigateTo({
                url: "/pages/play/play?type=0&id=" + id
            });
        } else {
            var dantu = [], oplist = that.data.opList.slice();
            for (var i = 0; i < oplist.length; i++) {
                if (oplist[i].type == "1") {
                    dantu.push(oplist[i]);
                }
            }
            app.singleList = dantu;
            wx.navigateTo({
                url: "/pages/play/play?type=1&id=" + id
            });
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function onLoad(options) {
        this.setData({
            opusid: options.id
        });
        this.setPageConfig();
        // 获取单个设计师信息
                this.setOpusContent();
        // 获取单个设计师信息
                this.setOpusList();
    },
    setPageConfig: function setPageConfig() {
        var _this = this;
        app.http({
            url: app.apis.stylist_config
        }).then(function(res) {
            _this.setData({
                pageConfig: res.set
            });
            if (_this.data.pageConfig != undefined) {
                if (_this.data.pageConfig.topcolor == undefined || _this.data.pageConfig.topcolor == null || _this.data.pageConfig.topcolor == "") {
                    _this.data.pageConfig.topcolor = "#2fbd80";
                }
            }
        });
    },
    // 获取单个设计师信息
    setOpusContent: function setOpusContent() {
        var _this2 = this;
        app.http({
            url: app.apis.designer_one,
            data: {
                id: this.data.opusid
            }
        }).then(function(res) {
            _this2.setData({
                opusdata: res.one,
                listCount: res.count
            });
            _this2.setData({
                loadingShow: false
            });
        }, function(err) {
            wx.showToast({
                title: err,
                image: "/public/images/icon_error.png"
            });
        });
    },
    // 获取作品列表
    setOpusList: function setOpusList() {
        var _this3 = this;
        app.http({
            url: app.apis.opus_list,
            data: {
                id: this.data.opusid
            }
        }).then(function(res) {
            _this3.setData({
                opList: res.oplist
            });
        }, function(err) {
            wx.showToast({
                title: err,
                image: "/public/images/icon_error.png"
            });
        });
    },
    // 获取作品列表，获取更多
    setOpusListMore: function setOpusListMore() {
        var _this4 = this;
        app.http({
            url: app.apis.opus_list,
            data: {
                id: this.data.opusid,
                page: this.data.nextPage
            }
        }).then(function(res) {
            for (var i = 0; i < res.oplist.length; i++) {
                _this4.data.opList.push(res.oplist[i]);
            }
            if (res.length == 0) _this4.setData({
                isBottom: true
            });
            _this4.setData({
                opList: _this4.data.opList,
                nextPage: _this4.data.nextPage + 1
            });
        }, function(err) {
            wx.showToast({
                title: err,
                image: "/public/images/icon_error.png"
            });
        });
    }
}));