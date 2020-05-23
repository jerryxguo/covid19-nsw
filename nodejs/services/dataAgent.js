'use strict';
const https = require("https");
const { URL } = require('url');

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
        if ("q" in request &&  ("lga_name19" in request.q ||"postcode" in request.q)){
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
        let searchString = "";
        if("lga_name19" in r.q){
            searchString = r.q.lga_name19;
        }
        else if("postcode" in r.q){
            searchString = r.q.postcode;
        }
      
        var queryString = "https://"+ url+'?resource_id=' + r.resource_id + '&q={"' + r.fields + '":"'+ searchString + '"}&fields='
         + r.fields + '&sort='+ r.fields+'&plain=false&distinct=true';

        console.log("query:"+new URL(queryString));
        return new Promise(function(resolve, reject) {
            https.get(new URL(queryString), (res) => {
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