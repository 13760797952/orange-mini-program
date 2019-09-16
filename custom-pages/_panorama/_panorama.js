var _site = require("../../api/site");

var _pageBehavior = require("../pageBehavior");

var _pageBehavior2 = _interopRequireDefault(_pageBehavior);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

var app = getApp();

Component({
    behaviors: [ _pageBehavior2.default ],
    options: {
        addGlobalClass: true
    },
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
        this.shortcutGroup = "";
        this.allowShare = true;
        //this.title = '全景图'
        },
    attached: function attached() {
        var _this = this;
        app.getConfig().then(function() {
            wx.showNavigationBarLoading();
            _this.setData({
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
        });
    },
    methods: {
        reLoad: function reLoad(ignoreCache) {
            var _this2 = this;
            this._pager = this._pager || (0, _site.getPanoramasListPager)();
            this.autoSetPagerStatusView(this._pager.load(ignoreCache), true).then(function(list) {
                _this2.setData({
                    list: list
                });
            });
        },
        onReachBottom: function onReachBottom() {
            var _this3 = this;
            if (this._pager && !this._pager.completed) this.autoSetPagerLoading(this._pager.next()).then(function(_ref2) {
                var list = _ref2.list;
                _this3.setData({
                    list: list
                });
            });
        },
        onPullDownRefresh: function onPullDownRefresh() {
            var _this4 = this;
            return this._pager && this._pager.silentUpdate(function(list) {
                _this4.setData({
                    list: list
                });
            }, 0);
        },
        onShow: function onShow() {
            var _this5 = this;
            this._pager && this._pager.silentUpdate(function(list) {
                _this5.setData({
                    list: list
                });
            });
        }
    }
});