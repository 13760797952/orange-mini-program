Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.updateNewMessages = updateNewMessages;

exports.start = start;

exports.stop = stop;

exports.broadcast = broadcast;

exports.addReceiver = addReceiver;

exports.removeReceiver = removeReceiver;

exports.getMsgList = getMsgList;

var _site = require("../api/site");

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

var interval = void 0;

var msgList = [];

var receivers = new Map();

function updateNewMessages() {
    (0, _site.getNewMessages)().then(function(list) {
        if (list.length > 0) {
            msgList.push.apply(msgList, _toConsumableArray(list));
            broadcast(list.length);
        }
    });
}

function start() {
    var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2e3;
    stop();
    interval = setInterval(updateNewMessages, delay);
}

function stop() {
    clearInterval(interval);
    interval = null;
    msgList.length = 0;
}

function broadcast(addNum) {
    var updateData = {
        msgList: msgList,
        addNum: addNum
    };
    receivers.forEach(function(methodName, receiver) {
        receiver[methodName](updateData);
    });
}

function addReceiver(receiver, methodName) {
    receivers.set(receiver, methodName);
}

function removeReceiver(receiver) {
    receivers.delete(receiver);
}

function getMsgList() {
    return msgList;
}