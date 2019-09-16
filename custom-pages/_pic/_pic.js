var _pageBehavior = require("../pageBehavior");

var _pageBehavior2 = _interopRequireDefault(_pageBehavior);

var _site = require("../../api/site");

var _commonMethod = require("../../pages/commonMethod");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}

function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
            arr2[i] = arr[i];
        }
        return arr2;
    } else {
        return Array.from(arr);
    }
}

// 深蓝网络 Copyright (c) www.zhshenlan.com
var app = getApp();

//获取应用实例
var multiHcol1 = 0, multiHcol2 = 0, singleHcol1 = 0, singleHcol2 = 0;

Component({
    behaviors: [ _pageBehavior2.default ],
    options: {
        addGlobalClass: true
    },
    data: {
        listMode: "immersive-dark",
        list: [],
        pagerLoadingState: "",
        statusViewConfig: {
            empty: {
                icon: "warn",
                text: "还没有全景图"
            },
            error: {
                icon: "error",
                btnText: "重试"
            }
        },
        pagerLoadingConfig: {
            completed: {
                text: "没有更多了"
            }
        },
        picType: 0,
        // 套图=0 or 单图=1
        tabAttr: {
            curHdIndex: -1,
            curBdIndex: -1
        },
        picTagMulti: {},
        // 套图选项
        bakPTM: {},
        // 套图选项，clone
        picTagSingle: {},
        // 单图选项
        bakPTS: {},
        // 单图选项，clone
        picListMulti: {
            psLeft: [],
            psRight: []
        },
        // 套图列表内容
        picListSingle: {
            psLeft: [],
            psRight: []
        },
        // 单图列表内容
        listSingle: [],
        listMulti: [],
        tempSingle: [],
        tempMulti: [],
        nextPageMulti: 2,
        // 下一页,套图
        nextPageSingle: 2,
        // 下一页,单图
        isBottomMulti: false,
        // 是否已到底线，套图
        isBottomSingle: false,
        // 是否已到底线，单图
        picOrderMulti: 0,
        // 排序方式
        picOrderMultiTitle: "综合排序",
        picOrderSingle: 0,
        // 排序方式
        picOrderSingleTitle: "综合排序",
        optionSelectMulti: [],
        // 选择高亮，套图
        optionSelectSingle: [],
        // 选择高亮，单图
        optionSearchStrMulti: "",
        // 选项的值，套图
        optionSearchStrSingle: "",
        // 选项的值，单图
        getParentId: 0,
        // 传过来的父ID
        getOptsId: 0,
        // 传过来的选项分类ID
        picListMultiNum: 0,
        // 瀑布套图列表,左还是右
        picListSingleNum: 0,
        // 瀑布套图列表,左还是右
        notEmpty: true,
        multiHeights: [],
        singleHeights: [],
        imgWidth: 0,
        singleData: [],
        multiData: [],
        offset: 0
    },
    created: function created() {
        this.shortcutGroup = "";
        this.allowShare = true;
        //this.title = '图库'
        },
    attached: function attached() {},
    methods: {
        notTouch: function notTouch() {},
        upDataFn: function upDataFn() {
            var _this = this;
            app.getConfig().then(function() {
                var options = _this.data.options;
                if (options.typeid != undefined) {
                    _this.setData({
                        picType: options.typeid,
                        getParentId: options.pid,
                        getOptsId: options.optsid
                    });
                }
                _this.setPicTag();
                wx.getSystemInfo({
                    success: function success(res) {
                        var ww = res.windowWidth;
                        _this.setData({
                            imgWidth: 345 / (750 / ww),
                            offset: 100 / (750 / ww)
                        });
                        if (_this.data.getParentId == 0) {
                            _this.setPicList();
                        } else _this.setData({
                            notEmpty: false
                        });
                    }
                });
                if (options.typeid != undefined && options.typeid == "0") {
                    _this.setData({
                        optionSearchStrMulti: options.optsid
                    });
                }
                if (options.typeid != undefined && options.typeid == "1") {
                    _this.setData({
                        optionSearchStrSingle: options.optsid
                    });
                }
                (0, _site.getPanoramasListConfig)().then(function(_ref) {
                    var listMode = _ref.listMode;
                    _this.setData({
                        listMode: listMode
                    });
                }).finally(function() {
                    _this.reLoad();
                });
            });
        },
        hideBoxShadow: function hideBoxShadow() {
            this.setData({
                "tabAttr.curBdIndex": -1
            });
        },
        goToPlay: function goToPlay(e) {
            app.singleList = this.data.picListSingle.psLeft.concat(this.data.picListSingle.psRight);
            wx.navigateTo({
                url: e.currentTarget.dataset.purl
            });
        },
        setHeightData: function setHeightData(listkey) {
            var that = this;
            var list = [].concat(_toConsumableArray(this.data[listkey]));
            var oImgH, oImgW, imgWidth, scale, imgHeight, imgData, data, ishas = false, imageId;
            data = listkey === "listMulti" ? [].concat(_toConsumableArray(that.data.multiData)) : [].concat(_toConsumableArray(that.data.singleData));
            for (var i = 0; i < list.length; i++) {
                ishas = false;
                for (var j = 0; j < data.length; j++) {
                    if (list[i].id === data[j].id) {
                        ishas = true;
                        break;
                    }
                }
                if (!ishas) {
                    oImgW = parseFloat(list[i].pic_width);
                    //图片原始宽度
                                        oImgH = parseFloat(list[i].pic_height);
                    //图片原始高度
                                        imgWidth = this.data.imgWidth;
                    //图片设置的宽度
                                        scale = oImgW / imgWidth;
                    //比例计算
                                        imgHeight = oImgH / scale;
                    imageId = list[i].id;
                    imgData = {
                        id: imageId,
                        height: imgHeight + that.data.offset
                    };
                    data.push(imgData);
                    if (listkey === "listMulti") {
                        that.setData({
                            multiData: data
                        });
                    } else {
                        that.setData({
                            singleData: data
                        });
                    }
                }
            }
        },
        setPicListData: function setPicListData(pictype) {
            var _setData;
            var images = pictype == "1" ? [].concat(_toConsumableArray(this.data.tempSingle)) : [].concat(_toConsumableArray(this.data.tempMulti));
            var imgHeight = 0;
            var listData = pictype == "1" ? [].concat(_toConsumableArray(this.data.singleData)) : [].concat(_toConsumableArray(this.data.multiData));
            var col1 = pictype == "1" ? [].concat(_toConsumableArray(this.data.picListSingle.psLeft)) : [].concat(_toConsumableArray(this.data.picListMulti.psLeft));
            var col2 = pictype == "1" ? [].concat(_toConsumableArray(this.data.picListSingle.psRight)) : [].concat(_toConsumableArray(this.data.picListMulti.psRight));
            var picList = pictype == "0" ? "picListMulti" : "picListSingle";
            for (var i = 0; i < images.length; i++) {
                for (var j = 0; j < listData.length; j++) {
                    if (images[i].id === listData[j].id) {
                        imgHeight = listData[j].height;
                        if (pictype == "1") {
                            if (singleHcol1 <= singleHcol2) {
                                singleHcol1 += imgHeight;
                                col1.push(images[i]);
                            } else {
                                singleHcol2 += imgHeight;
                                col2.push(images[i]);
                            }
                        } else {
                            if (multiHcol1 <= multiHcol2) {
                                multiHcol1 += imgHeight;
                                col1.push(images[i]);
                            } else {
                                multiHcol2 += imgHeight;
                                col2.push(images[i]);
                            }
                        }
                    }
                }
            }
            this.setData((_setData = {}, _defineProperty(_setData, picList + ".psLeft", col1), 
            _defineProperty(_setData, picList + ".psRight", col2), _setData));
        },
        autoSetPagerLoading: _commonMethod.autoSetPagerLoading,
        reLoad: function reLoad(ignoreCache) {
            var _this2 = this;
            this._pager = this._pager || (0, _site.getPanoramasListPager)();
            this._pager.load(ignoreCache).then(function(_ref2) {
                var list = _ref2.list;
                _this2.setData({
                    list: list
                });
            });
        },
        // 套图 或 单图，切换
        clickPicType: function clickPicType(e) {
            this.setData({
                picType: e.currentTarget.dataset.tp
            });
            if (this.data.picType === 0) return;
            var _data$picListSingle = this.data.picListSingle, psLeft = _data$picListSingle.psLeft, psRight = _data$picListSingle.psRight;
            if (!psLeft.length && !psRight.length) {
                this.optionGetListSingle();
            }
            if (this.data.picType == "2") this.ifNeedNextPage();
        },
        // 套图 或 单图，选项切换
        clickOrderPanel: function clickOrderPanel(e) {
            var that = this;
            var dataIndex = e.currentTarget.dataset.index;
            if (that.data.tabAttr.curHdIndex == dataIndex) {
                that.setData({
                    "tabAttr.curHdIndex": -1,
                    "tabAttr.curBdIndex": -1
                });
            } else {
                that.setData({
                    "tabAttr.curHdIndex": dataIndex,
                    "tabAttr.curBdIndex": dataIndex
                });
            }
        },
        // 单图 或 套图分类
        setPicTag: function setPicTag() {
            var that = this;
            var _tmp_str_multi = "";
            var _tmp_str_single = "";
            app.http({
                url: app.apis.pic_tag,
                data: {
                    ptype: that.data.picType
                }
            }).then(function(res) {
                var tmp = {}, tmp2 = {}, n = 0;
                for (var i = 0; i < res.single.length; i++) {
                    if (res.single[i].parentid == 0) {
                        n = 0;
                        res.single[i].gl = 0;
                        for (var j = 0; j < res.single.length; j++) {
                            if (res.single[j].parentid == res.single[i].id) {
                                n++;
                            }
                        }
                        tmp[res.single[i].id] = Math.ceil((n + 1) / 3) * 100 + 80;
                    }
                }
                for (var i = 0; i < res.multi.length; i++) {
                    if (res.multi[i].parentid == 0) {
                        res.multi[i].gl = 0;
                        n = 0;
                        for (var j = 0; j < res.multi.length; j++) {
                            if (res.multi[j].parentid == res.multi[i].id) {
                                n++;
                            }
                        }
                        tmp2[res.multi[i].id] = Math.ceil((n + 1) / 3) * 100 + 80;
                    }
                }
                var _obj = JSON.stringify(res.multi);
                var bakPTM = JSON.parse(_obj);
                var _obj2 = JSON.stringify(res.single);
                var bakPTS = JSON.parse(_obj2);
                that.setData({
                    picTagMulti: res.multi,
                    bakPTM: bakPTM,
                    picTagSingle: res.single,
                    bakPTS: bakPTS,
                    multiHeights: tmp2,
                    singleHeights: tmp
                });
                if (that.data.getOptsId > 0 && that.data.picType == 0) {
                    for (var i = 0; i < res.multi.length; i++) {
                        if (res.multi[i].id == that.data.getOptsId) {
                            _tmp_str_multi = res.multi[i].name;
                        }
                    }
                    for (var i = 0; i < res.multi.length; i++) {
                        if (res.multi[i].id == that.data.getParentId) {
                            that.data.picTagMulti[i].name = _tmp_str_multi;
                            that.data.picTagMulti[i].gl = that.data.getOptsId;
                            that.setData({
                                picTagMulti: that.data.picTagMulti
                            });
                            that.optionGetListMulti();
                            break;
                        }
                    }
                } else if (that.data.getOptsId > 0 && that.data.picType == 1) {
                    for (var i = 0; i < res.single.length; i++) {
                        if (res.single[i].id == that.data.getOptsId) {
                            _tmp_str_single = res.single[i].name;
                        }
                    }
                    for (var i = 0; i < res.single.length; i++) {
                        if (res.single[i].id == that.data.getParentId) {
                            that.data.picTagSingle[i].name = _tmp_str_single;
                            that.data.picTagSingle[i].gl = that.data.getOptsId;
                            that.setData({
                                picTagSingle: that.data.picTagSingle
                            });
                            that.optionGetListSingle();
                            break;
                        }
                    }
                }
            }, function(err) {
                wx.showToast({
                    title: err,
                    image: "/public/images/icon_error.png"
                });
            });
        },
        calcHeight: function calcHeight(data) {
            var oImgH, oImgW, imgWidth, scale;
            for (var i = 0; i < data.length; i++) {
                oImgW = parseFloat(data[i].pic_width);
                //图片原始宽度
                                oImgH = parseFloat(data[i].pic_height);
                //图片原始高度
                                imgWidth = this.data.imgWidth;
                //图片设置的宽度
                                scale = oImgW / imgWidth;
                //比例计算
                                data[i].pic_height = (oImgH / scale).toFixed(1);
                data[i].pic_width = imgWidth;
            }
            return data;
        },
        // 单图 或 套图，列表内容
        setPicList: function setPicList() {
            var _this3 = this;
            var that = this;
            app.http({
                url: app.apis.pic_list,
                data: {
                    uid: that.data.user.id
                }
            }).then(function(res) {
                var listMulti = _this3.calcHeight(res.multi);
                var listSingle = _this3.calcHeight(res.single);
                multiHcol1 = 0;
                multiHcol2 = 0;
                singleHcol1 = 0;
                singleHcol2 = 0;
                that.setData({
                    listMulti: listMulti,
                    listSingle: listSingle,
                    tempMulti: listMulti,
                    tempSingle: listSingle,
                    notEmpty: false
                });
                that.setHeightData("listMulti");
                that.setHeightData("listSingle");
                that.setPicListData("0");
                that.setPicListData("1");
            });
        },
        clickOptionOrderSingle: function clickOptionOrderSingle(e) {
            var that = this;
            var dataId = e.currentTarget.dataset.id;
            var dataStr = e.currentTarget.dataset.str;
            that.setData({
                picOrderSingleTitle: dataStr,
                picOrderSingle: dataId
            });
            that.setData({
                "tabAttr.curHdIndex": -1,
                "tabAttr.curBdIndex": -1
            });
            that.optionGetListSingle();
        },
        // 单图，其它，选项中的点击
        clickOptionOtherSingle: function clickOptionOtherSingle(e) {
            var that = this;
            var gl_str = [];
            var dataId = e.currentTarget.dataset.id;
            var dataStr = e.currentTarget.dataset.str;
            var dataParentIndex = e.currentTarget.dataset.parentIndex;
            var bakPTS = that.data.bakPTS;
            if (dataId == 0) {
                that.data.picTagSingle[dataParentIndex].name = bakPTS[dataParentIndex].name;
                that.data.picTagSingle[dataParentIndex].gl = 0;
            } else {
                that.data.picTagSingle[dataParentIndex].name = dataStr;
                that.data.picTagSingle[dataParentIndex].gl = dataId;
            }
            that.setData({
                picTagSingle: that.data.picTagSingle
            });
            that.setData({
                "tabAttr.curHdIndex": -1,
                "tabAttr.curBdIndex": -1
            });
            for (var i = 0; i < that.data.picTagSingle.length; i++) {
                if (that.data.picTagSingle[i].parentid == 0) {
                    gl_str.push(that.data.picTagSingle[i].gl);
                }
            }
            that.setData({
                optionSearchStrSingle: gl_str.join(",")
            });
            that.optionGetListSingle();
        },
        optionGetListSingle: function optionGetListSingle() {
            var _this4 = this;
            var that = this;
            app.http({
                url: app.apis.pic_list_single_more,
                data: {
                    page: 1,
                    odr: that.data.picOrderSingle,
                    ops: that.data.optionSearchStrSingle
                }
            }).then(function(res) {
                singleHcol1 = 0;
                singleHcol2 = 0;
                that.setData({
                    "picListSingle.psLeft": [],
                    "picListSingle.psRight": []
                });
                var single = [].concat(_toConsumableArray(that.data.listSingle));
                var listSingle = _this4.calcHeight(res);
                var data = [].concat(_toConsumableArray(that.data.singleData));
                for (var i = 0; i < listSingle.length; i++) {
                    var ishas = false;
                    for (var j = 0; j < data.length; j++) {
                        if (listSingle[i].id === data[j].id) {
                            ishas = true;
                            break;
                        }
                    }
                    if (!ishas) single.push(listSingle[i]);
                }
                that.setData({
                    listSingle: single,
                    tempSingle: listSingle,
                    nextPageSingle: 2
                });
                that.setHeightData("listSingle");
                that.setPicListData("1");
            }, function(err) {
                wx.showToast({
                    title: err,
                    image: "/public/images/icon_error.png"
                });
            });
        },
        // 单图 more
        getPicSingleMore: function getPicSingleMore() {
            var _this5 = this;
            var that = this;
            if (!that.data.isBottomSingle) {
                app.http({
                    url: app.apis.pic_list_single_more,
                    data: {
                        page: that.data.nextPageSingle,
                        odr: that.data.picOrderSingle,
                        ops: that.data.optionSearchStrSingle,
                        uid: that.data.user.id
                    }
                }).then(function(res) {
                    var listSingle = [].concat(_toConsumableArray(that.data.listSingle));
                    var tmp = [].concat(_toConsumableArray(that.data.listSingle));
                    var data = _this5.calcHeight(res);
                    for (var i = 0; i < data.length; i++) {
                        var ishas = false;
                        for (var j = 0; j < tmp.length; j++) {
                            if (tmp[j].id === data[i].id) {
                                ishas = true;
                                break;
                            }
                        }
                        if (!ishas) {
                            listSingle.push(data[i]);
                        }
                    }
                    if (res.length == 0) {
                        that.setData({
                            isBottomSingle: true
                        });
                    }
                    that.setData({
                        listSingle: listSingle,
                        tempSingle: res,
                        nextPageSingle: that.data.nextPageSingle + 1
                    });
                    that.setHeightData("listSingle");
                    that.setPicListData("1");
                }, function(err) {
                    wx.showToast({
                        title: err,
                        image: "/public/images/icon_error.png"
                    });
                });
            }
        },
        clickOptionOrderMulti: function clickOptionOrderMulti(e) {
            var that = this;
            // console.log(e);
                        var dataId = e.currentTarget.dataset.id;
            var dataStr = e.currentTarget.dataset.str;
            that.setData({
                picOrderMultiTitle: dataStr,
                picOrderMulti: dataId
            });
            that.setData({
                "tabAttr.curHdIndex": -1,
                "tabAttr.curBdIndex": -1
            });
            that.optionGetListMulti();
        },
        // 套图，其它，选项中的点击
        clickOptionOtherMulti: function clickOptionOtherMulti(e) {
            var that = this;
            var gl_str = [];
            var dataId = e.currentTarget.dataset.id;
            var dataStr = e.currentTarget.dataset.str;
            var dataParentIndex = e.currentTarget.dataset.parentIndex;
            var bakPTM = that.data.bakPTM;
            if (dataId == 0) {
                that.data.picTagMulti[dataParentIndex].name = bakPTM[dataParentIndex].name;
                that.data.picTagMulti[dataParentIndex].gl = 0;
            } else {
                that.data.picTagMulti[dataParentIndex].name = dataStr;
                that.data.picTagMulti[dataParentIndex].gl = dataId;
            }
            that.setData({
                picTagMulti: that.data.picTagMulti
            });
            that.setData({
                "tabAttr.curHdIndex": -1,
                "tabAttr.curBdIndex": -1
            });
            for (var i = 0; i < that.data.picTagMulti.length; i++) {
                if (that.data.picTagMulti[i].parentid == 0) {
                    gl_str.push(that.data.picTagMulti[i].gl);
                }
            }
            that.setData({
                optionSearchStrMulti: gl_str.join(",")
            });
            that.optionGetListMulti();
        },
        optionGetListMulti: function optionGetListMulti() {
            var _this6 = this;
            var that = this;
            app.http({
                url: app.apis.pic_list_Multi_more,
                data: {
                    page: 1,
                    odr: that.data.picOrderMulti,
                    ops: that.data.optionSearchStrMulti
                }
            }).then(function(res) {
                that.setData({
                    isBottomMulti: false
                });
                multiHcol1 = 0;
                multiHcol2 = 0;
                that.setData({
                    "picListMulti.psLeft": [],
                    "picListMulti.psRight": []
                });
                var multi = [].concat(_toConsumableArray(that.data.listMulti));
                var listMulti = _this6.calcHeight(res);
                var data = [].concat(_toConsumableArray(that.data.multiData));
                for (var i = 0; i < listMulti.length; i++) {
                    var ishas = false;
                    for (var j = 0; j < data.length; j++) {
                        if (listMulti[i].id === data[j].id) {
                            ishas = true;
                            break;
                        }
                    }
                    if (!ishas) {
                        multi.push(listMulti[i]);
                    }
                }
                that.setData({
                    listMulti: multi,
                    tempMulti: listMulti,
                    nextPageMulti: 2
                });
                that.setHeightData("listMulti");
                that.setPicListData("0");
            }, function(err) {
                wx.showToast({
                    title: err,
                    image: "/public/images/icon_error.png"
                });
            });
        },
        // 套图 more
        getPicMultiMore: function getPicMultiMore() {
            var _this7 = this;
            var that = this;
            if (!that.data.isBottomMulti) {
                app.http({
                    url: app.apis.pic_list_Multi_more,
                    data: {
                        page: that.data.nextPageMulti,
                        odr: that.data.picOrderMulti,
                        ops: that.data.optionSearchStrMulti,
                        uid: that.data.user.id
                    }
                }).then(function(res) {
                    var listMulti = [].concat(_toConsumableArray(that.data.listMulti));
                    var tmp = [].concat(_toConsumableArray(that.data.listMulti));
                    var data = _this7.calcHeight(res);
                    for (var i = 0; i < data.length; i++) {
                        var ishas = false;
                        for (var j = 0; j < tmp.length; j++) {
                            if (tmp[j].id === data[i].id) {
                                ishas = true;
                                break;
                            }
                        }
                        if (!ishas) {
                            listMulti.push(data[i]);
                        }
                    }
                    if (res.length == 0) {
                        that.setData({
                            isBottomMulti: true
                        });
                    }
                    that.setData({
                        listMulti: listMulti,
                        tempMulti: res,
                        nextPageMulti: that.data.nextPageMulti + 1
                    });
                    that.setHeightData("listMulti");
                    that.setPicListData("0");
                }, function(err) {
                    wx.showToast({
                        title: err,
                        image: "/public/images/icon_error.png"
                    });
                });
            }
        },
        nextPage: function nextPage() {
            var _this8 = this;
            if (this._pager && !this._pager.completed) this.autoSetPagerLoading(this._pager.next()).then(function(_ref3) {
                var list = _ref3.list;
                _this8.setData({
                    list: list
                });
            });
        },
        ifNeedNextPage: function ifNeedNextPage() {
            var _this9 = this;
            setTimeout(function() {
                var query = _this9.createSelectorQuery();
                query.selectViewport().boundingClientRect();
                query.select(".products-list").boundingClientRect();
                query.exec(function(res) {
                    try {
                        if (res[1].height <= res[0].height) _this9.nextPage();
                    } catch (e) {}
                });
            }, 100);
        },
        onShow: function onShow() {
            var _this10 = this;
            this._pager && this._pager.silentUpdate(function(list) {
                _this10.setData({
                    list: list
                });
            });
            this.upDataFn();
        },
        /**
         * 页面上拉触底事件的处理函数
         */
        onReachBottom: function onReachBottom() {
            var that = this;
            if (that.data.picType == 0) {
                if (!that.data.isBottomMulti) that.getPicMultiMore();
            } else if (that.data.picType == 1) {
                if (!this.data.isBottomSingle) that.getPicSingleMore();
            } else {
                this.nextPage();
            }
        }
    }
});