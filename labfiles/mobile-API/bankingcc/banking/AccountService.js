"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var log4js = require('log4js');
var logger = log4js.getLogger();

var moment = require('moment');
var Promise = require('bluebird');

var DATA_ROOT = './data/';

function roundToTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
}

var ACCOUNTS_BASE = {
    netBalance: function netBalance() {
        var net = 0.0;
        this.forEach(function (account) {
            net += account.balance();
        });
        return roundToTwo(net);
    }
};

//var ACCOUNTS = Object.assign(require(DATA_ROOT + 'accounts.json'), ACCOUNTS_BASE);
var PAYMENT_ACCOUNTS = require(DATA_ROOT + 'paymentAccounts.json');

/*

filter is:
{
  type:
  category:
  duration:
}
Duration is:
{
  from: "date string",
  to: "date string"
}
*/

var ACCOUNT_BASE = {
    balance: function balance(filter) {
        var txns = this.filterTransactions(filter);
        var balance = 0.0;
        for (var i = 0; i < txns.length; ++i) {
            balance += txns[i].amount;
        }
        return roundToTwo(balance);
    },

    largestTxn: function largestTxn(filter) {
        var txns = this.filterTransactions(filter);
        var largest = 0;
        for (var i = 0; i < txns.length; ++i) {
            if (Math.abs(txns[i].amount) > Math.abs(txns[largest].amount)) {
                largest = i;
            }
        }
        return txns[largest];
    },

    lastNTxns: function lastNTxns(n, filter) {
        var txns = this.filterTransactions(filter);
        return txns.slice(-n);
    },

    filterTransactions: function filterTransactions(filter) {
        var _this = this;

        if (filter === undefined) return this.transactions;

        var filtered = [];

        var _loop = function _loop(i) {
            var txn = _this.transactions[i];
            // test the txn against all keys (conditions) in the filter
            var includeTxn = true;
            Object.keys(filter).forEach(function (key) {
                if (key === 'duration' && filter.duration) {
                    logger.debug('AccountService: filterTransactions applying duration=' + JSON.stringify(filter.duration));
                    if (!moment(txn.date).isBetween(filter.duration.from, filter.duration.to, null, '[]')) {
                        includeTxn = false;
                    }
                } else {
                    if (txn[key] !== filter[key]) {
                        includeTxn = false;
                    }
                }
            });
            if (includeTxn) {
                filtered.push(txn);
            }
        };

        for (var i = 0; i < this.transactions.length; ++i) {
            _loop(i);
        }
        return filtered;
    },

    remainingLimit: function remainingLimit() {
        return this.type === 'credit card' ? this.limit + this.balance() : undefined;
    }
};

module.exports = {
    accounts: function accounts(mobileSdk, type) {

        return mobileSdk.custom.BankingApi.get('accounts', null, null).then(
            function (result) {
                var accountArray= JSON.parse(result.result);
                logger.debug('BankingAPI GET Accounts: ' + JSON.stringify(accountArray));

                var accountList = Object.assign(accountArray, ACCOUNTS_BASE);

                // Populate this variable with account objects that have had their txn's loaded
                var accountsWithTxns = [];

                // Iterate over all accounts
                return Promise.each(accountList, function (account, index, length) {
                    // returning a promise here (from the .each()'s iterator fn) means the
                    // next iteration doesn't start until this promise is resolved
                    return mobileSdk.custom.BankingApi.get('accounts/' + account.id + '/transactions', null, null).then(
                        function(transactions) {
                            var transArray= JSON.parse(transactions.result);
                            account.transactions = transArray;
                            logger.debug('AccountService Transactions for Account ' + account.id + ' : ' + JSON.stringify(transArray));
                            // Store the processed account for later return
                            //accountsWithTxns.push(account);
                            accountsWithTxns.push(Object.assign(Object.create(ACCOUNT_BASE), account));

                            // doesn't matter what we return here, the resolved value for the
                            // iterator fn isn’t used by .each().
                            return;
                    });
                }).then( function(r) {
                    // ..all accounts have been had their txns added since .each() has completed
                    if (type !== undefined) {
                      var _ret2 = function () {
                      var filteredAccounts = Object.assign([], ACCOUNTS_BASE);
                      accountsWithTxns.forEach(function (current) {
                          if (current.type === type.toLowerCase()) {
                              filteredAccounts.push(current);
                          }
                      });
                      return {
                          v: filteredAccounts
                      };
                      }();

                      if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
                    }
                    return accountsWithTxns;
                });
          });
    },
    paymentAccounts: function paymentAccounts() {
        return PAYMENT_ACCOUNTS;
    }
};
