$(document).ready(function () {
    // CUSTOM SCROLL
    const scroll = new LocomotiveScroll({
        el: document.querySelector('[data-scroll-container]'),
        smooth: true,
        lerp : 0.078,
        tablet : {
            smooth : true,
            lerp : 0.9,
        },
        smartphone: {
            smooth: true,
            lerp : 0.9,
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
        scroll.scrollTo(sectionID);
        btnMenu = false;
    });
});
function addStyleCSS(elm, classAdd) {
    $(elm).addClass(classAdd);
}
