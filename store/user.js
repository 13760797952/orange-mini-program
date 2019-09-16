Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.userData = undefined;

exports.saveData = saveData;

exports.getAddressList = getAddressList;

exports.getDefaultAddress = getDefaultAddress;

exports.getAddressByID = getAddressByID;

exports.removeAddress = removeAddress;

exports.commitAddress = commitAddress;

var _site = require("../api/site");

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

var store = {
    userData: {},
    addressList: []
};

var userData = exports.userData = store.userData;

function saveData(userData) {
    Object.assign(store.userData, userData);
}

function getAddressList(ignoreCache) {
    if (!ignoreCache && store.addressList.length) {
        return Promise.resolve(store.addressList);
    } else {
        return siteAPI.getAddressList().then(function(list) {
            return store.addressList = list;
        });
    }
}

function getDefaultAddress() {
    return getAddressList().then(function(list) {
        var item = list.find(function(item) {
            return item.isDefault;
        });
        return item || Promise.reject();
    });
}

function getAddressByID(id) {
    return getAddressList().then(function(list) {
        var item = list.find(function(item) {
            return item.id == id;
        });
        return item || Promise.reject();
    });
}

function removeAddress(id) {
    return siteAPI.removeAddress(id).then(function(sucess) {
        var targetIndex = store.addressList.findIndex(function(item) {
            return item.id == id;
        });
        if (targetIndex !== -1) store.addressList.splice(targetIndex, 1);
        return store.addressList;
    }, function(err) {
        wx.showToast({
            title: "删除失败: " + err,
            icon: "none"
        });
        return Promise.reject(err);
    });
}

function commitAddress(data) {
    return siteAPI.commitAddress(data).then(function(res) {
        var theItem = void 0, methodStr = void 0;
        var sameItem = store.addressList.find(function(item) {
            return item.id == data.id;
        });
        if (sameItem) {
            methodStr = "修改";
            theItem = Object.assign(sameItem, data);
        } else {
            methodStr = "添加";
            theItem = Object.assign({}, data, {
                id: res.id
            });
            store.addressList.push(theItem);
        }
        if (theItem.isDefault) {
            var oldDefault = store.addressList.find(function(item) {
                return item !== theItem && item.isDefault;
            });
            if (oldDefault) oldDefault.isDefault = false;
            store.addressList.sort(function(a, b) {
                return a.isDefault ? -1 : b.isDefault ? 1 : 0;
            });
        }
        wx.showToast({
            title: methodStr + "成功",
            icon: "success",
            duration: 1e3
        });
        return store.addressList;
    }, function(err) {
        wx.showToast({
            title: err,
            icon: "none"
        });
        return Promise.reject(err);
    });
}