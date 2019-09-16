Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.throttling = throttling;

exports.px2rpx = px2rpx;

exports.rpx2px = rpx2px;

exports.urlNormalize = urlNormalize;

exports.urlParser = urlParser;

exports.matchUrl = matchUrl;

exports.queryStringToOptions = queryStringToOptions;

exports.optionsToQueryString = optionsToQueryString;

exports.hexToRgb = hexToRgb;

exports.rgbToHsl = rgbToHsl;

exports.getLightness = getLightness;

exports.darkOrLight = darkOrLight;

exports.getImageInfo = getImageInfo;

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

function throttling(fn, time) {
    var task = void 0;
    return function() {
        clearTimeout(task);
        task = setTimeout(fn, time);
    };
}

var windowWidth = wx.getSystemInfoSync().windowWidth;

function px2rpx(px) {
    return px * (750 / windowWidth);
}

function rpx2px(rpx) {
    return rpx / 750 * windowWidth;
}

function urlNormalize(url) {
    if (url.match(/^(>|\^)/)) {
        //将简写URL转为标准URL
        return url.replace(/^([^?]+)(\?.*)?$/, function(full, pureUrl, queryString) {
            var sUrl = pureUrl.substring(1);
            pureUrl = "/pages/" + sUrl + "/" + sUrl;
            return pureUrl + (queryString ? queryString : "");
        });
    }
    return url;
}

function urlParser(url, assignOptions) {
    url = urlNormalize(url);
    var queryIndex = url.indexOf("?"), pureUrl = url.substr(0, queryIndex), options = {};
    if (queryIndex > -1) {
        options = queryStringToOptions(url.substring(queryIndex));
    } else {
        pureUrl = url;
    }
    if (assignOptions) {
        Object.assign(options, assignOptions);
        url = pureUrl + optionsToQueryString(options);
    }
    return {
        url: url,
        pureUrl: pureUrl,
        options: options
    };
}

function matchUrl(urlA, urlB) {
    return urlParser(urlA).pureUrl === urlParser(urlB).pureUrl;
}

function queryStringToOptions(str) {
    var match = void 0, search = /([^&=]+)=?([^&]*)/g, query = str.substring(1), urlParams = {};
    while (match = search.exec(query)) {
        urlParams[match[1]] = match[2];
    }
    return urlParams;
}

function optionsToQueryString(options) {
    var args = Object.keys(options).filter(function(key) {
        return options[key] != null;
    }).map(function(key) {
        return key + "=" + options[key];
    }).join("&");
    return args ? "?" + args : "";
}

function hexToRgb(hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [ parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16) ] : null;
}

function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if (max == min) {
        h = s = 0;
    } else {
        var d = max - min;
        s = l > .5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;

          case g:
            h = (b - r) / d + 2;
            break;

          case b:
            h = (r - g) / d + 4;
            break;
        }
        h /= 6;
    }
    return [ h, s, l ];
}

function getLightness(hex) {
    return rgbToHsl.apply(undefined, _toConsumableArray(hexToRgb(hex)))[2];
}

function darkOrLight(hex) {
    var threshold = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : .7;
    var reverse = arguments[2];
    var values = [ "dark", "light" ];
    if (reverse) values.reverse();
    return rgbToHsl.apply(undefined, _toConsumableArray(hexToRgb(hex)))[2] < threshold ? values[0] : values[1];
}

function getImageInfo(inputPath) {
    return new Promise(function(resolve, reject) {
        wx.getImageInfo({
            src: inputPath,
            success: function success(_ref) {
                var width = _ref.width, height = _ref.height, path = _ref.path;
                if (!path.match(/^[aA-zZ]+:\/\//)) {
                    path = inputPath;
                }
                resolve({
                    width: width,
                    height: height,
                    path: path
                });
            },
            fail: function fail(_ref2) {
                var errMsg = _ref2.errMsg;
                reject(errMsg + " (" + inputPath + ")");
            }
        });
    });
}