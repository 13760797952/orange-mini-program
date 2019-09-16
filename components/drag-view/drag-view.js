Component({
    options: {
        multipleSlots: true
    },
    properties: {},
    data: {
        viewStyle: "",
        contentStyle: "",
        expandStyle: "",
        x: 0
    },
    ready: function ready() {
        var _this = this;
        var query = wx.createSelectorQuery().in(this);
        query.select("._drag-view-content").boundingClientRect(function(res) {
            if (!res) return;
            _this._contentWidth = res.width;
            _this._contentHeight = res.height;
        });
        query.select("._drag-view-expand").boundingClientRect(function(res) {
            if (!res) return;
            _this._expandWidth = res.width;
            _this._threshold = res.width / 2;
        });
        query.exec(function() {
            _this.setData({
                contentStyle: "width: " + _this._contentWidth + "px",
                expandStyle: "width: " + _this._expandWidth + "px",
                viewStyle: "width: " + (_this._contentWidth + _this._expandWidth) + "px; display: flex"
            });
        });
    },
    methods: {
        onTouchStart: function onTouchStart(e) {
            this._startX = e.changedTouches[0].pageX;
        },
        onTouchEnd: function onTouchEnd(e) {
            this._endX = e.changedTouches[0].pageX;
            var _endX = this._endX, _startX = this._startX, _threshold = this._threshold;
            if (_startX - _endX >= _threshold) {
                this.data.x = -this._expandWidth;
            } else {
                this.data.x = 0;
            }
            this.setData({
                x: this.data.x
            });
        }
    }
});