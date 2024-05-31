var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// set up rate limiter: maximum of five requests per minute
const RateLimit = require('express-rate-limit');

var indexRouter = require('./routes/index');
const apiV1IndexRouter = require('./routes/api/v1/index');
const apiV1LoginRouter = require('./routes/api/v1/login');
const apiV1TenksRouter = require('./routes/api/v1/tenks');

var app = express();

// since we're using rate limiting in production, we need to trust the first proxy
// https://express-rate-limit.mintlify.app/reference/error-codes#err-erl-unexpected-x-forwarded-for
if (app.get('env') === 'production') {
  app.set('trust proxy', 1); // trust first proxy
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// let's add the username if present as a morgan token
logger.token('username', function(req, res) { return req.user || 'anonymous' });

app.use(logger(':remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms :username'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var limiter = RateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // max 10 requests per windowMs
});

// apply rate limiter to API routes
app.use('/api', limiter);

app.use('/', indexRouter);
app.use('/api/v1/', apiV1IndexRouter);
app.use('/api/v1/login', apiV1LoginRouter);
app.use('/api/v1/tenks', apiV1TenksRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error(err);
    return res.status(400).send({ status: 400, message: err.message }); // Bad request
  };

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
