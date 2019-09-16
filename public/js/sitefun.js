var _utils = require("../../lib/utils");

var sitefun = {
    clickCopyright: function clickCopyright(e, app) {
        wx.makePhoneCall({
            phoneNumber: app.sys.cpright.tel
        });
    },
    actionMap: function actionMap(toUrl) {
        var actionMap = {
            pic: "@pic",
            site: "@district?name=小区&cid=",
            shop: "@shop",
            tel: ":callPresetPhone",
            location: ":openLocation",
            default: "@index",
            panorama: "@panorama",
            products: "@product",
            ucenter: "@me"
        };
        var _urlParser = (0, _utils.urlParser)(toUrl), pureUrl = _urlParser.pureUrl, options = _urlParser.options;
        if (pureUrl === "article") {
            if (options.type === "product") toUrl = (0, _utils.urlParser)(">product-article", options).url; else if (options.type === "panorama") toUrl = (0, 
            _utils.urlParser)(">panorama-detail", {
                id: options.id
            }).url;
        }
        if (pureUrl === "wxapp") {
            toUrl = ":toPresetWxapp(" + options.id + ")";
        }
        return toUrl = actionMap[toUrl] || toUrl.replace(/^\/pages\/(\w+)\/(\w+)(\?.*)?$/, ">$1$3").replace(/^(?!http)(\w+)(\??.*)$/, ">$1$2");
    },
    clickObjectLink: function clickObjectLink(e, app) {
        var cType = e.currentTarget.dataset.ctype;
        var toUrl = e.currentTarget.dataset.url;
        var mid = e.currentTarget.dataset.index;
        if (cType == "footerNav") {
            app.info.footerNavHover = mid;
        } else if (cType === "adsp") {
            app.info.footerNavHover = -1;
        }
        app.actionRun(toUrl);
    },
    appConfig: function appConfig(app) {
        wx.setNavigationBarTitle({
            title: app.sys.config.appname ? app.sys.config.appname : "小程序标题"
        });
        if (app.sys.color.topcolor != undefined && app.sys.color.topcolor != "") {
            var frontColor = (0, _utils.getLightness)(app.sys.color.topcolor) > .7 ? "#000000" : "#ffffff";
            wx.setNavigationBarColor({
                frontColor: frontColor,
                backgroundColor: app.sys.color.topcolor
            });
        }
    },
    /*获取当前页url*/
    getCurrentPageUrl: function getCurrentPageUrl() {
        var pages = getCurrentPages();
        //获取加载的页面
                var currentPage = pages[pages.length - 1];
        //获取当前页面的对象
                var url = currentPage.route;
        //当前页面url
                return url;
    },
    /*获取当前页带参数的url*/
    getCurrentPageUrlWithArgs: function getCurrentPageUrlWithArgs() {
        var pages = getCurrentPages();
        //获取加载的页面
                var currentPage = pages[pages.length - 1];
        //获取当前页面的对象
                var url = currentPage.route;
        //当前页面url
                var options = currentPage.options;
        //如果要获取url中所带的参数可以查看options
        // console.log(currentPage);
        // console.log(url);
        // console.log(options);
        //拼接url的参数
                var urlWithArgs = url + "?";
        for (var key in options) {
            var value = options[key];
            urlWithArgs += key + "=" + value + "&";
        }
        urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1);
        return urlWithArgs;
    }
};

module.exports = sitefun;