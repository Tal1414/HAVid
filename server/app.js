var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var axios = require('axios');
var cors = require('cors');
var cache = require('memory-cache');

var index = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//without cors I can't send requests from the same ip to other ports.
app.use(cors());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

//last modified values of each domain, in order to help us work with the cache.
let cacheLastModified = [];

app.use('/getads/:domain/:sortBy', function(req, res, next) {
  console.log(req.params.domain);
  let toFetch = "http://www." + req.params.domain + "/ads.txt";

  getAds(toFetch).then(function (resp) {
    //if resp is not a number, we got the data. else we have an error/data already in cache
    if (isNaN(resp)) {
      let data = resp.split("\n");
      let readyData = parseData(data);
      let dataToArray = Array.from(readyData);
      //put the data we got into the cache.
      cache.put(toFetch, dataToArray);
      //1 sort by descending order, 2 ascending.
      if (req.params.sortBy === '1'){
        dataToArray.sort(sortFunctionD);
      } else if (req.params.sortBy === '2'){
        dataToArray.sort(sortFunctionA);
      }
      res.send(dataToArray);
      //we already have the correct data in cache.
    } else if (resp === 304) {
      if (req.params.sortBy === '1'){
        res.send(cache.get(toFetch).sort(sortFunctionD));
      } else if (req.params.sortBy === '2'){
        res.send(cache.get(toFetch).sort(sortFunctionA));
      }
    } else {
      res.sendStatus(resp);
    }
  });
});

async function getAds(address) {
  //we add an header to the request in order to save time if the last-modified hasn't changed and
  //we have the data in cache.

  let config;
  if (cacheLastModified[address]) {
    config = {
      headers: {
        'If-Modified-Since': cacheLastModified[address],
      },
        timeout: 1000
      };
  } else { config = null; }

  const response = await axios.get(address, config).then(function (res) {
    //update the last-modified for the specific address
    cacheLastModified[address] = res.headers['last-modified'];
    return res.data;
  }).catch(function (error) {
    if(error.response){
      return error.response.status;
    } else {
      return 400;
    }
  });
  return response;
}


function parseData(data){
  //filter only the lines with valid addresses (it has letters, then a dot (exactly one!) and again letters.
  let newArray = data.filter(function (line) {
    return /^[^#]([A-Za-z])+.{1}[A-Za-z]+/.test(line);
    });

  let domainsMap = new Map();
  let set = new Set();

  //add every domain to a set, in order to know how many different addresses we have
  for (let i=0; i<newArray.length; i++) {
    let domain = newArray[i].substring(0, newArray[i].indexOf(','));
    //removing any spaces
    domain = domain.replace(/\s/g, '');
    set.add(domain);
  }
  //initialize the map object - counter will start as 0.
  set.forEach(function (key) {
    domainsMap.set(key, 0);
  });

  //counting
  for (let i=0; i<newArray.length; i++) {
    let domain = newArray[i].substring(0, newArray[i].indexOf(','));
      domain = domain.replace(/\s/g, '');
      domainsMap.set(domain, domainsMap.get(domain) + 1);
  }
  //delete any empty key
  if (domainsMap.get("")){
    domainsMap.delete("");
  }

  return domainsMap;
}

//sort by descending order
function sortFunctionD(a, b) {
  if (a[1] === b[1]) {
    return 0;
  }
  else {
    return (a[1] > b[1]) ? -1 : 1;
  }
}

//sort by ascending order
function sortFunctionA(a, b) {
  if (a[1] === b[1]) {
    return 0;
  }
  else {
    return (a[1] < b[1]) ? -1 : 1;
  }
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
