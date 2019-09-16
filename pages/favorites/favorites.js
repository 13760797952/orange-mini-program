var _createPage = require("../createPage");

var _createPage2 = _interopRequireDefault(_createPage);

var _site = require("../../api/site");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

Page((0, _createPage2.default)({
    title: "商品收藏",
    data: {
        list: [],
        statusViewConfig: {
            empty: {
                icon: "favorite",
                text: "您还没有收藏过商品哦",
                btnAction: "@shop",
                btnText: "回首页逛逛"
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
    onLoad: function onLoad() {
        this.reLoad();
    },
    reLoad: function reLoad(ignoreCache) {
        var _this = this;
        this._pager = this._pager || (0, _site.getFavoritesListPager)();
        this.autoSetPagerStatusView(this._pager.load(ignoreCache)).then(function(list) {
            _this.setData({
                list: list
            });
        });
    },
    nextPage: function nextPage() {
        var _this2 = this;
        if (this._pager && !this._pager.completed) this.autoSetPagerLoading(this._pager.next()).then(function(_ref) {
            var list = _ref.list;
            _this2.setData({
                list: list
            });
        });
    },
    removeItem: function removeItem(_ref2) {
        var _this3 = this;
        var currentTarget = _ref2.currentTarget;
        var list = this.data.list, index = currentTarget.dataset.index, item = this.data.list[index];
        (0, _site.setCommodityFavorite)(item.id, false).then(function(res) {
            list.splice(index, 1);
            _this3.setData({
                list: list
            });
            _this3.autoSetStatusView(list);
        });
    }
}));