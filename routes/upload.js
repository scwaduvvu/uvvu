var express = require('express');
var router = express.Router();
const multer = require('multer');
var createError = require('http-errors');

const multer_storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const user = req.session.user;
    if (req.body.premium) {
      upload_path = `${__dirname}/../public/images/${user.login}/premium/`;
    } else {
      upload_path = `${__dirname}/../public/images/${user.login}/`;
    }
    callback(null, upload_path);
  },
  filename: (req, file, callback) => {
    callback(null, `${req.body.title}.jpg`);
  }
});

const multer_filter = function(req, file, callback) {
  if (process.env.UPLOAD_JPG) {
    if (file.originalname.endsWith(".jpg")) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  } else {
    if (file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      callback(null, true);
    } else {
      callback(null, false);
    }
  }
};

const upload = multer({
  storage: multer_storage,
  fileFilter: multer_filter
});

router.get('/', function(req, res, next) {
  const user = req.session.user;
  res.render('upload', {user});
});

router.post('/', upload.single('file'), function(req, res, next) {
  const user = req.session.user;
  const images = req.app.get('images');

  if (!req.file || !req.file.originalname.endsWith(".jpg")) {
    next(createError(400));
  } else {
    let prem = req.body.premium == 'on';
    images.push({name: `${req.body.title}.jpg`, user: user.login, premium: prem});
    res.redirect(`/profile/${user.login}`);
  }
});

module.exports = router;