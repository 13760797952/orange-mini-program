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
    /**
     * 页面的初始数据
     */
    data: {
        tp: "",
        // 显示选择的类型的按钮： 小区或者是装修阶段
        syscfg: {},
        sxShow: false,
        nextPage: 2,
        isBoottom: false,
        sid: "",
        // 装修阶段id
        cid: "",
        // 小区id
        fid: "",
        // 装修风格id
        pid: "",
        // 综合排序id
        xid: "",
        // 装修房型id
        zxjdData: [],
        // 装修阶段集合
        fgData: [],
        // 装修风格
        fxData: [],
        // 装修房型
        xqData: [],
        // 小区
        mainData: [],
        // 当前选择的条件下筛选出来的数据列表结合
        xq: "小区",
        // 当前的选择的小区名称
        zx: "阶段",
        // 当前选择的装修阶段名称
        fg: "风格",
        px: "综合排序",
        fx: "房型",
        loadShow: true,
        heights: {}
    },
    created: function created() {
        this.shortcutGroup = "";
        this.allowShare = true;
        //this.title = '装修工地'
        },
    attached: function attached() {
        var _this = this;
        app.getConfig().then(function() {
            _this.setData({
                xq: _this.data.options.name,
                cid: _this.data.options.cid
            });
            _this.getNavData();
            _this.setGongDiData(false);
        });
    },
    methods: {
        navHide: function navHide() {
            this.setData({
                tp: ""
            });
        },
        // 切换顶部菜单
        activeNav: function activeNav(e) {
            var tp = this.data.tp === e.currentTarget.dataset.tp ? "" : e.currentTarget.dataset.tp;
            this.setData({
                tp: tp
            });
        },
        search: function search(dataset, str, lx, nid) {
            var ty = !dataset.tp ? str : dataset.tp;
            var data = {};
            data[lx] = ty;
            data.tp = "";
            data.page = 1;
            data[nid] = dataset[nid];
            this.setData(data);
            this.setGongDiData(false);
        },
        // 单击选择某个房型
        fxTpClick: function fxTpClick(e) {
            this.search(e.currentTarget.dataset, "房型", "fx", "xid");
        },
        // 单击选择某个综合排序
        pxTpClick: function pxTpClick(e) {
            this.search(e.currentTarget.dataset, "综合排序", "px", "pid");
        },
        // 单击选择某个小区
        xqTpClick: function xqTpClick(e) {
            this.search(e.currentTarget.dataset, "小区", "xq", "cid");
        },
        // 单击选择某个阶段
        zxTpClick: function zxTpClick(e) {
            this.search(e.currentTarget.dataset, "阶段", "zx", "sid");
        },
        // 单击选择某个风格
        fgTpClick: function fgTpClick(e) {
            this.search(e.currentTarget.dataset, "风格", "fg", "fid");
        },
        // 查询工地数据并更新数据
        setGongDiData: function setGongDiData(ismore) {
            var _this2 = this;
            var data = {};
            if (this.data.cid) data.subdistrict = this.data.cid;
            if (this.data.sid) data.progress = this.data.sid;
            if (this.data.xid) data.type = this.data.xid;
            if (this.data.fid) data.style = this.data.fid;
            data.page = ismore ? this.data.nextPage : 1;
            if (this.data.pid) data.order = this.data.pid;
            app.http({
                url: app.apis.site_search,
                data: data,
                method: "POST"
            }).then(function(res) {
                if (res.list_site.length) {
                    if (ismore) _this2.setData({
                        mainData: _this2.data.mainData.concat(res.list_site),
                        nextPage: _this2.data.nextPage + 1
                    }); else _this2.setData({
                        mainData: res.list_site,
                        nextPage: 2,
                        isBoottom: false
                    });
                } else {
                    if (!ismore) _this2.setData({
                        mainData: [],
                        nextPage: 2,
                        isBoottom: false
                    }); else _this2.setData({
                        isBoottom: true
                    });
                }
                _this2.setData({
                    loadShow: false
                });
            });
        },
        getNavData: function getNavData() {
            var _this3 = this;
            app.http({
                url: app.apis.site_index_data
            }).then(function(res) {
                var tmp = {};
                tmp.subdistrict = Math.ceil((res.list_subdistrict.length + 1) / 3) * 100 + 20;
                tmp.style = Math.ceil((res.list_style.length + 1) / 3) * 100 + 20;
                tmp.type = Math.ceil((res.list_type.length + 1) / 3) * 100 + 20;
                tmp.progress = Math.ceil((res.list_progress.length + 1) / 3) * 100 + 20;
                _this3.setData({
                    xqData: res.list_subdistrict,
                    fgData: res.list_style,
                    zxjdData: res.list_progress,
                    fxData: res.list_type,
                    heights: tmp
                });
            });
        },
        /**
         * 页面上拉触底事件的处理函数
         */
        onReachBottom: function onReachBottom() {
            if (this.data.isBoottom) return;
            this.setGongDiData(true);
        }
    }
});