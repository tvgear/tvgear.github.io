$(document).ready(function () {
    //LOAD WEB
    setTimeout(function () {
        addStyleCSS('.backgroundLoad', 'hdLoad');
    }, 3500);
    setTimeout(function () {
        showElm('.logo__v');
    }, 4500);
    // BACK TOP TAB
    var backTop = $('.itemTab');
    $(window).scroll(function () {
        if ($(window).scrollTop() > 300) {
            btn.addClass('show');
        } else {
            btn.removeClass('show');
        }
    });
    backTop.on('click', function (e) {
        e.preventDefault();
        $('.tabContent').animate({ scrollTop: 0 }, '250');
    });
    // SLIDE QUES - ASK
    $('.item__ques').click(function () {
        $(this).toggleClass('active');
        $(this).next('.item__ask').slideToggle(300);
    });
})
function addStyleCSS(elm, classAdd) {
    $(elm).addClass(classAdd);
}
function showElm(elm) {
    $(elm).css({ visibility: 'visible', opacity: 1 });
}
function hiddenElm(elm) {
    $(elm).css({ visibility: 'hidden', opacity: 0 });
}