(function() {
    const cheerio = require('cheerio')
    const minimalist = require('minimist')
    const got = require('got')
    const Rx = require('rxjs/Rx')
    const DEFAULT_LIMIT = 1
    var limit = null
    var region = null
    var type = null

    processArguments()

    Rx.Observable.from(Rx.Observable.range(1, 50))
        .flatMap(readMatches)
        .map(address => "http://www.lolskill.net/" + address)
        .flatMap(readMatch)
        .filter(filterRegion)
        .filter(filterType)
        .take(limit)
        .subscribe((match) => {
                console.log(JSON.stringify(match, null, 4))
            }, (err) => {
                console.error(err);
            }, () => {
                process.exit() // workaround
            })

    function filterRegion(match) {
        if (region) {
            return match.region.toLowerCase().indexOf(region.toLowerCase()) >= 0
        }  else {
            return true
        }
    }

    function filterType(match) {
        if (type) {
            return match.type.toLowerCase().indexOf(type.toLowerCase()) >= 0
        }  else {
            return true
        }
    }

    function readMatches(index) {
        return Rx.Observable.create(function(observable) {
            got('http://www.lolskill.net/live-matches/page-'+index, { json: false }).then(response => {
                const $ = cheerio.load(response.body)
                $('.live-match').find('a').each(function(index, it) {
                    observable.next($(it).attr('href'))
                  })
                observable.complete()
            }).catch(error => {
                //ignoring errors for now observable.error(error)
            });
        })
    }

    function readMatch(url) {
        return Rx.Observable.create(function(observable) {
            got(url, { json: false }).then(response => {
                const $ = cheerio.load(response.body)
                var type = $('.row.gametype h3')
                    .map(function() { return $(this).text().trim() })
                    .get().join(' / ')
                var region =  $('#search-realm').text().trim()
                var summoners = $('.gamesummoner-card .summoner-name>a').map(function(index, it) {
                    return $(it).html()
                  }).get()
                observable.next({ type: type, region: region, summoners: summoners })
                observable.complete()
            }).catch(error => {
                //ignoring errors for now observable.error(error)
            });
        })
    }

    function processArguments() {
        var args = minimalist(process.argv.slice(2))
        limit = args['l'] || args['limit'] || DEFAULT_LIMIT
        region = args['r'] || args['region']
        type = args['t'] || args['type']
    }
})()
