$(document).ready(function () {
  let loading = $(".blockLoading");
  let loadWeb = $(".blockLoadWeb");
  let loadContent = $(".blockContent");
  let loadBody = $("body");
  let itemTab = $(".item__listChild--item");
  let itemCate = $(".blockMenu__listCate--item");
  loadWeb.addClass("active");
  loadBody.addClass("disabled");
  
  setTimeout(function() { 
    loadWeb.removeClass("active");
    loadContent.removeClass("disabled");
    loadBody.removeClass("disabled");
  }, 2500);


  loadBody.click(function() {
    itemCate.removeClass("active");
  }) 

  itemCate.click(function(e){
    e.stopPropagation();
    itemCate.removeClass("active");
    $(this).addClass("active");
  })
  
  itemTab.click(function(e){
    e.stopPropagation();
    itemCate.removeClass("active");
    loading.addClass("active");
    $(".item__nameCate").removeClass("active");
    setTimeout(function() { 
      loading.removeClass("active");
    }, 800);
    
    if (itemTab.hasClass("active")) {
      $(this).parent().parent().children(".item__nameCate").removeClass("active");
      $(this).parent().parent().children(".item__nameCate").addClass("active");
    }
    else {
      $(this).parent().parent().children(".item__nameCate").removeClass("active");
    }
  });
  let isShow3d = false;
  let btnShow3d = $(".item__view3d");
  let blockImgProduct = $(".item__wrapImg");
  btnShow3d.click(function(){
    isShow3d = !isShow3d;
    if (isShow3d === true) {
      blockImgProduct.removeClass("show3d");
      $(this).addClass("active");
      $(this).parent().find(".item__wrapImg").addClass("show3d");
    } else {
      $(this).parent().find(".item__wrapImg").removeClass("show3d");
      $(this).removeClass("active");
    }
  })
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
    $('html, body').scrollTop(0);
  }
  document.getElementById(tabName).style.display = "block";
  event.currentTarget.className += " active";
  
}
