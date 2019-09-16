// pages/fav/fav.js
var app = getApp(); //获取应用实例
var cfg = require('../../public/js/common.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        syscfg: {},
        user: {},
        picType: 0, // 套图=0 or 单图=1

        picListMulti: {}, // 套图列表内容
        picListSingle: {}, // 单图列表内容
        nextPageMulti: 2, // 下一页,套图
        nextPageSingle: 2, // 下一页,单图
        isBottomMulti: false, // 是否已到底线，套图
        isBottomSingle: false // 是否已到底线，单图
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function onLoad(options) {
        var that = this;
        // console.log(app.globalData.userInfo);

        // 获取系统设置
        that.setConfig();

        // 单图/套图，列表内容
        that.setPicListFav();
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

        wx.setNavigationBarColor({
            frontColor: app.sys.color.topfontcolor,
            backgroundColor: app.sys.color.topcolor
        });
    },

    // 套图 或 单图，切换
    clickPicType: function clickPicType() {
        var that = this;
        if (that.data.picType == 0) {
            that.setData({
                picType: 1
            });
        } else {
            that.setData({
                picType: 0
            });
        }
    },

    // 单图 或 套图，列表内容
    setPicListFav: function setPicListFav() {
        var that = this;
        var _pic_tag_multi = {};
        var _pic_tag_single = {};

        wx.request({
            url: app.siteInfo.siteroot + '?i=' + app.siteInfo.uniacid + '&c=entry&a=wxapp&do=smk_pic_list_fav&m=slwl_fitment',
            data: {
                uid: that.data.user.uid
            },
            header: {
                'content-type': 'application/json'
            },
            success: function success(res) {
                console.log(res);
                that.setData({
                    picListMulti: res.data.data.multi,
                    picListSingle: res.data.data.single
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

    // ------------------------------------

    // 单图 more
    getPicSingleMore: function getPicSingleMore() {
        var that = this;

        if (!that.data.isBottomSingle) {
            wx.request({
                url: app.siteInfo.siteroot + '?i=' + app.siteInfo.uniacid + '&c=entry&a=wxapp&do=smk_pic_list_fav_single_more&m=slwl_fitment',
                header: {
                    'content-type': 'application/json'
                },
                data: {
                    page: that.data.nextPageSingle,
                    uid: that.data.user.uid
                },
                success: function success(res) {
                    // console.log(res);

                    for (var i = 0; i < res.data.data.length; i++) {
                        // console.log(i + 'sdfsdfsdf');

                        that.data.picListSingle.push(res.data.data[i]);
                    }

                    if (res.data.data.length == 0) {
                        that.setData({
                            isBottomSingle: true
                        });
                    }

                    that.setData({
                        picListSingle: that.data.picListSingle,
                        nextPageSingle: that.data.nextPageSingle + 1
                    });
                },
                error: function error(err) {
                    wx.showToast({
                        title: err,
                        image: '/public/images/icon_error.png'
                    });
                }
            });
        }
    },

    // ------------------------------------

    // 套图 more
    getPicMultiMore: function getPicMultiMore() {
        var that = this;

        if (!that.data.isBottomMulti) {
            wx.request({
                url: app.siteInfo.siteroot + '?i=' + app.siteInfo.uniacid + '&c=entry&a=wxapp&do=smk_pic_list_fav_multi_more&m=slwl_fitment',
                header: {
                    'content-type': 'application/json'
                },
                data: {
                    page: that.data.nextPageMulti,
                    uid: that.data.user.uid
                },
                success: function success(res) {
                    console.log(res);

                    for (var i = 0; i < res.data.data.length; i++) {
                        // console.log(i + 'sdfsdfsdf');

                        that.data.picListMulti.push(res.data.data[i]);
                    }

                    if (res.data.data.length == 0) {
                        that.setData({
                            isBottomMulti: true
                        });
                    }

                    that.setData({
                        picListMulti: that.data.picListMulti,
                        nextPageMulti: that.data.nextPageMulti + 1
                    });
                },
                error: function error(err) {
                    wx.showToast({
                        title: err,
                        image: '/public/images/icon_error.png'
                    });
                }
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
    onPullDownRefresh: function onPullDownRefresh() {},

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function onReachBottom() {
        var that = this;
        if (that.data.picType == 0) {
            that.getPicMultiMore();
        } else if (that.data.picType == 1) {
            that.getPicSingleMore();
        }
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