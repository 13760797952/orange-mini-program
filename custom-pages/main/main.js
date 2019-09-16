var _customPage = require("../customPage");

var _customPage2 = _interopRequireDefault(_customPage);

var _user = require("../../store/user");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

var app = getApp();

var customNav = app.customNav;

Page((0, _customPage2.default)({
    allowShare: false,
    data: {
        customNav: customNav,
        userData: _user.userData,
        syscfg: undefined,
        stsModel: false
    },
    onLoad: function onLoad(options) {
        var _this = this;
        this.setData({
            customNav: customNav,
            stsModel: app.stsModel
        });
        var setInt = setInterval(function() {
            if (app.sys) {
                _this.setData({
                    syscfg: app.sys
                });
                clearInterval(setInt);
            }
        }, 100);
    },
    onPageScroll: function onPageScroll(_ref) {
        var scrollTop = _ref.scrollTop;
        this._pageScrollTop[this.data.page] = scrollTop;
    },
    onPageChange: function onPageChange() {
        var _this2 = this;
        var currentItem = customNav.items.find(function(item) {
            return item.action === _this2.data.pageUrl;
        });
        //if(currentItem) this.title = currentItem.label
        },
    onDoubleTapTab: function onDoubleTapTab() {
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 0
        });
        if (this.currentPage) this.currentPage.onDoubleTapTab();
    }
}));