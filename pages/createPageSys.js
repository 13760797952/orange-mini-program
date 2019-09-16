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
            syscfg: app.sys,
            user: app.globalData.userInfo,
            sysModel: app.stsModel
        },
        onShow: function onShow() {
            this.setData({
                syscfg: app.sys,
                user: app.globalData.userInfo,
                sysModel: app.stsModel
            });
            app.onPageShow(this);
        }
    } ]);
};