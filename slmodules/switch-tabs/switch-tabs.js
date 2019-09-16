var app = getApp();

Component({
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
                var index = this.data.items.findIndex(function(item) {
                    return item.id == newID;
                });
                this.triggerEvent("change", {
                    value: newID,
                    index: index
                });
            }
        },
        nameKey: {
            type: String,
            value: "name"
        }
    },
    data: {
        indicatorGroup: {},
        activeColor: "",
        isFirst: true
    },
    ready: function ready() {
        var _this = this;
        this._isReady = true;
        this.update();
        var setInt = setInterval(function() {
            if (app.sys) {
                _this.setData({
                    activeColor: app.sys.color.maincolor
                });
                clearInterval(setInt);
            }
        }, 100);
    },
    detached: function detached() {
        clearTimeout(this._readyTimeout);
    },
    methods: {
        targetDataSet: function targetDataSet(_ref) {
            var currentTarget = _ref.currentTarget;
            this.setData(currentTarget.dataset);
        },
        update: function update() {
            var _this2 = this;
            this._readyTimeout = setTimeout(function() {
                if (!_this2._isReady) return false;
                var query = wx.createSelectorQuery().in(_this2);
                query.select("._switch-tabs-items-box").boundingClientRect();
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;
                try {
                    for (var _iterator = _this2.data.items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
                        var _res$shift = res.shift(), wrapTop = _res$shift.top, wrapLeft = _res$shift.left, indicatorGroup = {}, isVertical = _this2.data.vertical;
                        res.forEach(function(item, index) {
                            var id = _this2.data.items[index].id;
                            indicatorGroup[id] = isVertical ? "height:" + item.height + "px; transform:translate3D(0," + (item.top - wrapTop) + "px,0);" : "width:" + item.width + "px; transform:translate3D(" + (item.left - wrapLeft) + "px,0,0);";
                        });
                        _this2.setData({
                            indicatorGroup: indicatorGroup,
                            current: _this2.data.current
                        });
                        _this2.setData({
                            isFirst: false
                        });
                    } catch (e) {}
                });
            }, 100);
        }
    }
});