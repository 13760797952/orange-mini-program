var _createPageSys = require("../createPageSys");

var _createPageSys2 = _interopRequireDefault(_createPageSys);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

// pages/panorama-detail/panorama-detail.js
var app = getApp();

Page((0, _createPageSys2.default)({
    allowShare: true,
    /**
     * 页面的初始数据
     */
    data: {
        id: "",
        srcUrl: "",
        fav: 0
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function onLoad(options) {
        var _this = this;
        this.setData({
            id: options.id
        });
        app._getConfigPromise.then(function(success) {
            _this.setData({
                srcUrl: app.apis.SL_panorama_one + "&uid=" + app.globalData.userInfo.id + "&id=" + _this.data.id + "&ver=" + app.info.version
            });
        });
        this.title = options.title;
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function onShow() {},
    success: function success() {}
}));