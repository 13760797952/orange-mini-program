var app = getApp();

Component({
    options: {
        addGlobalClass: true
    },
    /**
     * 组件的属性列表
     */
    properties: {
        hasAuth: {
            type: Boolean,
            value: true
        },
        backgroundColor: {
            type: String,
            value: ""
        },
        copyShow: {
            type: Boolean,
            value: true
        },
        contactShow: {
            type: Boolean,
            value: true
        },
        copyRightShow: {
            type: Boolean,
            value: true
        }
    },
    /**
     * 组件的初始数据
     */
    data: {
        syscfg: {},
        user: {},
        myadpop: {},
        stsModel: false
    },
    /**
     * 组件的方法列表
     */
    methods: {
        checkPop: function checkPop() {
            var that = this;
            // if (this.data.authShow && this.hasAuth) {
            //     app.http({
            //         url: app.apis.get_adpop,
            //         data: {
            //             uid: app.globalData.userInfo.id,
            //         }
            //     }).then(res => {
            //         that.setData({
            //             myadpop: res.data.data,
            //         });
            //     }, err => {
            //         wx.showToast({
            //             title: err,
            //             image: '/public/images/icon_error.png',
            //         });
            //     })
            // }
                },
        adpopClose: function adpopClose() {
            if (this.data.myadpop.adpop_show == 0) {
                this.setData({
                    "myadpop.adpop_show": "1"
                });
            } else {
                this.setData({
                    "myadpop.adpop_show": "0"
                });
            }
        },
        notTouch: function notTouch() {},
        bindCancelGetUserInfoClick: function bindCancelGetUserInfoClick() {
            wx.reLaunch({
                url: "/pages/index/index"
            });
        },
        bindLinkClick: function bindLinkClick(e) {
            app.sitefun.clickObjectLink(e, app);
        },
        bindCopyrightClick: function bindCopyrightClick(e) {
            app.sitefun.clickCopyright(e, app);
        },
        suspendCloseClick: function suspendCloseClick() {
            if (app.sys.suspend.suspend_show == "0") {
                this.setData({
                    "syscfg.suspend.suspend_show": "1"
                });
            } else {
                this.setData({
                    "syscfg.suspend.suspend_show": "0"
                });
            }
        }
    },
    attached: function attached() {
        var _this = this;
        app.getConfig().then(function() {
            _this.setData({
                syscfg: app.sys,
                user: app.globalData.userInfo
            });
            _this.checkPop();
        });
    }
});