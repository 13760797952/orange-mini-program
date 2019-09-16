var _pageBehavior = require("../pageBehavior");

var _pageBehavior2 = _interopRequireDefault(_pageBehavior);

var _site = require("../../api/site");

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
        hotItems: []
    },
    created: function created() {
        this.shortcutGroup = "shop";
        this.allowShare = true;
        //this.title = '购物车'
        },
    attached: function attached() {
        var _this = this;
        (0, _site.getCommoditiesListPager)({
            tag: "hot"
        }).load().then(function(_ref) {
            var list = _ref.list;
            _this.setData({
                hotItems: list
            });
        });
    },
    methods: {
        onShow: function onShow() {
            if (this._showAgain) this.selectComponent("#shopcart").reLoad(true);
        }
    }
});