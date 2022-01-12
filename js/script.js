$(document).ready(function () {
    // SLIDE QUES - ASK
    $('.item__ques').click(function () {
        $(this).toggleClass('active');
        $(this).next('.item__ask').slideToggle(300);
    });
    //LOAD WEB
    setTimeout(function () {
        addStyleCSS('.backgroundLoad', 'hdLoad');
    }, 3500);
    setTimeout(function () {
        showElm('.logo__v');
    }, 4500);
    // ZINDEX CART
    setTimeout(function () {
        addStyleCSS('.orderCart', 'topshow');
    }, 4000);
     //LOAD ADS
     setTimeout(function () {
        addStyleCSS('.backgroundAds', 'showAds');
    }, 5000);
    // CLOSE ADS
    $('.buttonCloseAds').click(function () {
        $('.backgroundAds').removeClass('showAds');
    });
    // SHOW ADS
    $('.tabFixed').click(function () {
        $('.backgroundAds').addClass('showAds');
    });
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
        $('.fullWeb').animate({ scrollTop: 0 }, '3500');
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
function validatePass() {
    var textLink = '68B6UePsa5/order.html';
    var el = document.getElementById('linkDirect');
    if(document.getElementById('passwordDirect').value == 'thunga0506'){
        el.href += textLink;
        return true;
    } else {
        alert('Mật Khẩu Không Đúng');
        return false;
    }
}
