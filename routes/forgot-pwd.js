var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('forgot-pwd', {});
});


router.post('/', function(req, res, next) {
    res.redirect('/login')
});

module.exports = router;
