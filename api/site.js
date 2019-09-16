Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.updateOrderStatus = exports.getOrderDetail = exports.getOrdersListPager = exports.commitFormID = exports.createOrder = exports.getCouponsListPager = exports.receiveCounpon = exports.getCouponsSupplyListPager = exports.removeAddress = exports.commitAddress = exports.getAddressList = exports.getCartItems = exports.setCartItemsSelected = exports.removeCartItem = exports.updateCartItem = exports.addToCart = exports.getFavoritesListPager = exports.setCommodityFavorite = exports.getCommodityData = exports.getCommoditiesListPager = exports.getCategoryDataByID = exports.getCategoriesList = exports.getHomeData = exports.getProductArticleByID = exports.getPanoramasListByKeywordPager = exports.getPanoramasListPager = exports.getPanoramasFavPager = exports.getPanoramasListConfig = exports.getProductsListPager = exports.getProductsFavPager = exports.getProductsListConfig = exports.reportUserBehavior = undefined;

exports.injectConfig = injectConfig;

var _ApiClient = require("./ApiClient");

var _ApiClient2 = _interopRequireDefault(_ApiClient);

var _PagerCreater = require("./PagerCreater");

var _PagerCreater2 = _interopRequireDefault(_PagerCreater);

var _user = require("../store/user");

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

var defaultConfig = {};

var api = new _ApiClient2.default(defaultConfig, {
    request: function request(config) {
        if (config.needTrack) {
            config.params = Object.assign({}, {
                uid: _user.userData.id
            }, config.params);
        }
        if (config.data instanceof Function) config.data = config.data();
        if (config.method === "POST") {
            var header = config.header["content-type"] = config.header["content-type"] || "application/x-www-form-urlencoded";
            if (header === "application/json" && config.injectData) {
                config.data = config.params;
            }
        }
    },
    response: function response(_ref) {
        var data = _ref.data, statusCode = _ref.statusCode;
        if (statusCode !== 200) throw "statusCode: " + statusCode;
        if (!(data instanceof Object)) throw data;
        if (data.errno != 0) throw data.message;
        return data.data;
    }
});

var pager = new _PagerCreater2.default({
    requestCreater: function requestCreater(cfg) {
        return api.request(cfg.url, cfg);
    },
    cfgCreater: function cfgCreater(cfg, page) {
        cfg.params = cfg.params || {};
        cfg.params.page = page;
        return cfg;
    },
    per: 10,
    firstPage: 1
});

function injectConfig(config) {
    Object.assign(defaultConfig, config);
}

function _articleItemInfo(item) {
    return {
        id: _id(item.id),
        time: _str(item.addtime).split(" ")[0],
        title: _str(item.title),
        subTitle: _str(item.subtitle),
        typeText: _str(item.term_cn),
        image: _str(item.thumb_url),
        fav_count: _num(item.fav_count),
        view_count: _num(item.view_count),
        fav: _num(item.fav)
    };
}

function _articleData(item) {
    return {
        id: _id(item.id),
        title: _str(item.title),
        subTitle: _str(item.subtitle),
        image: _str(item.thumb_url),
        author: "",
        time: _str(item.addtime),
        content: _str(item.detail),
        actionImage: _str(item.out_thumb_url),
        action: _str(item.out_link),
        byUser: _bool(item.dy_type),
        fav_count: _num(item.fav_count),
        view_count: _num(item.view_count),
        fav: _num(item.fav)
    };
}

//用户行为报告
var reportUserBehavior = exports.reportUserBehavior = function reportUserBehavior(code, data) {
    return api.post("?do=SL_send_operation", {
        needTrack: true,
        header: {
            "content-type": "application/json"
        },
        data: {
            code: code,
            id: data
        }
    });
};

//产品列表配置
var getProductsListConfig = exports.getProductsListConfig = function getProductsListConfig() {
    return api.get("?do=SL_pro_list_config", {
        needTrack: true,
        transform: function transform(_ref2) {
            var config = _ref2.config;
            return {
                listMode: _str(config.list_style)
            };
        }
    });
};

//收藏产品列表
var getProductsFavPager = exports.getProductsFavPager = function getProductsFavPager() {
    return pager.create({
        url: "?do=SL_pro_collect",
        needTrack: true,
        transform: function transform(data) {
            return _arr(data.list_pro, _articleItemInfo);
        }
    });
};

//产品列表
var getProductsListPager = exports.getProductsListPager = function getProductsListPager() {
    return pager.create({
        url: "?do=SL_pro_list",
        method: "GET",
        needTrack: true,
        transform: function transform(data) {
            return _arr(data.topic.items, _articleItemInfo);
        }
    });
};

//全景列表配置
var getPanoramasListConfig = exports.getPanoramasListConfig = function getPanoramasListConfig() {
    return api.get("?do=SL_panorama_config", {
        needTrack: true,
        transform: function transform(_ref3) {
            var config = _ref3.config;
            return {
                listMode: _str(config.list_style)
            };
        }
    });
};

//收藏全景图列表
var getPanoramasFavPager = exports.getPanoramasFavPager = function getPanoramasFavPager() {
    return pager.create({
        url: "?do=SL_panorama_collect",
        method: "POST",
        header: {
            "content-type": "application/json"
        },
        needTrack: true,
        transform: function transform(data) {
            return _arr(data.list_pro, _articleItemInfo);
        }
    });
};

//全景列表
var getPanoramasListPager = exports.getPanoramasListPager = function getPanoramasListPager() {
    return pager.create({
        url: "?do=SL_panorama",
        method: "GET",
        needTrack: true,
        transform: function transform(_ref4) {
            var panorama = _ref4.panorama;
            return _arr(panorama.items, _articleItemInfo);
        }
    });
};

//全景列表
var getPanoramasListByKeywordPager = exports.getPanoramasListByKeywordPager = function getPanoramasListByKeywordPager(key) {
    return pager.create({
        url: "?do=SL_pic_search",
        method: "GET",
        needTrack: true,
        params: {
            type: 4,
            key: key
        },
        transform: function transform(_ref5) {
            var panorama = _ref5.panorama;
            return _arr(panorama, _articleItemInfo);
        }
    });
};

//产品文章
var getProductArticleByID = exports.getProductArticleByID = function getProductArticleByID(productID) {
    return api.get("?do=SL_pro_one", {
        needTrack: true,
        params: {
            aid: productID
        },
        transform: function transform(_ref6) {
            var one = _ref6.one;
            return _articleData(one);
        }
    });
};

//商城首页数据
var getHomeData = exports.getHomeData = function getHomeData() {
    return api.get("?do=store_index_data", {
        needTrack: true,
        transform: function transform(data) {
            var banner = data.banner, guide = data.guide, hotgoods = data.hotgoods, newgoods = data.newgoods, adsp = data.adsp, adgroup = data.adgroup, config = data.default;
            return {
                adOne: {
                    enabled: _bool(config.adsp_show),
                    items: _arr(adsp, function(item) {
                        return {
                            image: _str(item.thumb_url),
                            action: _str(item.page_url)
                        };
                    })
                },
                adGroup: {
                    enabled: _bool(config.adgroup_show),
                    items: _arr(adgroup, function(item) {
                        return {
                            image: _str(item.attrurl),
                            action: _str(item.page_url)
                        };
                    })
                },
                banner: {
                    enabled: _bool(banner.enabled),
                    height: _num(banner.banner_height, 310),
                    items: _arr(banner.items, function(item) {
                        return {
                            image: _str(item.thumb_url),
                            action: _str(item.page_url)
                        };
                    })
                },
                guide: {
                    column: _num(guide.rownum),
                    items: _arr(guide.items, function(item) {
                        return {
                            label: _str(item.title),
                            image: _str(item.thumb_url),
                            action: _str(item.page_url)
                        };
                    })
                },
                popular: {
                    enabled: _bool(hotgoods.enabled),
                    title: _str(hotgoods.title),
                    items: _arr(hotgoods.items, _commoditiesItemInfo)
                },
                new: {
                    enabled: _bool(newgoods.enabled),
                    title: _str(newgoods.title),
                    items: _arr(newgoods.items, _commoditiesItemInfo)
                }
            };
        }
    });
};

//商品顶级分类
var getCategoriesList = exports.getCategoriesList = function getCategoriesList() {
    return api.get("?do=store_category_top", {
        needTrack: true,
        transform: function transform(data) {
            if (!data) return [];
            var category = data.category;
            return _arr(category, function(item) {
                return {
                    id: _id(item.id),
                    label: _str(item.title)
                };
            });
        }
    });
};

//商品二级分类
var getCategoryDataByID = exports.getCategoryDataByID = function getCategoryDataByID(id) {
    return api.get("?do=store_category_sub", {
        needTrack: true,
        params: {
            id: id
        },
        transform: function transform(_ref7) {
            var category = _ref7.category, child_cate = _ref7.child_cate;
            return {
                id: _id(category.id),
                label: _str(category.title),
                topic: {
                    image: _str(category.adthumb_url),
                    action: ""
                },
                slogan: _str(category.intro),
                items: _arr(child_cate, function(item) {
                    return {
                        id: _id(item.id),
                        label: _str(item.title),
                        image: _str(item.thumb_url)
                    };
                })
            };
        }
    });
};

//商品搜索
var getCommoditiesListPager = exports.getCommoditiesListPager = function getCommoditiesListPager() {
    var condition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return pager.create({
        url: "?do=store_search",
        method: "GET",
        needTrack: true,
        params: {
            key: condition.keyword,
            type: condition.tag,
            id: condition.subID
        },
        transform: function transform(_ref8) {
            var list = _ref8.list;
            return _arr(list, _commoditiesItemInfo);
        }
    });
};

//商品详情
var getCommodityData = exports.getCommodityData = function getCommodityData(id) {
    return api.get("?do=store_good_detail", {
        needTrack: true,
        params: {
            id: id
        },
        transform: function transform(data) {
            var goods = data.goods;
            var optionsEnabled = _bool(goods.spec_status);
            return {
                commodityData: {
                    id: _id(goods.id),
                    images: [ goods.thumb_url ].concat(_toConsumableArray(goods.thumbs_url || [])),
                    title: _str(goods.title),
                    description: _str(goods.intro),
                    stock: _num(goods.inventory),
                    price: _price(goods.price_format),
                    priceStr: _priceStr(goods.price_format),
                    unit: _str(goods.unit),
                    optionsData: optionsEnabled ? _arr(goods.goods_options, function(item) {
                        return {
                            id: _id(item.id),
                            assemble: _str(item.assemble),
                            stock: _num(item.inventory),
                            price: _price(item.price_format),
                            priceStr: _priceStr(item.price_format)
                        };
                    }) : [],
                    // [
                    // 	{id: 0, assemble:'101+201', stock: 200, price: 169, priceStr:'169.00'},
                    // 	{id: 1, assemble:'101+202', stock: 100, price: 209, priceStr:'209.00'},
                    // 	{id: 2, assemble:'102+201', stock: 0, price: 122, priceStr:'122.00'},
                    // 	{id: 3, assemble:'102+202', stock: 95, price: 150, priceStr:'150.00'}
                    // ]
                    options: optionsEnabled ? _arr(goods.spec_format, function(option) {
                        return {
                            // id: _id(option.id),
                            label: _str(option.title),
                            items: _arr(option.items, function(item) {
                                return {
                                    id: _id(item.id),
                                    label: _str(item.title),
                                    image: _str(item.thumb_url)
                                };
                            })
                        };
                    }) : []
                },
                commodityDetails: _str(goods.content),
                commodityParameters: _arr(goods.param_format, function(item) {
                    return {
                        label: _str(item.title),
                        value: _str(item.value)
                    };
                }),
                isFavorite: _bool(goods.iscollect)
            };
        }
    });
};

//商品收藏
var setCommodityFavorite = exports.setCommodityFavorite = function setCommodityFavorite(id, set) {
    return api.get("?do=store_collect", {
        needTrack: true,
        params: {
            op: "post",
            id: id,
            iscollect: _bool(set)
        }
    });
};

//已收藏商品列表
var getFavoritesListPager = exports.getFavoritesListPager = function getFavoritesListPager() {
    var condition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return pager.create({
        url: "?do=store_collect",
        method: "GET",
        needTrack: true,
        transform: function transform(_ref9) {
            var list = _ref9.list;
            return _arr(list, _commoditiesItemInfo);
        }
    });
};

//加入购物车
var addToCart = exports.addToCart = function addToCart(commodityID, number, optionsID) {
    return api.get("?do=store_cart", {
        needTrack: true,
        params: {
            op: "add",
            id: commodityID,
            count: number,
            optionsID: optionsID
        },
        transform: function transform(data) {
            return data.id;
        }
    });
};

//修改购物车项配置
var updateCartItem = exports.updateCartItem = function updateCartItem(cartItemID, _ref10) {
    var number = _ref10.number, selected = _ref10.selected;
    return api.get("?do=store_cart", {
        needTrack: true,
        params: {
            op: "update",
            id: cartItemID,
            count: number,
            checked: selected
        }
    });
};

//移除购物车项
var removeCartItem = exports.removeCartItem = function removeCartItem(cartItemID) {
    return api.get("?do=store_cart", {
        needTrack: true,
        params: {
            op: "delete",
            id: cartItemID
        }
    });
};

//购物车项全选/取消全选
var setCartItemsSelected = exports.setCartItemsSelected = function setCartItemsSelected(selected) {
    return api.get("?do=store_cart", {
        needTrack: true,
        params: {
            op: "check",
            type: selected ? "all" : "clean"
        }
    });
};

//购物车列表
var getCartItems = exports.getCartItems = function getCartItems() {
    return api.get("?do=store_cart", {
        needTrack: true,
        transform: function transform(_ref11) {
            var list = _ref11.list;
            return _arr(list, function(item) {
                var price = _price(item.goods.price_format), image = _str(item.goods.thumb_url), selectedOptionsLabel = [], selectedOptions = [], selectedOptionsID = -1;
                if (item.good_option) {
                    selectedOptionsID = _id(item.good_option.id);
                    price = _price(item.good_option.price_format);
                    _arr(item.good_option.assemble_format).forEach(function(item) {
                        var optionImage = _str(item.thumb_url);
                        if (optionImage) image = optionImage;
                        selectedOptionsLabel.push(_str(item.title));
                        selectedOptions.push(_id(item.id));
                    });
                }
                return {
                    id: _id(item.id),
                    selected: _bool(item.checked),
                    commodityID: _id(item.goods.id),
                    image: image,
                    title: _str(item.goods.title),
                    description: _str(item.goods.intro),
                    price: price,
                    priceStr: _priceStr(price),
                    number: _num(item.count),
                    stock: _num(item.goods.inventory),
                    selectedOptionsLabel: selectedOptionsLabel,
                    selectedOptions: selectedOptions,
                    selectedOptionsID: selectedOptionsID
                };
            });
        }
    });
};

//地址列表
var getAddressList = exports.getAddressList = function getAddressList() {
    return api.get("?do=store_address", {
        needTrack: true,
        transform: function transform(_ref12) {
            var list = _ref12.list;
            return _arr(list, _addressItemInfo);
        }
    });
};

//地址增改
var commitAddress = exports.commitAddress = function commitAddress(_data) {
    return api.post("?do=store_address", {
        needTrack: true,
        data: function data() {
            var region = _data.region || [];
            var pdata = {
                op: "post",
                id: _data.id,
                name: _data.name,
                mobile: _data.phone,
                province: region[0],
                city: region[1],
                area: region[2],
                address: _data.detail,
                isdefault: _data.isDefault
            };
            return _deleteUndefined(pdata);
        }
    });
};

//地址删除
var removeAddress = exports.removeAddress = function removeAddress(id) {
    return api.post("?do=store_address", {
        needTrack: true,
        data: {
            op: "delete",
            id: id
        }
    });
};

//获取优惠券供应列表
var getCouponsSupplyListPager = exports.getCouponsSupplyListPager = function getCouponsSupplyListPager() {
    return pager.create({
        url: "?do=store_coupon",
        method: "GET",
        needTrack: true,
        transform: function transform(list) {
            return _arr(list, _couponItemInfo());
        }
    });
};

//领取优惠券
var receiveCounpon = exports.receiveCounpon = function receiveCounpon(couponID) {
    return api.get("?do=store_coupon_my", {
        needTrack: true,
        params: {
            op: "add",
            id: couponID
        }
    });
};

//个人优惠券列表
var getCouponsListPager = exports.getCouponsListPager = function getCouponsListPager(type) {
    return pager.create({
        url: "?do=store_coupon_my",
        method: "GET",
        needTrack: true,
        params: {
            type: type
        },
        transform: function transform(list) {
            return _arr(list, _couponItemInfo(true));
        }
    });
};

//创建订单
var createOrder = exports.createOrder = function createOrder(orderData, buynow) {
    return api.post("?do=store_order", {
        needTrack: true,
        header: {
            "content-type": "application/json"
        },
        params: {
            op: "add"
        },
        data: function data() {
            return _deleteUndefined({
                address: orderData.addressID,
                coupon: orderData.couponID,
                cart: buynow ? 0 : 1,
                items: orderData.items
            });
        },
        transform: function transform(data) {
            return data.order_id;
        }
    });
};

//收集FormID
var commitFormID = exports.commitFormID = function commitFormID(IDs) {
    return api.post("?do=SL_save_form_id", {
        needTrack: true,
        header: {
            "content-type": "application/json"
        },
        data: function data() {
            return {
                formIDs: IDs
            };
        }
    });
};

//个人订单列表
var getOrdersListPager = exports.getOrdersListPager = function getOrdersListPager(type) {
    return pager.create({
        url: "?do=store_order",
        method: "GET",
        needTrack: true,
        params: {
            type: type === -1 ? undefined : type
        },
        transform: function transform(_ref13) {
            var order = _ref13.order;
            return _arr(order, _orderItemInfo);
        }
    });
};

//订单详情
var getOrderDetail = exports.getOrderDetail = function getOrderDetail(orderID) {
    return api.get("?do=store_order", {
        needTrack: true,
        params: {
            op: "detail",
            id: orderID
        },
        transform: function transform(_ref14) {
            var order = _ref14.order, pay = _ref14.pay;
            return {
                order: _orderItemInfo(order),
                pay: {
                    isFail: _bool(pay.code),
                    info: pay.info
                }
            };
        }
    });
};

//更新订单状态
var updateOrderStatus = exports.updateOrderStatus = function updateOrderStatus(orderID) {
    return api.get("?do=store_order", {
        needTrack: true,
        params: {
            op: "update",
            id: orderID
        },
        transform: function transform(_ref15) {
            var status = _ref15.status;
            return _num(status);
        }
    });
};

// DataTransform
function _bool(val) {
    return val == 0 ? false : !!val;
}

function _num(val) {
    var def = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    if (val === "") return def;
    val = Number(val);
    return Number.isFinite(val) && !Number.isNaN(val) ? val : def;
}

function _str(val) {
    var def = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
    return val ? String(val) : def;
}

function _arr(val) {
    var mapFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function(item) {
        return item;
    };
    return Array.isArray(val) ? val.map(mapFn) : [];
}

function _id(val, def) {
    return val === undefined ? def : String(val);
}

function _price(val) {
    if (typeof val === "number") return val;
    if (typeof val !== "string") return NaN;
    return Number(val.replace(/[^0-9\.]|/g, ""));
}

function _priceStr(val) {
    var fixed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
    var price = _price(val);
    return String(price).replace(/(\d+)\.?(\d+)?/, function(full, int, dec) {
        dec = (dec || "").padEnd(fixed, "0");
        return int + "." + dec;
    });
}

function _colorHex(val, def) {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(val) ? val : def;
}

function _deleteUndefined(obj) {
    for (var key in obj) {
        if (obj[key] === undefined) delete obj[key];
    }
    return obj;
}

function _commoditiesItemInfo(item) {
    return {
        id: _id(item.id),
        image: _str(item.thumb_url),
        title: _str(item.title),
        description: _str(item.intro),
        price: _price(item.price_format),
        priceStr: _priceStr(item.price_format)
    };
}

function _couponItemInfo(realTime) {
    return function(item) {
        var minConsumption = _num(item.enough), isDiscount = item.backtype == 1, faceValue = isDiscount ? _num(item.discount) : _price(item.backmoney_format), title = isDiscount ? (minConsumption === 0 ? "" : "满" + minConsumption) + "以原价的" + faceValue * 10 + "%支付" : (minConsumption === 0 ? "立" : "满" + minConsumption) + "减" + faceValue + "元", flag = _str(item.title), deadline = realTime ? item.use_end_time : item.timelimit == 0 ? _str(item.timedays1) === "0" ? "无使用期限制" : "获得后" + item.timedays1 + "天内有效" : item.timestart + " - " + item.timeend;
        return {
            id: _id(item.id),
            isDiscount: isDiscount,
            flag: flag,
            title: title,
            faceValue: faceValue,
            faceUnit: isDiscount ? "折" : "元",
            minConsumption: minConsumption,
            multiplication: isDiscount ? faceValue / 10 : 1,
            addition: isDiscount ? 0 : -faceValue,
            detail: _str(item.intro),
            deadline: deadline,
            fullName: "[" + flag + "] " + title,
            over: _num(item.total),
            received: _bool(item.isreceive),
            available: _bool(item.usable)
        };
    };
}

function _buyItemInfo(buyItem) {
    var image = _str(buyItem.thumb_url), selectedOptionsLabel = [], selectedOptions = [], selectedOptionsID = -1;
    if (buyItem.option) {
        selectedOptionsID = _id(buyItem.option.id);
        _arr(buyItem.option.assemble_array).forEach(function(item) {
            var optionImage = _str(item.thumb_url);
            if (optionImage) image = optionImage;
            selectedOptionsLabel.push(_str(item.title));
            selectedOptions.push(_id(item.id));
        });
    }
    return {
        id: _id(buyItem.id),
        image: image,
        title: _str(buyItem.title),
        description: _str(buyItem.intro),
        price: _price(buyItem.price_format),
        priceStr: _priceStr(buyItem.price_format),
        number: _num(buyItem.number),
        selectedOptionsLabel: selectedOptionsLabel,
        selectedOptions: selectedOptions,
        selectedOptionsID: selectedOptionsID
    };
}

function _orderItemInfo(order) {
    return {
        id: _id(order.id),
        status: _num(order.status),
        orderSN: _str(order.ordersn),
        buyList: _arr(order.goods, _buyItemInfo),
        buyItemsLength: _num(order.total),
        totalPrice: _priceStr(order.originalprice_format),
        offer: _price(order.discount_money_format),
        offerStr: _priceStr(order.discount_money_format),
        finalPrice: _priceStr(order.price_format),
        createTime: _str(order.addtime),
        address: order.address ? _addressItemInfo(order.address) : {},
        coupon: order.coupon ? _couponItemInfo()(order.coupon) : null
    };
}

function _addressItemInfo(item) {
    return {
        id: _id(item.id),
        name: _str(item.realname),
        phone: _str(item.mobile),
        region: [ _str(item.province), _str(item.city), _str(item.area) ],
        detail: _str(item.address),
        isDefault: _bool(item.isdefault)
    };
}