var _commonBehavior = require("../commonBehavior");

var _commonBehavior2 = _interopRequireDefault(_commonBehavior);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

var app = getApp();

function timeFormater(time) {
    var m = String(parseInt(time / 60)), s = String(parseInt(time - m * 60)).padStart(2, "0");
    return m + ":" + s;
}

Component({
    behaviors: [ _commonBehavior2.default ],
    options: {
        addGlobalClass: true
    },
    properties: {
        title: {
            type: String
        },
        src: {
            type: String,
            observer: "update"
        },
        color: {
            type: String,
            value: "rgba(0,0,0,.5)"
        }
    },
    data: {
        duration: 0,
        durationStr: "0:00",
        currentTime: 0,
        currentTimeStr: "0:00",
        loading: false,
        paused: true,
        canPlay: false,
        error: ""
    },
    created: function created() {
        this._audio = wx.createInnerAudioContext();
        this._audio.obeyMuteSwitch = false;
    },
    attached: function attached() {
        var _this = this;
        this.setData({
            duration: this._audio.duration,
            durationStr: timeFormater(this._audio.duration)
        });
        var errorMap = {
            10001: "系统错误",
            10002: "网络错误",
            10003: "文件错误",
            10004: "格式错误",
            "-1": "未知错误"
        };
        this._audio.onCanplay(function() {
            setTimeout(function() {
                _this.setData({
                    canPlay: true,
                    duration: _this._audio.duration,
                    durationStr: timeFormater(_this._audio.duration),
                    paused: _this._audio.paused,
                    loading: false
                });
            }, 100);
        });
        var updatePaused = function updatePaused() {
            return _this.setData({
                paused: _this._audio.paused
            });
        };
        this._audio.onPlay(updatePaused);
        this._audio.onPause(updatePaused);
        this._audio.onEnded(updatePaused);
        this._audio.onTimeUpdate(function() {
            _this.setData({
                loading: false,
                currentTime: _this._audio.currentTime,
                currentTimeStr: timeFormater(_this._audio.currentTime)
            });
        });
        this._audio.onWaiting(function() {
            _this.setData({
                canPlay: false,
                loading: true,
                paused: _this._audio.paused
            });
        });
        this._audio.onError(function(res) {
            _this.setData({
                canPlay: false,
                loading: false,
                paused: false,
                error: errorMap[res.errCode]
            });
        });
    },
    detached: function detached() {
        this._audio.destroy();
    },
    methods: {
        update: function update(src) {
            if (src) this._audio.src = src;
        },
        play: function play() {
            this._audio.play();
        },
        pause: function pause() {
            this._audio.pause();
        },
        toggle: function toggle() {
            this.data.paused ? this._audio.play() : this._audio.pause();
        }
    }
});