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
    },
    data: {
        version: app.version
    },
    methods: {
        btnTap: function btnTap(_ref) {
            var currentTarget = _ref.currentTarget;
            var state = this.data.state, action = currentTarget.dataset.action;
            this.triggerEvent("btntap", {
                state: state,
                action: action
            });
            if (state) this.triggerEvent(state + "btntap", {
                state: state,
                action: action
            });
            if (action) app.actionRun(action);
        }
    }
});