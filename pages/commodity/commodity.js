var _extends = Object.assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }
    return target;
};

var _createPage = require("../createPage");

var _createPage2 = _interopRequireDefault(_createPage);

var _site = require("../../api/site");

var _html2nodes = require("../../lib/html2nodes");

var _html2nodes2 = _interopRequireDefault(_html2nodes);

var _utils = require("../../lib/utils");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

var app = getApp();

Page((0, _createPage2.default)({
    allowShare: true,
    title: "商品详情",
    data: {
        commodityID: 0,
        commodityData: null,
        syscfg: undefined,
        stsModel: false,
        commodityDetails: [],
        commodityParameters: [],
        mainHeight: "",
        buyData: {},
        shopcartData: {},
        isFavorite: false,
        detailsTabsPosition: "static",
        detailsViewIndex: 0,
        tabItems: [ {
            id: 0,
            label: "概述"
        }, {
            id: 1,
            label: "参数"
        } ],
        statusViewConfig: {
            error: {
                icon: "error",
                btnText: "重试"
            }
        }
    },
    onLoad: function onLoad(options) {
        var _this = this;
        this.setDataByOptions([ {
            commodityID: "id"
        } ], options);
        this.setData({
            stsModel: app.stsModel
        });
        var setInt = setInterval(function() {
            if (app.sys) {
                _this.setData({
                    syscfg: app.sys
                });
                clearInterval(setInt);
            }
        }, 100);
        this.reLoad();
    },
    onShow: function onShow() {
        if (this._showAgain) this.shopCartReload();
        this._showAgain = true;
    },
    onReady: function onReady() {
        this._isReady = true;
        if (this._waitWxml) this.wxmlReady();
    },
    wxmlReady: function wxmlReady() {
        var _this2 = this;
        if (this._isReady) {
            wx.createSelectorQuery().select(".main-view").boundingClientRect(function(res) {
                try {
                    _this2.setData({
                        mainHeight: res.height + "px"
                    });
                } catch (e) {}
            }).exec();
            this.createIntersectionObserver({
                thresholds: [ 0, 1 ]
            }).relativeTo(".main-view").observe(".details-tabs-wrap", function(result) {
                _this2.setData({
                    detailsTabsPosition: result.boundingClientRect.top <= 0 ? "fixed" : "static"
                });
            });
        } else {
            this._waitWxml = true;
        }
    },
    reLoad: function reLoad() {
        var _this3 = this;
        this.autoSetStatusView((0, _site.getCommodityData)(this.data.commodityID), true).then(function(data) {
            _this3.wxmlReady();
            _this3.setData(_extends({}, data, {
                commodityDetails: (0, _html2nodes2.default)(data.commodityDetails, {
                    p: "padding: " + (0, _utils.rpx2px)(20) + "px;"
                }),
                commodityParameters: data.commodityParameters
            }));
            wx.setNavigationBarTitle({
                title: _this3.title = data.commodityData.title
            });
        });
    },
    previewImage: function previewImage(_ref) {
        var currentTarget = _ref.currentTarget;
        var index = currentTarget.dataset.index, urls = this.data.commodityData.images;
        wx.previewImage({
            urls: urls,
            current: urls[index]
        });
    },
    cartToggle: function cartToggle() {
        this.selectComponent("#shopcart-view").toggle();
    },
    buyAction: function buyAction(_ref2) {
        var currentTarget = _ref2.currentTarget;
        var mode = currentTarget.dataset.mode;
        this.selectComponent("#commodity-buy").show({
            mode: mode
        });
    },
    buyShow: function buyShow() {
        this.selectComponent("#commodity-buy").show();
    },
    shopCartReload: function shopCartReload() {
        this.selectComponent("#shop-cart").reLoad();
    },
    shopCartUpdate: function shopCartUpdate(_ref3) {
        var detail = _ref3.detail;
        this.setData({
            shopcartData: detail
        });
    },
    commodityBuyUpdate: function commodityBuyUpdate(_ref4) {
        var detail = _ref4.detail;
        this.setData({
            buyData: detail
        });
    },
    favoriteToggle: function favoriteToggle() {
        var _this4 = this;
        var isFavorite = !this.data.isFavorite;
        (0, _site.setCommodityFavorite)(this.data.commodityID, isFavorite).then(function(res) {
            _this4.setData({
                isFavorite: isFavorite
            });
        }, app.textToast);
    },
    tabChange: function tabChange(_ref5) {
        var value = _ref5.detail.value;
        this.setData({
            detailsViewIndex: value
        });
    }
}));