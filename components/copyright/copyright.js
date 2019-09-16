var _commonBehavior = require("../commonBehavior");

var _commonBehavior2 = _interopRequireDefault(_commonBehavior);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

var app = getApp();

var copyright = app.copyright;

Component({
    behaviors: [ _commonBehavior2.default ],
    data: {
        copyright: copyright
    },
    attached: function attached() {
        this.setData({
            copyright: copyright
        });
    }
});