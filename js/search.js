Vue.createApp({
    data() {
        return {
            pageNo: 1,
            pageSize: 10,
            total: 0,
            items: [],
            title: "",
            keywords: "",
            message: ""
        };
    },
    created: function () {
        this.lazyload();
        let keywords = location.search.substring(1);
        let indexOf = keywords.indexOf("=");
        if (keywords.substring(0, indexOf) === "keywords") {
            let result = decodeURI(keywords.substring(indexOf + 1, keywords.length));
            this.title = result;
            this.keywords = result;
        }
        this.item();
    },
    methods: {
        item() {
            inori.http.post("/search/list", {
                "pageNo": this.pageNo,
                "pageSize": this.pageSize,
                "keywords": this.keywords
            }).then((resp) => {
                let result = resp.data;
                this.total = result.data.total;
                result.data.records.forEach(item => this.items.push(item));

                this.lazyload();
            }).catch(() => {
                this.setMessage("服务器异常，请联系管理员");
            });
        },
        getItems() {
            this.pageNo++;
            let pagination = $("#pagination a");
            pagination.addClass("loading");
            pagination.html("");
            this.item();
            pagination.removeClass("loading");
            pagination.html("Previous");
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