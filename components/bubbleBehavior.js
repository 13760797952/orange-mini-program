var _slicedToArray = function() {
    function sliceIterator(arr, i) {
        var _arr = [];
        var _n = true;
        var _d = false;
        var _e = undefined;
        try {
            for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                _arr.push(_s.value);
                if (i && _arr.length === i) break;
            }
        } catch (err) {
            _d = true;
            _e = err;
        } finally {
            try {
                if (!_n && _i["return"]) _i["return"]();
            } finally {
                if (_d) throw _e;
            }
        }
        return _arr;
    }
    return function(arr, i) {
        if (Array.isArray(arr)) {
            return arr;
        } else if (Symbol.iterator in Object(arr)) {
            return sliceIterator(arr, i);
        } else {
            throw new TypeError("Invalid attempt to destructure non-iterable instance");
        }
    };
}();

var _commonBehavior = require("./commonBehavior");

var _commonBehavior2 = _interopRequireDefault(_commonBehavior);

var _utils = require("../lib/utils");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

var app = getApp();

module.exports = Behavior({
    behaviors: [ _commonBehavior2.default ],
    properties: {
        adhesion: {
            type: String,
            value: "x"
        },
        margins: {
            type: Object,
            //边界距离
            value: {
                left: 20,
                right: 20,
                top: 90,
                bottom: 110
            }
        }
    },
    data: {
        x: 1e3,
        y: 500,
        transition: false,
        nearTop: false,
        nearBottom: false,
        enabled: false
    },
    pageLifetimes: {
        show: function show() {
            if (!this.data.enabled) return;
            this.getPosition();
        }
    },
    attached: function attached() {
        if (app.adapt.iPhoneX) this.setData({
            "margins.bottom": this.data.margins.bottom + 68
        });
        this.getPosition();
    },
    ready: function ready() {
        if (!this.data.enabled) return;
        this.limit();
        this.setData({
            isReady: true
        });
    },
    methods: {
        getPositionFail: function getPositionFail() {
            return;
        },
        tap: function tap() {
            return;
        },
        getPosition: function getPosition() {
            var _this = this;
            var bubbleName = this.data.bubbleName;
            if (bubbleName) {
                wx.getStorage({
                    key: bubbleName + "-position",
                    success: function success(_ref) {
                        var data = _ref.data;
                        data && _this.setData({
                            x: data.x,
                            y: data.y,
                            transition: false
                        });
                        wx.nextTick(function() {
                            return _this.limit();
                        });
                    },
                    fail: function fail() {
                        _this.getPositionFail();
                    }
                });
            }
        },
        savePosition: function savePosition() {
            var _data = this.data, bubbleName = _data.bubbleName, x = _data.x, y = _data.y;
            if (bubbleName) wx.setStorage({
                key: bubbleName + "-position",
                data: {
                    x: x,
                    y: y
                }
            });
        },
        touchStart: function touchStart(_ref2) {
            var timeStamp = _ref2.timeStamp, touches = _ref2.touches;
            this._startTime = timeStamp;
            this._isDrag = true;
            var _touches$ = touches[0], clientX = _touches$.clientX, clientY = _touches$.clientY;
            this._startX = clientX;
            this._startY = clientY;
            this._oriX = this.data.x;
            this._oriY = this.data.y;
            this.setData({
                transition: false
            });
        },
        touchMove: function touchMove(_ref3) {
            var touches = _ref3.touches;
            if (!this._isDrag) return;
            var _touches$2 = touches[0], clientX = _touches$2.clientX, clientY = _touches$2.clientY, offsetX = clientX - this._startX, offsetY = clientY - this._startY;
            if (this._isMove || (this._isMove = Math.abs(offsetX) > 5 || Math.abs(offsetY) > 5)) {
                this.setData({
                    x: this._oriX + offsetX,
                    y: this._oriY + offsetY,
                    expand: false
                });
            }
        },
        touchEnd: function touchEnd(_ref4) {
            var timeStamp = _ref4.timeStamp, touches = _ref4.touches;
            if (!this._isMove && timeStamp - this._startTime < 300) this.tap();
            this._isMove = this._isDrag = false;
            this.limit(true);
        },
        limit: function limit() {
            var _this2 = this;
            var transition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
            var query = wx.createSelectorQuery().in(this);
            query.selectViewport().boundingClientRect();
            query.select("._shortcut-bubble-wrap").boundingClientRect();
            query.exec(function(_ref5) {
                var _ref6 = _slicedToArray(_ref5, 2), viewport = _ref6[0], bubble = _ref6[1];
                try {
                    var height = viewport.height, width = viewport.width, top = bubble.top, bottom = bubble.bottom, left = bubble.left, right = bubble.right, bubbleWidth = bubble.width, bubbleHeight = bubble.height, _data2 = _this2.data, margins = _data2.margins, x = _data2.x, y = _data2.y, bound = {
                        top: (0, _utils.rpx2px)(margins.top),
                        bottom: height - (0, _utils.rpx2px)(margins.bottom),
                        left: (0, _utils.rpx2px)(margins.left),
                        right: width - (0, _utils.rpx2px)(margins.right)
                    };
                    if (bound.top > top) y += bound.top - top;
                    if (bound.bottom < bottom) y -= bottom - bound.bottom;
                    if (bound.left > left) x += bound.left - left;
                    if (bound.right < right) x -= right - bound.right;
                    var distanceTop = y - bound.top, distanceBottom = bound.bottom - y, distanceLeft = x - bound.left, distanceRight = bound.right - x, nearTop = distanceTop < distanceBottom, nearLeft = distanceLeft < distanceRight;
                    if (_this2.data.adhesion.indexOf("x") > -1) x = nearLeft ? bound.left : bound.right - bubbleWidth;
                    if (_this2.data.adhesion.indexOf("y") > -1) y = nearTop ? bound.top : bound.bottom - bubbleHeight;
                    _this2.setData({
                        x: x,
                        y: y,
                        transition: transition,
                        nearTop: nearTop,
                        nearLeft: nearLeft
                    });
                    _this2.savePosition();
                } catch (e) {}
            });
        }
    }
});