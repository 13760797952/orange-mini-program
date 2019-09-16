var _commonMethod = require("../pages/commonMethod");

var app = getApp();

module.exports = Behavior({
    data: {
        commonStyles: app.commonStyles
    },
    attached: function attached() {
        this.setData({
            commonStyles: app.commonStyles
        });
    },
    methods: {
        targetDataSet: _commonMethod.targetDataSet,
        targetActionRun: _commonMethod.targetActionRun,
        stopPropagation: _commonMethod.stopPropagation
    }
});