var _createPage = require("../createPage");

var _createPage2 = _interopRequireDefault(_createPage);

var _user = require("../../store/user");

var _analysisReport = require("../../services/analysis-report");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

var app = getApp();

Page((0, _createPage2.default)({
    title: "我的地址",
    data: {
        callback: false,
        list: [],
        editData: {
            id: undefined,
            name: "",
            phone: "",
            region: [],
            detail: "",
            isDefault: false
        },
        statusViewConfig: {
            empty: {
                icon: "marker",
                text: "暂无地址，快去添加吧"
            },
            error: {
                icon: "error",
                btnText: "重试"
            }
        }
    },
    onLoad: function onLoad(options) {
        this.setDataByOptions([ "callback" ], options);
        if (options.title) this.title = options.title;
        this.reLoad();
    },
    reLoad: function reLoad() {
        var _this = this;
        this.autoSetStatusView((0, _user.getAddressList)(true), true).then(function(list) {
            _this.setData({
                list: list
            });
        });
    },
    selectItem: function selectItem(_ref) {
        var currentTarget = _ref.currentTarget;
        if (!this.data.callback) return;
        var index = currentTarget.dataset.index;
        app.pageCallBack(this.data.callback, this.data.list[index]);
    },
    setItemDefault: function setItemDefault(_ref2) {
        var _this2 = this;
        var currentTarget = _ref2.currentTarget;
        var _currentTarget$datase = currentTarget.dataset, id = _currentTarget$datase.id, index = _currentTarget$datase.index;
        (0, _user.commitAddress)({
            id: id,
            isDefault: !this.data.list[index].isDefault
        }).then(function(list) {
            _this2.setData({
                list: list
            });
        });
    },
    editItem: function editItem(_ref3) {
        var currentTarget = _ref3.currentTarget;
        this._editChange = false;
        var index = currentTarget.dataset.index;
        this.setData({
            editData: Object.assign({
                id: undefined,
                name: "",
                phone: "",
                region: [],
                detail: "",
                isDefault: false
            }, this.data.list[index])
        });
        this.selectComponent("#edit-view").show();
    },
    editChange: function editChange() {
        this._editChange = true;
    },
    editSubmit: function editSubmit(_ref4) {
        var _this3 = this;
        var detail = _ref4.detail;
        var formId = detail.formId, data = detail.value;
        (0, _analysisReport.reportFormID)(formId);
        data.id = this.data.editData.id;
        (0, _user.commitAddress)(data).then(function(list) {
            _this3.setData({
                list: list
            });
            _this3.autoSetStatusView(list);
            _this3.selectComponent("#edit-view").hide();
        });
    },
    tapMask: function tapMask() {
        var editView = this.selectComponent("#edit-view");
        if (!this._editChange) return editView.hide();
        wx.showModal({
            title: "地址编辑",
            content: "您的改动未提交，确定放弃编辑？",
            confirmColor: "#cc353c",
            success: function success(res) {
                if (!res.confirm) return;
                editView.hide();
            }
        });
    },
    removeItem: function removeItem(_ref5) {
        var _this4 = this;
        var currentTarget = _ref5.currentTarget;
        var id = currentTarget.dataset.id;
        wx.showModal({
            title: "地址管理",
            content: "确定删除此地址？",
            confirmColor: "#cc353c",
            success: function success(res) {
                if (!res.confirm) return;
                (0, _user.removeAddress)(id).then(function(list) {
                    _this4.setData({
                        list: list
                    });
                    _this4.autoSetStatusView(list);
                });
            }
        });
    },
    chooseAddressByWechat: function chooseAddressByWechat() {
        var _this5 = this;
        wx.chooseAddress({
            success: function success(res) {
                var userName = res.userName, telNumber = res.telNumber, provinceName = res.provinceName, cityName = res.cityName, countyName = res.countyName, detailInfo = res.detailInfo;
                (0, _user.commitAddress)({
                    name: userName,
                    phone: telNumber,
                    region: [ provinceName, cityName, countyName ],
                    detail: detailInfo
                }).then(function(list) {
                    _this5.setData({
                        list: list
                    });
                    _this5.autoSetStatusView(list);
                });
            },
            fail: function fail(_ref6) {
                var errMsg = _ref6.errMsg;
                errMsg === "chooseAddress:fail auth deny" ? _this5.selectComponent("#auth-setting-pop").show("通讯地址") : app.textToast(errMsg, true);
            }
        });
    },
    pickerChange: function pickerChange(_ref7) {
        var detail = _ref7.detail;
        this.setData({
            "editData.region": detail.value
        });
        this.editChange();
    }
}));