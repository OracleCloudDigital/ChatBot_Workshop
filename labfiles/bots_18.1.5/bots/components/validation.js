"use strict";
const Joi = require('joi');
const MessageModel = require("../MessageModel")(Joi);
var step = 0;
var name ;
var company ;
var dept ;
var gender ;
var age ;

module.exports = {
    metadata: () => (
        {
            'name': 'validation',
            'properties': {
            },
            'supportedActions': [],
        }
    ),

    invoke: (conversation, done) => {

        var genders =  [
                  {
                    "postback": {
                      "action": "여성",
                      "state": "list"
                    },
                    "label": "여성",
                    "type": "postback"
                  },
                  {
                    "postback": {
                      "action": "남성",
                      "state": "list"
                    },
                    "label": "남성",
                    "type": "postback"
                  }
        ];


        if (step == 0) {
            conversation.reply(MessageModel.textConversationMessage("이름을 입력해주세요"));
            step = 1;
        } else if (step == 1) {
            name = conversation.text() == null ? "" : conversation.text().trim();
            conversation.reply(MessageModel.textConversationMessage("소속회사명을 입력해주세요"));
            step = 2;
        } else if (step == 2) {
            company = conversation.text() == null ? "" : conversation.text().trim();
            conversation.reply(MessageModel.textConversationMessage("부서명을 입력해주세요"));
            step = 3;
        } else if (step == 3 ) {
            dept = conversation.text() == null ? "" : conversation.text().trim();
            conversation.reply(MessageModel.textConversationMessage("성별을 입력해주세요", genders));
            step = 4
        } else if (step == 4) {
            gender = conversation.text() == null ? "" : conversation.text().trim();
            if (gender == "" ) {
                gender = conversation.postback().action;
            }
            console.log("gender ===== ", gender);
            conversation.reply(MessageModel.textConversationMessage("나이를 입력해 주세요"));
            step = 5;
        } else if (step == 5) {
            age = conversation.text() == null ? "" : conversation.text().trim();
            conversation.reply(MessageModel.textConversationMessage("입력하신 값은 다음과 같습니다. \n이름 : " + name  ));
            conversation.reply(MessageModel.textConversationMessage("소속회사명 : " + company  ));
            conversation.reply(MessageModel.textConversationMessage("부서명 : " + dept  ));
            conversation.reply(MessageModel.textConversationMessage("성별 : " + gender  ));
            conversation.reply(MessageModel.textConversationMessage("나이 : " + age  ));
            conversation.transition();
            conversation.keepTurn(true);
            step = 0;
        } else {
            conversation.reply(MessageModel.textConversationMessage("입력이 적당하지 않습니다. 다음에 다시 진행해 주세요"));
            conversation.transition();
            conversation.keepTurn(true);
            step = 0;
        }

    done();

    }
};

