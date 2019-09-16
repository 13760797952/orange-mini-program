var _createPage = require("../createPage");

var _createPage2 = _interopRequireDefault(_createPage);

var _site = require("../../api/site");

var _orderStatusMap = require("../../store/orderStatusMap");

var _orderStatusMap2 = _interopRequireDefault(_orderStatusMap);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

Page((0, _createPage2.default)({
    title: "我的订单",
    data: {
        type: -1,
        statusMap: _orderStatusMap2.default,
        tabItems: [ {
            id: -1,
            label: "全部"
        }, {
            id: 1,
            label: "待付款"
        }, {
            id: 2,
            label: "待发货"
        }, {
            id: 3,
            label: "待收货"
        }, {
            id: 4,
            label: "已完成"
        }, {
            id: 5,
            label: "已退款"
        } ],
        list: [],
        pagers: {},
        statusViewConfig: {
            empty: {
                icon: "",
                text: "还没有此类订单哦~"
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
        this.setDataByOptions([ "status" ], options);
        this.reLoad();
    },
    onShow: function onShow() {
        if (this._showAgain) {
            this.data.pagers = {};
            this.reLoad(true);
        }
    },
    reLoad: function reLoad(ignoreCache) {
        var _this = this;
        var _data = this.data, type = _data.type, pagers = _data.pagers;
        var pager = pagers[type] = pagers[type] || (0, _site.getOrdersListPager)(type);
        this.autoSetPagerStatusView(pager.load(ignoreCache)).then(function(list) {
            _this.setData({
                list: list
            });
        });
    },
    tabChange: function tabChange(event) {
        var type = event.detail.value;
        this.setData({
            type: type
        });
        this.reLoad();
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
    }
}));