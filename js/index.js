Vue.createApp({
    data() {
        return {
            pageNo: 1,
            pageSize: 10,
            total: 0,
            recommends: [],
            items: [],
            message: ""
        };
    },
    created: function () {
        this.lazyload();
        this.item();
        this.recommend();
    },
    methods: {
        item() {
            inori.http.post("/index/list", {
                "pageNo": this.pageNo,
                "pageSize": this.pageSize
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
        recommend() {
            inori.http.post("/index/recommend/list", {
                "pageNo": 1,
                "pageSize": 3
            }).then((resp) => {
                this.recommends = resp.data.data.records;

                this.lazyload();
            }).catch(() => {
                this.setMessage("服务器异常，请联系管理员");
            });
        },
        recommendBlog(id) {
            inori.http.post("/blog/detail", {
                "blogId": id
            }).then(() => {
                window.location.href = './page/' + id + '.html';
            }).catch(() => {
                this.setMessage("服务器异常，请联系管理员", "butterBar-error");
            });
        },
        lazyload() {
            this.$nextTick(function () {
                $(".lazyload").lazyload({effect: "fadeIn"});
            });
        },
        getThumbClass(index) {
            if (index % 2 === 0) {
                return "post-thumb-float-right";
            } else {
                return "post-thumb-float-left";
            }
        },
        getButtonClass(index) {
            if (index % 2 === 0) {
                return "post-bottom-right";
            } else {
                return "post-bottom-left";
            }
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
        }
    },
    components: {
        inoriHeader: inoriHeader,
        inoriFooter: inoriFooter
    }
}).mount("#main-container");

//开始
$('#video-btn').click(function () {
    let video_stu = $('#video-stu');
    video_stu.show();
    $('#video-pause').show();
    $('#bg_video').show();
    let video = videojs("bg_video", {
        bigPlayButton: false,
        textTrackDisplay: false,
        posterImage: false,
        errorDisplay: false,
        controls: false,
        autoplay: true
    });
    video.ready(function () {
        this.volume(0.15);
    });
    video.play();

    $('#video-container').css("height", parseInt($(window).innerHeight()));
    $('#video-btn').css("display", "none");
    $('#header-container').css("display", "none");
    $('#banner_wave_1').css("display", "none");
    $('#banner_wave_2').css("display", "none");
    $('#wayPoint').css("display", "none");
    $('.aplayer').css("display", "none");

    video_stu.css("display", "none");
});

let bg_video = $('#bg_video')[0];
bg_video.addEventListener("ended", () => {
    $('#bg_video').css("display", "none");
    $('#header-container').css("display", "block");
    $('#banner_wave_1').css("display", "block");
    $('#banner_wave_2').css("display", "block");
    $('#wayPoint').css("display", "block");
    $('.aplayer').css("display", "block");
    $('#video-pause').css("display", "none");
    $('#video-btn').show();
}, false);

//暂停
$('#video-pause').click(function () {
    $('#header-container').css("display", "block");
    $('#banner_wave_1').css("display", "block");
    $('#banner_wave_2').css("display", "block");
    $('#wayPoint').css("display", "block");
    $('.aplayer').css("display", "block");
    $('#video-pause').css("display", "none");
    $('#video-btn').show();
    let video = videojs('bg_video', {
        bigPlayButton: false,
        textTrackDisplay: false,
        posterImage: false,
        errorDisplay: false,
        controls: false,
        autoplay: true
    });
    video.pause();
});

// 导航栏显示
new Waypoint({
    element: document.getElementById('page'),
    handler: function (direction) {
        if (direction === 'down') {
            $('#nav').show(300);
            $('.back-to-top').show(0).css('top', '-200px');
            $('#mobile-top').show(0);
        } else {
            $('#nav').hide(300);
            $('.back-to-top').hide(200).css('top', '-999px');
            $('#mobile-top').hide(200);
        }
    }
});

// 首页下拉箭头
function header_top_down() {
    let coverOffset = $('#recommend').offset().top;
    $('html,body').animate({scrollTop: coverOffset}, 600);
}