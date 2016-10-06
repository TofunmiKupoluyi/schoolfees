'use strict';
var expect  = require('chai').expect;
var flwBase = require('../lib/flw.base');
var flwAccount = require('../lib/flw.account');

describe('#FlutterwaveAccountTest', function () {

	it('Should throw accountToken is required error', function () { 
	    var flutterwavebase = new flwBase('tk_NabYp2XjZ6G9WwdFruzK','tk_tdyrSMQo8a');
		var flutterwaveaccount = new flwAccount(flutterwavebase);
	    function testAccountPay(){
	    	flutterwaveaccount.chargeRecurrentAccount({}, function () {});
	    }
	    expect(testAccountPay).to.throw('accountToken is required');
	});  


	it('Should return "SMS failed!', function (done) { 
		this.timeout(50000);
	    var flutterwavebase = new flwBase('tk_NabYp2XjZ6G9WwdFruzK','tk_tdyrSMQo8a');
		var flutterwaveaccount  = new flwAccount(flutterwavebase);
		/*console.log*/(flutterwaveaccount.initiateRecurrentPayment('0690000001', function (err, res, body) { console.log(err,body);
			expect(body).to.have.property('data'); 
			expect(body.data.responseMessage).to.equal('SMS failed!');
			done(); 
		}));
	     
	}); 


	

});