var _pageBehavior = require("../pageBehavior");

var _pageBehavior2 = _interopRequireDefault(_pageBehavior);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

// 深蓝网络 Copyright (c) www.zhshenlan.com
var app = getApp();

//获取应用实例
Component({
    behaviors: [ _pageBehavior2.default ],
    options: {
        addGlobalClass: true
    },
    /**
     * 页面的初始数据
     */
    data: {
        syscfg: null,
        myadpop: {},
        authShow: false,
        siteVersion: "",
        stsModel: false,
        menusEnabled: "0",
        logo_url: "",
        hasAuth: true,
        tabShow: true,
        user: null,
        sysauth: {},
        ver: "",
        loadingShow: true,
        listData: []
    },
    created: function created() {
        this.shortcutGroup = "";
        this.allowShare = false;
        //this.title = '我的'
        },
    attached: function attached() {
        var _this = this;
        app.getConfig().then(function() {
            _this.setData({
                syscfg: app.sys,
                user: app.globalData.userInfo,
                listData: app.sys.ucenter,
                loadingShow: false
            });
        });
    },
    methods: {
        clearStorage: function clearStorage() {
            wx.clearStorageSync();
            app.globalData.userInfo = undefined;
            app.actionRun(">index?url=@me");
        }
    }
});