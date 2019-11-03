$(document).ready(function() {
  let imageSrc;
  $("#submit").attr("disabled", true);
  $("#uploadImage").change(function(e) {
    $("#submit").attr("disabled", false);
    let reader = new FileReader();

    reader.onload = function (e) {
        $("#preview").attr("src", e.target.result);
    };

    imageSrc = e.currentTarget.files[0];
    reader.readAsDataURL(imageSrc);
  });
});
