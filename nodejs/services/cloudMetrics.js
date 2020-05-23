'use strict';

const AWS = require('aws-sdk');
var awsCloudWatch = new AWS.CloudWatch({apiVersion: '2010-08-01'}); 

class CloudMetrics {
    /**
     * @param {Object} agent service for recording metrics
     */
    constructor (agent=awsCloudWatch) {
        this._agent = agent;
        this._nameSpace = 'JerryGuo';
        this._metricName = 'LambdaNodeJS';
    }

    /**
     * log the 'succeeded' register
     * @param {String} name Handler name
     */
    logHandlerCall(name) {

        var params = {
            MetricData: [ /* required */
                {
                    MetricName: this._metricName, /* required */
                    Dimensions: [
                        {
                            Name: name, /* required */
                            Value: 'called' /* required */
                        },
                    ],
                    Timestamp: new Date(),
                    Unit: "Count",
                    Value: 1
                },
            ],
            Namespace: this._nameSpace
        };

        return new Promise((pResolve, pReject) => {
            this._agent.putMetricData(params, function (err, data) {
                if (err) {
                    console.log(err, err.stack); // an error occurred
                    pReject(err);
                    return;
                } else {
                    pResolve();
                    return;
                }
            });
        });
    }

    /**
     * log the 'failed' register
     * @param {String} name handler name
     */
    LogHandlerFail(name) {
        var params = {
            MetricData: [ /* required */
                {
                    MetricName: this._metricName, /* required */
                    Dimensions: [
                        {
                            Name: name, /* required */
                            Value: 'failed' /* required */
                        }
                    ],
                    Timestamp: new Date(),
                    Unit: "Count",
                    Value: 1
                },
            ],
            Namespace: this._nameSpace
        };

        return new Promise((pResolve, pReject) => {
            this._agent.putMetricData(params, function (err, data) {
                if (err) {
                    console.log(err, err.stack); // an error occurred
                    pReject(err);
                    return;
                } else {
                    pResolve();
                    return;
                }
            });
        });
    }

    /**
     * log how many milliseconds it take
     * @param {Number} ms milliseconds
     */
    logHandlerTime(name, ms) {
        var params = {
            MetricData: [ /* required */
                {
                    MetricName: this._metricName, /* required */
                    Dimensions: [
                        {
                            Name: name, /* required */
                            Value: 'time' /* required */
                        }
                    ],
                    Timestamp: new Date(),
                    Unit: "Milliseconds",
                    Value: ms
                },
            ],
            Namespace: this._nameSpace
        };

        return new Promise((pResolve, pReject) => {
            this._agent.putMetricData(params, function (err, data) {
                if (err) {
                    console.log(err, err.stack); // an error occurred
                    pReject(err);
                    return;
                } else {
                    pResolve();
                    return;
                }
            });
        });
    }
}

module.exports = CloudMetrics;