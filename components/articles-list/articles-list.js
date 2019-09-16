var _commonBehavior = require("../commonBehavior");

var _commonBehavior2 = _interopRequireDefault(_commonBehavior);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

var app = getApp();

Component({
    behaviors: [ _commonBehavior2.default ],
    options: {
        addGlobalClass: true
    },
    properties: {
        mode: {
            type: String,
            value: ""
        },
        imgMode: {
            type: String,
            value: ""
        },
        items: {
            type: Array,
            value: []
        },
        type: {
            type: String,
            value: ""
        },
        url: {
            type: String,
            value: "product-article"
        }
    },
    data: {
        presetImgMode: {
            "immersive-light": "widthFix",
            "immersive-dark": "aspectFill",
            "column-two-inner": "aspectFill"
        }
    },
    methods: {
        favFn: function favFn(_ref) {
            var _this = this;
            var currentTarget = _ref.currentTarget;
            if (this.data.url === "panorama-detail") {
                var _currentTarget$datase = currentTarget.dataset, idx = _currentTarget$datase.idx, aid = _currentTarget$datase.aid;
                var items = this.data.items;
                var isfav = items[parseInt(idx)]["fav"] === 1 ? 0 : 1;
                app.http({
                    url: app.apis.SL_panorama_collect + "&op=post",
                    data: {
                        id: aid,
                        ver: app.info.version,
                        uid: app.globalData.userInfo.id,
                        isfav: isfav
                    }
                }).then(function(res) {
                    var items = _this.data.items;
                    items[parseInt(idx)]["fav"] = isfav;
                    _this.setData({
                        items: items
                    });
                    wx.showToast({
                        title: "操作成功",
                        icon: "succes",
                        duration: 1500
                    });
                });
            }
        }
    }
});