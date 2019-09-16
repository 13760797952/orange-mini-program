var _createPage = require("../createPage");

var _createPage2 = _interopRequireDefault(_createPage);

var _site = require("../../api/site");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

var app = getApp();

Page((0, _createPage2.default)({
    title: "领券中心",
    data: {
        list: [],
        statusViewConfig: {
            empty: {
                icon: "coupon",
                text: "还没有可以领取的优惠券哦"
            },
            error: {
                icon: "error",
                btnText: "重试"
            }
        },
        pagerLoadingConfig: {
            completed: {
                text: "没有更多了"
            }
        }
    },
    onLoad: function onLoad(options) {
        this.reLoad();
    },
    reLoad: function reLoad(ignoreCache) {
        var _this = this;
        this._pager = this._pager || (0, _site.getCouponsSupplyListPager)();
        this.autoSetPagerStatusView(this._pager.load(ignoreCache)).then(function(list) {
            _this.setData({
                list: list
            });
        });
    },
    onReachBottom: function onReachBottom() {
        var _this2 = this;
        if (this._pager && !this._pager.completed) this.autoSetPagerLoading(this._pager.next()).then(function(_ref) {
            var list = _ref.list;
            _this2.setData({
                list: list
            });
        });
    },
    itemTap: function itemTap(_ref2) {
        var _this3 = this;
        var data = _ref2.detail.data, currentTarget = _ref2.currentTarget;
        if (data.received || data.over < 1) return;
        (0, _site.receiveCounpon)(data.id).then(function(res) {
            var list = _this3.data.list;
            list[currentTarget.dataset.index].received = true;
            _this3.setData({
                list: list
            });
            app.successToast("领取成功");
        }, function(err) {
            app.textToast("领取失败: " + err.toString());
        });
    }
}));