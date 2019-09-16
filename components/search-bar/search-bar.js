var _commonBehavior = require("../commonBehavior");

var _commonBehavior2 = _interopRequireDefault(_commonBehavior);

var _utils = require("../../lib/utils");

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

var app = getApp();

var getTitlebarDorL = function getTitlebarDorL() {
    return (0, _utils.darkOrLight)(app.commonStyles.titlebar.backgroundColor);
};

Component({
    behaviors: [ _commonBehavior2.default ],
    properties: {
        confirmAction: String,
        value: {
            type: String,
            observer: "update"
        },
        placeholder: {
            type: String,
            value: "搜索你要找的商品"
        }
    },
    data: {
        bgClass: getTitlebarDorL(),
        expand: false,
        isFocus: false,
        history: []
    },
    methods: {
        update: function update(newVal) {
            this.setData({
                expand: !!this.data.value
            });
        },
        focus: function focus() {
            this.setData({
                expand: true,
                isFocus: true
            });
        },
        blur: function blur(event) {
            var value = this._confirmValue !== false ? this._confirmValue : event.detail.value;
            this.setData({
                expand: !!value,
                isFocus: false
            });
            this.triggerEvent("blur", {
                value: value
            });
            this._confirmValue = false;
        },
        inputConfirm: function inputConfirm(_ref) {
            var detail = _ref.detail;
            var value = detail.value.trim();
            if (!value) return;
            this.confirm(value);
        },
        confirm: function confirm(value) {
            this._confirmValue = value;
            var confirmAction = this.data.confirmAction;
            if (confirmAction) {
                app.actionRun(confirmAction.replace("{value}", value));
                this.setData({
                    expand: false,
                    isFocus: false,
                    value: ""
                });
                this._confirmValue = "";
            } else {
                this.setData({
                    value: value
                });
            }
            this.triggerEvent("confirm", {
                value: value
            });
            this.addHistory(value);
        },
        addHistory: function addHistory(value) {
            var history = this.data.history;
            history.unshift(value);
            history = [].concat(_toConsumableArray(new Set(history)));
            if (history.length > 5) history.length = 5;
            this.setData({
                history: history
            });
            wx.setStorage({
                key: "search-history",
                data: history
            });
        },
        clearHistory: function clearHistory() {
            var history = this.data.history;
            history.length = 0;
            this.setData({
                history: history
            });
            wx.setStorage({
                key: "search-history",
                data: history
            });
        },
        historyClick: function historyClick(_ref2) {
            var currentTarget = _ref2.currentTarget;
            var value = currentTarget.dataset.value;
            this.confirm(value);
        },
        updateStyle: function updateStyle() {
            var _this = this;
            var dorl = getTitlebarDorL();
            this.setData({
                bgClass: dorl
            });
            app.setPageStyles({
                backgroundColorTop: app.commonStyles.titlebar.backgroundColor,
                backgroundTextStyle: dorl
            }, true);
            wx.getStorage({
                key: "search-history",
                success: function success(_ref3) {
                    var data = _ref3.data;
                    data && _this.setData({
                        history: data
                    });
                }
            });
        }
    },
    attached: function attached() {
        this.updateStyle();
    },
    pageLifetimes: {
        show: function show() {
            this.updateStyle();
        }
    }
});