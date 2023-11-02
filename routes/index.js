var sampleSize = require('lodash/sampleSize');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {login: req.session.user.login});
});

router.get('/search', function(req, res, next) {
  const q = req.query.q;
  if (q) {
    const images = req.app.get('images');
    const re = new RegExp(`.*${q}.*`, 'i');
    let output = images.filter(el => re.test(el.name) || el.user == q);
    if (output.length > 0) {
      res.render('index', { output: output, login: req.session.user.login});
    } else {
      res.render('index', {login: req.session.user.login, search: q, vuln: process.env.XSS});
    }
  } else {
    res.render('index', {login: req.session.user.login});
  }
});

router.get('/random(/premium)?', function(req, res, next) {
  const images = req.app.get('images');
  let output;
  if (req.path == '/random/premium') {
    output = sampleSize(images, 6);
  } else {
    output = sampleSize(images.filter(el => !el.premium), 6);
  }
  res.render('index', {login: req.session.user.login, output});
});

module.exports = router;
