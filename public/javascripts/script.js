$(document).ready(function() {
  $(".nav-link").hover(function(){$(this).toggleClass("active")} ,function(){$(this).toggleClass("active")});
  $(".alert-success").fadeTo(2000, 500).slideUp(500, function(){
    $(".alert-success").slideUp(500);
});
});