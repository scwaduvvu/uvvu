var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('posters', {login: req.session.user.login});
});


router.get('/:id', function(req, res, next) {
    const db = req.app.get('db');
});

module.exports = router;