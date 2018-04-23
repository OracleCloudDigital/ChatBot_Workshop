/**
 * The ExpressJS namespace.
 * @external ExpressApplicationObject
 * @see {@link http://expressjs.com/3x/api.html#app}
 */

 const DATA_ROOT = './data/';
 const STATS = require(DATA_ROOT + 'metrics.json');
/**
 * Mobile Cloud custom code service entry point.
 * @param {external:ExpressApplicationObject}
 * service
 */
module.exports = function(service) {


	/**
	 *  The file samples.txt in the archive that this file was packaged with contains some example code.
	 */


	service.post('/mobile/custom/BankingApi/accounts/:id/transactions', function(req,res) {
		var result = {};
		var statusCode = 201;
		var data = req.body;
		var d = new Date();
	  var dateStr = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
		var newPayment = {
			"date": dateStr,
			"type": data.type,
			"category": data.toAccount,
			"description": data.description || "",
      "fromAccountType": data.fromAccountType || "",
			"amount": Number(data.amount)
		};

		var payments = require(DATA_ROOT + req.params.id + '.json');
    payments.push(newPayment);
    console.log("BankingApi - new Transactions after Payment = " + JSON.stringify(payments));
    result = newPayment;

    var transactions = require(DATA_ROOT + 'metrics.json');
    newPayment.account = req.params.id;
    transactions.push(newPayment);
    console.log("BankingApi - new Metrics after Payment = " + JSON.stringify(transactions));
		res.set("Content-Type", 'application/json');
		res.send(statusCode, result);
	});

	service.get('/mobile/custom/BankingApi/accounts/:id/transactions', function(req,res) {
		var result = {};
		var statusCode = 200;
		if (statusCode == 200){
			var acceptType = req.accepts(['application/json']);
      var transactions = {};
      try {
          transactions = require(DATA_ROOT + req.params.id + '.json');
      }
      catch (error) {
          // probably module not found, that's ok, no transactions..
          transactions = [];
      }
		}
		result = transactions;
		if (req.query.category != null && transactions.length > 0){
			var filteredTransactions = transactions.filter(
						function (arg) {
							return arg.category === req.query.category;
						}
			);
				result = filteredTransactions;
		}
		res.send(statusCode, result);
	});

  service.get('/mobile/custom/BankingApi/accounts/:id/transactions/:tid', function(req,res) {
    var result = {};
		var statusCode = 200;
		if (statusCode == 200){
			var acceptType = req.accepts(['application/json']);
      var transactions = {};
      try {
          transactions = require(DATA_ROOT + req.params.id + '.json');
      }
      catch (error) {
          // probably module not found, that's ok, no transactions..
          transactions = [];
      }
		}
		result = transactions;
		if (req.params.tid != null && transactions.length > 0){
			var filteredTransactions = transactions.filter(
						function (arg) {
							return arg.date === req.params.tid;
						}
			);
				result = filteredTransactions[0];
		}
		res.send(statusCode, result);
	});

	service.get('/mobile/custom/BankingApi/stats', function(req,res) {
		var result = {};
		var statusCode = 200;
		if (statusCode == 200){
			var acceptType = req.accepts(['application/json']);
      var transactions = {};
      try {
          transactions = require(DATA_ROOT + 'metrics.json');
      }
      catch (error) {
          // probably module not found, that's ok, no transactions..
          transactions = [];
      }
		}
	 	result.categoryDimension = "category";
		result.account = "4352-3423-1234-5239";
		result.metrics = transactions;
		if (req.query.category != null && transactions.length > 0){
			var filteredTransactions = transactions.filter(
						function (arg) {
							return arg.category === req.query.category;
						}
			);
				result.metrics = filteredTransactions;
		}
		res.send(statusCode, result);
	});

	service.get('/mobile/custom/BankingApi/accounts/:id', function(req,res) {
		var result = {};
		var statusCode = 200;
		var accounts = require(DATA_ROOT + 'accounts.json');
		if (statusCode == 200){
			var acceptType = req.accepts(['application/json']);
			var account = accounts.filter(
						function (arg) {
							return arg.id === req.params.id;
						}
			);
		}
		result = account[0];
		res.send(statusCode, result);
	});

	service.get('/mobile/custom/BankingApi/accounts', function(req,res) {
		var result = {};
		var statusCode = 200;
		var accounts = require(DATA_ROOT + 'accounts.json');
		if (statusCode == 200){
			var acceptType = req.accepts(['application/json']);
      result = accounts;
		}
		res.send(statusCode, result);
	});

	service.get('/mobile/custom/BankingApi/accounts/:id/balance', function(req,res) {
		var result = {};
		var statusCode = 200;
		var accounts = require(DATA_ROOT + 'accounts.json');
		if (statusCode == 200){
			var acceptType = req.accepts(['application/json']);
			var account = accounts.filter(
						function (arg) {
							return arg.id === req.params.id;
						}
			);
		}
		result = account[0];
		// compute balance
		var transactions = {};
		try {
				transactions = require(DATA_ROOT + req.params.id + '.json');
		}
		catch (error) {
				// probably module not found, that's ok, no transactions..
				transactions = [];
		}
		if (transactions.length > 0)
		{
			var txns = transactions;
			var balance = 0;
			for (var i=0; i < txns.length; ++i) {
					balance += txns[i].amount;
			}
		}
		else
		{
		  var balance = 0;
		}
		result.balance = Number(balance).toFixed(2);
		if (result.type === 'credit card') {
			result.limit = result.limit + balance;
		}
		res.send(statusCode, result);
	});

};
