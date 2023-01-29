$(document).ready(function () {
    // OPEN-CLOSED MENU
    let menuFixed = false;
    $('.blockMenuFixed__wrap--btnMenu').click(function () {
        menuFixed = !menuFixed;
      if (menuFixed === true) {
        $('.blockMenuFixed').addClass('active');
        $('.blockMenuFixed__wrap--btnMenu').addClass('active');
      }
      else {
        $('.blockMenuFixed').removeClass('active');
        $('.blockMenuFixed__wrap--btnMenu').removeClass('active');
      }
    });
    // SCROLL TO ID
    let anchorlinks = document.querySelectorAll('a[href^="#"]')
    for (let item of anchorlinks) {
      item.addEventListener('click', (e) => {
        menuFixed = !menuFixed;
        $('.blockMenuFixed').removeClass('active');
        $('.blockMenuFixed__wrap--btnMenu').removeClass('active');
        let hashval = item.getAttribute('href');
        let target = document.querySelector(hashval);
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        history.pushState(null, null, hashval);
        e.preventDefault();
      })
    }
    // ENTER PRESS SEARCH INVOICE
    $("#invoiceCode").keydown(function(event) {
      if (event.keyCode == 13) {
        checkInvoice();
      }
    });
    copyBanking();

    // SEARCH CODE
    window.addEventListener("load", () => {
      var filter = document.getElementById("filterItem"), 
          list = document.querySelectorAll("#listItem li");
      filter.onkeyup = () => {
        let search = filter.value.toLowerCase();
        for (let i of list) {
          let item = i.innerHTML.toLowerCase();
          if (item.indexOf(search) == -1) { i.classList.add("hide"); }
          else { i.classList.remove("hide"); }
        }
      };
    });
    // COUNT ORDER
    const countOrder = $('#listItem li').length;
    document.getElementById("numberOrder").innerHTML = countOrder;
});
// SEARCH INVOICE
function checkInvoice() {
  window.open("https://tvgear.github.io/invoice/" + invoiceCode.value)
}
 // COPY BANKING
function copyBanking() {
  var copyBtn = $('.wrapInfo__copy');
  copyBtn.on('click', function() {
    var content = $(this).prev('.wrapInfo__numberBank');
    var clipboard = document.createRange();
    clipboard.selectNode(content[0]);
    window.getSelection().addRange(clipboard);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
  });
}
// COUNT ORDER
