'use strict';
const AWS = require('aws-sdk');
const CloudMetrics = require('./services/cloudMetrics');
const DataAgent = require('./services/dataAgent');

const URL = "data.nsw.gov.au/data/api/3/action/datastore_search"
var dataAgent = new DataAgent(URL);
var cloudMetrics= new CloudMetrics()

exports.handler = function (event, context, callback) {
    let lambda_name = "covid_nsw_nodejs";
    console.log(process.env.AWS_DEFAULT_REGION);
    try {
        
        let startTS = new Date();
        cloudMetrics.logHandlerCall(lambda_name)
        if (event == null) {
            let err = new Error('No request body found!');
            //console.log(JSON.stringify(err));
            throw err;
        }
        let requestBody = event;
        console.log(JSON.stringify(requestBody));
        
        //console.log(URL);
        dataAgent.fetchData(requestBody)
        .then(function(response) {
            var obj = JSON.parse(response);
            //console.log('response is received'+ JSON.stringify(obj.result));
            cloudMetrics.logHandlerTime(lambda_name, Date.now() - startTS)
            callback(null, obj.result.records);
        })
        .catch(err => {
            cloudMetrics.LogHandlerFail(lambda_name)
            console.log('ignore this event');
            console.log(JSON.stringify(err));
            callback(err);
        });
       
    } catch (err) {
        console.log(err);
        
        cloudMetrics.LogHandlerFail(lambda_name)
        // err can be ignored
        callback(null, err);
        return;
    }
};