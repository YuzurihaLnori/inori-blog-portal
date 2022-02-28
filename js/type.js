Vue.createApp({
    data() {
        return {
            pageNo: 1,
            pageSize: 10,
            total: 0,
            items: [],
            title: "",
            typeId: null,
            message: ""
        };
    },
    created: function () {
        this.lazyload();
        let typeId = inori.store.get("TYPE_ID");
        inori.store.del("TYPE_ID");
        if (typeId !== null) {
            this.typeId = typeId;
        }
        this.title = inori.store.get("TYPE_NAME");
        this.item();
    },
    methods: {
        item() {
            inori.http.post("/index/list", {
                "pageNo": this.pageNo,
                "pageSize": this.pageSize,
                "typeId": this.typeId
            }).then((resp) => {
                let result = resp.data;
                this.total = result.data.total;
                result.data.records.forEach(item => this.items.push(item));

                this.lazyload();
            }).catch(() => {
                this.setMessage("服务器异常，请联系管理员");
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
        getItems() {
            this.pageNo++;
            let pagination = $("#pagination a");
            pagination.addClass("loading");
            pagination.html("");
            this.item();
            pagination.removeClass("loading");
            pagination.html("Previous");
        },
        setMessage(message) {
            this.message = message;
            showTips();
        },
        lazyload() {
            this.$nextTick(function () {
                $(".lazyload").lazyload({effect: "fadeIn"});
            });
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