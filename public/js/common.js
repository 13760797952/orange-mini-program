//获取应用实例
var app = getApp();

// 获取系统设置
function getConfig() {
    if (app.sys.appname == undefined || app.sys.appname == null || app.sys.appname == '') {
        wx.request({
            url: app.siteInfo.siteroot + '?i=' + app.siteInfo.uniacid + '&c=entry&a=wxapp&do=smk_config&m=slwl_fitment',
            success: function success(res) {
                // console.log(res);

                if (res.data.data !== null && res.data.data !== undefined && res.data.data !== '') {
                    app.sys = res.data.data;
                    if (app.sys.color.topcolor == undefined || app.sys.color.topcolor == null || app.sys.color.topcolor == '') {
                        app.sys.color.topcolor = '#ffffff';
                    }
                    if (app.sys.color.topfontcolor == undefined || app.sys.color.topfontcolor == null || app.sys.color.topfontcolor == '') {
                        app.sys.color.topfontcolor = '#000000';
                    }
                    if (app.sys.color.maincolor == undefined || app.sys.color.maincolor == null || app.sys.color.maincolor == '') {
                        app.sys.color.maincolor = '#2fbd80';
                    }
                    if (app.sys.color.bottomcolor == undefined || app.sys.color.bottomcolor == null || app.sys.color.bottomcolor == '') {
                        app.sys.color.bottomcolor = '#ffffff';
                    }
                    if (app.sys.color.bottomfontcolor == undefined || app.sys.color.bottomfontcolor == null || app.sys.color.bottomfontcolor == '') {
                        app.sys.color.bottomfontcolor = '#333333';
                    }
                    if (app.sys.color.bottomfonthovercolor == undefined || app.sys.color.bottomfonthovercolor == null || app.sys.color.bottomfonthovercolor == '') {
                        app.sys.color.bottomfonthovercolor = '#2fbd80';
                    }
                    // console.log(app.sys);
                }
            },
            error: function error(err) {
                wx.showToast({
                    title: '读取系统配置出错',
                    image: '/public/images/icon_err.png',
                    duration: 2000
                });
            }
        });
    }
}

getConfig();

/**
 * 数组分割
 * @param  {array}  arr          要分割的数组
 * @param  {int}    group_number 几个一组
 * @return {array}               返回新数组
 */
function splitArray(arr, group_number) {
    var newArr = [];
    var s = parseInt(arr.length / group_number);
    var n = 0;
    for (var i = 1; i <= s; i++) {
        var star = (i - 1) * group_number;
        newArr[n++] = arr.slice(star, star + group_number);
    }
    var y = arr.length - s * group_number;
    if (y > 0) {
        newArr[n++] = arr.slice(s * group_number);
    }
    return newArr;
};