var _createPageSys = require("../createPageSys");

var _createPageSys2 = _interopRequireDefault(_createPageSys);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

// 深蓝网络 Copyright (c) www.zhshenlan.com
var app = getApp();

//获取应用实例
var WxParse = require("../../public/wxParse/wxParse.js");

var article = null;

Page((0, _createPageSys2.default)({
    allowShare: true,
    /**
     * 页面的初始数据
     */
    data: {
        detailId: "",
        actid: null,
        actdata: null,
        barTitle: "",
        tabShow: true,
        btnColor: "",
        detailType: ""
    },
    setActContent: function setActContent() {
        var _this = this;
        var id = this.data.detailId;
        var urlc = this.data.detailType + "_one";
        app.http({
            url: app.apis[urlc],
            data: {
                aid: id
            }
        }).then(function(res) {
            _this.setData({
                actdata: res.one,
                barTitle: res.one.name
            });
            wx.setNavigationBarTitle({
                title: res.one.name
            });
            article = res.one.detail;
            WxParse.wxParse("article", "html", article, _this);
        }, function(err) {
            wx.showToast({
                title: err,
                image: "/public/images/icon_error.png"
            });
        });
    },
    bindLinkClick: function bindLinkClick(e) {
        app.sitefun.clickObjectLink(e, app);
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function onLoad(options) {
        this.setData({
            detailId: options.id,
            detailType: options.type
        });
        this.setData({
            tabShow: app.sys.config.act_calc_link_status === "1" ? false : true,
            btnColor: app.sys.color.btncolor
        });
        this.setActContent();
    }
}));