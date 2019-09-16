Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.reportFormID = reportFormID;

exports.reportUserBehavior = reportUserBehavior;

var _utils = require("../lib/utils");

var _site = require("../api/site");

var formIDs = new Set();

var reportAllFormIDs = (0, _utils.throttling)(function() {
    (0, _site.commitFormID)(Array.from(formIDs));
    formIDs.clear();
}, 1e3);

function reportFormID(newID) {
    if (!newID || newID === "the formId is a mock one") return;
    formIDs.add(newID);
    reportAllFormIDs();
}

function reportUserBehavior(code, data) {
    (0, _site.reportUserBehavior)(code, data);
    console.log("reportUserBehavior", code, data);
}