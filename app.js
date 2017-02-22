var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// configuring passport
var passport = require('passport');
var localStrategy = require('passport-local');

// defining routes
var routes = require('./routes/index');
var establishments = require('./routes/establishments');
var statisticalreports = require('./routes/statisticalreports');
var indicators = require('./routes/indicators');
var user = require('./routes/user');

var app = express();

//you won't need 'connect-livereload' if you have livereload plugin for your browser
//app.use(require('connect-livereload')());

var expressSession = require('express-session');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'data')));
app.use(express.static(path.join(__dirname, 'docs')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.use('/', routes);
app.use('/establishments', establishments);
app.use('/statisticalreports', statisticalreports);
app.use('/user', user);
app.use('/indicators', indicators);

app.use(expressSession({secret: 'REKnlk32$#(sdf', saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
