Component({
    behaviors: [ "wx://form-field" ],
    properties: {
        step: {
            type: Number,
            value: 1
        },
        min: {
            type: Number,
            value: -Infinity,
            observer: "reCalc"
        },
        max: {
            type: Number,
            value: Infinity,
            observer: "reCalc"
        },
        value: {
            type: Number,
            value: 0,
            observer: "update"
        }
    },
    methods: {
        update: function update(newVal, oldVal) {
            if (Object.is(newVal, oldVal)) return;
            this.triggerEvent("change", {
                value: newVal,
                newVal: newVal,
                oldVal: oldVal
            });
        },
        reCalc: function reCalc() {
            this.calc();
        },
        calc: function calc() {
            var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.data.value;
            var incr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            value = Number(value) || 0;
            value += incr;
            value = Math.min(Math.max(value, this.data.min), this.data.max);
            this.setData({
                value: value
            });
        },
        inputChange: function inputChange(_ref) {
            var detail = _ref.detail;
            if (detail.value === "") return;
            this.calc(detail.value);
        },
        inputBlur: function inputBlur(_ref2) {
            var detail = _ref2.detail;
            this.calc(detail.value);
        },
        add: function add() {
            this.calc(this.data.value, this.data.step);
        },
        sub: function sub() {
            this.calc(this.data.value, -this.data.step);
        }
    }
});