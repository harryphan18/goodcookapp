var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash    = require('connect-flash');
var port     = process.env.PORT || 3002;

var app = express();

require('./config/passport')(passport);

// Cấu hình ứng dụng express
app.use(morgan('dev')); // sử dụng để log mọi request ra console
app.use(cookieParser()); // sử dụng để đọc thông tin từ cookie

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


require('./routes/myroutes')(app, passport); // load các routes từ các nguồn
app.use(express.static(__dirname)); // quan trọng vl, không có sẽ lỗi NOT FOUND 404 các file css
// app.use(express.static(path.join(__dirname + '/javascripts/')));

app.listen(port, function () {
  console.log("Listening at " + port);
});

module.exports = app;
