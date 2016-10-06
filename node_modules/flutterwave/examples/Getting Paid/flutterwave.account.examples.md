# Account class Examples
```
//Instantiate the class
var Flutterwave = require('flutterwave');
var flutterwave = new Flutterwave("YOUR_API_KEY","YOUR_MERCHANT_KEY");
```
## Call the Account methods

```
//Charge an account
flutterwave.Account.charge('44449309', callback);

//Example success response
{
  "data": {
    "amount": null,
    "transactionreference": null,
    "responseMessage": "Successful, pending OTP validation",
    "accountToken": "4rOPbaVkM70Nr6Z9587",
    "responseCode": "00"
  },
  "status": "success"
}
```

```
//Validate an account charge
/*
After succesfully charging an account you can pass the accountToken from the charge response [see above] to validate
*/
flutterwave.Account.validate({
	'amountToPay':'4000', 
	'otp':'4884993849',
	'trxref':'FLW00291105',
	'accountToken':'MEANI'
}, callback);
```

```
//Resends OTP for a given account transaction
flutterwave.Account.resendOtp({
	'validateoption':'SMS',
	'trxref':'FLW00291105'
}, callback);

```