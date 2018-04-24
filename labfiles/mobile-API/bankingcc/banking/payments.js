"use strict";

var log4js = require('log4js');
var logger = log4js.getLogger();

var AccountService = require('./AccountService');

module.exports = {

    metadata: function metadata() {
        return {
            "name": "Payments",
            "properties": {
                "fromAccountType": { "type": "string", "required": true },
                "toAccount": { "type": "string", "required": true },
                "amount": { "type": "CURRENCY", "required": true },
                "date": { "type": "string" },
                "recurrence": { "type": "string" }
            },
            "supportedActions": []
        };
    },

    invoke: (conversation, done) => {
        var fromAccountType = conversation.properties().fromAccountType;
        var toAccount = conversation.properties().toAccount;
        var amount = conversation.properties().amount;
        var mobileSdk = conversation.mobileSdk;
        logger.debug('Payments: sending payment amount sdk ' + JSON.stringify(conversation.properties()));
        var paymentBody = {};
        paymentBody.type = "payment";
        paymentBody.description = "Payment for " + toAccount;
        paymentBody.fromAccountType = fromAccountType.toLowerCase();
        paymentBody.toAccount =  toAccount;
        var ind = amount.indexOf(" ");
        if (ind > -1)
          paymentBody.amount = Number(amount.substring(0,ind)) * -1;
        else {
          paymentBody.amount = Number(amount) * -1;
        }
        var temp =    conversation;

        var getAccounts = AccountService.accounts(mobileSdk, fromAccountType);


        getAccounts
        .then(function(accounts){
          console.log(accounts);
          if (accounts.length > 0) {
              var account = accounts[0];
             logger.debug('Body Payment : ' + JSON.stringify(paymentBody));

             mobileSdk.custom.BankingApi.post('accounts/' + account.id + '/transactions', paymentBody, {inType: 'json'}, null).then(
                function (result) {
                    logger.debug('Payments: sending payment fromAccountType ' + fromAccountType + ' toAccount=' + toAccount + ' amount=' + amount);
                    conversation.reply({ text: '요청 하신 금액인, ' + amount + '을 ' + fromAccountType + '로 부터' + toAccount + '으로 송금 했습니다.' });
                    conversation.transition();
                    done();
                },
                function (error) {
                  conversation.reply({ text: '요청 하신 금액인, ' + amount + '을 ' + fromAccountType + '로 부터' + toAccount + '으로 보낼 수 없습니다.'});
                  conversation.transition();
                  done();
                }
             )
          } else {
              conversation.reply({ text: '죄송합니다 ' + fromAccountType + '라는 계좌가 존재하지 않습니다!' });
              conversation.transition();
              done();
          }
        })
        .catch(function(e) {
          console.log(e);
          conversation.reply({ text: '죄송합니다. 계좌가 없습니다.' });
          conversation.transition();
          done();
        });
    }
};
