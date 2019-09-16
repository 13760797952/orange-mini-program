var _commonBehavior = require("../commonBehavior");

var _commonBehavior2 = _interopRequireDefault(_commonBehavior);

var _shop = require("../../store/shop");

var _site = require("../../api/site");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

var app = getApp();

Component({
    behaviors: [ _commonBehavior2.default ],
    properties: {
        mode: {
            type: String,
            value: "all"
        },
        btnText: {
            type: String,
            value: "确认"
        },
        commodityID: {
            type: null,
            observer: "reLoad"
        },
        commodityData: {
            type: Object,
            observer: "dataUpdate"
        }
    },
    data: {
        buyData: {
            commodityID: undefined,
            image: "",
            title: "",
            description: "",
            price: 0,
            priceStr: "0.00",
            number: 0,
            stock: undefined,
            selectedOptionsTip: "",
            selectedOptionsLabel: [],
            selectedOptions: [],
            selectedOptionsID: -1,
            checkSelected: false
        }
    },
    attached: function attached() {
        if (this.data.commodityData) {
            this.dataUpdate();
        } else if (this.commodityID !== undefined) {
            this.reLoad();
        }
    },
    ready: function ready() {},
    methods: {
        show: function show() {
            var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}, _ref$mode = _ref.mode, mode = _ref$mode === undefined ? "all" : _ref$mode, _ref$btnText = _ref.btnText, btnText = _ref$btnText === undefined ? "确认" : _ref$btnText;
            this.setData({
                mode: mode,
                btnText: btnText
            });
            this.selectComponent("#_commodity-buy-view").show();
        },
        hide: function hide() {
            this.selectComponent("#_commodity-buy-view").hide();
        },
        reLoad: function reLoad() {
            var _this = this;
            (0, _site.getCommodityData)(this.data.commodityID).then(function(_ref2) {
                var commodityData = _ref2.commodityData;
                _this.setData({
                    commodityData: commodityData
                });
            });
        },
        checkSelected: function checkSelected() {
            var buyData = this.data.buyData;
            return buyData.checkSelected && buyData.number > 0;
        },
        confirmByAction: function confirmByAction(_ref3) {
            var currentTarget = _ref3.currentTarget;
            this.confirm(currentTarget.dataset.action);
        },
        confirm: function confirm(action) {
            var _this2 = this;
            return new Promise(function(resolve) {
                if (_this2.checkSelected()) {
                    if (action === "add") {
                        (0, _shop.addToCart)(_this2.data.buyData).then(function(res) {
                            resolve();
                            _this2.triggerEvent("confirm", {
                                action: action
                            });
                        });
                    } else {
                        app.smartTo({
                            url: ">order-commit",
                            data: {
                                buynow: true,
                                list: [ _this2.data.buyData ]
                            }
                        });
                    }
                    _this2.hide();
                } else {
                    _this2.show({
                        mode: "confirm",
                        confirmAction: action
                    });
                }
            });
        },
        clickItem: function clickItem(_ref4) {
            var currentTarget = _ref4.currentTarget;
            var _currentTarget$datase = currentTarget.dataset, optionIndex = _currentTarget$datase.optionIndex, itemId = _currentTarget$datase.itemId;
            this.data.buyData.selectedOptions[optionIndex] = itemId;
            this.dataUpdate();
        },
        numberChange: function numberChange(_ref5) {
            var detail = _ref5.detail;
            this.data.buyData.number = detail.newVal;
            this.dataUpdate();
        },
        dataUpdate: function dataUpdate() {
            var _data = this.data, commodityData = _data.commodityData, buyData = _data.buyData;
            var images = commodityData.images, title = commodityData.title, description = commodityData.description, price = commodityData.price, priceStr = commodityData.priceStr, stock = commodityData.stock, unit = commodityData.unit, image = images[0], selectedOptions = buyData.selectedOptions, selectedOptionsID = -1, checkSelected = true, selectedOptionsLabel = commodityData.options.map(function(option, index) {
                var activeItem = option.items.find(function(item) {
                    return item.id == selectedOptions[index];
                });
                if (!activeItem) {
                    checkSelected = false;
                } else {
                    if (activeItem.image) image = activeItem.image;
                    return activeItem.label;
                }
            }), selectedOptionsTip = selectedOptionsLabel.join(" ") + (unit ? " 共" + buyData.number + unit : " 数量:" + buyData.number);
            if (checkSelected) {
                selectedOptions.length = commodityData.options.length;
                if (selectedOptions.length) {
                    var assemble = selectedOptions.join("+"), assembleConfig = commodityData.optionsData.find(function(item) {
                        return item.assemble === assemble;
                    });
                    if (assembleConfig) {
                        price = assembleConfig.price;
                        priceStr = assembleConfig.priceStr;
                        stock = assembleConfig.stock;
                        selectedOptionsID = assembleConfig.id;
                    }
                }
                checkSelected = stock > 0;
            }
            Object.assign(buyData, {
                commodityID: commodityData.id,
                image: image,
                title: title,
                description: description,
                price: price,
                priceStr: priceStr,
                stock: stock,
                selectedOptionsLabel: selectedOptionsLabel,
                checkSelected: checkSelected,
                selectedOptionsID: selectedOptionsID,
                selectedOptionsTip: checkSelected ? selectedOptionsTip : "请选择 " + commodityData.options.filter(function(option, index) {
                    return !selectedOptions[index];
                }).map(function(option) {
                    return option.label;
                }).join(" ")
            });
            this.setData({
                buyData: buyData
            });
            this.triggerEvent("update", buyData);
        }
    }
});