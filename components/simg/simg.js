var _commonBehavior = require("../commonBehavior");

var _commonBehavior2 = _interopRequireDefault(_commonBehavior);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

var app = getApp();

var imageHolder = app.config.imageHolder;

Component({
    properties: {
        src: {
            type: String,
            observer: "update"
        },
        mode: String,
        lazyLoad: Boolean,
        emptyConfig: {
            type: Object,
            value: {
                src: imageHolder.empty,
                mode: "aspectFit"
            }
        },
        errorConfig: {
            type: Object,
            value: {
                src: imageHolder.error,
                mode: "aspectFit"
            }
        }
    },
    data: {
        isError: false,
        useConfig: {}
    },
    attached: function attached() {
        this.update(this.data.src);
    },
    methods: {
        update: function update(newSrc) {
            if (!newSrc) return this.setError(this.data.emptyConfig);
            this.setData({
                isError: false
            });
        },
        onError: function onError() {
            this.setError(this.data.errorConfig);
        },
        setError: function setError(useConfig) {
            this.setData({
                isError: true,
                useConfig: useConfig
            });
        }
    }
});