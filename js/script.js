$(document).ready(function () {
    // CUSTOM SCROLL
    const lscroll = new LocomotiveScroll({
        el: document.querySelector('[data-scroll-container]'),
        smooth: true,
        lerp : 0.08,
        tablet : {
            smooth : true,
        },
        smartphone: {
            smooth: true,
        }
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
});
function addStyleCSS(elm, classAdd) {
    $(elm).addClass(classAdd);
}
