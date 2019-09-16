var _createPage = require("../createPage");

var _createPage2 = _interopRequireDefault(_createPage);

var _user = require("../../store/user");

var _site = require("../../api/site");

var _shop = require("../../store/shop");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

var app = getApp();

Page((0, _createPage2.default)({
    title: "填写订单",
    data: {
        address: null,
        coupon: null,
        list: [],
        totalPrice: 0,
        finalPrice: 0,
        offer: 0,
        buynow: false
    },
    onSmartToHere: function onSmartToHere(_ref) {
        var _this = this;
        var options = _ref.options, data = _ref.data;
        if (data) {
            this.setData({
                list: data.list.filter(function(item) {
                    return item.number > 0;
                }),
                buynow: !!data.buynow
            });
            this.reCalc();
        } else {
            app.smartTo({
                url: "@shop"
            });
        }
        (0, _user.getDefaultAddress)().then(function(address) {
            _this.setData({
                address: address
            });
        }, function(err) {});
    },
    addressChange: function addressChange(address) {
        this.setData({
            address: address
        });
    },
    couponChange: function couponChange(coupon) {
        this.setData({
            coupon: coupon
        });
        this.reCalc();
    },
    commit: function commit() {
        var _data = this.data, address = _data.address, coupon = _data.coupon, list = _data.list, buynow = _data.buynow;
        if (!address) return app.textToast("请选择地址");
        (0, _site.createOrder)({
            addressID: address.id,
            couponID: coupon ? coupon.id : undefined,
            items: list.map(function(item) {
                return {
                    id: buynow ? item.commodityID : item.id,
                    number: item.number,
                    optionsID: item.selectedOptionsID
                };
            })
        }, buynow).then(function(orderID) {
            (0, _shop.removeCartItemsLocal)(list.map(function(item) {
                return item.id;
            }));
            app.smartTo({
                method: "redirectTo",
                url: ">order-detail",
                options: {
                    id: orderID,
                    paynow: true
                }
            });
        }, function(err) {
            app.textToast(err.toString());
        });
    },
    reCalc: function reCalc() {
        var _data2 = this.data, list = _data2.list, coupon = _data2.coupon;
        var totalPrice = 0, finalPrice = void 0, offer = void 0;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;
        try {
            for (var _iterator = list[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var item = _step.value;
                totalPrice = totalPrice.add(item.price.mul(item.number));
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
        finalPrice = totalPrice;
        if (coupon) {
            finalPrice = finalPrice.mul(coupon.multiplication).add(coupon.addition);
            finalPrice = Math.max(finalPrice, 0).toFixed(2);
        }
        offer = totalPrice.sub(finalPrice);
        this.setData({
            totalPrice: totalPrice,
            finalPrice: finalPrice,
            offer: offer
        });
    }
}));