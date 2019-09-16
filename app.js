var _actionMethods, _App;

var _i8n = require("./i8n/i8n");

var _http = require("./http");

var _user = require("./store/user");

require("./lib/polyfill");

var _utils = require("./lib/utils");

var _site = require("./api/site");

var siteAPI = _interopRequireWildcard(_site);

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};
    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }
    newObj.default = obj;
    return newObj;
  }
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  } else {
    return Array.from(arr);
  }
}

var _wx$getSystemInfoSync = wx.getSystemInfoSync(), model = _wx$getSystemInfoSync.model;

var sysModel = /iPhone( X| XR| XS|10,3|10,6|11)/.test(model);

var userInfo = wx.getStorageSync("appUserInfo");

userInfo = userInfo ? userInfo : null;

if (userInfo) (0, _user.saveData)(userInfo);

App((_App = {
  apis: _http.apis,
  http: _http.http,
  cacheData: _http.cacheData,
  info: {
    version: "2.4.8",
    footerNavHover: 0,
    isLoadInterval: "",
    auth: 0
  },
  stsModel: sysModel,
  globalData: {
    userInfo: userInfo
  },
  config: {
    logo: "",
    defaultPage: "@shop",
    defaultTitle: "装修小程序",
    enableMessagesService: false,
    imageHolder: {
      empty: "/images/image-empty.svg",
      error: "/images/image-error.svg"
    }
  },
  sys: null,
  singleList: [],
  maincolor: "",
  moduleName: "slwl_fitment",
  sitefun: require("public/js/sitefun.js"),
  siteInfo: require("siteinfo.js"),
  presetWxapp: [],
  systemInfo: {},
  adapt: {},
  copyright: {},
  onLaunch: function onLaunch(options) {
    console.log("onLaunch");
    this.getConfig();
    try {
      this.adapt.iPhoneX = sysModel;
      var launchCount = wx.getStorageSync("launch-count") || 0;
      wx.setStorageSync("launch-count", launchCount + 1);
    } catch (e) { }
    siteAPI.injectConfig({
      baseURL: this.siteInfo.siteroot,
      params: {
        i: this.siteInfo.uniacid,
        m: this.moduleName,
        c: "entry",
        a: "wxapp",
        ver: this.info.version
      }
    });
  },
  getSizeData: function getSizeData() {
    var _wx$getSystemInfoSync2 = wx.getSystemInfoSync(), statusBarHeight = _wx$getSystemInfoSync2.statusBarHeight, windowWidth = _wx$getSystemInfoSync2.windowWidth, btnRect = wx.getMenuButtonBoundingClientRect(), btnHeight = btnRect.height, btnWidth = btnRect.width, paddingT = btnRect.top - statusBarHeight, paddingR = windowWidth - btnRect.left, titleBarHeight = btnHeight + paddingT * 2;
    return {
      btnWidth: btnWidth,
      btnHeight: btnHeight,
      paddingT: paddingT,
      paddingR: paddingR,
      statusBarHeight: statusBarHeight,
      titleBarHeight: titleBarHeight,
      height: statusBarHeight + titleBarHeight + 6 / 750 * windowWidth
    };
  },
  getConfig: function getConfig() {
    var _this = this;
    return this._getConfigPromise || (this._getConfigPromise = this.http({
      url: this.apis.smk_config
    }).then(function (res) {
      var _presetWxapp;
      (0, _i8n.setLang)(res.lang_name);
      var _res$color = res.color, topcolor = _res$color.topcolor, maincolor = _res$color.maincolor, bottomfonthovercolor = _res$color.bottomfonthovercolor, subcolor = _res$color.subcolor;
      var _res$menus = res.menus, items = _res$menus.items, enabled = _res$menus.enabled;
      if (enabled === "1") {
        var _customNav$items;
        var actionMap = {
          pic: "@pic",
          site: "@district?name=" + (0, _i8n.getLanguage)()["xiaoqu"] + "&cid=",
          shop: "@shop",
          tel: ":callPresetPhone",
          location: ":openLocation",
          default: "@index",
          panorama: "@panorama",
          products: "@product",
          ucenter: "@me"
        };
        _this.customNav.items = [];
        _this.navPages = [];
        (_customNav$items = _this.customNav.items).push.apply(_customNav$items, _toConsumableArray(items.map(function (item) {
          var action = actionMap[item.page_url] ? actionMap[item.page_url] : item.page_url;
          var current = {
            label: item.title,
            icon: item.icon.slice(5),
            action: action
          };
          if (item.page_url === "shop") {
            current.items = [{
              label: (0, _i8n.getLanguage)()["shouye"],
              icon: "home",
              action: "@shop"
            }, {
              label: (0, _i8n.getLanguage)()["fenlei"],
              icon: "category",
              action: "@categories"
            }, {
              label: (0, _i8n.getLanguage)()["gouwuche"],
              icon: "shopcart",
              action: "@shopcart"
            }];
            _this.navPages.push("@shop", "@categories", "@shopcart");
          }
          if (current.action.startsWith("@")) _this.navPages.push(current.action);
          return current;
        })));
      }
      _this.sys = res;
      _this.maincolor = maincolor;
      _this.sys.info = _this.info;
      _this.config.defaultTitle = res.config.appname;
      _this.commonStyles.themeColor = maincolor;
      _this.commonStyles.secondaryColor = subcolor;
      _this.commonStyles.activeColor = maincolor;
      _this.commonStyles.nav.activeColor = bottomfonthovercolor;
      _this.commonStyles.titlebar.backgroundColor = topcolor;
      _this.commonStyles.titlebar.frontColor = (0, _utils.getLightness)(topcolor) > .7 ? "#000000" : "#ffffff";
      _this.commonStyles.themeColorFront = (0, _utils.getLightness)(maincolor) > .7 ? "#000000" : "#ffffff";
      Object.assign(_this.shortcutMenu, {
        enabled: true,
        helperSay: (0, _i8n.getLanguage)()["nhdwsskb"],
        items: [{
          group: "shop",
          label: (0, _i8n.getLanguage)()["shouye"],
          action: "@shop",
          icon: "home"
        }, {
          group: "shop",
          label: (0, _i8n.getLanguage)()["fenlei"],
          action: "@categories",
          icon: "category"
        }, {
          group: "shop",
          label: (0, _i8n.getLanguage)()["gouwuche"],
          action: "@shopcart",
          icon: "shopcart"
        }, {
          group: "shop",
          label: (0, _i8n.getLanguage)()["lianxikefu"],
          action: ":callPresetPhone",
          icon: "service"
        }]
      });
      var copyright = res.cpright;
      Object.assign(_this.copyright, {
        enabled: copyright.enabled_wxapp,
        image: copyright.logo_url,
        owner: copyright.copyright_wxapp_l1,
        more: copyright.copyright_wxapp_l2,
        action: copyright.tel ? ':callPhone("' + copyright.tel + '")' : ""
      });
      (_presetWxapp = _this.presetWxapp).push.apply(_presetWxapp, _toConsumableArray((res.wxapp || []).map(function (item) {
        return {
          id: item.id,
          appID: item.appid,
          path: item.page_page
        };
      })));
      var currentPage = _this._getCurrentPage();
    }, function (err) {
      wx.showModal({
        content: (0, _i8n.getLanguage)()["dqxtpzcc"],
        showCancel: false
      });
    }));
  },
  setUserData: function setUserData() {
    _user.saveData.apply(undefined, arguments);
  },
  organization: {}
}, _defineProperty(_App, "copyright", {}), _defineProperty(_App, "commonStyles", {
  themeColor: "#333",
  secondaryColor: "#525762",
  themeColorFront: "#fff",
  activeColor: "#5c5c5e",
  page: {
    backgroundTopColor: "#f3f3f3",
    backgroundColor: "#f3f3f3",
    backgroundBottomColor: "#f3f3f3",
    backgroundTextStyle: "dark"
  },
  titlebar: {
    frontColor: "#ffffff",
    backgroundColor: "#1d1d21"
  },
  nav: {
    bgColor: "#fff",
    color: "#909090",
    activeColor: "#1d1d21"
  }
}), _defineProperty(_App, "shortcutMenu", {
  enabled: true,
  helperSay: (0, _i8n.getLanguage)()["nhdwsskb"],
  items: [{
    group: "shop",
    label: (0, _i8n.getLanguage)()["shouye"],
    action: "@shop",
    icon: "home"
  }, {
    group: "shop",
    label: (0, _i8n.getLanguage)()["fenlei"],
    action: "@categories",
    icon: "category"
  }, {
    group: "shop",
    label: (0, _i8n.getLanguage)()["gouwuche"],
    action: "@shopcart",
    icon: "shopcart"
  }, {
    group: "shop",
    label: (0, _i8n.getLanguage)()["lianxikefu"],
    action: ":callPresetPhone",
    icon: "service"
  }]
}), _defineProperty(_App, "navPages", []), _defineProperty(_App, "customNav", {
  items: []
}), _defineProperty(_App, "actionMethods", (_actionMethods = {
  openLocation: function openLocation(data) {
    data instanceof Object && wx.openLocation(data);
  },
  copyText: function copyText(string) {
    wx.setClipboardData({
      data: String(string),
      success: function success() {
        wx.showToast({
          title: (0, _i8n.getLanguage)()["yifuzhi"],
          icon: "none",
          duration: 1e3
        });
      }
    });
  },
  callPhone: function callPhone(number) {
    wx.makePhoneCall({
      phoneNumber: String(number)
    });
  }
}, _defineProperty(_actionMethods, "openLocation", function openLocation() {
  wx.openLocation({
    name: this.sys.config.name,
    address: this.sys.config.address,
    latitude: parseFloat(this.sys.config.coordinate.qq.lat),
    longitude: parseFloat(this.sys.config.coordinate.qq.lng),
    scale: 14
  });
}), _defineProperty(_actionMethods, "callPresetPhone", function callPresetPhone() {
  wx.makePhoneCall({
    phoneNumber: this.sys.config.tel
  });
}), _defineProperty(_actionMethods, "navigateBack", function navigateBack() {
  getCurrentPages().length > 1 ? wx.navigateBack() : this.actionRun(app.config.defaultPage);
}), _defineProperty(_actionMethods, "toPresetWxapp", function toPresetWxapp(id) {
  var _this2 = this;
  var wxapp = this.presetWxapp.find(function (item) {
    return item.id == id;
  });
  if (!wxapp) return this.textToast((0, _i8n.getLanguage)()["zhaobudaoidw"] + " " + id + " " + (0,
    _i8n.getLanguage)()["dyzxcx"]);
  wx.navigateToMiniProgram({
    appId: wxapp.appID,
    path: wxapp.path,
    fail: function fail(_ref) {
      var errMsg = _ref.errMsg;
      if (errMsg === "navigateToMiniProgram:fail invalid appid") {
        _this2.textToast((0, _i8n.getLanguage)()["yzxcx"] + " [" + id + "] " + (0, _i8n.getLanguage)()["dappidwx"]);
      } else if (errMsg.endsWith("is not in navigateToMiniProgramAppIdList")) {
        _this2.textToast((0, _i8n.getLanguage)()["yzxcx"] + " [" + id + "] " + (0, _i8n.getLanguage)()["dappidbz"]);
      }
    }
  });
}), _actionMethods)), _defineProperty(_App, "_getCurrentPage", function _getCurrentPage() {
  var pages = getCurrentPages();
  return pages[pages.length - 1];
}), _defineProperty(_App, "getCurrentPageUrl", function getCurrentPageUrl(page, withArgs, real) {
  page = page || this._getCurrentPage();
  if (!page) return "";
  if (!real && page.rewritePageUrl) return page.rewritePageUrl(withArgs);
  var url = "/" + page.route;
  if (withArgs) url += (0, _utils.optionsToQueryString)(page.options);
  return url;
}), _defineProperty(_App, "pageCallBack", function pageCallBack(methodName, data) {
  // 调用上一页的指定方法并传入数据，再返回上一页
  var pages = getCurrentPages();
  var prevPage = pages[pages.length - 2];
  if (!prevPage) return;
  prevPage[methodName](data);
  wx.navigateBack();
}), _defineProperty(_App, "tabs", [">index", ">pic", ">panorama", ">product", "/pages/ucenter/index/index", ">district", "@shop"]),
  _defineProperty(_App, "smartToData", {}), _defineProperty(_App, "smartTo", function smartTo(config) {
    var _this3 = this, _arguments = arguments;
    // 智能跳转：若目标页面为主导航页面，使用switchTab跳转，否则使用navigateTo跳转(若目标页与当前页路径相同，改用redirectTo)
    // 跳转后将触发目标页的onSmartToHere将options和data传入（见onPageShow）
    var currentPage = this._getCurrentPage(), currentPageUrl = this.getCurrentPageUrl(null, false, true), data = config.data, _urlParser = (0,
      _utils.urlParser)(config.url, config.options), url = _urlParser.url, pureUrl = _urlParser.pureUrl, options = _urlParser.options, isMainPage = !!this.navPages.find(function (purl) {
        return (0, _utils.matchUrl)(purl, pureUrl);
      }), isSamePage = !isMainPage && (0, _utils.matchUrl)(currentPageUrl, pureUrl), isTabPage = !!this.tabs.find(function (purl) {
        return (0, _utils.matchUrl)(purl, pureUrl);
      }), method = config.method || (isMainPage ? "switchTab" : isSamePage || isTabPage ? "redirectTo" : "navigateTo");
    if (isMainPage && method === "redirectTo") method = "switchTab";
    if (!["@index"].includes(pureUrl) && !_user.userData.id) {
      var oriUrl = encodeURIComponent(url);
      var _urlParser2 = (0, _utils.urlParser)("/pages/index/index", {
        url: oriUrl
      });
      url = _urlParser2.url;
      pureUrl = _urlParser2.pureUrl;
      options = _urlParser2.options;
      method = "navigateTo";
    } else if (pureUrl.startsWith("@")) {
      //@开头的URL为自定义页面（即动态设置是否为导航页的页面）
      var realUrl = isMainPage ? "/custom-pages/main/main" : "/custom-pages/sub/sub";
      var _urlParser3 = (0, _utils.urlParser)(realUrl, Object.assign({}, options, {
        page: pureUrl.substring(1)
      }));
      url = _urlParser3.url;
      pureUrl = _urlParser3.pureUrl;
      options = _urlParser3.options;
      isSamePage = (0, _utils.matchUrl)(currentPageUrl, pureUrl);
    }
    config.url = method === "switchTab" ? pureUrl : url;
    //switchTab方法URL不能带参数
    if (method === "switchTab" && isSamePage) {
      currentPage.onSmartToHere && currentPage.onSmartToHere({
        options: options,
        data: data,
        method: method
      });
    } else {
      this.smartToData[pureUrl] = {
        options: options,
        data: data,
        method: method
      };
    }
    var oriFail = config.fail;
    config.fail = function (_ref2) {
      var errMsg = _ref2.errMsg;
      if (errMsg.endsWith("is not found")) {
        _this3.textToast((0, _i8n.getLanguage)()["zbdym"] + ": " + pureUrl);
      }
      if (config.failToDefaultPage) {
        _this3.smartTo({
          method: method === "reLaunch" ? "reLaunch" : undefined,
          url: _this3.config.defaultPage
        });
      }
      oriFail && oriFail.apply(undefined, _arguments);
    };
    wx[method](config);
  }), _defineProperty(_App, "actionRun", function actionRun(actionStr) {
    var _this4 = this;
    for (var _len = arguments.length, actionArgs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      actionArgs[_key - 1] = arguments[_key];
    }
    // 公共动作：
    if (!actionStr instanceof String) return;
    if (actionStr === "") return;
    actionStr = this.sitefun.actionMap(actionStr);
    var flag = actionStr.slice(0, 1);
    switch (flag) {
      case "/":
      //左斜杠开头，则作为页面URL跳转
      case ">":
      //大于号开头，作为作为页面简写URL跳转（如/pages/index/index简写为>index）
      case "^":
      //同上
      case "@":
        //自定义页面
        actionStr = actionStr.indexOf("default") !== -1 ? ">index" : actionStr;
        this.smartTo({
          url: actionStr
        });
        break;

      case ":":
        //冒号开头，则调用actionMethods中对应的方法
        actionStr.substring(1).replace(/^(\w+)(?:\((.*)\))?$/, function (full, methodName, args) {
          var fn = methodName ? _this4.actionMethods[methodName] : null;
          if (!fn) return;
          args = args ? JSON.parse("[" + args + "]") : actionArgs;
          fn.apply(_this4, args);
        });
        break;

      default:
        if (actionStr.match(/^https?:/)) {
          this.smartTo({
            url: ">web?url=" + actionStr
          });
        } else {
          this.textToast((0, _i8n.getLanguage)()["wzdz"] + ": " + actionStr);
        }
    }
  }), _defineProperty(_App, "onPageShow", function onPageShow(page) {
    wx.hideTabBar();
    if (page.title) page.setData({
      pageTitle: page.title
    }); else page.setData({
      pageTitle: this.sys.config.appname || this.config.defaultTitle
    });
    this.setPageStyles(page.pageStyles);
    this.setTitlebarStyles(page.titlebarStyles);
    page.allowShare ? wx.showShareMenu() : wx.hideShareMenu();
    var smartToData = this.smartToData["/" + page.route];
    this.smartToData = {};
    smartToData && page.onSmartToHere && page.onSmartToHere(smartToData);
  }), _defineProperty(_App, "setTitlebarStyles", function setTitlebarStyles(styles) {
    styles = Object.assign({}, this.commonStyles.titlebar, styles);
    wx.setNavigationBarColor(styles);
  }), _defineProperty(_App, "setPageStyles", function setPageStyles(styles, write) {
    styles = Object.assign.apply(Object, _toConsumableArray(write ? [] : [{}]).concat([this.commonStyles.page, styles]));
    // 此时页面未必加载完成，设置背景色需延迟
    clearTimeout(this._setPageStylesTimeout);
  }), _defineProperty(_App, "successToast", function successToast(title) {
    wx.showToast({
      title: title,
      icon: "success",
      duration: 1500
    });
  }), _defineProperty(_App, "textToast", function textToast(text, ignoreCancel) {
    if (!text) return;
    if (ignoreCancel && text.endsWith("cancel")) return;
    wx.showToast({
      title: text.toString(),
      icon: "none",
      duration: 2e3
    });
  }), _App));