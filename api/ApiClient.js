Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
    return typeof obj;
} : function(obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var _createClass = function() {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function(Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var ApiClient = function() {
    function ApiClient() {
        var defaultConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var interceptor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        _classCallCheck(this, ApiClient);
        Object.assign(this, {
            defaultConfig: defaultConfig,
            interceptor: interceptor
        });
    }
    _createClass(ApiClient, [ {
        key: "request",
        value: function request(url) {
            var _this = this;
            var cfg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            return new Promise(function(resolve, reject) {
                try {
                    var requestInterceptor = _this.interceptor.request;
                    var responseInterceptor = _this.interceptor.response;
                    var config = Object.assign({
                        url: url,
                        header: {},
                        params: {},
                        data: {}
                    }, _this.defaultConfig, cfg);
                    if (requestInterceptor) requestInterceptor(config);
                    var params = Object.assign({}, _this.defaultConfig.params, config.params);
                    if (config.baseURL && !isAbsoluteURL(config.url)) config.url = combineURLs(config.baseURL, config.url);
                    config.url = buildURL(config.url, params);
                    var requestConfig = {
                        success: function success(response) {
                            try {
                                var resolveData = responseInterceptor ? responseInterceptor(response) : response;
                                if (config.transform) try {
                                    resolveData = config.transform(resolveData);
                                } catch (e) {
                                    throw "[Data Transform Error] " + e;
                                }
                                resolve(resolveData);
                            } catch (e) {
                                reject(e ? e.toString() : e);
                            }
                        },
                        fail: function fail(_ref) {
                            var errMsg = _ref.errMsg;
                            if (errMsg === "request:fail url not in domain list") {
                                errMsg = "\n" + extractDomain(config.url) + "\n不在request合法域名列表中，请到微信公众号平台-登录小程序账户密码-进入小程序后台-开发-开发设置-服务器域名";
                            } else if (errMsg === "request:fail timeout") {
                                errMsg = "请求超时";
                            }
                            reject(errMsg);
                        }
                    };
                    var _arr = [ "url", "data", "header", "method", "dataType", "responseType" ];
                    for (var _i = 0; _i < _arr.length; _i++) {
                        var key = _arr[_i];
                        var val = config[key];
                        if (val) requestConfig[key] = val;
                    }
                    wx.request(requestConfig);
                } catch (e) {
                    reject(e ? e.toString() : e);
                }
            });
        }
    }, {
        key: "get",
        value: function get(url, cfg) {
            return this.request(url, Object.assign({}, cfg, {
                method: "GET"
            }));
        }
    }, {
        key: "post",
        value: function post(url, cfg) {
            return this.request(url, Object.assign({}, cfg, {
                method: "POST"
            }));
        }
    } ]);
    return ApiClient;
}();

exports.default = ApiClient;

function extractDomain(url) {
    var hostname = void 0;
    if (url.indexOf("//") > -1) {
        hostname = url.split("/").slice(0, 3).join("/");
    } else {
        hostname = url.split("/")[0];
    }
    return hostname.split("?")[0];
}

/*fork https://github.com/axios/axios*/ function isAbsoluteURL(url) {
    return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
}

function combineURLs(baseURL, relativeURL) {
    return relativeURL ? baseURL.replace(/\/+$/, "") + (relativeURL.startsWith("?") ? "" : "/") + relativeURL.replace(/^\/+/, "") : baseURL;
}

function encode(val) {
    return encodeURIComponent(val).replace(/%40/gi, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
}

function forEach(obj, fn) {
    if (obj === null || typeof obj === "undefined") return;
    if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) !== "object") obj = [ obj ];
    if (Array.isArray(obj)) {
        for (var i = 0, l = obj.length; i < l; i++) {
            fn.call(null, obj[i], i, obj);
        }
    } else {
        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                fn.call(null, obj[key], key, obj);
            }
        }
    }
}

function buildURL(url, params) {
    if (!params) return url;
    var serializedParams = void 0, parts = [];
    forEach(params, function serialize(val, key) {
        if (val === null || typeof val === "undefined") return;
        if (Array.isArray(val)) {
            key = key + "[]";
        } else {
            val = [ val ];
        }
        forEach(val, function parseValue(v) {
            if (v instanceof Date) {
                v = v.toISOString();
            } else if (v !== null && (typeof v === "undefined" ? "undefined" : _typeof(v)) === "object") {
                v = JSON.stringify(v);
            }
            parts.push(encode(key) + "=" + encode(v));
        });
    });
    serializedParams = parts.join("&");
    if (serializedParams) {
        var hashmarkIndex = url.indexOf("#");
        if (hashmarkIndex !== -1) url = url.slice(0, hashmarkIndex);
        url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
    }
    return url;
}