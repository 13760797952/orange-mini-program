var app = getApp();

//获取应用实例
Page({
    /**
     * 页面的初始数据
     */
    data: {
        syscfg: {},
        zhshow: false,
        sxshow: false,
        zhkey: "综合",
        sxkey: "",
        qyData: [ {
            name: "斗门区"
        }, {
            name: "金湾区"
        }, {
            name: "香洲区"
        }, {
            name: "坦洲镇"
        } ],
        tpData: [ {
            name: "小户型"
        }, {
            name: "ktv"
        }, {
            name: "商铺"
        }, {
            name: "别墅"
        }, {
            name: "餐厅/酒楼"
        }, {
            name: "普通住宅"
        }, {
            name: "美容/美发"
        }, {
            name: "娱乐场所"
        } ],
        styleData: [ {
            name: "简约"
        }, {
            name: "现代"
        }, {
            name: "中式"
        }, {
            name: "欧式"
        }, {
            name: "美式"
        }, {
            name: "田园"
        }, {
            name: "新古典"
        }, {
            name: "混搭"
        } ],
        ysData: [ {
            name: "3万以下"
        }, {
            name: "3-5万"
        }, {
            name: "5-8万"
        }, {
            name: "8-12万"
        }, {
            name: "12-18万"
        }, {
            name: "18-30万"
        }, {
            name: "30-100万"
        }, {
            name: "一百万以上"
        } ],
        companyList: [ {
            name: "轩怡装饰",
            logo: "http://dev.tailea.com/attachment/images/23/2017/12/sz5lRRjwLL0Z0e0M7HQNWL7WRR7AQw.jpg",
            al: 1700,
            gd: 1511,
            iszx: 1,
            isyhj: 1,
            ys: "先施工后付款",
            imgs: [ "http://dev.tailea.com/attachment/images/23/2017/12/sz5lRRjwLL0Z0e0M7HQNWL7WRR7AQw.jpg", "http://dev.tailea.com/attachment/images/23/2017/12/sz5lRRjwLL0Z0e0M7HQNWL7WRR7AQw.jpg", "http://dev.tailea.com/attachment/images/23/2017/12/sz5lRRjwLL0Z0e0M7HQNWL7WRR7AQw.jpg" ]
        }, {
            name: "轩怡装饰",
            logo: "http://dev.tailea.com/attachment/images/23/2017/12/sz5lRRjwLL0Z0e0M7HQNWL7WRR7AQw.jpg",
            al: 1700,
            gd: 1511,
            iszx: 1,
            isyhj: 1,
            ys: "先施工后付款",
            imgs: [ "http://dev.tailea.com/attachment/images/23/2017/12/sz5lRRjwLL0Z0e0M7HQNWL7WRR7AQw.jpg", "http://dev.tailea.com/attachment/images/23/2017/12/sz5lRRjwLL0Z0e0M7HQNWL7WRR7AQw.jpg", "http://dev.tailea.com/attachment/images/23/2017/12/sz5lRRjwLL0Z0e0M7HQNWL7WRR7AQw.jpg" ]
        }, {
            name: "轩怡装饰",
            logo: "http://dev.tailea.com/attachment/images/23/2017/12/sz5lRRjwLL0Z0e0M7HQNWL7WRR7AQw.jpg",
            al: 1700,
            gd: 1511,
            iszx: 1,
            isyhj: 1,
            ys: "先施工后付款",
            imgs: [ "http://dev.tailea.com/attachment/images/23/2017/12/sz5lRRjwLL0Z0e0M7HQNWL7WRR7AQw.jpg", "http://dev.tailea.com/attachment/images/23/2017/12/sz5lRRjwLL0Z0e0M7HQNWL7WRR7AQw.jpg", "http://dev.tailea.com/attachment/images/23/2017/12/sz5lRRjwLL0Z0e0M7HQNWL7WRR7AQw.jpg" ]
        }, {
            name: "轩怡装饰",
            logo: "http://dev.tailea.com/attachment/images/23/2017/12/sz5lRRjwLL0Z0e0M7HQNWL7WRR7AQw.jpg",
            al: 1700,
            gd: 1511,
            iszx: 1,
            isyhj: 1,
            ys: "先施工后付款",
            imgs: [ "http://dev.tailea.com/attachment/images/23/2017/12/sz5lRRjwLL0Z0e0M7HQNWL7WRR7AQw.jpg", "http://dev.tailea.com/attachment/images/23/2017/12/sz5lRRjwLL0Z0e0M7HQNWL7WRR7AQw.jpg", "http://dev.tailea.com/attachment/images/23/2017/12/sz5lRRjwLL0Z0e0M7HQNWL7WRR7AQw.jpg" ]
        }, {
            name: "轩怡装饰",
            logo: "http://dev.tailea.com/attachment/images/23/2017/12/sz5lRRjwLL0Z0e0M7HQNWL7WRR7AQw.jpg",
            al: 1700,
            gd: 1511,
            iszx: 1,
            isyhj: 1,
            ys: "先施工后付款",
            imgs: [ "http://dev.tailea.com/attachment/images/23/2017/12/sz5lRRjwLL0Z0e0M7HQNWL7WRR7AQw.jpg", "http://dev.tailea.com/attachment/images/23/2017/12/sz5lRRjwLL0Z0e0M7HQNWL7WRR7AQw.jpg", "http://dev.tailea.com/attachment/images/23/2017/12/sz5lRRjwLL0Z0e0M7HQNWL7WRR7AQw.jpg" ]
        }, {
            name: "轩怡装饰",
            logo: "http://dev.tailea.com/attachment/images/23/2017/12/sz5lRRjwLL0Z0e0M7HQNWL7WRR7AQw.jpg",
            al: 1700,
            gd: 1511,
            iszx: 1,
            isyhj: 1,
            ys: "先施工后付款",
            imgs: [ "http://dev.tailea.com/attachment/images/23/2017/12/sz5lRRjwLL0Z0e0M7HQNWL7WRR7AQw.jpg", "http://dev.tailea.com/attachment/images/23/2017/12/sz5lRRjwLL0Z0e0M7HQNWL7WRR7AQw.jpg", "http://dev.tailea.com/attachment/images/23/2017/12/sz5lRRjwLL0Z0e0M7HQNWL7WRR7AQw.jpg" ]
        }, {
            name: "轩怡装饰",
            logo: "http://dev.tailea.com/attachment/images/23/2017/12/sz5lRRjwLL0Z0e0M7HQNWL7WRR7AQw.jpg",
            al: 1700,
            gd: 1511,
            iszx: 1,
            isyhj: 1,
            ys: "先施工后付款",
            imgs: [ "http://dev.tailea.com/attachment/images/23/2017/12/sz5lRRjwLL0Z0e0M7HQNWL7WRR7AQw.jpg", "http://dev.tailea.com/attachment/images/23/2017/12/sz5lRRjwLL0Z0e0M7HQNWL7WRR7AQw.jpg", "http://dev.tailea.com/attachment/images/23/2017/12/sz5lRRjwLL0Z0e0M7HQNWL7WRR7AQw.jpg" ]
        }, {
            name: "轩怡装饰",
            logo: "http://dev.tailea.com/attachment/images/23/2017/12/sz5lRRjwLL0Z0e0M7HQNWL7WRR7AQw.jpg",
            al: 1700,
            gd: 1511,
            iszx: 1,
            isyhj: 1,
            ys: "先施工后付款",
            imgs: [ "http://dev.tailea.com/attachment/images/23/2017/12/sz5lRRjwLL0Z0e0M7HQNWL7WRR7AQw.jpg", "http://dev.tailea.com/attachment/images/23/2017/12/sz5lRRjwLL0Z0e0M7HQNWL7WRR7AQw.jpg", "http://dev.tailea.com/attachment/images/23/2017/12/sz5lRRjwLL0Z0e0M7HQNWL7WRR7AQw.jpg" ]
        } ]
    },
    selectZhData: function selectZhData(e) {
        this.setData({
            zhkey: e.currentTarget.dataset.key,
            zhshow: false
        });
    },
    selectZh: function selectZh() {
        var ss = !this.data.zhshow;
        this.setData({
            zhshow: ss,
            sxshow: false
        });
    },
    searchSx: function searchSx(e) {
        this.setData({
            sxshow: false
        });
    },
    selectSx: function selectSx() {
        var zs = !this.data.sxshow;
        this.setData({
            zhshow: false,
            sxshow: zs
        });
    },
    setSysInfo: function setSysInfo(e) {
        this.setData({
            syscfg: e.detail
        });
        this.configSet();
    },
    onLoad: function onLoad(options) {},
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function onShareAppMessage() {}
});