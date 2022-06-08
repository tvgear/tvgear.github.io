$(document).ready(function () {
    // CUSTOM SCROLL
    const lscroll = new LocomotiveScroll({
        el: document.querySelector('[data-scroll-container]'),
        smooth: true,
        smoothMobile: true,
        getSpeed: true,
        getDirection: true
        // lerp : 0.08,
        // tablet : {
        //     breakpoint: 0,
        //     intertia : 0.8,
        //     getDirection : true,
        //     smooth : true,
        // },
        // smartphone: {
        //     breakpoint: 0,
        //     intertia : 0.8,
        //     getDirection : true,
        //     smooth : true,
        // }
    });
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
     // SHOW DETAIL
     $(".listProduct__product .blockSelect").children().click(function() {
        $(this).parent().find(".select").removeClass("select");
        $(this).addClass("select");
    });
});
function addStyleCSS(elm, classAdd) {
    $(elm).addClass(classAdd);
}
