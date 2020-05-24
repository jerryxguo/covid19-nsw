'use strict';
const https = require("https");
const { URL } = require('url');

class DataAgent {
   
    /**
    * @param {String} url the remote server url
    */
    constructor(url) {
        this._url = url;
        if(process.env.REMOTE_SERVER_URL){
            this._url = process.env.REMOTE_SERVER_URL;
        }        
    }

    /**
    * fetch data from remote server
    * @param {Object} request 
    * @returns {Promise<Object>}
    */
    fetchData(request) {
      
        if ("q" in request && ("lga_name19" in request.q ||"postcode" in request.q) && "fields" in request){
            return this._query(this._url, request);
        } else if("filters" in request){
            return this._queryWithFilter(this._url, request);
        }
        else{
            return new Promise(function(resolve, reject) {
                let err = new Error('request is invalid!');            
                reject(err);
            });
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
      
        let q ={};
        q[r.fields] = searchString;

        let parameters = {
            'resource_id' : r.resource_id,
            'fields':r.fields,
            'q': JSON.stringify(q),
            'sort':r.fields,
            'plain':false,
            'distinct':true
        };
       

        var queryString = Object.entries(parameters).map(([key, val]) => `${key}=${val}`).join('&');
        const options = {
            hostname: url.substring(0, url.indexOf('/')),
            port: 443,
            path: '/'+ url.substring(url.indexOf('/')+1) + "?"+queryString,
            method: 'GET'
        };
        console.log(options.hostname+options.path);
        return new Promise(function(resolve, reject) {
            https.request(options, res => {
                // reject on bad status
                if (res.statusCode < 200 || res.statusCode >= 300) {
                    return reject(new Error('statusCode=' + res.statusCode));
                }
                let body = ''; 
                res.setEncoding('utf8');
                res.on('data', d =>{
                  body+=d;
                });
                res.on('end', () => {
                  resolve(body);
                });
              })              
              .on('error', e => {
                console.error(e);
                reject(Error(e));
              })
              .end();           
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
            var req = https.request(options, res => {
                let body = ''; 
                // reject on bad status
                if (res.statusCode < 200 || res.statusCode >= 300) {
                    return reject(new Error('statusCode=' + res.statusCode));
                }
                res.setEncoding('utf8');
                res.on('data', d =>body+=d );
                res.on('end', () => resolve(body));
            });              
            req.on('error', e => {
                console.error(e);
                reject(Error(e));
            });
            req.write(data);
            req.end();
        });
        
    }
}
module.exports = DataAgent;