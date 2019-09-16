var _commonMethod = require("../../pages/commonMethod");

Component({
    properties: {
        isShow: {
            type: Boolean,
            value: false
        },
        tapMaskHide: {
            type: Boolean,
            value: true
        },
        top: Boolean,
        bottom: Boolean,
        left: Boolean,
        right: Boolean,
        ipxStyle: {
            type: String,
            value: ""
        }
    },
    data: {
        isReady: false,
        show: false,
        contentWrapStyle: "",
        contentStyle: ""
    },
    attached: function attached() {
        var _data = this.data, contentWrapStyle = _data.contentWrapStyle, contentStyle = _data.contentStyle;
        var _data2 = this.data, top = _data2.top, bottom = _data2.bottom, left = _data2.left, right = _data2.right;
        switch (true) {
          case top:
            contentWrapStyle += "width: 100%; left: 0; top:0; transform: translateY(-100%) translateZ(0);";
            break;

          case left:
            contentWrapStyle += "left: 0; top:0; transform: translateX(-100%) translateZ(0);";
            break;

          case right:
            contentWrapStyle += "right: 0; top:0; transform: translateX(100%) translateZ(0);";
            break;

          case bottom:
            contentWrapStyle += "width: 100%; left: 0; bottom:0; transform: translateY(100%) translateZ(0);";
            break;

          default:
            contentWrapStyle += "left: 50%; top: 50%; opacity:0;";
            contentStyle += "transform: translate3D(-50%,-50%,0);";
        }
        this.setData({
            contentWrapStyle: contentWrapStyle,
            contentStyle: contentStyle,
            isReady: true
        });
    },
    ready: function ready() {
        this.data.isShow && this.show();
    },
    methods: {
        show: function show() {
            this.setData({
                show: true
            });
        },
        hide: function hide() {
            this.setData({
                show: false
            });
        },
        toggle: function toggle() {
            this.setData({
                show: !this.data.show
            });
        },
        tapMask: function tapMask() {
            this.data.tapMaskHide && this.hide();
            this.triggerEvent("tapmask");
        },
        stopPropagation: _commonMethod.stopPropagation
    }
});