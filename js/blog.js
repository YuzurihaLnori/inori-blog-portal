Vue.createApp({
    data() {
        return {
            pageNo: 1,
            pageSize: 10,
            total: 0,
            totalNumber: 0,
            items: [],
            views: 0,
            previous: null,
            next: null,
            types: [],
            keywords: "",
            blogId: null,
            pid: -1,
            avatar: "",
            nickName: "",
            email: "",
            content: "",
            contentReply: "",
            message: "",
            flag: false,
            mobileShow: false
        };
    },
    created: function () {
        let href = window.location.href;
        let html = href.substring(href.lastIndexOf("/") + 1);
        this.blogId = html.substring(0, html.indexOf(".html"));
        this.lazyload();
        this.item();
        if (document.body.offsetWidth > 860) {
            this.itemType();
        }
        this.itemBlog();

        let inori_token = inori.cookie.get("INORI_TOKEN");
        if (inori_token !== undefined && inori_token !== '') {
            inori.http.post("/user/info", {}).then((resp) => {
                let result = resp.data;
                this.avatar = result.data.avatar;
                inori.cookie.set("USER_AVATAR", result.data.avatar);
                this.nickName = result.data.nickName;
                inori.cookie.set("USER_NAME", result.data.nickName);
                this.email = result.data.email;
                inori.cookie.set("USER_EMAIL", result.data.email);
                this.flag = result.data.flag;
            });
        } else {
            let avatar = inori.cookie.get("USER_AVATAR");
            if (avatar !== null && avatar !== '') {
                this.avatar = decodeURIComponent(avatar);
            } else {
                this.avatar = "http://lnori-blog.oss-cn-hangzhou.aliyuncs.com/system-img/1625557243195_avatar.png";
            }
            this.nickName = decodeURIComponent(inori.cookie.get("USER_NAME"));
            this.email = decodeURIComponent(inori.cookie.get("USER_EMAIL"));
        }
    },
    mounted: function () {
        document.addEventListener('click', (e) => {
            let elem = e.target || e.srcElement;
            if (elem.className === "comment-from-reply-y") {
                $(".comment-from-reply-y").css("display", "none");
                this.pid = -1;
            }
        });
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
                    this.setMessage("搜索条件不能为空", "butterBar-error");
                    return;
                }
                window.location.href = 'search.html?keywords=' + this.keywords;
            }
        },
        searchTypes() {
            inori.store.set("TYPE_NAME", "分类");
            window.location.href = '../type.html';
        },
        searchType(item) {
            inori.store.set("TYPE_ID", item.id);
            inori.store.set("TYPE_NAME", item.name);
            window.location.href = '../type.html';
        },
        itemBlog() {
            inori.http.post("/blog/recommend", {
                "blogId": this.blogId
            }).then((resp) => {
                let result = resp.data;
                this.views = result.data.views;
                this.previous = result.data.previous;
                this.next = result.data.next;

                this.$nextTick(function () {
                    if (this.previous === null) {
                        let next = $('#next');
                        next.removeClass();
                        next.addClass("squares nepre");
                    }
                    if (this.next === null) {
                        let previous = $('#previous');
                        previous.removeClass();
                        previous.addClass("squares nepre");
                    }
                });

                this.lazyload();
            }).catch(() => {
                this.setMessage("服务器异常，请联系管理员", "butterBar-error");
            });
        },
        blog(id) {
            inori.http.post("/blog/detail", {
                "blogId": id
            }).then(() => {
                window.location.href = id + '.html';
            }).catch(() => {
                this.setMessage("服务器异常，请联系管理员", "butterBar-error");
            });
        },
        item() {
            inori.http.post("/comment/list", {
                "blogId": this.blogId,
                "pageNo": this.pageNo,
                "pageSize": this.pageSize
            }).then((resp) => {
                let result = resp.data;
                this.totalNumber = result.data.totalNumber;
                this.total = result.data.total;
                this.items = result.data.records;

                this.lazyload();
            }).catch(() => {
                this.setMessage("服务器异常，请联系管理员", "butterBar-error");
            });
        },
        lazyload() {
            this.$nextTick(function () {
                $(".lazyload").lazyload({effect: "fadeIn"});
            });
        },
        current(pageNo) {
            this.pageNo = pageNo;

            this.item();

            let blog_comment = $('#blog-comment');
            window.scrollTo(blog_comment, blog_comment.offset().top - 30);
        },
        newer() {
            this.pageNo--;

            this.item();

            let blog_comment = $('#blog-comment');
            window.scrollTo(blog_comment, blog_comment.offset().top - 30);
        },
        older() {
            this.pageNo++;

            this.item();

            let blog_comment = $('#blog-comment');
            window.scrollTo(blog_comment, blog_comment.offset().top - 30);
        },
        submit() {
            if (this.content === '' || this.content === null || this.nickName === '' || this.nickName === null) {
                this.setMessage("上车请刷卡", "butterBar-success");
            } else {
                inori.http.post("/comment/create", {
                    "blogId": this.blogId,
                    "pid": this.pid,
                    "avatar": this.avatar,
                    "nickName": this.nickName,
                    "email": this.email,
                    "content": this.content
                }).then(() => {
                    this.content = "";

                    inori.cookie.set("USER_AVATAR", this.avatar);
                    inori.cookie.set("USER_NAME", this.nickName);
                    inori.cookie.set("USER_EMAIL", this.email);

                    this.setMessage("留言成功", "butterBar-success");

                    this.item();
                }).catch(() => {
                    this.setMessage("服务器异常，请联系管理员", "butterBar-error");
                });
            }
        },
        focus() {
            $("#popup-text").css("display", "block");
        },
        blur() {
            $("#popup-text").css("display", "none");
            this.getInfo();
        },
        submitReply() {
            if (this.contentReply === '' || this.contentReply === null || this.nickName === '' || this.nickName === null) {
                this.setMessage("上车请刷卡", "butterBar-success");
            } else {
                $(".comment-from-reply-y").css("display", "none");
                inori.http.post("/comment/create", {
                    "blogId": this.blogId,
                    "pid": this.pid,
                    "avatar": this.avatar,
                    "nickName": this.nickName,
                    "email": this.email,
                    "content": this.contentReply
                }).then(() => {
                    this.pid = -1;
                    this.contentReply = "";

                    inori.cookie.set("USER_AVATAR", this.avatar);
                    inori.cookie.set("USER_NAME", this.nickName);
                    inori.cookie.set("USER_EMAIL", this.email);

                    this.setMessage("回复成功", "butterBar-success");

                    this.item();
                }).catch(() => {
                    this.setMessage("服务器异常，请联系管理员", "butterBar-error");
                });
            }
        },
        reply(pid) {
            $(".comment-from-reply-y").css("display", "block");
            this.pid = pid;
        },
        close() {
            $(".comment-from-reply-y").css("display", "none");
            this.pid = -1;
        },
        focusReply() {
            $("#popup-text-reply").css("display", "block");
        },
        blurReply() {
            $("#popup-text-reply").css("display", "none");
            this.getInfo();
        },
        getInfo() {
            if (this.nickName !== "") {
                inori.http.post("/user/info", {
                    "nickName": this.nickName
                }).then((resp) => {
                    let result = resp.data;

                    let avatar = result.data.avatar;
                    if (avatar !== null && avatar !== '') {
                        this.avatar = avatar;
                        inori.cookie.set("USER_AVATAR", avatar);
                    }
                    let nickName = result.data.nickName;
                    if (nickName !== null && nickName !== '' && nickName !== '0') {
                        this.nickName = nickName;
                        inori.cookie.set("USER_NAME", nickName);
                    }
                    let email = result.data.email;
                    if (email !== null && email !== '') {
                        this.email = email;
                        inori.cookie.set("USER_EMAIL", email);
                    }
                    this.flag = result.data.flag;
                });
            }
        },
        delete(id) {
            let flag = confirm('确定要删除该留言吗？三思啊! 删了可就没了！');
            if (flag) {
                inori.http.post("/comment/delete", {
                    "id": id,
                }).then(() => {
                    this.setMessage("删除成功", "butterBar-success");

                    this.item();
                }).catch(() => {
                    this.setMessage("服务器异常，请联系管理员", "butterBar-error");
                });
            }
        },
        setMessage(message, messageClass) {
            this.message = message;
            if (messageClass === null || messageClass === "" || messageClass === undefined) {
                messageClass = "butterBar-error";
            }
            let blog_common = $("#butterBar-common");
            blog_common.removeClass();
            blog_common.addClass(messageClass);
            showTips();
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
}).mount("#main-container");

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
                window.location.href = '../search.html?keywords=' + this.keywords;
            }
        },
        searchTypes() {
            inori.store.set("TYPE_NAME", "分类");
            window.location.href = '../type.html';
        },
        searchType(item) {
            inori.store.set("TYPE_ID", item.id);
            inori.store.set("TYPE_NAME", item.name);
            window.location.href = '../type.html';
        }
    }

}).mount("#mobile-nav");

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

if (document.body.clientWidth > 860) {
    $(window).scroll(function () {
        $('.toc-container').css("height", $('.blog-content').outerHeight());
    });
}

let index = 1;
let idArr = {};
$('.js-toc-content').children("h1, h2, h3, h4").each(function () {
    //去除空格以及多余标点
    let headerId = $(this).text().replace(/[\s|\~|`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\_|\+|\=|\||\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?|\：|\，|\。]/g, '');

    headerId = headerId.toLowerCase();
    if (idArr[headerId]) {
        //id已经存在
        $(this).attr('id', headerId + '-' + idArr[headerId]);
        idArr[headerId]++;
    } else {
        //id未存在
        idArr[headerId] = 1;
        $(this).attr('id', 'h-' + index);
        index++;
    }
});

tocbot.init({
    // Where to render the table of contents.
    tocSelector: '.toc-list',
    // Where to grab the headings to build the table of contents.
    contentSelector: '.js-toc-content',
    // Which headings to grab inside of the contentSelector element.
    headingSelector: 'h1, h2, h3, h4'
});
