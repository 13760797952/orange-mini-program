Object.defineProperty(exports, "__esModule", {
    value: true
});

var _apis;

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

var siteInfo = require("./siteinfo.js");

var moduleName = "&m=slwl_fitment";

var init = siteInfo.siteroot + "?i=" + siteInfo.uniacid + "&c=entry&a=wxapp&do=";

var apis = exports.apis = (_apis = {
    act_one: "smk_act_one",
    get_adpop: "smk_get_adpop",
    act_news: "smk_act_news",
    act_news2: "act_news",
    act_list_nav: "smk_act_list_nav",
    act_list_list: init + "smk_act_list_list" + moduleName,
    smk_act_list_list: "smk_act_list_list",
    actnews_one: "smk_actnews_one",
    adact_one: "smk_adact_one",
    create_user: "smk_create_user",
    calc_config: "smk_calc_config",
    booking_step1: "smk_booking_step1",
    indexdata: "smk_indexdata",
    default_pcl_child: "smk_default_pcl_child",
    term_child: init + "smk_term_child" + moduleName,
    guestbook_config: "smk_guestbook_config",
    guestbook: "smk_guestbook",
    list_nav: "smk_list_nav",
    list_list: "smk_list_list",
    stylist_config: "smk_stylist_config",
    designer_one: "smk_designer_one",
    opus_list: "smk_opus_list",
    pic_tag: "smk_pic_tag",
    pic_list: "smk_pic_list",
    pic_list_single_more: "smk_pic_list_single_more",
    pic_list_Multi_more: "smk_pic_list_Multi_more",
    pic_play_multi: "smk_pic_play_multi",
    smk_pic_play_single: "smk_pic_play_single",
    set_fav: "smk_set_fav",
    reserve_config: "smk_reserve_config",
    reserve_one: "smk_reserve_one",
    reserve_pay: "smk_reserve_pay",
    style_config: "smk_style_config",
    style_post: "smk_style_post"
}, _defineProperty(_apis, "stylist_config", "smk_stylist_config"), _defineProperty(_apis, "designer_list", "smk_designer_list"), 
_defineProperty(_apis, "tt", "smk_tt"), _defineProperty(_apis, "pic_list_fav", "smk_pic_list_fav"), 
_defineProperty(_apis, "pic_list_fav_single_more", "smk_pic_list_fav_single_more"), 
_defineProperty(_apis, "pic_list_fav_multi_more", "smk_pic_list_fav_multi_more"), 
_defineProperty(_apis, "relist", "smk_relist"), _defineProperty(_apis, "booking_step1_get", "smk_booking_step1_get"), 
_defineProperty(_apis, "booking_step2", "smk_booking_step2"), _defineProperty(_apis, "Smk_pic_build_qrcode", "Smk_pic_build_qrcode"), 
_defineProperty(_apis, "Smk_pic_play_picsn", "Smk_pic_play_picsn"), _defineProperty(_apis, "SL_pic_search", "SL_pic_search"), 
_defineProperty(_apis, "smk_config", "smk_config"), _defineProperty(_apis, "site_index_data", "site_index_data"), 
_defineProperty(_apis, "site_search", "site_search"), _defineProperty(_apis, "site_one", "site_one"), 
_defineProperty(_apis, "site_collect", "site_collect"), _defineProperty(_apis, "smk_get_wx_phone", "smk_get_wx_phone"), 
_defineProperty(_apis, "SL_save_form_id", "SL_save_form_id"), _defineProperty(_apis, "SL_panorama", "SL_panorama"), 
_defineProperty(_apis, "SL_panorama_config", "SL_panorama_config"), _defineProperty(_apis, "SL_panorama_one", init + "SL_panorama_one" + moduleName), 
_defineProperty(_apis, "SL_pro_list", "SL_pro_list"), _defineProperty(_apis, "SL_pro_one", "SL_pro_one"), 
_defineProperty(_apis, "SL_pro_collect", "SL_pro_collect"), _defineProperty(_apis, "SL_panorama_collect", "SL_panorama_collect"), 
_apis);

var http = exports.http = function http(_ref) {
    var url = _ref.url, _ref$data = _ref.data, data = _ref$data === undefined ? {} : _ref$data, _ref$method = _ref.method, method = _ref$method === undefined ? "GET" : _ref$method, _ref$contentType = _ref.contentType, contentType = _ref$contentType === undefined ? 0 : _ref$contentType;
    return new Promise(function(resolve, reject) {
        wx.request({
            url: "" + init + url + moduleName,
            method: method,
            data: data,
            header: {
                "content-type": contentType === 0 ? "application/json" : "application/x-www-form-urlencoded"
            },
            success: function success(res) {
                if (res.statusCode != 200) {
                    reject({
                        error: "服务器忙，请稍后重试",
                        code: 500
                    });
                } else {
                    resolve(res.data.data);
                }
            },
            fail: function fail(error) {
                // fail调用接口失败
                reject(error.errMsg);
            }
        });
    });
};