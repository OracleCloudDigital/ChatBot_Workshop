"use strict"

module.exports = {

    metadata: () => ({
        "name": "Text",
        "properties": {
        },
        "supportedActions": [
        ]
    }),

    invoke: (conversation, done) => {

        conversation.reply({ text: 'text 입니다' });
        
        conversation.transition();

        done();
    }
};
