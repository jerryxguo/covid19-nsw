'use strict';
const https = require("https");

class DataAgent {
   
    /**
    * @param {String} url the remote server url
    */
    constructor(url) {
        this._url = url;
    }

    /**
    * fetch data from remote server
    * @param {Object} request 
    * @returns {Promise<Object>}
    */
    fetchData(request) {
        if (request.filters.lga_name19 == null 
            && request.filters.postcode == null 
            && request.fields != null) {
            return this._query(this._url, request);
        } else {
            return this._queryWithFilter(this._url, request);
        }
    }

    /**
     * private api to get data from remote server
     * @param {String} url 
     * @param {Object} r 
    */
    _query(url, r){
        let searchString = r.q.lga_name19;
        if (searchString == "") {
            searchString = r.q.postcode;
        }
        var queryString = url+'?resource_id=' + r.resource_id + '&q={"' + r.fields + '":"'+ searchString + '"}&fields='
         + r.fields + '&sort='+ r.fields+'&plain=false&distinct=true';

        console.log(queryString);
        return new Promise(function(resolve, reject) {
            https.get(queryString, (res) => {
                    res.on('data', (d) => {
                        resolve(d);
                    });                
                }).on('error', (e) => {
                    reject(Error(e));
                });
        });
    }

     /**
     * private api to get data by filter from remote server
     * @param {String} url 
     * @param {Object} r 
    */
    _queryWithFilter(url, r){
        let p = {
            resource_id:      r.resource_id,
            filters: r.filters,
            limit:   r.limit,
        };
        const data = JSON.stringify(p);
          
        const options = {
            hostname: url.substring(0, url.indexOf('/')),
            port: 443,
            path: '/'+ url.substring(url.indexOf('/')+1),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };
        return new Promise(function(resolve, reject) {
            https.request(options, res => {
                let body = ''; 
                res.setEncoding('utf8');
                res.on('data', d =>body+=d );
                res.on('end', () => resolve(body));
            })              
            .on('error', e => {
                console.error(e);
                reject(Error(e));
            })
            .write(data);
        });
        
    }
}
module.exports = DataAgent;