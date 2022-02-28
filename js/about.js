Vue.createApp({
    created: function () {
        this.$nextTick(function () {
            $(".lazyload").lazyload({effect: "fadeIn"});
        })
    },
    methods: {
        setMessage(message) {
            this.message = message;
            showTips();
        }
    },
    components: {
        inoriHeader: inoriHeader,
        inoriFooter: inoriFooter
    }
}).mount("#main-container");

// 导航栏显示
new Waypoint({
    element: document.getElementById('page'),
    handler: function (direction) {
        if (direction === 'down') {
            $('.back-to-top').show(0).css('top', '-200px');
            $('#mobile-top').show(0);
        } else {
            $('.back-to-top').hide(200).css('top', '-999px');
            $('#mobile-top').hide(200);
        }
    }
});