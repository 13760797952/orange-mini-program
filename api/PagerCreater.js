Object.defineProperty(exports, "__esModule", {
    value: true
});

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

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var Pager = exports.Pager = function() {
    function Pager(requestCreater, cfgCreater, requestConfig) {
        var per = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;
        var firstPage = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
        _classCallCheck(this, Pager);
        Object.assign(this, {
            requestCreater: requestCreater,
            cfgCreater: cfgCreater,
            requestConfig: requestConfig,
            per: per,
            firstPage: firstPage
        });
        this.pageList = null;
        this.nextPending = false;
        this.completed = false;
        this.lastUpdateTime = {};
        this.pendingPromise = {};
    }
    _createClass(Pager, [ {
        key: "getAllItems",
        value: function getAllItems() {
            var items = [];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;
            try {
                for (var _iterator = this.pageList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var page = _step.value;
                    Array.isArray(page) && items.push.apply(items, _toConsumableArray(page));
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
            return items;
        }
    }, {
        key: "load",
        value: function load(reLoad, output) {
            if (reLoad || !this.pageList) {
                return this.returnPage(this.firstPage, output);
            } else {
                var outputList = this.getAllItems();
                return Promise.resolve(output ? outputList : {
                    list: outputList,
                    addList: [],
                    completed: this.completed
                });
            }
        }
    }, {
        key: "next",
        value: function next() {
            var _this = this;
            if (this.nextPending) return Promise.reject({
                state: "loading"
            });
            if (this.completed) return Promise.reject({
                state: "completed"
            });
            this.nextPending = true;
            return this.returnPage(this.pageList.length).finally(function() {
                _this.nextPending = false;
            });
        }
    }, {
        key: "returnPage",
        value: function returnPage(page, output) {
            var _this2 = this;
            return this.request(page).then(function(addList) {
                var isCompleted = addList.length < _this2.per;
                _this2.completed = isCompleted;
                _this2.pageList.length = page + _this2.firstPage;
                var outputList = _this2.getAllItems();
                return output ? outputList : {
                    list: outputList,
                    addList: addList,
                    completed: _this2.completed
                };
            }, function(errMsg) {
                return Promise.reject(output ? errMsg : {
                    state: "error",
                    errMsg: errMsg
                });
            });
        }
    }, {
        key: "request",
        value: function request(page) {
            var _this3 = this;
            var cfg = this.cfgCreater(this.requestConfig, page) || this.requestConfig;
            var requestPromise = this.requestCreater(cfg);
            this.pendingPromise[page] = requestPromise;
            return requestPromise.then(function(addList) {
                _this3.lastUpdateTime[page] = new Date().getTime();
                if (!_this3.pageList) _this3.pageList = [];
                _this3.pageList[page] = addList;
                return addList;
            }).finally(function() {
                _this3.pendingPromise[page] = null;
            });
        }
    }, {
        key: "silentUpdate",
        value: function silentUpdate() {
            var _this4 = this;
            var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function() {};
            var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 12e4;
            if (!this.pageList) return;
            var hasUpdate = false;
            var done = function done() {
                hasUpdate && callback(_this4.getAllItems());
            };
            var loop = function loop(current) {
                if (current > _this4.pageList.length - 1) return done();
                var needUpdate = !_this4.lastUpdateTime[current] || new Date().getTime() - _this4.lastUpdateTime[current] > time, p = needUpdate ? _this4.request(current) : _this4.pendingPromise[current] || Promise.resolve(_this4.pageList[current]);
                if (needUpdate) hasUpdate = true;
                p.then(function(addList) {
                    if (addList.length >= _this4.per) {
                        loop(++current);
                    } else {
                        _this4.completed = true;
                        _this4.pageList.length = current + _this4.firstPage;
                        done();
                    }
                }, function() {
                    loop(++current);
                });
            };
            loop(this.firstPage);
        }
    } ]);
    return Pager;
}();

var PagerCreater = function() {
    function PagerCreater(_ref) {
        var requestCreater = _ref.requestCreater, cfgCreater = _ref.cfgCreater, _ref$per = _ref.per, per = _ref$per === undefined ? 10 : _ref$per, _ref$firstPage = _ref.firstPage, firstPage = _ref$firstPage === undefined ? 1 : _ref$firstPage;
        _classCallCheck(this, PagerCreater);
        Object.assign(this, {
            requestCreater: requestCreater,
            cfgCreater: cfgCreater,
            per: per,
            firstPage: firstPage
        });
    }
    _createClass(PagerCreater, [ {
        key: "create",
        value: function create(requestConfig) {
            var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}, _ref2$per = _ref2.per, per = _ref2$per === undefined ? this.per : _ref2$per, _ref2$firstPage = _ref2.firstPage, firstPage = _ref2$firstPage === undefined ? this.firstPage : _ref2$firstPage;
            return new Pager(this.requestCreater, this.cfgCreater, requestConfig, per, firstPage);
        }
    } ]);
    return PagerCreater;
}();

exports.default = PagerCreater;