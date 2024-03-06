$(document).ready(function () {
  let loading = $(".blockLoading");
  let loadWeb = $(".blockLoadWeb");
  let loadContent = $(".blockContent");
  let loadBody = $("body");
  let loadHTML = $("html");
  let itemTab = $(".item__listChild--item");
  let itemCate = $(".blockMenu__listCate--item");
  loadWeb.addClass("active");
  loadBody.addClass("disabled");
  loadHTML.addClass("disabled");

  setTimeout(function () {
    loadWeb.removeClass("active");
  }, 2000);

  setTimeout(function () {
    loadContent.removeClass("disabled");
    loadBody.removeClass("disabled");
    loadHTML.removeClass("disabled");
  }, 2600);

  loadBody.click(function () {
    itemCate.removeClass("active");
  });

  itemCate.click(function (e) {
    e.stopPropagation();
    itemCate.removeClass("active");
    $(this).addClass("active");
  });

  itemTab.click(function (e) {
    e.stopPropagation();
    itemCate.removeClass("active");
    loading.addClass("active");
    $(".item__nameCate").removeClass("active");
    setTimeout(function () {
      loading.removeClass("active");
    }, 800);

    if (itemTab.hasClass("active")) {
      $(this)
        .parent()
        .parent()
        .children(".item__nameCate")
        .removeClass("active");
      $(this).parent().parent().children(".item__nameCate").addClass("active");
    } else {
      $(this)
        .parent()
        .parent()
        .children(".item__nameCate")
        .removeClass("active");
    }
  });
  // SHOW 3D
  let btnShow3d = $(".item__view3d");
  btnShow3d.on("click", function () {
    let productParent = $(this).closest(".listProduct__item");
    $(".listProduct__item").not(productParent).removeClass("show3d");
    if (!productParent.hasClass("show3d")) {
      productParent.addClass("show3d");
    } else {
      productParent.removeClass("show3d");
    }
  });
});
function selectTab(event, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("listPage__item");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("item__listChild--item");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
    $("html, body").scrollTop(0);
  }
  document.getElementById(tabName).style.display = "block";
  event.currentTarget.className += " active";
}
