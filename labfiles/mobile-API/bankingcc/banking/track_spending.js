"use strict";

var log4js = require('log4js');
var logger = log4js.getLogger();
var moment = require('moment');

var AccountService = require('./AccountService');

module.exports = {

    metadata: function metadata() {
        return {
            "name": "TrackSpending",
            "properties": {
                "spendingCategory": { "type": "string", "required": true },
                "date": { "type": "string", "required": false },
                "durationStart": { "type": "string", "required": false},
                "durationEnd": { "type": "string", "required": false}
            },
            "supportedActions": []
        };
    },

    invoke: (conversation, done) => {
        var spendingCategory = conversation.properties().spendingCategory;
        var mobileSdk = conversation.mobileSdk;

        // Only expect date OR duration to be present, not both; this
        // is a result of how the entity detection is currently working.
        // For example: "yesterday" or "June 2nd" will be detected as a DATE,
        // but "last week" or "June" will be detected as a DURATION.
        var date = conversation.properties().date;
        var durationStart = conversation.properties().durationStart;
        var durationEnd = conversation.properties().durationEnd;

        var durationFilter = undefined;

        // BUGBUG: workaround for https://jira.oraclecorp.com/jira/browse/MIECS-2748
        date = date.startsWith('${') ? null : date;
        durationStart = durationStart.startsWith('${') ? null : durationStart;
        durationEnd = durationEnd.startsWith('${') ? null : durationEnd;

        if (spendingCategory) {
            spendingCategory = spendingCategory.toLowerCase();
        }

        logger.debug('TrackSpending: getting txns for category=' + spendingCategory + ' date=' + date + ' durationStart=' + durationStart + ' durationEnd=' + durationEnd);

        if (date) {
            // So far, only individual days are detected as DATE.  More fine-grained
            // DATE values are possible, but not particularly meaningful, so we just
            // treat all DATE values as meaning "duration of the day that the DATE
            // falls within".
            durationFilter = {
                from: moment(date).startOf('day'),
                to: moment(date).endOf('day')
            };
        }

        if (durationStart && durationEnd) {
            durationFilter = {
                from: moment(Number.parseInt(durationStart, 10)),
                to: moment(Number.parseInt(durationEnd, 10))
            };
        }

        var getAccounts = AccountService.accounts(mobileSdk, 'credit card');
        getAccounts
        .then(function(accounts){
            if (accounts.length > 0) {
                var account = accounts[0];
                var categoryBalance = account.balance({ category: spendingCategory, duration: durationFilter });
                conversation.reply({ text: '$' + -categoryBalance + '을 ' + spendingCategory + '에 사용 하셨습니다!!'});
            } else {
                logger.debug('TrackSpending: no accounts of specified type found!');
                conversation.reply({ text: '죄송합니다, ' + accountType + ' 라는 계좌가 없습니다!' });
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
