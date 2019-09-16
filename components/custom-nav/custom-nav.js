var _commonBehavior = require("../commonBehavior");

var _commonBehavior2 = _interopRequireDefault(_commonBehavior);

var _utils = require("../../lib/utils");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

var app = getApp();

var customNav = app.customNav;

function pageUrlActionItems(items, pageUrl) {
    return items.map(function(item) {
        if (item.action.indexOf("default") !== -1) item.action = "/pages/index/index";
        var isActive = (0, _utils.matchUrl)(pageUrl, item.action), label = item.label, subItems = Array.isArray(item.items) ? item.items.map(function(subItem) {
            var subActive = (0, _utils.matchUrl)(pageUrl, subItem.action);
            if (subActive) {
                isActive = true;
                label += "·" + subItem.label;
            }
            return Object.assign({}, subItem, {
                isActive: subActive
            });
        }) : [];
        return Object.assign({}, item, {
            label: label,
            isActive: isActive,
            items: subItems
        });
    });
}

Component({
    behaviors: [ _commonBehavior2.default ],
    properties: {
        update: {
            type: null,
            observer: "update"
        }
    },
    data: {
        customNav: customNav,
        items: [],
        menuItems: [],
        menuHoverItemIndex: -1,
        menuShow: false
    },
    methods: {
        update: function update() {
            var currentPageUrl = app.getCurrentPageUrl();
            this.setData({
                customNav: customNav,
                items: pageUrlActionItems(customNav.items, currentPageUrl)
            });
        },
        openMenu: function openMenu(index) {
            var _this = this;
            var menuItems = this.data.items[index].items;
            if (!menuItems || !menuItems.length) return;
            this._menuOpened = true;
            this.setData({
                menuShow: true,
                menuItems: menuItems,
                menuHoverItemIndex: ""
            });
            clearTimeout(this._menuQueryTimeout);
            this._menuQueryTimeout = setTimeout(function() {
                var query = wx.createSelectorQuery().in(_this);
                for (var i = 0; i < menuItems.length; i++) {
                    query.select("#_custom-nav-menu-item_" + i).boundingClientRect();
                }
                query.exec(function(res) {
                    try {
                        _this.menuItemsX = res.map(function(item) {
                            return item.left;
                        });
                    } catch (e) {}
                });
            }, 100);
        },
        closeMenu: function closeMenu() {
            this._menuOpened = false;
            this.setData({
                menuShow: false,
                menuHoverItemIndex: -1
            });
        },
        onTouchStart: function onTouchStart(_ref) {
            var _this2 = this;
            var currentTarget = _ref.currentTarget;
            this._touchStartTimeout = setTimeout(function() {
                _this2.openMenu(currentTarget.dataset.index);
            }, 300);
        },
        onTouchEnd: function onTouchEnd(event) {
            clearTimeout(this._touchStartTimeout);
            if (this._menuOpened) {
                var hoverItem = this.data.menuItems[this.data.menuHoverItemIndex];
                if (hoverItem) app.actionRun(hoverItem.action);
                this.closeMenu();
            }
        },
        onTouchMove: function onTouchMove(_ref2) {
            var touches = _ref2.touches;
            if (!this.menuItemsX || !this._menuOpened) return;
            var x = touches[0].pageX, menuHoverItemIndex = -1;
            this.menuItemsX.forEach(function(current, i) {
                if (x > current) menuHoverItemIndex = i;
            });
            this.setData({
                menuHoverItemIndex: menuHoverItemIndex
            });
        },
        click: function click(event) {
            var _this3 = this;
            var index = event.currentTarget.dataset.index, item = this.data.items[index];
            if (item.isActive) {
                this._navClickTimeout = setTimeout(function() {
                    _this3.openMenu(index);
                }, 100);
                if (item.lastClickTime && event.timeStamp - item.lastClickTime < 300) {
                    clearInterval(this._navClickTimeout);
                    this.triggerEvent("doubletaptab");
                }
                item.lastClickTime = event.timeStamp;
            } else {
                app.actionRun(item.action);
            }
        }
    },
    attached: function attached() {
        this.update();
    }
});