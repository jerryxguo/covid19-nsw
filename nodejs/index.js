'use strict';
const AWS = require('aws-sdk');
const DataAgent = require('./services/dataagent');

const URL = "data.nsw.gov.au/data/api/3/action/datastore_search"
var dataAgent = new DataAgent(URL);

exports.handler = function (event, context, callback) {
 
    console.log(process.env.AWS_DEFAULT_REGION);
    try {
        if (event == null) {
            let err = new Error('No request body found!');
            //console.log(JSON.stringify(err));
            throw err;
        }
        let requestBody = event;
        console.log(JSON.stringify(requestBody));
        if (requestBody.filters==null||(requestBody.q == null && requestBody.fields!=null)) {
            let err = new Error('No querys or filters found!');
            //console.log("requestBody.q == null||requestBody.filters==null");
            //console.log(err);
            throw err;
        }
        //console.log(URL);
        dataAgent.fetchData(requestBody)
        .then(function(response) {
            var obj = JSON.parse(response);
            console.log('response is received'+ JSON.stringify(obj.result));
            callback(null, obj.result.records
            );
        })
        .catch(err => {
            
            console.log(JSON.stringify(err));
            callback(err);
        });
       
    } catch (err) {
        console.log(err);
        //console.log('igroning this event');
   
        // err can be ignored
        callback(null, err);
        return;
    }
};