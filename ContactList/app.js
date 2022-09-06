var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const ex_session = require('express-session');
var logger = require('morgan');
var indexRouter = require('./routes/index');
const session = require('express-session');
const router = require('./routes/index');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/final';
let db = null;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(ex_session({
  secret: 'final'
}));
app.use(express.static(path.join(__dirname, 'public')));

const startup = async () => { 

    try{
        const connection = await MongoClient.connect(url);
        db = connection.db('final');
        db.collection("contacts");

    } catch (ex){
      console.error(ex);
    }
    
}

const db_middleware = (req, res, next) => {
  req.db = db;
  next();
}

app.use(db_middleware);
app.use('/', indexRouter);

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
startup();
module.exports = app;
