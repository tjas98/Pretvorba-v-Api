var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('hbs');
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');
require('./app_api/config/passport')(passport);

var indexRouter = require('./app_server/routes/index');
var usersRouter = require('./app_server/routes/users');
//var profilrouter = require('./app_server/routes/profil');
var tekmaRouter = require('./app_server/routes/tekma');
//var indexApi = require('./app_api/routes/index');
var userApi = require('./app_api/routes/prijava');
var homepageApi = require('./app_api/routes/homepage');
var ustvariTekmoApi = require('./app_api/routes/ustvariTekmo')
var profilApi = require('./app_api/routes/profil')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'hbs');

require('./app_server/views/helpers/hlps');
require('./app_api/models/db');


hbs.registerPartials(path.join(__dirname, "app_server", "views/partials"));



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use('/', indexRouter);
app.use('/', usersRouter);
//app.use('/', profilrouter);
app.use('/', tekmaRouter);
app.use('/', userApi);
app.use('/', homepageApi);
app.use('/', ustvariTekmoApi);
app.use('/', profilApi);
//app.use('/api', indexApi);

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
