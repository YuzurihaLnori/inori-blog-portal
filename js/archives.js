Vue.createApp({
    data() {
        return {
            pageNo: 1,
            pageSize: 99999,
            items: [],
            message: ""
        };
    },
    created: function () {
        this.$nextTick(function () {
            $(".lazyload").lazyload({effect: "fadeIn"});
        });
        this.item();
    },
    methods: {
        item() {
            inori.http.post("/archives/list", {
                "pageNo": this.pageNo,
                "pageSize": this.pageSize
            }).then((resp) => {
                this.items = resp.data.data.records;

                this.$nextTick(function () {
                    load();
                });
            }).catch(() => {
                this.message = "服务器异常，请联系管理员";
                showTips();
            });
        },
        blog(id) {
            inori.http.post("/blog/detail", {
                "blogId": id
            }).then(() => {
                window.location.href = './page/' + id + '.html';
            }).catch(() => {
                this.setMessage("服务器异常，请联系管理员", "butterBar-error");
            });
        },
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

function load() {
    let items = document.querySelectorAll(".timeline li");

    function isElementInViewport(el) {
        let rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    window.addEventListener("load", () => {
        for (let i = 0; i < items.length; i++) {
            if (isElementInViewport(items[i])) {
                if (!items[i].classList.contains("in-view")) {
                    items[i].classList.add("in-view");
                }
            } else if (items[i].classList.contains("in-view")) {
                items[i].classList.remove("in-view");
            }
        }
    });

    window.addEventListener("scroll", () => {
        for (let i = 0; i < items.length; i++) {
            if (isElementInViewport(items[i])) {
                if (!items[i].classList.contains("in-view")) {
                    items[i].classList.add("in-view");
                }
            } else if (items[i].classList.contains("in-view")) {
                items[i].classList.remove("in-view");
            }
        }
    });
}

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