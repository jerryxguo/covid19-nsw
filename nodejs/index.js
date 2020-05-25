'use strict';
const AWS = require('aws-sdk');
const CloudMetrics = require('./services/cloudMetrics');
const DataAgent = require('./services/dataAgent');
const logger = require('./services/logger');
const URL = "data.nsw.gov.au/data/api/3/action/datastore_search"
var dataAgent = new DataAgent(URL);
var cloudMetrics= new CloudMetrics('JerryGuo','LambdaNodeJS');

exports.handler = function (event, context, callback) {
    let lambda_name = "covid_nsw_nodejs";
   
    try {
        
        let startTS = new Date();
        cloudMetrics.logHandlerCall(lambda_name)
        if (event == null) {
            let err = new Error('No request body found!');
            logger(JSON.stringify(err));
            throw err;
        }
        let requestBody = event;
        logger(JSON.stringify(requestBody));
        
        logger(URL);
        dataAgent.fetchData(requestBody)
        .then(function(response) {
            var obj = JSON.parse(response);
            logger('response is received'+ JSON.stringify(obj.result));
            cloudMetrics.logHandlerTime(lambda_name, Date.now() - startTS)
            callback(null, obj.result.records);
        })
        .catch(err => {
            cloudMetrics.logHandlerFail(lambda_name)
            logger('ignore this event');
            logger(JSON.stringify(err));
            callback(err);
        });
       
    } catch (err) {
        logger(err);
        
        cloudMetrics.logHandlerFail(lambda_name)
        // err can be ignored
        callback(null, err);
        return;
    }
};