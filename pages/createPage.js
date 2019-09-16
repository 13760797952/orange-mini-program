Object.defineProperty(exports, "__esModule", {
    value: true
});

var _pageMixin = require("../lib/pageMixin");

var _pageMixin2 = _interopRequireDefault(_pageMixin);

var _commonMethod = require("../pages/commonMethod");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

var app = getApp();

exports.default = function(pageConfig) {
    return (0, _pageMixin2.default)(pageConfig, [ {
        onShareAppMessage: _commonMethod.onShareAppMessage,
        data: {
            commonStyles: app.commonStyles,
            statusViewState: "loading",
            pagerLoadingState: ""
        },
        onShow: function onShow() {
            this.setData({
                commonStyles: app.commonStyles
            });
            app.onPageShow(this);
        },
        onHide: function onHide() {
            this._showAgain = true;
        },
        methods: {
            targetDataSet: _commonMethod.targetDataSet,
            targetActionRun: _commonMethod.targetActionRun,
            setDataByOptions: _commonMethod.setDataByOptions,
            autoSetStatusView: _commonMethod.autoSetStatusView,
            autoSetPagerLoading: _commonMethod.autoSetPagerLoading,
            autoSetPagerStatusView: _commonMethod.autoSetPagerStatusView
        }
    } ]);
};