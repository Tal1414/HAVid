let router = require('express').Router();
let cache = require('memory-cache');
let getAds = require('./getAds');
let parseData = require('./parseData');

router.use('/getinfo/:domain', function (req, res, next) {
    let toFetch = "http://www." + req.params.domain + "/ads.txt";

    getAds(toFetch).then(function (resp) {
        //if resp is not a number, we got the data. else we have an error/data already in cache
        if (isNaN(resp)) {
            let data = resp.split("\n");
            let readyData = parseData(data);
            let dataToArray = Array.from(readyData);
            //put the data we got into the cache.
            cache.put(toFetch, dataToArray);
            res.send(dataToArray);
            //we already have the correct data in cache.
        } else if (resp === 304) {
                res.send(cache.get(toFetch));
        } else {
            res.sendStatus(resp);
        }
    });
});

module.exports = router;