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
    properties: {
        src: {
            type: String
        },
        poster: {
            type: String,
            value: ""
        }
    }
});