const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose'); mongoose.Promise = global.Promise;
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary');

const index = require('./routes/index');
const channel = require('./routes/channel');
const list = require('./routes/list');
const film = require('./routes/film');
const auth = require('./routes/auth');

const app = express();

// connect to database
mongoose.connect('mongodb://admin:ruslan16@ds161012.mlab.com:61012/filmbase', { useMongoClient: true })
      .then(() => console.log('Database connected'))
      .catch(err => console.log('Database connection error'));

//connect to image storage
cloudinary.config({
    cloud_name: 'dsqyqvcq4',
    api_key: '127728219583678',
    api_secret: 'NpdV7OhIXX-FMhNe8xl8PBHg34E'
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(session( { secret: 'bvalsi47ty32q84f2h48eqg82uhguiwhgurh3hg78', name: 'hg4325vbbkvc3l' } ));
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

app.use('/', index);
app.use('/channel', channel);
app.use('/list', list);
app.use('/film', film);
app.use('/auth', auth);

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
