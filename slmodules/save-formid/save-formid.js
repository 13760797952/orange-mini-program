// slmodules/seve-formid/seve-formid.js
var app = getApp();

var isSubmit = true;

var setTime = setTimeout(function() {
    isSubmit = true;
}, 500);

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        items: {
            type: Array,
            value: []
        },
        styleNum: {
            type: Number,
            value: 0
        },
        ctype: {
            type: String,
            value: "mainnav"
        },
        picClass: {
            type: String,
            value: "pic-3"
        },
        guide: {
            type: Object,
            value: {}
        },
        colNum: {
            type: Number,
            value: 5
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
        bindFormClick: function bindFormClick(_ref) {
            var detail = _ref.detail;
            if (isSubmit && detail.formId !== "the formId is a mock one" && app.globalData.userInfo) {
                app.http({
                    url: app.apis.SL_save_form_id + "&uid=" + app.globalData.userInfo.id,
                    method: "POST",
                    data: {
                        formIDs: [ detail.formId ]
                    }
                });
                isSubmit = false;
                clearTimeout(setTime);
                setTime = setTimeout(function() {
                    isSubmit = true;
                }, 500);
            }
            app.actionRun(detail.value.url);
        }
    }
});