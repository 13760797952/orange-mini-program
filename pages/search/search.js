var _createPageSys = require("../createPageSys");

var _createPageSys2 = _interopRequireDefault(_createPageSys);

var _site = require("../../api/site");

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

Page((0, _createPageSys2.default)({
    /**
     * 页面的初始数据
     */
    data: {
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
        nextPageMulti: 2,
        // 下一页,套图
        nextPageSingle: 2,
        // 下一页,单图
        nextPagePanoram: 2,
        isBottomMulti: false,
        // 是否已到底线，套图
        isBottomSingle: false,
        // 是否已到底线，单图
        isBottomPanoram: false,
        list: [],
        picListMultiNum: 0,
        // 瀑布套图列表,左还是右
        picListSingleNum: 0,
        // 瀑布套图列表,左还是右
        notEmpty: true,
        keyword: "",
        ismore: false,
        listSingle: [],
        listMulti: [],
        tempSingle: [],
        tempMulti: [],
        imgWidth: 0,
        offset: 0,
        singleData: [],
        multiData: [],
        listMode: "immersive-dark"
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
                                scale = imgWidth / oImgW;
                //比例计算
                                imgHeight = oImgH * scale;
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
    goToSearch: function goToSearch(e) {
        var val = e.detail.value.replace(/(^\s*)|(\s*$)/g, "");
        if (!val) return;
        this.setData({
            keyword: val,
            ismore: false
        });
        this.setData({
            nextPageMulti: 2,
            nextPageSingle: 2,
            isBottomMulti: false,
            isBottomSingle: false
        });
        this.search();
    },
    quxiao: function quxiao() {
        wx.navigateBack();
    },
    setPicData: function setPicData(pictype, resdata) {
        var _that$setData2;
        var that = this;
        var list = pictype == "0" ? [].concat(_toConsumableArray(that.data.listMulti)) : [].concat(_toConsumableArray(that.data.listSingle));
        var tmp = pictype == "0" ? [].concat(_toConsumableArray(that.data.listMulti)) : [].concat(_toConsumableArray(that.data.listSingle));
        var data = [].concat(_toConsumableArray(resdata));
        var listname = pictype == "0" ? "listMulti" : "listSingle";
        var tmpname = pictype == "0" ? "tempMulti" : "tempSingle";
        var nextname = pictype == "0" ? "nextPageMulti" : "nextPageSingle";
        var bottomname = pictype == "0" ? "isBottomMulti" : "isBottomSingle";
        var heightdata = pictype == "0" ? "multiData" : "singleData";
        for (var i = 0; i < data.length; i++) {
            var ishas = false;
            for (var j = 0; j < tmp.length; j++) {
                if (tmp[j].id === data[i].id) {
                    ishas = true;
                    break;
                }
            }
            if (!ishas) {
                list.push(data[i]);
            }
        }
        if (resdata.length == 0) {
            that.setData(_defineProperty({}, "" + bottomname, true));
        }
        that.setData((_that$setData2 = {}, _defineProperty(_that$setData2, "" + listname, list), 
        _defineProperty(_that$setData2, "" + tmpname, resdata), _that$setData2));
        if (that.data.ismore) {
            that.setData(_defineProperty({}, "" + nextname, that.data[nextname] + 1));
        }
        var dkey = pictype === "0" ? "listMulti" : "listSingle";
        that.setHeightData(dkey);
        that.setPicListData(pictype);
    },
    search: function search() {
        var _this = this;
        var that = this, page = 0, type = "";
        if (!that.data.ismore) {
            page = 1;
            type = "";
        } else {
            type = that.data.picType;
            if (type === 0) {
                page = that.data.nextPageMulti;
            } else if (type === 1) {
                page = that.data.nextPageSingle;
            } else if (type === 4) {
                page = that.data.nextPagePanoram;
            }
        }
        app.http({
            url: app.apis.SL_pic_search,
            data: {
                page: page,
                type: type,
                key: that.data.keyword,
                uid: that.data.user.id
            }
        }).then(function(res) {
            if (that.data.ismore) {
                if (that.data.picType === 0) {
                    that.setPicData("0", res.multi);
                } else if (that.data.picType === 1) {
                    that.setPicData("1", res.single);
                } else if (that.data.picType === 4) {
                    _this.setData({
                        list: _this.data.list.concat(res.panorama),
                        nextPagePanoram: _this.data.nextPagePanoram + 1
                    });
                    if (res.panorama.length === 0) {
                        _this.setData({
                            isBottomPanoram: true
                        });
                    }
                }
            } else {
                that.setData({
                    "picListMulti.psLeft": [],
                    "picListMulti.psRight": [],
                    "picListSingle.psLeft": [],
                    "picListSingle.psRight": [],
                    nextPagePanoram: 2,
                    isBottomPanoram: false,
                    isBottomMulti: false,
                    isBottomSingle: false,
                    nextPageMulti: 2,
                    nextPageSingle: 2,
                    list: res.panorama
                });
                multiHcol1 = 0;
                multiHcol2 = 0;
                singleHcol1 = 0;
                singleHcol2 = 0;
                that.setPicData("0", res.multi);
                that.setPicData("1", res.single);
            }
        }, function(err) {
            console.log(err);
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
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function onLoad(options) {
        var _this2 = this;
        (0, _site.getPanoramasListConfig)().then(function(_ref) {
            var listMode = _ref.listMode;
            _this2.setData({
                listMode: listMode
            });
        });
        wx.getSystemInfo({
            success: function success(res) {
                var ww = res.windowWidth;
                _this2.setData({
                    imgWidth: 345 / (750 / ww),
                    offset: 100 / (750 / ww)
                });
            }
        });
    },
    // 套图 或 单图，切换
    clickPicType: function clickPicType(e) {
        this.setData({
            picType: parseInt(e.currentTarget.dataset.pictype)
        });
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function onReachBottom() {
        var that = this;
        if (that.data.picType == 0) {
            if (!that.data.isBottomMulti) {
                that.setData({
                    ismore: true
                });
                that.search();
            }
        } else if (that.data.picType == 1) {
            if (!that.data.isBottomSingle) {
                that.setData({
                    ismore: true
                });
                that.search();
            }
        } else if (this.data.picType == 4) {
            if (!that.data.isBottomPanoram) {
                that.setData({
                    ismore: true
                });
                that.search();
            }
        }
    }
}));