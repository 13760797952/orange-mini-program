var _commonMethod = require("../pages/commonMethod");

var app = getApp();

module.exports = Behavior({
    behaviors: [ "wx://component-export" ],
    data: {
        scrollTop: 0,
        commonStyles: app.commonStyles,
        options: {},
        statusViewState: "loading",
        pagerLoadingState: "",
        syscfg: app.sys,
        user: app.globalData.userInfo
    },
    attached: function attached() {
        this.setData({
            commonStyles: app.commonStyles,
            syscfg: app.sys,
            user: app.globalData.userInfo
        });
    },
    methods: {
        setDataByOptions: _commonMethod.setDataByOptions,
        targetDataSet: _commonMethod.targetDataSet,
        targetActionRun: _commonMethod.targetActionRun,
        autoSetStatusView: _commonMethod.autoSetStatusView,
        autoSetPagerLoading: _commonMethod.autoSetPagerLoading,
        autoSetPagerStatusView: _commonMethod.autoSetPagerStatusView,
        updateOptions: function updateOptions() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.data.options;
            this.setData({
                options: options
            });
            this._page.options = Object.assign(options, {
                page: this._page.options.page
            });
        }
    },
    export: function _export() {
        var _this = this;
        var callSelf = function callSelf(name) {
            return function() {
                if (_this[name]) return _this[name].apply(_this, arguments);
            };
        };
        return {
            onShow: function onShow() {
                _this.setData({
                    commonStyles: app.commonStyles,
                    syscfg: app.sys,
                    user: app.globalData.userInfo
                });
                return callSelf("onShow")();
            },
            onHide: function onHide() {
                _this._showAgain = true;
                return callSelf("onHide")();
            },
            onSmartToHere: callSelf("onSmartToHere"),
            onReachBottom: callSelf("onReachBottom"),
            onShareAppMessage: callSelf("onShareAppMessage"),
            onPullDownRefresh: callSelf("onPullDownRefresh"),
            onDoubleTapTab: function onDoubleTapTab() {
                _this.setData({
                    scrollTop: 0
                });
                return callSelf("onDoubleTapTab")();
            },
            swapData: function swapData(page, options) {
                page.allowShare = _this.allowShare;
                //page.title = this.title
                                _this._page = page;
                _this.setData({
                    options: options || {}
                });
                page.setData({
                    shortcutGroup: page.data.shortcutGroup = _this.shortcutGroup || ""
                });
                return callSelf("swapData")(page, options);
            }
        };
    }
});