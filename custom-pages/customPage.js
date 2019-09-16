Object.defineProperty(exports, "__esModule", {
    value: true
});

var _commonMethod = require("../pages/commonMethod");

var _pageMixin = require("../lib/pageMixin");

var _pageMixin2 = _interopRequireDefault(_pageMixin);

var _utils = require("../lib/utils");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}

var app = getApp();

exports.default = function(pageConfig) {
    return (0, _pageMixin2.default)(pageConfig, [ {
        data: {
            commonStyles: app.commonStyles,
            page: "index",
            pageUrl: "@index",
            shortcutGroup: "",
            pageAlive: {},
            options: {}
        },
        onShareAppMessage: function onShareAppMessage() {
            if (this.currentPage) this.currentPage.onShareAppMessage();
            return _commonMethod.onShareAppMessage.bind(this)();
        },
        onLoad: function onLoad(options) {
            this._pageScrollTop = {};
            this.updateOptions(options);
        },
        onSmartToHere: function onSmartToHere(smartToData) {
            this.updateOptions(smartToData.options);
            if (this.currentPage) this.currentPage.onSmartToHere(smartToData);
            app.onPageShow(this);
        },
        onShow: function onShow() {
            this.setData({
                commonStyles: app.commonStyles
            });
            app.onPageShow(this);
            if (this.currentPage) this.currentPage.onShow();
        },
        onHide: function onHide() {
            this._showAgain = true;
            if (this.currentPage) this.currentPage.onHide();
        },
        onReachBottom: function onReachBottom() {
            if (this.currentPage) this.currentPage.onReachBottom();
        },
        onPullDownRefresh: function onPullDownRefresh() {
            if (this.currentPage && this.currentPage.onPullDownRefresh) {
                var returnValue = this.currentPage.onPullDownRefresh();
                if (returnValue instanceof Promise) returnValue.finally(wx.stopPullDownRefresh); else wx.stopPullDownRefresh();
            } else {
                wx.stopPullDownRefresh();
            }
        },
        methods: {
            stopPropagation: _commonMethod.stopPropagation,
            targetDataSet: _commonMethod.targetDataSet,
            targetActionRun: _commonMethod.targetActionRun,
            setDataByOptions: _commonMethod.setDataByOptions,
            updateOptions: function updateOptions(options) {
                if (!options) return;
                var page = options.page || this.data.page;
                var isToggle = page !== this.data.page;
                delete options.page;
                delete this.options.page;
                this.setData(_defineProperty({
                    page: page,
                    pageUrl: "@" + page
                }, "pageAlive." + page, true));
                wx.pageScrollTo({
                    scrollTop: this._pageScrollTop[page] || 0,
                    duration: 0
                });
                if (isToggle && this.currentPage) this.currentPage.onHide();
                var currentPage = this.currentPage = this.selectComponent("#" + page);
                if (!currentPage) return app.textToast("找不到页面: " + page);
                currentPage.swapData(this, options);
                if (this.onPageChange) this.onPageChange();
                if (isToggle) currentPage.onShow();
            },
            rewritePageUrl: function rewritePageUrl(withArgs) {
                return (0, _utils.urlParser)(this.data.pageUrl, withArgs ? this.options : {}).url;
            }
        }
    } ]);
};