Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.getCategoriesList = getCategoriesList;

exports.getCategoryDataByID = getCategoryDataByID;

exports.getCartItems = getCartItems;

exports.addToCart = addToCart;

exports.updateCartItem = updateCartItem;

exports.removeCartItem = removeCartItem;

exports.removeCartItemsLocal = removeCartItemsLocal;

var _site = require("../api/site");

var siteAPI = _interopRequireWildcard(_site);

function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {};
        if (obj != null) {
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
            }
        }
        newObj.default = obj;
        return newObj;
    }
}

var store = {
    categories: [],
    categoryData: {},
    cartItems: []
};

function getCategoriesList() {
    return siteAPI.getCategoriesList().then(function(list) {
        return store.categories = list;
    });
}

function getCategoryDataByID(id) {
    return new Promise(function(resolve, reject) {
        var cacheData = store.categoryData[id];
        if (cacheData) {
            resolve(cacheData);
        } else {
            siteAPI.getCategoryDataByID(id).then(function(data) {
                resolve(store.categoryData[id] = data);
            }, reject);
        }
    });
}

function getCartItems(ignoreCache) {
    if (!ignoreCache && store.cartItems.length) {
        return Promise.resolve(store.cartItems);
    } else {
        return siteAPI.getCartItems().then(function(list) {
            return store.cartItems = list;
        });
    }
}

function addToCart(buyData) {
    try {
        buyData = JSON.parse(JSON.stringify(buyData));
        var sameItem = store.cartItems.find(function(item) {
            return item.commodityID == buyData.commodityID && item.selectedOptionsID === buyData.selectedOptionsID;
        }), isOverflow = false, success = function success() {
            wx.showToast({
                title: isOverflow ? "数量超出库存" : "已加入购物车",
                icon: isOverflow ? "none" : "success",
                duration: 1500
            });
            return store.cartItems;
        }, error = function error(err) {
            err = err.toString();
            wx.showToast({
                title: "加入购物车失败:" + err,
                icon: "none",
                duration: 2e3
            });
            return Promise.reject(err);
        };
        if (sameItem) {
            var setNumber = sameItem.number + buyData.number;
            isOverflow = setNumber > sameItem.stock;
            if (isOverflow) setNumber = sameItem.stock;
            return siteAPI.updateCartItem(sameItem.id, {
                number: setNumber
            }).then(function(res) {
                sameItem.number = setNumber;
            }).then(success, error);
        } else {
            return siteAPI.addToCart(buyData.commodityID, buyData.number, buyData.selectedOptionsID).then(function(cartItemID) {
                store.cartItems.push(Object.assign({
                    selected: true,
                    commodityID: undefined,
                    image: "",
                    title: "",
                    description: "",
                    price: 0,
                    number: 0,
                    stock: undefined,
                    selectedOptionsTip: "",
                    selectedOptionsLabel: [],
                    selectedOptions: [],
                    selectedOptionsID: -1
                }, buyData, {
                    id: cartItemID
                }));
            }).then(success, error);
        }
    } catch (e) {
        return Promise.reject(e.toString());
    }
}

function updateCartItem(cartItemID, _ref) {
    var number = _ref.number, selected = _ref.selected;
    siteAPI.updateCartItem(cartItemID, {
        number: number,
        selected: selected
    }).then(function(res) {
        var sameItem = store.cartItems.find(function(item) {
            return item.id == cartItemID;
        });
        if (sameItem) {
            if (number !== undefined) sameItem.number = number;
            if (selected !== undefined) sameItem.selected = selected;
        }
    });
}

function removeCartItem(cartItemID) {
    return siteAPI.removeCartItem(cartItemID).then(function(res) {
        removeCartItemsLocal([ cartItemID ]);
        return store.cartItems;
    });
}

function removeCartItemsLocal(cartItemIDs) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;
    try {
        var _loop = function _loop() {
            var id = _step.value;
            var targetIndex = store.cartItems.findIndex(function(item) {
                return item.id == id;
            });
            if (targetIndex !== -1) store.cartItems.splice(targetIndex, 1);
        };
        for (var _iterator = cartItemIDs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            _loop();
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
}