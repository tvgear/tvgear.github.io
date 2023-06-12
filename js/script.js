$(document).ready(function () {
  let loading = $(".blockLoading");
  let loadWeb = $(".blockLoadWeb");
  let itemTab = $(".item__listChild--item");
  loadWeb.addClass("active");
  setTimeout(function() { 
    loadWeb.removeClass("active");
  }, 4000);


  itemTab.click(function(){
    loading.addClass("active");
    $(".item__nameCate").removeClass("active");
    setTimeout(function() { 
      loading.removeClass("active");
    }, 1000);
    
    if (itemTab.hasClass("active")) {
      $(this).parent().parent().children(".item__nameCate").removeClass("active");
      $(this).parent().parent().children(".item__nameCate").addClass("active");
    }
    else {
      $(this).parent().parent().children(".item__nameCate").removeClass("active");
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
    $('html, body').scrollTop(0);
  }
  document.getElementById(tabName).style.display = "block";
  event.currentTarget.className += " active";
  
}
