var _createPageSys = require("../../createPageSys");

var _createPageSys2 = _interopRequireDefault(_createPageSys);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

// pages/ucenter/district/district.js
var app = getApp();

Page((0, _createPageSys2.default)({
    /**
     * 页面的初始数据
     */
    data: {
        districtList: [],
        loadingShow: true,
        nextPage: 2,
        isBoottom: false
    },
    getDistrictData: function getDistrictData(ismore) {
        var _this = this;
        var page = ismore ? this.data.nextPage : 1;
        app.http({
            url: app.apis.site_collect,
            data: {
                uid: app.globalData.userInfo.id,
                page: page
            },
            method: "POST"
        }).then(function(res) {
            if (res.list_site.length) {
                if (ismore) {
                    _this.setData({
                        districtList: _this.data.districtList.concat(res.list_site),
                        nextPage: _this.data.nextPage + 1
                    });
                } else {
                    _this.setData({
                        districtList: res.list_site,
                        nextPage: 2,
                        isBoottom: false
                    });
                }
            } else {
                if (!ismore) _this.setData({
                    districtList: [],
                    nextPage: 2,
                    isBoottom: false
                }); else _this.setData({
                    isBoottom: true
                });
            }
            _this.setData({
                loadingShow: false
            });
        }, function(err) {
            wx.showModal({
                content: err,
                showCancel: false
            });
            _this.setData({
                loadingShow: false
            });
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function onLoad(options) {
        this.title = "工地收藏";
        this.getDistrictData(false);
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function onReachBottom() {
        if (this.data.isBoottom) return;
        this.getDistrictData(true);
    }
}));