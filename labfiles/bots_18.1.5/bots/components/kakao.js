"use strict";
const Joi = require('joi');
const MessageModel = require("../MessageModel")(Joi);

module.exports = {
    metadata: () => (
        {
            'name': 'kakaomessage',
            'properties': {
                'msgtype': {'type': 'string', 'required': true},
            },
            'supportedActions': [],
        }
    ),

    invoke: (conversation, done) => {
        let msgtype = conversation.properties().msgtype;
        let input = conversation.text() == null ? "" : conversation.text().trim();

        console.log("msgtype",msgtype);
        console.log("input   ",input);

        console.log("kakao message start ===");
        conversation.transition();

        let photo = MessageModel.photoObject("https://akamai.pizzahut.co.kr/images/products/top/P_RG_GB_1.jpg", 640, 480);
        let message_button = MessageModel.message_buttonObject("주유 쿠폰받기", "http://www.naver.com");
        let buttons = ["버튼1", "버튼2","버튼3"];

        if (msgtype == "1") {
           conversation.reply(MessageModel.kakaoConversationMessage("단순 텍스트 메시지 입니다.\n 멀티 라인 지원합니다.\n★ ● ◐ ◑ ☎ ♠ ♥ 【 】 ■ ▣ ▲ ▶ ▼ ◆ ◈ ♣ ♩ ♪ ☞ ♬ 》 – • ※ ⊙ \n이런것 들은 지원하네요"));
        }
        else if (msgtype == "2") {
           conversation.reply(MessageModel.kakaoConversationMessage(null, photo));
        }
        else if (msgtype == "3") {
            conversation.reply(MessageModel.kakaoConversationMessage("이미지와 메시지 버튼이 있는 포맷입니다", photo, message_button));
        }
        else if (msgtype == "4") {
            let keyboard = MessageModel.keyboardObject(buttons);
            conversation.reply(MessageModel.kakaoConversationMessage("키보드 버튼까지 있는 포맷입니다.", photo, message_button, keyboard));
        } else {
            conversation.reply(MessageModel.kakaoConversationMessage("포맷 선택이 안된것 같네요"));  
        }


    done();

    }
};

