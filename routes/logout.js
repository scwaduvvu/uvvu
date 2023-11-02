var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
    res.clearCookie('connect.sid');
    if (process.env.LOGOUT_VULN != "true") {
        req.session.destroy()
    }
    res.redirect('/login')
});

module.exports = router;
