Component({
    options: {
        addGlobalClass: true
    },
    properties: {
        value: {
            type: Number,
            value: 0,
            observer: "update"
        },
        fixed: {
            type: Number,
            value: 2
        }
    },
    data: {
        int: "0",
        dec: "0"
    },
    methods: {
        update: function update(val) {
            var _this = this;
            return String(val).replace(/(-?\d+)\.?(\d+)?/, function(full, int, dec) {
                dec = (dec || "").padEnd(_this.data.fixed, "0");
                _this.setData({
                    int: int,
                    dec: dec
                });
            });
        }
    }
});