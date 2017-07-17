var express = require('express');
//var mongoose = require('mongoose');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var findRemoveSync = require('find-remove');

var index = require('./routes/index');
var users = require('./routes/users');
var films = require('./routes/films');
var people = require('./routes/people');

var app = express();

// connect to database
//mongoose.connect('mongodb://purii:ruslan16@ds161012.mlab.com:61012/filmbase');
/*mongoose.connect('mongodb://purii:ruslan16@ds161012.mlab.com:61012/filmbase', {
  useMongoClient: true
});*/

// delete posters archive
app.on('listening', function () {
    findRemoveSync('./public/images/temp', {age: {seconds: 3600}, extensions: '.jpg'});
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/films', films);
app.use('/people', people);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
