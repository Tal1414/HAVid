var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var axios = require('axios');
var cors = require('cors');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);


app.use('/getads/:domain', function(req, res, next) {
  console.log(req.params.domain);
  let toFetch = "http://www." + req.params.domain + "/ads.txt";
  getAds(toFetch).then(function (resp) {
    let data = resp.split("\n");
    let readyData = parseData(data);
    res.send(Array.from(readyData));
  });
});

async function getAds(address) {
  const response = await axios.get(address).then(function (res) {
    return res.data;
  }).then(function (data) {
    return data;
  });
  return response;
}

function parseData(data){
  let newArray = data.filter(function (line) {
    return /^[^#]([A-Za-z])+.{1}[A-Za-z]+/.test(line);
    });

  let domainsMap = new Map();
  let set = new Set();

  for (let i=0; i<newArray.length; i++) {
    let domain = newArray[i].substring(0, newArray[i].indexOf(','));
    domain = domain.replace(/\s/g, '');
    set.add(domain);
  }

  set.forEach(function (key) {
    domainsMap.set(key, 0);
  });


  for (let i=0; i<newArray.length; i++) {
    let domain = newArray[i].substring(0, newArray[i].indexOf(','));
      domain = domain.replace(/\s/g, '');
      domainsMap.set(domain, domainsMap.get(domain) + 1);
  }

  return domainsMap;
}

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
