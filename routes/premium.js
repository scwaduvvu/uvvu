var express = require('express');
var router = express.Router();
const { exec } = require('child_process');

router.get('/', function(req, res, next) {
  res.render('premium', {login: req.session.user.login});
});


router.post('/', function(req, res, next) {
    const users = req.app.get('users');
    const user = req.session.user;
    if (req.body.q1 == user.login &&
        /seek the ([Hh]oly )*[Gg]rail/.test(req.body.q2) &&
        /[Aa]frican or [Ee]uropean swallow/.test(req.body.q3))
    {
        const u_index = users.findIndex(el => el == user);
        exec(`mkdir public/images/${user.login}/premium`);
        users[u_index].premium = true;
        req.app.set('users', users);
    }
    res.redirect(`/profile/${user.login}`);
});

module.exports = router;
