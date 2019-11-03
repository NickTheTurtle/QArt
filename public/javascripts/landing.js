$(document).ready(function() {
  $("body").css({
    "background": "url('../images/Landing.png') no-repeat center center fixed",
    "background-size": "cover"
  });
  setTimeout(function() {
    $("body").css({
      "background": "url('../images/Background.png') no-repeat center center fixed",
      "background-size": "cover"
    });
    setTimeout(function() {
      $("#content").show();
    }, 500);
  }, 2000);
});
