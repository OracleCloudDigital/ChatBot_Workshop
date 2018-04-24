"use strict";
const Joi = require('joi');
const MessageModel = require("../MessageModel")(Joi);

module.exports = {
    metadata: () => (
        {
            'name': 'postevent',
            'properties': {
                'eventname': {'type': 'string', 'required': true},
                'eventtype': {'type': 'string', 'required': true},
            },
            'supportedActions': [],
        }
    ),

    invoke: (conversation, done) => {
        let eventname = conversation.properties().eventname;
        let eventtype = conversation.properties().eventtype;

        conversation.transition();
        conversation.keepTurn(true);
        console.log("eventname : ", eventname);
        console.log("sessionId : ", conversation.sessionId());      

        postEvent(
            conversation.oracleMobile.analytics,
            conversation.sessionId(),
            eventname,
            eventtype
        ).then(
            function (result) {
                console.log(result);
                done();
            },
            function (error) {
                console.warn('postevent: error posting analytics.',
                                error.statusCode, error.error);
                done();
            }
        );            
    }
};

/**
 * Posts a single custom analytics event, with a single custom property.
 * @param {object} analytics the custom code SDK analytics object,
    usually obtained from conversation.oracleMobile.analytics
 * @param {string} eventName the name of the custom event
 * @param {string} customProperty the name of the custom property
 * @param {string} customValue the value of the custom property
 * @returns {object} a Promise
 */
var postEvent = function (analytics, sessionID, eventName,eventtype) {
    const timestamp = (new Date()).toISOString();

    const events = [];
    events.push(
        {
            "name": eventName,
            "type": eventtype,
            "timestamp": timestamp,
            "sessionID" : sessionID
        }
    );
    ;
    return analytics.postEvent(events);

};