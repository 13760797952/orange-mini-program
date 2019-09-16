// slmodules/sllist/sllist.js
Component({
    /**
   * 组件的属性列表
   */
    properties: {
        styleType: {
            type: Number,
            value: 0
        },
        listData: {
            type: Array,
            value: []
        },
        initUrl: {
            type: String,
            value: "/pages/article/article?type=actnews&id="
        },
        imgUrlKey: {
            type: String,
            value: "thumb_url"
        },
        createTimeKey: {
            type: String,
            value: "createtime_cn"
        },
        titleKey: {
            type: String,
            value: "name"
        }
    },
    /**
   * 组件的初始数据
   */
    data: {},
    /**
   * 组件的方法列表
   */
    methods: {
        goToDetail: function goToDetail(e) {
            var url = e.currentTarget.dataset.url;
            wx.navigateTo({
                url: url
            });
        }
    },
    ready: function ready() {}
});