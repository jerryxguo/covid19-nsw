'use strict';

const expect = require('chai').expect;
const myLambda = require('../index');
const CloudMetrics = require('../services/cloudMetrics');
const LambdaTester = require( 'lambda-tester' );
const sinon = require("sinon");


describe( 'myLambda', function() {

  it('CloudWatch logHandlerCall should ok', function () {
    let name = 'testing logHandlerCall';
    let nameSpace = 'namespace';
    let metricName = 'metricname';
    // mock the sql client instead of using the AWS SQS 
    let cwClient = { putMetricData: function () { } };

    let cwClientSend = sinon.stub(cwClient, 'putMetricData').callsFake((params, callback) => {
        //expect(params).to.have.deep.property('MetricData',{'MetricName', metricName});
        expect(params).to.have.deep.property('Namespace', nameSpace);
        callback(null);
    });

    let cw = new CloudMetrics(nameSpace, metricName, cwClient);

    // just return the promise, mocha will take care of the rest.
    return cw.logHandlerCall(name).then(dataItem => {
        expect(cwClientSend.calledOnce).to.be.true;
        cwClientSend.restore();
    });
  });

  it('lambda get options ok', function () {
    let logHandlerCallStub = sinon.stub(CloudMetrics.prototype, "logHandlerCall").returns(Promise.resolve({}));
    let logHandlerFailStub = sinon.stub(CloudMetrics.prototype, "logHandlerFail").returns(Promise.resolve({}));  
    let logHandlerTimeStub = sinon.stub(CloudMetrics.prototype, "logHandlerTime").returns(Promise.resolve({}));
    let req = {
        "resource_id": "21304414-1ff1-4243-a5d2-f52778048b29",
        "fields": "lga_name19",
        "limit": 10000,
        "q": {
          "lga_name19": "k:*"
        }
      }

      return LambdaTester( myLambda.handler )
            .event( req )
            .expectResult( ( result ) => {
                expect( result ).to.be.an('array');
                expect( result ).to.have.lengthOf(3); 
                logHandlerCallStub.restore();
                logHandlerTimeStub.restore();
                logHandlerFailStub.restore();
            });
  });
  
  it('lambda get cases ok', function () {
    let logHandlerCallStub = sinon.stub(CloudMetrics.prototype, "logHandlerCall").returns(Promise.resolve({}));
    let logHandlerFailStub = sinon.stub(CloudMetrics.prototype, "logHandlerFail").returns(Promise.resolve({}));  
    let logHandlerTimeStub = sinon.stub(CloudMetrics.prototype, "logHandlerTime").returns(Promise.resolve({}));
    let req = {
      "resource_id": "21304414-1ff1-4243-a5d2-f52778048b29",
      "limit": 1,
      "filters": {},
      "q": {}
    }

    return LambdaTester( myLambda.handler )
          .event( req )
          .expectResult( ( result ) => {
              expect( result ).to.be.an('array');
              expect( result ).to.have.lengthOf(1); 
              logHandlerCallStub.restore();
              logHandlerTimeStub.restore();
              logHandlerFailStub.restore();
          });
  });
})