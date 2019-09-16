var _bubbleBehavior = require("../bubbleBehavior");

var _bubbleBehavior2 = _interopRequireDefault(_bubbleBehavior);

var _utils = require("../../lib/utils");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

var app = getApp();

var shortcutMenu = app.shortcutMenu;

Component({
    behaviors: [ _bubbleBehavior2.default ],
    properties: {
        group: {
            type: String,
            observer: "update"
        },
        update: {
            type: null,
            observer: "update"
        },
        say: {
            type: String,
            observer: "sayObserver"
        },
        sayTime: {
            type: Number,
            value: 5e3
        }
    },
    data: {
        enabled: shortcutMenu.enabled,
        bubbleName: "shortcut-bubble",
        bgClass: (0, _utils.darkOrLight)(shortcutMenu.color || app.commonStyles.themeColor),
        hasMessageItem: false,
        shortcutMenu: shortcutMenu,
        items: [],
        alone: false,
        expand: false,
        maskShow: false,
        sayContent: ""
    },
    attached: function attached() {
        this.setData({
            enabled: shortcutMenu.enabled
        });
        if (this.data.enabled) this.update();
    },
    methods: {
        getPositionFail: function getPositionFail() {
            this.say((this.data.alone ? this.data.items[0].helperSay : "") || shortcutMenu.helperSay, 5e3);
        },
        sayObserver: function sayObserver(content) {
            if (content) this.say(content);
        },
        say: function say(sayContent) {
            var _this = this;
            var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.data.sayTime;
            clearTimeout(this._sayTimeout);
            this.setData({
                sayContent: sayContent
            });
            if (sayContent) {
                this.setData({
                    sayShow: true
                });
                this._sayTimeout = setTimeout(function() {
                    _this.setData({
                        sayShow: false
                    });
                }, time);
            }
        },
        update: function update() {
            var _this2 = this;
            var currentPageUrl = app.getCurrentPageUrl(), groupStrict = this.data.group.startsWith("*"), hasMessageItem = false, items = shortcutMenu.items.filter(function(item) {
                var groupMatch = groupStrict ? "*" + item.group === _this2.data.group : !item.group || item.group === _this2.data.group, isMatch = groupMatch && !(0, 
                _utils.matchUrl)(currentPageUrl, item.action);
                if (isMatch && item.messageItem) hasMessageItem = true;
                return isMatch;
            });
            this.setData({
                items: items,
                hasMessageItem: hasMessageItem,
                alone: items.length === 1,
                enabled: items.length > 0,
                shortcutMenu: shortcutMenu,
                bgClass: (0, _utils.darkOrLight)(shortcutMenu.color || app.commonStyles.themeColor)
            });
        },
        close: function close() {
            this.setData({
                expand: false
            });
        },
        tap: function tap() {
            if (this.data.alone) {
                app.actionRun(this.data.items[0].action);
            } else {
                var toStatus = !this.data.expand;
                if (toStatus) this.setData({
                    maskShow: true
                });
                clearTimeout(this._sayTimeout);
                this.setData({
                    expand: toStatus,
                    sayShow: false
                });
            }
        },
        maskTransitionEnd: function maskTransitionEnd() {
            if (!this.data.expand) {
                this.setData({
                    maskShow: false
                });
            }
        }
    }
});