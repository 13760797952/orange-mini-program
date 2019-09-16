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
        multipleSlots: true
    },
    properties: {
        state: {
            type: String,
            value: ""
        },
        config: {
            type: Object,
            value: {}
        }
    }
});