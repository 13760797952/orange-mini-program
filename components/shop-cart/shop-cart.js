var _commonBehavior = require("../commonBehavior");

var _commonBehavior2 = _interopRequireDefault(_commonBehavior);

var _shop = require("../../store/shop");

var _site = require("../../api/site");

var _commonMethod = require("../../pages/commonMethod");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}

var app = getApp();

Component({
    behaviors: [ _commonBehavior2.default ],
    options: {
        multipleSlots: true
    },
    properties: {
        showBackHomeBtn: {
            type: Boolean,
            value: false
        }
    },
    data: {
        items: [],
        selectedCount: 0,
        selectedPrice: 0,
        statusViewConfig: {
            error: {
                icon: "error",
                btnText: "重试"
            }
        }
    },
    attached: function attached() {
        this.reLoad();
    },
    ready: function ready() {
        var _this = this;
        setTimeout(function() {
            _this.reCalcScrollHeight();
        }, 200);
    },
    methods: {
        autoSetStatusView: _commonMethod.autoSetStatusView,
        errorReLoad: function errorReLoad() {
            this.reLoad(true);
        },
        reLoad: function reLoad(ignoreCache) {
            var _this2 = this;
            this.autoSetStatusView((0, _shop.getCartItems)(ignoreCache)).then(function(items) {
                _this2.setData({
                    items: items
                });
                _this2.reCalc(true);
            });
        },
        reCalcScrollHeight: function reCalcScrollHeight() {
            var _this3 = this;
            this.setData({
                scrollHeight: "auto"
            });
            var query = wx.createSelectorQuery().in(this);
            query.select("._shopcart-scroll").boundingClientRect(function(res) {
                try {
                    if (res.height) _this3.setData({
                        scrollHeight: res.height + "px"
                    });
                } catch (e) {}
            }).exec();
        },
        reCalc: function reCalc(updateScrollHeight) {
            var items = this.data.items, selectedCount = 0, selectedPrice = 0;
            items.forEach(function(item) {
                if (item.selected && item.number > 0) {
                    selectedCount++;
                    selectedPrice = selectedPrice.add(item.price.mul(item.number));
                } else {
                    item.selected = false;
                }
            });
            this.setData({
                items: items,
                selectedCount: selectedCount,
                selectedPrice: selectedPrice
            });
            this.triggerEvent("update", {
                itemsLength: items.length,
                selectedCount: selectedCount,
                selectedPrice: selectedPrice
            });
            updateScrollHeight && this.reCalcScrollHeight();
        },
        targetItemChange: function targetItemChange(event) {
            var id = event.currentTarget.dataset.id, key = event.currentTarget.dataset.key, value = event.detail.newVal, targetItem = this.data.items.find(function(item) {
                return item.id == id;
            });
            if (!targetItem) return;
            targetItem[key] = value;
            if (key !== "selected" || event.detail.byUser) {
                (0, _shop.updateCartItem)(id, _defineProperty({}, key, value));
            }
            this.reCalc();
        },
        selectAll: function selectAll(_ref) {
            var detail = _ref.detail;
            if (!detail.byUser) return;
            this.data.items.forEach(function(item) {
                item.selected = detail.newVal;
            });
            (0, _site.setCartItemsSelected)(detail.newVal);
            this.reCalc();
        },
        removeItem: function removeItem(_ref2) {
            var _this4 = this;
            var currentTarget = _ref2.currentTarget;
            var id = currentTarget.dataset.id, targetIndex = this.data.items.findIndex(function(item) {
                return item.id == id;
            });
            if (targetIndex === -1) return;
            wx.showModal({
                title: "购物车",
                content: "确定移除此商品？",
                confirmColor: "#cc353c",
                success: function success(res) {
                    if (!res.confirm) return;
                    (0, _shop.removeCartItem)(id).then(function(list) {
                        _this4.data.items = list;
                        _this4.reCalc(true);
                    });
                }
            });
        },
        commit: function commit() {
            var list = this.data.items.filter(function(item) {
                return item.selected;
            });
            if (!list.length) return;
            app.smartTo({
                url: ">order-commit",
                data: {
                    list: list
                }
            });
        }
    }
});