Vue.createApp({
    data() {
        return {
            pageNo: 1,
            pageSize: 10,
            totalNumber: 0,
            total: 0,
            items: [],
            pid: -1,
            avatar: "",
            nickName: "",
            email: "",
            content: "",
            contentReply: "",
            message: "",
            flag: false
        };
    },
    created: function () {
        this.lazyload();
        this.item();
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
        item() {
            inori.http.post("/message/list", {
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
        current(pageNo) {
            this.pageNo = pageNo;

            this.item();

            window.scrollTo($("#page"), 450);
        },
        newer() {
            this.pageNo--;

            this.item();

            window.scrollTo($("#page"), 450);
        },
        older() {
            this.pageNo++;

            this.item();

            window.scrollTo($("#page"), 450);
        },
        lazyload() {
            this.$nextTick(function () {
                $(".lazyload").lazyload({effect: "fadeIn"});
            })
        },
        submit() {
            if (this.content === '' || this.content === null || this.nickName === '' || this.nickName === null) {
                this.setMessage("上车请刷卡", "butterBar-success");
            } else {
                inori.http.post("/message/create", {
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
                inori.http.post("/message/create", {
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
        deleteMessage(id) {
            let flag = confirm('确定要删除该留言吗？三思啊! 删了可就没了！');
            if (flag) {
                inori.http.post("/message/delete", {
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