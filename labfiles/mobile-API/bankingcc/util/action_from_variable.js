"use strict"

var log4js = require('log4js');
var logger = log4js.getLogger();

module.exports = {

    metadata: () => ({
        "name": "ActionFromVariable",
        "properties": {
            "variable": { "type": "string", "required": true }
        },
        "supportedActions": [
        ]
    }),

    invoke: (conversation, done) => {
        logger.info('ActionFromVariable: var=' + conversation.properties().variable);
        var value = conversation.variable(conversation.properties().variable);
        logger.info('ActionFromVariable: setting action=' + value);
        conversation.transition(value);
        done();
    }
};
