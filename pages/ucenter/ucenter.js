// pages/ucenter/ucenter.js
var app = getApp(); //获取应用实例
var cfg = require('../../public/js/common.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        syscfg: {},
        user: {}
    },

    bindLinkClick: function bindLinkClick(e) {
        var that = this;
        var cType = e.currentTarget.dataset.ctype;
        var toUrl = e.currentTarget.dataset.url;
        var mid = e.currentTarget.dataset.index;

        if (cType == 'footerNav') {
            that.setData({
                'syscfg.fnavHover': mid
            });
            app.sys.fnavHover = mid;
        }

        if (toUrl == 'default') {
            wx.reLaunch({
                url: '/pages/default/default'
            });
        } else if (toUrl == 'pic') {
            wx.redirectTo({
                url: '/pages/pic/pic'
            });
        } else if (toUrl == 'ucenter') {
            wx.redirectTo({
                url: '/pages/ucenter/ucenter'
            });
        } else if (toUrl == 'stylist') {
            wx.redirectTo({
                url: '/pages/stylist/stylist'
            });
        } else if (toUrl == 'tel') {
            wx.makePhoneCall({
                phoneNumber: app.sys.tel
            });
        } else if (toUrl == 'location') {
            wx.openLocation({
                name: app.sys.name,
                address: app.sys.address,
                latitude: parseFloat(app.sys.lat),
                longitude: parseFloat(app.sys.lng),
                scale: 14
            });
        } else if (toUrl.indexOf('http') >= 0) {
            console.log(encodeURIComponent(toUrl));
            wx.navigateTo({
                url: '/pages/web/web?url=' + encodeURIComponent(toUrl)
            });
        } else {
            wx.navigateTo({
                url: toUrl
            });
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function onLoad(options) {
        var that = this;
        // console.log(app.globalData.userInfo);

        // 获取系统设置
        that.setConfig();
    },

    // 获取系统设置
    setConfig: function setConfig() {
        var that = this;
        that.setData({
            syscfg: app.sys,
            user: app.globalData.userInfo,
            'syscfg.module': '2',
            setcont: app.sys.showcont,
            barTitle: app.sys.appname
        });

        wx.setNavigationBarTitle({
            title: app.sys.appname != '' ? app.sys.appname : '小程序标题'
        });

        if (app.sys.color.topfontcolor != undefined && app.sys.color.topfontcolor != '') {
            wx.setNavigationBarColor({
                frontColor: app.sys.color.topfontcolor,
                backgroundColor: app.sys.color.topcolor
            });
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function onReady() {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function onShow() {},

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function onHide() {},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function onUnload() {},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function onPullDownRefresh() {
        wx.stopPullDownRefresh();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function onReachBottom() {},

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function onShareAppMessage() {
        var that = this;
        return {
            title: that.data.barTitle,
            success: function success(res) {
                // 转发成功
            },
            fail: function fail(res) {
                // 转发失败
            }
        };
    }
});