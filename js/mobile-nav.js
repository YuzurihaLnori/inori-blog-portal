Vue.createApp({
    data() {
        return {
            types: [],
            keywords: ""
        }
    },
    created: function () {
        if (document.body.offsetWidth <= 860) {
            this.itemType();
        }
    },
    methods: {
        itemType() {
            inori.http.post("/type/list", {
                "pageNo": this.pageNo,
                "pageSize": 99999
            }).then((resp) => {
                this.types = resp.data.data.records;
            });
        },
        search(event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                if (this.keywords === null || this.keywords === '') {
                    return;
                }
                window.location.href = 'search.html?keywords=' + this.keywords;
            }
        },
        searchTypes() {
            inori.store.set("TYPE_NAME", "分类");
            window.location.href = 'type.html';
        },
        searchType(item) {
            inori.store.set("TYPE_ID", item.id);
            inori.store.set("TYPE_NAME", item.name);
            window.location.href = 'type.html';
        }
    }
}).mount("#mobile-nav");