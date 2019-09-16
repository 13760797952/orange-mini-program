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
        nodes: {
            type: Array,
            value: [],
            observer: "reCalc"
        }
    },
    methods: {
        reCalc: function reCalc(nodes) {
            if (!Array.isArray(nodes)) return;
            this._images = nodes.reduce(function(images, node) {
                if (node.name === "image") images.push(node.attrs.src);
                return images;
            }, []);
        },
        previewImages: function previewImages(_ref) {
            var currentTarget = _ref.currentTarget;
            wx.previewImage({
                current: currentTarget.dataset.src,
                urls: this._images
            });
        }
    }
});