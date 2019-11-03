let label = $("#label").text();
let info;

$(document).ready(function() {
  $("#mainContent").hide();
  searchWikipedia(label);
});

function searchWikipedia(terms) {
  $.ajax({
    url: '//en.wikipedia.org/w/api.php',
    data: {
      action: 'query',
      list: 'search',
      srsearch: terms,
      format: 'json',
      formatversion: 2
    },
    dataType: 'jsonp',
    success({query: {search: result}}) {
      if (!result.length) {
        location.replace("/no-result-error");
      }
      showOptions(result);
    },
    error() {
      location.replace("/wikipedia-error");
    }
  });
}

function showOptions(searchOptions) {
  $("#chooseOptionsDialog").modal("show");

  for (let i = 0; i < searchOptions.length; ++i) {
    $("#chooseOptions").append(`
      <a class="list-group-item list-group-item-action" id="option-${i}" href="#">
        <h6 class="mb-1">${searchOptions[i].title}</h5>
        <small>${searchOptions[i].snippet} &hellip;</small>
      </a>
    `);
  }

  let pos = -1;

  $("#confirm").attr("disabled", true);

  $("#chooseOptions > a.list-group-item").click(function(e) {
    const targetId = $(e.currentTarget).attr("id");
    const currentActiveId = $("#chooseOptions > a.list-group-item.active").attr("id");
    if (pos === -1 || currentActiveId !== targetId) {
      $(`#${currentActiveId}`).removeClass("active");
      $(e.currentTarget).addClass("active");
      pos = targetId.substr(7);

      $("#confirm").attr("disabled", false);
    }
  });

  $("#confirm").click(function() {
    if (pos !== -1) {
      label = $("#chooseOptions > a.list-group-item.active > h6").text();
      info = searchOptions[pos];
      $("#label").text(label);

      $("#chooseOptionsDialog").modal("hide");
      $("#mainContent").show();
    }

    drawImage();
  });
}

function drawImage() {
  generateQRCode();

  const image = document.getElementById("hiddenImage");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext('2d');

  let [width, height] = [
    $("#hiddenImage").width(),
    $("#hiddenImage").height()
  ];
  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(image, 0, 0, width, height);

  setTimeout(function() {
    const qrImage = document.querySelector("#hiddenQRCode > img");

    qrDimensions = Math.max(100, Math.min(width, height) / 10);

    ctx.drawImage(qrImage, width - qrDimensions, height - qrDimensions,
      qrDimensions, qrDimensions);

    finalize();
  }, 100);
}

function generateQRCode() {
  const qr = qrcode(0, "H");
  const url = "https://en.wikipedia.org/?curid=" + info.pageid;
  qr.addData(url);
  qr.make();
  $("#hiddenQRCode").html(qr.createImgTag());
}

function finalize() {
  const canvas = document.getElementById("canvas");
  let image = new Image();
  image.src = canvas.toDataURL();
  $("#result").append(image);
}
