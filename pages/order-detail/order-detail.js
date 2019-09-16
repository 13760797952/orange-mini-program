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

var _orderStatusMap = require("../../store/orderStatusMap");

var _orderStatusMap2 = _interopRequireDefault(_orderStatusMap);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

var app = getApp();

Page((0, _createPage2.default)({
    title: "订单详情",
    data: {
        orderID: 0,
        order: {},
        pay: {},
        statusMap: _orderStatusMap2.default,
        statusViewConfig: {
            error: {
                icon: "error",
                btnText: "重试"
            }
        }
    },
    onLoad: function onLoad(options) {
        this.setDataByOptions([ {
            orderID: "id"
        }, "paynow" ], options);
        this.reLoad();
    },
    reLoad: function reLoad() {
        var _this = this;
        this.autoSetStatusView((0, _site.getOrderDetail)(this.data.orderID)).then(function(_ref) {
            var order = _ref.order, pay = _ref.pay;
            _this.setData({
                order: order,
                pay: pay
            });
            if (_this.data.paynow) _this.pay();
        });
    },
    pay: function pay() {
        var _this2 = this;
        var _data$pay = this.data.pay, isFail = _data$pay.isFail, info = _data$pay.info;
        if (isFail) {
            app.textToast("发起支付失败：" + info);
        } else {
            wx.requestPayment(_extends({}, info, {
                success: function success() {
                    (0, _site.updateOrderStatus)(_this2.data.orderID).then(function(status) {
                        _this2.setData({
                            "order.status": status
                        });
                    }, function(error) {
                        app.textToast(error);
                    });
                },
                fail: function fail(_ref2) {
                    var errMsg = _ref2.errMsg;
                    app.textToast(errMsg, true);
                }
            }));
        }
    }
}));