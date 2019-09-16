Object.defineProperty(exports, "__esModule", {
    value: true
});

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

// fork https://github.com/ghjagus/wx-mixin/blob/master/utils/createPage.js
// Maverick: 增加addMixins参数，为PAGE_EVENT添加onSmartToHere
/**
 * 提供mixin
 */ var isFunction = function isFunction(v) {
    return typeof v === "function";
};

// 借鉴redux https://github.com/reactjs/redux
function compose() {
    for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
        funcs[_key] = arguments[_key];
    }
    if (funcs.length === 0) {
        return function(arg) {
            return arg;
        };
    }
    if (funcs.length === 1) {
        return funcs[0];
    }
    var last = funcs[funcs.length - 1];
    var rest = funcs.slice(0, -1);
    return function() {
        return rest.reduceRight(function(composed, f) {
            return f(composed);
        }, last.apply(undefined, arguments));
    };
}

var PAGE_EVENT = [ "onLoad", "onReady", "onShow", "onHide", "onUnload", "onPullDownRefresh", "onReachBottom", "onShareAppMessage", "onSmartToHere" ];

var getMixinData = function getMixinData(mixins) {
    var ret = {};
    mixins.forEach(function(mixin) {
        var _mixin$data = mixin.data, data = _mixin$data === undefined ? {} : _mixin$data;
        Object.keys(data).forEach(function(key) {
            ret[key] = data[key];
        });
    });
    return ret;
};

var getMixinMethods = function getMixinMethods(mixins) {
    var ret = {};
    mixins.forEach(function(mixin) {
        var _mixin$methods = mixin.methods, methods = _mixin$methods === undefined ? {} : _mixin$methods;
        // 提取methods
                Object.keys(methods).forEach(function(key) {
            if (isFunction(methods[key])) {
                ret[key] = methods[key];
            }
        });
        // 提取lifecycle
                PAGE_EVENT.forEach(function(key) {
            if (isFunction(mixin[key])) {
                if (ret[key]) {
                    // 多个mixin有相同lifecycle时，将方法转为数组存储
                    ret[key] = ret[key].concat(mixin[key]);
                } else {
                    ret[key] = [ mixin[key] ];
                }
            }
        });
    });
    return ret;
};

/**
 * 重复冲突处理借鉴vue:
 * data, methods会合并，组件自身具有最高优先级，其次mixins中后配置的mixin优先级较高
 * lifecycle不会合并。先顺序执行mixins中的lifecycle，再执行组件自身的lifecycle
 */ var mixData = function mixData(minxinData, nativeData) {
    Object.keys(minxinData).forEach(function(key) {
        // page中定义的data不会被覆盖
        if (nativeData[key] === undefined) {
            nativeData[key] = minxinData[key];
        }
    });
    return nativeData;
};

var mixMethods = function mixMethods(mixinMethods, pageConf) {
    Object.keys(mixinMethods).forEach(function(key) {
        // lifecycle方法
        if (PAGE_EVENT.includes(key)) {
            var methodsList = mixinMethods[key];
            if (isFunction(pageConf[key])) {
                methodsList.push(pageConf[key]);
            }
            pageConf[key] = function() {
                return function() {
                    var _this = this;
                    return compose.apply(undefined, _toConsumableArray(methodsList.reverse().map(function(f) {
                        return f.bind(_this);
                    }))).apply(undefined, arguments);
                };
            }();
        }
        // 普通方法
         else {
            if (pageConf[key] == null) {
                pageConf[key] = mixinMethods[key];
            }
        }
    });
    return pageConf;
};

exports.default = function(pageConf) {
    var addMixins = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var _pageConf = pageConf, _pageConf$mixins = _pageConf.mixins, mixins = _pageConf$mixins === undefined ? [] : _pageConf$mixins;
    mixins.unshift.apply(mixins, _toConsumableArray(addMixins));
    var nativeData = pageConf.data || {};
    var minxinData = getMixinData(mixins);
    var mixinMethods = getMixinMethods(mixins);
    Object.assign(pageConf, {
        data: mixData(minxinData, nativeData)
    });
    pageConf = mixMethods(mixinMethods, pageConf);
    return pageConf;
};