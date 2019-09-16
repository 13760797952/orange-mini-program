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
        siteVersion: "",
        menusEnabled: "0",
        logo_url: "",
        picType: 0,
        // 套图=0 or 单图=1
        picId: 0,
        picMulti: {},
        //套图内容
        picSingle: {},
        //单图内容
        currPageNum: 1,
        // 当前页面编号
        favStatus: 0,
        // 收藏状态
        currTitle: "",
        // 当前显示 title
        stsModel: false,
        touch: false,
        card: {},
        canvasShow: false,
        openSettingBtnHidden: false,
        thatImgWidth: 0,
        thatImgHeight: 0,
        fenXiangShow: false,
        // 图片预览本地文件路径
        previewthumb_url: null,
        windowWidth: 0,
        // 可使用窗口宽度
        windowHeight: 0,
        // 可使用窗口高度
        ratio: 0,
        // 根据尺寸动态计算 1rpx换算成多少px
        canvasH: 0,
        lastX: 0,
        thatImgUrl: "",
        // 多图轮播时的当前图片地址
        thatImgCode: "",
        //当前图片的唯一编码
        isLeft: false,
        isRight: false,
        isShow: false,
        ewm: "",
        //二维码
        sn: ""
    },
    fenXiangIsShow: function fenXiangIsShow() {
        this.setData({
            fenXiangShow: true
        });
    },
    fenXiangIsHide: function fenXiangIsHide() {
        this.setData({
            fenXiangShow: false
        });
    },
    initData: function initData() {
        if (this.data.picType == "0") {
            // 获取，套图
            this.setPicMulti();
        } else if (this.data.picType == "1") {
            // 获取，单图
            this.setPicSingle(false);
        } else {
            this.setShare();
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function onLoad(options) {
        var _this2 = this;
        if (options.scene) {
            this.setData({
                sn: options.scene
            });
        } else {
            this.setData({
                sn: ""
            });
            this.setData({
                picType: options.type,
                picId: options.id
            });
        }
        app._getConfigPromise.then(function(success) {
            _this2.initData();
        });
    },
    setShare: function setShare() {
        var that = this;
        var data = {
            picsn: that.data.sn,
            uid: that.data.user.id
        };
        app.http({
            url: app.apis.Smk_pic_play_picsn,
            data: data
        }).then(function(res) {
            if (res.pic_type === "0") that.setData({
                picMulti: res,
                favStatus: res.fav,
                picType: 0,
                picId: res.id,
                currTitle: res.smeta[0].title,
                thatImgUrl: res.smeta[0].attr_url
            }); else that.setData({
                picSingle: res,
                favStatus: res.fav,
                picType: 1,
                picId: res.id
            });
            if (res != undefined) {
                that.setData({
                    ewm: res.qrcode_url,
                    thatImgCode: res.picsn
                });
            }
        }, function(err) {
            wx.showToast({
                title: err,
                image: "/public/images/icon_error.png"
            });
        });
    },
    /*
     * 获取，套图
     */
    setPicMulti: function setPicMulti() {
        var that = this;
        var data = {
            id: that.data.picId,
            uid: that.data.user.id
        };
        app.http({
            url: app.apis.pic_play_multi,
            data: data
        }).then(function(res) {
            that.setData({
                picMulti: res,
                favStatus: res.fav
            });
            if (res != undefined) {
                that.setData({
                    currTitle: res.smeta[0].title,
                    thatImgUrl: res.smeta[0].attr_url,
                    ewm: res.qrcode_url,
                    thatImgCode: res.picsn
                });
            }
        }, function(err) {
            wx.showToast({
                title: err,
                image: "/public/images/icon_error.png"
            });
        });
    },
    /*
     * 获取，单图
     */
    setPicSingle: function setPicSingle(isNext) {
        var that = this;
        var data = {
            id: that.data.picId,
            uid: that.data.user.id
        };
        app.http({
            url: app.apis.smk_pic_play_single,
            data: data
        }).then(function(res) {
            that.setData({
                picSingle: res,
                favStatus: res.fav
            });
            if (isNext) that.setData({
                isShow: true
            });
        }, function(err) {
            wx.showToast({
                title: err,
                image: "/public/images/icon_error.png"
            });
        });
    },
    spChange: function spChange(e) {
        var that = this;
        that.setData({
            currPageNum: e.detail.current + 1,
            currTitle: that.data.picMulti.smeta[e.detail.current].title,
            thatImgUrl: this.data.picMulti.smeta[e.detail.current].attr_url,
            ewm: this.data.picMulti.smeta[e.detail.current].qrcode_url
        });
    },
    favClick: function favClick() {
        var that = this;
        var uid = app.globalData.userInfo.id;
        var typeid = that.data.picType;
        var picid = that.data.picId;
        if (uid == "" || typeid === "" || picid == "") {
            wx.showToast({
                title: "输入必需项为空",
                image: "/public/images/icon_err.png",
                duration: 2e3
            });
            return false;
        }
        app.http({
            url: app.apis.set_fav,
            data: {
                uid: uid,
                typeid: typeid,
                picid: picid
            }
        }).then(function(res) {
            wx.showToast({
                title: "操作成功",
                icon: "success",
                duration: 2e3
            });
            that.setData({
                favStatus: res
            });
        }, function(err) {
            wx.showToast({
                title: err,
                image: "/public/images/icon_error.png"
            });
        });
    },
    //点击开始时的时间
    timestart: function timestart(e) {
        if (this.data.picType == 1) {
            this.setData({
                lastX: e.touches[0].pageX
            });
        }
        var _this = this;
        _this.setData({
            timestart: e.timeStamp
        });
    },
    //点击结束的时间
    timeend: function timeend(e) {
        var _this = this;
        _this.setData({
            timeend: e.timeStamp
        });
        this._move = false;
    },
    touchmove: function touchmove(e) {
        var that = this;
        if (that.data.sn) return;
        if (this._move) return;
        var currentX = e.touches[0].pageX;
        var tx = currentX - this.data.lastX;
        var isLeft = true;
        if (tx > 0) {
            isLeft = false;
        }
        this._move = true;
        var singleList = app.singleList, nextid = "";
        for (var i = 0; i < singleList.length; i++) {
            if (singleList[i].id === this.data.picId) {
                if (isLeft) {
                    if (i === 0) {
                        nextid = -1;
                    } else {
                        nextid = singleList[i - 1].id;
                        that.setData({
                            isLeft: true,
                            isRight: false,
                            isShow: false
                        });
                    }
                } else {
                    if (i === singleList.length - 1) {
                        nextid = -1;
                    } else {
                        nextid = singleList[i + 1].id;
                        that.setData({
                            isLeft: false,
                            isRight: true,
                            isShow: false
                        });
                    }
                }
                break;
            }
        }
        if (nextid !== -1) {
            that.setData({
                picId: nextid
            });
            this.setPicSingle(true);
        }
    },
    createCanvasShareImage: function createCanvasShareImage(datas) {
        var that = this;
        // 使用wx.createCanvasContext获取绘图上下文 context
                var context = wx.createCanvasContext("firstCanvas");
        // 绘制图片：图片居中显示在 canvas 中
                var imgWid1 = (750 - 70) / that.data.ratio;
        var imgHei1 = imgWid1 / (datas[0].banner.imgW / datas[0].banner.imgH);
        imgHei1 = imgHei1 > that.data.windowHeight * .6 ? that.data.windowHeight * .6 : imgHei1;
        this.setData({
            canvasH: imgHei1 + (180 + 80) / that.data.ratio,
            thatImgWidth: imgWid1,
            thatImgHeight: imgHei1 + 250 / that.data.ratio
        });
        context.drawImage(datas[0].banner.imgUrl, 0, 0, imgWid1, imgHei1);
        // 设置 canvas 的背景并填充canvas
                context.fillStyle = "#ffffff";
        context.fillRect(0, imgHei1, imgWid1, 250 / that.data.ratio);
        // 设置字体大小、文本颜色
                context.setFontSize(34 / that.data.ratio);
        context.fillStyle = "#000000";
        context.fillText(app.sys.config.appname, 30 / that.data.ratio, imgHei1 + 40 / that.data.ratio + 20);
        // 设置字体大小、文本颜色
                context.setFontSize(30 / that.data.ratio);
        context.fillStyle = "#c00";
        // 计算文本的宽度：measureText() 取到文本的 width
        // let textWidth = context.measureText('长按').width;
        // 绘制居中文本：这个地方的 (x, y)的坐标是在文本的左下角位置
                context.fillText("长按图片识别二维码即可进入", 30 / that.data.ratio, imgHei1 + 40 / that.data.ratio + 20 + 100 / that.data.ratio);
        // 绘制二维码
                var imgWid = 180 / that.data.ratio;
        var imgHei = imgWid;
        // context.save();
        // context.beginPath();
        // context.arc(imgWid / 2 + (imgWid1-imgWid)-25/that.data.ratio, imgHei / 2 + (imgHei1+25/that.data.ratio), imgWid / 2, 0, Math.PI * 2, false);
        // context.clip();//画好了圆 剪切  原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内 这也是我们要save上下文的原因
        // context.closePath();
                context.drawImage(datas[1].ewm.imgUrl, imgWid1 - imgWid - 25 / that.data.ratio, imgHei1 + 25 / that.data.ratio, imgWid, imgHei);
        // context.restore();
                context.draw();
        wx.hideLoading();
        that.setData({
            canvasShow: true
        });
    },
    getSharBanner: function getSharBanner(thatImgUrl, ewm) {
        var that = this;
        wx.showLoading({
            title: "图片生成中"
        });
        // 获取图1信息
        // tip 貌似本地静态文件路径不能作为画布的src参数，网络图片无影响。
                var promise1 = new Promise(function(resolve, reject) {
            wx.getImageInfo({
                src: thatImgUrl,
                success: function success(data) {
                    var imgW = data.width;
                    var imgH = data.height;
                    var imgUrl = data.path;
                    resolve({
                        banner: {
                            imgUrl: imgUrl,
                            imgW: imgW,
                            imgH: imgH
                        }
                    });
                },
                fail: function fail(res) {
                    reject(res);
                }
            });
        });
        // 获取图2信息
                var promise2 = new Promise(function(resolve, reject) {
            wx.getImageInfo({
                src: ewm,
                success: function success(data) {
                    var imgW = data.width;
                    var imgH = data.height;
                    var imgUrl = data.path;
                    resolve({
                        ewm: {
                            imgUrl: imgUrl,
                            imgW: imgW,
                            imgH: imgH
                        }
                    });
                },
                fail: function fail(res) {
                    reject(res);
                }
            });
        });
        // 执行
                Promise.all([ promise1, promise2 ]).then(function(res) {
            that.createCanvasShareImage(res);
        }).catch(function(err) {
            console.log(err);
        });
    },
    buildPosterSaveAlbum: function buildPosterSaveAlbum() {
        var that = this;
        var thatImgUrl = that.data.picType == 0 ? that.data.thatImgUrl : that.data.picSingle.thumb_url;
        var thatImgCode = that.data.picType == 0 ? that.data.thatImgCode : that.data.picSingle.picsn;
        var ewm = that.data.picType == 0 ? that.data.ewm : that.data.picSingle.qrcode_url;
        if (!ewm) {
            app.http({
                url: app.apis.Smk_pic_build_qrcode,
                data: {
                    picsn: thatImgCode
                }
            }).then(function(res) {
                ewm = res.qrcode_url;
                that.getSharBanner(thatImgUrl, ewm);
            }, function(err) {
                wx.showToast({
                    title: err,
                    image: "/public/images/icon_error.png"
                });
            });
        } else {
            that.getSharBanner(thatImgUrl, ewm);
        }
    },
    SaveAlbum: function SaveAlbum() {
        var that = this;
        // 获取宽高
                var wW = that.data.thatImgWidth;
        var wH = that.data.thatImgHeight;
        //destWidth值越大图片越清晰/大小成正比 解决画布模糊的问题
        //详细的参数见画布文档
                wx.canvasToTempFilePath({
            canvasId: "firstCanvas",
            width: wW,
            height: wH,
            destWidth: wW * 3,
            destHeight: wH * 3,
            success: function success(res) {
                // 到page对象的data中
                that.setData({
                    previewthumb_url: res.tempFilePath
                });
                //可写成函数调用 这里不做解释
                                wx.saveImageToPhotosAlbum({
                    filePath: that.data.previewthumb_url,
                    success: function success(res) {
                        //保存成功
                        wx.showToast({
                            title: "已保存到相册"
                        });
                    },
                    fail: function fail(res) {
                        if (res.errMsg = "saveImageToPhotosAlbum:fail auth deny") {
                            that.setData({
                                openSettingBtnHidden: true
                            });
                        }
                    }
                });
            },
            complete: function complete(e) {
                console.log(e.errMsg);
            }
        });
    },
    handleSetting: function handleSetting(e) {
        var that = this;
        // 对用户的设置进行判断，如果没有授权，即使用户返回到保存页面，显示的也是“去授权”按钮；同意授权之后才显示保存按钮
                if (!e.detail.authSetting["scope.writePhotosAlbum"]) {
            wx.showModal({
                title: "警告",
                content: "若不打开授权，则无法将图片保存在相册中！",
                showCancel: false
            });
            that.setData({
                openSettingBtnHidden: true
            });
        } else {
            wx.showModal({
                title: "提示",
                content: "授权成功！",
                showCancel: false
            });
            that.setData({
                openSettingBtnHidden: false
            });
        }
    },
    //保存图片
    saveImg: function saveImg(e) {
        var _this = this;
        var imgurl = e.currentTarget.dataset.imgurl;
        var times = _this.data.timeend - _this.data.timestart;
        var imgurl = e.currentTarget.dataset.imgurl;
        if (times > 300) {
            //图片地址
            var imgUrl = imgurl;
            wx.downloadFile({
                //下载文件资源到本地，客户端直接发起一个 HTTP GET 请求，返回文件的本地临时路径
                url: imgUrl,
                success: function success(res) {
                    // 下载成功后再保存到本地
                    wx.saveImageToPhotosAlbum({
                        filePath: res.tempFilePath,
                        //返回的临时文件路径，下载后的文件会存储到一个临时文件
                        success: function success(rst) {
                            wx.showModal({
                                content: "已保存到系统相册",
                                showCancel: false
                            });
                        }
                    });
                }
            });
        } else {
            var urllist = [ imgurl ];
            wx.previewImage({
                current: imgurl,
                // 当前显示图片的http链接
                urls: urllist
            });
        }
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function onReady() {
        var _this3 = this;
        wx.getSystemInfo({
            success: function success(res) {
                _this3.setData({
                    windowWidth: res.windowWidth,
                    windowHeight: res.windowHeight
                });
                _this3.setData({
                    ratio: 750 / _this3.data.windowWidth
                });
            }
        });
    }
}));