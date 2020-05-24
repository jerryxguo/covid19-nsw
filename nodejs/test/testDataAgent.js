'use strict';

var expect = require('chai').expect;
const myLambda = require('../index')
const LambdaTester = require( 'lambda-tester' );


describe( 'myLambda', function() {

  it('lambda get options ok', function () {
      
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
                
            });
  });
  
  it('lambda get cases ok', function () {
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
              
          });
  });
})