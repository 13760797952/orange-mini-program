var _createPageSys = require("../createPageSys");

var _createPageSys2 = _interopRequireDefault(_createPageSys);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
            arr2[i] = arr[i];
        }
        return arr2;
    } else {
        return Array.from(arr);
    }
}

var app = getApp();

Page((0, _createPageSys2.default)({
    allowShare: true,
    /**
     * 页面的初始数据
     */
    data: {
        gid: "",
        progress_check: 0,
        list_progress: [],
        districtData: {},
        marginLeft: 0,
        marginRight: 0,
        listStyle: [],
        activeIndex: null,
        loadingShow: true
    },
    addressMap: function addressMap(e) {
        var _e$currentTarget$data = e.currentTarget.dataset, name = _e$currentTarget$data.name, address = _e$currentTarget$data.address, latitude = _e$currentTarget$data.latitude, longitude = _e$currentTarget$data.longitude;
        latitude = parseFloat(latitude);
        longitude = parseFloat(longitude);
        wx.openLocation({
            name: name,
            address: address,
            latitude: latitude,
            longitude: longitude,
            scale: 14
        });
    },
    mavClick: function mavClick(e) {
        this.setData({
            activeIndex: e.currentTarget.dataset.id
        });
    },
    shoucang: function shoucang() {
        var _this = this;
        var isfav = this.data.districtData.isfav === "1" ? "0" : "1";
        app.http({
            url: app.apis.site_collect + "&op=post",
            data: {
                id: this.data.districtData.id,
                ver: app.info.version,
                uid: app.globalData.userInfo.id,
                isfav: isfav
            },
            method: "POST"
        }).then(function(res) {
            _this.setData({
                "districtData.isfav": isfav
            });
            wx.showToast({
                title: "操作成功",
                icon: "succes",
                duration: 1500
            });
        });
    },
    onLoad: function onLoad(options) {
        this.setData({
            gid: options.id
        });
        this.getInfoData();
    },
    previewImage: function previewImage(e) {
        wx.previewImage({
            current: e.currentTarget.dataset.src,
            // 当前显示图片的http链接
            urls: e.currentTarget.dataset.imgs
        });
    },
    getInfoData: function getInfoData() {
        var _this2 = this;
        app.http({
            url: app.apis.site_one,
            data: {
                id: this.data.gid,
                uid: app.globalData.userInfo.id
            },
            method: "POST"
        }).then(function(res) {
            res.one.budget_format = (res.one.budget_format / 1e3).toFixed(2);
            _this2.setData({
                list_progress: res.list_progress,
                districtData: res.one,
                listStyle: res.style_show
            });
            var progress = [].concat(_toConsumableArray(res.list_progress));
            for (var i = 0; i < progress.length; i++) {
                if (progress[i].checked === "1") {
                    _this2.setData({
                        progress_check: i
                    });
                    break;
                }
            }
            var query = wx.createSelectorQuery();
            setTimeout(function() {
                query.select(".text-f").boundingClientRect(function(_ref) {
                    var width = _ref.width;
                    _this2.setData({
                        marginLeft: width / 2
                    });
                }).exec();
                query.select(".text-l").boundingClientRect(function(_ref2) {
                    var width = _ref2.width;
                    _this2.setData({
                        marginRight: width / 2,
                        loadingShow: false
                    });
                }).exec();
            }, 200);
        });
    }
}));