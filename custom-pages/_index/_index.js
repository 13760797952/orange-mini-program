var _pageBehavior = require("../pageBehavior");

var _pageBehavior2 = _interopRequireDefault(_pageBehavior);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

var app = getApp();

Component({
    behaviors: [ _pageBehavior2.default ],
    options: {
        addGlobalClass: true
    },
    data: {
        loadingShow: true,
        markers: [],
        points: [],
        mybanner: {},
        myadsp: {},
        mylist: {},
        // 文章分类
        myListChild: [],
        // 文章子分类
        mynav: {},
        adgroup: {},
        // 组合广告list
        adgroupStyle: "",
        // 组合广告风格
        myDefaultPcl: {},
        // 装修效果图,列表
        myDefaultPclChild: {},
        // 装修效果图,子列表
        titledf1: "",
        titledf2: "",
        titledf3: "",
        titlemore: "",
        titleactnews2: "",
        tabPclId: 0,
        // 当前选中，装修效果图ID
        tabId: 0,
        // 当前选中分类ID
        scrollLeft: 0,
        // 设置装修效果图，点击后，加到最左边
        scrollDf2Left: 0,
        // 设置装修攻略，点击后，加到最左边
        mySeekDesinger: {},
        // 找设计师
        nearbyDistrict: [],
        appurl: "",
        appurlShow: false,
        siteCount: 0,
        lat: "",
        lng: "",
        hiddenMap: false,
        loadmap: false
    },
    created: function created() {
        this.shortcutGroup = "";
        this.allowShare = true;
        //this.title = '首页'
        },
    attached: function attached() {
        var _this = this;
        console.log("default-onLoad");
        this.setData({
            appurl: app.siteInfo.siteroot
        });
        setTimeout(function() {
            if (!app.sys) {
                _this.setData({
                    appurlShow: true
                });
            }
        }, 5e3);
        app.getConfig().then(function() {
            _this.setPageData();
        });
    },
    methods: {
        onShow: function onShow() {
            this.setData({
                hiddenMap: false
            });
        },
        onHide: function onHide() {
            this.setData({
                hiddenMap: true
            });
        },
        mapMarkerTap: function mapMarkerTap(event) {
            var url = "/pages/districtDetail/districtDetail?id=" + event.markerId;
            url && wx.navigateTo({
                url: url
            });
        },
        bindLinkClick: function bindLinkClick(e) {
            app.sitefun.clickObjectLink(e, app);
        },
        setMap: function setMap() {
            var _this2 = this;
            var points = this.data.points;
            this.mapCtx = wx.createMapContext("map");
            var temp = [];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;
            try {
                for (var _iterator = points[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var item = _step.value;
                    if (!item.coordinate_format || !item.coordinate_format.qq) continue;
                    temp.push({
                        id: item.id,
                        latitude: item.coordinate_format.qq.lat,
                        longitude: item.coordinate_format.qq.lng,
                        iconPath: "/public/images/location.png",
                        width: 46,
                        height: 46,
                        callout: {
                            display: "ALWAYS",
                            content: " " + item.title + " ",
                            borderRadius: 4,
                            padding: 4,
                            fontSize: 12,
                            borderWidth: 1,
                            borderColor: "#2fbd80",
                            color: "#ffffff",
                            bgColor: "#2fbd80",
                            textAlign: "left"
                        }
                    });
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
            wx.getLocation({
                type: "wgs84",
                success: function success(res) {
                    _this2.setData({
                        lat: res.latitude,
                        lng: res.longitude
                    });
                    _this2.setData({
                        loadmap: true
                    });
                }
            });
            this.setData({
                markers: temp
            });
            //this.mapCtx.includePoints({ points: temp })
                },
        // 读取页面数据
        setPageData: function setPageData() {
            var _this3 = this;
            app.http({
                url: app.apis.indexdata
            }).then(function(res) {
                _this3.setData({
                    mybanner: res.adv,
                    mynav: res.nav,
                    adgroup: res.adgroup,
                    myadsp: res.adsp,
                    mySeekDesinger: res.seekdesinger,
                    myDefaultPcl: res.pcl,
                    mylist: res.actlist,
                    mynewslist1: res.newslist1,
                    mynewslist2: res.newslist2,
                    points: res.site.worksite,
                    siteCount: res.site.total,
                    nearbyDistrict: res.site.subdistrict
                });
                if (_this3.data.syscfg.defaults.site_show === "1") _this3.setMap();
                _this3.setListData();
                // 组合广告
                                if (res.adgroup != "" && res.adgroup.length == 1) {
                    _this3.setData({
                        adgroupStyle: ""
                    });
                }
                if (res.adgroup != "" && res.adgroup.length == 2) {
                    _this3.setData({
                        adgroupStyle: "pic-2"
                    });
                }
                if (res.adgroup != "" && res.adgroup.length == 3) {
                    _this3.setData({
                        adgroupStyle: "pic-3"
                    });
                }
                // 装修效果图
                                if (_this3.data.myDefaultPcl.length > 0) {
                    _this3.setData({
                        myDefaultPclChild: _this3.data.myDefaultPcl[0].ones
                    });
                }
                wx.setNavigationBarTitle({
                    title: _this3.data.syscfg.config.appname
                });
            }, function(err) {
                wx.showModal({
                    content: err,
                    showCancel: false
                });
            });
        },
        clickSeekDesignerMore: function clickSeekDesignerMore() {
            wx.navigateTo({
                url: "/pages/stylist/stylist"
            });
        },
        pclClick: function pclClick(e) {
            var _this4 = this;
            var tid = e.currentTarget.dataset.id;
            var typeId = e.currentTarget.dataset.typeId;
            this.setData({
                tabPclId: e.currentTarget.dataset.index,
                scrollLeft: 0
            });
            app.http({
                url: app.apis.default_pcl_child,
                data: {
                    tid: tid,
                    typeid: typeId
                }
            }).then(function(res) {
                if (res != "" && res.length > 0) _this4.setData({
                    myDefaultPclChild: res
                }); else _this4.setData({
                    myDefaultPclChild: []
                });
            }, function(err) {
                wx.showToast({
                    title: err,
                    image: "/public/images/icon_error.png"
                });
            });
        },
        clickPclListMore: function clickPclListMore() {
            app.actionRun("@pic");
        },
        /** 数组分割
         * @param  {array}  arr          要分割的数组
         * @param  {int}    group_number 几个一组
         * @return {array}               返回新数组
         */
        splitArray: function splitArray(arr, group_number) {
            var newArr = [];
            var s = parseInt(arr.length / group_number);
            var n = 0;
            for (var i = 1; i <= s; i++) {
                var star = (i - 1) * group_number;
                newArr[n++] = arr.slice(star, star + group_number);
            }
            var y = arr.length - s * group_number;
            if (y > 0) {
                newArr[n++] = arr.slice(s * group_number);
            }
            return newArr;
        },
        setListData: function setListData() {
            var _this5 = this;
            var that = this;
            var datas = [];
            for (var i = 0; i < that.data.mylist.length; i++) {
                datas[i] = new Promise(function(resolve, reject) {
                    wx.request({
                        url: app.apis.term_child,
                        data: {
                            tid: that.data.mylist[i].id
                        },
                        success: function success(res) {
                            if (res.data != "" && res.data.data.length > 0) {
                                resolve(that.splitArray(res.data.data, 8));
                            } else {
                                resolve({});
                            }
                        },
                        error: function error(err) {
                            reject("erreo");
                        }
                    });
                });
            }
            Promise.all(datas).then(function(result) {
                _this5.setData({
                    myListChild: result
                });
                _this5.setData({
                    loadingShow: false
                });
            }).catch(function(error) {
                console.log(error);
            });
        },
        navClick: function navClick(e) {
            this.setData({
                tabId: parseInt(e.currentTarget.dataset.index),
                scrollDf2Left: 0
            });
        },
        listChange: function listChange(e) {
            this.setData({
                tabId: e.detail.current
            });
        },
        clickListMore: function clickListMore() {
            wx.navigateTo({
                url: "/pages/list/list?id=0"
            });
        },
        goToPic: function goToPic(e) {
            app.actionRun(e.currentTarget.dataset.url);
        },
        // 文章更多
        moreClick: function moreClick(e) {
            var term_id = e.currentTarget.dataset.itemid;
            wx.navigateTo({
                url: "/pages/actlist/actlist?tid=" + term_id
            });
        },
        // 文章更多
        moreClick2: function moreClick2(e) {
            var term_id = e.currentTarget.dataset.itemid;
            wx.navigateTo({
                url: "/pages/actlist2/actlist2?tid=" + term_id
            });
        }
    }
});