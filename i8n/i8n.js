Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.setLang = setLang;

exports.setI8n = setI8n;

exports.getLanguage = getLanguage;

var languages = {
    zh_cn: require("./zh-cn"),
    zh_tw: require("./zh-tw")
};

var useLang = "zh_cn";

function setLang(langTag) {
    useLang = langTag;
}

function setI8n(textID) {
    return languages[useLang][textID];
}

function getLanguage() {
    return languages[useLang];
}