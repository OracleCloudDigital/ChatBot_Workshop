"use strict"

var log4js = require('log4js');
var logger = log4js.getLogger();

module.exports = {

    metadata: () => ({
        "name": "ConditionalIsNull",
        "properties": {
            "variable": { "type": "string", "required": true }
        },
        "supportedActions": [
            "isnull",
            "isnotnull"
        ]
    }),

    invoke: (conversation, done) => {
        logger.info('ConditionalIsNull: ' + conversation.properties().variable);

        var value = conversation.variable(conversation.properties().variable);
        logger.info('ConditionalIsNull: checking value=' + value);
        if (value != null)
            conversation.transition("isnotnull");
        else
            conversation.transition("isnull");

        done();
    }
};
