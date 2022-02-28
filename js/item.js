//导航条
window.onscroll = function () {
    let totalHeight = $(document).height();
    let winHeight = parseInt($(window).height());
    let scrollTop = parseInt($(document).scrollTop());
    $('#bar').css("width", Math.round((scrollTop / (totalHeight - winHeight)) * 100) + "%");
    return false;
};

//点击返回顶部
$('.back-to-top').click(function () {
    $('body,html').animate({scrollTop: 0}, 600);
});
$('#mobile-top').click(function () {
    $('body,html').animate({scrollTop: 0}, 600);
});

let sub = $('.sub-menu');

$('.fa-type').hover(function () {
    sub.css("display", "block");
}, function () {
    sub.css("display", "none");
});

sub.hover(function () {
    sub.css("display", "block");
}, function () {
    sub.css("display", "none");
});

function showTips() {
    $('.butterBar').stop().fadeIn().delay(3000).fadeOut();
}

(function () {
    let title;  // 用于临时存放原来的title内容
    window.onblur = function () {
        // onblur时先存下原来的title,再更改title内容
        title = document.title;
        document.title = "看不见我(>▽<)~看不见我(>▽<)~";
    };
    window.onfocus = function () {
        // onfocus时原来的title不为空才替换回去
        // 防止页面还没加载完成且onblur时title=undefined的情况
        if (title) {
            document.title = title;
        }
    };
}());

function sleep(millisecond) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, millisecond)
    })
}