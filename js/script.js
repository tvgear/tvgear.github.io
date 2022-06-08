$(document).ready(function () {
    // CUSTOM SCROLL
    const lscroll = new LocomotiveScroll({
        el: document.querySelector('[data-scroll-container]'),
        smooth: true,
        lerp: 0.07, 
        multiplier: 1.5, 
        reloadOnContextChange: true,
        touchMultiplier: 2,
        smoothMobile: 0,
        smartphone: {
            smooth: !0,
            breakpoint: 767
        },
        tablet: {
            smooth: !1,
            breakpoint: 1024
        },
    });
    // SETUP LOAD LOCOMOTIVE
    setTimeout(() => {  
        locoScroll.destroy();
    }, 0);
    setTimeout(() => {  
        locoScroll.init();
    }, 50);
    setTimeout(() => {  
        locoScroll.update();
    }, 1000);
    // WRAP HEADER
    setTimeout(function () {
        addStyleCSS('.headerWeb', 'hdFixed');
    }, 2500);
     // WRAP HEADER 2
     setTimeout(function () {
        addStyleCSS('.headerWeb', 'hdLeft');
    }, 3500);
    // SCROLL TO DIV
    var btnMenu = false;
    $('.itemTab').click(function() {
        const sectionID = $(this).data('scroll-section-id');
        lscroll.scrollTo(sectionID);
        btnMenu = false;
    });
    // SCROLL REFRESH
    function lscrollrefresh(func) {
        $(window).trigger('resize');
        func.update();
    }
    setTimeout(lscrollrefresh, 200, lscroll);
    // SHOW DETAIL
    $(".listProduct__product .buttonShowDetail").click(function() {
        $(".listProduct__product").removeClass("showDetail");
        $(this).parent().addClass("showDetail");    
    });
    $(".listProduct__product .buttonHideDetail").click(function() {
        $(this).parent().removeClass("showDetail");
    });
     // SELECT OPTION
     $(".listProduct__product .blockSelect").children().click(function() {
        $(this).parent().find(".select").removeClass("select");
        $(this).addClass("select");
    });
});
function addStyleCSS(elm, classAdd) {
    $(elm).addClass(classAdd);
}
