var _createPage = require("../../createPage");

var _createPage2 = _interopRequireDefault(_createPage);

var _site = require("../../../api/site");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

Page((0, _createPage2.default)({
    data: {
        listMode: "immersive-dark",
        list: [],
        statusViewConfig: {
            empty: {
                icon: "warn",
                text: "还没有全景图"
            },
            error: {
                icon: "error",
                btnText: "重试"
            }
        },
        pagerLoadingConfig: {
            completed: {
                text: "没有更多了"
            }
        }
    },
    created: function created() {
        this.allowShare = {};
        this.title = "全景图收藏";
    },
    onLoad: function onLoad() {
        var _this = this;
        wx.showNavigationBarLoading();
        this.title = "全景图收藏";
        this.setData({
            statusViewState: "loading"
        });
        (0, _site.getPanoramasListConfig)().then(function(_ref) {
            var listMode = _ref.listMode;
            _this.setData({
                listMode: listMode
            });
        }).finally(function() {
            _this.reLoad();
        });
    },
    onPullDownRefresh: function onPullDownRefresh() {
        var _this2 = this;
        return this._pager && this._pager.silentUpdate(function(list) {
            _this2.setData({
                list: list
            });
        }, 0);
    },
    onShow: function onShow() {
        var _this3 = this;
        this._pager && this._pager.silentUpdate(function(list) {
            _this3.setData({
                list: list
            });
        });
    },
    reLoad: function reLoad(ignoreCache) {
        var _this4 = this;
        this._pager = this._pager || (0, _site.getPanoramasFavPager)();
        this.autoSetPagerStatusView(this._pager.load(ignoreCache), true).then(function(list) {
            _this4.setData({
                list: list
            });
        });
    },
    onReachBottom: function onReachBottom() {
        var _this5 = this;
        if (this._pager && !this._pager.completed) this.autoSetPagerLoading(this._pager.next()).then(function(_ref2) {
            var list = _ref2.list;
            _this5.setData({
                list: list
            });
        });
    }
}));