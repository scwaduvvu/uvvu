const bcrypt = require('bcrypt');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('login', {});
});


router.post('/', function(req, res, next) {
    const db = req.app.get('db');
    let stmt = db.prepare("SELECT * FROM users WHERE login=?;");
    stmt.get(req.body.login, (err, row) => {
        if (err) {
            console.log(err.message);
            next({status: 500, message: "Unexpected error occured."});
        } else if (row == undefined) {
            res.render('login', { wrong_creds: true })
        } else {
            bcrypt.compare(req.body.password, row.password).then(logged => {
                if (logged) {
                    req.session.user = row;
                    res.redirect('/');
                } else {
                    res.render('login', { wrong_creds: true })
                }
            })
        }
    });
    stmt.finalize();
});

module.exports = router;
