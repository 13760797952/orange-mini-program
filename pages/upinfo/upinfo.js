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
Page((0, _createPageSys2.default)({
    allowShare: true,
    /**
     * 页面的初始数据
     */
    data: {
        myadpop: {},
        authShow: false,
        siteVersion: "",
        menusEnabled: "0",
        logo_url: "",
        step1_ID: 0,
        // 上一步ID
        bookOne: {},
        // 上一步的信息
        bacePrice: {},
        // 配置中的价格
        selectBook1: "",
        // 选项1
        selectBook2: "",
        // 选项2
        selectBook3: "",
        // 选项3
        selectBook4: ""
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function onLoad(options) {
        if (options.id != undefined) this.setData({
            step1_ID: options.id
        });
        this.setStpe1Price();
    },
    /*
     * 获取报价
     */
    setStpe1Price: function setStpe1Price() {
        var that = this;
        app.http({
            url: app.apis.booking_step1_get,
            data: {
                id: that.data.step1_ID
            }
        }).then(function(res) {
            that.setData({
                bookOne: res.booking,
                bacePrice: res.set
            });
        }, function(err) {
            wx.showToast({
                title: err,
                image: "/public/images/icon_error.png"
            });
        });
    },
    rcbook1: function rcbook1(e) {
        var that = this;
        // console.log('radio发生change事件，携带value值为：', e.detail.value)
                that.data.selectBook1 = e.detail.value;
    },
    rcbook2: function rcbook2(e) {
        var that = this;
        // console.log('radio发生change事件，携带value值为：', e.detail.value)
                that.data.selectBook2 = e.detail.value;
    },
    rcbook3: function rcbook3(e) {
        var that = this;
        // console.log('radio发生change事件，携带value值为：', e.detail.value)
                that.data.selectBook3 = e.detail.value;
    },
    rcbook4: function rcbook4(e) {
        var that = this;
        that.setData({
            selectBook4: e.detail.value
        });
    },
    getBookOptions: function getBookOptions() {
        var that = this;
        var ibook1 = that.data.selectBook1;
        var ibook2 = that.data.selectBook2;
        var ibook3 = that.data.selectBook3;
        var ibook4 = that.data.selectBook4;
        if (ibook1 == null || ibook1 == undefined || ibook1 == "") {
            wx.showModal({
                content: "请选择装修类型",
                showCancel: false
            });
            return false;
        }
        if (ibook2 == null || ibook2 == undefined || ibook2 == "") {
            wx.showModal({
                content: "请选择房屋状态",
                showCancel: false
            });
            return false;
        }
        if (ibook3 == null || ibook3 == undefined || ibook3 == "") {
            wx.showModal({
                content: "请选择装修时间",
                showCancel: false
            });
            return false;
        }
        if (ibook4 == null || ibook4 == undefined || ibook4 == "") {
            wx.showModal({
                content: "输入楼盘或小区",
                showCancel: false
            });
            return false;
        }
        var str_1 = "[" + ibook1 + "]";
        var str_2 = "[" + ibook2 + "]";
        var str_3 = "[" + ibook3 + "]";
        var str_4 = "[" + ibook4 + "]";
        return str_1 + str_2 + str_3 + str_4;
    },
    formSubmit: function formSubmit(e) {
        var that = this;
        var step2_options = that.getBookOptions();
        if (!step2_options) return;
        app.http({
            url: app.apis.booking_step2,
            method: "POST",
            contentType: 1,
            data: {
                id: that.data.step1_ID,
                ops: step2_options
            }
        }).then(function(res) {
            wx.showModal({
                title: "系统提示",
                content: "提交成功！我们的专员尽快与你联系请保持手机畅通！",
                showCancel: false,
                success: function success() {
                    wx.redirectTo({
                        url: "/pages/calc/calc"
                    });
                }
            });
        }, function(err) {
            wx.showModal({
                content: err,
                showCancel: false
            });
        });
    }
}));