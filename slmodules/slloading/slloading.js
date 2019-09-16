// components/loading/loading.js
var app = getApp();

Component({
    /**
   * 组件的属性列表
   */
    properties: {},
    /**
   * 组件的初始数据
   */
    data: {
        loadingColor: app.maincolor ? app.maincolor : "#2fbd80"
    },
    /**
   * 组件的方法列表
   */
    methods: {
        notTouch: function notTouch() {}
    },
    attached: function attached() {
        this.setData({
            loadingColor: app.maincolor
        });
    }
});