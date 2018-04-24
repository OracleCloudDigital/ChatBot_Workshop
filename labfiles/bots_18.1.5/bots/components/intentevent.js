"use strict";
const Joi = require('joi');
const MessageModel = require("../MessageModel")(Joi);

module.exports = {
    metadata: () => (
        {
            'name': 'intentevent',
            'properties': {
                'nlpVariable': {'type': 'string', 'required': true},
                'confidenceThreshold': {'type': 'number', 'required': true},
            },
            'supportedActions': [],
        }
    ),

    invoke: (conversation, done) => {
        let nlpVariable = conversation.properties().nlpVariable;
        let nlpResult = conversation.variable(nlpVariable);

        let confidenceThreshold = conversation.properties().hasOwnProperty('confidenceThreshold') ?
        conversation.properties().confidenceThreshold : 0.6;      

        let intent = nlpResult.intentMatches.detail.final_norm[0].intent;
        // current intent confidence!
        let score = nlpResult.intentMatches.detail.final_norm[0].score;
        let query = nlpResult.query;
        let createdon = nlpResult.timeStamp;
        let botName = nlpResult.botName;


        if ((Math.round(score * 100) < Math.round(confidenceThreshold * 100))) {
            intent = 'unresolvedIntent'; // nothing to set!
        }

                /*
        var quote = require('quote');
        
                if ((Math.round(score * 100) < Math.round(confidenceThreshold * 100))) {
                    intent = 'unresolvedIntent'; // nothing to set!
                }
        

                logger.info(quote(query), ',', 
                           quote(intent), ',', 
                           quote(Math.round(score * 100)), ',' , 
                           new Date(createdon), ',' , 
                           quote(conversation.tenantId()), ',',
                           quote(botName), ',',
                           conversation.channelType()
                        );
                */
        console.log(intent);
        conversation.action(intent);
        conversation.transition();

        postEvent(
            conversation.oracleMobile.analytics,
            conversation.sessionId(),
            intent,
            intent,
            (Math.round(score * 100)).toString(),
            conversation.tenantId(),
            botName,
            conversation.channelType(),
            query
        ).then(
            function (result) {
                console.log(result);
                done();
            },
            function (error) {
                console.warn('IntentEvent: error posting analytics.',
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
var postEvent = function (analytics, sessionID, eventName, intentValue,scoreValue, tenantIdValue, botNameValue, channelTypeValue, queryValue ) {
    const timestamp = (new Date()).toISOString();
    return postCustomAnalyticEvents(
        analytics,
        sessionID,
        {
            "name": eventName,
            "type": "custom",
            "timestamp": timestamp,
            "sessionID" : sessionID,
            "properties": { intent : intentValue ,
                            score : scoreValue,
                            tenantid : tenantIdValue,
                            botname : botNameValue,
                            channeltype : channelTypeValue,
                            query : queryValue
                          } // custom values must be passed as String
        },
        timestamp
    );
};

/**
 * Posts custom analytics events.
 * @param {object} analytics the custom code SDK analytics object,
    usually obtained from conversation.oracleMobile.analytics
 * @param {object} customEvents either a single custom event 
    object or an Array of custom event objects
 * @param {string} sessionStartTimestamp ISO formated String
    representation of a Date object
 * @param {string} [sessionEndTimestamp] ISO formated String
    representation of a Date object
 * @returns {object} a Promise
 */
var postCustomAnalyticEvents = function (analytics, sessionID, customEvents, 
                                         sessionStartTimestamp, sessionEndTimestamp ) {
    const events = [];
    events.push(
        {
            "name": "sessionStart",
            "type": "system",
            "timestamp": sessionStartTimestamp,
            "sessionID" : sessionID
        }
    );
    Array.isArray(customEvents) ? Array.prototype.push.apply(events, customEvents) : events.push(customEvents);
    events.push(
        {
            name: "sessionEnd",
            type: "system",
            "timestamp": sessionEndTimestamp ? sessionEndTimestamp : sessionStartTimestamp,
            "sessionID" : sessionID
        }
    );
    return analytics.postEvent(events);
};