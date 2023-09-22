var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var mysql = require('mysql');
var bcrypt = require('bcrypt');

// set up database
var dbConnectionPool = mysql.createPool({
  host: 'localhost',
  database: 'coolfroggyclub'
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var clubManagersRouter = require('./routes/club_managers');
var adminsRouter = require('./routes/admins');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// set up middleware of the database
app.use(function(req, res, next) {
  req.pool = dbConnectionPool;
  next();
});

// set up session after cookie parser and serving the static webpage
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'super secret string',
  secure: false
}));

// testing if session works
// app.use(function(req,res,next){
//   console.log("The current user is:  " + req.session.username);
//   next();
// });

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/club_managers', clubManagersRouter);
app.use('/admins', adminsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
