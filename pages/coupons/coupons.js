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
    title: "优惠券",
    data: {
        callback: null,
        type: 0,
        tabItems: [ {
            id: 0,
            label: "未使用"
        }, {
            id: 1,
            label: "已失效"
        } ],
        list: [],
        pagers: {},
        statusViewConfig: {
            empty: {
                icon: "coupon",
                text: "您还没有此类优惠券"
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
        },
        consumption: 0
    },
    onLoad: function onLoad(options) {
        this.setDataByOptions([ "callback", "consumption", "type" ], options);
        if (options.title) this.title = options.title;
        if (this.data.callback) {
            this.setData({
                type: 0,
                "statusViewConfig.empty.text": "没有可用的优惠券",
                "statusViewConfig.empty.btnText": ""
            });
        }
        this.reLoad();
    },
    onShow: function onShow() {
        if (this._showAgain) {
            this.data.pagers = {};
            this.reLoad();
        }
    },
    reLoad: function reLoad(ignoreCache) {
        var _this = this;
        var _data = this.data, type = _data.type, pagers = _data.pagers;
        var pager = pagers[type] = pagers[type] || (0, _site.getCouponsListPager)(type);
        this.autoSetPagerStatusView(pager.load(ignoreCache)).then(function(list) {
            if (_this.data.callback) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;
                try {
                    for (var _iterator = list[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var item = _step.value;
                        if (!item.available) item.failed = "未生效";
                        if (_this.data.consumption < item.minConsumption) item.failed = "条件不符";
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            } else if (type === 1) {
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;
                try {
                    for (var _iterator2 = list[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var _item = _step2.value;
                        _item.failed = _item.available ? "已使用" : "已过期";
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }
            }
            _this.setData({
                list: list
            });
        });
    },
    nextPage: function nextPage() {
        var _this2 = this;
        var _data2 = this.data, type = _data2.type, pagers = _data2.pagers;
        var pager = pagers[type];
        if (pager && !pager.completed) this.autoSetPagerLoading(pager.next()).then(function(_ref) {
            var list = _ref.list;
            _this2.setData({
                list: list
            });
        });
    },
    tabChange: function tabChange(_ref2) {
        var detail = _ref2.detail;
        this.setData({
            type: detail.value
        });
        this.reLoad();
    },
    itemTap: function itemTap(_ref3) {
        var detail = _ref3.detail;
        if (this.data.callback && !detail.data.failed) {
            app.pageCallBack(this.data.callback, detail.data);
        }
    },
    itemBtnTap: function itemBtnTap(_ref4) {
        var detail = _ref4.detail;
        if (!this.data.callback && detail.data.available && !detail.data.failed) app.actionRun("@shop");
    },
    callBackNull: function callBackNull() {
        if (!this.data.callback) return;
        app.pageCallBack(this.data.callback, null);
    }
}));