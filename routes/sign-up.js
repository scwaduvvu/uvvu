const bcrypt = require('bcrypt');
var express = require('express');
var router = express.Router();
const { exec } = require('child_process');


router.get('/', function(req, res, next) {
  res.render('sign-up', {});
});


router.post('/', function(req, res, next) {
    const db = req.app.get('db');
    const email = req.body.email;
    const login = req.body.login;
    const pass = req.body.password;
    const pass_conf = req.body.password_conf;
    if (pass != pass_conf) {
        res.status(400);
        res.render('sign-up', {pwd_missmatch: true});
    } else if (!/^[a-zA-Z]*$/.test(login)) {
        res.status(400);
        res.render('sign-up', {bad_login: true});
    } else {
        db.get("SELECT * FROM users WHERE login=? OR email=?;", [login, email], (err, row) => {
            if (err) {
                console.log(err.message);
                return next({status: 500, message: "Unexpected error occured."});
            }
            if (row) {
                res.status(409);
                res.render('sign-up', {already_reg: true});
            } else {
                bcrypt.hash(pass, 10).then(hash => {
                    db.run("INSERT INTO users(login,email,password,premium) VALUES (?,?,?,?);",
                            login, email, hash, false);
                    exec(`mkdir public/images/${login}`);
                    res.redirect('/login');
                });
            }
        });
    }
});

module.exports = router;
