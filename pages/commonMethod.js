Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.onShareAppMessage = onShareAppMessage;

exports.targetDataSet = targetDataSet;

exports.targetActionRun = targetActionRun;

exports.setDataByOptions = setDataByOptions;

exports.autoSetPagerStatusView = autoSetPagerStatusView;

exports.autoSetStatusView = autoSetStatusView;

exports.autoSetPagerLoading = autoSetPagerLoading;

exports.stopPropagation = stopPropagation;

var _utils = require("../lib/utils");

var app = getApp();

function onShareAppMessage() {
    var shareConfig = this.allowShare instanceof Object ? this.allowShare : {}, title = shareConfig.title || this.title || app.config.defaultTitle, url = shareConfig.url || app.getCurrentPageUrl(this, true), config = {
        title: title,
        path: (0, _utils.urlParser)(">index", {
            url: encodeURIComponent(url)
        }).url,
        success: shareConfig.success,
        fail: shareConfig.fail,
        complete: shareConfig.shareConfig
    };
    console.log(config);
    return config;
}

function targetDataSet(_ref) {
    var currentTarget = _ref.currentTarget;
    this.setData(currentTarget.dataset);
}

function targetActionRun(_ref2) {
    var currentTarget = _ref2.currentTarget;
    var _currentTarget$datase = currentTarget.dataset, action = _currentTarget$datase.action, actionValue = _currentTarget$datase.actionValue;
    app.actionRun(action, actionValue);
    return {
        action: action,
        value: actionValue
    };
}

function setDataByOptions(accept, options) {
    /*通过options调用setData
      accept接受一个数组，由需要设置的键名或单键对象组成，其中对象作为键值映射表，例：
      accept为['id','page']时，表示将options中的id键及page键的值分别赋值给data中同名的键
      accept为[{currentID:'id'},'page']时，表示将options.id赋值给data.currentID，options.page赋值给data.page
    */
    if (!options) return;
    var set = {};
    var keyMap = {};
    var acceptKey = accept.map(function(v) {
        var key = v;
        if (v instanceof Object) {
            var dataKey = Object.keys(v)[0];
            key = v[dataKey];
            keyMap[key] = dataKey;
        }
        return key;
    });
    Object.keys(options).forEach(function(key) {
        if (!acceptKey.includes(key) || options[key] === undefined) return;
        set[keyMap[key] || key] = options[key];
    });
    this.setData(set);
}

function autoSetPagerStatusView(promise, setNavigationBarLoading) {
    if (!(promise instanceof Promise)) return;
    return this.autoSetStatusView(this.autoSetPagerLoading(promise).then(function(res) {
        return res.list;
    }, function(err) {
        return Promise.reject(err.errMsg);
    }), setNavigationBarLoading);
}

function autoSetStatusView(promise, setNavigationBarLoading) {
    var _this = this;
    if (!(promise instanceof Promise)) promise = Promise.resolve(promise);
    if (setNavigationBarLoading) wx.showNavigationBarLoading();
    this.setData({
        statusViewState: "loading"
    });
    this._autoSetStatusViewPromise = promise;
    promise.then(function(data) {
        if (_this._autoSetStatusViewPromise !== promise) return;
        _this.setData({
            statusViewState: Array.isArray(data) && !data.length ? "empty" : ""
        });
    }, function(error) {
        if (_this._autoSetStatusViewPromise !== promise) return;
        _this.setData({
            "statusViewConfig.error.text": error.toString(),
            statusViewState: "error"
        });
    }).finally(function() {
        if (setNavigationBarLoading) wx.hideNavigationBarLoading();
    });
    return promise;
}

function autoSetPagerLoading(promise) {
    var _this2 = this;
    if (!(promise instanceof Promise)) promise = Promise.resolve(promise);
    this.setData({
        pagerLoadingState: "loading"
    });
    this._autoSetPagerLoadingPromise = promise;
    promise.then(function(_ref3) {
        var completed = _ref3.completed;
        if (_this2._autoSetPagerLoadingPromise !== promise) return;
        _this2.setData({
            pagerLoadingState: completed ? "completed" : ""
        });
    }, function(_ref4) {
        var state = _ref4.state, errMsg = _ref4.errMsg;
        if (_this2._autoSetPagerLoadingPromise !== promise) return;
        _this2.setData({
            "pagerLoadingConfig.error.text": errMsg || "",
            pagerLoadingState: state
        });
    });
    return promise;
}

function stopPropagation() {
    return false;
}