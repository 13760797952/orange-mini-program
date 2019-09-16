Component({
    properties: {
        expand: {
            type: Boolean,
            value: false
        },
        data: {
            type: Object,
            value: {}
        },
        btnText: {
            type: String,
            value: ""
        }
    },
    methods: {
        itemBtnTap: function itemBtnTap() {
            this.triggerEvent("itembtntap", {
                data: this.data.data
            });
        },
        itemTap: function itemTap() {
            this.triggerEvent("itemtap", {
                data: this.data.data
            });
        },
        itemToggle: function itemToggle() {
            this.setData({
                expand: !this.data.expand
            });
        }
    }
});