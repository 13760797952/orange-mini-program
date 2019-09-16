var _commonBehavior = require("../commonBehavior");

var _commonBehavior2 = _interopRequireDefault(_commonBehavior);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

var app = getApp();

Component({
    behaviors: [ _commonBehavior2.default ],
    options: {
        addGlobalClass: true
    },
    data: {
        show: false,
        readyHide: false,
        permissionName: ""
    },
    methods: {
        show: function show(permissionName) {
            this.setData({
                permissionName: permissionName,
                show: true
            });
        },
        hide: function hide() {
            this.setData({
                readyHide: true
            });
        },
        onTransitionEnd: function onTransitionEnd() {
            if (this.data.readyHide) this.setData({
                readyHide: false,
                show: false
            });
        }
    }
});