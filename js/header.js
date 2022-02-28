let inoriHeader = {
    template: '<div class="scrollbar" id="bar" style="width: 10%;"></div>\n' +
        '        <div class="site-top">\n' +
        '            <div class="site-branding"><a>Inoriの回忆</a></div>\n' +
        '            <div class="lower-cantiner m-mobile-hide">\n' +
        '                <div class="lower">\n' +
        '                    <ul>\n' +
        '                        <li>\n' +
        '                            <a href="http://ai-inori.top" class="m-margin-left-small">\n' +
        '                                <i class="bi-house-fill"></i><span class="fa">首页</span>\n' +
        '                            </a>\n' +
        '                        </li>\n' +
        '                        <li>\n' +
        '                            <a class="m-margin-left-small fa-type" @click="searchTypes">\n' +
        '                                <i class="bi-front"></i><span class="fa">分类</span>\n' +
        '                            </a>\n' +
        '                            <ul class="sub-menu">\n' +
        '                                <li v-for="item of types" :key="item">\n' +
        '                                    <a class="m-margin-left--" @click="searchType(item)">\n' +
        '                                        <span class="fa-code">{{item.name}}</span>\n' +
        '                                    </a>\n' +
        '                                </li>\n' +
        '                            </ul>\n' +
        '                        </li>\n' +
        '                        <li>\n' +
        '                            <a href="archives.html" class="m-margin-left-small">\n' +
        '                                <i class="bi-archive-fill"></i><span class="fa">归档</span>\n' +
        '                            </a>\n' +
        '                        </li>\n' +
        '                        <li>\n' +
        '                            <a href="message.html" class="m-margin-left-small">\n' +
        '                                <i class="bi-pencil-square"></i><span class="fa">留言板</span>\n' +
        '                            </a>\n' +
        '                        </li>\n' +
        '                        <!--<li>\n' +
        '                            <a href="#" class="m-margin-left-small">\n' +
        '                                <i class="icon-link"></i><span class="fa">友人帐</span>\n' +
        '                            </a>\n' +
        '                        </li>-->\n' +
        '                        <li>\n' +
        '                            <a href="picture.html" class="m-margin-left-small">\n' +
        '                                <i class="bi-images"></i><span class="fa">照片墙</span>\n' +
        '                            </a>\n' +
        '                        </li>\n' +
        '                        <li>\n' +
        '                            <a href="about.html" class="m-margin-left-small">\n' +
        '                                <i class="icon-leaf"></i><span class="fa">关于我</span>\n' +
        '                            </a>\n' +
        '                        </li>\n' +
        '                    </ul>\n' +
        '                </div>\n' +
        '            </div>\n' +
        '            <div class="search-box m-mobile-hide">\n' +
        '                <form action="#" name="search">\n' +
        '                    <div>\n' +
        '                            <input class="search" type="text" name="search" placeholder="Search..." ' +
        '                                   v-model="keywords" @keydown="search($event)">\n' +
        '                        <i @click="search" class="bi-search" style="margin-left: 10px"></i>\n' +
        '                    </div>\n' +
        '                </form>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '        <div class="mobile-menu" @click="mobileOpen"><i id="mobile-icon" class="icon-reorder"></i></div>',
    name: "inori-header",
    data() {
        return {
            types: [],
            keywords: ""
        }
    },
    created: function () {
        if (document.body.offsetWidth > 860) {
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
                    this.$parent.setMessage("搜索条件不能为空");
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
        },
        mobileOpen() {
            let mobile_icon = $('#mobile-icon');
            let mobile_nav = $('#mobile-nav');
            let main_container = $('#main-container');
            if (mobile_icon.attr("class") === "icon-reorder") {
                main_container.addClass("open");
                mobile_nav.css("display", "block");
                mobile_icon.removeClass();
                mobile_icon.addClass("el-icon-close");
            } else {
                mobile_nav.css("display", "none");
                main_container.removeClass();
                mobile_icon.removeClass();
                mobile_icon.addClass("icon-reorder");
            }
        }
    }
};
