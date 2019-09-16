(function() {
    // Promise.prototype.finally
    if (!Promise.prototype.finally) {
        Promise.prototype.finally = function finallyPolyfill(callback) {
            var constructor = this.constructor;
            return this.then(function(value) {
                return constructor.resolve(callback()).then(function() {
                    return value;
                });
            }, function(reason) {
                return constructor.resolve(callback()).then(function() {
                    throw reason;
                });
            });
        };
    }
    if (!String.prototype.padStart) {
        String.prototype.padStart = function padStart(targetLength, padString) {
            targetLength = targetLength >> 0;
            //truncate if number, or convert non-number to 0
                        padString = String(typeof padString !== "undefined" ? padString : " ");
            if (this.length >= targetLength) {
                return String(this);
            } else {
                targetLength = targetLength - this.length;
                if (targetLength > padString.length) {
                    padString += padString.repeat(targetLength / padString.length);
                    //append to original to ensure we are longer than needed
                                }
                return padString.slice(0, targetLength) + String(this);
            }
        };
    }
    if (!String.prototype.padEnd) {
        String.prototype.padEnd = function padEnd(targetLength, padString) {
            targetLength = targetLength >> 0;
            padString = String(typeof padString !== "undefined" ? padString : " ");
            if (this.length > targetLength) {
                return String(this);
            } else {
                targetLength = targetLength - this.length;
                if (targetLength > padString.length) {
                    padString += padString.repeat(targetLength / padString.length);
                }
                return String(this) + padString.slice(0, targetLength);
            }
        };
    }
    function accAdd(arg1, arg2) {
        var r1, r2, m, c;
        try {
            r1 = arg1.toString().split(".")[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = arg2.toString().split(".")[1].length;
        } catch (e) {
            r2 = 0;
        }
        c = Math.abs(r1 - r2);
        m = Math.pow(10, Math.max(r1, r2));
        if (c > 0) {
            var cm = Math.pow(10, c);
            if (r1 > r2) {
                arg1 = Number(arg1.toString().replace(".", ""));
                arg2 = Number(arg2.toString().replace(".", "")) * cm;
            } else {
                arg1 = Number(arg1.toString().replace(".", "")) * cm;
                arg2 = Number(arg2.toString().replace(".", ""));
            }
        } else {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", ""));
        }
        return (arg1 + arg2) / m;
    }
    Number.prototype.add = function(arg) {
        return accAdd(arg, this);
    };
    function accSub(arg1, arg2) {
        var r1, r2, m, n;
        try {
            r1 = arg1.toString().split(".")[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = arg2.toString().split(".")[1].length;
        } catch (e) {
            r2 = 0;
        }
        m = Math.pow(10, Math.max(r1, r2));
        n = r1 >= r2 ? r1 : r2;
        return ((arg1 * m - arg2 * m) / m).toFixed(n);
    }
    Number.prototype.sub = function(arg) {
        return accSub(this, arg);
    };
    function accMul(arg1, arg2) {
        var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
        try {
            m += s1.split(".")[1].length;
        } catch (e) {}
        try {
            m += s2.split(".")[1].length;
        } catch (e) {}
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
    }
    Number.prototype.mul = function(arg) {
        return accMul(arg, this);
    };
    function accDiv(arg1, arg2) {
        var t1 = 0, t2 = 0, r1, r2;
        try {
            t1 = arg1.toString().split(".")[1].length;
        } catch (e) {}
        try {
            t2 = arg2.toString().split(".")[1].length;
        } catch (e) {}
        r1 = Math.Number(arg1.toString().replace(".", ""));
        r2 = Math.Number(arg2.toString().replace(".", ""));
        return r1 / r2 * Math.pow(10, t2 - t1);
    }
    Number.prototype.div = function(arg) {
        return accDiv(this, arg);
    };
})();