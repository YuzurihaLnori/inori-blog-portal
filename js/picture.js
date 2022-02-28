Vue.createApp({
    data() {
        return {
            pageNo: 1,
            pageSize: 10,
            items: [],
            message: ""
        };
    },
    created: function () {
        this.lazyload();
        this.item();
    },
    methods: {
        item() {
            inori.http.post("/picture/list", {
                "pageNo": this.pageNo,
                "pageSize": 99999
            }).then((resp) => {
                this.items = resp.data.data.records;

                this.lazyload();
            }).catch(() => {
                this.message = "服务器异常，请联系管理员";
                showTips();
            });
        },
        img(item) {
            $("#picture-img").attr("src", item.picturePath);
            let picture_show = $(".picture-show");
            picture_show.fadeIn("fast");
            $("#picture-title").html(item.title);
            $("#picture-date").html(item.createTime);
            $("#picture-address").html(item.address);
            $("#picture-desc").html(item.description);
            picture_show.click(function (event) {
                $(this).fadeOut("fast");
            });
        },
        setMessage(message) {
            this.message = message;
            showTips();
        },
        lazyload() {
            this.$nextTick(function () {
                $(".lazyload").lazyload({effect: "fadeIn"});
            })
        }
    },
    components: {
        inoriHeader: inoriHeader,
        inoriFooter: inoriFooter
    }
}).mount("#main-container");

// 导航栏显示
new Waypoint({
    element: document.getElementById('picture-main'),
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