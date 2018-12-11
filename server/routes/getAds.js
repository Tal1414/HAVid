let axios = require('axios');

//last modified values of each domain, in order to help us work with the cache.
let cacheLastModified = [];

module.exports = async function getAds(address) {
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
    } else {
        config = null;
    }

    const response = await axios.get(address, config).then(function (res) {
        //update the last-modified for the specific address
        cacheLastModified[address] = res.headers['last-modified'];
        return res.data;
    }).catch(function (error) {
        if (error.response) {
            return error.response.status;
        } else {
            return 400;
        }
    });
    return response;
}
