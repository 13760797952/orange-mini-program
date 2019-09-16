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
// 引入SDK核心类
var QQMapWX = require("../../public/map/qqmap-wx-jssdk.min.js");

Page((0, _createPageSys2.default)({
    allowShare: true,
    /**
     * 页面的初始数据
     */
    data: {
        myadpop: {},
        siteVersion: "",
        logo_url: "",
        loadingColor: app.maincolor ? app.maincolor : "#2fbd80",
        regionSelectCity: [ "请选择所在城市" ],
        // 城市
        houseType: [ [ "1室", "2室", "3室", "4室", "5室", "6室" ], [ "1厅", "2厅", "3厅", "4厅", "5厅", "6厅" ], [ "1厨", "2厨", "3厨", "4厨", "5厨", "6厨" ], [ "1卫", "2卫", "3卫", "4卫", "5卫", "6卫" ], [ "1阳", "2阳", "3阳", "4阳", "5阳", "6阳" ] ],
        houseTypeValue: [ 0, 0, 0, 0, 0 ],
        chars: [ "/public/calc/calc_0.png", "/public/calc/calc_1.png", "/public/calc/calc_2.png", "/public/calc/calc_3.png", "/public/calc/calc_4.png", "/public/calc/calc_5.png", "/public/calc/calc_6.png", "/public/calc/calc_7.png", "/public/calc/calc_8.png", "/public/calc/calc_9.png" ],
        calcNums: [],
        // 动动数字
        sendCity: "",
        // 发送，城市
        sendArea: "",
        // 发送，面积
        sendHostType: "",
        // 发送，户型
        sendTel: "",
        // 发送，手机号
        loadingShow: true
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function onLoad(options) {
        this.configSet();
    },
    bindLinkClick: function bindLinkClick(e) {
        app.sitefun.clickObjectLink(e, app);
    },
    imgLoad: function imgLoad() {
        this.setData({
            loadingShow: false
        });
    },
    configSet: function configSet() {
        var that = this;
        this.setData({
            user: app.globalData.userInfo
        });
        // 获取文章内容
        // PageConfig
                this.setPageConfig();
        this.createNum();
        this.interval = setInterval(this.createNum, 300);
        // 设置默认 户型
                this.setData({
            sendHostType: this.data.houseType[0][this.data.houseTypeValue[0]] + " " + this.data.houseType[1][this.data.houseTypeValue[1]] + " " + this.data.houseType[2][this.data.houseTypeValue[2]] + " " + this.data.houseType[3][this.data.houseTypeValue[3]] + " " + this.data.houseType[4][this.data.houseTypeValue[4]]
        });
        if (app.sys.config.mapkey != undefined && app.sys.config.mapkey != "") {
            // 实例化腾讯地图API核心类
            var qqmapsdk = new QQMapWX({
                key: app.sys.config.mapkey
            });
            //1、获取当前位置坐标
                        wx.getLocation({
                type: "gcj02",
                success: function success(res) {
                    console.log(res);
                    //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
                                        qqmapsdk.reverseGeocoder({
                        location: {
                            latitude: res.latitude,
                            longitude: res.longitude
                        },
                        success: function success(addressRes) {
                            // var address = addressRes.result.formatted_addresses.recommend;
                            var mapaddress = addressRes.result.address_component;
                            that.setData({
                                "regionSelectCity[0]": mapaddress.province,
                                "regionSelectCity[1]": mapaddress.city,
                                "regionSelectCity[2]": mapaddress.district,
                                sendCity: mapaddress.province + " " + mapaddress.city + " " + mapaddress.district
                            });
                        }
                    });
                },
                error: function error(err) {
                    console.log(err);
                }
            });
        }
    },
    setPageConfig: function setPageConfig() {
        var _this = this;
        app.http({
            url: app.apis.calc_config
        }).then(function(res) {
            _this.setData({
                pageConfig: res.set
            });
            if (!_this.data.pageConfig.page_url) {
                _this.setData({
                    loadingShow: false
                });
            }
        }, function(err) {
            wx.showToast({
                title: err,
                image: "/public/images/icon_error.png"
            });
        });
    },
    // 选择城市
    bindRegionChange: function bindRegionChange(e) {
        var that = this;
        // console.log('picker发送选择改变，携带值为', e.detail.value)
                this.setData({
            regionSelectCity: e.detail.value
        });
        that.setData({
            sendCity: that.data.regionSelectCity[0] + " " + that.data.regionSelectCity[1] + " " + that.data.regionSelectCity[2]
        });
    },
    // 面积
    bindAreaInput: function bindAreaInput(e) {
        var that = this;
        that.setData({
            sendArea: e.detail.value
        });
    },
    // 选择户型
    bindMultiPickerChange: function bindMultiPickerChange(e) {
        var that = this;
        // console.log('picker发送选择改变，携带值为', e.detail.value)
                this.setData({
            houseTypeValue: e.detail.value
        });
        that.setData({
            sendHostType: that.data.houseType[0][that.data.houseTypeValue[0]] + " " + that.data.houseType[1][that.data.houseTypeValue[1]] + " " + that.data.houseType[2][that.data.houseTypeValue[2]] + " " + that.data.houseType[3][that.data.houseTypeValue[3]] + " " + that.data.houseType[4][that.data.houseTypeValue[4]]
        });
    },
    // 手机
    bindTelInput: function bindTelInput(e) {
        var that = this;
        that.setData({
            sendTel: e.detail.value
        });
    },
    createNum: function createNum() {
        var that = this;
        var res = [];
        // let n = Math.ceil(Math.random() * 7) + 5;
                for (var i = 0; i < 5; i++) {
            var id = Math.ceil(Math.random() * 9);
            res.push(that.data.chars[id]);
        }
        that.setData({
            calcNums: res
        });
    },
    fomrSubmitCalc: function fomrSubmitCalc() {
        var that = this;
        var s_city = that.data.sendCity;
        var s_area = that.data.sendArea;
        var s_house_type = that.data.sendHostType;
        var s_tel = that.data.sendTel;
        if (s_city == null || s_city == undefined || s_city == "") {
            wx.showModal({
                content: "请选择所在城市",
                showCancel: false
            });
            return false;
        }
        if (s_area == null || s_area == undefined || s_area == "") {
            wx.showModal({
                content: "请输入房屋面积",
                showCancel: false
            });
            return false;
        }
        if (s_house_type == null || s_house_type == undefined || s_house_type == "") {
            wx.showModal({
                content: "请选择户型",
                showCancel: false
            });
            return false;
        }
        if (s_tel == null || s_tel == undefined || s_tel == "") {
            wx.showModal({
                content: "请输入手机号码",
                showCancel: false
            });
            return false;
        }
        app.http({
            url: app.apis.booking_step1,
            method: "POST",
            contentType: 1,
            data: {
                uid: that.data.user.id,
                name: that.data.user.nicename,
                scity: s_city,
                sarea: s_area,
                shouse: s_house_type,
                stel: s_tel
            }
        }).then(function(res) {
            wx.redirectTo({
                url: "/pages/upinfo/upinfo?id=" + res
            });
        }, function(err) {
            wx.showModal({
                content: "提交失败",
                showCancel: false
            });
        });
    },
    // 填充手机号
  getPhoneNumber: function getPhoneNumber(e) {
        var _this2 = this;
        var e_iv = e.detail.iv;
        var e_enData = e.detail.encryptedData;
        wx.login({
            success: function success(res) {
                if (res.code) {
                    app.http({
                        url: app.apis.smk_get_wx_phone,
                        method: "POST",
                        contentType: 1,
                        data: {
                            code: res.code,
                            iv: e_iv,
                            ed: e_enData
                        }
                    }).then(function(res) {
                        _this2.setData({
                            sendTel: res
                        });
                    }, function(err) {
                        wx.showModal({
                            content: "请求失败！",
                            showCancel: false
                        });
                    });
                } else {
                    wx.showModal({
                        content: "登录失败！",
                        showCancel: false
                    });
                }
            }
        });
    }
}));