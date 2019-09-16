var _commonBehavior = require("../commonBehavior");

var _commonBehavior2 = _interopRequireDefault(_commonBehavior);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

var app = getApp();

Component({
    behaviors: [ "wx://form-field", _commonBehavior2.default ],
    properties: {
        value: {
            type: Boolean,
            observer: "update"
        }
    },
    methods: {
        update: function update(newVal, oldVal) {
            if (Object.is(newVal, oldVal)) return;
            newVal = !!newVal;
            this.setData({
                value: newVal
            });
            var byUser = this._clickChange;
            this._clickChange = false;
            this.triggerEvent("change", {
                value: newVal,
                newVal: newVal,
                oldVal: oldVal,
                byUser: byUser
            });
        },
        click: function click() {
            this._clickChange = true;
            this.setData({
                value: !this.data.value
            });
        }
    }
});