const express = require('express');
const multer  = require('multer')
const upload = multer({storage: multer.memoryStorage()});
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'QArt' });
});

router.post('/upload', upload.single('image'), function(req, res, next) {
  if (req.file.mimetype.substr(0, 6) !== "image/") {
    res.render('error', {message: "You didn't upload an image"});
  } else {
    interpretImage(req.file.buffer).then(function(imageLabel) {
      const formattedImageLabel = imageLabel.split(" ").map((word) => {
        return word[0].toUpperCase() + word.substr(1);
      }).join(" ");
      res.render('result', {
        label: formattedImageLabel,
        imageBase64: req.file.buffer.toString("base64")
      });
    }).catch(function(err) {
      res.render('error', {message: 'Server error'})
      console.error(err);
    });
  }
});

module.exports = router;

async function interpretImage(image) {
  // Imports the Google Cloud client library
  const vision = require('@google-cloud/vision');

  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  // Performs label detection on the image file

  const {
    fullMatchingImages,
    partialMatchingImages,
    bestGuessLabels
  } = (await client.webDetection(image))[0].webDetection;

  if (!bestGuessLabels.length) {
    throw new Error("No best guess");
  }

  return bestGuessLabels[0].label;
}
