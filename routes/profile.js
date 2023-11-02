const bcrypt = require('bcrypt');
const { exec } = require('child_process');
var express = require('express');
var router = express.Router();

router.get('/:login', function(req, res, next) {
    let user, u_images;
    const images = req.app.get('images');
    if (process.env.BROKEN_ACCESS == "true") {
        const db = req.app.get('db');
        db.get("SELECT * FROM users WHERE login=?;", [req.params.login], (err, row) => {
            if (err) {
                console.log(err.message);
                next({status: 500, message: "Unexpected error occured."});
            } else if (row == undefined) {
                next({status: 500, message: "Unexpected error occured."});
            } else {
                u_images = images.filter(el => el.user == row.login);
                res.render('profile', {user: row, images: u_images});
            }
        })
    } else {
        user = req.session.user;
        u_images = images.filter(el => el.user == user.login);
        res.render('profile', {user, images: u_images});
    }
});


router.get('/:login/search', function(req, res, next) {
    let user = req.session.user;
    let q = req.query.q;
    if (q == undefined) {
        return next();
    }
    if (process.env.CMD_INJECTION != "easy") {
        if (q.length > 25) {
            return next({status: 400, message: "Query too long"});
        }
    }
    if (process.env.CMD_INJECTION == "hard") {
        let blacklist = [';', '|', '$', '>', '<'];
        if (blacklist.some(c => q.includes(c))) {
            return next({status: 400, message: "Unauthorized character used"});
        } else if (q.includes('&') && !q.includes('&&')) {
            return next({status: 400, message: "Unauthorized character used"});
        }
    }
    exec(`find public/images/ -type f -name '*.jpg' | grep -i ${q}`, (error, stdout, stderr) => {
        if (error) {
            console.log("Error, could not get user's list of images");
            res.render('profile', {user, images: []});
        } else {
            let output = stdout.trim().split('\n');
            output.forEach((el, i, o) => {
                if (el.startsWith('public/images/')) {
                    let new_el = el.substring(14);
                    new_el = new_el.split('/');
                    if (new_el.length > 2) {
                        o[i] = {name: new_el[2], user: new_el[0], premium: true};
                    } else {
                        o[i] = {name: new_el[1], user: new_el[0], premium: false};
                    }
                } else {
                    o[i] = {name: el, user: user.login, premium: false};
                }
            });
            res.render('profile', {user, images: output});
        }
    });
});


router.post('/modify-user', function(req, res, next) {
    const db = req.app.get('db');
    let stmt = db.prepare("SELECT * FROM users WHERE login=?;");
    stmt.get(req.body.login, (err, row) => {
        if (err) {
            console.log(err.message);
            next({status: 500, message: "Unexpected error occured."});
        } else if (row == undefined) {
            res.redirect('/');
        } else {
            bcrypt.compare(req.body.password, row.password).then(logged => {
                if (logged) {
                    db.run("UPDATE users SET email=? WHERE login=?;", [req.body.email, req.body.login], err => {
                        if (err) {
                            console.log(err.message);
                            next({status: 500, message: "Unexpected error occured."});
                        }
                    });
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
