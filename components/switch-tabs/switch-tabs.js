var _commonBehavior = require("../commonBehavior");

var _commonBehavior2 = _interopRequireDefault(_commonBehavior);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

Component({
    behaviors: [ _commonBehavior2.default ],
    options: {
        addGlobalClass: true
    },
    properties: {
        scroll: Boolean,
        vertical: Boolean,
        items: {
            type: Array,
            value: [],
            observer: "update"
        },
        current: {
            type: null,
            observer: function observer(newID, oldID) {
                if (newID === oldID) return;
                this.triggerEvent("change", {
                    value: newID,
                    newID: newID,
                    oldID: oldID
                });
            }
        }
    },
    data: {
        indicatorGroup: {}
    },
    ready: function ready() {
        this._isReady = true;
        this.update();
    },
    detached: function detached() {
        clearTimeout(this._readyTimeout);
    },
    methods: {
        update: function update() {
            var _this = this;
            this._readyTimeout = setTimeout(function() {
                if (!_this._isReady) return false;
                var query = wx.createSelectorQuery().in(_this);
                query.select("._switch-tabs-items-box").boundingClientRect();
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;
                try {
                    for (var _iterator = _this.data.items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var item = _step.value;
                        query.select("#_switch-tabs-item_" + item.id).boundingClientRect();
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
                query.exec(function(res) {
                    try {
                        var _res$shift = res.shift(), wrapTop = _res$shift.top, wrapLeft = _res$shift.left, indicatorGroup = {}, isVertical = _this.data.vertical;
                        res.forEach(function(item, index) {
                            var id = _this.data.items[index].id;
                            indicatorGroup[id] = isVertical ? "height:" + item.height + "px; transform:translate3D(0," + (item.top - wrapTop) + "px,0);" : "width:" + item.width + "px; transform:translate3D(" + (item.left - wrapLeft) + "px,0,0);";
                        });
                        _this.setData({
                            indicatorGroup: indicatorGroup,
                            current: _this.data.current
                        });
                    } catch (e) {}
                });
            }, 100);
        }
    }
});