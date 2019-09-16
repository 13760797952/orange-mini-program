var _pageBehavior = require("../pageBehavior");

var _pageBehavior2 = _interopRequireDefault(_pageBehavior);

var _shop = require("../../store/shop");

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
        categoryItems: [],
        currentID: null,
        currentData: null,
        statusViewConfig: {
            empty: {
                icon: "warn",
                text: "还没有任何分类"
            },
            error: {
                icon: "error",
                btnText: "重试"
            }
        }
    },
    created: function created() {
        this.shortcutGroup = "shop";
        this.allowShare = true;
        //this.title = '分类'
        },
    attached: function attached() {
        this.reLoad();
    },
    methods: {
        onSmartToHere: function onSmartToHere(_ref) {
            var options = _ref.options;
            this.setDataByOptions([ {
                currentID: "id"
            } ], options);
        },
        reLoad: function reLoad() {
            var _this = this;
            if (this._tabItemsLoaded) {
                this.toggle(this.data.currentID);
            } else {
                this.setData({
                    tabItems: []
                });
                this.autoSetStatusView((0, _shop.getCategoriesList)()).then(function(categoryItems) {
                    if (categoryItems.length) {
                        _this._tabItemsLoaded = true;
                        _this.setData({
                            categoryItems: categoryItems,
                            "statusViewConfig.empty.text": "此分类建设中"
                        });
                        _this.toggle(_this.data.currentID || categoryItems[0].id);
                    }
                });
            }
        },
        toggle: function toggle(id) {
            var _this2 = this;
            this.setData({
                currentID: id
            });
            this.autoSetStatusView((0, _shop.getCategoryDataByID)(id)).then(function(data) {
                if (_this2.data.currentID == id) {
                    _this2.setData({
                        currentData: data
                    });
                    _this2.autoSetStatusView(data.items);
                }
            });
        },
        tabChange: function tabChange(_ref2) {
            var detail = _ref2.detail;
            this.toggle(detail.value);
        },
        categoryItemClick: function categoryItemClick(_ref3) {
            var currentTarget = _ref3.currentTarget;
            app.smartTo({
                url: ">commodities",
                options: {
                    categoryID: this.data.currentID,
                    subID: currentTarget.dataset.id,
                    hideSearch: true
                }
            });
        }
    }
});