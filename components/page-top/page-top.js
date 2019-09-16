// components/page-top/page-top.js
var app = getApp();

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        pageTitle: {
            type: String,
            value: ""
        },
        tabs: {
            type: Boolean,
            value: false
        },
        ishome: {
            type: Boolean,
            value: false
        }
    },
    /**
     * 组件的初始数据
     */
    data: {
        topHeight: app.getSizeData().height,
        btnWidth: app.getSizeData().btnWidth + 15,
        backPrev: true,
        topcolor: "#ffffff",
        topfontcolor: "#000000",
        ipx: app.stsModel
    },
    /**
     * 组件的方法列表
     */
    methods: {
        goHome: function goHome() {
            app.actionRun("@index");
        },
        back: function back() {
            getCurrentPages().length > 1 ? wx.navigateBack() : app.actionRun("@index");
        }
    },
    attached: function attached() {
        var _this = this;
        app.getConfig().then(function(res) {
            _this.setData({
                topcolor: app.sys.color.topcolor ? app.sys.color.topcolor : "#ffffff",
                topfontcolor: app.sys.color.topfontcolor ? app.sys.color.topfontcolor : "#000000"
            });
        });
    },
    onReachBottom: function onReachBottom(e) {
        console.log(e);
    }
});