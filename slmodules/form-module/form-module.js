// slmodules/form-module/form-module.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {},
    /**
     * 组件的初始数据
     */
    data: {
        selectIndex: 0,
        date: undefined,
        checkVal: undefined,
        radioVal: undefined,
        formData: [ {
            type: "input",
            name: "input1",
            placeholder: "请输入",
            label: "姓名"
        }, {
            type: "checkbox",
            name: "checkbox1",
            label: "颜色",
            checks: [ {
                id: 1,
                name: "check1",
                value: "红",
                checked: false
            }, {
                id: 2,
                name: "check2",
                value: "黄",
                checked: false
            }, {
                id: 3,
                name: "check3",
                value: "蓝",
                checked: false
            } ]
        }, {
            type: "radio",
            name: "radio1",
            label: "大小",
            radios: [ {
                id: 1,
                name: "radio1",
                value: "大",
                checked: false
            }, {
                id: 2,
                name: "radio2",
                value: "中",
                checked: false
            }, {
                id: 3,
                name: "radio3",
                value: "小",
                checked: false
            } ]
        }, {
            type: "select",
            name: "select1",
            label: "地区",
            selects: [ "日本", "韩国", "马来西亚", "泰国", "新加坡" ]
        }, {
            type: "date",
            name: "date1",
            label: "日期",
            startDate: "2016-09-01",
            endDate: "2019-09-01"
        }, {
            type: "textarea",
            name: "textarea1",
            label: "留言",
            placeholder: "请输入"
        } ]
    },
    /**
     * 组件的方法列表
     */
    methods: {
        formSubmit: function formSubmit(e) {
            console.log(e);
        },
        formReset: function formReset(e) {
            console.log(e);
        },
        checkboxChange: function checkboxChange(e) {
            this.setData({
                checkVal: e.detail.value
            });
        },
        radioChange: function radioChange(e) {
            this.setData({
                radioVal: e.detail.value
            });
        },
        selectChange: function selectChange(e) {
            this.setData({
                selectIndex: e.detail.value
            });
        },
        bindDateChange: function bindDateChange(e) {
            this.setData({
                date: e.detail.value
            });
        }
    }
});