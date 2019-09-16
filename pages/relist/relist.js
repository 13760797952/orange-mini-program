// pages/relist/relist.js
var app = getApp(); //获取应用实例
var cfg = require('../../public/js/common.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        syscfg: {},
        user: {},
        reList: [],

        nextPage: 2, // 下一页
        isBottom: false // 是否已到底线
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

        // 列表
        that.setReList();
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

    /*
     * 列表
     */
    setReList: function setReList() {
        var that = this;

        wx.request({
            url: app.siteInfo.siteroot + '?i=' + app.siteInfo.uniacid + '&c=entry&a=wxapp&do=smk_relist&m=slwl_fitment',
            header: {
                'content-type': 'application/json'
            },
            success: function success(res) {
                // console.log(res);
                that.setData({
                    reList: res.data.data
                });
            },
            error: function error(err) {
                wx.showToast({
                    title: err,
                    image: '/public/images/icon_error.png'
                });
            }
        });
    },

    /*
     * 列表，获取更多
     */
    setReListMore: function setReListMore() {
        var that = this;

        wx.request({
            url: app.siteInfo.siteroot + '?i=' + app.siteInfo.uniacid + '&c=entry&a=wxapp&do=smk_relist&m=slwl_fitment',
            data: {
                uid: that.data.user.uid,
                page: that.data.nextPage
            },
            success: function success(res) {
                // console.log(res);

                for (var i = 0; i < res.data.data.length; i++) {
                    that.data.reList.push(res.data.data[i]);
                }

                if (res.data.data.length == 0) {
                    that.setData({
                        isBottom: true
                    });
                }

                that.setData({
                    reList: that.data.reList,
                    nextPage: that.data.nextPage + 1
                });
            },
            error: function error(err) {
                wx.showToast({
                    title: err,
                    image: '/public/images/icon_error.png'
                });
            }
        });
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
    onPullDownRefresh: function onPullDownRefresh() {},

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function onReachBottom() {
        var that = this;
        that.setReListMore();
    },

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