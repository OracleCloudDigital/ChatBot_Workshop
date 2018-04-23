"use strict";

var log4js = require('log4js');
var logger = log4js.getLogger();

var AccountService = require('./AccountService');

module.exports = {

    metadata: function metadata() {
        return {
            "name": "BalanceRetrieval",
            "properties": {
                "accountType": { "type": "string", "required": true }
            },
            "supportedActions": []
        };
    },

    invoke: (conversation, done) => {
      var accountType = conversation.properties().accountType;
      logger.debug('BalanceRetrieval: getting balance for account type=' + accountType);

      var mobileSdk = conversation.mobileSdk;
      var getAccounts = AccountService.accounts(mobileSdk, accountType);
      getAccounts
      .then(function(accounts){
        console.log(accounts);
        if (accounts.length > 0) {
            var account = accounts[0];
            logger.debug('BalanceRetrieval: account id ' + account.id + ' balance=' + account.balance());
            conversation.reply({ text:  accountType + '의 (' + account.id + ') 잔액은 $' + String(account.balance()) + '입니다' });
            if (accountType === 'credit card') {
                conversation.reply({ text: '신용카드의 한도 잔여액은 $' + String(account.remainingLimit()) + '입니다.'});
            }
        } else {
            logger.debug('BalanceRetrieval: no accounts of specified type found!');
            conversation.reply({ text: '죄송합니다, ' + accountType + '라는 계좌가 존재하지 않습니다!' });
        }
        conversation.transition();
        done();

      })
      .catch(function(e) {
        console.log(e);
        conversation.transition();
        done();
      });

    }
};
