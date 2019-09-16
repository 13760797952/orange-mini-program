var _createPage = require("../createPage");

var _createPage2 = _interopRequireDefault(_createPage);

var _site = require("../../api/site");

var _html2nodes = require("../../lib/html2nodes");

var _html2nodes2 = _interopRequireDefault(_html2nodes);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

var app = getApp();

var organization = app.organization;

var apiMap = {
    product: _site.getProductArticleByID
};

Page((0, _createPage2.default)({
    allowShare: true,
    title: "",
    data: {
        type: "product",
        organization: organization,
        article: {},
        statusViewConfig: {
            error: {
                icon: "error",
                btnText: "重试"
            }
        }
    },
    onShow: function onShow() {
        this.setData({
            organization: organization
        });
    },
    favFn: function favFn() {
        var _this = this;
        var isfav = this.data.article.fav === 1 ? 0 : 1;
        app.http({
            url: app.apis.SL_pro_collect + "&op=post",
            data: {
                id: this.data.article.id,
                ver: app.info.version,
                uid: app.globalData.userInfo.id,
                isfav: isfav
            }
        }).then(function(res) {
            _this.setData({
                "article.fav": isfav
            });
            wx.showToast({
                title: "操作成功",
                icon: "succes",
                duration: 1500
            });
        });
    },
    onLoad: function onLoad(options) {
        this.setDataByOptions([ "id", "type" ], options);
        this.reLoad();
    },
    reLoad: function reLoad() {
        var _this2 = this;
        var _data = this.data, id = _data.id, type = _data.type;
        var loadAPI = apiMap[type];
        app._getConfigPromise.then(function(success) {
            _this2.autoSetStatusView(loadAPI ? loadAPI(id) : Promise.reject("未知文章类型：" + type), true).then(function(article) {
                article.content = (0, _html2nodes2.default)(article.content);
                _this2.setData({
                    article: article
                });
                wx.setNavigationBarTitle({
                    title: article.title
                });
            }, function(err) {
                console.log(err);
            });
        });
    },
    onReady: function onReady() {
        this._isReady = true;
        if (this._waitWxml) this.autoSetTitle();
    }
}));