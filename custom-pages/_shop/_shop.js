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
        list: [],
        statusViewConfig: {
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
        this.shortcutGroup = "shop";
        this.allowShare = true;
        //this.title = '商城'
        },
    attached: function attached() {
        this.reLoad();
    },
    methods: {
        reLoad: function reLoad() {
            var _this = this;
            return this.autoSetStatusView((0, _site.getHomeData)(), true).then(function(data) {
                _this.setData(data);
            });
        },
        onPullDownRefresh: function onPullDownRefresh() {
            var _this2 = this;
            (0, _site.getHomeData)().then(function(data) {
                _this2.setData(data);
            }, app.textToast).finally(wx.stopPullDownRefresh);
        }
    }
});