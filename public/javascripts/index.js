let imageSrc;
$(document).ready(function() {
  $("#uploadImage").change(function(e) {
    let reader = new FileReader();

    reader.onload = function (e) {
        $("#preview").attr("src", e.target.result);
    };

    imageSrc = e.currentTarget.files[0];
    reader.readAsDataURL(imageSrc);
  });
});
