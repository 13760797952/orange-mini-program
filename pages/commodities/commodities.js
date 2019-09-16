var _createPage = require("../createPage");

var _createPage2 = _interopRequireDefault(_createPage);

var _shop = require("../../store/shop");

var _site = require("../../api/site");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

var app = getApp();

Page((0, _createPage2.default)({
    allowShare: true,
    data: {
        hideSearch: false,
        categoryID: null,
        subID: null,
        keyword: "",
        tabItems: [],
        commoditiesItems: [],
        statusViewConfig: {
            empty: {
                icon: "warn",
                text: "当前条件下没有商品哦",
                btnAction: ":navigateBack",
                btnText: "返回"
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
    condition: {
        keyword: null,
        tag: null,
        subID: null
    },
    onLoad: function onLoad(options) {
        this.setDataByOptions([ "categoryID", "subID", "keyword", "hideSearch" ], options);
        var _data = this.data, keyword = _data.keyword, categoryID = _data.categoryID, subID = _data.subID;
        this.setCondition({
            keyword: keyword,
            subID: subID,
            tag: options.tag
        });
        this.updateList();
        if (options.title) wx.setNavigationBarTitle({
            title: this.title = options.title
        });
        if (categoryID) this.toggle(categoryID, subID);
    },
    searchBlur: function searchBlur() {
        var keyword = this.data.keyword;
        this.setData({
            keyword: ""
        });
        this.setData({
            keyword: keyword
        });
    },
    searchConfirm: function searchConfirm(_ref) {
        var detail = _ref.detail;
        this.search(detail.value);
    },
    setCondition: function setCondition(condition) {
        for (var key in condition) {
            this.options[key] = this.condition[key] = condition[key];
        }
    },
    search: function search(keyword) {
        this.setCondition({
            keyword: keyword
        });
        this.setData({
            keyword: keyword
        });
        this.updateList();
    },
    updateList: function updateList() {
        var _this = this;
        this._pager = (0, _site.getCommoditiesListPager)(this.condition);
        this.autoSetPagerStatusView(this._pager.load(true), true).then(function(list) {
            _this.setData({
                commoditiesItems: list
            });
        });
    },
    toggle: function toggle(categoryID, subID) {
        var _this2 = this;
        this.setData({
            categoryID: categoryID,
            subID: subID
        });
        this.setCondition({
            categoryID: categoryID,
            subID: subID
        });
        this.autoSetStatusView((0, _shop.getCategoryDataByID)(categoryID), true).then(function(data) {
            wx.setNavigationBarTitle({
                title: _this2.title = data.label
            });
            subID = subID === undefined ? data.items[0].id : subID;
            _this2.setData({
                tabItems: data.items,
                subID: subID
            });
            _this2.setCondition({
                subID: subID
            });
            _this2.updateList();
        });
    },
    tabChange: function tabChange(event) {
        var subID = event.detail.newID;
        if (subID === this.data.subID) return;
        this.toggle(this.data.categoryID, subID);
    },
    nextPage: function nextPage() {
        var _this3 = this;
        if (this._pager && !this._pager.completed) this.autoSetPagerLoading(this._pager.next()).then(function(_ref2) {
            var list = _ref2.list;
            _this3.setData({
                commoditiesItems: list
            });
        });
    }
}));