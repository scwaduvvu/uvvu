var createError = require('http-errors');
var express = require('express');
// var fileUpload = require('express-fileupload');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session')
var logger = require('morgan');
const { exec } = require('child_process');
const sqlite3 = require('sqlite3');
var db = new sqlite3.Database('./UvvU.db', (err) => {
  if (err) { console.error(err.message) }
  console.log("Connected to database.");
});
const saltRounds = 10;

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var forgotPwdRouter = require('./routes/forgot-pwd');
var signUpRouter = require('./routes/sign-up');
var logoutRouter = require('./routes/logout');
var profileRouter = require('./routes/profile');
var uploadRouter = require('./routes/upload');
var premiumRouter = require('./routes/premium');
var postersRouter = require('./routes/posters');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.set('db', db);
app.set('saltRounds', saltRounds);
exec(`find public/images/ -type f -name '*.jpg'`, (error, stdout, stderr) => {
  if (error) {
    console.log("Error, could not get list of images");
  } else {
    let output = stdout.trim().split('\n');
    output.forEach((el, i, o) => {
      let new_el = el.substring(14);
      new_el = new_el.split('/');
      if (new_el.length > 2) {
        o[i] = {name: new_el[2], user: new_el[0], premium: true};
      } else {
        o[i] = {name: new_el[1], user: new_el[0], premium: false};
      }
    });
    app.set('images', output);
  }
});

// app.use(fileUpload());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: "Da sicretu !", resave: false, saveUninitialized: false}));
app.use(express.static(path.join(__dirname, 'public')));

const public_paths = ["/login", "/forgot-pwd", "/sign-up"]
app.use(function(req, res, next) {
  if (req.session.user || public_paths.includes(req.path)) {
    next();
  } else {
    res.redirect('/login');
  }
});

app.use(function(req, res, next) {
  res.setTimeout(30000, function(){
    console.log('Request has timed out.');
    res.status(500);
    res.send("Timeout");
  });
  next();
});

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/forgot-pwd', forgotPwdRouter);
app.use('/sign-up', signUpRouter);
app.use('/logout', logoutRouter);
app.use('/profile', profileRouter);
app.use('/upload', uploadRouter);
app.use('/premium', premiumRouter);
app.use('/posters', postersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
