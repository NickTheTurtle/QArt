$(document).ready(function() {
  let label;
  let info;
  let url;

  label = $("#terms").text();
  $("#mainContent").hide();
  searchWikipedia(label);

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
      success({query: {search: search}}) {
        if (!search.length) {
          location.replace("/no-results-error");
        } else {
          showOptions(search);
        }
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

        url = "https://en.wikipedia.org/?curid=" + info.pageid;
        $(".label").text(label);
        $("a.label").attr("href", url);

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
      overlayQR(width, height);
    }, 100);
  }

  function generateQRCode() {
    const qr = qrcode(0, "H");
    qr.addData(url);
    qr.make();
    $("#hiddenQRCode").html(qr.createImgTag());
  }

  function overlayQR(canvasWidth, canvasHeight) {
    const qrImage = $("#hiddenQRCode > img");
    if (qrImage.length && qrImage.attr("src") !== "") {
      console.log(qrImage.length, qrImage.attr("src"));
      const canvas = document.getElementById("canvas");
      const ctx = canvas.getContext('2d');

      const qrDimensions = Math.round(Math.max(100, Math.min(canvasWidth, canvasHeight) / 10));

      ctx.drawImage(qrImage.get(0), canvasWidth - qrDimensions, canvasHeight - qrDimensions,
        qrDimensions, qrDimensions);

      finalize();
    } else {
      console.log("not working");
      // Set timeout just in case QR code not generated in time
      setTimeout(function() {
        overlayQR(canvasWidth, canvasHeight);
      }, 100);
    }
  }

  function finalize() {
    const canvas = document.getElementById("canvas");
    let image = new Image();
    image.src = canvas.toDataURL();
    $("#result").append(image);
  }
});
