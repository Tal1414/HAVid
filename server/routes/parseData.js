module.exports = function parseData(data) {
    //filter only the lines with valid addresses (it has letters, then a dot (exactly one!) and again letters.
    let newArray = data.filter(function (line) {
        return /^[^#]([A-Za-z])+.{1}[A-Za-z]+/.test(line);
    });

    let domainsMap = new Map();
    let set = new Set();

    //add every domain to a set, in order to know how many different addresses we have
    for (let i = 0; i < newArray.length; i++) {
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
    for (let i = 0; i < newArray.length; i++) {
        let domain = newArray[i].substring(0, newArray[i].indexOf(','));
        domain = domain.replace(/\s/g, '');
        domainsMap.set(domain, domainsMap.get(domain) + 1);
    }
    //delete any empty key
    if (domainsMap.get("")) {
        domainsMap.delete("");
    }

    return domainsMap;
}

