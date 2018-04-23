"use strict";
const Joi = require('joi');
const MessageModel = require("../MessageModel")(Joi);

var log4js = require('log4js');
var logger = log4js.getLogger();
var moment = require('moment');


module.exports = {

    metadata: function metadata() {
        return {
            "name": "HotelList",
            "properties": {
            },
            "supportedActions": []
        };
    },

    invoke: (conversation, done) => {

        var mobileSdk = conversation.mobileSdk;
        var cards = [];
        mobileSdk.connectors.get("hotelServiceConnector", "sample").then(
            function (result) {
                var outputMsg = JSON.parse(result.result);
                for(var i = 0; i < outputMsg.length; i++) {
                    var obj = outputMsg[i];

                    var action = MessageModel.urlActionObject('Open', obj.image, null);                    
                    var card = MessageModel.cardObject(obj.title, obj.description, obj.image, null, [action] );
                    cards.push(card);
                }

                var message =  MessageModel.cardConversationMessage("horizontal", cards);
                conversation.reply(JSON.stringify(message));
                conversation.reply(message);

                conversation.transition();
                done();  

            },function (error) {

                conversation.reply({ text: "REST API가 현재 응답하지 않아요."});
                conversation.transition();
                done();
            }
        )
            

    }
};